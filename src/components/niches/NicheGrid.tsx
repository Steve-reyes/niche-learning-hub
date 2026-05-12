"use client";

import { NicheCard } from "./NicheCard";
import type { Niche } from "@/lib/types";

interface NicheGridProps {
  niches: Niche[];
  onSelect: (id: string) => void;
}

export function NicheGrid({ niches, onSelect }: NicheGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
      {niches.map((niche, i) => (
        <NicheCard
          key={niche.id}
          niche={niche}
          index={i}
          onClick={() => onSelect(niche.id)}
        />
      ))}
    </div>
  );
}