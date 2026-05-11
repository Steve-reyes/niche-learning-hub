"use client";

import { cn } from "@/lib/utils";
import type { ResourceCategory } from "@/lib/types";

const TABS: { key: ResourceCategory; label: string }[] = [
  { key: "start", label: "Start Here" },
  { key: "tools", label: "Tools" },
  { key: "courses", label: "Courses" },
  { key: "read", label: "Read & Listen" },
  { key: "clients", label: "Clients" },
];

interface TabNavigationProps {
  value: ResourceCategory;
  onChange: (v: ResourceCategory) => void;
  counts: Record<ResourceCategory, number>;
}

export function TabNavigation({ value, onChange, counts }: TabNavigationProps) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--color-border)] pb-px">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors duration-200",
            value === tab.key
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          )}
        >
          {tab.label}
          <span className="rounded-md bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-tertiary)]">
            {counts[tab.key] || 0}
          </span>
          {value === tab.key && (
            <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-accent)]" />
          )}
        </button>
      ))}
    </div>
  );
}
