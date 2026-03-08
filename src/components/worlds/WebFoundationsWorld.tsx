import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   HTML BUILDER PUZZLE — Drag & drop code to build YOUR page
   More personal: you're building Archil's actual first website
   ═══════════════════════════════════════════════════════════ */

const codePieces = [
  { id: 0, code: '<!DOCTYPE html>', order: 0, hint: "Every page starts here" },
  { id: 1, code: '<html lang="en">', order: 1, hint: "The root element" },
  { id: 2, code: '<head><title>Archil\'s First Site</title></head>', order: 2, hint: "Meta info lives here" },
  { id: 3, code: '<body style="font-family: monospace">', order: 3, hint: "The visible page begins" },
  { id: 4, code: '  <h1 style="color:#E44D26">Hello, World.</h1>', order: 4, hint: "The first thing I ever made" },
  { id: 5, code: '  <p>Built by a kid who wouldn\'t stop asking <em>how</em>.</p>', order: 5, hint: "The origin story" },
  { id: 6, code: '  <marquee>This changes everything.</marquee>', order: 6, hint: "Peak 2000s energy" },
  { id: 7, code: '</body></html>', order: 7, hint: "Close it up" },
];

// Progressive preview stages — each piece unlocks more of the rendered page
const previewStages: Record<number, JSX.Element> = {
  0: <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.4)" }}>Document type declared...</p>,
  1: <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.4)" }}>Root element opened...</p>,
  2: (
    <div>
      <div className="text-[9px] font-mono px-2 py-1 rounded mb-1 inline-block" style={{ background: "rgba(228,77,38,0.06)", color: "#E44D26" }}>
        Tab title: Archil's First Site
      </div>
    </div>
  ),
  3: (
    <div className="p-3 rounded-lg" style={{ background: "#faf8f4", border: "1px dashed rgba(228,77,38,0.2)", fontFamily: "monospace" }}>
      <span className="text-[10px]" style={{ color: "rgba(80,70,60,0.3)" }}>body rendered — waiting for content...</span>
    </div>
  ),
  4: (
    <div className="p-3 rounded-lg" style={{ background: "#faf8f4", border: "1px dashed rgba(228,77,38,0.2)", fontFamily: "monospace" }}>
      <h1 className="text-2xl font-bold" style={{ color: "#E44D26" }}>Hello, World.</h1>
    </div>
  ),
  5: (
    <div className="p-3 rounded-lg" style={{ background: "#faf8f4", border: "1px dashed rgba(228,77,38,0.2)", fontFamily: "monospace" }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#E44D26" }}>Hello, World.</h1>
      <p className="text-sm" style={{ color: "#2d2a26" }}>Built by a kid who wouldn't stop asking <em>how</em>.</p>
    </div>
  ),
  6: (
    <div className="p-3 rounded-lg overflow-hidden" style={{ background: "#faf8f4", border: "1px dashed rgba(228,77,38,0.2)", fontFamily: "monospace" }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#E44D26" }}>Hello, World.</h1>
      <p className="text-sm mb-2" style={{ color: "#2d2a26" }}>Built by a kid who wouldn't stop asking <em>how</em>.</p>
      <div className="relative" style={{ overflow: "hidden", width: "100%" }}>
        <motion.p className="text-xs italic"
          initial={{ x: 0 }}
          animate={{ x: [0, 250, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
          style={{ color: "#b5653a", width: "fit-content" }}>
          This changes everything.
        </motion.p>
      </div>
    </div>
  ),
};

const HTMLBuilderPuzzle = () => {
  const [available, setAvailable] = useState(() => [...codePieces].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState<typeof codePieces>([]);
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);

  const nextExpected = placed.length;

  const handlePlace = (piece: typeof codePieces[0]) => {
    if (piece.order !== nextExpected) {
      setWrongId(piece.id);
      setTimeout(() => setWrongId(null), 600);
      return;
    }
    setPlaced(prev => [...prev, piece]);
    setAvailable(prev => prev.filter(p => p.id !== piece.id));
  };

  useEffect(() => {
    if (placed.length === codePieces.length) setTimeout(() => setComplete(true), 400);
  }, [placed.length]);

  const reset = () => {
    setAvailable([...codePieces].sort(() => Math.random() - 0.5));
    setPlaced([]);
    setWrongId(null);
    setComplete(false);
  };

  const lastPlacedOrder = placed.length > 0 ? placed[placed.length - 1].order : -1;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full" style={{ minHeight: 420 }}>
      {/* Left: code editor */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>
            index.html — {placed.length}/{codePieces.length} lines
          </span>
          <button onClick={reset}
            className="text-[10px] font-mono px-3 py-1 rounded cursor-pointer"
            style={{ color: "#b5653a", background: "rgba(181,101,58,0.08)", border: "1px solid rgba(181,101,58,0.2)" }}>
            Reset
          </button>
        </div>

        {/* Editor area */}
        <div className="flex-1 rounded-xl p-4 overflow-y-auto" style={{ background: "#1e1e1e", border: "1px solid #333" }}>
          {placed.map((piece, i) => (
            <motion.div key={piece.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[11px] py-0.5 flex">
              <span className="w-6 text-right mr-3 select-none" style={{ color: "#555" }}>{i + 1}</span>
              <span style={{ color: "#e06c75" }}>{piece.code}</span>
            </motion.div>
          ))}
          {!complete && (
            <motion.div className="font-mono text-[11px] py-0.5 flex"
              animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <span className="w-6 text-right mr-3" style={{ color: "#555" }}>{placed.length + 1}</span>
              <span style={{ color: "rgba(224,108,117,0.3)" }}>│</span>
            </motion.div>
          )}
        </div>

        {/* Hint */}
        {!complete && nextExpected < codePieces.length && (
          <p className="text-[10px] font-mono italic" style={{ color: "rgba(80,70,60,0.4)" }}>
            Hint: {codePieces[nextExpected].hint}
          </p>
        )}

        {/* Available pieces */}
        <div className="flex flex-wrap gap-2">
          {available.map(piece => {
            const isNext = piece.order === nextExpected;
            const isWrong = wrongId === piece.id;
            return (
              <motion.button key={piece.id} onClick={() => handlePlace(piece)}
                className="font-mono text-[10px] px-3 py-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                animate={isWrong ? { x: [0, -6, 6, -3, 3, 0] } : isNext ? {
                  boxShadow: ["0 0 0px rgba(228,77,38,0)", "0 0 10px rgba(228,77,38,0.15)", "0 0 0px rgba(228,77,38,0)"]
                } : {}}
                transition={isWrong ? { duration: 0.4 } : isNext ? { repeat: Infinity, duration: 2 } : {}}
                style={{
                  background: isWrong ? "rgba(220,50,50,0.08)" : isNext ? "rgba(228,77,38,0.06)" : "#fefcf9",
                  color: isWrong ? "#dc3232" : isNext ? "#E44D26" : "rgba(80,70,60,0.5)",
                  border: `1px solid ${isWrong ? "rgba(220,50,50,0.3)" : isNext ? "rgba(228,77,38,0.25)" : "#e0d8cc"}`,
                }}>
                {piece.code.length > 35 ? piece.code.substring(0, 35) + "…" : piece.code}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right: live preview */}
      <div className="flex-1 rounded-xl p-6 flex flex-col justify-center" style={{ background: "#fefcf9", border: "1px solid #e0d8cc" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="text-[9px] font-mono ml-2" style={{ color: "rgba(80,70,60,0.3)" }}>
            localhost:3000
          </span>
        </div>

        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div key="done" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}>
              {previewStages[6]}
              <motion.div className="mt-4 p-3 rounded-lg"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ background: "rgba(228,77,38,0.05)", border: "1px solid rgba(228,77,38,0.15)" }}>
                <p className="text-sm font-body italic" style={{ color: "rgba(45,42,38,0.75)" }}>
                  "The moment I saw my words appear in a browser, I knew — I was going to build things for the rest of my life."
                </p>
              </motion.div>
            </motion.div>
          ) : lastPlacedOrder >= 0 && previewStages[lastPlacedOrder] ? (
            <motion.div key={lastPlacedOrder} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {previewStages[lastPlacedOrder]}
            </motion.div>
          ) : (
            <motion.div key="empty" className="text-center py-8">
              <p className="font-body text-sm italic" style={{ color: "rgba(80,70,60,0.4)" }}>
                Start placing code to see the page come alive...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   OSI PUZZLE — Sort the 7 layers in correct order
   ═══════════════════════════════════════════════════════════ */

interface OSILayer { number: number; name: string; color: string; hint: string; }

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

  const resetPuzzle = () => { setPool(shuffle(osiLayers)); setStack([]); setWrong(null); setSolved(false); };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(80,70,60,0.5)" }}>
        {solved ? "Network stack complete!" : `Build the OSI model — place Layer ${nextExpected} next`}
      </p>
      <div className="w-full flex flex-col-reverse gap-1 min-h-[100px]">
        {stack.map((layer) => (
          <motion.div key={layer.number} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ background: `${layer.color}12`, border: `2px solid ${layer.color}40`, boxShadow: `0 2px 8px ${layer.color}15` }}>
            <span className="text-[10px] font-mono font-bold w-7 h-7 flex items-center justify-center rounded"
              style={{ background: layer.color, color: "#fff" }}>L{layer.number}</span>
            <div className="flex-1">
              <span className="text-xs font-display font-bold" style={{ color: layer.color }}>{layer.name}</span>
              <p className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>{layer.hint}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {!solved && (
        <div className="w-full rounded-lg py-2 text-center" style={{ border: "2px dashed rgba(180,140,100,0.2)", background: "rgba(180,140,100,0.03)" }}>
          <motion.span className="text-[10px] font-mono" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: "rgba(80,70,60,0.4)" }}>← pick Layer {nextExpected} from below</motion.span>
        </div>
      )}
      {pool.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {pool.map(layer => {
            const isWrong = wrong === layer.number;
            return (
              <motion.button key={layer.number} onClick={() => handlePick(layer)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                style={{
                  background: isWrong ? "rgba(220,50,50,0.08)" : "#fefcf9",
                  border: `1px solid ${isWrong ? "rgba(220,50,50,0.3)" : "rgba(180,140,100,0.15)"}`,
                }}>
                <span className="text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded"
                  style={{ background: isWrong ? "#dc3232" : layer.color, color: "#fff" }}>L{layer.number}</span>
                <span className="text-xs font-display" style={{ color: isWrong ? "#dc3232" : "#2d2a26" }}>{layer.name}</span>
              </motion.button>
            );
          })}
        </div>
      )}
      {solved && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-body italic text-center"
          style={{ color: "rgba(45,42,38,0.7)" }}>
          "Understanding the OSI model taught me to debug any system — layer by layer, from cable to cloud."
        </motion.p>
      )}
      <button onClick={resetPuzzle} className="text-[10px] font-mono px-4 py-1.5 rounded-lg cursor-pointer"
        style={{ color: "rgba(80,70,60,0.6)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>
        {solved ? "Replay" : "Shuffle"}
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SKILLS + VALUE
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

/* ═══════════════════════════════════════════════════════════ */

const WebFoundationsWorld = () => {
  const [activeSection, setActiveSection] = useState<"html" | "network" | "skills" | "value">("html");

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className="flex gap-2 justify-center items-center flex-wrap">
          {([
            { key: "html", label: "HTML Builder", color: "#E44D26" },
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
            <motion.div key="html" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HTMLBuilderPuzzle />
            </motion.div>
          )}
          {activeSection === "network" && (
            <motion.div key="network" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
