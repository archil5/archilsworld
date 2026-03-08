import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import DosTerminalWorld from "./worlds/DosTerminalWorld";
import CodeBuilderWorld from "./worlds/CodeBuilderWorld";
import NetworkWorld from "./worlds/NetworkWorld";
import SkillTreeWorld from "./worlds/SkillTreeWorld";
import CareerTimelineWorld from "./worlds/CareerTimelineWorld";
import NeuralNetworkWorld from "./worlds/NeuralNetworkWorld";
import type { ChapterData } from "@/data/chapters";

interface WorldDiveProps {
  chapter: ChapterData | null;
  onClose: () => void;
}

const worldMap: Record<string, (chapterId?: string) => JSX.Element> = {
  "dos-games": () => <DosTerminalWorld />,
  "html-css": () => <CodeBuilderWorld />,
  "networking": () => <NetworkWorld />,
  "dalhousie": () => <SkillTreeWorld />,
  "rbc": (id) => <CareerTimelineWorld startRole={id} />,
  "bmo-infra": (id) => <CareerTimelineWorld startRole={id} />,
  "bmo-senior": (id) => <CareerTimelineWorld startRole={id} />,
  "bmo-lead": (id) => <CareerTimelineWorld startRole={id} />,
  "bmo-principal": (id) => <CareerTimelineWorld startRole={id} />,
  "bmo-ai": () => <NeuralNetworkWorld />,
};

const WorldDive = ({ chapter, onClose }: WorldDiveProps) => {
  return (
    <AnimatePresence>
      {chapter && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "#0d0a06" }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Ambient background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${chapter.color}10, transparent 70%)`,
            }}
          />

          {/* Top bar */}
          <motion.div
            className="relative z-10 flex items-center justify-between px-6 py-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer"
              style={{
                color: "#e8c460",
                background: "rgba(232,196,96,0.08)",
                border: "1px solid rgba(232,196,96,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(232,196,96,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(232,196,96,0.08)";
              }}
            >
              <ArrowLeft size={16} />
              <span className="text-xs font-display tracking-wider">Back to Board</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-2xl">{chapter.icon}</span>
              <div className="text-right">
                <p className="font-display text-sm tracking-wider" style={{ color: "#e8c460" }}>
                  {chapter.title}
                </p>
                <p className="text-[10px] font-mono" style={{ color: "rgba(232,196,96,0.4)" }}>
                  {chapter.year}
                </p>
              </div>
            </div>
          </motion.div>

          {/* World content */}
          <motion.div
            className="flex-1 relative z-10 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {worldMap[chapter.id]?.(chapter.id)}
          </motion.div>

          {/* Bottom hint */}
          <motion.div
            className="relative z-10 text-center py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-[10px] font-mono" style={{ color: "rgba(232,196,96,0.25)" }}>
              Press ESC or click Back to return to the board
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorldDive;
