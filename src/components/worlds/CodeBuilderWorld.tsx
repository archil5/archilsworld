import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Board-game mechanic: PUZZLE ASSEMBLY ──
   User drags code snippets into the correct order to "build" the webpage.
   Like a jigsaw puzzle / card drafting mechanic. */

interface CodePiece {
  id: number;
  code: string;
  placed: boolean;
  order: number; // correct position
}

const codePieces: CodePiece[] = [
  { id: 0, code: '<!DOCTYPE html>', placed: false, order: 0 },
  { id: 1, code: '<head><title>My First Site</title></head>', placed: false, order: 1 },
  { id: 2, code: '<body style="background:#1a1a2e">', placed: false, order: 2 },
  { id: 3, code: '  <h1 style="color:#e8c460">Hello World</h1>', placed: false, order: 3 },
  { id: 4, code: '  <p>I made this. It\'s mine.</p>', placed: false, order: 4 },
  { id: 5, code: '</body></html>', placed: false, order: 5 },
];

const achievements = [
  { pieces: 1, text: "First line written. The journey begins.", icon: "✏️" },
  { pieces: 3, text: "Structure taking shape. Head, body, soul.", icon: "🏗️" },
  { pieces: 5, text: "Content flowing. Words becoming real.", icon: "✨" },
  { pieces: 6, text: "COMPLETE — A webpage, built from nothing.", icon: "🏆" },
];

const skillsLearned = [
  "HTML5", "CSS3", "Web Design", "DOM Structure",
  "Semantic Markup", "Box Model", "Typography",
];

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
    if (piece.order !== nextExpectedOrder) return; // wrong order — shake?
    setPlaced(prev => [...prev, { ...piece, placed: true }]);
    setAvailable(prev => prev.filter(p => p.id !== piece.id));
  };

  useEffect(() => {
    if (placed.length === codePieces.length) {
      setTimeout(() => setShowPreview(true), 600);
    }
  }, [placed.length]);

  const currentAchievement = achievements.filter(a => a.pieces <= placed.length).pop();

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Tab navigation */}
        <div className="flex gap-2 justify-center">
          {(["puzzle", "skills", "value"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={{
                background: activeTab === tab ? "rgba(232,196,96,0.15)" : "rgba(40,30,20,0.4)",
                color: activeTab === tab ? "#e8c460" : "rgba(232,196,96,0.4)",
                border: `1px solid ${activeTab === tab ? "rgba(232,196,96,0.3)" : "rgba(232,196,96,0.1)"}`,
              }}
            >
              {tab === "puzzle" ? "🧩 Build" : tab === "skills" ? "⚡ Skills" : "💎 Value"}
            </button>
          ))}
        </div>

        {activeTab === "puzzle" && (
          <div className="flex flex-col lg:flex-row gap-6 h-[450px]">
            {/* Code assembly area */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Placed pieces */}
              <div
                className="flex-1 rounded-lg p-4 overflow-y-auto"
                style={{ background: "#1e1e2e", border: "1px solid #333" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono" style={{ color: "#555" }}>index.html</span>
                  <span className="text-[10px] font-mono ml-auto" style={{ color: "rgba(232,196,96,0.4)" }}>
                    {placed.length}/{codePieces.length} pieces
                  </span>
                </div>
                {placed.map((piece, i) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="font-mono text-xs py-1 flex"
                  >
                    <span className="w-6 text-right mr-3 select-none" style={{ color: "#555" }}>{i + 1}</span>
                    <span style={{ color: "#89b4fa" }}>{piece.code}</span>
                  </motion.div>
                ))}
                {placed.length < codePieces.length && (
                  <motion.div
                    className="font-mono text-xs py-1 flex items-center"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <span className="w-6 text-right mr-3" style={{ color: "#555" }}>{placed.length + 1}</span>
                    <span style={{ color: "rgba(232,196,96,0.3)" }}>← place next piece here</span>
                  </motion.div>
                )}
              </div>

              {/* Available pieces to click */}
              <div className="flex flex-wrap gap-2">
                {available.map(piece => {
                  const isNext = piece.order === nextExpectedOrder;
                  return (
                    <motion.button
                      key={piece.id}
                      onClick={() => handlePlace(piece)}
                      className="font-mono text-[11px] px-3 py-2 rounded-lg cursor-pointer transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isNext ? { boxShadow: ["0 0 0px rgba(232,196,96,0)", "0 0 15px rgba(232,196,96,0.3)", "0 0 0px rgba(232,196,96,0)"] } : {}}
                      transition={isNext ? { repeat: Infinity, duration: 2 } : {}}
                      style={{
                        background: "rgba(40,30,20,0.6)",
                        color: isNext ? "#e8c460" : "rgba(232,196,96,0.5)",
                        border: `1px solid ${isNext ? "rgba(232,196,96,0.4)" : "rgba(232,196,96,0.1)"}`,
                      }}
                    >
                      {piece.code.substring(0, 30)}{piece.code.length > 30 ? "…" : ""}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Preview / Achievement panel */}
            <div className="flex-1 flex flex-col gap-3">
              <div
                className="flex-1 rounded-lg p-6 flex flex-col justify-center"
                style={{ background: "rgba(26,26,46,0.8)", border: "1px solid #333" }}
              >
                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      style={{ perspective: 800 }}
                    >
                      <h1 className="text-3xl font-bold mb-3" style={{ color: "#e8c460" }}>Hello, World!</h1>
                      <p className="text-lg mb-2" style={{ color: "#4fc3f7" }}>I made this.</p>
                      <p className="mb-4" style={{ color: "#eee" }}>It's ugly. It's wonderful. And it's <strong style={{ color: "#f9e2af" }}>mine</strong>.</p>
                      <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(232,196,96,0.08)", border: "1px solid rgba(232,196,96,0.2)" }}>
                        <p className="text-sm font-body italic" style={{ color: "rgba(240,230,208,0.8)" }}>
                          "The moment I realized I could create something from nothing, there was no going back."
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="progress" className="text-center">
                      {currentAchievement && (
                        <motion.div
                          key={currentAchievement.pieces}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-4xl">{currentAchievement.icon}</span>
                          <p className="font-body text-sm mt-3 italic" style={{ color: "rgba(240,230,208,0.7)" }}>
                            {currentAchievement.text}
                          </p>
                        </motion.div>
                      )}
                      {!currentAchievement && (
                        <p className="font-body text-sm italic" style={{ color: "rgba(232,196,96,0.4)" }}>
                          Click the pieces in the right order to build the page...
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {skillsLearned.map((skill, i) => (
              <motion.div
                key={skill}
                className="flex items-center gap-2 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ background: "rgba(74,158,255,0.08)", border: "1px solid rgba(74,158,255,0.2)" }}
              >
                <span className="text-xs" style={{ color: "#4a9eff" }}>◆</span>
                <span className="text-sm font-mono" style={{ color: "#4a9eff" }}>{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "value" && (
          <motion.div
            className="max-w-lg mx-auto space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {valueDelivered.map((val, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                style={{ background: "rgba(232,196,96,0.06)", border: "1px solid rgba(232,196,96,0.12)" }}
              >
                <span className="text-base mt-0.5">💎</span>
                <span className="text-sm font-body" style={{ color: "rgba(240,230,208,0.8)" }}>{val}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeBuilderWorld;
