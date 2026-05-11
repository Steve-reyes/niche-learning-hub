"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";
import { BookOpen, ListTree } from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const navItems = [
    { href: "/admin/dashboard", label: "Niches", icon: BookOpen },
    { href: "/admin/dashboard/resources", label: "Resources", icon: ListTree },
  ];

  return (
    <ProgressProvider>
      <div>
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-5xl items-center gap-1 px-4 sm:px-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                    active
                      ? "border-[var(--color-accent)] text-[var(--color-text-primary)]"
                      : "border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
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
