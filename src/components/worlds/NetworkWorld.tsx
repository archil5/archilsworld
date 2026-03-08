import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const interval = setInterval(() => {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const reverse = Math.random() > 0.5;
      const colors = ["#3d7aaf", "#b5653a", "#2a7d4f", "#E44D26"];
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
    if (!routeComplete) {
      const nextIdx = routeAttempt.length;
      if (correctRoute[nextIdx] === node.id) {
        const newRoute = [...routeAttempt, node.id];
        setRouteAttempt(newRoute);
        if (newRoute.length === correctRoute.length) setRouteComplete(true);
      } else if (routeAttempt.length > 0 && node.id !== routeAttempt[routeAttempt.length - 1]) {
        setRouteAttempt([]);
      }
    }
  };

  const handleRevealAll = () => {
    setRouteAttempt([...correctRoute]);
    setRouteComplete(true);
    setActiveNodes(new Set(nodes.map(n => n.id)));
    setSelectedNode(nodes[nodes.length - 1]);
  };

  const getNodePos = (id: string) => {
    const n = nodes.find(n => n.id === id)!;
    return { x: n.x, y: n.y };
  };

  const tabStyle = (active: boolean) => ({
    background: active ? "rgba(61,122,175,0.1)" : "rgba(45,42,38,0.03)",
    color: active ? "#3d7aaf" : "rgba(80,70,60,0.6)",
    border: `1px solid ${active ? "rgba(61,122,175,0.2)" : "rgba(180,140,100,0.1)"}`,
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className="flex gap-2 justify-center items-center">
          {(["explore", "skills", "value"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={tabStyle(activeTab === tab)}>
              {tab === "explore" ? "🔌 Route" : tab === "skills" ? "⚡ Stack" : "💎 Value"}
            </button>
          ))}
          {activeTab === "explore" && !routeComplete && (
            <button onClick={handleRevealAll}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={{ color: "#b5653a", background: "rgba(181,101,58,0.08)", border: "1px solid rgba(181,101,58,0.2)" }}>
              ⚡ Reveal All
            </button>
          )}
        </div>

        {activeTab === "explore" && (
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <motion.div className="flex-1" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="text-center mb-2">
                <span className="text-[10px] font-mono" style={{ color: routeComplete ? "#2a7d4f" : "rgba(80,70,60,0.35)" }}>
                  {routeComplete ? "✓ PACKET ROUTED SUCCESSFULLY" : `🎯 Route: ${correctRoute.join(" → ")}`}
                </span>
                {routeAttempt.length > 0 && !routeComplete && (
                  <span className="text-[10px] font-mono ml-2" style={{ color: "#3d7aaf" }}>
                    Progress: {routeAttempt.join(" → ")}
                  </span>
                )}
              </div>
              <svg viewBox="0 0 640 400" className="w-full max-w-lg">
                {connections.map(([from, to], i) => {
                  const a = getNodePos(from); const b = getNodePos(to);
                  const onRoute = routeComplete && correctRoute.includes(from) && correctRoute.includes(to) &&
                    Math.abs(correctRoute.indexOf(from) - correctRoute.indexOf(to)) === 1;
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={onRoute ? "#2a7d4f" : "rgba(180,140,100,0.2)"} strokeWidth={onRoute ? 3 : 2} strokeDasharray={onRoute ? "0" : "4 4"} />;
                })}
                {packets.map(p => {
                  const a = getNodePos(p.from); const b = getNodePos(p.to);
                  return <circle key={p.id} cx={a.x + (b.x - a.x) * p.progress} cy={a.y + (b.y - a.y) * p.progress}
                    r={3} fill={p.color} opacity={1 - p.progress * 0.5} />;
                })}
                {nodes.map(node => {
                  const inRoute = routeAttempt.includes(node.id);
                  return (
                    <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                      <circle cx={node.x} cy={node.y} r={30}
                        fill={inRoute ? "rgba(42,125,79,0.1)" : activeNodes.has(node.id) ? "rgba(61,122,175,0.08)" : "#fefcf9"}
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
            </motion.div>
            <div className="flex-1 max-w-sm">
              {selectedNode ? (
                <motion.div key={selectedNode.id} className="rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: "#fefcf9", border: "1px solid rgba(61,122,175,0.15)" }}>
                  <h3 className="font-display text-xl mb-2" style={{ color: "#3d7aaf" }}>{selectedNode.label}</h3>
                  <p className="font-body text-sm italic" style={{ color: "rgba(45,42,38,0.7)" }}>{selectedNode.detail}</p>
                </motion.div>
              ) : (
                <div className="text-center">
                  <p className="font-body text-sm italic" style={{ color: "rgba(80,70,60,0.35)" }}>
                    Click a node to inspect it. Route the packet to win.
                  </p>
                </div>
              )}
              {routeComplete && (
                <motion.div className="mt-4 p-4 rounded-lg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.2)" }}>
                  <p className="text-sm font-body italic" style={{ color: "#2a7d4f" }}>
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
                style={{ background: "rgba(61,122,175,0.06)", border: "1px solid rgba(61,122,175,0.15)" }}>
                <span className="text-xs font-mono" style={{ color: "#3d7aaf" }}>{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "value" && (
          <motion.div className="max-w-lg mx-auto space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {valueInsights.map((v, i) => (
              <motion.div key={i} className="p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                style={{ background: "rgba(61,122,175,0.04)", border: "1px solid rgba(61,122,175,0.1)" }}>
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "#3d7aaf" }}>{v.label}</p>
                <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.75)" }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NetworkWorld;
