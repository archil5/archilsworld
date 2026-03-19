import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Experience from "@/components/Experience";
import meepleImg from "@/assets/meeple.png";

const IntroScreen = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden paper-grain"
      style={{ background: "#E8E0D0" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Canvas texture */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/images/parchment-bg.jpg')",
          backgroundSize: "cover",
          mixBlendMode: "multiply",
        }}
      />

      {/* Cartographer's grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(hsl(220 30% 10% / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(220 30% 10% / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      {/* Hex marks — faint cartographic reference */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 1200 800">
        {[
          [100, 150], [300, 50], [500, 200], [700, 100], [900, 250], [1100, 150],
          [200, 400], [400, 350], [600, 450], [800, 380], [1000, 420],
          [150, 650], [350, 600], [550, 700], [750, 620], [950, 680],
        ].map(([x, y], i) => (
          <motion.polygon
            key={i}
            points="30,0 60,17 60,52 30,69 0,52 0,17"
            transform={`translate(${x},${y})`}
            fill="none"
            stroke="hsl(220 30% 10%)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-xl">
        {/* Meeple */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <img src={meepleImg} alt="Game piece" className="w-14 h-14 object-contain animate-float-piece" style={{ filter: "drop-shadow(0 3px 8px hsl(220 30% 10% / 0.15))" }} />
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-display text-display-hero font-bold mb-4"
          style={{ color: "hsl(220, 30%, 10%)" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Archil Patel
        </motion.h1>

        {/* Hand-drawn line separator */}
        <motion.svg
          viewBox="0 0 200 6" className="w-32 mb-5"
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <path d="M0 3 Q 40 0, 80 3 T 160 3 T 200 3" fill="none" stroke="hsl(144, 14%, 55%)" strokeWidth="1.5" />
        </motion.svg>

        <motion.p
          className="font-mono text-mono-sm uppercase tracking-[0.3em] mb-10"
          style={{ color: "hsl(144, 14%, 55%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Principal Cloud Engineer
        </motion.p>

        {/* Brief ethos */}
        <motion.div
          className="px-6 py-5 mb-10 max-w-sm"
          style={{
            background: "hsl(220 30% 10% / 0.03)",
            borderLeft: "2px solid hsl(144 14% 55% / 0.3)",
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="font-display text-base leading-relaxed italic" style={{ color: "hsl(220, 12%, 38%)" }}>
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
              className="font-mono text-mono-xs uppercase tracking-[0.15em] px-3 py-1.5"
              style={{
                color: "hsl(220, 12%, 38%)",
                borderBottom: "1px solid hsl(144 14% 55% / 0.25)",
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
          className="group relative px-10 py-4 font-display text-display-sm tracking-[0.15em] uppercase transition-all"
          style={{
            color: "#E8E0D0",
            background: "hsl(220, 30%, 10%)",
            border: "1px solid hsl(220 30% 10% / 0.8)",
          }}
          whileHover={{
            background: "hsl(220, 30%, 15%)",
          }}
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
          style={{ color: "hsl(220 12% 38% / 0.35)" }}
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