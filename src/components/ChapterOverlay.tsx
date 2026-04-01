import { useState, useEffect } from "react";
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
      <img src={chapterImages[chapter.image]} alt="Archil" className="w-10 h-10 object-cover"
        style={{ border: `1px solid ${chapter.color}30` }} />
    );
  }
  if (chapter.brandLogo === "Career") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1" style={{ background: `${chapter.color}08`, border: `1px solid ${chapter.color}15` }}>
        <img src={careerLogos.RBC} alt="RBC" className="h-5 object-contain" />
        <span style={{ color: "#475569", fontSize: 9 }}>+</span>
        <img src={careerLogos.BMO} alt="BMO" className="h-5 object-contain" />
      </span>
    );
  }
  if (chapter.brandLogo && brandLogos[chapter.brandLogo]) {
    return (
      <span className="inline-flex items-center px-2 py-1" style={{ background: `${chapter.color}08`, border: `1px solid ${chapter.color}15` }}>
        <img src={brandLogos[chapter.brandLogo]} alt={chapter.brandLogo} className="h-5 object-contain" />
      </span>
    );
  }
  return <span className="text-3xl">{chapter.icon}</span>;
};

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
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
          className="inline-block w-[1.5px] h-[13px] ml-0.5 align-middle"
          style={{ background: "hsl(222 47% 11% / 0.3)" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
      ) : '"'}
    </span>
  );
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, hsl(210 40% 98% / 0.97) 0%, hsl(210 40% 98% / 0.7) 40%, transparent 100%)",
            }}
          />

          <div className="relative px-6 md:px-16 pb-8 md:pb-12 pt-24 md:pt-36 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-3 flex-wrap"
            >
              <BrandBadge chapter={chapter} />
              <span
                className="font-mono text-mono-xs uppercase tracking-[0.2em] px-2 py-0.5"
                style={{
                  color: chapter.color,
                  borderBottom: `1px solid ${chapter.color}40`,
                }}
              >
                {categoryLabels[chapter.category] || "Career"}
              </span>
              <span className="font-mono text-mono-xs" style={{ color: "#475569" }}>
                {chapter.year}
              </span>
            </motion.div>

            <motion.h2
              className="font-display text-display-lg md:text-display-hero font-bold mb-2"
              style={{ color: "#0F172A" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {chapter.title}
            </motion.h2>

            <motion.p
              className="font-mono text-mono-xs uppercase tracking-[0.2em] mb-3"
              style={{ color: "#475569" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {chapter.subtitle}
            </motion.p>

            <motion.div
              className="font-display text-sm md:text-base leading-relaxed mb-6 max-w-md"
              style={{ color: "hsl(215 16% 47% / 0.7)", fontStyle: "italic" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <TypewriterText text={chapter.tagline} delay={0.6} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChapterOverlay;