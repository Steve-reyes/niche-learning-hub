export type ResourceCategory = "start" | "tools" | "courses" | "read" | "clients";
export type DifficultyLevel = "beg" | "int" | "adv";
export type CostType = "free" | "audit" | "cert" | "trial" | "";

export interface Resource {
  t: string;
  p: string;
  d: string;
  cat: ResourceCategory;
  lv: DifficultyLevel;
  cost?: CostType;
  u: string;
  desc: string;
  bp?: number;
}

export interface Niche {
  id: string;
  n: string;
  icon: string;
  c: string;
  tag: string;
  res: Resource[];
}

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  start: "Start Here",
  tools: "Tool Tutorials",
  courses: "Courses & Certs",
  read: "Podcasts & Reads",
  clients: "Find Clients",
};

export const CATEGORY_ORDER: ResourceCategory[] = [
  "start",
  "tools",
  "courses",
  "read",
  "clients",
];

export const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  beg: "Beginner",
  int: "Intermediate",
  adv: "Advanced",
};

export const PLATFORM_CLASSES: Record<string, string> = {
  YouTube: "plat-yt",
  Coursera: "plat-coursera",
  Alison: "plat-alison",
  HubSpot: "plat-hubspot",
  Google: "plat-google",
  Free: "plat-free",
};
