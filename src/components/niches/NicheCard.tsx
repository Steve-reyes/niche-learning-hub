"use client";

import { motion } from "framer-motion";
import type { Niche } from "@/lib/types";
import { ICON_EMOJIS } from "@/lib/icons";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AdminContext";

interface NicheCardProps {
  niche: Niche;
  onClick: () => void;
  index: number;
}

export function NicheCard({ niche, onClick, index }: NicheCardProps) {
  const { isAuthenticated } = useAuth();

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to enroll in ${niche.n}?`)) {
      onClick();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="glass group relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center shadow-sm transition-all duration-300 hover:shadow-lg sm:gap-3 sm:p-5"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all duration-300 group-hover:scale-110 sm:h-11 sm:w-11 sm:text-lg"
        style={{ background: `${niche.c}15` }}
      >
        <span role="img" aria-label={niche.n}>
          {ICON_EMOJIS[niche.icon] || "📚"}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="text-xs font-semibold leading-tight text-[var(--color-text-primary)] sm:text-sm">
          {niche.n}
        </h3>
        <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--color-text-tertiary)] line-clamp-2 sm:text-[11px]">
          {niche.tag}
        </p>
      </div>

      {isAuthenticated && (
        <span
          onClick={handleEnroll}
          className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1 text-[10px] font-semibold text-white opacity-100 shadow-sm transition-all duration-200 hover:bg-[var(--color-accent-hover)] sm:px-3.5 sm:py-1.5 sm:text-xs sm:opacity-0 sm:group-hover:opacity-100"
        >
          <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Enroll Now
        </span>
      )}

      <div className="absolute bottom-2 right-2 rounded-md bg-[var(--color-accent-subtle)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--color-accent)] opacity-100 transition-opacity sm:bottom-3 sm:right-3 sm:text-[9px] sm:opacity-0 sm:group-hover:opacity-100">
        {niche.res.length}
      </div>
    </motion.button>
  );
}