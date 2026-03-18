import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Cloud, Cpu, BookOpen } from "lucide-react";
import CandlestickModule from "@/components/knowledge/CandlestickModule";

interface KnowledgeModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  ready: boolean;
}

const MODULES: KnowledgeModule[] = [
  {
    id: "candlestick",
    title: "Candlestick Patterns",
    description: "20 essential candlestick patterns for stock & crypto trading — visual diagrams, plain English, and trade tips.",
    icon: <TrendingUp size={24} />,
    tags: ["Finance", "Trading"],
    ready: true,
  },
  {
    id: "cloud-patterns",
    title: "Cloud Architecture Patterns",
    description: "Common cloud architecture patterns — from event sourcing to CQRS to saga orchestration.",
    icon: <Cloud size={24} />,
    tags: ["Cloud", "Architecture"],
    ready: false,
  },
  {
    id: "system-design",
    title: "System Design Essentials",
    description: "Core system design concepts — load balancing, caching strategies, database sharding, and more.",
    icon: <Cpu size={24} />,
    tags: ["Engineering", "Interviews"],
    ready: false,
  },
  {
    id: "mental-models",
    title: "Mental Models",
    description: "Thinking frameworks from first principles to inversion — tools for better decisions.",
    icon: <BookOpen size={24} />,
    tags: ["Thinking", "Leadership"],
    ready: false,
  },
];

const KnowledgeHubWorld = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (activeModule === "candlestick") {
    return <CandlestickModule onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6"
      style={{ background: "linear-gradient(180deg, #faf8f4 0%, #f0ebe3 100%)" }}>

      <motion.div className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl mb-2" style={{ color: "#2d2a26" }}>
            📚 Knowledge Center
          </h2>
          <p className="font-body text-xs md:text-sm max-w-md mx-auto" style={{ color: "#6b6560" }}>
            Interactive guides on topics I find fascinating. Pick a module and dive in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {MODULES.map((mod, i) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              onClick={() => mod.ready && setActiveModule(mod.id)}
              disabled={!mod.ready}
              className="relative text-left p-5 md:p-6 rounded-xl transition-all cursor-pointer group disabled:cursor-default"
              style={{
                background: "rgba(255,252,248,0.8)",
                border: "1px solid rgba(180,140,100,0.2)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
              whileHover={mod.ready ? { y: -2, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" } : {}}
            >
              {!mod.ready && (
                <span className="absolute top-3 right-3 text-[9px] font-display uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(180,140,100,0.1)", color: "#8a8078", border: "1px solid rgba(180,140,100,0.15)" }}>
                  Coming Soon
                </span>
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: mod.ready ? "rgba(42,125,95,0.1)" : "rgba(180,140,100,0.08)",
                    color: mod.ready ? "#2a7d5f" : "#8a8078",
                  }}>
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm md:text-base mb-1"
                    style={{ color: mod.ready ? "#2d2a26" : "#8a8078" }}>
                    {mod.title}
                  </h3>
                  <p className="font-body text-[11px] md:text-xs leading-relaxed mb-2"
                    style={{ color: "#6b6560", opacity: mod.ready ? 1 : 0.6 }}>
                    {mod.description}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {mod.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-display uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(180,140,100,0.08)", color: "#8a8078", border: "1px solid rgba(180,140,100,0.1)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {mod.ready && (
                <div className="absolute bottom-3 right-4 text-[10px] font-display tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#2a7d5f" }}>
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
