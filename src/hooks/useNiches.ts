"use client";

import { useState, useEffect, useCallback } from "react";
import type { Niche, Resource } from "@/lib/types";

interface NicheDTO {
  id: string;
  name: string;
  icon: string;
  color: string;
  tag: string;
  disabled?: boolean;
  resources?: ResourceDTO[];
  _count?: { resources: number };
}

interface ResourceDTO {
  id: string;
  nicheId: string;
  title: string;
  platform: string;
  duration: string;
  category: string;
  level: string;
  url: string;
  description: string;
  cost: string;
  bestPick: number;
  disabled: boolean;
}

function mapNiche(dto: NicheDTO): Niche {
  return {
    id: dto.id,
    n: dto.name,
    icon: dto.icon,
    c: dto.color,
    tag: dto.tag,
    disabled: dto.disabled,
    res: (dto.resources || []).map(mapResource),
  };
}

function mapResource(r: ResourceDTO): Resource {
  return {
    t: r.title,
    p: r.platform,
    d: r.duration,
    cat: r.category as any,
    lv: r.level as any,
    u: r.url,
    desc: r.description,
    cost: (r.cost || undefined) as any,
    bp: r.bestPick || undefined,
  };
}

export function useNiches() {
  const [allNiches, setAllNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNiches = useCallback(async () => {
    try {
      const res = await fetch("/api/niches");
      if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
      const data: NicheDTO[] = await res.json();
      const full: Niche[] = await Promise.all(
        data.map(async (n) => {
          const detail = await fetch(`/api/niches/${n.id}`).then((r) => { if (!r.ok) throw new Error(`API ${r.status}`); return r.json(); });
          return mapNiche(detail);
        })
      );
      setAllNiches(full);
    } catch (e) {
      console.error("Failed to fetch niches", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNiches();
  }, [fetchNiches]);

  const getNicheById = useCallback(
    (id: string) => allNiches.find((n) => n.id === id) || null,
    [allNiches]
  );

  const addNiche = useCallback(
    async (niche: Niche) => {
      try {
        await fetch("/api/niches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: niche.id,
            name: niche.n,
            icon: niche.icon,
            color: niche.c,
            tag: niche.tag,
          }),
        });
        await fetchNiches();
      } catch (e) {
        console.error("Failed to add niche", e);
      }
    },
    [fetchNiches]
  );

  const removeNiche = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/niches/${id}`, { method: "DELETE" });
        await fetchNiches();
      } catch (e) {
        console.error("Failed to delete niche", e);
      }
    },
    [fetchNiches]
  );

  const updateNiche = useCallback(
    async (id: string, updates: Partial<Niche>) => {
      try {
        await fetch(`/api/niches/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        await fetchNiches();
      } catch (e) {
        console.error("Failed to update niche", e);
      }
    },
    [fetchNiches]
  );

  return { allNiches, loading, getNicheById, addNiche, removeNiche, updateNiche };
}
