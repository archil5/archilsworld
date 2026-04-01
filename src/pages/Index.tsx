import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Experience from "@/components/Experience";
import meepleImg from "@/assets/meeple.png";

const IntroScreen = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "#F8FAFC" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(hsl(222 47% 11% / 0.15) 1px, transparent 1px),
          linear-gradient(90deg, hsl(222 47% 11% / 0.15) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-xl">
        {/* Meeple */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <img src={meepleImg} alt="Game piece" className="w-14 h-14 object-contain animate-float-piece" style={{ filter: "drop-shadow(0 3px 8px hsl(222 47% 11% / 0.12))" }} />
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-display text-display-hero font-bold mb-4"
          style={{ color: "#0F172A" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Archil Patel
        </motion.h1>

        {/* Separator */}
        <motion.div
          className="w-16 h-0.5 mb-5 rounded-full"
          style={{ background: "#0D9488" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        />

        <motion.p
          className="font-mono text-mono-sm uppercase tracking-[0.3em] mb-10"
          style={{ color: "#0D9488" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Principal Cloud Engineer
        </motion.p>

        {/* Brief ethos */}
        <motion.div
          className="px-6 py-5 mb-10 max-w-sm rounded-lg"
          style={{
            background: "hsl(222 47% 11% / 0.03)",
            borderLeft: "3px solid hsl(174 83% 32% / 0.4)",
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="font-display text-base leading-relaxed italic" style={{ color: "#475569" }}>
            I take things apart to understand how they work — then build them back better.
            This portfolio is my game board. Each tile is a chapter.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {["Problem Solver", "Builder", "Strategic Thinker", "Cloud"].map((tag, i) => (
            <motion.span
              key={tag}
              className="font-mono text-mono-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded"
              style={{
                color: "#475569",
                background: "hsl(222 47% 11% / 0.04)",
                borderBottom: "2px solid hsl(174 83% 32% / 0.2)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 + i * 0.1 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Enter */}
        <motion.button
          onClick={onEnter}
          className="group relative px-10 py-4 font-display text-display-sm tracking-[0.15em] uppercase transition-all rounded-lg"
          style={{
            color: "#F8FAFC",
            background: "#0F172A",
          }}
          whileHover={{ background: "#1E293B" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="flex items-center gap-3">
            Begin the Journey
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        <motion.p
          className="font-mono text-mono-xs mt-8 tracking-wider"
          style={{ color: "hsl(215 16% 47% / 0.4)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          scroll · click · explore · esc to return
        </motion.p>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!entered && <IntroScreen onEnter={() => setEntered(true)} />}
      </AnimatePresence>
      {entered && <Experience />}
    </>
  );
};

export default Index;
