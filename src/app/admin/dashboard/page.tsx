"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LogOut, BookOpen, Plus, ChevronRight } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useNiches } from "@/hooks/useNiches";

export default function AdminDashboardPage() {
  const { logout } = useAdmin();
  const router = useRouter();
  const { allNiches } = useNiches();

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage niches and their resources.
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
          <Link
            href="/"
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            View Site
          </Link>
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
          >
            <Link
              href={`/admin/dashboard/${niche.id}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4 transition-all hover:border-[var(--color-border-hover)] hover:shadow-sm"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ background: `${niche.c}15` }}
              >
                <span>
                  {{
                    briefcase: "💼", instagram: "📱", headphones: "🎧",
                    "user-check": "✅", code: "💻", palette: "🎨",
                    "pen-tool": "✍️", calculator: "🧮", trello: "📋",
                    database: "🗄️", mic: "🎙️", mail: "📧",
                    "shopping-cart": "🛒", users: "👥", home: "🏠",
                    robot: "🤖", chart: "📊", camera: "📸",
                    music: "🎵", globe: "🌐", shield: "🛡️",
                    truck: "🚚", stethoscope: "🩺", gavel: "⚖️",
                    gift: "🎁",
                  }[niche.icon] || "📚"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {niche.n}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {niche.res.length} resources &middot; {niche.tag}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
