"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Resource } from "@/lib/types";

interface ProgressContextType {
  completed: Set<string>;
  disabled: Set<string>;
  currentNiche: string | null;
  setCurrentNiche: (id: string | null) => void;
  toggleComplete: (resource: Resource) => void;
  toggleDisabled: (url: string) => void;
  isCompleted: (url: string) => boolean;
  isDisabled: (url: string) => boolean;
  getProgress: (nicheId: string, total: number) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(key);
    if (saved) return new Set(JSON.parse(saved));
  } catch {}
  return new Set();
}

function loadNiche(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("kb-current-niche");
  } catch {
    return null;
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [currentNiche, setCurrentNicheState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompleted(loadSet("kb-progress"));
    setDisabled(loadSet("kb-disabled"));
    setCurrentNicheState(loadNiche());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("kb-progress", JSON.stringify([...completed]));
    }
  }, [completed, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("kb-disabled", JSON.stringify([...disabled]));
    }
  }, [disabled, hydrated]);

  const setCurrentNiche = useCallback((id: string | null) => {
    setCurrentNicheState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("kb-current-niche", id);
      else localStorage.removeItem("kb-current-niche");
    }
  }, []);

  const toggleComplete = useCallback((resource: Resource) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(resource.u)) next.delete(resource.u);
      else next.add(resource.u);
      return next;
    });
  }, []);

  const toggleDisabled = useCallback((url: string) => {
    setDisabled((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (url: string) => completed.has(url),
    [completed]
  );

  const isDisabled = useCallback(
    (url: string) => disabled.has(url),
    [disabled]
  );

  const getProgress = useCallback(
    (nicheId: string, total: number) => {
      return total > 0 ? completed.size / total : 0;
    },
    [completed]
  );

  if (!hydrated) return null;

  return (
    <ProgressContext.Provider
      value={{ completed, disabled, currentNiche, setCurrentNiche, toggleComplete, toggleDisabled, isCompleted, isDisabled, getProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
