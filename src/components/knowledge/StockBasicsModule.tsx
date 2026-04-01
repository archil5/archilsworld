import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STOCK_BASICS, type StockBasicsTopic } from "@/data/stockBasics";
import StockVisual from "./diagrams/StockVisual";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

interface StockBasicsModuleProps {
  onBack: () => void;
}

const StockBasicsModule = ({ onBack }: StockBasicsModuleProps) => {
  const [activeTopic, setActiveTopic] = useState<StockBasicsTopic | null>(null);

  if (activeTopic) {
    return (
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => setActiveTopic(null)}
            className="flex items-center gap-2 px-3 py-1.5 transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <span className="font-mono text-mono-xs tracking-wider">Topics</span>
          </button>
          <h2 className="font-display text-display-sm" style={{ color: INK }}>
            {activeTopic.icon} {activeTopic.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {activeTopic.content.map((paragraph, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="p-4 md:p-5"
                style={{
                  background: `${INK}02`,
                  borderLeft: `2px solid ${COPPER}20`,
                }}
              >
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center font-mono text-mono-xs"
                    style={{ background: `${COPPER}10`, color: COPPER }}>
                    {i + 1}
                  </span>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>
                    {paragraph}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
            <button
              onClick={() => {
                const idx = STOCK_BASICS.findIndex(t => t.id === activeTopic.id);
                if (idx > 0) { setActiveTopic(STOCK_BASICS[idx - 1]); }
              }}
              disabled={STOCK_BASICS.findIndex(t => t.id === activeTopic.id) === 0}
              className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 disabled:cursor-default transition-all"
              style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
              ← Prev
            </button>
            <span className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
              {STOCK_BASICS.findIndex(t => t.id === activeTopic.id) + 1} / {STOCK_BASICS.length}
            </span>
            <button
              onClick={() => {
                const idx = STOCK_BASICS.findIndex(t => t.id === activeTopic.id);
                if (idx < STOCK_BASICS.length - 1) { setActiveTopic(STOCK_BASICS[idx + 1]); }
              }}
              disabled={STOCK_BASICS.findIndex(t => t.id === activeTopic.id) === STOCK_BASICS.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 disabled:cursor-default transition-all"
              style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 mb-6 flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="font-mono text-mono-xs tracking-wider">Hub</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-display-md mb-3" style={{ color: INK }}>
            Stock Market 101
          </h2>
          <p className="font-mono text-mono-sm max-w-md mx-auto" style={{ color: INK_MUTED }}>
            Everything you need to know to get started — explained like you're a smart friend asking over coffee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {STOCK_BASICS.map((topic, i) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setActiveTopic(topic)}
              className="text-left p-4 md:p-5 transition-all group"
              style={{
                background: `${INK}02`,
                border: `1px solid ${INK}06`,
              }}
              whileHover={{ y: -2, rotate: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base mb-0.5" style={{ color: INK }}>
                    {topic.title}
                  </h3>
                  <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
                    {topic.content.length} cards
                  </p>
                </div>
                <span className="font-mono text-mono-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: COPPER }}>→</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-10 text-center p-4"
          style={{ background: `${INK}03`, borderTop: `1px solid ${INK}06` }}>
          <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
            ⚠ This is educational content, not financial advice. Always do your own research before investing.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StockBasicsModule;