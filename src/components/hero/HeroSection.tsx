"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative mx-auto mb-24 max-w-2xl pt-16 text-center sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)]">
          Build an Online Career
          <br />
          <span className="text-[var(--color-accent)]">that stands out</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]"
      >
        by mastering your niche with world-class resources that cost you{" "}
        <span className="relative inline-block text-xl font-semibold text-[var(--color-rose)]">
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
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:shadow-md"
        >
          Browse Niches
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    </section>
  );
}
