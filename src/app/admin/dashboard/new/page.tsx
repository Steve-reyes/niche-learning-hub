"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useNiches } from "@/hooks/useNiches";
import { generateNicheId, scaffoldResources } from "@/lib/storage";
import type { Niche } from "@/lib/types";

const PRESET_ICONS = ["briefcase", "instagram", "headphones", "user-check", "code", "palette", "pen-tool", "calculator", "trello", "database", "mic", "mail", "shopping-cart", "users", "home", "robot", "chart", "camera", "music", "globe", "shield", "truck", "stethoscope", "gavel", "gift"];
const PRESET_COLORS = ["#4A7BF7", "#E94560", "#06D6A0", "#7B2FF7", "#F5C518", "#FF6B35", "#00B4D8", "#10b981", "#8b5cf6", "#f43f5e"];

export default function AddNichePage() {
  const router = useRouter();
  const { addNiche, allNiches } = useNiches();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("briefcase");
  const [color, setColor] = useState("#4A7BF7");
  const [tag, setTag] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      const id = generateNicheId(name);
      if (allNiches.find((n) => n.id === id)) {
        alert("A niche with this name already exists.");
        return;
      }

      const newNiche: Niche = {
        id,
        n: name.trim(),
        icon,
        c: color,
        tag: tag || "Custom niche",
        res: scaffoldResources(name.trim()),
      };

      addNiche(newNiche);
      router.push(`/admin/dashboard/${id}`);
    },
    [name, icon, color, tag, addNiche, allNiches, router]
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Add New Niche</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Niche Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Data Analytics"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Tagline</label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Analytics, reporting, dashboards"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Icon</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-all ${
                  icon === ic
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                }`}
              >
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
                }[ic] || "📚"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  color === c ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">Auto-scaffold</p>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            13 default resources will be created across all 5 categories (Start Here, Tool Tutorials, Courses, Reads, Find Clients). Edit them after creation.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            <Plus className="h-4 w-4" />
            Create Niche
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
