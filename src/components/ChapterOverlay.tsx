import { motion, AnimatePresence } from "framer-motion";
import type { ChapterData } from "@/data/chapters";

interface ChapterOverlayProps {
  chapter: ChapterData;
  visible: boolean;
}

const ChapterOverlay = ({ chapter, visible }: ChapterOverlayProps) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={chapter.id}
          className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Gradient backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(26,19,11,0.95) 0%, rgba(26,19,11,0.7) 40%, transparent 100%)",
            }}
          />

          <div className="relative px-8 md:px-16 pb-10 pt-32 max-w-3xl">
            {/* Chapter number / category */}
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
                {chapter.category === "origin"
                  ? "Origin Story"
                  : chapter.category === "education"
                  ? "Education"
                  : chapter.category === "current"
                  ? "Present Day"
                  : "Career"}
              </span>
              <span className="text-xs font-mono" style={{ color: "rgba(232,196,96,0.4)" }}>
                {chapter.year}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="font-display text-3xl md:text-5xl font-bold mb-2"
              style={{ color: "#f0e6d0" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {chapter.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="font-display text-xs uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(232,196,96,0.6)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {chapter.subtitle}
            </motion.p>

            {/* Narrative */}
            <motion.p
              className="font-body text-base md:text-lg leading-relaxed max-w-2xl mb-5"
              style={{ color: "rgba(240,230,208,0.75)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {chapter.narrative}
            </motion.p>

            {/* Skills */}
            {chapter.skills && (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {chapter.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2.5 py-1 rounded"
                    style={{
                      color: "rgba(232,196,96,0.7)",
                      background: "rgba(232,196,96,0.08)",
                      border: "1px solid rgba(232,196,96,0.15)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChapterOverlay;
