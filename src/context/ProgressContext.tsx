"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { Resource } from "@/lib/types";
import { useAuth } from "./AdminContext";

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

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [currentNiche, setCurrentNicheState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("kb-current-niche");
    if (stored && !user) {
      localStorage.removeItem("kb-current-niche");
      setCurrentNicheState(null);
    } else {
      setCurrentNicheState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !user || fetchedRef.current) return;
    fetchedRef.current = true;
    fetch(`/api/progress/${user.id}`)
      .then((r) => r.json())
      .then((data: { resourceId: string }[]) => {
        setCompleted(new Set(data.map((p) => p.resourceId)));
      })
      .catch(() => {});
  }, [hydrated, user]);

  const setCurrentNiche = useCallback((id: string | null) => {
    setCurrentNicheState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("kb-current-niche", id);
      else localStorage.removeItem("kb-current-niche");
    }
  }, []);

  const toggleComplete = useCallback(
    (resource: Resource) => {
      if (!user) return;
      const isNowComplete = !completed.has(resource.u);
      setCompleted((prev) => {
        const next = new Set(prev);
        if (isNowComplete) next.add(resource.u);
        else next.delete(resource.u);
        return next;
      });
      fetch(`/api/progress/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resource.u, completed: isNowComplete }),
      }).catch(() => {});
    },
    [completed, user]
  );

  const toggleDisabled = useCallback((url: string) => {
    setDisabled((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      localStorage.setItem("kb-disabled", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isCompleted = useCallback((url: string) => completed.has(url), [completed]);

  const isDisabled = useCallback((url: string) => disabled.has(url), [disabled]);

  const getProgress = useCallback(
    (nicheId: string, total: number) => {
      return total > 0 ? completed.size / total : 0;
    },
    [completed]
  );

  if (!hydrated) return null;

  return (
    <ProgressContext.Provider
      value={{
        completed,
        disabled,
        currentNiche,
        setCurrentNiche,
        toggleComplete,
        toggleDisabled,
        isCompleted,
        isDisabled,
        getProgress,
      }}
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
