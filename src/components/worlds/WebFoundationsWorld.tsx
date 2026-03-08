import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── HTML/CSS Section ── */
const codePieces = [
  { id: 0, code: '<!DOCTYPE html>', order: 0 },
  { id: 1, code: '<head><title>My First Site</title></head>', order: 1 },
  { id: 2, code: '<body style="background:#faf8f4">', order: 2 },
  { id: 3, code: '  <h1 style="color:#E44D26">Hello World</h1>', order: 3 },
  { id: 4, code: '  <p>I made this. It\'s mine.</p>', order: 4 },
  { id: 5, code: '</body></html>', order: 5 },
];

const htmlSkills = ["HTML5", "CSS3", "Web Design", "DOM Structure", "Semantic Markup", "Box Model", "Typography"];

/* ── Networking Section ── */
interface Node { id: string; label: string; x: number; y: number; detail: string; }

const netNodes: Node[] = [
  { id: "client", label: "My PC", x: 80, y: 180, detail: "Where every question started" },
  { id: "router", label: "Router", x: 230, y: 90, detail: "First gateway to the world" },
  { id: "switch", label: "Switch", x: 230, y: 270, detail: "Layer 2 — where frames live" },
  { id: "firewall", label: "Firewall", x: 380, y: 90, detail: "The gatekeeper" },
  { id: "dns", label: "DNS", x: 380, y: 180, detail: "Names → Numbers" },
  { id: "server", label: "Server", x: 380, y: 270, detail: "Where data lives" },
  { id: "cloud", label: "Internet", x: 530, y: 180, detail: "The infinite network" },
];

const netConns = [
  ["client", "router"], ["client", "switch"],
  ["router", "firewall"], ["router", "dns"],
  ["switch", "server"], ["switch", "dns"],
  ["firewall", "cloud"], ["dns", "cloud"],
  ["server", "cloud"],
];

const netSkills = ["TCP/IP", "OSI Model", "DNS Resolution", "Subnetting", "Network Security", "Packet Analysis", "Wireshark", "Routing Protocols"];

const correctRoute = ["client", "router", "firewall", "cloud"];

/* ── Combined Value ── */
const combinedValue = [
  "Discovered the power of creating from nothing",
  "Saw that networks are just elegant, learnable patterns",
  "Developed the builder's mindset — ship, iterate, improve",
  "Every cloud skill later built on this networking base",
  "Learned to trace problems through layers of abstraction",
];

interface Packet { id: number; from: string; to: string; progress: number; color: string; }

const WebFoundationsWorld = () => {
  const [activeSection, setActiveSection] = useState<"html" | "network" | "skills" | "value">("html");

  /* HTML state */
  const [available, setAvailable] = useState(() => [...codePieces].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState<typeof codePieces>([]);
  const [showPreview, setShowPreview] = useState(false);

  /* Network state */
  const [packets, setPackets] = useState<Packet[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [routeAttempt, setRouteAttempt] = useState<string[]>([]);
  const [routeComplete, setRouteComplete] = useState(false);
  const packetId = useRef(0);

  const nextExpected = placed.length;

  const handlePlace = (piece: typeof codePieces[0]) => {
    if (piece.order !== nextExpected) return;
    setPlaced(prev => [...prev, piece]);
    setAvailable(prev => prev.filter(p => p.id !== piece.id));
  };

  const revealHTML = () => {
    setPlaced([...codePieces].sort((a, b) => a.order - b.order));
    setAvailable([]);
    setTimeout(() => setShowPreview(true), 300);
  };

  useEffect(() => {
    if (placed.length === codePieces.length) setTimeout(() => setShowPreview(true), 600);
  }, [placed.length]);

  /* Network packets */
  useEffect(() => {
    const interval = setInterval(() => {
      const conn = netConns[Math.floor(Math.random() * netConns.length)];
      const colors = ["#3d7aaf", "#b5653a", "#2a7d4f", "#E44D26"];
      setPackets(prev => [...prev.slice(-12), {
        id: packetId.current++,
        from: Math.random() > 0.5 ? conn[1] : conn[0],
        to: Math.random() > 0.5 ? conn[0] : conn[1],
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      }]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const raf = setInterval(() => {
      setPackets(prev => prev.map(p => ({ ...p, progress: p.progress + 0.025 })).filter(p => p.progress <= 1));
    }, 16);
    return () => clearInterval(raf);
  }, []);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    if (!routeComplete) {
      const nextIdx = routeAttempt.length;
      if (correctRoute[nextIdx] === node.id) {
        const newRoute = [...routeAttempt, node.id];
        setRouteAttempt(newRoute);
        if (newRoute.length === correctRoute.length) setRouteComplete(true);
      } else if (routeAttempt.length > 0) setRouteAttempt([]);
    }
  };

  const getPos = (id: string) => { const n = netNodes.find(n => n.id === id)!; return { x: n.x, y: n.y }; };

  const sectionColor = activeSection === "html" ? "#E44D26" : activeSection === "network" ? "#0078D4" : activeSection === "skills" ? "#2a7d4f" : "#b5653a";

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Section tabs */}
        <div className="flex gap-2 justify-center items-center flex-wrap">
          {([
            { key: "html", label: "🧩 HTML Builder", color: "#E44D26" },
            { key: "network", label: "🔌 Network Map", color: "#0078D4" },
            { key: "skills", label: "⚡ Skills", color: "#2a7d4f" },
            { key: "value", label: "💎 Value", color: "#b5653a" },
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
          {/* ── HTML Builder ── */}
          {activeSection === "html" && (
            <motion.div key="html" className="flex flex-col lg:flex-row gap-6" style={{ minHeight: 400 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.55)" }}>
                    {placed.length}/{codePieces.length} pieces placed
                  </span>
                  {placed.length < codePieces.length && (
                    <button onClick={revealHTML}
                      className="text-[10px] font-mono px-3 py-1 rounded cursor-pointer"
                      style={{ color: "#b5653a", background: "rgba(181,101,58,0.08)", border: "1px solid rgba(181,101,58,0.2)" }}>
                      ⚡ Reveal All
                    </button>
                  )}
                </div>
                <div className="flex-1 rounded-xl p-4 overflow-y-auto" style={{ background: "#fefcf9", border: "1px solid #e0d8cc" }}>
                  <p className="text-xs font-mono mb-3" style={{ color: "#8a8078" }}>index.html</p>
                  {placed.map((piece, i) => (
                    <motion.div key={piece.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-xs py-1 flex">
                      <span className="w-6 text-right mr-3 select-none" style={{ color: "#8a8078" }}>{i + 1}</span>
                      <span style={{ color: "#E44D26" }}>{piece.code}</span>
                    </motion.div>
                  ))}
                  {placed.length < codePieces.length && (
                    <motion.div className="font-mono text-xs py-1 flex" animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}>
                      <span className="w-6 text-right mr-3" style={{ color: "#8a8078" }}>{placed.length + 1}</span>
                      <span style={{ color: "rgba(228,77,38,0.35)" }}>← place next piece here</span>
                    </motion.div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {available.map(piece => {
                    const isNext = piece.order === nextExpected;
                    return (
                      <motion.button key={piece.id} onClick={() => handlePlace(piece)}
                        className="font-mono text-[11px] px-3 py-2 rounded-lg cursor-pointer"
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
              <div className="flex-1 rounded-xl p-6 flex flex-col justify-center" style={{ background: "#fefcf9", border: "1px solid #e0d8cc" }}>
                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div key="preview" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}>
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
                    <motion.div key="hint" className="text-center">
                      <p className="font-body text-sm italic" style={{ color: "rgba(80,70,60,0.6)" }}>
                        Click the pieces in the right order to build the page...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Network Map ── */}
          {activeSection === "network" && (
            <motion.div key="network" className="flex flex-col lg:flex-row gap-6 items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex-1">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-mono" style={{ color: routeComplete ? "#2a7d4f" : "rgba(80,70,60,0.55)" }}>
                    {routeComplete ? "✓ PACKET ROUTED SUCCESSFULLY" : `🎯 Route: ${correctRoute.join(" → ")}`}
                  </span>
                </div>
                <svg viewBox="0 0 610 360" className="w-full max-w-lg mx-auto">
                  {netConns.map(([from, to], i) => {
                    const a = getPos(from), b = getPos(to);
                    const onRoute = routeComplete && correctRoute.includes(from) && correctRoute.includes(to) &&
                      Math.abs(correctRoute.indexOf(from) - correctRoute.indexOf(to)) === 1;
                    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={onRoute ? "#2a7d4f" : "rgba(180,140,100,0.2)"} strokeWidth={onRoute ? 3 : 2} strokeDasharray={onRoute ? "0" : "4 4"} />;
                  })}
                  {packets.map(p => {
                    const a = getPos(p.from), b = getPos(p.to);
                    return <circle key={p.id} cx={a.x + (b.x - a.x) * p.progress} cy={a.y + (b.y - a.y) * p.progress}
                      r={3} fill={p.color} opacity={1 - p.progress * 0.5} />;
                  })}
                  {netNodes.map(node => {
                    const inRoute = routeAttempt.includes(node.id);
                    return (
                      <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                        <circle cx={node.x} cy={node.y} r={30}
                          fill={inRoute ? "rgba(42,125,79,0.1)" : selectedNode?.id === node.id ? "rgba(61,122,175,0.08)" : "#fefcf9"}
                          stroke={inRoute ? "#2a7d4f" : selectedNode?.id === node.id ? "#3d7aaf" : "rgba(180,140,100,0.3)"}
                          strokeWidth={selectedNode?.id === node.id ? 3 : 2} />
                        <text x={node.x} y={node.y + 4} textAnchor="middle"
                          fill={inRoute ? "#2a7d4f" : "#3d7aaf"} fontSize="10" fontFamily="JetBrains Mono, monospace">
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="flex-1 max-w-sm">
                {selectedNode ? (
                  <motion.div key={selectedNode.id} className="rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: "#fefcf9", border: "1px solid rgba(61,122,175,0.15)" }}>
                    <h3 className="font-display text-xl mb-2" style={{ color: "#3d7aaf" }}>{selectedNode.label}</h3>
                    <p className="font-body text-sm italic" style={{ color: "rgba(45,42,38,0.7)" }}>{selectedNode.detail}</p>
                  </motion.div>
                ) : (
                  <p className="font-body text-sm italic text-center" style={{ color: "rgba(80,70,60,0.55)" }}>
                    Click a node to inspect it. Route the packet to win.
                  </p>
                )}
                {routeComplete && (
                  <motion.div className="mt-4 p-4 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.2)" }}>
                    <p className="text-sm font-body italic" style={{ color: "#2a7d4f" }}>
                      "Not when I learned what to build, but when I realized I could learn anything."
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Skills ── */}
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

          {/* ── Value ── */}
          {activeSection === "value" && (
            <motion.div key="value" className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {combinedValue.map((val, i) => (
                <motion.div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                  style={{ background: "rgba(80,70,60,0.04)", border: "1px solid rgba(180,140,100,0.12)" }}>
                  <span className="text-base mt-0.5">💎</span>
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
