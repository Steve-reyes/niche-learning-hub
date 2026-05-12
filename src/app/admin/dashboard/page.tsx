"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, BookOpen, Plus, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/context/AdminContext";
import { useNiches } from "@/hooks/useNiches";
import { ICON_EMOJIS } from "@/lib/icons";
import { useCallback } from "react";

export default function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { allNiches } = useNiches();

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  const handleToggleDisable = useCallback(
    async (nicheId: string, currentDisabled: boolean) => {
      await fetch(`/api/niches/${nicheId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: !currentDisabled }),
      });
      router.refresh();
    },
    [router]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Welcome, {user?.username}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => router.push("/admin/dashboard/new")}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            <Plus className="h-4 w-4" />
            Add Niche
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-rose)] transition-colors hover:bg-[var(--color-rose-subtle)]"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 sm:mb-6">
        <BookOpen className="h-5 w-5 text-[var(--color-accent)] shrink-0" />
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] sm:text-lg">
          Niches ({allNiches.length})
        </h2>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {allNiches.map((niche, i) => (
          <motion.div
            key={niche.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-3 transition-all hover:border-[var(--color-border-hover)] sm:gap-3 sm:p-4"
          >
            <button
              onClick={() => router.push(`/admin/dashboard/${niche.id}`)}
              className="flex flex-1 items-center gap-3 text-left min-w-0"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-10 sm:w-10 sm:text-lg"
                style={{ background: `${niche.c}15` }}
              >
                <span>{ICON_EMOJIS[niche.icon] || "📚"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {niche.n}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                  {niche.res.length} resources &middot; {niche.tag}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
            </button>
            <button
              onClick={() => handleToggleDisable(niche.id, !!niche.disabled)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all shrink-0 sm:px-3 sm:text-xs ${
                niche.disabled
                  ? "bg-[var(--color-rose-subtle)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white"
                  : "bg-[var(--color-green-subtle)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white"
              }`}
              title={niche.disabled ? "Enable niche" : "Disable niche"}
            >
              {niche.disabled ? <ToggleLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <ToggleRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
              <span className="hidden sm:inline">{niche.disabled ? "Hidden" : "Visible"}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}