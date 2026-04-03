import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLOUD_PATTERNS, CLOUD_PATTERN_CATEGORIES, type CloudPattern } from "@/data/cloudPatterns";
import CloudPatternDiagram from "./diagrams/CloudPatternDiagram";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const BLUE = "#2563EB";
const AMBER = "#D97706";
const RED = "#DC2626";
const GREEN = "#16A34A";

/* ── Quick Challenge data ────────────────────────────────── */
interface Scenario {
  id: string;
  situation: string;
  context: string;
  choices: { pattern: string; label: string; tradeoff: string; isRight: boolean }[];
  rationale: string;
  archilNote: string;
}

const CHALLENGES: Scenario[] = [
  {
    id: "bank-transactions",
    situation: "A bank processes 50,000 transactions/sec. Each transaction updates multiple services: accounts, ledger, fraud detection, notifications. A service crashes halfway through — you have partial updates everywhere.",
    context: "You need atomic consistency across distributed services without blocking everything.",
    choices: [
      { pattern: "Saga Pattern", label: "Saga Pattern", tradeoff: "Breaks the transaction into compensating steps. If fraud detection fails, you rollback with compensating transactions. No distributed locks needed.", isRight: true },
      { pattern: "Event Sourcing", label: "Event Sourcing", tradeoff: "Great for audit trails but doesn't solve the distributed coordination problem during the transaction itself.", isRight: false },
      { pattern: "CQRS", label: "CQRS", tradeoff: "Separates reads from writes — helpful for scale but doesn't address the atomic consistency problem across services.", isRight: false },
    ],
    rationale: "Saga is the right call here. It coordinates distributed transactions without locks, using either choreography (services react to events) or orchestration (a central saga orchestrator manages the flow). The compensation logic handles partial failures.",
    archilNote: "I used Saga orchestration for financial transactions at BMO. The trick is designing idempotent compensating transactions first — before you write the happy path.",
  },
  {
    id: "audit-system",
    situation: "A healthcare system needs complete audit history: every change to every patient record must be traceable. The queries are slow. You also need the ability to replay history to fix data corruption bugs.",
    context: "You need an immutable audit trail AND queryable current state.",
    choices: [
      { pattern: "Event Sourcing", label: "Event Sourcing", tradeoff: "Store every state change as an immutable event. Replay the event log to reconstruct any state at any point in time. Perfect for auditing.", isRight: true },
      { pattern: "CQRS", label: "CQRS only", tradeoff: "Separates read/write models but doesn't inherently give you event replay or immutable history.", isRight: false },
      { pattern: "Outbox Pattern", label: "Outbox Pattern", tradeoff: "Solves dual-write reliability but doesn't give you event replay or complete audit trail.", isRight: false },
    ],
    rationale: "Event Sourcing is the natural fit. The event store is your source of truth — you can replay events to rebuild state at any point. Pair with CQRS to build optimized read projections from the event stream.",
    archilNote: "The mental model shift from 'current state' to 'series of events' is huge. Once you get it, you realise the event log is more valuable than any table. You can build any query you want from it.",
  },
  {
    id: "microservice-notification",
    situation: "An e-commerce platform's order service needs to send events to inventory, shipping, email, and analytics — but sometimes the message broker is temporarily unavailable. You're losing events and getting ghost orders.",
    context: "You need guaranteed event delivery even when the broker is down. No events can be lost.",
    choices: [
      { pattern: "Outbox Pattern", label: "Outbox Pattern", tradeoff: "Write the event to an 'outbox' table in the same DB transaction as the business data. A relay process reads and publishes it. No dual-write problem.", isRight: true },
      { pattern: "Saga Pattern", label: "Saga Pattern", tradeoff: "Solves distributed coordination but doesn't fix the at-least-once delivery guarantee when the broker is unavailable.", isRight: false },
      { pattern: "CQRS", label: "CQRS", tradeoff: "Helpful for read/write separation but doesn't address reliable event publishing to downstream consumers.", isRight: false },
    ],
    rationale: "The Outbox Pattern solves exactly this. By writing to a local outbox table in the same transaction as your business write, you guarantee atomicity. The relay process (like Debezium CDC) handles the async publish — if the broker is down, it retries.",
    archilNote: "This was one of the first patterns I advocated for at scale. Ghost events and lost messages destroy trust in microservices. The Outbox is the simplest reliable fix.",
  },
  {
    id: "read-heavy",
    situation: "A trading platform has 10M reads per second on market data but only 1K writes per second. The write path is complex — risk calculations, validation, regulatory checks. Read queries are timing out.",
    context: "Reads and writes have completely different scale and complexity requirements.",
    choices: [
      { pattern: "CQRS", label: "CQRS", tradeoff: "Completely separate read and write models. Optimise each independently. Scale read replicas independently. Write model handles complexity; read model is denormalised for speed.", isRight: true },
      { pattern: "Event Sourcing", label: "Event Sourcing", tradeoff: "Adds complexity — you'd still need optimised read projections, which is essentially what CQRS provides anyway.", isRight: false },
      { pattern: "Saga Pattern", label: "Saga Pattern", tradeoff: "For distributed transactions — doesn't address the read/write asymmetry problem here.", isRight: false },
    ],
    rationale: "CQRS is textbook right here. When read and write loads are orders of magnitude apart, forcing them through the same model is fighting the architecture. CQRS lets you scale and optimise each side independently.",
    archilNote: "The key is accepting that your read model will be eventually consistent with your write model. In trading, that's usually fine — most reads are for display, not for the write decision itself.",
  },
];

/* ── Challenge Mode ──────────────────────────────────────── */
const ChallengeMode = () => {
  const [ci, setCi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState<Record<string, boolean>>({});

  const scenario = CHALLENGES[ci];
  const isCorrect = scenario.choices.find(c => c.pattern === selected)?.isRight ?? false;

  const handleSelect = (pattern: string) => {
    if (selected) return;
    setSelected(pattern);
    setShowResult(true);
    setScores(prev => ({ ...prev, [scenario.id]: scenario.choices.find(c => c.pattern === pattern)?.isRight ?? false }));
  };

  const next = () => {
    setCi(i => (i + 1) % CHALLENGES.length);
    setSelected(null);
    setShowResult(false);
  };

  const solved = Object.values(scores).filter(Boolean).length;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
      <div className="max-w-2xl mx-auto">
        {/* Score tracker */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {CHALLENGES.map((c, i) => (
            <button key={c.id} onClick={() => { setCi(i); setSelected(null); setShowResult(false); }}
              className="w-9 h-9 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all"
              style={{
                background: i === ci ? INK : scores[c.id] !== undefined ? (scores[c.id] ? `${GREEN}15` : `${RED}12`) : `${INK}06`,
                color: i === ci ? "#F8FAFC" : scores[c.id] !== undefined ? (scores[c.id] ? GREEN : RED) : INK_MUTED,
                border: `1.5px solid ${i === ci ? INK : scores[c.id] !== undefined ? (scores[c.id] ? `${GREEN}30` : `${RED}25`) : `${INK}10`}`,
              }}>
              {scores[c.id] !== undefined ? (scores[c.id] ? "✓" : "✗") : i + 1}
            </button>
          ))}
          <span className="font-mono text-xs ml-auto" style={{ color: INK_MUTED }}>
            {solved}/{CHALLENGES.length} correct
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={scenario.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Scenario */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${BLUE}15`, background: "#fff" }}>
              <div className="px-5 py-4" style={{ background: `${BLUE}06`, borderBottom: `1px solid ${BLUE}10` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: BLUE }}>
                  Scenario {ci + 1} · You're the Architect
                </p>
                <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{scenario.situation}</p>
              </div>
              <div className="px-5 py-3" style={{ borderBottom: `1px solid ${INK}06` }}>
                <p className="font-mono text-xs" style={{ color: INK_MUTED }}>
                  <span className="font-bold" style={{ color: AMBER }}>Constraint: </span>
                  {scenario.context}
                </p>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
                  Which pattern do you reach for?
                </p>
                <div className="space-y-2.5">
                  {scenario.choices.map(choice => {
                    const isSel = selected === choice.pattern;
                    let bg = `${INK}03`; let border = `${INK}08`; let tc = INK;
                    if (showResult && choice.isRight) { bg = `${GREEN}10`; border = `${GREEN}30`; tc = GREEN; }
                    else if (showResult && isSel && !choice.isRight) { bg = `${RED}08`; border = `${RED}25`; tc = RED; }

                    return (
                      <motion.button key={choice.pattern} onClick={() => handleSelect(choice.pattern)}
                        disabled={!!selected} whileHover={!selected ? { x: 4 } : {}}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: bg, border: `1.5px solid ${border}` }}>
                        <p className="font-display text-sm font-bold mb-1" style={{ color: tc }}>{choice.label}</p>
                        {showResult && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="font-display text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                            {choice.tradeoff}
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
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden mb-4" style={{ background: "#fff", border: `1px solid ${isCorrect ? `${GREEN}20` : `${AMBER}20`}` }}>
                  <div className="px-5 py-3" style={{ background: isCorrect ? `${GREEN}06` : `${AMBER}06`, borderBottom: `1px solid ${isCorrect ? `${GREEN}12` : `${AMBER}12`}` }}>
                    <p className="font-display text-sm font-bold" style={{ color: isCorrect ? GREEN : AMBER }}>
                      {isCorrect ? "✅ Right call." : "💡 Not quite — here's why:"}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>The Reasoning</p>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{scenario.rationale}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: COPPER }}>From Production</p>
                      <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{scenario.archilNote}</p>
                    </div>
                    <button onClick={next} className="w-full py-3 font-mono text-xs uppercase tracking-widest rounded-xl"
                      style={{ background: INK, color: "#F8FAFC" }}>
                      {ci < CHALLENGES.length - 1 ? "Next Scenario →" : "Restart Challenges ↺"}
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

/* ── Animated Step Detail ────────────────────────────────── */
const AnimatedDetail = ({ pattern, onBack }: { pattern: CloudPattern; onBack: () => void }) => {
  const [activeStep, setActiveStep] = useState(-1); // -1 = overview
  const [completed, setCompleted] = useState(false);

  const steps = pattern.howItWorks;
  const isPlaying = activeStep >= 0;

  const next = () => {
    if (activeStep < steps.length - 1) setActiveStep(s => s + 1);
    else setCompleted(true);
  };

  const reset = () => { setActiveStep(-1); setCompleted(false); };

  return (
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs">Patterns</span>
        </button>
        <h2 className="font-display text-lg font-bold" style={{ color: INK }}>{pattern.icon} {pattern.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
            <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>"{pattern.oneLiner}"</p>
          </motion.div>

          <CloudPatternDiagram patternId={pattern.id} steps={pattern.howItWorks} />

          {/* Animated stepper */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${INK}08`, background: "#fff" }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${INK}06`, background: `${INK}02` }}>
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: INK_MUTED }}>
                {isPlaying ? `Step ${activeStep + 1} of ${steps.length}` : "How It Actually Works"}
              </p>
              <div className="flex gap-2">
                {isPlaying && (
                  <button onClick={reset} className="font-mono text-[10px] px-2.5 py-1 rounded-lg"
                    style={{ color: INK_MUTED, background: `${INK}06` }}>↺ Reset</button>
                )}
                {!isPlaying && !completed && (
                  <button onClick={() => setActiveStep(0)} className="font-mono text-[10px] px-3 py-1 rounded-lg"
                    style={{ background: COPPER, color: "#fff" }}>▶ Walk Through</button>
                )}
              </div>
            </div>

            <div className="p-5">
              {!isPlaying && !completed ? (
                <div className="space-y-2">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}15` }}>
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center font-mono text-xs rounded"
                        style={{ background: `${COPPER}10`, color: COPPER }}>{i + 1}</span>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{step}</p>
                    </div>
                  ))}
                </div>
              ) : completed ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-display text-base font-bold mb-1" style={{ color: GREEN }}>All {steps.length} steps complete</p>
                  <p className="font-mono text-xs mb-4" style={{ color: INK_MUTED }}>You've walked through the full {pattern.title} flow</p>
                  <button onClick={reset} className="font-mono text-xs px-4 py-2 rounded-lg"
                    style={{ color: INK_MUTED, background: `${INK}06` }}>Watch again ↺</button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex gap-3 p-4 rounded-xl mb-4"
                      style={{ background: `${COPPER}08`, border: `1px solid ${COPPER}20` }}>
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center font-mono text-sm font-bold rounded-full"
                        style={{ background: COPPER, color: "#fff" }}>{activeStep + 1}</span>
                      <p className="font-display text-base leading-relaxed" style={{ color: INK }}>{steps[activeStep]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${INK}08` }}>
                        <motion.div className="h-full rounded-full" style={{ background: COPPER }}
                          animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
                      </div>
                      <button onClick={next} className="px-4 py-2 font-mono text-xs rounded-lg"
                        style={{ background: COPPER, color: "#fff" }}>
                        {activeStep < steps.length - 1 ? "Next →" : "Complete ✓"}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Problem / Solution */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: RED }}>The Problem</p>
            <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{pattern.problem}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>The Solution</p>
            <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{pattern.solution}</p>
          </div>

          {/* Trade-offs */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>Trade-offs</p>
            <div className="space-y-2.5">
              {pattern.tradeoffs.map((t, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl" style={{ background: `${GREEN}06`, borderLeft: `2px solid ${GREEN}25` }}>
                    <p className="font-mono text-[9px] mb-1" style={{ color: GREEN }}>✓ PRO</p>
                    <p className="font-display text-xs" style={{ color: INK }}>{t.pro}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: `${RED}04`, borderLeft: `2px solid ${RED}20` }}>
                    <p className="font-mono text-[9px] mb-1" style={{ color: RED }}>✗ CON</p>
                    <p className="font-display text-xs" style={{ color: INK }}>{t.con}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* From Production */}
          <div className="p-4 rounded-xl" style={{ background: `${INK}03`, borderLeft: `2px solid hsl(36 95% 44% / 0.3)` }}>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>From Production</p>
            <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{pattern.realWorld}</p>
          </div>

          {/* When to use */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>When To Use</p>
              {pattern.whenToUse.map((w, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span style={{ color: COPPER }}>▸</span>
                  <span className="font-display text-sm" style={{ color: INK }}>{w}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: RED }}>When NOT To Use</p>
              {pattern.whenNotToUse.map((w, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span style={{ color: RED }}>✗</span>
                  <span className="font-display text-sm" style={{ color: INK }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap pt-2">
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>Related:</span>
            {pattern.relatedPatterns.map(r => (
              <span key={r} className="font-mono text-[10px] px-2 py-0.5 rounded"
                style={{ color: COPPER, borderBottom: `1px solid ${COPPER}25` }}>{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
interface CloudPatternsModuleProps { onBack: () => void; }

const CloudPatternsModule = ({ onBack }: CloudPatternsModuleProps) => {
  const [selectedPattern, setSelectedPattern] = useState<CloudPattern | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "challenge">("browse");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return CLOUD_PATTERNS.filter(p => {
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
        || p.oneLiner.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, categoryFilter]);

  if (selectedPattern) {
    return <AnimatedDetail pattern={selectedPattern} onBack={() => setSelectedPattern(null)} />;
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
        <div className="text-right">
          <h2 className="font-display text-lg font-bold" style={{ color: INK }}>Cloud Architecture</h2>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>{CLOUD_PATTERNS.length} patterns</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-4 md:px-8 py-2 flex gap-2" style={{ borderBottom: `1px solid ${INK}06` }}>
        {([["browse", "☁️ Browse Patterns"], ["challenge", "🧠 Architect Challenge"]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-lg transition-all"
            style={{
              background: activeTab === tab ? INK : `${INK}04`,
              color: activeTab === tab ? "#F8FAFC" : INK_MUTED,
              border: `1px solid ${activeTab === tab ? "transparent" : `${INK}10`}`,
            }}>
            {label}
            {tab === "challenge" && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: `${BLUE}20`, color: BLUE }}>4 scenarios</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "challenge" ? <ChallengeMode /> : (
        <>
          <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
            style={{ borderBottom: `1px solid ${INK}06` }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patterns..." className="flex-1 max-w-xs px-3 py-1.5 font-mono text-xs outline-none rounded-lg"
              style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }} />
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setCategoryFilter("all")}
                className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                style={{ background: categoryFilter === "all" ? INK : `${INK}04`, color: categoryFilter === "all" ? "#F8FAFC" : INK_MUTED, border: `1px solid ${INK}12` }}>All</button>
              {CLOUD_PATTERN_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                  className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                  style={{ background: categoryFilter === cat.value ? INK : `${INK}04`, color: categoryFilter === cat.value ? "#F8FAFC" : INK_MUTED, border: `1px solid ${INK}12` }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
              {filtered.map((p, i) => (
                <motion.button key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }} onClick={() => setSelectedPattern(p)}
                  className="text-left p-4 md:p-5 transition-all group rounded-xl"
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                  whileHover={{ y: -2, rotate: 0.5 }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base mb-1" style={{ color: INK }}>{p.title}</h3>
                      <p className="font-mono text-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{p.oneLiner}</p>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: `${INK}06`, color: INK_MUTED }}>{p.category}</span>
                    </div>
                    <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: COPPER }}>→</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CloudPatternsModule;
