"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { LevelFilter } from "./LevelFilter";
import { TabNavigation } from "./TabNavigation";
import { ResourceGrid } from "./ResourceGrid";
import { ProgressSection } from "./ProgressSection";
import { useProgress } from "@/context/ProgressContext";
import type { Niche, ResourceCategory, DifficultyLevel } from "@/lib/types";
import { ICON_EMOJIS } from "@/lib/icons";

interface DashboardProps {
  niche: Niche;
  onBack: () => void;
}

export function Dashboard({ niche, onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<ResourceCategory>("start");
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | "all">("all");
  const { isDisabled } = useProgress();

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of niche.res) {
      if (isDisabled(r.u)) continue;
      counts[r.cat] = (counts[r.cat] || 0) + 1;
    }
    return counts as Record<ResourceCategory, number>;
  }, [niche, isDisabled]);

  const filtered = useMemo(() => {
    return niche.res.filter((r) => {
      if (isDisabled(r.u)) return false;
      if (r.cat !== activeTab) return false;
      if (levelFilter !== "all" && r.lv !== levelFilter) return false;
      return true;
    });
  }, [niche, activeTab, levelFilter, isDisabled]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={niche.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-10 sm:w-10 sm:text-lg"
            style={{ background: `${niche.c}15` }}
          >
            {ICON_EMOJIS[niche.icon] || "📚"}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[var(--color-text-primary)] sm:text-lg truncate">
              {niche.n}
            </h2>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {niche.res.filter((r) => !isDisabled(r.u)).length} resources
            </p>
          </div>
        </div>

        <ProgressSection niche={niche} />
        <LevelFilter value={levelFilter} onChange={setLevelFilter} />
        <TabNavigation
          value={activeTab}
          onChange={setActiveTab}
          counts={tabCounts}
        />
        <ResourceGrid resources={filtered} category={activeTab} />
      </motion.div>
    </AnimatePresence>
  );
}