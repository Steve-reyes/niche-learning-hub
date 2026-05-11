import { Niche, Resource } from "./types";

const CUSTOM_NICHES_KEY = "kb-custom-niches";

export function loadCustomNiches(): Niche[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_NICHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomNiche(niche: Niche) {
  const existing = loadCustomNiches();
  existing.push(niche);
  localStorage.setItem(CUSTOM_NICHES_KEY, JSON.stringify(existing));
}

export function updateCustomNiche(id: string, updates: Partial<Niche>) {
  const existing = loadCustomNiches();
  const idx = existing.findIndex((n) => n.id === id);
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updates };
    localStorage.setItem(CUSTOM_NICHES_KEY, JSON.stringify(existing));
  }
}

export function deleteCustomNiche(id: string) {
  const existing = loadCustomNiches().filter((n) => n.id !== id);
  localStorage.setItem(CUSTOM_NICHES_KEY, JSON.stringify(existing));
}

const ICONS = [
  "briefcase", "instagram", "headphones", "user-check", "code",
  "palette", "pen-tool", "calculator", "trello", "database",
  "mic", "mail", "shopping-cart", "users", "home",
  "robot", "chart", "camera", "music", "globe",
  "shield", "truck", "stethoscope", "gavel", "gift",
];

const COLORS = [
  "#4A7BF7", "#E94560", "#06D6A0", "#7B2FF7", "#F5C518",
  "#FF6B35", "#00B4D8", "#10b981", "#8b5cf6", "#f43f5e",
];

export function generateNicheId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function scaffoldResources(nicheName: string): Resource[] {
  return [
    { t: `What is a ${nicheName}?`, p: "YouTube", d: "10 min", cat: "start", lv: "beg", u: `https://www.youtube.com/results?search_query=what+is+${nicheName.toLowerCase().replace(/\s+/g, "+")}`, desc: `Introduction to ${nicheName} role and responsibilities.` },
    { t: `Day in the Life of a ${nicheName}`, p: "YouTube", d: "12 min", cat: "start", lv: "beg", u: `https://www.youtube.com/results?search_query=day+in+the+life+${nicheName.toLowerCase().replace(/\s+/g, "+")}`, desc: `See what a typical day looks like for a ${nicheName}.` },
    { t: `How to Start as a ${nicheName}`, p: "YouTube", d: "15 min", cat: "start", lv: "beg", u: `https://www.youtube.com/results?search_query=how+to+start+as+a+${nicheName.toLowerCase().replace(/\s+/g, "+")}`, desc: `Step-by-step guide to launching your ${nicheName} career.` },
    { t: "Google Workspace Basics", p: "YouTube", d: "20 min", cat: "tools", lv: "beg", u: "https://www.youtube.com/results?search_query=google+workspace+tutorial+beginners", desc: "Master Gmail, Calendar, Drive, and Docs." },
    { t: "Slack for Teams", p: "YouTube", d: "12 min", cat: "tools", lv: "beg", u: "https://www.youtube.com/results?search_query=slack+tutorial+beginner", desc: "Channels, messages, and team collaboration." },
    { t: "Notion for Workflow", p: "YouTube", d: "15 min", cat: "tools", lv: "int", u: "https://www.youtube.com/results?search_query=notion+workflow+tutorial", desc: "Build a workflow system in Notion." },
    { t: `${nicheName} Fundamentals`, p: "Coursera", d: "4 weeks", cat: "courses", lv: "beg", cost: "audit", u: "https://www.coursera.org/", desc: `Core principles and practices of ${nicheName}.` },
    { t: "AI for Everyone", p: "Coursera", d: "4 weeks", cat: "courses", lv: "beg", cost: "audit", u: "https://www.coursera.org/learn/ai-for-everyone", desc: "Understand AI tools and how to use them." },
    { t: "Learning How to Learn", p: "Coursera", d: "4 weeks", cat: "courses", lv: "beg", cost: "audit", u: "https://www.coursera.org/learn/learning-how-to-learn", desc: "Master techniques for learning any new skill." },
    { t: `${nicheName} Best Practices`, p: "HubSpot", d: "10 min read", cat: "read", lv: "beg", u: "https://blog.hubspot.com/", desc: `Curated articles on ${nicheName} best practices.` },
    { t: "Productivity Podcast", p: "Spotify", d: "30 min/ep", cat: "read", lv: "beg", cost: "free", u: "https://open.spotify.com/", desc: "Tips and strategies for staying productive." },
    { t: "OnlineJobs.ph", p: "Platform", d: "", cat: "clients", lv: "beg", u: "https://www.onlinejobs.ph/", desc: "#1 platform for Filipino freelancers." },
    { t: "Upwork", p: "Platform", d: "", cat: "clients", lv: "beg", u: "https://www.upwork.com/", desc: "Global freelance marketplace." },
  ];
}
