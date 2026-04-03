import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AI_TOPICS, AI_CATEGORIES, RAG_DIAGNOSES, DESIGN_CHALLENGES,
  type AITopic, type AICategory, type RAGDiagnosis, type DesignChallenge,
} from "@/data/aiEngineering";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const BLUE = "#2563EB";
const PURPLE = "#7C3AED";
const AMBER = "#D97706";
const RED = "#DC2626";
const GREEN = "#16A34A";

const DEPTH_COLOR: Record<string, string> = {
  intermediate: COPPER,
  advanced: BLUE,
  expert: PURPLE,
};

const CATEGORY_COLOR: Record<string, string> = {
  rag: COPPER,
  graphrag: PURPLE,
  agents: BLUE,
  llmops: AMBER,
  enterprise: RED,
  embeddings: "#0891B2",
  context: "#059669",
  prompts: "#7C3AED",
};

/* ── Topic Detail View ───────────────────────────────────── */
const TopicDetail = ({ topic, onBack }: { topic: AITopic; onBack: () => void }) => {
  const [activeStep, setActiveStep] = useState(-1);
  const [stepsComplete, setStepsComplete] = useState(false);
  const catColor = CATEGORY_COLOR[topic.category] ?? COPPER;
  const depthColor = DEPTH_COLOR[topic.depth] ?? COPPER;

  const nextStep = () => {
    if (activeStep < topic.howItActuallyWorks.length - 1) setActiveStep(s => s + 1);
    else setStepsComplete(true);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs">Topics</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: `${depthColor}12`, color: depthColor }}>
            {topic.depth}
          </span>
          <h2 className="font-display text-lg font-bold" style={{ color: INK }}>
            {topic.icon} {topic.title}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* One-liner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-xl" style={{ background: `${catColor}08`, borderLeft: `3px solid ${catColor}50` }}>
            <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>
              "{topic.oneLiner}"
            </p>
          </motion.div>

          {/* The real problem */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: RED }}>
              The Real Problem (What Most Implementations Miss)
            </p>
            <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{topic.theRealProblem}</p>
          </motion.div>

          {/* How It Actually Works — stepper */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${INK}08`, background: "#fff" }}>
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ background: `${INK}02`, borderBottom: `1px solid ${INK}06` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: catColor }}>
                  How It Actually Works
                </p>
                <div className="flex gap-2">
                  {activeStep >= 0 && !stepsComplete && (
                    <button onClick={() => { setActiveStep(-1); setStepsComplete(false); }}
                      className="font-mono text-[10px] px-2.5 py-1 rounded-lg"
                      style={{ color: INK_MUTED, background: `${INK}06` }}>↺ Reset</button>
                  )}
                  {activeStep === -1 && !stepsComplete && (
                    <button onClick={() => setActiveStep(0)}
                      className="font-mono text-[10px] px-3 py-1 rounded-lg"
                      style={{ background: catColor, color: "#fff" }}>▶ Walk Through</button>
                  )}
                </div>
              </div>

              <div className="p-5">
                {activeStep === -1 && !stepsComplete ? (
                  <div className="space-y-2">
                    {topic.howItActuallyWorks.map((step, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl"
                        style={{ background: `${INK}02`, borderLeft: `2px solid ${catColor}20` }}>
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center font-mono text-xs rounded font-bold"
                          style={{ background: `${catColor}12`, color: catColor }}>{i + 1}</span>
                        <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{step}</p>
                      </div>
                    ))}
                  </div>
                ) : stepsComplete ? (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="font-display text-base font-bold mb-1" style={{ color: GREEN }}>
                      All {topic.howItActuallyWorks.length} steps complete
                    </p>
                    <p className="font-mono text-xs mb-4" style={{ color: INK_MUTED }}>
                      You've walked through how {topic.title} actually works
                    </p>
                    <button onClick={() => { setActiveStep(-1); setStepsComplete(false); }}
                      className="font-mono text-xs px-4 py-2 rounded-lg"
                      style={{ color: INK_MUTED, background: `${INK}06` }}>Watch again ↺</button>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      <div className="flex gap-3 p-4 rounded-xl mb-4"
                        style={{ background: `${catColor}08`, border: `1px solid ${catColor}20` }}>
                        <span className="shrink-0 w-7 h-7 flex items-center justify-center font-mono text-sm font-bold rounded-full"
                          style={{ background: catColor, color: "#fff" }}>{activeStep + 1}</span>
                        <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>
                          {topic.howItActuallyWorks[activeStep]}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${INK}08` }}>
                          <motion.div className="h-full rounded-full" style={{ background: catColor }}
                            animate={{ width: `${((activeStep + 1) / topic.howItActuallyWorks.length) * 100}%` }} />
                        </div>
                        <span className="font-mono text-xs shrink-0" style={{ color: INK_MUTED }}>
                          {activeStep + 1}/{topic.howItActuallyWorks.length}
                        </span>
                        <button onClick={nextStep} className="px-4 py-2 font-mono text-xs rounded-lg"
                          style={{ background: catColor, color: "#fff" }}>
                          {activeStep < topic.howItActuallyWorks.length - 1 ? "Next →" : "Complete ✓"}
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>

          {/* Production gotchas */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: AMBER }}>
              Production Gotchas — What Bites You in Real Systems
            </p>
            <div className="space-y-2">
              {topic.productionGotchas.map((gotcha, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.04 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: `${AMBER}06`, borderLeft: `2px solid ${AMBER}25` }}>
                  <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: AMBER }}>⚠</span>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{gotcha}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* From the trenches */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `3px solid ${COPPER}30` }}>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>
              From the Trenches — BMO Production Experience
            </p>
            <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{topic.archilNote}</p>
          </motion.div>

          {/* Interview angle */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-4 rounded-xl" style={{ background: `${PURPLE}06`, borderLeft: `2px solid ${PURPLE}25` }}>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
              Interview Angle
            </p>
            <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{topic.interviewAngle}</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

/* ── RAG Diagnostics Mode ────────────────────────────────── */
const DiagnosticsMode = () => {
  const [ci, setCi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, boolean>>({});

  const diag = RAG_DIAGNOSES[ci];
  const isCorrect = selected !== null && diag.choices[selected].isCorrect;
  const solved = Object.values(scores).filter(Boolean).length;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setScores(prev => ({ ...prev, [diag.id]: diag.choices[i].isCorrect }));
  };

  const next = () => {
    setCi(i => (i + 1) % RAG_DIAGNOSES.length);
    setSelected(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
      <div className="max-w-2xl mx-auto">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {RAG_DIAGNOSES.map((d, i) => (
            <button key={d.id} onClick={() => { setCi(i); setSelected(null); }}
              className="w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all"
              style={{
                background: i === ci ? INK : scores[d.id] !== undefined ? (scores[d.id] ? `${GREEN}15` : `${RED}12`) : `${INK}06`,
                color: i === ci ? "#F8FAFC" : scores[d.id] !== undefined ? (scores[d.id] ? GREEN : RED) : INK_MUTED,
                border: `1.5px solid ${i === ci ? INK : scores[d.id] !== undefined ? (scores[d.id] ? `${GREEN}30` : `${RED}25`) : `${INK}10`}`,
              }}>
              {scores[d.id] !== undefined ? (scores[d.id] ? "✓" : "✗") : i + 1}
            </button>
          ))}
          <span className="font-mono text-xs ml-auto" style={{ color: INK_MUTED }}>
            {solved}/{RAG_DIAGNOSES.length} diagnosed correctly
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={diag.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Symptom card */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${RED}15`, background: "#fff" }}>
              <div className="px-5 py-4" style={{ background: `${RED}06`, borderBottom: `1px solid ${RED}10` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: RED }}>
                  🚨 Production Incident — Diagnose the Failure
                </p>
                <p className="font-display text-sm font-bold leading-relaxed" style={{ color: INK }}>{diag.symptom}</p>
              </div>
              <div className="px-5 py-3" style={{ borderBottom: `1px solid ${INK}06` }}>
                <p className="font-mono text-xs" style={{ color: INK_MUTED }}>
                  <span className="font-bold" style={{ color: AMBER }}>Context: </span>{diag.context}
                </p>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
                  Root cause?
                </p>
                <div className="space-y-2.5">
                  {diag.choices.map((choice, i) => {
                    const isSel = selected === i;
                    let bg = `${INK}03`; let border = `${INK}08`; let tc = INK;
                    if (selected !== null && choice.isCorrect) { bg = `${GREEN}10`; border = `${GREEN}30`; tc = GREEN; }
                    else if (selected !== null && isSel && !choice.isCorrect) { bg = `${RED}06`; border = `${RED}20`; tc = RED; }

                    return (
                      <motion.button key={i} onClick={() => handleSelect(i)}
                        disabled={selected !== null} whileHover={selected === null ? { x: 3 } : {}}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: bg, border: `1.5px solid ${border}` }}>
                        <p className="font-display text-sm leading-relaxed" style={{ color: tc }}>
                          {choice.label}
                          {selected !== null && choice.isCorrect && " ✓"}
                          {selected !== null && isSel && !choice.isCorrect && " ✗"}
                        </p>
                        {selected !== null && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            className="font-mono text-xs mt-2 leading-relaxed"
                            style={{ color: choice.isCorrect ? GREEN : (isSel ? RED : INK_MUTED) }}>
                            {choice.explanation}
                          </motion.p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {selected !== null && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{ background: "#fff", border: `1px solid ${isCorrect ? `${GREEN}20` : `${AMBER}20`}` }}>
                  <div className="px-5 py-3" style={{ background: isCorrect ? `${GREEN}06` : `${AMBER}06`, borderBottom: `1px solid ${isCorrect ? `${GREEN}12` : `${AMBER}12`}` }}>
                    <p className="font-display text-sm font-bold" style={{ color: isCorrect ? GREEN : AMBER }}>
                      {isCorrect ? "✅ Correct diagnosis." : "💡 Not quite — here's what's actually happening:"}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>The Fix</p>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{diag.fix}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: COPPER }}>Deeper Insight</p>
                      <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{diag.deeperInsight}</p>
                    </div>
                    <button onClick={next} className="w-full py-3 font-mono text-xs uppercase tracking-widest rounded-xl"
                      style={{ background: INK, color: "#F8FAFC" }}>
                      {ci < RAG_DIAGNOSES.length - 1 ? "Next Incident →" : "Restart ↺"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Design Challenge Mode ───────────────────────────────── */
const DesignMode = () => {
  const [ci, setCi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const challenge = DESIGN_CHALLENGES[ci];
  const isOptimal = selected !== null && challenge.options[selected].isOptimal;

  const handleSelect = (i: number) => { if (selected === null) setSelected(i); };
  const next = () => { setCi(i => (i + 1) % DESIGN_CHALLENGES.length); setSelected(null); };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {DESIGN_CHALLENGES.map((c, i) => (
            <button key={c.id} onClick={() => { setCi(i); setSelected(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
              style={{
                background: ci === i ? INK : `${INK}04`, color: ci === i ? "#F8FAFC" : INK_MUTED,
                border: `1px solid ${ci === i ? "transparent" : `${INK}10`}`,
              }}>
              {c.icon} {c.title.split(" ").slice(0, 3).join(" ")}…
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${BLUE}15`, background: "#fff" }}>
              <div className="px-5 py-4" style={{ background: `${BLUE}06`, borderBottom: `1px solid ${BLUE}10` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: BLUE }}>
                  {challenge.icon} Architecture Decision — You're the Lead
                </p>
                <h3 className="font-display text-base font-bold mb-3" style={{ color: INK }}>{challenge.title}</h3>
                <div className="space-y-1.5">
                  {challenge.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[10px] mt-0.5" style={{ color: BLUE }}>▸</span>
                      <span className="font-display text-xs" style={{ color: INK }}>{req}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-xl" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}20` }}>
                  <p className="font-mono text-xs" style={{ color: AMBER }}>
                    <span className="font-bold">Hard constraint: </span>{challenge.constraint}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
                  Which architecture do you choose?
                </p>
                <div className="space-y-2.5">
                  {challenge.options.map((option, i) => {
                    const isSel = selected === i;
                    let bg = `${INK}03`; let border = `${INK}08`; let tc = INK;
                    if (selected !== null && option.isOptimal) { bg = `${GREEN}10`; border = `${GREEN}30`; tc = GREEN; }
                    else if (selected !== null && isSel && !option.isOptimal) { bg = `${RED}06`; border = `${RED}20`; tc = RED; }

                    return (
                      <motion.button key={i} onClick={() => handleSelect(i)}
                        disabled={selected !== null} whileHover={selected === null ? { x: 3 } : {}}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: bg, border: `1.5px solid ${border}` }}>
                        <p className="font-display text-sm font-semibold mb-1" style={{ color: tc }}>
                          {option.label}
                          {selected !== null && option.isOptimal && " ✓"}
                          {selected !== null && isSel && !option.isOptimal && " ✗"}
                        </p>
                        <p className="font-display text-xs leading-relaxed" style={{ color: INK_MUTED }}>{option.description}</p>
                        {selected !== null && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="font-mono text-[10px] mt-2 leading-relaxed"
                            style={{ color: option.isOptimal ? GREEN : (isSel ? RED : INK_MUTED) }}>
                            {option.reasoning}
                          </motion.p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {selected !== null && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{ background: "#fff", border: `1px solid ${isOptimal ? `${GREEN}20` : `${AMBER}20`}` }}>
                  <div className="px-5 py-3" style={{ background: isOptimal ? `${GREEN}06` : `${AMBER}06`, borderBottom: `1px solid ${isOptimal ? `${GREEN}12` : `${AMBER}12`}` }}>
                    <p className="font-display text-sm font-bold" style={{ color: isOptimal ? GREEN : AMBER }}>
                      {isOptimal ? "✅ Right call." : "💡 Close — here's the optimal approach:"}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>
                        What I'd Choose — and Why
                      </p>
                      <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{challenge.archilChoice}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}15` }}>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: PURPLE }}>Key Insight</p>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{challenge.keyInsight}</p>
                    </div>
                    <button onClick={next} className="w-full py-3 font-mono text-xs uppercase tracking-widest rounded-xl"
                      style={{ background: INK, color: "#F8FAFC" }}>
                      {ci < DESIGN_CHALLENGES.length - 1 ? "Next Challenge →" : "Restart ↺"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
interface AIEngineeringModuleProps { onBack: () => void; }

const AIEngineeringModule = ({ onBack }: AIEngineeringModuleProps) => {
  const [selectedTopic, setSelectedTopic] = useState<AITopic | null>(null);
  const [activeTab, setActiveTab] = useState<"topics" | "diagnose" | "design">("topics");
  const [categoryFilter, setCategoryFilter] = useState<AICategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return AI_TOPICS.filter(t => {
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
        || t.oneLiner.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, categoryFilter]);

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-lg font-bold" style={{ color: INK }}>AI Engineering</h2>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>
            {AI_TOPICS.length} deep topics · from production
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-4 md:px-8 py-2 flex gap-2 flex-wrap" style={{ borderBottom: `1px solid ${INK}06` }}>
        {([
          ["topics", "🧠 Study Topics"],
          ["diagnose", "🚨 RAG Diagnostics"],
          ["design", "🏗️ Design Challenge"],
        ] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-lg transition-all"
            style={{
              background: activeTab === tab ? INK : `${INK}04`,
              color: activeTab === tab ? "#F8FAFC" : INK_MUTED,
              border: `1px solid ${activeTab === tab ? "transparent" : `${INK}10`}`,
            }}>
            {label}
            {tab === "diagnose" && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: `${RED}15`, color: RED }}>5 cases</span>
            )}
            {tab === "design" && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: `${BLUE}15`, color: BLUE }}>3 scenarios</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "diagnose" ? <DiagnosticsMode /> :
       activeTab === "design" ? <DesignMode /> : (
        <>
          {/* Filters */}
          <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
            style={{ borderBottom: `1px solid ${INK}06` }}>
            <div className="relative flex-1 max-w-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: INK_MUTED }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search topics…" className="w-full pl-8 pr-3 py-1.5 font-mono text-xs outline-none rounded-lg"
                style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {AI_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                  className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                  style={{
                    background: categoryFilter === cat.value ? INK : `${INK}04`,
                    color: categoryFilter === cat.value ? "#F8FAFC" : INK_MUTED,
                    border: `1px solid ${INK}12`,
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic grid */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
              {filtered.map((t, i) => {
                const catColor = CATEGORY_COLOR[t.category] ?? COPPER;
                const depthColor = DEPTH_COLOR[t.depth] ?? COPPER;
                return (
                  <motion.button key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} onClick={() => setSelectedTopic(t)}
                    className="text-left p-4 md:p-5 transition-all group rounded-xl"
                    style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                    whileHover={{ y: -2, rotate: 0.4 }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-display text-base font-semibold" style={{ color: INK }}>{t.title}</h3>
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ background: `${depthColor}10`, color: depthColor }}>{t.depth}</span>
                        </div>
                        <p className="font-mono text-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{t.oneLiner}</p>
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg"
                          style={{ background: `${catColor}08`, color: catColor, border: `1px solid ${catColor}15` }}>
                          {t.category}
                        </span>
                      </div>
                      <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: COPPER }}>→</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIEngineeringModule;
