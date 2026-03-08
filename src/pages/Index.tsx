import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Experience from "@/components/Experience";
import meepleImg from "@/assets/meeple.png";

const boardFacts = [
  "I've been obsessed with board games since I could roll dice",
  "Every career move felt like placing a tile on a grand strategy board",
  "Puzzles taught me that complexity is just simplicity layered",
  "This portfolio is my game board — scroll through my journey",
];

const IntroScreen = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "#2d2a26" }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Parchment texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/images/parchment-bg.jpg')",
          backgroundSize: "cover",
          mixBlendMode: "overlay",
        }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(rgba(181,101,58,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(181,101,58,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Hex decorations */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 800">
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
            stroke="#b5653a"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        {/* Meeple icon */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          className="mb-6"
        >
          <img src={meepleImg} alt="Game piece" className="w-16 h-16 object-contain animate-float-piece" style={{ filter: "drop-shadow(0 4px 12px rgba(181,101,58,0.3))" }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-4xl md:text-6xl font-bold tracking-wider mb-3"
          style={{ color: "#f5f0e8" }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Archil Patel
        </motion.h1>

        <motion.div
          className="w-24 h-0.5 rounded-full mb-4"
          style={{ background: "linear-gradient(to right, transparent, #b5653a, transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />

        <motion.p
          className="font-display text-sm md:text-base tracking-[0.25em] uppercase mb-8"
          style={{ color: "#b5653a" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Principal Cloud Engineer
        </motion.p>

        {/* Board game disclaimer */}
        <motion.div
          className="rounded-xl px-6 py-5 mb-8 max-w-md"
          style={{
            background: "rgba(181,101,58,0.08)",
            border: "1px solid rgba(181,101,58,0.2)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: "#b5653a" }}>
            Why a Board Game?
          </p>
          <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(245,240,232,0.7)" }}>
            I've always loved board games, puzzles, and riddles — the thrill of solving complex problems
            one move at a time. This portfolio is my personal game board. Each tile is a chapter.
            Each world is a story. Scroll through my journey like you'd explore a strategy map.
          </p>
        </motion.div>

        {/* Facts ticker */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {["Board Games", "Puzzles", "Riddles", "Strategy", "Cloud"].map((tag, i) => (
            <motion.span
              key={tag}
              className="text-[11px] font-mono px-3 py-1.5 rounded-full"
              style={{
                color: "#d4a574",
                border: "1px solid rgba(181,101,58,0.25)",
                background: "rgba(181,101,58,0.06)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.08 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Enter button */}
        <motion.button
          onClick={onEnter}
          className="group relative px-10 py-4 rounded-xl font-display text-base tracking-[0.15em] uppercase cursor-pointer transition-all"
          style={{
            color: "#f5f0e8",
            background: "linear-gradient(135deg, #b5653a, #8b4a2a)",
            border: "1px solid rgba(212,165,116,0.3)",
            boxShadow: "0 4px 20px rgba(181,101,58,0.25)",
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 30px rgba(181,101,58,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <span className="flex items-center gap-3">
            🎯 Begin the Journey
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        <motion.p
          className="text-[10px] font-mono mt-6"
          style={{ color: "rgba(245,240,232,0.25)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          Scroll through tiles · Click to explore worlds · Press ESC to return
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
