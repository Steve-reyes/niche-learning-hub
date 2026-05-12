"use client";

import { motion } from "framer-motion";
import { Sparkles, LayoutGrid, Mail, Moon, Sun, LogIn, LogOut, Shield, Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AdminContext";
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  onNavigate?: (section: "home" | "courses" | "contact") => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { isDark, toggle } = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { key: "home" as const, label: "Home", icon: Sparkles },
    { key: "courses" as const, label: "Courses", icon: LayoutGrid },
    { key: "contact" as const, label: "Contact", icon: Mail },
  ];

  const handleNav = (key: "home" | "courses" | "contact") => {
    onNavigate?.(key);
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-8">
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)] hidden xs:inline sm:inline">
            Freelance Haven
          </span>
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex sm:hidden items-center justify-center rounded-lg p-2 text-[var(--color-text-tertiary)] hover:bg-[var(--color-accent-subtle)]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleNav(key)}
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
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}
              <span className="text-xs text-[var(--color-text-tertiary)] px-1 max-w-[80px] truncate hidden md:inline">{user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-rose)] transition-all duration-200 hover:bg-[var(--color-rose-subtle)]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Log In</span>
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

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 pb-4 pt-2 sm:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleNav(key)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
            <div className="my-2 h-px bg-[var(--color-border)]" />
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-tertiary)]">
                  <span className="truncate">{user?.username}</span>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                  >
                    <Shield className="h-4 w-4 shrink-0" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-rose)] hover:bg-[var(--color-rose-subtle)]"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
              >
                <LogIn className="h-4 w-4 shrink-0" />
                Log In
              </Link>
            )}
            <button
              onClick={toggle}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
            >
              {isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}