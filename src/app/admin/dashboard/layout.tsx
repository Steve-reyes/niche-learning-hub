"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ListTree, Users } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AdminContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Niches", icon: BookOpen },
    { href: "/admin/dashboard/resources", label: "Resources", icon: ListTree },
    { href: "/admin/dashboard/users", label: "Users", icon: Users },
  ];

  return (
    <ProgressProvider>
      <div>
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-2xl overflow-x-auto">
          <div className="mx-auto flex max-w-5xl items-center gap-1 px-4 sm:px-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-all shrink-0 sm:px-4 sm:text-sm",
                    active
                      ? "border-[var(--color-accent)] text-[var(--color-text-primary)]"
                      : "border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </ProgressProvider>
  );
}