import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Packet {
  id: number;
  from: string;
  to: string;
  progress: number;
  color: string;
}

const nodes: Node[] = [
  { id: "client", label: "My PC", x: 100, y: 200 },
  { id: "router", label: "Router", x: 280, y: 120 },
  { id: "switch", label: "Switch", x: 280, y: 280 },
  { id: "dns", label: "DNS", x: 460, y: 80 },
  { id: "server", label: "Server", x: 460, y: 200 },
  { id: "db", label: "Database", x: 460, y: 320 },
  { id: "cloud", label: "Internet", x: 640, y: 200 },
];

const connections = [
  ["client", "router"], ["client", "switch"],
  ["router", "dns"], ["router", "server"],
  ["switch", "server"], ["switch", "db"],
  ["server", "cloud"], ["dns", "cloud"],
];

const storyLines = [
  "Then I found networking.",
  "The whole machine cracked open.",
  "I could see how packets moved,",
  "how systems talked to each other,",
  "how the invisible architecture beneath everything",
  "was just… patterns.",
  "Elegant, learnable patterns.",
  "That was the moment—",
  "not when I learned what to build,",
  "but when I realized I could learn anything.",
];

const NetworkWorld = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [storyIdx, setStoryIdx] = useState(-1);
  const packetId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const reverse = Math.random() > 0.5;
      const from = reverse ? conn[1] : conn[0];
      const to = reverse ? conn[0] : conn[1];
      const colors = ["#4fc3f7", "#e8c460", "#81c784", "#ff8a65", "#ba68c8"];
      
      const newPacket: Packet = {
        id: packetId.current++,
        from, to,
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      
      setPackets(prev => [...prev.slice(-15), newPacket]);
      setActiveNodes(prev => new Set(prev).add(from).add(to));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Animate packets
  useEffect(() => {
    const raf = setInterval(() => {
      setPackets(prev => prev
        .map(p => ({ ...p, progress: p.progress + 0.03 }))
        .filter(p => p.progress <= 1)
      );
    }, 16);
    return () => clearInterval(raf);
  }, []);

  // Story reveal
  useEffect(() => {
    const timers = storyLines.map((_, i) =>
      setTimeout(() => setStoryIdx(i), 2000 + i * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const getNodePos = (id: string) => {
    const n = nodes.find(n => n.id === id)!;
    return { x: n.x, y: n.y };
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col lg:flex-row gap-8 items-center max-w-5xl w-full">
        {/* Network visualization */}
        <motion.div
          className="flex-1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <svg viewBox="0 0 740 400" className="w-full max-w-lg">
            {/* Connections */}
            {connections.map(([from, to], i) => {
              const a = getNodePos(from);
              const b = getNodePos(to);
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="rgba(232,196,96,0.15)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Packets */}
            {packets.map(p => {
              const a = getNodePos(p.from);
              const b = getNodePos(p.to);
              const x = a.x + (b.x - a.x) * p.progress;
              const y = a.y + (b.y - a.y) * p.progress;
              return (
                <g key={p.id}>
                  <circle cx={x} cy={y} r={4} fill={p.color} opacity={1 - p.progress * 0.5}>
                    <animate attributeName="r" values="4;6;4" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r={10} fill={p.color} opacity={0.15} />
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x} cy={node.y} r={28}
                  fill={activeNodes.has(node.id) ? "rgba(232,196,96,0.15)" : "rgba(40,30,20,0.8)"}
                  stroke={activeNodes.has(node.id) ? "#e8c460" : "rgba(232,196,96,0.3)"}
                  strokeWidth="2"
                />
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle"
                  fill={activeNodes.has(node.id) ? "#e8c460" : "rgba(232,196,96,0.6)"}
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Story */}
        <div className="flex-1 max-w-md space-y-3">
          {storyLines.slice(0, storyIdx + 1).map((line, i) => (
            <motion.p
              key={i}
              className="font-body text-lg italic"
              style={{ color: i >= 7 ? "#e8c460" : "rgba(240,230,208,0.75)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkWorld;
