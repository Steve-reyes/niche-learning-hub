"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ExternalLink, Search, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { useNiches } from "@/hooks/useNiches";
import { ICON_EMOJIS } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useProgress } from "@/context/ProgressContext";
import type { ResourceCategory, DifficultyLevel } from "@/lib/types";

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  start: "Start Here",
  tools: "Tool Tutorials",
  courses: "Courses & Certs",
  read: "Podcasts & Reads",
  clients: "Find Clients",
};

const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  beg: "Beginner",
  int: "Intermediate",
  adv: "Advanced",
};

const LEVEL_COLORS: Record<DifficultyLevel, string> = {
  beg: "bg-emerald-500/10 text-emerald-500",
  int: "bg-amber-500/10 text-amber-500",
  adv: "bg-rose-500/10 text-rose-500",
};

export default function AdminResourcesPage() {
  const router = useRouter();
  const { allNiches } = useNiches();
  const { isDisabled, toggleDisabled } = useProgress();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const allResources = useMemo(() => {
    const flat: { nicheId: string; nicheName: string; nicheIcon: string; nicheColor: string; resource: (typeof allNiches[0]["res"][0]) & { index: number } }[] = [];
    for (const niche of allNiches) {
      for (let i = 0; i < niche.res.length; i++) {
        flat.push({
          nicheId: niche.id,
          nicheName: niche.n,
          nicheIcon: niche.icon,
          nicheColor: niche.c,
          resource: { ...niche.res[i], index: i },
        });
      }
    }
    return flat;
  }, [allNiches]);

  const filtered = useMemo(() => {
    let list = allResources;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.resource.t.toLowerCase().includes(q) ||
          r.resource.p.toLowerCase().includes(q) ||
          r.nicheName.toLowerCase().includes(q) ||
          r.resource.desc.toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        let aVal: string, bVal: string;
        switch (sortKey) {
          case "title":
            aVal = a.resource.t.toLowerCase();
            bVal = b.resource.t.toLowerCase();
            break;
          case "niche":
            aVal = a.nicheName.toLowerCase();
            bVal = b.nicheName.toLowerCase();
            break;
          case "platform":
            aVal = a.resource.p.toLowerCase();
            bVal = b.resource.p.toLowerCase();
            break;
          case "category":
            aVal = a.resource.cat;
            bVal = b.resource.cat;
            break;
          case "level": {
            const order = { beg: 0, int: 1, adv: 2 };
            return sortDir === "asc"
              ? (order[a.resource.lv as keyof typeof order] ?? 0) - (order[b.resource.lv as keyof typeof order] ?? 0)
              : (order[b.resource.lv as keyof typeof order] ?? 0) - (order[a.resource.lv as keyof typeof order] ?? 0);
          }
          case "link":
            aVal = a.resource.u.toLowerCase();
            bVal = b.resource.u.toLowerCase();
            break;
          default:
            return 0;
        }
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return list;
  }, [allResources, search, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: string }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ArrowUp className="h-3 w-3 text-[var(--color-accent)]" />
      ) : (
        <ArrowDown className="h-3 w-3 text-[var(--color-accent)]" />
      )
    ) : (
      <ArrowUpDown className="h-3 w-3 text-[var(--color-text-tertiary)]" />
    );

  const cols = ["title", "niche", "platform", "category", "level", "link"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">All Resources</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {allResources.length} resources across {allNiches.length} niches
        </p>
      </div>

      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none transition-colors focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="hidden sm:block overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 font-semibold text-[var(--color-text-secondary)]">#</th>
              {cols.map((col) => (
                <th key={col} className="px-4 py-3">
                  <button
                    onClick={() => toggleSort(col)}
                    className="flex items-center gap-1 font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {col === "title" ? "Title" : col.charAt(0).toUpperCase() + col.slice(1)}
                    <SortIcon col={col} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-[var(--color-text-secondary)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <motion.tr
                key={`${item.nicheId}-${item.resource.index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.008 }}
                className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-secondary)]/50"
              >
                <td className="px-4 py-3 text-[var(--color-text-tertiary)]">{i + 1}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/admin/dashboard/${item.nicheId}`)}
                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {item.resource.t}
                  </button>
                  <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] line-clamp-1 max-w-xs">
                    {item.resource.desc}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/admin/dashboard/${item.nicheId}`)}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <span>{ICON_EMOJIS[item.nicheIcon] || "📚"}</span>
                    {item.nicheName}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-[var(--color-bg-secondary)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
                    {item.resource.p}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  {CATEGORY_LABELS[item.resource.cat as ResourceCategory] || item.resource.cat}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-md px-1.5 py-0.5 text-xs font-medium", LEVEL_COLORS[item.resource.lv as DifficultyLevel] || "bg-white/5 text-white/50")}>
                    {LEVEL_LABELS[item.resource.lv as DifficultyLevel] || item.resource.lv}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a href={item.resource.u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline">
                    <ExternalLink className="h-3 w-3" />
                    Open
                  </a>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleDisabled(item.resource.u)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                      isDisabled(item.resource.u)
                        ? "bg-[var(--color-rose-subtle)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white"
                        : "bg-[var(--color-green-subtle)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white"
                    )}
                  >
                    {isDisabled(item.resource.u) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {isDisabled(item.resource.u) ? "Disabled" : "Active"}
                  </button>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                  No resources found for &quot;{search}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-2">
        {filtered.slice(0, 50).map((item, i) => (
          <motion.div
            key={`${item.nicheId}-${item.resource.index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.01 }}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-3"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <button
                onClick={() => router.push(`/admin/dashboard/${item.nicheId}`)}
                className="flex-1 text-sm font-semibold text-[var(--color-text-primary)] text-left leading-snug min-w-0"
              >
                {item.resource.t}
              </button>
              <button
                onClick={() => toggleDisabled(item.resource.u)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium shrink-0",
                  isDisabled(item.resource.u)
                    ? "bg-[var(--color-rose-subtle)] text-[var(--color-rose)]"
                    : "bg-[var(--color-green-subtle)] text-[var(--color-green)]"
                )}
              >
                {isDisabled(item.resource.u) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[var(--color-text-tertiary)]">
              <button onClick={() => router.push(`/admin/dashboard/${item.nicheId}`)} className="flex items-center gap-1 hover:text-[var(--color-accent)]">
                <span>{ICON_EMOJIS[item.nicheIcon] || "📚"}</span>
                {item.nicheName}
              </button>
              <span className="rounded bg-[var(--color-bg-tertiary)] px-1.5 py-0.5">{item.resource.p}</span>
              <span className={cn("rounded px-1.5 py-0.5", LEVEL_COLORS[item.resource.lv as DifficultyLevel])}>
                {LEVEL_LABELS[item.resource.lv as DifficultyLevel]}
              </span>
              <a href={item.resource.u} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline ml-auto">
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
        Showing {filtered.length} of {allResources.length} resources
      </p>
    </div>
  );
}