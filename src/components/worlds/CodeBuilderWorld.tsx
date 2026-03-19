import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INK = "hsl(220, 30%, 10%)";
const INK_MUTED = "hsl(220, 12%, 38%)";
const COPPER = "hsl(144, 14%, 55%)";
const HTML_COLOR = "#8B6350";

interface CodePiece {
  id: number;
  code: string;
  placed: boolean;
  order: number;
}

const codePieces: CodePiece[] = [
  { id: 0, code: '<!DOCTYPE html>', placed: false, order: 0 },
  { id: 1, code: '<head><title>My First Site</title></head>', placed: false, order: 1 },
  { id: 2, code: '<body style="background:#E8E0D0">', placed: false, order: 2 },
  { id: 3, code: '  <h1 style="color:#8B6350">Hello World</h1>', placed: false, order: 3 },
  { id: 4, code: '  <p>I made this. It\'s mine.</p>', placed: false, order: 4 },
  { id: 5, code: '</body></html>', placed: false, order: 5 },
];

const skillsLearned = ["HTML5", "CSS3", "Web Design", "DOM Structure", "Semantic Markup", "Box Model", "Typography"];

const valueDelivered = [
  "Discovered the power of creating from nothing",
  "Built first functional websites for family & friends",
  "Learned that ugly + working > beautiful + broken",
  "Developed the builder's mindset — ship, iterate, improve",
];

const CodeBuilderWorld = () => {
  const [available, setAvailable] = useState<CodePiece[]>(() =>
    [...codePieces].sort(() => Math.random() - 0.5)
  );
  const [placed, setPlaced] = useState<CodePiece[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"puzzle" | "skills" | "value">("puzzle");

  const nextExpectedOrder = placed.length;

  const handlePlace = (piece: CodePiece) => {
    if (piece.order !== nextExpectedOrder) return;
    setPlaced(prev => [...prev, { ...piece, placed: true }]);
    setAvailable(prev => prev.filter(p => p.id !== piece.id));
  };

  const handleRevealAll = () => {
    const sorted = [...codePieces].sort((a, b) => a.order - b.order).map(p => ({ ...p, placed: true }));
    setPlaced(sorted);
    setAvailable([]);
    setTimeout(() => setShowPreview(true), 300);
  };

  useEffect(() => {
    if (placed.length === codePieces.length) {
      setTimeout(() => setShowPreview(true), 600);
    }
  }, [placed.length]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className="flex gap-2 justify-center items-center">
          {(["puzzle", "skills", "value"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
              style={{
                background: activeTab === tab ? INK : `${INK}04`,
                color: activeTab === tab ? "#E8E0D0" : INK_MUTED,
                border: `1px solid ${activeTab === tab ? INK : `${INK}08`}`,
              }}>
              {tab === "puzzle" ? "Build" : tab === "skills" ? "Skills" : "Value"}
            </button>
          ))}
          {activeTab === "puzzle" && placed.length < codePieces.length && (
            <button onClick={handleRevealAll}
              className="px-4 py-1.5 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
              style={{ color: COPPER, background: `${COPPER}08`, border: `1px solid ${COPPER}20` }}>
              Reveal All
            </button>
          )}
        </div>

        {activeTab === "puzzle" && (
          <div className="flex flex-col lg:flex-row gap-6 h-[450px]">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex-1 p-4 overflow-y-auto"
                style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>index.html</span>
                  <span className="font-mono text-mono-xs ml-auto" style={{ color: INK_MUTED }}>
                    {placed.length}/{codePieces.length} pieces
                  </span>
                </div>
                {placed.map((piece, i) => (
                  <motion.div key={piece.id} initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }} className="font-mono text-sm py-1 flex">
                    <span className="w-6 text-right mr-3 select-none" style={{ color: INK_MUTED }}>{i + 1}</span>
                    <span style={{ color: HTML_COLOR }}>{piece.code}</span>
                  </motion.div>
                ))}
                {placed.length < codePieces.length && (
                  <motion.div className="font-mono text-sm py-1 flex items-center"
                    animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <span className="w-6 text-right mr-3" style={{ color: INK_MUTED }}>{placed.length + 1}</span>
                    <span style={{ color: `${HTML_COLOR}40` }}>← place next piece</span>
                  </motion.div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {available.map(piece => {
                  const isNext = piece.order === nextExpectedOrder;
                  return (
                    <motion.button key={piece.id} onClick={() => handlePlace(piece)}
                      className="font-mono text-mono-xs px-3 py-2 transition-all"
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: isNext ? `${HTML_COLOR}06` : `${INK}03`,
                        color: isNext ? HTML_COLOR : `${HTML_COLOR}60`,
                        border: `1px solid ${isNext ? `${HTML_COLOR}25` : `${INK}08`}`,
                      }}>
                      {piece.code.substring(0, 30)}{piece.code.length > 30 ? "…" : ""}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex-1 p-6 flex flex-col justify-center"
                style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div key="preview" initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                      <h1 className="font-display text-display-lg font-bold mb-3" style={{ color: HTML_COLOR }}>Hello, World!</h1>
                      <p className="font-display text-lg mb-2" style={{ color: INK_MUTED }}>I made this.</p>
                      <p className="font-display mb-4" style={{ color: INK }}>It's ugly. It's wonderful. And it's <strong style={{ color: COPPER }}>mine</strong>.</p>
                      <div className="mt-4 p-3" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                        <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>
                          "The moment I realized I could create something from nothing, there was no going back."
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="progress" className="text-center">
                      <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>
                        Click the pieces in the right order to build the page...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {skillsLearned.map((skill, i) => (
              <motion.div key={skill} className="flex items-center gap-2 px-4 py-3"
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: `${HTML_COLOR}06`, borderLeft: `2px solid ${HTML_COLOR}30` }}>
                <span className="font-mono text-mono-sm" style={{ color: HTML_COLOR }}>{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "value" && (
          <motion.div className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {valueDelivered.map((val, i) => (
              <motion.div key={i} className="flex items-start gap-3 px-4 py-3"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                style={{ background: `${INK}03`, borderLeft: `2px solid ${COPPER}20` }}>
                <span className="font-mono text-mono-xs mt-1" style={{ color: COPPER }}>▸</span>
                <span className="font-display text-sm" style={{ color: INK_MUTED }}>{val}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeBuilderWorld;