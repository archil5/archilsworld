import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodePiece {
  id: number;
  code: string;
  placed: boolean;
  order: number;
}

const codePieces: CodePiece[] = [
  { id: 0, code: '<!DOCTYPE html>', placed: false, order: 0 },
  { id: 1, code: '<head><title>My First Site</title></head>', placed: false, order: 1 },
  { id: 2, code: '<body style="background:#faf8f4">', placed: false, order: 2 },
  { id: 3, code: '  <h1 style="color:#E44D26">Hello World</h1>', placed: false, order: 3 },
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

  const tabStyle = (active: boolean, color: string) => ({
    background: active ? `${color}10` : "rgba(45,42,38,0.03)",
    color: active ? color : "rgba(80,70,60,0.4)",
    border: `1px solid ${active ? `${color}25` : "rgba(180,140,100,0.1)"}`,
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className="flex gap-2 justify-center items-center">
          {(["puzzle", "skills", "value"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={tabStyle(activeTab === tab, "#E44D26")}>
              {tab === "puzzle" ? "🧩 Build" : tab === "skills" ? "⚡ Skills" : "💎 Value"}
            </button>
          ))}
          {activeTab === "puzzle" && placed.length < codePieces.length && (
            <button onClick={handleRevealAll}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={{ color: "#b5653a", background: "rgba(181,101,58,0.08)", border: "1px solid rgba(181,101,58,0.2)" }}>
              ⚡ Reveal All
            </button>
          )}
        </div>

        {activeTab === "puzzle" && (
          <div className="flex flex-col lg:flex-row gap-6 h-[450px]">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex-1 rounded-xl p-4 overflow-y-auto"
                style={{ background: "#fefcf9", border: "1px solid #e0d8cc" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono" style={{ color: "#8a8078" }}>index.html</span>
                  <span className="text-[10px] font-mono ml-auto" style={{ color: "rgba(80,70,60,0.35)" }}>
                    {placed.length}/{codePieces.length} pieces
                  </span>
                </div>
                {placed.map((piece, i) => (
                  <motion.div key={piece.id} initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }} className="font-mono text-xs py-1 flex">
                    <span className="w-6 text-right mr-3 select-none" style={{ color: "#8a8078" }}>{i + 1}</span>
                    <span style={{ color: "#E44D26" }}>{piece.code}</span>
                  </motion.div>
                ))}
                {placed.length < codePieces.length && (
                  <motion.div className="font-mono text-xs py-1 flex items-center"
                    animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <span className="w-6 text-right mr-3" style={{ color: "#8a8078" }}>{placed.length + 1}</span>
                    <span style={{ color: "rgba(228,77,38,0.35)" }}>← place next piece here</span>
                  </motion.div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {available.map(piece => {
                  const isNext = piece.order === nextExpectedOrder;
                  return (
                    <motion.button key={piece.id} onClick={() => handlePlace(piece)}
                      className="font-mono text-[11px] px-3 py-2 rounded-lg cursor-pointer transition-all"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      animate={isNext ? { boxShadow: ["0 0 0px rgba(228,77,38,0)", "0 0 12px rgba(228,77,38,0.2)", "0 0 0px rgba(228,77,38,0)"] } : {}}
                      transition={isNext ? { repeat: Infinity, duration: 2 } : {}}
                      style={{
                        background: isNext ? "rgba(228,77,38,0.06)" : "#fefcf9",
                        color: isNext ? "#E44D26" : "rgba(228,77,38,0.5)",
                        border: `1px solid ${isNext ? "rgba(228,77,38,0.3)" : "#e0d8cc"}`,
                      }}>
                      {piece.code.substring(0, 30)}{piece.code.length > 30 ? "…" : ""}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex-1 rounded-xl p-6 flex flex-col justify-center"
                style={{ background: "#fefcf9", border: "1px solid #e0d8cc" }}>
                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div key="preview" initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }} transition={{ duration: 0.8, type: "spring" }}>
                      <h1 className="text-3xl font-bold mb-3" style={{ color: "#E44D26" }}>Hello, World!</h1>
                      <p className="text-lg mb-2" style={{ color: "#3d7aaf" }}>I made this.</p>
                      <p className="mb-4" style={{ color: "#2d2a26" }}>It's ugly. It's wonderful. And it's <strong style={{ color: "#b5653a" }}>mine</strong>.</p>
                      <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(228,77,38,0.05)", border: "1px solid rgba(228,77,38,0.15)" }}>
                        <p className="text-sm font-body italic" style={{ color: "rgba(45,42,38,0.75)" }}>
                          "The moment I realized I could create something from nothing, there was no going back."
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="progress" className="text-center">
                      <p className="font-body text-sm italic" style={{ color: "rgba(80,70,60,0.4)" }}>
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
              <motion.div key={skill} className="flex items-center gap-2 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: "rgba(228,77,38,0.06)", border: "1px solid rgba(228,77,38,0.15)" }}>
                <span className="text-xs" style={{ color: "#E44D26" }}>◆</span>
                <span className="text-sm font-mono" style={{ color: "#E44D26" }}>{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "value" && (
          <motion.div className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {valueDelivered.map((val, i) => (
              <motion.div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                style={{ background: "rgba(80,70,60,0.04)", border: "1px solid rgba(180,140,100,0.12)" }}>
                <span className="text-base mt-0.5">💎</span>
                <span className="text-sm font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{val}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeBuilderWorld;
