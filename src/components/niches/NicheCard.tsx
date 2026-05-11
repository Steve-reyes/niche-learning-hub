"use client";

import { motion } from "framer-motion";
import type { Niche } from "@/lib/types";
import { ICON_EMOJIS } from "@/lib/icons";

interface NicheCardProps {
  niche: Niche;
  onClick: () => void;
  index: number;
}

export function NicheCard({ niche, onClick, index }: NicheCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="glass group flex flex-col items-center gap-3 rounded-2xl p-5 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-all duration-300 group-hover:scale-110"
        style={{ background: `${niche.c}15` }}
      >
        <span role="img" aria-label={niche.n}>
          {ICON_EMOJIS[niche.icon] || "📚"}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold leading-tight text-[var(--color-text-primary)]">
          {niche.n}
        </h3>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">
          {niche.tag}
        </p>
      </div>
      <div className="absolute bottom-3 right-3 rounded-md bg-[var(--color-accent-subtle)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
        {niche.res.length}
      </div>
    </motion.button>
  );
}
