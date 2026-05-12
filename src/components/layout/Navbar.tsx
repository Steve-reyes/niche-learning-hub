"use client";

import { motion } from "framer-motion";
import { Sparkles, LayoutGrid, Mail, Moon, Sun, LogIn, LogOut, Shield, BookOpen } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AdminContext";
import Link from "next/link";

interface NavbarProps {
  onNavigate?: (section: "home" | "courses" | "contact") => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { isDark, toggle } = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => onNavigate?.("home")}
          className="flex items-center gap-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            Learn Online Job
          </span>
        </button>

        <div className="flex items-center gap-1">
          {[
            ...(isAuthenticated
              ? [{ key: "courses" as const, label: "My Courses", icon: BookOpen }]
              : [{ key: "home" as const, label: "Home", icon: Sparkles }]
            ),
            { key: "courses" as const, label: "Courses", icon: LayoutGrid },
            { key: "contact" as const, label: "Contact", icon: Mail },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate?.(key)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
          <div className="ml-2 h-4 w-px bg-[var(--color-border)]" />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <span className="text-xs text-[var(--color-text-tertiary)] px-1">{user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-rose)] transition-all duration-200 hover:bg-[var(--color-rose-subtle)]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
            >
              <LogIn className="h-3.5 w-3.5" />
              Log In
            </Link>
          )}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
