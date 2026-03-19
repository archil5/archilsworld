import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INK = "hsl(220, 30%, 10%)";
const INK_MUTED = "hsl(220, 12%, 38%)";
const COPPER = "hsl(144, 14%, 55%)";
const VERMILLION = "hsl(5, 50%, 48%)";
const HTML_COLOR = "#8B6350";

const codePieces = [
  { id: 0, code: '<!DOCTYPE html>', order: 0, hint: "Every page starts here" },
  { id: 1, code: '<html lang="en">', order: 1, hint: "The root element" },
  { id: 2, code: '<head><title>Archil\'s First Site</title></head>', order: 2, hint: "Meta info lives here" },
  { id: 3, code: '<body style="font-family: monospace">', order: 3, hint: "The visible page begins" },
  { id: 4, code: '  <h1 style="color:#8B6350">Hello, World.</h1>', order: 4, hint: "The first thing I ever made" },
  { id: 5, code: '  <p>Built by a kid who wouldn\'t stop asking <em>how</em>.</p>', order: 5, hint: "The origin story" },
  { id: 6, code: '  <marquee>This changes everything.</marquee>', order: 6, hint: "Peak 2000s energy" },
  { id: 7, code: '</body></html>', order: 7, hint: "Close it up" },
];

const previewStages: Record<number, JSX.Element> = {
  0: <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>Document type declared...</p>,
  1: <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>Root element opened...</p>,
  2: (
    <div>
      <div className="font-mono text-mono-xs px-2 py-1 inline-block" style={{ background: `${HTML_COLOR}08`, color: HTML_COLOR }}>
        Tab title: Archil's First Site
      </div>
    </div>
  ),
  3: (
    <div className="p-3" style={{ background: `${INK}02`, border: `1px dashed ${HTML_COLOR}20`, fontFamily: "monospace" }}>
      <span className="font-mono text-mono-xs" style={{ color: `${INK_MUTED}60` }}>body rendered — waiting for content...</span>
    </div>
  ),
  4: (
    <div className="p-3" style={{ background: `${INK}02`, border: `1px dashed ${HTML_COLOR}20`, fontFamily: "monospace" }}>
      <h1 className="font-display text-display-md font-bold" style={{ color: HTML_COLOR }}>Hello, World.</h1>
    </div>
  ),
  5: (
    <div className="p-3" style={{ background: `${INK}02`, border: `1px dashed ${HTML_COLOR}20`, fontFamily: "monospace" }}>
      <h1 className="font-display text-display-md font-bold mb-1" style={{ color: HTML_COLOR }}>Hello, World.</h1>
      <p className="font-display text-sm" style={{ color: INK }}>Built by a kid who wouldn't stop asking <em>how</em>.</p>
    </div>
  ),
  6: (
    <div className="p-3 overflow-hidden" style={{ background: `${INK}02`, border: `1px dashed ${HTML_COLOR}20`, fontFamily: "monospace" }}>
      <h1 className="font-display text-display-md font-bold mb-1" style={{ color: HTML_COLOR }}>Hello, World.</h1>
      <p className="font-display text-sm mb-2" style={{ color: INK }}>Built by a kid who wouldn't stop asking <em>how</em>.</p>
      <div className="relative" style={{ overflow: "hidden", width: "100%" }}>
        <motion.p className="font-display text-sm italic"
          initial={{ x: 0 }}
          animate={{ x: [0, 250, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 1] }}
          style={{ color: COPPER, width: "fit-content" }}>
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

  const revealAll = () => {
    const sorted = [...codePieces].sort((a, b) => a.order - b.order);
    setPlaced(sorted);
    setAvailable([]);
    setComplete(true);
  };

  const lastPlacedOrder = placed.length > 0 ? placed[placed.length - 1].order : -1;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full" style={{ minHeight: 420 }}>
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
            index.html — {placed.length}/{codePieces.length} lines
          </span>
          <div className="flex gap-2">
            {!complete && (
              <button onClick={revealAll}
                className="font-mono text-mono-xs px-3 py-1"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                Reveal All
              </button>
            )}
            <button onClick={reset}
              className="font-mono text-mono-xs px-3 py-1"
              style={{ color: COPPER, background: `${COPPER}08`, border: `1px solid ${COPPER}20` }}>
              Reset
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto" style={{ background: INK, border: `1px solid ${INK_MUTED}20` }}>
          {placed.map((piece, i) => (
            <motion.div key={piece.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              className="font-mono text-sm py-0.5 flex">
              <span className="w-6 text-right mr-3 select-none" style={{ color: `${INK_MUTED}` }}>{i + 1}</span>
              <span style={{ color: HTML_COLOR }}>{piece.code}</span>
            </motion.div>
          ))}
          {!complete && (
            <motion.div className="font-mono text-sm py-0.5 flex"
              animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <span className="w-6 text-right mr-3" style={{ color: INK_MUTED }}>{placed.length + 1}</span>
              <span style={{ color: `${HTML_COLOR}40` }}>│</span>
            </motion.div>
          )}
        </div>

        {!complete && nextExpected < codePieces.length && (
          <p className="font-mono text-mono-xs italic" style={{ color: INK_MUTED }}>
            Hint: {codePieces[nextExpected].hint}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {available.map(piece => {
            const isNext = piece.order === nextExpected;
            const isWrong = wrongId === piece.id;
            return (
              <motion.button key={piece.id} onClick={() => handlePlace(piece)}
                className="font-mono text-mono-xs px-3 py-2"
                whileTap={{ scale: 0.96 }}
                animate={isWrong ? { x: [0, -6, 6, -3, 3, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : {}}
                style={{
                  background: isWrong ? `${VERMILLION}08` : isNext ? `${HTML_COLOR}06` : `${INK}03`,
                  color: isWrong ? VERMILLION : isNext ? HTML_COLOR : INK_MUTED,
                  border: `1px solid ${isWrong ? `${VERMILLION}30` : isNext ? `${HTML_COLOR}25` : `${INK}08`}`,
                }}>
                {piece.code.length > 35 ? piece.code.substring(0, 35) + "…" : piece.code}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center" style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2" style={{ background: VERMILLION }} />
            <div className="w-2 h-2" style={{ background: "hsl(43, 55%, 55%)" }} />
            <div className="w-2 h-2" style={{ background: COPPER }} />
          </div>
          <span className="font-mono text-mono-xs ml-2" style={{ color: `${INK_MUTED}40` }}>localhost:3000</span>
        </div>

        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}>
              {previewStages[6]}
              <motion.div className="mt-4 p-3"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>
                  "The moment I saw my words appear in a browser, I knew — I was going to build things for the rest of my life."
                </p>
              </motion.div>
            </motion.div>
          ) : lastPlacedOrder >= 0 && previewStages[lastPlacedOrder] ? (
            <motion.div key={lastPlacedOrder} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {previewStages[lastPlacedOrder]}
            </motion.div>
          ) : (
            <motion.div key="empty" className="text-center py-8">
              <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>
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
   OSI PUZZLE
   ═══════════════════════════════════════════════════════════ */

interface OSILayer { number: number; name: string; color: string; hint: string; }

const osiLayers: OSILayer[] = [
  { number: 7, name: "Application",  color: "#8B6350", hint: "HTTP, DNS, SMTP — where users interact" },
  { number: 6, name: "Presentation", color: "#9B8B60", hint: "SSL/TLS, encryption, data formatting" },
  { number: 5, name: "Session",      color: "#6B8B6A", hint: "Manages connections and auth tokens" },
  { number: 4, name: "Transport",    color: "#5A7A8B", hint: "TCP/UDP — ports, segments, flow control" },
  { number: 3, name: "Network",      color: "#6B5A7A", hint: "IP addressing, routing, packets" },
  { number: 2, name: "Data Link",    color: "#8B6A50", hint: "MAC addresses, frames, switches" },
  { number: 1, name: "Physical",     color: "#6B6560", hint: "Cables, signals, bits on the wire" },
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

  const revealOSI = () => {
    const sorted = [...osiLayers].sort((a, b) => a.number - b.number);
    setStack(sorted);
    setPool([]);
    setWrong(null);
    setSolved(true);
  };

  const resetPuzzle = () => { setPool(shuffle(osiLayers)); setStack([]); setWrong(null); setSolved(false); };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <p className="font-mono text-mono-xs uppercase tracking-[0.15em]" style={{ color: INK_MUTED }}>
        {solved ? "Network stack complete!" : `Build the OSI model — place Layer ${nextExpected} next`}
      </p>
      <div className="w-full flex flex-col-reverse gap-1 min-h-[100px]">
        {stack.map((layer) => (
          <motion.div key={layer.number} className="w-full flex items-center gap-3 px-4 py-2.5"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.22, 1, 0.36, 1] }}
            style={{ background: `${layer.color}10`, borderLeft: `2px solid ${layer.color}` }}>
            <span className="font-mono text-mono-xs font-bold w-7 h-7 flex items-center justify-center"
              style={{ background: layer.color, color: "#fff" }}>L{layer.number}</span>
            <div className="flex-1">
              <span className="font-display text-sm font-bold" style={{ color: layer.color }}>{layer.name}</span>
              <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>{layer.hint}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {!solved && (
        <div className="w-full py-2 text-center" style={{ border: `2px dashed ${INK}10`, background: `${INK}02` }}>
          <motion.span className="font-mono text-mono-xs" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: INK_MUTED }}>← pick Layer {nextExpected} from below</motion.span>
        </div>
      )}
      {pool.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {pool.map(layer => {
            const isWrong = wrong === layer.number;
            return (
              <motion.button key={layer.number} onClick={() => handlePick(layer)}
                className="flex items-center gap-2 px-3 py-2"
                whileTap={{ scale: 0.95 }}
                animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                style={{
                  background: isWrong ? `${VERMILLION}08` : `${INK}03`,
                  border: `1px solid ${isWrong ? `${VERMILLION}30` : `${INK}08`}`,
                }}>
                <span className="font-mono text-mono-xs font-bold w-6 h-6 flex items-center justify-center"
                  style={{ background: isWrong ? VERMILLION : layer.color, color: "#fff" }}>L{layer.number}</span>
                <span className="font-display text-sm" style={{ color: isWrong ? VERMILLION : INK }}>{layer.name}</span>
              </motion.button>
            );
          })}
        </div>
      )}
      {solved && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-sm italic text-center"
          style={{ color: INK_MUTED }}>
          "Understanding the OSI model taught me to debug any system — layer by layer, from cable to cloud."
        </motion.p>
      )}
      <div className="flex gap-2">
        {!solved && (
          <button onClick={revealOSI} className="font-mono text-mono-xs px-4 py-1.5"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            Reveal All
          </button>
        )}
        <button onClick={resetPuzzle} className="font-mono text-mono-xs px-4 py-1.5"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          {solved ? "Replay" : "Shuffle"}
        </button>
      </div>
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
            { key: "html", label: "HTML Builder", color: HTML_COLOR },
            { key: "network", label: "OSI Puzzle", color: "#5A7A8B" },
            { key: "skills", label: "Skills", color: COPPER },
            { key: "value", label: "Value", color: "hsl(30, 18%, 50%)" },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveSection(tab.key)}
              className="px-4 py-1.5 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
              style={{
                background: activeSection === tab.key ? INK : `${INK}04`,
                color: activeSection === tab.key ? "#E8E0D0" : INK_MUTED,
                border: `1px solid ${activeSection === tab.key ? INK : `${INK}08`}`,
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
              <h4 className="font-mono text-mono-xs uppercase tracking-[0.15em] text-center mb-4" style={{ color: HTML_COLOR }}>Web Technologies</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {htmlSkills.map((skill, i) => (
                  <motion.div key={skill} className="flex items-center gap-2 px-3 py-2.5"
                    initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: `${HTML_COLOR}06`, borderLeft: `2px solid ${HTML_COLOR}30` }}>
                    <span className="font-mono text-mono-xs" style={{ color: HTML_COLOR }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
              <h4 className="font-mono text-mono-xs uppercase tracking-[0.15em] text-center mb-4" style={{ color: "#5A7A8B" }}>Networking</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {netSkills.map((skill, i) => (
                  <motion.div key={skill} className="flex items-center gap-2 px-3 py-2.5"
                    initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                    style={{ background: "hsl(200 20% 50% / 0.06)", borderLeft: "2px solid hsl(200 20% 50% / 0.3)" }}>
                    <span className="font-mono text-mono-xs" style={{ color: "#5A7A8B" }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {activeSection === "value" && (
            <motion.div key="value" className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {combinedValue.map((val, i) => (
                <motion.div key={i} className="flex items-start gap-3 px-4 py-3"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                  style={{ background: `${INK}03`, borderLeft: `2px solid ${COPPER}20` }}>
                  <span className="font-mono text-mono-xs mt-1" style={{ color: COPPER }}>▸</span>
                  <span className="font-display text-sm" style={{ color: INK_MUTED }}>{val}</span>
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