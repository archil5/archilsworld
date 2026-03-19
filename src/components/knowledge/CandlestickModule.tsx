import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CANDLESTICK_PATTERNS,
  PATTERN_CATEGORIES,
  type PatternCategory,
  type CandlestickPattern,
} from "@/data/candlestickPatterns";

const INK = "hsl(220, 30%, 10%)";
const INK_MUTED = "hsl(220, 12%, 38%)";
const COPPER = "hsl(144, 14%, 55%)";

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
      {[25, 50, 75].map(v => (
        <line key={v} x1={0} y1={scale(v)} x2={svgW} y2={scale(v)}
          stroke="hsl(220 30% 10% / 0.06)" strokeWidth={0.5} strokeDasharray="3,3" />
      ))}
      {candles.map((c, i) => {
        const x = (svgW - totalW) / 2 + i * (candleWidth + gap);
        const isBullish = c.c >= c.o;
        const bodyTop = scale(Math.max(c.o, c.c));
        const bodyBot = scale(Math.min(c.o, c.c));
        const bodyH = Math.max(bodyBot - bodyTop, 1.5);
        const color = isBullish ? COPPER : "hsl(5, 50%, 48%)";
        const cx = x + candleWidth / 2;
        return (
          <g key={i}>
            <line x1={cx} y1={scale(c.h)} x2={cx} y2={scale(c.l)} stroke={color} strokeWidth={1.5} />
            <rect x={x} y={bodyTop} width={candleWidth} height={bodyH}
              fill={color} stroke={color} strokeWidth={0.5} opacity={isBullish ? 0.85 : 0.9} />
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
    <div className="h-full flex flex-col" style={{ background: "#E8E0D0" }}>
      {/* Header */}
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="font-mono text-mono-xs tracking-wider">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-display-sm" style={{ color: INK }}>
            Candlestick Patterns
          </h2>
          <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
            {CANDLESTICK_PATTERNS.length} patterns
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
        style={{ borderBottom: `1px solid ${INK}06` }}>
        <div className="relative flex-1 max-w-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: INK_MUTED }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patterns..."
            className="w-full pl-8 pr-8 py-1.5 font-mono text-mono-sm outline-none"
            style={{
              background: `${INK}03`,
              border: `1px solid ${INK}08`,
              color: INK,
            }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: INK_MUTED }}>
              ×
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
            style={{
              background: categoryFilter === "all" ? INK : `${INK}04`,
              color: categoryFilter === "all" ? "#E8E0D0" : INK_MUTED,
              border: `1px solid ${INK}15`,
            }}>
            All
          </button>
          {PATTERN_CATEGORIES.map(cat => (
            <button key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
              style={{
                background: categoryFilter === cat.value ? INK : `${INK}04`,
                color: categoryFilter === cat.value ? "#E8E0D0" : INK_MUTED,
                border: `1px solid ${INK}15`,
              }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {filtered.map((p, i) => {
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                onClick={() => setSelectedPattern(p)}
                className="text-left p-3 md:p-4 transition-all group"
                style={{
                  background: `${INK}02`,
                  border: `1px solid ${INK}06`,
                }}
                whileHover={{ y: -2, rotate: 0.8 }}
              >
                <div className="h-16 md:h-20 mb-2 flex items-center justify-center"
                  style={{ background: `${INK}03` }}>
                  <CandleSVG pattern={p} />
                </div>
                <p className="font-display text-sm mb-1 truncate" style={{ color: INK }}>
                  {p.name}
                </p>
                <span className="font-mono text-mono-xs uppercase tracking-[0.1em]" style={{ color: INK_MUTED }}>
                  {p.category}
                </span>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>No patterns found.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedPattern && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: "hsl(220 30% 10% / 0.3)" }} onClick={() => setSelectedPattern(null)} />
            <motion.div
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8"
              style={{
                background: "#E8E0D0",
                border: `1px solid ${INK}12`,
              }}
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
            >
              <button onClick={() => setSelectedPattern(null)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                style={{ background: `${INK}06`, color: INK_MUTED }}>
                ×
              </button>

              <div className="h-28 md:h-36 mb-5 flex items-center justify-center"
                style={{ background: `${INK}03`, border: `1px solid ${INK}06` }}>
                <CandleSVG pattern={selectedPattern} />
              </div>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h3 className="font-display text-display-sm md:text-display-md" style={{ color: INK }}>
                  {selectedPattern.name}
                </h3>
                <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                  style={{ borderBottom: `1px solid ${INK}15`, color: INK_MUTED }}>
                  {selectedPattern.category}
                </span>
                <span className="font-mono text-mono-xs px-2 py-0.5"
                  style={{ background: `${INK}04`, color: INK_MUTED }}>
                  {selectedPattern.difficulty}
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: INK_MUTED }}>What It Is</p>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.description}</p>
                </div>
                <div>
                  <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: INK_MUTED }}>Why It Matters</p>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.significance}</p>
                </div>
                <div className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                  <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: COPPER }}>Trade Tip</p>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.tradeTip}</p>
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