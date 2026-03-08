import { motion, AnimatePresence } from "framer-motion";
import type { ChapterData } from "@/data/chapters";
import { brandLogos, careerLogos, chapterImages } from "@/data/brandLogos";

interface ChapterOverlayProps {
  chapter: ChapterData;
  visible: boolean;
  onDive?: () => void;
}

const categoryLabels: Record<string, string> = {
  origin: "Origin Story",
  education: "Education",
  career: "Career",
  current: "Present Day",
};

const BrandBadge = ({ chapter }: { chapter: ChapterData }) => {
  if (chapter.image && chapterImages[chapter.image]) {
    return (
      <img src={chapterImages[chapter.image]} alt="Archil" className="w-10 h-10 rounded-full object-cover"
        style={{ border: `2px solid ${chapter.color}40` }} />
    );
  }
  if (chapter.brandLogo === "Career") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}25` }}>
        <img src={careerLogos.RBC} alt="RBC" className="h-5 object-contain" />
        <span style={{ color: "#999", fontSize: 9 }}>+</span>
        <img src={careerLogos.BMO} alt="BMO" className="h-5 object-contain" />
      </span>
    );
  }
  if (chapter.brandLogo && brandLogos[chapter.brandLogo]) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded" style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}25` }}>
        <img src={brandLogos[chapter.brandLogo]} alt={chapter.brandLogo} className="h-5 object-contain" />
      </span>
    );
  }
  return <span className="text-3xl">{chapter.icon}</span>;
};

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
              background: "linear-gradient(to top, rgba(245,240,232,0.97) 0%, rgba(245,240,232,0.75) 40%, transparent 100%)",
            }}
          />

          <div className="relative px-8 md:px-16 pb-10 pt-32 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3 mb-3"
            >
              <BrandBadge chapter={chapter} />
              <span
                className="text-[10px] font-display uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                style={{
                  color: chapter.color,
                  border: `1px solid ${chapter.color}30`,
                  background: `${chapter.color}10`,
                }}
              >
                {categoryLabels[chapter.category] || "Career"}
              </span>
              <span className="text-xs font-mono" style={{ color: "#6b6560" }}>
                {chapter.year}
              </span>
            </motion.div>

            <motion.h2
              className="font-display text-3xl md:text-5xl font-bold mb-2"
              style={{ color: "#2d2a26" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {chapter.title}
            </motion.h2>

            <motion.p
              className="font-display text-xs uppercase tracking-[0.2em] mb-3"
              style={{ color: "#6b6560" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {chapter.subtitle}
            </motion.p>

            <motion.p
              className="font-body text-sm leading-relaxed mb-5 max-w-md"
              style={{ color: "rgba(45,42,38,0.6)", fontStyle: "italic" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              "{chapter.tagline}"
            </motion.p>

            {onDive && (
              <motion.button
                onClick={onDive}
                className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: `${chapter.color}12`,
                  border: `1px solid ${chapter.color}35`,
                  color: chapter.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${chapter.color}22`;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${chapter.color}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${chapter.color}12`;
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
