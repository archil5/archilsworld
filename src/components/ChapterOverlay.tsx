import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChapterData } from "@/data/chapters";
import { brandLogos, careerLogos, chapterImages } from "@/data/brandLogos";
import type { ProgressiveTheme } from "@/hooks/useProgressiveTheme";
import { useProgressiveTheme } from "@/hooks/useProgressiveTheme";

interface ChapterOverlayProps {
  chapter: ChapterData;
  visible: boolean;
  onDive?: () => void;
  theme?: ProgressiveTheme;
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

const TypewriterText = ({ text, delay = 0, cursorColor }: { text: string; delay?: number; cursorColor?: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 28 + Math.random() * 22);
    return () => clearTimeout(timer);
  }, [displayed, text, started]);

  return (
    <span>
      "{displayed}
      {displayed.length < text.length ? (
        <motion.span
          className="inline-block w-[2px] h-[14px] ml-0.5 align-middle"
          style={{ background: cursorColor || "rgba(45,42,38,0.4)" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
      ) : '"'}
    </span>
  );
};

const ChapterOverlay = ({ chapter, visible, onDive, theme }: ChapterOverlayProps) => {
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
              background: `linear-gradient(to top, ${theme.surfaceAlpha} 0%, ${theme.surface.replace("0.97", "0.75")} 40%, transparent 100%)`,
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
              <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
                {chapter.year}
              </span>
            </motion.div>

            <motion.h2
              className="font-display text-3xl md:text-5xl font-bold mb-2 transition-colors duration-700"
              style={{ color: theme.text }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {chapter.title}
            </motion.h2>

            <motion.p
              className="font-display text-xs uppercase tracking-[0.2em] mb-3 transition-colors duration-700"
              style={{ color: theme.textMuted }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {chapter.subtitle}
            </motion.p>

            <motion.div
              className="font-body text-sm leading-relaxed mb-5 max-w-md"
              style={{ color: theme.textMuted, fontStyle: "italic" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <TypewriterText text={chapter.tagline} delay={0.6} cursorColor={theme.textMuted} />
            </motion.div>

            {onDive && (
              <motion.button
                onClick={onDive}
                className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: `${chapter.color}12`,
                  border: `1px solid ${chapter.color}35`,
                  color: theme.isDark ? "#f0ebe3" : chapter.color,
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
