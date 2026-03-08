import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── Board-game mechanic: ROUTE THE PACKET ──
   Click nodes in the correct order to route a packet across the network.
   Like a connection/path-building game (Ticket to Ride style). */

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  detail?: string;
}

interface Packet {
  id: number;
  from: string;
  to: string;
  progress: number;
  color: string;
}

const nodes: Node[] = [
  { id: "client", label: "My PC", x: 80, y: 200, detail: "Where every question started" },
  { id: "router", label: "Router", x: 240, y: 100, detail: "First gateway to the world" },
  { id: "switch", label: "Switch", x: 240, y: 300, detail: "Layer 2 — where frames live" },
  { id: "firewall", label: "Firewall", x: 400, y: 100, detail: "The gatekeeper" },
  { id: "dns", label: "DNS", x: 400, y: 200, detail: "Names → Numbers" },
  { id: "server", label: "Server", x: 400, y: 300, detail: "Where data lives" },
  { id: "cloud", label: "Internet", x: 560, y: 200, detail: "The infinite network" },
];

const connections = [
  ["client", "router"], ["client", "switch"],
  ["router", "firewall"], ["router", "dns"],
  ["switch", "server"], ["switch", "dns"],
  ["firewall", "cloud"], ["dns", "cloud"],
  ["server", "cloud"],
];

const correctRoute = ["client", "router", "firewall", "cloud"];

const skillsLearned = [
  "TCP/IP", "OSI Model", "DNS Resolution", "Subnetting",
  "Network Security", "Packet Analysis", "Wireshark",
  "Routing Protocols", "VLAN Configuration",
];

const valueInsights = [
  { label: "Pattern Recognition", desc: "Saw that networks are just elegant, learnable patterns" },
  { label: "Systems Thinking", desc: "Understood how invisible architecture connects everything" },
  { label: "Debugging Mindset", desc: "Learned to trace problems through layers of abstraction" },
  { label: "Foundation Building", desc: "Every cloud skill later built on this networking base" },
];

const NetworkWorld = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [routeAttempt, setRouteAttempt] = useState<string[]>([]);
  const [routeComplete, setRouteComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "skills" | "value">("explore");
  const packetId = useRef(0);

  // Background packet animation
  useEffect(() => {
    const interval = setInterval(() => {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const reverse = Math.random() > 0.5;
      const colors = ["#4fc3f7", "#e8c460", "#81c784", "#ff8a65"];
      setPackets(prev => [...prev.slice(-12), {
        id: packetId.current++,
        from: reverse ? conn[1] : conn[0],
        to: reverse ? conn[0] : conn[1],
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
    setActiveNodes(prev => new Set(prev).add(node.id));

    // Route building
    if (!routeComplete) {
      const nextIdx = routeAttempt.length;
      if (correctRoute[nextIdx] === node.id) {
        const newRoute = [...routeAttempt, node.id];
        setRouteAttempt(newRoute);
        if (newRoute.length === correctRoute.length) {
          setRouteComplete(true);
        }
      } else if (routeAttempt.length > 0 && node.id !== routeAttempt[routeAttempt.length - 1]) {
        setRouteAttempt([]); // reset on wrong click
      }
    }
  };

  const getNodePos = (id: string) => {
    const n = nodes.find(n => n.id === id)!;
    return { x: n.x, y: n.y };
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex gap-2 justify-center">
          {(["explore", "skills", "value"] as const).map(tab => (
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
              {tab === "explore" ? "🔌 Route" : tab === "skills" ? "⚡ Stack" : "💎 Value"}
            </button>
          ))}
        </div>

        {activeTab === "explore" && (
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Network SVG */}
            <motion.div className="flex-1" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {/* Route challenge hint */}
              <div className="text-center mb-2">
                <span className="text-[10px] font-mono" style={{ color: routeComplete ? "#81c784" : "rgba(232,196,96,0.4)" }}>
                  {routeComplete ? "✓ PACKET ROUTED SUCCESSFULLY" : `🎯 Challenge: Route a packet — click: ${correctRoute.join(" → ")}`}
                </span>
                {routeAttempt.length > 0 && !routeComplete && (
                  <span className="text-[10px] font-mono ml-2" style={{ color: "#e8c460" }}>
                    Progress: {routeAttempt.join(" → ")}
                  </span>
                )}
              </div>

              <svg viewBox="0 0 640 400" className="w-full max-w-lg">
                {connections.map(([from, to], i) => {
                  const a = getNodePos(from);
                  const b = getNodePos(to);
                  const onRoute = routeComplete && correctRoute.includes(from) && correctRoute.includes(to) &&
                    Math.abs(correctRoute.indexOf(from) - correctRoute.indexOf(to)) === 1;
                  return (
                    <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={onRoute ? "#81c784" : "rgba(232,196,96,0.15)"}
                      strokeWidth={onRoute ? 3 : 2} strokeDasharray={onRoute ? "0" : "4 4"}
                    />
                  );
                })}

                {packets.map(p => {
                  const a = getNodePos(p.from);
                  const b = getNodePos(p.to);
                  const x = a.x + (b.x - a.x) * p.progress;
                  const y = a.y + (b.y - a.y) * p.progress;
                  return (
                    <circle key={p.id} cx={x} cy={y} r={3} fill={p.color} opacity={1 - p.progress * 0.5} />
                  );
                })}

                {nodes.map(node => {
                  const inRoute = routeAttempt.includes(node.id);
                  return (
                    <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                      <circle cx={node.x} cy={node.y} r={30}
                        fill={inRoute ? "rgba(129,199,132,0.2)" : activeNodes.has(node.id) ? "rgba(232,196,96,0.15)" : "rgba(40,30,20,0.8)"}
                        stroke={inRoute ? "#81c784" : selectedNode?.id === node.id ? "#e8c460" : "rgba(232,196,96,0.3)"}
                        strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                      />
                      <text x={node.x} y={node.y + 4} textAnchor="middle"
                        fill={inRoute ? "#81c784" : "#e8c460"} fontSize="10" fontFamily="JetBrains Mono, monospace">
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Selected node detail */}
            <div className="flex-1 max-w-sm">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  className="rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ background: "rgba(40,30,20,0.6)", border: "1px solid rgba(232,196,96,0.15)" }}
                >
                  <h3 className="font-display text-xl mb-2" style={{ color: "#e8c460" }}>{selectedNode.label}</h3>
                  <p className="font-body text-sm italic" style={{ color: "rgba(240,230,208,0.7)" }}>{selectedNode.detail}</p>
                </motion.div>
              ) : (
                <div className="text-center">
                  <p className="font-body text-sm italic" style={{ color: "rgba(232,196,96,0.3)" }}>
                    Click a node to inspect it. Route the packet to win.
                  </p>
                </div>
              )}

              {routeComplete && (
                <motion.div
                  className="mt-4 p-4 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ background: "rgba(129,199,132,0.1)", border: "1px solid rgba(129,199,132,0.3)" }}
                >
                  <p className="text-sm font-body italic" style={{ color: "#81c784" }}>
                    "Not when I learned what to build, but when I realized I could learn anything."
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <motion.div className="grid grid-cols-3 gap-2 max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {skillsLearned.map((skill, i) => (
              <motion.div key={skill} className="px-3 py-2 rounded text-center"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: "rgba(74,158,255,0.08)", border: "1px solid rgba(74,158,255,0.2)" }}>
                <span className="text-xs font-mono" style={{ color: "#4a9eff" }}>{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "value" && (
          <motion.div className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {valueInsights.map((v, i) => (
              <motion.div key={i} className="p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                style={{ background: "rgba(232,196,96,0.06)", border: "1px solid rgba(232,196,96,0.12)" }}>
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "#e8c460" }}>{v.label}</p>
                <p className="text-sm font-body" style={{ color: "rgba(240,230,208,0.75)" }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NetworkWorld;
