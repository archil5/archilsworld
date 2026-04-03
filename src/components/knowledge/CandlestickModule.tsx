import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CANDLESTICK_PATTERNS,
  PATTERN_CATEGORIES,
  type PatternCategory,
  type CandlestickPattern,
} from "@/data/candlestickPatterns";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const AMBER = "#D97706";
const RED = "#DC2626";
const GREEN = "#16A34A";

/* ── Candle SVG renderer ─────────────────────────────────── */
const CandleSVG = ({ pattern, size = "normal" }: { pattern: CandlestickPattern; size?: "normal" | "large" }) => {
  const { candles } = pattern;
  const candleWidth = size === "large" ? 22 : 18;
  const gap = size === "large" ? 14 : 12;
  const totalW = candles.length * candleWidth + (candles.length - 1) * gap;
  const svgW = Math.max(totalW + 24, 80);
  const svgH = size === "large" ? 110 : 90;
  const padY = 8;
  const scale = (v: number) => padY + ((100 - v) / 100) * (svgH - padY * 2);

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {[25, 50, 75].map(v => (
        <line key={v} x1={0} y1={scale(v)} x2={svgW} y2={scale(v)}
          stroke="hsl(222 47% 11% / 0.06)" strokeWidth={0.5} strokeDasharray="3,3" />
      ))}
      {candles.map((c, i) => {
        const x = (svgW - totalW) / 2 + i * (candleWidth + gap);
        const isBullish = c.c >= c.o;
        const bodyTop = scale(Math.max(c.o, c.c));
        const bodyBot = scale(Math.min(c.o, c.c));
        const bodyH = Math.max(bodyBot - bodyTop, 1.5);
        const color = isBullish ? COPPER : RED;
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

/* ── Game Mode ───────────────────────────────────────────── */
interface GameState {
  score: number;
  streak: number;
  bestStreak: number;
  total: number;
  lastResult: "correct" | "wrong" | null;
  usedIds: Set<string>;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const GameMode = () => {
  const [currentPattern, setCurrentPattern] = useState<CandlestickPattern | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    score: 0, streak: 0, bestStreak: 0, total: 0, lastResult: null, usedIds: new Set(),
  });

  const pickNextPattern = useCallback(() => {
    const available = CANDLESTICK_PATTERNS.filter(p => !gameState.usedIds.has(p.id));
    const pool = available.length > 0 ? available : CANDLESTICK_PATTERNS;
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrong = shuffle(CANDLESTICK_PATTERNS.filter(p => p.id !== correct.id)).slice(0, 3);
    setCurrentPattern(correct);
    setOptions(shuffle([correct.name, ...wrong.map(p => p.name)]));
    setSelected(null);
    setShowDetail(false);
  }, [gameState.usedIds]);

  useEffect(() => { pickNextPattern(); }, []);

  const handleAnswer = (name: string) => {
    if (selected) return;
    setSelected(name);
    setShowDetail(true);
    const correct = name === currentPattern?.name;
    setGameState(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        score: prev.score + (correct ? Math.max(10, 20 - prev.streak * 0) : 0),
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        total: prev.total + 1,
        lastResult: correct ? "correct" : "wrong",
        usedIds: correct ? new Set([...prev.usedIds, currentPattern!.id]) : prev.usedIds,
      };
    });
  };

  const diffColor = (d: string) =>
    d === "Beginner" ? GREEN : d === "Intermediate" ? AMBER : RED;

  if (!currentPattern) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
      {/* Score bar */}
      <div className="max-w-2xl mx-auto mb-5 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: `${COPPER}08`, border: `1px solid ${COPPER}15` }}>
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: COPPER }}>{gameState.score}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: INK_MUTED }}>Score</p>
          </div>
          <div className="w-px h-8" style={{ background: `${INK}10` }} />
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: gameState.streak >= 3 ? AMBER : INK }}>{gameState.streak}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: INK_MUTED }}>Streak {gameState.streak >= 3 ? "🔥" : ""}</p>
          </div>
          <div className="w-px h-8" style={{ background: `${INK}10` }} />
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: INK }}>{gameState.total > 0 ? Math.round((gameState.score / (gameState.total * 20)) * 100) : 0}%</p>
            <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: INK_MUTED }}>Accuracy</p>
          </div>
          <div className="w-px h-8" style={{ background: `${INK}10` }} />
          <div className="text-center">
            <p className="font-display text-xl font-bold" style={{ color: INK }}>{gameState.bestStreak}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: INK_MUTED }}>Best</p>
          </div>
        </div>
        <p className="font-mono text-xs" style={{ color: INK_MUTED }}>{gameState.total} patterns seen</p>
      </div>

      {/* Pattern question */}
      <div className="max-w-2xl mx-auto">
        <motion.div key={currentPattern.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden mb-4"
          style={{ border: `1px solid ${INK}08`, background: "#fff" }}>

          {/* Candle display */}
          <div className="px-6 pt-6 pb-3 text-center" style={{ background: `${INK}02` }}>
            <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
              Name this pattern
            </p>
            <div className="h-28 mx-auto max-w-xs">
              <CandleSVG pattern={currentPattern} size="large" />
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                style={{ background: `${diffColor(currentPattern.difficulty)}10`, color: diffColor(currentPattern.difficulty) }}>
                {currentPattern.difficulty}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                {currentPattern.category}
              </span>
              <span className="font-mono text-[10px]" style={{ color: INK_MUTED }}>
                {currentPattern.candles.length} candle{currentPattern.candles.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="p-5 grid grid-cols-2 gap-2.5">
            {options.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrect = opt === currentPattern.name;
              const showCorrect = selected !== null;

              let bg = `${INK}03`;
              let border = `${INK}08`;
              let textColor = INK;

              if (showCorrect && isCorrect) { bg = `${GREEN}10`; border = `${GREEN}30`; textColor = GREEN; }
              else if (showCorrect && isSelected && !isCorrect) { bg = `${RED}10`; border = `${RED}30`; textColor = RED; }

              return (
                <motion.button key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  whileHover={!selected ? { scale: 1.02 } : {}}
                  whileTap={!selected ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative p-3 text-left rounded-xl font-display text-sm font-medium transition-all"
                  style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}>
                  <span className="font-mono text-[9px] absolute top-1.5 right-2" style={{ color: INK_MUTED }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {showCorrect && isCorrect && <span className="ml-2">✓</span>}
                  {showCorrect && isSelected && !isCorrect && <span className="ml-2">✗</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Result detail */}
        <AnimatePresence>
          {showDetail && selected && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl overflow-hidden mb-4"
              style={{ border: `1px solid ${selected === currentPattern.name ? `${GREEN}25` : `${RED}25`}`, background: "#fff" }}>

              <div className="px-5 py-3" style={{ background: selected === currentPattern.name ? `${GREEN}06` : `${RED}06` }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selected === currentPattern.name ? "✅" : "❌"}</span>
                  <div>
                    <p className="font-display text-sm font-bold" style={{ color: selected === currentPattern.name ? GREEN : RED }}>
                      {selected === currentPattern.name ? `Correct! +20 pts${gameState.streak >= 2 ? ` 🔥 ${gameState.streak} streak!` : ""}` : `The answer was: ${currentPattern.name}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>What It Is</p>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{currentPattern.description}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: COPPER }}>Trade Tip</p>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{currentPattern.tradeTip}</p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <motion.button onClick={pickNextPattern} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 font-mono text-sm tracking-widest uppercase rounded-xl transition-all"
                  style={{ background: INK, color: "#F8FAFC" }}>
                  Next Pattern →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
interface CandlestickModuleProps { onBack: () => void; }

const CandlestickModule = ({ onBack }: CandlestickModuleProps) => {
  const [activeTab, setActiveTab] = useState<"browse" | "game">("browse");
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
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 transition-all rounded-lg"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs tracking-wider">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-lg font-bold" style={{ color: INK }}>Candlestick Patterns</h2>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>{CANDLESTICK_PATTERNS.length} patterns</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="shrink-0 px-4 md:px-8 py-2 flex gap-2" style={{ borderBottom: `1px solid ${INK}06` }}>
        {([["browse", "📚 Browse All"], ["game", "🎮 Name That Pattern"]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-lg transition-all"
            style={{
              background: activeTab === tab ? INK : `${INK}04`,
              color: activeTab === tab ? "#F8FAFC" : INK_MUTED,
              border: `1px solid ${activeTab === tab ? "transparent" : `${INK}10`}`,
            }}>
            {label}
            {tab === "game" && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: `${AMBER}20`, color: AMBER }}>NEW</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "game" ? (
        <GameMode />
      ) : (
        <>
          {/* Filters */}
          <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
            style={{ borderBottom: `1px solid ${INK}06` }}>
            <div className="relative flex-1 max-w-xs">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: INK_MUTED }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search patterns..." className="w-full pl-8 pr-8 py-1.5 font-mono text-xs outline-none rounded-lg"
                style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }} />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: INK_MUTED }}>×</button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setCategoryFilter("all")}
                className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                style={{ background: categoryFilter === "all" ? INK : `${INK}04`, color: categoryFilter === "all" ? "#F8FAFC" : INK_MUTED, border: `1px solid ${INK}12` }}>
                All
              </button>
              {PATTERN_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                  className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                  style={{ background: categoryFilter === cat.value ? INK : `${INK}04`, color: categoryFilter === cat.value ? "#F8FAFC" : INK_MUTED, border: `1px solid ${INK}12` }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
              {filtered.map((p, i) => (
                <motion.button key={p.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  onClick={() => setSelectedPattern(p)}
                  className="text-left p-3 md:p-4 transition-all group rounded-xl"
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                  whileHover={{ y: -2, rotate: 0.8 }}>
                  <div className="h-16 md:h-20 mb-2 flex items-center justify-center rounded-lg"
                    style={{ background: `${INK}03` }}>
                    <CandleSVG pattern={p} />
                  </div>
                  <p className="font-display text-sm mb-1 truncate" style={{ color: INK }}>{p.name}</p>
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>{p.category}</span>
                </motion.button>
              ))}
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
              <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0" style={{ background: "hsl(222 47% 11% / 0.3)" }}
                  onClick={() => setSelectedPattern(null)} />
                <motion.div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8 rounded-2xl"
                  style={{ background: "#F8FAFC", border: `1px solid ${INK}12` }}
                  initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}>
                  <button onClick={() => setSelectedPattern(null)}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: `${INK}06`, color: INK_MUTED }}>×</button>

                  <div className="h-28 md:h-36 mb-5 flex items-center justify-center rounded-xl"
                    style={{ background: `${INK}03`, border: `1px solid ${INK}06` }}>
                    <CandleSVG pattern={selectedPattern} size="large" />
                  </div>

                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h3 className="font-display text-xl font-bold" style={{ color: INK }}>{selectedPattern.name}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ background: `${INK}06`, color: INK_MUTED }}>{selectedPattern.category}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                      style={{ background: `${INK}04`, color: INK_MUTED }}>{selectedPattern.difficulty}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>What It Is</p>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.description}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>Why It Matters</p>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.significance}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: COPPER }}>Trade Tip</p>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.tradeTip}</p>
                    </div>
                    <button onClick={() => { setSelectedPattern(null); setActiveTab("game"); }}
                      className="w-full py-2.5 font-mono text-xs uppercase tracking-widest rounded-xl transition-all"
                      style={{ background: `${AMBER}10`, color: AMBER, border: `1px solid ${AMBER}25` }}>
                      🎮 Test yourself on this pattern →
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default CandlestickModule;
