"use client";

import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import type { Resource, ResourceCategory, DifficultyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "border-l-red-400/50",
  Coursera: "border-l-blue-400/50",
  Alison: "border-l-purple-400/50",
  HubSpot: "border-l-orange-400/50",
  Google: "border-l-blue-300/50",
  Spotify: "border-l-green-400/50",
};

const DIFF_LABELS: Record<DifficultyLevel, string> = {
  beg: "Beginner",
  int: "Intermediate",
  adv: "Advanced",
};

const COST_LABELS: Record<string, string> = {
  free: "Free",
  audit: "Audit",
  cert: "Cert",
  trial: "Trial",
};

interface ResourceCardProps {
  resource: Resource;
  index: number;
  category: ResourceCategory;
}

export function ResourceCard({ resource, index, category }: ResourceCardProps) {
  const { isCompleted, toggleComplete } = useProgress();
  const done = isCompleted(resource.u);

  return (
    <motion.a
      href={resource.u}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.25 }}
      whileHover={{ y: -2 }}
      className={cn(
        "glass group relative flex flex-col rounded-xl p-4 transition-all duration-200 hover:shadow-md",
        done && "border-l-[3px] border-l-[var(--color-green)]",
        !done && PLATFORM_COLORS[resource.p]
      )}
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
          {resource.p}
        </span>
        {resource.d && (
          <span className="text-[11px] text-[var(--color-text-tertiary)]">
            {resource.d}
          </span>
        )}
        {category === "courses" && resource.cost && (
          <span className="rounded-md bg-[var(--color-accent-subtle)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--color-accent)]">
            {COST_LABELS[resource.cost] || resource.cost}
          </span>
        )}
      </div>

      <h3 className="mb-1 text-sm font-semibold leading-snug text-[var(--color-text-primary)]">
        {resource.t}
      </h3>
      <p className="mb-3 flex-1 text-xs leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">
        {resource.desc}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="rounded-md bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--color-text-tertiary)]">
          {DIFF_LABELS[resource.lv]}
        </span>
        <div className="flex items-center gap-2">
          <ExternalLink className="h-3 w-3 text-[var(--color-text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleComplete(resource);
            }}
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
              done
                ? "border-[var(--color-green)] bg-[var(--color-green)]"
                : "border-[var(--color-text-tertiary)] hover:border-[var(--color-green)]"
            )}
          >
            {done && <Check className="h-3.5 w-3.5 text-white" />}
          </button>
        </div>
      </div>
    </motion.a>
  );
}
