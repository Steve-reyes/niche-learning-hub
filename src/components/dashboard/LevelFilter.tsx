"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DifficultyLevel } from "@/lib/types";

const LEVELS: { key: DifficultyLevel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "beg", label: "Beginner" },
  { key: "int", label: "Intermediate" },
  { key: "adv", label: "Advanced" },
];

interface LevelFilterProps {
  value: DifficultyLevel | "all";
  onChange: (v: DifficultyLevel | "all") => void;
}

export function LevelFilter({ value, onChange }: LevelFilterProps) {
  return (
    <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
      {LEVELS.map((l) => (
        <button
          key={l.key}
          onClick={() => onChange(l.key)}
          className={cn(
            "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
            value === l.key
              ? "bg-[var(--color-accent)] text-white shadow-sm"
              : "glass text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
