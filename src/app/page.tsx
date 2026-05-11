"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { NicheGrid } from "@/components/niches/NicheGrid";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ProgressProvider, useProgress } from "@/context/ProgressContext";
import { useNiches } from "@/hooks/useNiches";

type Section = "home" | "courses" | "contact";

function HomeContent() {
  const { currentNiche, setCurrentNiche } = useProgress();
  const nicheGridRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const { allNiches, getNicheById } = useNiches();

  const handleSelect = useCallback(
    (id: string) => setCurrentNiche(id),
    [setCurrentNiche]
  );

  const handleBack = useCallback(() => setCurrentNiche(null), [setCurrentNiche]);

  const handleGetStarted = useCallback(
    () => nicheGridRef.current?.scrollIntoView({ behavior: "smooth" }),
    []
  );

  const handleNavigate = useCallback(
    (section: Section) => {
      setActiveSection(section);
      if (section === "home") setCurrentNiche(null);
    },
    [setCurrentNiche]
  );

  const selectedNiche = currentNiche ? getNicheById(currentNiche) : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 sm:px-8">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {selectedNiche ? (
            <Dashboard key={selectedNiche.id} niche={selectedNiche} onBack={handleBack} />
          ) : activeSection === "courses" ? (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  All Courses & Niches
                </h2>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {allNiches.length} niches
                </span>
              </div>
              <NicheGrid niches={allNiches} onSelect={handleSelect} />
            </motion.div>
          ) : activeSection === "contact" ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-lg py-16 text-center"
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Contact Us</h2>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                Have questions or suggestions? Reach out.
              </p>
              <div className="glass mt-8 space-y-4 rounded-xl p-6 text-left">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-tertiary)]">Email</p>
                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">hello@learnonlinejob.com</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-tertiary)]">Social</p>
                  <p className="mt-1 text-sm text-[var(--color-text-primary)]">@learnonlinejob</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onGetStarted={handleGetStarted} />

              <motion.div
                ref={nicheGridRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-10"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                    Choose Your Niche
                  </h2>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {allNiches.length} niches
                  </span>
                </div>
                <NicheGrid niches={allNiches} onSelect={handleSelect} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <ProgressProvider>
      <HomeContent />
    </ProgressProvider>
  );
}
