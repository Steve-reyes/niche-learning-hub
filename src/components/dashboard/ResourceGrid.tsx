"use client";

import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/lib/types";

interface ResourceGridProps {
  resources: Resource[];
  category: string;
}

export function ResourceGrid({ resources, category }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
        <p className="text-sm font-medium text-[var(--color-text-tertiary)]">
          No resources found.
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)]/60">
          Try a different filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((r, i) => (
        <ResourceCard
          key={`${r.u}-${i}`}
          resource={r}
          index={i}
          category={category as any}
        />
      ))}
    </div>
  );
}