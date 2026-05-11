"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, GripVertical, Settings } from "lucide-react";
import { useNiches } from "@/hooks/useNiches";
import type { Resource, ResourceCategory, DifficultyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON_EMOJIS: Record<string, string> = {
  briefcase: "💼", instagram: "📱", headphones: "🎧", "user-check": "✅",
  code: "💻", palette: "🎨", "pen-tool": "✍️", calculator: "🧮",
  trello: "📋", database: "🗄️", mic: "🎙️", mail: "📧",
  "shopping-cart": "🛒", users: "👥", home: "🏠",
  robot: "🤖", chart: "📊", camera: "📸", music: "🎵",
  globe: "🌐", shield: "🛡️", truck: "🚚", stethoscope: "🩺",
  gavel: "⚖️", gift: "🎁",
};

const PRESET_ICONS = Object.keys(ICON_EMOJIS);
const PRESET_COLORS = ["#4A7BF7", "#E94560", "#06D6A0", "#7B2FF7", "#F5C518", "#FF6B35", "#00B4D8", "#10b981", "#8b5cf6", "#f43f5e"];

const CATEGORIES: ResourceCategory[] = ["start", "tools", "courses", "read", "clients"];
const LEVELS: DifficultyLevel[] = ["beg", "int", "adv"];

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

interface EditingResource extends Resource {
  tempId: string;
}

export default function NicheEditorPage() {
  const router = useRouter();
  const params = useParams();
  const nicheId = params.nicheId as string;
  const { getNicheById, updateNiche, loading } = useNiches();
  const niche = getNicheById(nicheId);

  const [activeTab, setActiveTab] = useState<ResourceCategory>("start");
  const [resources, setResources] = useState<EditingResource[]>([]);
  const [saved, setSaved] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editIcon, setEditIcon] = useState("briefcase");
  const [editColor, setEditColor] = useState("#4A7BF7");

  useEffect(() => {
    if (niche) {
      setResources(niche.res.map((r) => ({ ...r, tempId: crypto.randomUUID() })));
      setEditName(niche.n);
      setEditTag(niche.tag);
      setEditIcon(niche.icon);
      setEditColor(niche.c);
    }
  }, [niche]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of resources) {
      counts[r.cat] = (counts[r.cat] || 0) + 1;
    }
    return counts as Record<ResourceCategory, number>;
  }, [resources]);

  const filtered = useMemo(
    () => resources.filter((r) => r.cat === activeTab),
    [resources, activeTab]
  );

  const updateResource = useCallback((tempId: string, field: keyof Resource, value: string) => {
    setResources((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r))
    );
    setSaved(false);
  }, []);

  const deleteResource = useCallback((tempId: string) => {
    setResources((prev) => prev.filter((r) => r.tempId !== tempId));
    setSaved(false);
  }, []);

  const addResource = useCallback(() => {
    const newRes: EditingResource = {
      tempId: crypto.randomUUID(),
      t: "New Resource",
      p: "Platform",
      d: "",
      cat: activeTab,
      lv: "beg",
      u: "https://",
      desc: "Description here",
    };
    setResources((prev) => [...prev, newRes]);
    setSaved(false);
  }, [activeTab]);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editName.trim()) return;
    updateNiche(nicheId, {
      n: editName.trim(),
      tag: editTag,
      icon: editIcon,
      c: editColor,
    });
    setShowEdit(false);
  }, [editName, editTag, editIcon, editColor, nicheId, updateNiche]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm text-[var(--color-text-tertiary)]">Loading...</p>
      </div>
    );
  }

  if (!niche) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-[var(--color-text-tertiary)]">Niche not found.</p>
        <button onClick={() => router.push("/admin/dashboard")} className="mt-4 text-sm text-[var(--color-accent)]">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xl">{ICON_EMOJIS[niche.icon] || "📚"}</span>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
          {niche.n}
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {resources.length} resources
        </p>
        <button
          onClick={() => {
            setEditName(niche.n);
            setEditTag(niche.tag);
            setEditIcon(niche.icon);
            setEditColor(niche.c);
            setShowEdit(true);
          }}
          className="ml-2 flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
        >
          <Settings className="h-4 w-4" />
          Edit Niche
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={addResource}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-subtle)]"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--color-border)] pb-px">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-colors duration-200",
              activeTab === cat
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
            )}
          >
            {CATEGORY_LABELS[cat]}
            <span className="rounded-md bg-[var(--color-bg-secondary)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-tertiary)]">
              {tabCounts[cat] || 0}
            </span>
            {activeTab === cat && (
              <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((res, i) => (
          <motion.div
            key={res.tempId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4"
          >
            <div className="flex items-start gap-3">
              <GripVertical className="mt-2 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <input
                  value={res.t}
                  onChange={(e) => updateResource(res.tempId, "t", e.target.value)}
                  className="col-span-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  placeholder="Title"
                />
                <input
                  value={res.p}
                  onChange={(e) => updateResource(res.tempId, "p", e.target.value)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  placeholder="Platform"
                />
                <input
                  value={res.d}
                  onChange={(e) => updateResource(res.tempId, "d", e.target.value)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  placeholder="Duration"
                />
                <input
                  value={res.u}
                  onChange={(e) => updateResource(res.tempId, "u", e.target.value)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  placeholder="URL"
                />
                <div className="flex gap-2">
                  <select
                    value={res.cat}
                    onChange={(e) => updateResource(res.tempId, "cat", e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                  <select
                    value={res.lv}
                    onChange={(e) => updateResource(res.tempId, "lv", e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={res.desc}
                  onChange={(e) => updateResource(res.tempId, "desc", e.target.value)}
                  className="col-span-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  placeholder="Description"
                  rows={2}
                />
              </div>
              <button
                onClick={() => deleteResource(res.tempId)}
                className="mt-2 shrink-0 rounded-lg p-1.5 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-rose-subtle)] hover:text-[var(--color-rose)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--color-text-tertiary)]">No resources in this category.</p>
            <button onClick={addResource} className="mt-3 text-sm font-medium text-[var(--color-accent)] hover:underline">
              Add one
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowEdit(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Edit Niche</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Update the niche name, tagline, icon, or color.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Tagline</label>
                <input
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setEditIcon(ic)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border text-base transition-all ${
                        editIcon === ic
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] scale-110"
                          : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                      }`}
                    >
                      {ICON_EMOJIS[ic] || "📚"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${
                        editColor === c ? "border-white scale-125" : "border-transparent"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
