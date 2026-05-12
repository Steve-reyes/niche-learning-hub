"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, BookOpen, Plus, ChevronRight, Eye, EyeOff, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/context/AdminContext";
import { useNiches } from "@/hooks/useNiches";
import { ICON_EMOJIS } from "@/lib/icons";
import { useCallback } from "react";

export default function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { allNiches, removeNiche } = useNiches();

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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Welcome, {user?.username}. Manage niches and their resources.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-[var(--color-accent)]" />
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Niches ({allNiches.length})
        </h2>
      </div>

      <div className="space-y-3">
        {allNiches.map((niche, i) => (
          <motion.div
            key={niche.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4 transition-all hover:border-[var(--color-border-hover)]"
          >
            <button
              onClick={() => router.push(`/admin/dashboard/${niche.id}`)}
              className="flex flex-1 items-center gap-4 text-left"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ background: `${niche.c}15` }}
              >
                <span>{ICON_EMOJIS[niche.icon] || "📚"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {niche.n}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                  {niche.res.length} resources &middot; {niche.tag}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleDisable(niche.id, !!niche.disabled)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  niche.disabled
                    ? "bg-[var(--color-rose-subtle)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white"
                    : "bg-[var(--color-green-subtle)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white"
                }`}
                title={niche.disabled ? "Enable niche" : "Disable niche"}
              >
                {niche.disabled ? <ToggleLeft className="h-3.5 w-3.5" /> : <ToggleRight className="h-3.5 w-3.5" />}
                {niche.disabled ? "Hidden" : "Visible"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}