import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   HTML CHESS — Scholar's Mate animated on a pure CSS board
   ═══════════════════════════════════════════════════════════ */

type Pos = [number, number]; // [row, col] 0-indexed from top-left

interface PieceData {
  id: string;
  type: "K" | "Q" | "R" | "B" | "N" | "P";
  color: "w" | "b";
  pos: Pos;
  captured?: boolean;
}

const PIECE_GLYPHS: Record<string, string> = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

const initialPieces: PieceData[] = [
  // Black back rank
  { id: "bR1", type: "R", color: "b", pos: [0, 0] },
  { id: "bN1", type: "N", color: "b", pos: [0, 1] },
  { id: "bB1", type: "B", color: "b", pos: [0, 2] },
  { id: "bQ",  type: "Q", color: "b", pos: [0, 3] },
  { id: "bK",  type: "K", color: "b", pos: [0, 4] },
  { id: "bB2", type: "B", color: "b", pos: [0, 5] },
  { id: "bN2", type: "N", color: "b", pos: [0, 6] },
  { id: "bR2", type: "R", color: "b", pos: [0, 7] },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `bP${i}`, type: "P" as const, color: "b" as const, pos: [1, i] as Pos,
  })),
  // White back rank
  { id: "wR1", type: "R", color: "w", pos: [7, 0] },
  { id: "wN1", type: "N", color: "w", pos: [7, 1] },
  { id: "wB1", type: "B", color: "w", pos: [7, 2] },
  { id: "wQ",  type: "Q", color: "w", pos: [7, 3] },
  { id: "wK",  type: "K", color: "w", pos: [7, 4] },
  { id: "wB2", type: "B", color: "w", pos: [7, 5] },
  { id: "wN2", type: "N", color: "w", pos: [7, 6] },
  { id: "wR2", type: "R", color: "w", pos: [7, 7] },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `wP${i}`, type: "P" as const, color: "w" as const, pos: [6, i] as Pos,
  })),
];

// Scholar's Mate: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#
const moves: { pieceId: string; to: Pos; caption: string; captureId?: string }[] = [
  { pieceId: "wP4", to: [4, 4], caption: "1. e4 — King's pawn opening" },
  { pieceId: "bP4", to: [3, 4], caption: "1... e5 — Mirror response" },
  { pieceId: "wB2", to: [4, 2], caption: "2. Bc4 — Bishop eyes f7" },
  { pieceId: "bN1", to: [2, 2], caption: "2... Nc6 — Develop knight" },
  { pieceId: "wQ",  to: [3, 7], caption: "3. Qh5 — The trap is set" },
  { pieceId: "bN2", to: [2, 5], caption: "3... Nf6?? — A fatal mistake" },
  { pieceId: "wQ",  to: [1, 5], caption: "4. Qxf7# — Scholar's Mate!", captureId: "bP5" },
];

const ChessBoard = () => {
  const [pieces, setPieces] = useState<PieceData[]>(initialPieces);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [highlightSquares, setHighlightSquares] = useState<Pos[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const applyMove = useCallback((idx: number) => {
    if (idx >= moves.length) return;
    const move = moves[idx];
    setPieces(prev => prev.map(p => {
      if (p.id === move.captureId) return { ...p, captured: true };
      if (p.id === move.pieceId) return { ...p, pos: move.to };
      return p;
    }));
    setHighlightSquares(idx > 0 ? [pieces.find(p => p.id === move.pieceId)!.pos, move.to] : [move.to]);
    setMoveIndex(idx);
  }, [pieces]);

  const playAll = useCallback(() => {
    setPieces(initialPieces);
    setMoveIndex(-1);
    setHighlightSquares([]);
    setIsPlaying(true);
    let i = 0;
    const step = () => {
      if (i >= moves.length) { setIsPlaying(false); return; }
      // Need fresh state for highlight calculation
      setPieces(prev => {
        const move = moves[i];
        return prev.map(p => {
          if (p.id === move.captureId) return { ...p, captured: true };
          if (p.id === move.pieceId) return { ...p, pos: move.to };
          return p;
        });
      });
      setMoveIndex(i);
      setHighlightSquares([moves[i].to]);
      i++;
      timerRef.current = setTimeout(step, 1400);
    };
    timerRef.current = setTimeout(step, 600);
  }, []);

  const reset = () => {
    clearTimeout(timerRef.current);
    setPieces(initialPieces);
    setMoveIndex(-1);
    setHighlightSquares([]);
    setIsPlaying(false);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const isHighlighted = (r: number, c: number) =>
    highlightSquares.some(([hr, hc]) => hr === r && hc === c);

  const currentCaption = moveIndex >= 0 ? moves[moveIndex].caption : "Scholar's Mate — built with pure HTML & CSS";
  const isCheckmate = moveIndex === moves.length - 1;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Board */}
      <div className="relative rounded-lg overflow-hidden" style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 0 0 3px rgba(140,110,70,0.3)",
        border: "2px solid rgba(120,90,50,0.4)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", width: 320, height: 320 }}>
          {Array.from({ length: 64 }, (_, idx) => {
            const r = Math.floor(idx / 8);
            const c = idx % 8;
            const isDark = (r + c) % 2 === 1;
            const piece = pieces.find(p => !p.captured && p.pos[0] === r && p.pos[1] === c);
            const lit = isHighlighted(r, c);
            return (
              <div key={idx} style={{
                width: 40, height: 40,
                background: lit
                  ? (isDark ? "rgba(181,101,58,0.5)" : "rgba(212,165,116,0.5)")
                  : (isDark ? "#b5895a" : "#f0dfc0"),
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
                transition: "background 0.3s",
              }}>
                {/* Rank/file labels */}
                {c === 0 && (
                  <span style={{ position: "absolute", left: 2, top: 1, fontSize: 8, color: isDark ? "#f0dfc0" : "#b5895a", fontFamily: "monospace" }}>
                    {8 - r}
                  </span>
                )}
                {r === 7 && (
                  <span style={{ position: "absolute", right: 2, bottom: 0, fontSize: 8, color: isDark ? "#f0dfc0" : "#b5895a", fontFamily: "monospace" }}>
                    {String.fromCharCode(97 + c)}
                  </span>
                )}
                {piece && (
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{
                      fontSize: 28,
                      lineHeight: 1,
                      color: piece.color === "w" ? "#fff" : "#2d2a26",
                      textShadow: piece.color === "w"
                        ? "0 1px 3px rgba(0,0,0,0.4)"
                        : "0 1px 2px rgba(0,0,0,0.2)",
                      filter: isCheckmate && piece.id === "bK" ? "drop-shadow(0 0 8px #e44d26)" : "none",
                    }}
                  >
                    {PIECE_GLYPHS[`${piece.color}${piece.type}`]}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <AnimatePresence mode="wait">
        <motion.p key={moveIndex} className="text-xs font-mono text-center"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ color: isCheckmate ? "#E44D26" : "rgba(45,42,38,0.7)", fontWeight: isCheckmate ? 700 : 400 }}>
          {currentCaption}
        </motion.p>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-2">
        <button onClick={playAll} disabled={isPlaying}
          className="text-[10px] font-mono px-4 py-1.5 rounded-lg cursor-pointer transition-all disabled:opacity-30"
          style={{ color: "#E44D26", background: "rgba(228,77,38,0.06)", border: "1px solid rgba(228,77,38,0.2)" }}>
          {moveIndex >= 0 ? "Replay" : "Play Mate"}
        </button>
        <button onClick={reset}
          className="text-[10px] font-mono px-4 py-1.5 rounded-lg cursor-pointer transition-all"
          style={{ color: "rgba(80,70,60,0.6)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>
          Reset
        </button>
      </div>

      <p className="text-[9px] font-mono text-center max-w-xs" style={{ color: "rgba(80,70,60,0.4)" }}>
        Every element above — board, pieces, animation — is pure HTML, CSS & JS. No images. No canvas. Just the web platform.
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   OSI PUZZLE — Sort the 7 layers in correct order
   ═══════════════════════════════════════════════════════════ */

interface OSILayer {
  number: number;
  name: string;
  color: string;
  hint: string;
}

const osiLayers: OSILayer[] = [
  { number: 7, name: "Application",  color: "#E44D26", hint: "HTTP, DNS, SMTP — where users interact" },
  { number: 6, name: "Presentation", color: "#F0A830", hint: "SSL/TLS, encryption, data formatting" },
  { number: 5, name: "Session",      color: "#2a7d4f", hint: "Manages connections and auth tokens" },
  { number: 4, name: "Transport",    color: "#3d7aaf", hint: "TCP/UDP — ports, segments, flow control" },
  { number: 3, name: "Network",      color: "#6B4C9A", hint: "IP addressing, routing, packets" },
  { number: 2, name: "Data Link",    color: "#b5653a", hint: "MAC addresses, frames, switches" },
  { number: 1, name: "Physical",     color: "#555555", hint: "Cables, signals, bits on the wire" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OSIPuzzle = () => {
  const [pool, setPool] = useState<OSILayer[]>(() => shuffle(osiLayers));
  const [stack, setStack] = useState<OSILayer[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  // Next expected layer number (build from bottom: 1 → 7)
  const nextExpected = stack.length + 1;

  const handlePick = (layer: OSILayer) => {
    if (solved) return;
    if (layer.number === nextExpected) {
      setStack(prev => [...prev, layer]);
      setPool(prev => prev.filter(l => l.number !== layer.number));
      setWrong(null);
      if (layer.number === 7) setSolved(true);
    } else {
      setWrong(layer.number);
      setTimeout(() => setWrong(null), 800);
    }
  };

  const resetPuzzle = () => {
    setPool(shuffle(osiLayers));
    setStack([]);
    setWrong(null);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(80,70,60,0.5)" }}>
        {solved ? "Network stack complete!" : `Build the OSI model — place Layer ${nextExpected} next`}
      </p>

      {/* Built stack */}
      <div className="w-full flex flex-col-reverse gap-1 min-h-[120px]">
        {stack.map((layer, i) => (
          <motion.div key={layer.number}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              background: `${layer.color}12`,
              border: `2px solid ${layer.color}40`,
              boxShadow: `0 2px 8px ${layer.color}15`,
            }}>
            <span className="text-[10px] font-mono font-bold w-7 h-7 flex items-center justify-center rounded"
              style={{ background: layer.color, color: "#fff" }}>L{layer.number}</span>
            <div className="flex-1">
              <span className="text-xs font-display font-bold" style={{ color: layer.color }}>{layer.name}</span>
              <p className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>{layer.hint}</p>
            </div>
            {solved && i === stack.length - 1 && (
              <span className="text-[9px] font-mono" style={{ color: "#2a7d4f" }}>✓</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty slot indicator */}
      {!solved && (
        <div className="w-full rounded-lg py-2 text-center"
          style={{ border: "2px dashed rgba(180,140,100,0.2)", background: "rgba(180,140,100,0.03)" }}>
          <motion.span className="text-[10px] font-mono"
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: "rgba(80,70,60,0.4)" }}>
            ← pick Layer {nextExpected} from below
          </motion.span>
        </div>
      )}

      {/* Available pool */}
      {pool.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {pool.map(layer => {
            const isWrong = wrong === layer.number;
            return (
              <motion.button key={layer.number} onClick={() => handlePick(layer)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : {}}
                style={{
                  background: isWrong ? "rgba(220,50,50,0.08)" : "#fefcf9",
                  border: `1px solid ${isWrong ? "rgba(220,50,50,0.3)" : "rgba(180,140,100,0.15)"}`,
                }}>
                <span className="text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded"
                  style={{ background: isWrong ? "#dc3232" : layer.color, color: "#fff" }}>
                  L{layer.number}
                </span>
                <span className="text-xs font-display" style={{ color: isWrong ? "#dc3232" : "#2d2a26" }}>
                  {layer.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Solved or reset */}
      <div className="flex gap-2">
        {solved && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center">
            <p className="text-xs font-body italic mb-2" style={{ color: "rgba(45,42,38,0.7)" }}>
              "Understanding the OSI model taught me to debug any system — layer by layer, from cable to cloud."
            </p>
          </motion.div>
        )}
        <button onClick={resetPuzzle}
          className="text-[10px] font-mono px-4 py-1.5 rounded-lg cursor-pointer"
          style={{ color: "rgba(80,70,60,0.6)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>
          {solved ? "Replay" : "Shuffle"}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SKILLS + VALUE (kept lean)
   ═══════════════════════════════════════════════════════════ */

const htmlSkills = ["HTML5", "CSS3", "Web Design", "DOM Structure", "Semantic Markup", "Box Model", "Typography"];
const netSkills = ["TCP/IP", "OSI Model", "DNS Resolution", "Subnetting", "Network Security", "Packet Analysis", "Wireshark", "Routing Protocols"];

const combinedValue = [
  "Discovered the power of creating from nothing",
  "Saw that networks are just elegant, learnable patterns",
  "Developed the builder's mindset — ship, iterate, improve",
  "Every cloud skill later built on this networking base",
  "Learned to trace problems through layers of abstraction",
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

const WebFoundationsWorld = () => {
  const [activeSection, setActiveSection] = useState<"html" | "network" | "skills" | "value">("html");

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Section tabs */}
        <div className="flex gap-2 justify-center items-center flex-wrap">
          {([
            { key: "html", label: "HTML Chess", color: "#E44D26" },
            { key: "network", label: "OSI Puzzle", color: "#0078D4" },
            { key: "skills", label: "Skills", color: "#2a7d4f" },
            { key: "value", label: "Value", color: "#b5653a" },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveSection(tab.key)}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={{
                background: activeSection === tab.key ? `${tab.color}12` : "rgba(45,42,38,0.03)",
                color: activeSection === tab.key ? tab.color : "rgba(80,70,60,0.6)",
                border: `1px solid ${activeSection === tab.key ? `${tab.color}30` : "rgba(180,140,100,0.1)"}`,
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeSection === "html" && (
            <motion.div key="html" className="flex flex-col items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ChessBoard />
            </motion.div>
          )}

          {activeSection === "network" && (
            <motion.div key="network"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OSIPuzzle />
            </motion.div>
          )}

          {activeSection === "skills" && (
            <motion.div key="skills" className="max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4 className="text-xs font-mono uppercase tracking-wider text-center mb-4" style={{ color: "#E44D26" }}>Web Technologies</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {htmlSkills.map((skill, i) => (
                  <motion.div key={skill} className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: "rgba(228,77,38,0.06)", border: "1px solid rgba(228,77,38,0.15)" }}>
                    <span className="text-xs" style={{ color: "#E44D26" }}>◆</span>
                    <span className="text-xs font-mono" style={{ color: "#E44D26" }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-center mb-4" style={{ color: "#0078D4" }}>Networking</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {netSkills.map((skill, i) => (
                  <motion.div key={skill} className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                    style={{ background: "rgba(0,120,212,0.06)", border: "1px solid rgba(0,120,212,0.15)" }}>
                    <span className="text-xs" style={{ color: "#0078D4" }}>◆</span>
                    <span className="text-xs font-mono" style={{ color: "#0078D4" }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "value" && (
            <motion.div key="value" className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {combinedValue.map((val, i) => (
                <motion.div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                  style={{ background: "rgba(80,70,60,0.04)", border: "1px solid rgba(180,140,100,0.12)" }}>
                  <span className="text-[10px] mt-1" style={{ color: "#b5653a" }}>▸</span>
                  <span className="text-sm font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{val}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WebFoundationsWorld;
