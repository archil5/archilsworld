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

/* ── OSI Layer Explorer ── */
interface OSILayer {
  number: number;
  name: string;
  color: string;
  icon: string;
  protocols: string[];
  dataUnit: string;
  realWorld: string;
  whatHappens: string;
  mySkill: string;
}

const osiLayers: OSILayer[] = [
  {
    number: 7, name: "Application", color: "#E44D26", icon: "🌐",
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "SSH"],
    dataUnit: "Data",
    realWorld: "The browser, the API call — where humans interact with the network.",
    whatHappens: "User-facing services generate or consume data. REST APIs and web pages live here.",
    mySkill: "Built REST APIs, web apps, and automated SSH deployments across enterprise infra.",
  },
  {
    number: 6, name: "Presentation", color: "#F0A830", icon: "🔐",
    protocols: ["SSL/TLS", "JPEG", "ASCII", "MIME", "JSON"],
    dataUnit: "Data",
    realWorld: "Encryption, compression, formatting — translating between app-speak and network-speak.",
    whatHappens: "Data gets encrypted (TLS handshake), compressed, or formatted for both sides.",
    mySkill: "Implemented TLS termination, certificate management, and data serialization at scale.",
  },
  {
    number: 5, name: "Session", color: "#2a7d4f", icon: "🤝",
    protocols: ["NetBIOS", "RPC", "PPTP", "SCP"],
    dataUnit: "Data",
    realWorld: "Managing connections — who's talking to whom, keeping conversations alive.",
    whatHappens: "Establishes, maintains, and tears down sessions. Handles auth tokens and state.",
    mySkill: "Designed session management for distributed microservices using OAuth2 and Istio.",
  },
  {
    number: 4, name: "Transport", color: "#3d7aaf", icon: "📦",
    protocols: ["TCP", "UDP", "TLS", "QUIC"],
    dataUnit: "Segment",
    realWorld: "TCP guarantees order, UDP trades it for speed. Port numbers identify services.",
    whatHappens: "Data is segmented, sequenced, and flow-controlled. Ports like 80, 443, 22.",
    mySkill: "Configured load balancers, health checks, and connection pooling for banking services.",
  },
  {
    number: 3, name: "Network", color: "#6B4C9A", icon: "🗺️",
    protocols: ["IP", "ICMP", "OSPF", "BGP", "ARP"],
    dataUnit: "Packet",
    realWorld: "Routing — finding the best path. IP addresses live here.",
    whatHappens: "Logical addressing (IP) and routing decisions. Routers forward packets by destination.",
    mySkill: "Designed VPC architectures, subnets, and Transit Gateway topologies for AWS/Azure.",
  },
  {
    number: 2, name: "Data Link", color: "#b5653a", icon: "🔗",
    protocols: ["Ethernet", "Wi-Fi", "PPP", "VLAN"],
    dataUnit: "Frame",
    realWorld: "Local delivery — MAC addresses, switches, VLANs.",
    whatHappens: "Frames with source/destination MACs. Error detection via CRC. Switches operate here.",
    mySkill: "Configured VLANs, switch port security, and 802.1X in enterprise networks.",
  },
  {
    number: 1, name: "Physical", color: "#555555", icon: "⚡",
    protocols: ["Ethernet cables", "Fiber optic", "Wi-Fi radio", "USB"],
    dataUnit: "Bits",
    realWorld: "Raw electricity, light pulses, radio waves — the physics of data.",
    whatHappens: "Binary becomes electrical signals, light, or radio. Cables and NICs live here.",
    mySkill: "Hands-on with rack & stack, cabling, and physical network audits in early career.",
  },
];

const netSkills = ["TCP/IP", "OSI Model", "DNS Resolution", "Subnetting", "Network Security", "Packet Analysis", "Wireshark", "Routing Protocols"];

/* ── Combined Value ── */
const combinedValue = [
  "Discovered the power of creating from nothing",
  "Saw that networks are just elegant, learnable patterns",
  "Developed the builder's mindset — ship, iterate, improve",
  "Every cloud skill later built on this networking base",
  "Learned to trace problems through layers of abstraction",
];

const WebFoundationsWorld = () => {
  const [activeSection, setActiveSection] = useState<"html" | "network" | "skills" | "value">("html");

  /* HTML state */
  const [available, setAvailable] = useState(() => [...codePieces].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState<typeof codePieces>([]);
  const [showPreview, setShowPreview] = useState(false);

  /* OSI state */
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const nextExpected = placed.length;
  const selectedOSI = activeLayer !== null ? osiLayers.find(l => l.number === activeLayer) : null;

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

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Section tabs */}
        <div className="flex gap-2 justify-center items-center flex-wrap">
          {([
            { key: "html", label: "🧩 HTML Builder", color: "#E44D26" },
            { key: "network", label: "🔌 OSI Layers", color: "#0078D4" },
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

          {/* ── OSI Layer Explorer ── */}
          {activeSection === "network" && (
            <motion.div key="network" className="flex flex-col lg:flex-row gap-6 items-start"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-[10px] font-mono mb-2" style={{ color: "rgba(80,70,60,0.55)" }}>
                  Click any layer to explore
                </p>
                <div className="w-full max-w-md flex flex-col gap-1">
                  {osiLayers.map((layer, i) => {
                    const isActive = activeLayer === layer.number;
                    const isHovered = hoveredLayer === layer.number;
                    return (
                      <motion.button key={layer.number}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all text-left"
                        onClick={() => setActiveLayer(isActive ? null : layer.number)}
                        onMouseEnter={() => setHoveredLayer(layer.number)}
                        onMouseLeave={() => setHoveredLayer(null)}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        style={{
                          background: isActive ? `${layer.color}12` : isHovered ? `${layer.color}08` : "#fefcf9",
                          border: `2px solid ${isActive ? layer.color : isHovered ? `${layer.color}40` : "rgba(180,140,100,0.1)"}`,
                          boxShadow: isActive ? `0 4px 16px ${layer.color}20` : "none",
                        }}>
                        <span className="text-base w-7 h-7 flex items-center justify-center rounded-full"
                          style={{ background: `${layer.color}15` }}>
                          {layer.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                              style={{ background: layer.color, color: "#fff" }}>
                              L{layer.number}
                            </span>
                            <span className="text-xs font-display font-bold" style={{ color: isActive ? layer.color : "#2d2a26" }}>
                              {layer.name}
                            </span>
                          </div>
                          <p className="text-[9px] font-mono truncate" style={{ color: "rgba(80,70,60,0.45)" }}>
                            {layer.protocols.slice(0, 3).join(" · ")}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.3)" }}>{layer.dataUnit}</span>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center gap-2 w-full max-w-md">
                  <span className="text-[8px] font-mono" style={{ color: "rgba(80,70,60,0.3)" }}>↑ USER</span>
                  <div className="h-px flex-1" style={{ background: "rgba(180,140,100,0.12)" }} />
                  <span className="text-[8px] font-mono" style={{ color: "rgba(80,70,60,0.3)" }}>WIRE ↓</span>
                </div>
              </div>

              <div className="lg:w-80 w-full">
                <AnimatePresence mode="wait">
                  {selectedOSI ? (
                    <motion.div key={selectedOSI.number} className="rounded-xl overflow-hidden"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ border: `1px solid ${selectedOSI.color}25` }}>
                      <div className="px-4 py-3" style={{ background: `${selectedOSI.color}10` }}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedOSI.icon}</span>
                          <div>
                            <h3 className="font-display text-base font-bold" style={{ color: selectedOSI.color }}>
                              L{selectedOSI.number} — {selectedOSI.name}
                            </h3>
                            <p className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.45)" }}>
                              Unit: {selectedOSI.dataUnit}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3" style={{ background: "#fefcf9" }}>
                        <div>
                          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: selectedOSI.color }}>What Happens</p>
                          <p className="text-xs font-body leading-relaxed" style={{ color: "rgba(45,42,38,0.8)" }}>{selectedOSI.whatHappens}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: selectedOSI.color }}>Real World</p>
                          <p className="text-xs font-body italic" style={{ color: "rgba(45,42,38,0.65)" }}>{selectedOSI.realWorld}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedOSI.protocols.map(p => (
                            <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                              style={{ background: `${selectedOSI.color}08`, border: `1px solid ${selectedOSI.color}15`, color: selectedOSI.color }}>
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="rounded-lg p-2.5" style={{ background: "rgba(42,125,79,0.05)", border: "1px solid rgba(42,125,79,0.12)" }}>
                          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>🎯 My Experience</p>
                          <p className="text-[11px] font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{selectedOSI.mySkill}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" className="rounded-xl p-6 text-center"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ background: "#fefcf9", border: "1px solid rgba(180,140,100,0.1)" }}>
                      <span className="text-3xl mb-2 block">🔌</span>
                      <p className="font-display text-sm mb-1" style={{ color: "#2d2a26" }}>The OSI Model</p>
                      <p className="text-xs font-body italic" style={{ color: "rgba(80,70,60,0.5)" }}>
                        7 layers that make the internet work. Click any layer to explore.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
