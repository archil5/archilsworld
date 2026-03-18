import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import {
  CANDLESTICK_PATTERNS,
  PATTERN_CATEGORIES,
  type PatternCategory,
  type CandlestickPattern,
} from "@/data/candlestickPatterns";

const CandleSVG = ({ pattern }: { pattern: CandlestickPattern }) => {
  const { candles } = pattern;
  const candleWidth = 18;
  const gap = 12;
  const totalW = candles.length * candleWidth + (candles.length - 1) * gap;
  const svgW = Math.max(totalW + 24, 80);
  const svgH = 90;
  const padY = 8;
  const scale = (v: number) => padY + ((100 - v) / 100) * (svgH - padY * 2);

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[25, 50, 75].map(v => (
        <line key={v} x1={0} y1={scale(v)} x2={svgW} y2={scale(v)}
          stroke="rgba(180,140,100,0.12)" strokeWidth={0.5} strokeDasharray="3,3" />
      ))}
      {candles.map((c, i) => {
        const x = (svgW - totalW) / 2 + i * (candleWidth + gap);
        const isBullish = c.c >= c.o;
        const bodyTop = scale(Math.max(c.o, c.c));
        const bodyBot = scale(Math.min(c.o, c.c));
        const bodyH = Math.max(bodyBot - bodyTop, 1.5);
        const color = isBullish ? "#2a7d5f" : "#c0392b";
        const cx = x + candleWidth / 2;
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={cx} y1={scale(c.h)} x2={cx} y2={scale(c.l)}
              stroke={color} strokeWidth={1.5} />
            {/* Body */}
            <rect x={x} y={bodyTop} width={candleWidth} height={bodyH}
              fill={isBullish ? color : color} stroke={color} strokeWidth={0.5} rx={1}
              opacity={isBullish ? 0.85 : 0.9} />
          </g>
        );
      })}
    </svg>
  );
};

interface CandlestickModuleProps {
  onBack: () => void;
}

const CandlestickModule = ({ onBack }: CandlestickModuleProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PatternCategory | "all">("all");
  const [selectedPattern, setSelectedPattern] = useState<CandlestickPattern | null>(null);

  const filtered = useMemo(() => {
    return CANDLESTICK_PATTERNS.filter(p => {
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
        || p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, categoryFilter]);

  return (
    <div className="h-full flex flex-col"
      style={{ background: "linear-gradient(180deg, #faf8f4 0%, #f0ebe3 100%)" }}>

      {/* Header */}
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(180,140,100,0.15)" }}>
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
          style={{ color: "#6b6560", background: "rgba(180,140,100,0.08)", border: "1px solid rgba(180,140,100,0.15)" }}>
          <ArrowLeft size={14} />
          <span className="text-[10px] md:text-xs font-display tracking-wider">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-sm md:text-lg" style={{ color: "#2d2a26" }}>
            📊 Candlestick Patterns
          </h2>
          <p className="text-[9px] md:text-[10px] font-mono" style={{ color: "#6b6560" }}>
            {CANDLESTICK_PATTERNS.length} patterns
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
        style={{ borderBottom: "1px solid rgba(180,140,100,0.1)" }}>
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8a8078" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patterns..."
            className="w-full pl-8 pr-8 py-1.5 rounded-lg text-xs font-body outline-none"
            style={{
              background: "rgba(255,252,248,0.8)",
              border: "1px solid rgba(180,140,100,0.2)",
              color: "#2d2a26",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "#8a8078" }}>
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className="px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider transition-all cursor-pointer"
            style={{
              background: categoryFilter === "all" ? "rgba(45,42,38,0.85)" : "rgba(180,140,100,0.08)",
              color: categoryFilter === "all" ? "#faf8f4" : "#6b6560",
              border: "1px solid rgba(180,140,100,0.15)",
            }}>
            All
          </button>
          {PATTERN_CATEGORIES.map(cat => (
            <button key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className="px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider transition-all cursor-pointer"
              style={{
                background: categoryFilter === cat.value ? cat.color : "rgba(180,140,100,0.08)",
                color: categoryFilter === cat.value ? "#fff" : "#6b6560",
                border: `1px solid ${categoryFilter === cat.value ? cat.color : "rgba(180,140,100,0.15)"}`,
              }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {filtered.map((p, i) => {
            const catColor = PATTERN_CATEGORIES.find(c => c.value === p.category)?.color || "#6b6560";
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                onClick={() => setSelectedPattern(p)}
                className="text-left rounded-xl p-3 md:p-4 transition-all cursor-pointer group"
                style={{
                  background: "rgba(255,252,248,0.85)",
                  border: "1px solid rgba(180,140,100,0.18)",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
              >
                <div className="h-16 md:h-20 mb-2 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(180,140,100,0.04)" }}>
                  <CandleSVG pattern={p} />
                </div>
                <p className="font-display text-[11px] md:text-xs mb-1 truncate" style={{ color: "#2d2a26" }}>
                  {p.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
                  <span className="text-[8px] md:text-[9px] font-display uppercase tracking-wider" style={{ color: "#8a8078" }}>
                    {p.category}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-sm" style={{ color: "#8a8078" }}>No patterns found.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedPattern && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedPattern(null)} />
            <motion.div
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-5 md:p-7"
              style={{
                background: "#faf8f4",
                border: "1px solid rgba(180,140,100,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button onClick={() => setSelectedPattern(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "rgba(180,140,100,0.1)", color: "#6b6560" }}>
                <X size={14} />
              </button>

              {/* Chart */}
              <div className="h-28 md:h-36 mb-4 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(180,140,100,0.06)", border: "1px solid rgba(180,140,100,0.1)" }}>
                <CandleSVG pattern={selectedPattern} />
              </div>

              {/* Name & badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h3 className="font-display text-lg md:text-xl" style={{ color: "#2d2a26" }}>
                  {selectedPattern.name}
                </h3>
                <span className="text-[9px] font-display uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${PATTERN_CATEGORIES.find(c => c.value === selectedPattern.category)?.color}18`,
                    color: PATTERN_CATEGORIES.find(c => c.value === selectedPattern.category)?.color,
                    border: `1px solid ${PATTERN_CATEGORIES.find(c => c.value === selectedPattern.category)?.color}30`,
                  }}>
                  {selectedPattern.category}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(180,140,100,0.08)", color: "#8a8078" }}>
                  {selectedPattern.difficulty}
                </span>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-display uppercase tracking-widest mb-1" style={{ color: "#8a8078" }}>
                    What It Is
                  </p>
                  <p className="font-body text-xs md:text-sm leading-relaxed" style={{ color: "#2d2a26" }}>
                    {selectedPattern.description}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-display uppercase tracking-widest mb-1" style={{ color: "#8a8078" }}>
                    Why It Matters
                  </p>
                  <p className="font-body text-xs md:text-sm leading-relaxed" style={{ color: "#2d2a26" }}>
                    {selectedPattern.significance}
                  </p>
                </div>
                <div className="rounded-lg p-3 md:p-4" style={{
                  background: "rgba(42,125,95,0.06)",
                  border: "1px solid rgba(42,125,95,0.15)",
                }}>
                  <p className="text-[10px] font-display uppercase tracking-widest mb-1" style={{ color: "#2a7d5f" }}>
                    💡 Trade Tip
                  </p>
                  <p className="font-body text-xs md:text-sm leading-relaxed" style={{ color: "#2d2a26" }}>
                    {selectedPattern.tradeTip}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CandlestickModule;
