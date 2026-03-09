import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import DosTerminalWorld from "./worlds/DosTerminalWorld";
import WebFoundationsWorld from "./worlds/WebFoundationsWorld";
import SkillTreeWorld from "./worlds/SkillTreeWorld";
import CareerTimelineWorld from "./worlds/CareerTimelineWorld";
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
  "career": () => <CareerTimelineWorld startRole="rbc" />,
  "contact": () => <ContactWorld />,
};

const WorldDive = ({ chapter, onClose }: WorldDiveProps) => {
  return (
    <AnimatePresence>
      {chapter && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "#faf8f4" }}
          initial={{ opacity: 0, scale: 2.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3, filter: "blur(8px)" }}
          transition={{ 
            duration: 0.6, 
            ease: [0.45, 0, 0.15, 1],
            exit: { duration: 0.5, ease: [0.45, 0, 0.55, 1] }
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 80%, ${chapter.color}08, transparent 70%)` }} />

          <motion.div className="relative z-10 flex items-center justify-between px-6 py-4"
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <button onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer"
              style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(180,140,100,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(180,140,100,0.08)"; }}>
              <ArrowLeft size={16} />
              <span className="text-xs font-display tracking-wider">Back to Board</span>
            </button>

            <div className="flex items-center gap-3">
              {chapter.image && chapterImages[chapter.image] ? (
                <img src={chapterImages[chapter.image]} alt={chapter.label}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: `2px solid ${chapter.color}40` }} />
              ) : chapter.brandLogo === "Career" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded"
                  style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}20` }}>
                  <img src={careerLogos.RBC} alt="RBC" className="h-5 object-contain" />
                  <span style={{ color: "#aaa", fontSize: 8 }}>+</span>
                  <img src={careerLogos.BMO} alt="BMO" className="h-5 object-contain" />
                </span>
              ) : chapter.brandLogo && brandLogos[chapter.brandLogo] ? (
                <span className="inline-flex items-center px-2 py-1 rounded"
                  style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}20` }}>
                  <img src={brandLogos[chapter.brandLogo]} alt={chapter.brandLogo} className="h-6 object-contain" />
                </span>
              ) : (
                <span className="text-2xl">{chapter.icon}</span>
              )}
              <div className="text-right">
                <p className="font-display text-sm tracking-wider" style={{ color: "#2d2a26" }}>{chapter.title}</p>
                <p className="text-[10px] font-mono" style={{ color: "#6b6560" }}>{chapter.year}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex-1 relative z-10 overflow-hidden"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            {worldMap[chapter.id]?.()}
          </motion.div>

          <motion.div className="relative z-10 text-center py-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <p className="text-[10px] font-mono" style={{ color: "#8a8078" }}>
              Press ESC or click Back to return to the board
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorldDive;
