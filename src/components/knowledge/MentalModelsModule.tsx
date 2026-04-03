import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENTAL_MODELS, LOGIC_PUZZLES, MENTAL_MODEL_CATEGORIES, type MentalModel, type LogicPuzzle } from "@/data/mentalModels";
import MentalModelVisual from "./diagrams/MentalModelVisual";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const AMBER = "#D97706";
const RED = "#DC2626";
const GREEN = "#16A34A";
const PURPLE = "#7C3AED";

/* ── Apply It scenarios (keyed to model category) ───────── */
interface ApplyScenario { question: string; optionA: string; optionB: string; betterChoice: "A" | "B"; explanation: string; }

const APPLY_SCENARIOS: Record<string, ApplyScenario> = {
  "mental-model": {
    question: "Your team is debating whether to rebuild the entire codebase or patch the existing one. Everyone keeps adding new arguments. You've been in this meeting for 2 hours.",
    optionA: "Keep brainstorming until consensus emerges naturally",
    optionB: "Apply First Principles — strip back to: what problem are we actually solving? Is a full rebuild the minimum necessary intervention?",
    betterChoice: "B",
    explanation: "First Principles cuts through accumulated assumptions. The debate isn't about code — it's about what outcome you need. Starting from fundamentals often reveals the rebuild vs patch framing was wrong entirely.",
  },
  "cognitive-bias": {
    question: "You've spent 3 months building a feature. User testing shows almost nobody uses it. Your manager asks if you should continue.",
    optionA: "Justify continuing — you've invested too much to abandon it now",
    optionB: "Acknowledge the sunk cost fallacy and evaluate the feature on its future value alone",
    betterChoice: "B",
    explanation: "Sunk cost fallacy is one of the most expensive cognitive biases in engineering. The 3 months are gone regardless. The only question is: does this feature's future value justify the resources to ship it?",
  },
  "systems": {
    question: "You add 3 senior engineers to a project that's already 2 weeks behind schedule. What do you expect?",
    optionA: "The project immediately speeds up proportionally",
    optionB: "Progress initially slows as the new engineers ramp up (Brooks's Law)",
    betterChoice: "B",
    explanation: "Brooks's Law: adding people to a late project makes it later. New team members need onboarding, communication paths multiply (n² problem), and existing engineers lose time to bring them up to speed.",
  },
  "decision": {
    question: "You're choosing a cloud database for a new service. You've done 2 weeks of research and have 3 viable options. How do you decide?",
    optionA: "Research for another week to find the 'perfect' option",
    optionB: "Use a decision matrix with 5 weighted criteria and pick the highest scorer — accept that you can change it later",
    betterChoice: "B",
    explanation: "Analysis paralysis has a cost. Most technical decisions are reversible. Make a good-enough decision fast, document your reasoning, and preserve the ability to change it. The perfect option rarely exists.",
  },
  "puzzle": {
    question: "A critical production bug is reported. Three engineers are simultaneously investigating different hypotheses — each convinced theirs is right.",
    optionA: "Let all three continue independently to maximize parallel progress",
    optionB: "Timebox 15 minutes, then converge to evaluate hypotheses together — pick the highest-probability one to investigate first",
    betterChoice: "B",
    explanation: "Parallel investigation without coordination wastes effort and delays the fix. The structured debugging approach: converge, rank hypotheses by probability, test the most likely one first, then branch if wrong. It's faster.",
  },
};

/* ── Timer Ring ──────────────────────────────────────────── */
const TimerRing = ({ seconds, total }: { seconds: number; total: number }) => {
  const r = 22; const circ = 2 * Math.PI * r;
  const pct = seconds / total;
  const color = seconds > total * 0.5 ? GREEN : seconds > total * 0.25 ? AMBER : RED;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke={`${color}15`} strokeWidth="3" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${circ}`} strokeDashoffset={`${circ * (1 - pct)}`}
        strokeLinecap="round" transform="rotate(-90 28 28)"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
      <text x="28" y="34" textAnchor="middle" fontSize="13" fontWeight="bold" fill={color}
        fontFamily="monospace">{seconds}</text>
    </svg>
  );
};

/* ── Scored Puzzle Card ──────────────────────────────────── */
interface PuzzleCardProps {
  puzzle: LogicPuzzle;
  onScored: (pts: number) => void;
}

const ScoredPuzzleCard = ({ puzzle, onScored }: PuzzleCardProps) => {
  const TOTAL_TIME = 90;
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const [scored, setScored] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    setHintsRevealed(0); setShowAnswer(false);
    setTimeLeft(TOTAL_TIME); setTimerActive(true); setScored(false);
  }, [puzzle.id]);

  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive, puzzle.id]);

  const handleHint = () => {
    setHintsRevealed(h => h + 1);
    if (!timerActive) return;
  };

  const handleReveal = () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setShowAnswer(true);
    if (!scored) {
      setScored(true);
      const hintPenalty = hintsRevealed * 15;
      const timePenalty = timeLeft === 0 ? 20 : 0;
      const pts = Math.max(0, 100 - hintPenalty - timePenalty);
      onScored(pts);
    }
  };

  const handleSolved = () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    if (!scored) {
      setScored(true);
      const timeBonus = Math.round((timeLeft / TOTAL_TIME) * 50);
      const hintPenalty = hintsRevealed * 15;
      const pts = Math.max(50, 150 + timeBonus - hintPenalty);
      onScored(pts);
    }
  };

  const diffColor = puzzle.difficulty === "easy" ? GREEN : puzzle.difficulty === "medium" ? AMBER : RED;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <TimerRing seconds={timeLeft} total={TOTAL_TIME} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: `${diffColor}10`, color: diffColor }}>{puzzle.difficulty}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>{puzzle.category}</span>
          </div>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>
            {timeLeft > 0 ? `${timeLeft}s remaining` : "Time's up — no time bonus"}
            {hintsRevealed > 0 && ` · −${hintsRevealed * 15}pts for hints`}
          </p>
        </div>
      </div>

      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{puzzle.question}</p>

      {/* Hints */}
      <div className="space-y-2">
        {puzzle.hints.slice(0, hintsRevealed).map((hint, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 p-2.5 rounded-xl"
            style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}15` }}>
            <span style={{ color: AMBER }}>💡</span>
            <p className="font-display text-sm" style={{ color: INK_MUTED }}>{hint}</p>
          </motion.div>
        ))}

        <div className="flex gap-2 flex-wrap">
          {hintsRevealed < puzzle.hints.length && !showAnswer && (
            <button onClick={handleHint}
              className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: AMBER, background: `${AMBER}08`, border: `1px solid ${AMBER}20` }}>
              Hint {hintsRevealed + 1}/{puzzle.hints.length} (−15pts)
            </button>
          )}
          {!showAnswer && !scored && (
            <>
              <button onClick={handleSolved}
                className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ color: GREEN, background: `${GREEN}08`, border: `1px solid ${GREEN}20` }}>
                ✓ I got it!
              </button>
              <button onClick={handleReveal}
                className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ color: COPPER, background: `${COPPER}08`, border: `1px solid ${COPPER}20` }}>
                Show Answer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: COPPER }}>Answer</p>
              <p className="font-display text-sm font-bold leading-relaxed" style={{ color: INK }}>{puzzle.answer}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: `${INK}03`, borderLeft: `2px solid ${INK}12` }}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>Explanation</p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{puzzle.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Apply It component ──────────────────────────────────── */
const ApplyItCard = ({ model }: { model: MentalModel }) => {
  const [selected, setSelected] = useState<"A" | "B" | null>(null);
  const scenario = APPLY_SCENARIOS[model.category] ?? APPLY_SCENARIOS["decision"];

  if (!scenario) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${PURPLE}15`, background: "#fff" }}>
      <div className="px-5 py-3" style={{ background: `${PURPLE}06`, borderBottom: `1px solid ${PURPLE}10` }}>
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: PURPLE }}>Apply It → Real Scenario</p>
      </div>
      <div className="p-5">
        <p className="font-display text-sm leading-relaxed mb-4" style={{ color: INK }}>{scenario.question}</p>
        <div className="grid grid-cols-1 gap-2.5 mb-3">
          {(["A", "B"] as const).map(opt => {
            const text = opt === "A" ? scenario.optionA : scenario.optionB;
            const isCorrect = scenario.betterChoice === opt;
            const isSel = selected === opt;
            let bg = `${INK}03`; let border = `${INK}08`; let tc = INK;
            if (selected && isCorrect) { bg = `${GREEN}10`; border = `${GREEN}30`; tc = GREEN; }
            else if (selected && isSel && !isCorrect) { bg = `${RED}06`; border = `${RED}20`; tc = RED; }
            return (
              <button key={opt} onClick={() => !selected && setSelected(opt)}
                className="text-left p-3 rounded-xl font-display text-sm transition-all"
                style={{ background: bg, border: `1.5px solid ${border}`, color: tc }}>
                <span className="font-mono text-xs mr-2" style={{ color: INK_MUTED }}>{opt}.</span>
                {text}
                {selected && isCorrect && " ✓"}
              </button>
            );
          })}
        </div>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-3 rounded-xl text-sm"
            style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
            <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{scenario.explanation}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* ── Model Detail ────────────────────────────────────────── */
const ModelDetail = ({ model, onBack }: { model: MentalModel; onBack: () => void }) => (
  <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
    <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${INK}08` }}>
      <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
        style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        <span className="font-mono text-xs">Models</span>
      </button>
      <h2 className="font-display text-lg font-bold" style={{ color: INK }}>{model.icon} {model.title}</h2>
    </div>
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
          <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>"{model.oneLiner}"</p>
        </motion.div>
        <MentalModelVisual modelId={model.id} />
        <div className="space-y-3">
          {model.explanation.map((para, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }} className="p-3 rounded-xl"
              style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}15` }}>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{para}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-4 rounded-xl" style={{ background: `${INK}03`, borderLeft: `2px solid ${AMBER}30` }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>Applied to Engineering</p>
          <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{model.engineeringApplication}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>Concrete Example</p>
          <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{model.example}</p>
        </motion.div>
        <ApplyItCard model={model} />
      </div>
    </div>
  </div>
);

/* ── Main Component ──────────────────────────────────────── */
interface MentalModelsModuleProps { onBack: () => void; }

const MentalModelsModule = ({ onBack }: MentalModelsModuleProps) => {
  const [view, setView] = useState<"models" | "puzzles">("models");
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState<LogicPuzzle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sessionScore, setSessionScore] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);

  const filteredModels = useMemo(() => {
    return MENTAL_MODELS.filter(m => categoryFilter === "all" || m.category === categoryFilter);
  }, [categoryFilter]);

  const handleScored = (pts: number) => {
    setSessionScore(s => s + pts);
    setPuzzlesSolved(n => n + 1);
  };

  if (selectedModel) {
    return <ModelDetail model={selectedModel} onBack={() => setSelectedModel(null)} />;
  }

  if (selectedPuzzle) {
    const idx = LOGIC_PUZZLES.findIndex(p => p.id === selectedPuzzle.id);
    return (
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => setSelectedPuzzle(null)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            <span className="font-mono text-xs">Puzzles</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg" style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}15` }}>
              <span className="font-mono text-xs" style={{ color: PURPLE }}>Session: {sessionScore}pts · {puzzlesSolved} solved</span>
            </div>
            <h2 className="font-display text-lg font-bold" style={{ color: INK }}>{selectedPuzzle.title}</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <ScoredPuzzleCard key={selectedPuzzle.id} puzzle={selectedPuzzle} onScored={handleScored} />
            <div className="flex items-center justify-between pt-6">
              <button onClick={() => { if (idx > 0) setSelectedPuzzle(LOGIC_PUZZLES[idx - 1]); }} disabled={idx === 0}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-xs rounded-lg disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>← Prev</button>
              <span className="font-mono text-xs" style={{ color: INK_MUTED }}>{idx + 1} / {LOGIC_PUZZLES.length}</span>
              <button onClick={() => { if (idx < LOGIC_PUZZLES.length - 1) setSelectedPuzzle(LOGIC_PUZZLES[idx + 1]); }}
                disabled={idx === LOGIC_PUZZLES.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-xs rounded-lg disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>Next →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs">Hub</span>
        </button>
        <div className="flex items-center gap-3">
          {puzzlesSolved > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 rounded-lg" style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}15` }}>
              <span className="font-mono text-xs" style={{ color: PURPLE }}>🧩 {sessionScore}pts · {puzzlesSolved} solved</span>
            </motion.div>
          )}
          <h2 className="font-display text-lg font-bold" style={{ color: INK }}>Mental Models & Puzzles</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-4 md:px-8 py-2 flex gap-2 flex-wrap" style={{ borderBottom: `1px solid ${INK}06` }}>
        {([["models", `🧠 Mental Models (${MENTAL_MODELS.length})`], ["puzzles", `🧩 Logic Puzzles (${LOGIC_PUZZLES.length})`]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setView(tab)}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-lg transition-all"
            style={{
              background: view === tab ? INK : `${INK}04`,
              color: view === tab ? "#F8FAFC" : INK_MUTED,
              border: `1px solid ${view === tab ? "transparent" : `${INK}10`}`,
            }}>{label}</button>
        ))}
        {view === "models" && (
          MENTAL_MODEL_CATEGORIES.filter(c => c.value !== "puzzle").map(cat => (
            <button key={cat.value} onClick={() => setCategoryFilter(categoryFilter === cat.value ? "all" : cat.value)}
              className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all hidden md:block"
              style={{
                background: categoryFilter === cat.value ? COPPER : `${INK}04`,
                color: categoryFilter === cat.value ? "#fff" : INK_MUTED,
                border: `1px solid ${categoryFilter === cat.value ? COPPER : `${INK}10`}`,
              }}>{cat.label}</button>
          ))
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
        {view === "models" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
            {filteredModels.map((m, i) => (
              <motion.button key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }} onClick={() => setSelectedModel(m)}
                className="text-left p-4 md:p-5 transition-all group rounded-xl"
                style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                whileHover={{ y: -2, rotate: 0.5 }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base mb-1" style={{ color: INK }}>{m.title}</h3>
                    <p className="font-mono text-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{m.oneLiner}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: `${INK}06`, color: INK_MUTED }}>{m.category}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{ background: `${PURPLE}08`, color: PURPLE }}>+ Apply It</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: COPPER }}>→</span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
            {LOGIC_PUZZLES.map((p, i) => {
              const diffColor = p.difficulty === "easy" ? GREEN : p.difficulty === "medium" ? AMBER : RED;
              return (
                <motion.button key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }} onClick={() => setSelectedPuzzle(p)}
                  className="text-left p-4 md:p-5 transition-all group rounded-xl"
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                  whileHover={{ y: -2, rotate: 0.5 }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ background: `${diffColor}10`, color: diffColor }}>{p.difficulty}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>{p.category}</span>
                    <span className="ml-auto font-mono text-[10px]" style={{ color: PURPLE }}>⏱ 90s</span>
                  </div>
                  <h3 className="font-display text-base mb-1" style={{ color: INK }}>{p.title}</h3>
                  <p className="font-mono text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                    {p.question.substring(0, 80)}…
                  </p>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalModelsModule;
