import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CandlestickModule from "@/components/knowledge/CandlestickModule";
import StockBasicsModule from "@/components/knowledge/StockBasicsModule";
import CloudPatternsModule from "@/components/knowledge/CloudPatternsModule";
import SystemDesignModule from "@/components/knowledge/SystemDesignModule";
import MentalModelsModule from "@/components/knowledge/MentalModelsModule";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

interface KnowledgeModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  ready: boolean;
  color: string;
  items: number;
  itemLabel: string;
}

const MODULES: KnowledgeModule[] = [
  {
    id: "stock-basics",
    title: "Stock Market 101",
    description: "New to investing? Start here. Plain-English mini-course on stocks, markets, and getting started.",
    icon: "📊",
    tags: ["Finance", "Beginner"],
    ready: true,
    color: "#0D9488",
    items: 10,
    itemLabel: "lessons",
  },
  {
    id: "candlestick",
    title: "Candlestick Patterns",
    description: "35+ patterns with visual diagrams, explanations, and practical trade tips.",
    icon: "🕯️",
    tags: ["Finance", "Trading"],
    ready: true,
    color: "#D97706",
    items: 35,
    itemLabel: "patterns",
  },
  {
    id: "cloud-patterns",
    title: "Cloud Architecture",
    description: "Battle-tested patterns from enterprise cloud engineering — event sourcing, CQRS, saga orchestration, and more.",
    icon: "☁️",
    tags: ["Cloud", "Architecture"],
    ready: true,
    color: "#2563EB",
    items: 10,
    itemLabel: "patterns",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Core concepts explained by a practitioner — load balancing, caching, sharding, rate limiting.",
    icon: "⚙️",
    tags: ["Engineering", "Interviews"],
    ready: true,
    color: "#7C3AED",
    items: 10,
    itemLabel: "topics",
  },
  {
    id: "mental-models",
    title: "Mental Models & Puzzles",
    description: "Thinking frameworks plus interactive logic puzzles. The kind of thing that makes you stop and think.",
    icon: "🧩",
    tags: ["Thinking", "Puzzles"],
    ready: true,
    color: "#DC2626",
    items: 16,
    itemLabel: "challenges",
  },
];

// Animated floating particles for visual interest
const FloatingDots = ({ color }: { color: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 3 + Math.random() * 4,
          height: 3 + Math.random() * 4,
          background: `${color}20`,
          left: `${15 + Math.random() * 70}%`,
          top: `${15 + Math.random() * 70}%`,
        }}
        animate={{
          y: [0, -8, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2.5 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const KnowledgeHubWorld = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (activeModule === "candlestick") return <CandlestickModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "stock-basics") return <StockBasicsModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "cloud-patterns") return <CloudPatternsModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "system-design") return <SystemDesignModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "mental-models") return <MentalModelsModule onBack={() => setActiveModule(null)} />;

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8" style={{ background: "#F8FAFC" }}>
      <motion.div className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

        {/* Header with animated accent line */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full"
            style={{ background: `${COPPER}10`, border: `1px solid ${COPPER}20` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full"
              style={{ background: COPPER }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="font-mono text-mono-xs uppercase tracking-[0.2em]" style={{ color: COPPER }}>
              Interactive Guides
            </span>
          </motion.div>

          <h2 className="font-display text-display-md md:text-display-lg mb-3" style={{ color: INK }}>
            Knowledge Center
          </h2>
          <p className="font-mono text-mono-sm max-w-md mx-auto leading-relaxed" style={{ color: INK_MUTED }}>
            Deep dives into topics I find fascinating — written from real experience, not textbooks.
            Pick a module and explore.
          </p>

          {/* Stats bar */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { label: "Modules", value: MODULES.length },
              { label: "Topics", value: MODULES.reduce((s, m) => s + m.items, 0) },
              { label: "Interactive", value: "100%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-lg font-bold" style={{ color: INK }}>{stat.value}</p>
                <p className="font-mono text-mono-xs uppercase tracking-[0.15em]" style={{ color: INK_MUTED }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {MODULES.map((mod, i) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => mod.ready && setActiveModule(mod.id)}
              onMouseEnter={() => setHoveredId(mod.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={!mod.ready}
              className="relative text-left p-5 md:p-6 transition-all group disabled:cursor-default overflow-hidden"
              style={{
                background: hoveredId === mod.id ? `${mod.color}06` : `${INK}02`,
                border: `1px solid ${hoveredId === mod.id ? `${mod.color}25` : `${INK}08`}`,
                transform: hoveredId === mod.id ? `rotate(${i % 2 === 0 ? 0.8 : -0.8}deg)` : 'rotate(0deg)',
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Floating particles on hover */}
              {hoveredId === mod.id && <FloatingDots color={mod.color} />}

              {/* Color accent bar */}
              <motion.div
                className="absolute top-0 left-0 w-full h-0.5"
                style={{ background: mod.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredId === mod.id ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="relative z-10 flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 flex items-center justify-center shrink-0 text-2xl rounded-lg"
                  style={{
                    background: `${mod.color}10`,
                    border: `1px solid ${mod.color}15`,
                  }}
                  animate={hoveredId === mod.id ? { scale: [1, 1.08, 1], rotate: [0, 3, 0] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {mod.icon}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base md:text-lg mb-1 font-semibold" style={{ color: INK }}>
                    {mod.title}
                  </h3>
                  <p className="font-mono text-mono-xs leading-relaxed mb-3" style={{ color: INK_MUTED }}>
                    {mod.description}
                  </p>

                  {/* Tags + count */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {mod.tags.map(tag => (
                      <span key={tag} className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                        style={{ borderBottom: `1px solid ${mod.color}20`, color: INK_MUTED }}>
                        {tag}
                      </span>
                    ))}
                    <span className="font-mono text-mono-xs ml-auto" style={{ color: mod.color }}>
                      {mod.items} {mod.itemLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explore prompt */}
              {mod.ready && (
                <motion.div
                  className="absolute bottom-3 right-4 font-mono text-mono-xs tracking-wider flex items-center gap-1"
                  style={{ color: mod.color }}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: hoveredId === mod.id ? 1 : 0, x: hoveredId === mod.id ? 0 : 5 }}
                  transition={{ duration: 0.3 }}
                >
                  Explore
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >→</motion.span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center font-mono text-mono-xs mt-8 leading-relaxed"
          style={{ color: INK_MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          All content written from first-hand experience building production systems at scale.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default KnowledgeHubWorld;
