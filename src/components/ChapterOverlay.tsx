import { motion, AnimatePresence } from "framer-motion";
import type { ChapterData } from "@/data/chapters";

interface ChapterOverlayProps {
  chapter: ChapterData;
  visible: boolean;
  onDive?: () => void;
}

const ChapterOverlay = ({ chapter, visible, onDive }: ChapterOverlayProps) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={chapter.id}
          className="absolute bottom-0 left-0 right-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(26,19,11,0.95) 0%, rgba(26,19,11,0.7) 40%, transparent 100%)",
            }}
          />

          <div className="relative px-8 md:px-16 pb-10 pt-32 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="text-3xl">{chapter.icon}</span>
              <span
                className="text-[10px] font-display uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                style={{
                  color: chapter.color,
                  border: `1px solid ${chapter.color}40`,
                  background: `${chapter.color}15`,
                }}
              >
                {chapter.category === "origin" ? "Origin Story"
                  : chapter.category === "education" ? "Education"
                  : chapter.category === "current" ? "Present Day"
                  : "Career"}
              </span>
              <span className="text-xs font-mono" style={{ color: "rgba(232,196,96,0.4)" }}>
                {chapter.year}
              </span>
            </motion.div>

            <motion.h2
              className="font-display text-3xl md:text-5xl font-bold mb-2"
              style={{ color: "#f0e6d0" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {chapter.title}
            </motion.h2>

            <motion.p
              className="font-display text-xs uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(232,196,96,0.6)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {chapter.subtitle}
            </motion.p>

            {/* Enter World button */}
            {onDive && (
              <motion.button
                onClick={onDive}
                className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: `${chapter.color}15`,
                  border: `1px solid ${chapter.color}40`,
                  color: chapter.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${chapter.color}30`;
                  e.currentTarget.style.boxShadow = `0 0 30px ${chapter.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${chapter.color}15`;
                  e.currentTarget.style.boxShadow = "none";
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="font-display text-sm tracking-wider">Enter this world</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  →
                </motion.span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChapterOverlay;
