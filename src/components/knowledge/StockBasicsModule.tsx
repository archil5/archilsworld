import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { STOCK_BASICS, type StockBasicsTopic } from "@/data/stockBasics";

interface StockBasicsModuleProps {
  onBack: () => void;
}

const StockBasicsModule = ({ onBack }: StockBasicsModuleProps) => {
  const [activeTopic, setActiveTopic] = useState<StockBasicsTopic | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (activeTopic) {
    return (
      <div className="h-full flex flex-col"
        style={{ background: "linear-gradient(180deg, #faf8f4 0%, #f0ebe3 100%)" }}>

        {/* Header */}
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(180,140,100,0.15)" }}>
          <button onClick={() => setActiveTopic(null)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}>
            <ArrowLeft size={14} />
            <span className="text-[10px] md:text-xs font-display tracking-wider">Topics</span>
          </button>
          <h2 className="font-display text-sm md:text-lg" style={{ color: "#2d2a26" }}>
            {activeTopic.icon} {activeTopic.title}
          </h2>
        </div>

        {/* Content cards */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {activeTopic.content.map((paragraph, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-4 md:p-5 rounded-xl"
                style={{
                  background: "rgba(255,252,248,0.85)",
                  border: "1px solid rgba(180,140,100,0.18)",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display"
                    style={{ background: "rgba(42,125,95,0.1)", color: "#2a7d5f" }}>
                    {i + 1}
                  </span>
                  <p className="font-body text-xs md:text-sm leading-relaxed" style={{ color: "#2d2a26" }}>
                    {paragraph}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick nav between topics */}
          <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
            <button
              onClick={() => {
                const idx = STOCK_BASICS.findIndex(t => t.id === activeTopic.id);
                if (idx > 0) { setActiveTopic(STOCK_BASICS[idx - 1]); }
              }}
              disabled={STOCK_BASICS.findIndex(t => t.id === activeTopic.id) === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-display tracking-wider cursor-pointer disabled:opacity-30 disabled:cursor-default transition-all"
              style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}>
              <ChevronLeft size={12} /> Prev Topic
            </button>
            <span className="text-[9px] font-mono" style={{ color: "#8a8078" }}>
              {STOCK_BASICS.findIndex(t => t.id === activeTopic.id) + 1} / {STOCK_BASICS.length}
            </span>
            <button
              onClick={() => {
                const idx = STOCK_BASICS.findIndex(t => t.id === activeTopic.id);
                if (idx < STOCK_BASICS.length - 1) { setActiveTopic(STOCK_BASICS[idx + 1]); }
              }}
              disabled={STOCK_BASICS.findIndex(t => t.id === activeTopic.id) === STOCK_BASICS.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-display tracking-wider cursor-pointer disabled:opacity-30 disabled:cursor-default transition-all"
              style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}>
              Next Topic <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6"
      style={{ background: "linear-gradient(180deg, #faf8f4 0%, #f0ebe3 100%)" }}>

      {/* Header */}
      <div className="shrink-0 mb-6 flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
          style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}>
          <ArrowLeft size={14} />
          <span className="text-[10px] md:text-xs font-display tracking-wider">Hub</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-display text-xl md:text-2xl mb-2" style={{ color: "#2d2a26" }}>
            📈 Stock Market 101
          </h2>
          <p className="font-body text-xs md:text-sm max-w-md mx-auto" style={{ color: "#6b6560" }}>
            Everything you need to know to get started — explained like you're a smart friend asking over coffee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {STOCK_BASICS.map((topic, i) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setActiveTopic(topic)}
              className="text-left p-4 md:p-5 rounded-xl transition-all cursor-pointer group"
              style={{
                background: "rgba(255,252,248,0.85)",
                border: "1px solid rgba(180,140,100,0.18)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
              }}
              whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xs md:text-sm mb-0.5" style={{ color: "#2d2a26" }}>
                    {topic.title}
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-mono" style={{ color: "#8a8078" }}>
                    {topic.content.length} cards
                  </p>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  style={{ color: "#2a7d5f" }} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-8 text-center p-3 rounded-lg"
          style={{ background: "rgba(180,140,100,0.06)", border: "1px solid rgba(180,140,100,0.1)" }}>
          <p className="text-[9px] md:text-[10px] font-body" style={{ color: "#8a8078" }}>
            ⚠️ This is educational content, not financial advice. Always do your own research before investing real money.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StockBasicsModule;
