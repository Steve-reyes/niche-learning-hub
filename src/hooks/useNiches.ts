import { useState, useEffect, useCallback } from "react";
import { niches as staticNiches, getNicheById as getStaticNiche } from "@/lib/data";
import { loadCustomNiches, saveCustomNiche, updateCustomNiche, deleteCustomNiche, generateNicheId } from "@/lib/storage";
import type { Niche, Resource } from "@/lib/types";

export function useNiches() {
  const [customNiches, setCustomNiches] = useState<Niche[]>([]);

  useEffect(() => {
    setCustomNiches(loadCustomNiches());
  }, []);

  const allNiches = [...staticNiches, ...customNiches];

  const getNicheById = useCallback(
    (id: string) => {
      return allNiches.find((n) => n.id === id);
    },
    [allNiches]
  );

  const addNiche = useCallback(
    (niche: Niche) => {
      saveCustomNiche(niche);
      setCustomNiches(loadCustomNiches());
    },
    []
  );

  const removeNiche = useCallback(
    (id: string) => {
      deleteCustomNiche(id);
      setCustomNiches(loadCustomNiches());
    },
    []
  );

  const updateNiche = useCallback(
    (id: string, updates: Partial<Niche>) => {
      updateCustomNiche(id, updates);
      setCustomNiches(loadCustomNiches());
    },
    []
  );

  return { allNiches, customNiches, getNicheById, addNiche, removeNiche, updateNiche };
}
