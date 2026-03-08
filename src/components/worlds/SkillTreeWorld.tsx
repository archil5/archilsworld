import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillNode {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  connections: string[];
  tier: number;
}

const skillNodes: SkillNode[] = [
  { id: "cs", label: "Computer Science", icon: "💻", x: 300, y: 40, connections: ["systems", "security"], tier: 0 },
  { id: "systems", label: "Systems Thinking", icon: "🧩", x: 150, y: 140, connections: ["automation", "architecture"], tier: 1 },
  { id: "security", label: "Security", icon: "🛡️", x: 450, y: 140, connections: ["hacking", "compliance"], tier: 1 },
  { id: "automation", label: "Automation", icon: "⚙️", x: 80, y: 260, connections: ["devops"], tier: 2 },
  { id: "architecture", label: "Architecture", icon: "📐", x: 230, y: 260, connections: ["cloud"], tier: 2 },
  { id: "hacking", label: "Ethical Hacking", icon: "🔓", x: 380, y: 260, connections: ["cloud"], tier: 2 },
  { id: "compliance", label: "Compliance", icon: "📋", x: 530, y: 260, connections: ["devops"], tier: 2 },
  { id: "devops", label: "DevOps", icon: "🔄", x: 200, y: 370, connections: [], tier: 3 },
  { id: "cloud", label: "Cloud", icon: "☁️", x: 400, y: 370, connections: [], tier: 3 },
];

const storyText = [
  "Dalhousie wasn't just a degree —",
  "it was where curiosity became craft.",
  "The Master's taught me to think three moves ahead.",
  "'What breaks when it scales?'",
  "'Where does the attacker look first?'",
  "I learned to see the whole board.",
];

const SkillTreeWorld = () => {
  const [unlockedNodes, setUnlockedNodes] = useState<Set<string>>(new Set());
  const [storyIdx, setStoryIdx] = useState(-1);

  useEffect(() => {
    const tiers = [0, 1, 2, 3];
    const timers: ReturnType<typeof setTimeout>[] = [];

    tiers.forEach((tier, ti) => {
      const nodesInTier = skillNodes.filter(n => n.tier === tier);
      nodesInTier.forEach((node, ni) => {
        timers.push(setTimeout(() => {
          setUnlockedNodes(prev => new Set(prev).add(node.id));
        }, 800 + ti * 1200 + ni * 300));
      });
    });

    storyText.forEach((_, i) => {
      timers.push(setTimeout(() => setStoryIdx(i), 1500 + i * 800));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 max-w-3xl w-full">
        {/* Skill tree */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg viewBox="0 0 600 420" className="w-full max-w-xl">
            {/* Connection lines */}
            {skillNodes.map(node =>
              node.connections.map(targetId => {
                const target = skillNodes.find(n => n.id === targetId)!;
                const unlocked = unlockedNodes.has(node.id) && unlockedNodes.has(targetId);
                return (
                  <motion.line
                    key={`${node.id}-${targetId}`}
                    x1={node.x} y1={node.y + 20}
                    x2={target.x} y2={target.y - 10}
                    stroke={unlocked ? "#e8c460" : "rgba(232,196,96,0.1)"}
                    strokeWidth={unlocked ? 2 : 1}
                    strokeDasharray={unlocked ? "0" : "4 4"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: unlocked ? 1 : 0 }}
                    transition={{ duration: 0.6 }}
                  />
                );
              })
            )}

            {/* Nodes */}
            {skillNodes.map(node => {
              const unlocked = unlockedNodes.has(node.id);
              return (
                <AnimatePresence key={node.id}>
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={unlocked ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0.2 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    {/* Glow */}
                    {unlocked && (
                      <circle cx={node.x} cy={node.y} r={35} fill="rgba(232,196,96,0.08)">
                        <animate attributeName="r" values="30;38;30" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Background */}
                    <rect
                      x={node.x - 40} y={node.y - 18}
                      width={80} height={40} rx={8}
                      fill={unlocked ? "rgba(232,196,96,0.12)" : "rgba(40,30,20,0.5)"}
                      stroke={unlocked ? "#e8c460" : "rgba(232,196,96,0.15)"}
                      strokeWidth={1.5}
                    />
                    {/* Icon */}
                    <text x={node.x - 25} y={node.y + 5} fontSize="14">{node.icon}</text>
                    {/* Label */}
                    <text
                      x={node.x + 5} y={node.y + 5}
                      fill={unlocked ? "#e8c460" : "rgba(232,196,96,0.3)"}
                      fontSize="8"
                      fontFamily="Cinzel, serif"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                    {/* Unlocked badge */}
                    {unlocked && (
                      <motion.text
                        x={node.x + 32} y={node.y - 10}
                        fontSize="10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        ✓
                      </motion.text>
                    )}
                  </motion.g>
                </AnimatePresence>
              );
            })}
          </svg>
        </motion.div>

        {/* Story */}
        <div className="max-w-md text-center space-y-2">
          <p className="font-display text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "rgba(60,179,113,0.6)" }}>
            Dalhousie University · 2017–2018
          </p>
          {storyText.slice(0, storyIdx + 1).map((line, i) => (
            <motion.p
              key={i}
              className="font-body text-base"
              style={{ color: i >= 3 ? "#e8c460" : "rgba(240,230,208,0.75)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTreeWorld;
