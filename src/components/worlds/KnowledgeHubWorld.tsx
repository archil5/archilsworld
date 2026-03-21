import { useState } from "react";
import { motion } from "framer-motion";
// Icons replaced with distinctive emoji for a unique feel
import CandlestickModule from "@/components/knowledge/CandlestickModule";
import StockBasicsModule from "@/components/knowledge/StockBasicsModule";
import CloudPatternsModule from "@/components/knowledge/CloudPatternsModule";
import SystemDesignModule from "@/components/knowledge/SystemDesignModule";
import MentalModelsModule from "@/components/knowledge/MentalModelsModule";

const INK = "#0F172A";
const INK_MUTED = "#64748B";
const COPPER = "#0D9488";

interface KnowledgeModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  ready: boolean;
}

const MODULES: KnowledgeModule[] = [
  {
    id: "stock-basics",
    title: "Stock Market 101",
    description: "New to investing? Start here. A plain-English mini-course covering what stocks are, how the market works, and how to get started.",
    icon: "📊",
    tags: ["Finance", "Beginner"],
    ready: true,
  },
  {
    id: "candlestick",
    title: "Candlestick Patterns",
    description: "35+ candlestick patterns for trading — visual diagrams, simple explanations, and practical trade tips.",
    icon: "🕯️",
    tags: ["Finance", "Trading"],
    ready: true,
  },
  {
    id: "cloud-patterns",
    title: "Cloud Architecture Patterns",
    description: "10 battle-tested patterns from enterprise cloud engineering — event sourcing, CQRS, saga orchestration, circuit breakers, and more. Written from production experience.",
    icon: "☁️",
    tags: ["Cloud", "Architecture"],
    ready: true,
  },
  {
    id: "system-design",
    title: "System Design Essentials",
    description: "Core system design concepts explained by a practitioner — load balancing, caching, sharding, rate limiting, and more. Not textbook summaries — real trade-offs from real systems.",
    icon: "⚙️",
    tags: ["Engineering", "Interviews"],
    ready: true,
  },
  {
    id: "mental-models",
    title: "Mental Models & Puzzles",
    description: "Thinking frameworks from first principles to inversion, plus interactive logic puzzles and mathematical reasoning challenges. The kind of thing that makes you stop and think.",
    icon: "🧩",
    tags: ["Thinking", "Puzzles"],
    ready: true,
  },
];

const KnowledgeHubWorld = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (activeModule === "candlestick") return <CandlestickModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "stock-basics") return <StockBasicsModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "cloud-patterns") return <CloudPatternsModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "system-design") return <SystemDesignModule onBack={() => setActiveModule(null)} />;
  if (activeModule === "mental-models") return <MentalModelsModule onBack={() => setActiveModule(null)} />;

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8" style={{ background: "#F8FAFC" }}>
      <motion.div className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

        <div className="text-center mb-10">
          <h2 className="font-display text-display-md md:text-display-lg mb-3" style={{ color: INK }}>
            Knowledge Center
          </h2>
          <p className="font-mono text-mono-sm max-w-sm mx-auto" style={{ color: INK_MUTED }}>
            Interactive guides on topics I find fascinating. Pick a module and dive in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {MODULES.map((mod, i) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => mod.ready && setActiveModule(mod.id)}
              disabled={!mod.ready}
              className="relative text-left p-5 md:p-6 transition-all group disabled:cursor-default"
              style={{
                background: `${INK}02`,
                border: `1px solid ${INK}06`,
              }}
              whileHover={mod.ready ? { y: -2, rotate: 0.5 } : {}}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center shrink-0 text-2xl rounded-lg"
                  style={{ background: `${COPPER}10` }}>
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base md:text-lg mb-1" style={{ color: INK }}>
                    {mod.title}
                  </h3>
                  <p className="font-mono text-mono-xs leading-relaxed mb-3" style={{ color: INK_MUTED }}>
                    {mod.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {mod.tags.map(tag => (
                      <span key={tag} className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                        style={{ borderBottom: `1px solid ${INK}10`, color: INK_MUTED }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {mod.ready && (
                <div className="absolute bottom-3 right-4 font-mono text-mono-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: COPPER }}>
                  Open →
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default KnowledgeHubWorld;
