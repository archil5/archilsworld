import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
      {/* Exit flash overlay */}
      <AnimatePresence>
        {exiting && chapter && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${chapter.color}, #f5f0e8)` }}
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
            style={{ background: "#faf8f4" }}
            initial={{ opacity: 0, scale: 2.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 3,
              filter: "blur(12px)",
              y: -60,
            }}
            transition={{ duration: 0.7, ease: [0.45, 0, 0.15, 1] }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 80%, ${chapter.color}08, transparent 70%)` }} />

            <motion.div className="relative z-10 flex items-center justify-between px-3 md:px-6 py-3 md:py-4"
              initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <button onClick={handleClose}
                className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all cursor-pointer"
                style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(180,140,100,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(180,140,100,0.08)"; }}>
                <ArrowLeft size={14} />
                <span className="text-[10px] md:text-xs font-display tracking-wider">Back</span>
              </button>

              <div className="flex items-center gap-2 md:gap-3">
                {chapter.image && chapterImages[chapter.image] ? (
                  <img src={chapterImages[chapter.image]} alt={chapter.label}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    style={{ border: `2px solid ${chapter.color}40` }} />
                ) : chapter.brandLogo === "Career" ? (
                  <span className="inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded"
                    style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}20` }}>
                    <img src={careerLogos.RBC} alt="RBC" className="h-4 md:h-5 object-contain" />
                    <span style={{ color: "#aaa", fontSize: 8 }}>+</span>
                    <img src={careerLogos.BMO} alt="BMO" className="h-4 md:h-5 object-contain" />
                  </span>
                ) : chapter.brandLogo && brandLogos[chapter.brandLogo] ? (
                  <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded"
                    style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}20` }}>
                    <img src={brandLogos[chapter.brandLogo]} alt={chapter.brandLogo} className="h-5 md:h-6 object-contain" />
                  </span>
                ) : (
                  <span className="text-xl md:text-2xl">{chapter.icon}</span>
                )}
                <div className="text-right">
                  <p className="font-display text-xs md:text-sm tracking-wider" style={{ color: "#2d2a26" }}>{chapter.title}</p>
                  <p className="text-[9px] md:text-[10px] font-mono" style={{ color: "#6b6560" }}>{chapter.year}</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="flex-1 relative z-10 overflow-hidden"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              {worldMap[chapter.id]?.()}
            </motion.div>

            <motion.div className="relative z-10 text-center py-2 md:py-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <p className="text-[9px] md:text-[10px] font-mono" style={{ color: "#8a8078" }}>
                Tap Back to return to the board
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorldDive;
