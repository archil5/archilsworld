import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENTAL_MODELS, LOGIC_PUZZLES, MENTAL_MODEL_CATEGORIES, type MentalModel, type LogicPuzzle } from "@/data/mentalModels";
import MentalModelVisual from "./diagrams/MentalModelVisual";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

interface MentalModelsModuleProps {
  onBack: () => void;
}

const PuzzleCard = ({ puzzle }: { puzzle: LogicPuzzle }) => {
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const diffColor = puzzle.difficulty === "easy" ? COPPER
    : puzzle.difficulty === "medium" ? "#D97706"
    : "#DC2626";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
          style={{ background: `${diffColor}10`, color: diffColor, borderBottom: `1px solid ${diffColor}25` }}>
          {puzzle.difficulty}
        </span>
        <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
          style={{ borderBottom: `1px solid ${INK}10`, color: INK_MUTED }}>
          {puzzle.category}
        </span>
      </div>

      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>
        {puzzle.question}
      </p>

      {/* Hints */}
      <div className="space-y-2">
        {puzzle.hints.slice(0, hintsRevealed).map((hint, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 p-2" style={{ background: "hsl(36 95% 44% / 0.06)", borderLeft: "2px solid hsl(36 95% 44% / 0.2)" }}>
            <span className="font-mono text-mono-xs mt-0.5" style={{ color: "#D97706" }}>💡</span>
            <p className="font-display text-sm" style={{ color: INK_MUTED }}>{hint}</p>
          </motion.div>
        ))}

        <div className="flex gap-2">
          {hintsRevealed < puzzle.hints.length && (
            <button onClick={() => setHintsRevealed(h => h + 1)}
              className="font-mono text-mono-xs px-3 py-1.5 transition-all"
              style={{ color: "#D97706", background: "hsl(36 95% 44% / 0.06)", border: "1px solid hsl(36 95% 44% / 0.15)" }}>
              Hint {hintsRevealed + 1}/{puzzle.hints.length}
            </button>
          )}
          {!showAnswer && (
            <button onClick={() => setShowAnswer(true)}
              className="font-mono text-mono-xs px-3 py-1.5 transition-all"
              style={{ color: COPPER, background: `${COPPER}08`, border: `1px solid ${COPPER}20` }}>
              Reveal Answer
            </button>
          )}
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: COPPER }}>Answer</p>
              <p className="font-display text-sm font-bold leading-relaxed" style={{ color: INK }}>{puzzle.answer}</p>
            </div>
            <div className="p-4" style={{ background: `${INK}03`, borderLeft: `2px solid ${INK}12` }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: INK_MUTED }}>Explanation</p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{puzzle.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MentalModelsModule = ({ onBack }: MentalModelsModuleProps) => {
  const [view, setView] = useState<"models" | "puzzles">("models");
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState<LogicPuzzle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredModels = useMemo(() => {
    return MENTAL_MODELS.filter(m => categoryFilter === "all" || m.category === categoryFilter);
  }, [categoryFilter]);

  // Detail view for a model
  if (selectedModel) {
    return (
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => setSelectedModel(null)}
            className="flex items-center gap-2 px-3 py-1.5 transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <span className="font-mono text-mono-xs tracking-wider">Models</span>
          </button>
          <h2 className="font-display text-display-sm" style={{ color: INK }}>
            {selectedModel.icon} {selectedModel.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>
                "{selectedModel.oneLiner}"
              </p>
            </motion.div>

            {/* Explanation */}
            <div className="space-y-3">
              {selectedModel.explanation.map((para, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3" style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}15` }}>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{para}</p>
                </motion.div>
              ))}
            </div>

            {/* Engineering Application */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-4" style={{ background: `${INK}03`, borderLeft: "2px solid hsl(36 95% 44% / 0.3)" }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#D97706" }}>
                Applied to Engineering
              </p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedModel.engineeringApplication}</p>
            </motion.div>

            {/* Example */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: COPPER }}>
                Concrete Example
              </p>
              <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{selectedModel.example}</p>
            </motion.div>

            {/* Nav */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => {
                  const idx = MENTAL_MODELS.findIndex(m => m.id === selectedModel.id);
                  if (idx > 0) setSelectedModel(MENTAL_MODELS[idx - 1]);
                }}
                disabled={MENTAL_MODELS.findIndex(m => m.id === selectedModel.id) === 0}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                ← Prev
              </button>
              <span className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
                {MENTAL_MODELS.findIndex(m => m.id === selectedModel.id) + 1} / {MENTAL_MODELS.length}
              </span>
              <button
                onClick={() => {
                  const idx = MENTAL_MODELS.findIndex(m => m.id === selectedModel.id);
                  if (idx < MENTAL_MODELS.length - 1) setSelectedModel(MENTAL_MODELS[idx + 1]);
                }}
                disabled={MENTAL_MODELS.findIndex(m => m.id === selectedModel.id) === MENTAL_MODELS.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail view for a puzzle
  if (selectedPuzzle) {
    return (
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => setSelectedPuzzle(null)}
            className="flex items-center gap-2 px-3 py-1.5 transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <span className="font-mono text-mono-xs tracking-wider">Puzzles</span>
          </button>
          <h2 className="font-display text-display-sm" style={{ color: INK }}>
            {selectedPuzzle.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <PuzzleCard puzzle={selectedPuzzle} />

            {/* Nav */}
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => {
                  const idx = LOGIC_PUZZLES.findIndex(p => p.id === selectedPuzzle.id);
                  if (idx > 0) setSelectedPuzzle(LOGIC_PUZZLES[idx - 1]);
                }}
                disabled={LOGIC_PUZZLES.findIndex(p => p.id === selectedPuzzle.id) === 0}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                ← Prev
              </button>
              <span className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
                {LOGIC_PUZZLES.findIndex(p => p.id === selectedPuzzle.id) + 1} / {LOGIC_PUZZLES.length}
              </span>
              <button
                onClick={() => {
                  const idx = LOGIC_PUZZLES.findIndex(p => p.id === selectedPuzzle.id);
                  if (idx < LOGIC_PUZZLES.length - 1) setSelectedPuzzle(LOGIC_PUZZLES[idx + 1]);
                }}
                disabled={LOGIC_PUZZLES.findIndex(p => p.id === selectedPuzzle.id) === LOGIC_PUZZLES.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                Next →
              </button>
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
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="font-mono text-mono-xs tracking-wider">Hub</span>
        </button>
        <h2 className="font-display text-display-sm" style={{ color: INK }}>Mental Models & Puzzles</h2>
      </div>

      {/* Tab toggle */}
      <div className="shrink-0 px-4 md:px-8 py-3 flex gap-2"
        style={{ borderBottom: `1px solid ${INK}06` }}>
        <button onClick={() => setView("models")}
          className="px-4 py-1.5 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
          style={{
            background: view === "models" ? INK : `${INK}04`,
            color: view === "models" ? "#F8FAFC" : INK_MUTED,
            border: `1px solid ${INK}15`,
          }}>
          Mental Models ({MENTAL_MODELS.length})
        </button>
        <button onClick={() => setView("puzzles")}
          className="px-4 py-1.5 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
          style={{
            background: view === "puzzles" ? INK : `${INK}04`,
            color: view === "puzzles" ? "#F8FAFC" : INK_MUTED,
            border: `1px solid ${INK}15`,
          }}>
          Logic Puzzles ({LOGIC_PUZZLES.length})
        </button>
        {view === "models" && (
          <>
            {MENTAL_MODEL_CATEGORIES.filter(c => c.value !== "puzzle").map(cat => (
              <button key={cat.value} onClick={() => setCategoryFilter(categoryFilter === cat.value ? "all" : cat.value)}
                className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all hidden md:block"
                style={{
                  background: categoryFilter === cat.value ? INK : `${INK}04`,
                  color: categoryFilter === cat.value ? "#F8FAFC" : INK_MUTED,
                  border: `1px solid ${INK}15`,
                }}>{cat.label}</button>
            ))}
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
        {view === "models" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
            {filteredModels.map((m, i) => (
              <motion.button key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                onClick={() => setSelectedModel(m)}
                className="text-left p-4 md:p-5 transition-all group"
                style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                whileHover={{ y: -2, rotate: 0.5 }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base mb-1" style={{ color: INK }}>{m.title}</h3>
                    <p className="font-mono text-mono-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{m.oneLiner}</p>
                    <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                      style={{ borderBottom: `1px solid ${INK}10`, color: INK_MUTED }}>{m.category}</span>
                  </div>
                  <span className="font-mono text-mono-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: COPPER }}>→</span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
            {LOGIC_PUZZLES.map((p, i) => {
              const diffColor = p.difficulty === "easy" ? COPPER
                : p.difficulty === "medium" ? "#D97706"
                : "#DC2626";
              return (
                <motion.button key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => setSelectedPuzzle(p)}
                  className="text-left p-4 md:p-5 transition-all group"
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                  whileHover={{ y: -2, rotate: 0.5 }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                        style={{ background: `${diffColor}10`, color: diffColor }}>{p.difficulty}</span>
                      <span className="font-mono text-mono-xs uppercase tracking-[0.1em]"
                        style={{ color: INK_MUTED }}>{p.category}</span>
                    </div>
                    <h3 className="font-display text-base mb-1" style={{ color: INK }}>{p.title}</h3>
                    <p className="font-mono text-mono-xs leading-relaxed" style={{ color: INK_MUTED }}>
                      {p.question.substring(0, 80)}…
                    </p>
                  </div>
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
