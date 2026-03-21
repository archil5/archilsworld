import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DosTerminalWorld from "./worlds/DosTerminalWorld";
import WebFoundationsWorld from "./worlds/WebFoundationsWorld";
import SkillTreeWorld from "./worlds/SkillTreeWorld";
import CareerTimelineWorld from "./worlds/CareerTimelineWorld";
import KnowledgeHubWorld from "./worlds/KnowledgeHubWorld";
import ContactWorld from "./worlds/ContactWorld";
import type { ChapterData } from "@/data/chapters";
import { brandLogos, careerLogos, chapterImages } from "@/data/brandLogos";

interface WorldDiveProps {
  chapter: ChapterData | null;
  onClose: () => void;
}

const worldMap: Record<string, () => JSX.Element> = {
  "dos-games": () => <DosTerminalWorld />,
  "web-foundations": () => <WebFoundationsWorld />,
  "dalhousie": () => <SkillTreeWorld />,
  "career": () => <CareerTimelineWorld />,
  "knowledge": () => <KnowledgeHubWorld />,
  "contact": () => <ContactWorld />,
};

const WorldDive = ({ chapter, onClose }: WorldDiveProps) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 800);
  }, [onClose]);

  return (
    <>
      {/* Exit flash */}
      <AnimatePresence>
        {exiting && chapter && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${chapter.color}, #E8E0D0)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 1, 0] }}
            transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chapter && !exiting && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "#F8FAFC" }}
            initial={{ opacity: 0, scale: 2.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 3, filter: "blur(12px)", y: -60 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 80%, ${chapter.color}06, transparent 70%)` }} />

            <motion.div className="relative z-10 flex items-center justify-between px-4 md:px-8 py-3 md:py-4"
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <button onClick={handleClose}
                className="flex items-center gap-2 px-3 py-2 transition-all ink-underline"
                style={{ color: "#64748B", background: "hsl(222 47% 11% / 0.04)", border: "1px solid hsl(222 47% 11% / 0.08)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(222 47% 11% / 0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(222 47% 11% / 0.04)"; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                <span className="font-mono text-mono-xs tracking-wider">Back</span>
              </button>

              <div className="flex items-center gap-3">
                {chapter.image && chapterImages[chapter.image] ? (
                  <img src={chapterImages[chapter.image]} alt={chapter.label}
                    className="w-7 h-7 md:w-8 md:h-8 object-cover"
                    style={{ border: `1px solid ${chapter.color}30` }} />
                ) : chapter.brandLogo === "Career" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1"
                    style={{ background: `${chapter.color}08`, border: `1px solid ${chapter.color}12` }}>
                    <img src={careerLogos.RBC} alt="RBC" className="h-4 md:h-5 object-contain" />
                    <span style={{ color: "#64748B", fontSize: 8 }}>+</span>
                    <img src={careerLogos.BMO} alt="BMO" className="h-4 md:h-5 object-contain" />
                  </span>
                ) : chapter.brandLogo && brandLogos[chapter.brandLogo] ? (
                  <span className="inline-flex items-center px-2 py-1"
                    style={{ background: `${chapter.color}08`, border: `1px solid ${chapter.color}12` }}>
                    <img src={brandLogos[chapter.brandLogo]} alt={chapter.brandLogo} className="h-5 md:h-6 object-contain" />
                  </span>
                ) : (
                  <span className="text-xl md:text-2xl">{chapter.icon}</span>
                )}
                <div className="text-right">
                  <p className="font-display text-display-sm tracking-wider" style={{ color: "#0F172A" }}>{chapter.title}</p>
                  <p className="font-mono text-mono-xs" style={{ color: "#64748B" }}>{chapter.year}</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="flex-1 relative z-10 overflow-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              {worldMap[chapter.id]?.()}
            </motion.div>

            <motion.div className="relative z-10 text-center py-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <p className="font-mono text-mono-xs" style={{ color: "hsl(215 16% 47% / 0.4)" }}>
                ← Back to return to the board
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorldDive;