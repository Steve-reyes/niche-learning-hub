import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    start: "Start Here",
    tools: "Tool Tutorials",
    courses: "Courses & Certs",
    read: "Podcasts & Reads",
    clients: "Find Clients",
  };
  return labels[cat] || cat;
}

export function formatLevel(lv: string): string {
  const labels: Record<string, string> = {
    beg: "Beginner",
    int: "Intermediate",
    adv: "Advanced",
  };
  return labels[lv] || lv;
}
