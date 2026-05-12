"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative mx-auto mb-16 max-w-2xl px-4 pt-12 text-center sm:mb-24 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]">
          Build an Online Career
          <br />
          <span className="text-[var(--color-accent)]">that stands out</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mt-4 max-w-md px-2 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base"
      >
        by mastering your niche with world-class resources that cost you{" "}
        <span className="relative inline-block text-lg font-semibold text-[var(--color-rose)] sm:text-xl">
          <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[var(--color-rose)] opacity-60" />
          nothing
        </span>
        .
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:shadow-md active:scale-95"
        >
          Browse Niches
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    </section>
  );
}