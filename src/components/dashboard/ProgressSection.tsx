"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import type { Niche } from "@/lib/types";

interface ProgressSectionProps {
  niche: Niche;
}

export function ProgressSection({ niche }: ProgressSectionProps) {
  const { isCompleted, isDisabled } = useProgress();
  const active = niche.res.filter((r) => !isDisabled(r.u));
  const total = active.length;
  const done = active.filter((r) => isCompleted(r.u)).length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mb-6 rounded-xl p-4"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
          Progress
        </span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {done}/{total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-[var(--color-accent)]"
        />
      </div>
    </motion.div>
  );
}
