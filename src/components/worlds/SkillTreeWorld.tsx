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
  prereqs: string[];
  detail: string;
  course?: string;
}

const skillNodes: SkillNode[] = [
  { id: "cs", label: "Computer Science", icon: "💻", x: 300, y: 30, connections: ["systems", "security"], tier: 0, prereqs: [],
    detail: "Core algorithms, data structures, computational thinking", course: "CSCI 5100 — Advanced Algorithms" },
  { id: "systems", label: "Systems Thinking", icon: "🧩", x: 130, y: 130, connections: ["automation", "architecture"], tier: 1, prereqs: ["cs"],
    detail: "Distributed systems design, fault tolerance, CAP theorem", course: "CSCI 5308 — Advanced Software Development" },
  { id: "security", label: "Security", icon: "🛡️", x: 470, y: 130, connections: ["hacking", "compliance"], tier: 1, prereqs: ["cs"],
    detail: "Cryptography, threat modelling, zero-trust architecture", course: "CSCI 5708 — Network Security" },
  { id: "automation", label: "Automation", icon: "⚙️", x: 70, y: 250, connections: ["devops"], tier: 2, prereqs: ["systems"],
    detail: "Infrastructure as Code, configuration management, CI/CD", course: "Applied Project — Ansible Automation" },
  { id: "architecture", label: "Architecture", icon: "📐", x: 230, y: 250, connections: ["cloud"], tier: 2, prereqs: ["systems"],
    detail: "Microservices, event-driven design, scalability patterns" },
  { id: "hacking", label: "Ethical Hacking", icon: "🔓", x: 380, y: 250, connections: ["cloud"], tier: 2, prereqs: ["security"],
    detail: "Penetration testing, vulnerability assessment, OWASP Top 10", course: "CSCI 5709 — Ethical Hacking Lab" },
  { id: "compliance", label: "Compliance", icon: "📋", x: 530, y: 250, connections: ["devops"], tier: 2, prereqs: ["security"],
    detail: "SOC2, NIST frameworks, audit automation" },
  { id: "devops", label: "DevOps", icon: "🔄", x: 200, y: 370, connections: [], tier: 3, prereqs: ["automation", "compliance"],
    detail: "The bridge between development and operations — culture + tooling" },
  { id: "cloud", label: "Cloud", icon: "☁️", x: 400, y: 370, connections: [], tier: 3, prereqs: ["architecture", "hacking"],
    detail: "AWS, Azure, GCP — the platform that changed everything" },
];

const valueDelivered = [
  "Graduated with distinction — Master of Applied Computer Science",
  "Published research on automated security compliance",
  "Built a threat-modelling framework used by 3 lab cohorts",
  "Learned to think three moves ahead — 'what breaks at scale?'",
];

const SkillTreeWorld = () => {
  const [unlockedNodes, setUnlockedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [xpPoints, setXpPoints] = useState(9);

  const canUnlock = (node: SkillNode) => {
    if (unlockedNodes.has(node.id)) return false;
    return node.prereqs.every(p => unlockedNodes.has(p));
  };

  const handleUnlock = (node: SkillNode) => {
    if (!canUnlock(node)) return;
    setUnlockedNodes(prev => new Set(prev).add(node.id));
    setXpPoints(prev => prev - 1);
    setSelectedNode(node);
  };

  const handleClick = (node: SkillNode) => {
    if (unlockedNodes.has(node.id)) setSelectedNode(node);
    else handleUnlock(node);
  };

  const handleRevealAll = () => {
    setUnlockedNodes(new Set(skillNodes.map(n => n.id)));
    setXpPoints(0);
    setSelectedNode(skillNodes[skillNodes.length - 1]);
  };

  useEffect(() => {
    setTimeout(() => {
      setUnlockedNodes(new Set(["cs"]));
      setXpPoints(8);
      setSelectedNode(skillNodes[0]);
    }, 500);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl w-full items-start">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono" style={{ color: "#b5653a" }}>
              DALHOUSIE UNIVERSITY · 2017–2018
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ background: "rgba(181,101,58,0.08)", color: "#b5653a", border: "1px solid rgba(181,101,58,0.15)" }}>
              {unlockedNodes.size}/{skillNodes.length} unlocked
            </span>
            {unlockedNodes.size < skillNodes.length && (
              <button onClick={handleRevealAll}
                className="text-[10px] font-mono px-3 py-1 rounded cursor-pointer transition-all"
                style={{ color: "#b5653a", background: "rgba(181,101,58,0.08)", border: "1px solid rgba(181,101,58,0.2)" }}>
                ⚡ Unlock All
              </button>
            )}
          </div>

          <svg viewBox="0 0 600 420" className="w-full max-w-xl">
            {skillNodes.map(node =>
              node.connections.map(targetId => {
                const target = skillNodes.find(n => n.id === targetId)!;
                const unlocked = unlockedNodes.has(node.id) && unlockedNodes.has(targetId);
                return (
                  <line key={`${node.id}-${targetId}`}
                    x1={node.x} y1={node.y + 20} x2={target.x} y2={target.y - 10}
                    stroke={unlocked ? "#b5653a" : unlockedNodes.has(node.id) ? "rgba(181,101,58,0.3)" : "rgba(180,140,100,0.12)"}
                    strokeWidth={unlocked ? 2 : 1} strokeDasharray={unlocked ? "0" : "4 4"} />
                );
              })
            )}
            {skillNodes.map(node => {
              const unlocked = unlockedNodes.has(node.id);
              const available = canUnlock(node);
              return (
                <g key={node.id} onClick={() => handleClick(node)} className="cursor-pointer">
                  {unlocked && (
                    <circle cx={node.x} cy={node.y} r={35} fill="rgba(181,101,58,0.06)">
                      <animate attributeName="r" values="30;38;30" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {available && !unlocked && (
                    <circle cx={node.x} cy={node.y} r={32} fill="none" stroke="rgba(181,101,58,0.3)" strokeWidth="1" strokeDasharray="4 4">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <rect x={node.x - 42} y={node.y - 18} width={84} height={40} rx={8}
                    fill={unlocked ? "rgba(181,101,58,0.08)" : available ? "rgba(180,140,100,0.06)" : "#fefcf9"}
                    stroke={unlocked ? "#b5653a" : available ? "rgba(181,101,58,0.3)" : "rgba(180,140,100,0.15)"}
                    strokeWidth={selectedNode?.id === node.id ? 2.5 : 1.5} />
                  <text x={node.x - 27} y={node.y + 5} fontSize="14">{node.icon}</text>
                  <text x={node.x + 5} y={node.y + 5} textAnchor="middle"
                    fill={unlocked ? "#b5653a" : available ? "rgba(181,101,58,0.6)" : "rgba(80,70,60,0.2)"}
                    fontSize="8" fontFamily="Cinzel, serif">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="text-[10px] font-mono mt-1" style={{ color: "rgba(80,70,60,0.3)" }}>
            Click available nodes to unlock skills
          </p>
        </div>

        <div className="lg:w-80 w-full">
          <AnimatePresence mode="wait">
            {selectedNode && (
              <motion.div key={selectedNode.id} className="rounded-xl p-6"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{ background: "#fefcf9", border: "1px solid rgba(181,101,58,0.15)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{selectedNode.icon}</span>
                  <div>
                    <h3 className="font-display text-lg" style={{ color: "#b5653a" }}>{selectedNode.label}</h3>
                    <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.4)" }}>Tier {selectedNode.tier}</p>
                  </div>
                </div>
                <p className="font-body text-sm mb-3" style={{ color: "rgba(45,42,38,0.8)" }}>{selectedNode.detail}</p>
                {selectedNode.course && (
                  <div className="px-3 py-2 rounded mb-4" style={{ background: "rgba(181,101,58,0.05)", border: "1px solid rgba(181,101,58,0.12)" }}>
                    <p className="text-[10px] font-mono" style={{ color: "rgba(181,101,58,0.5)" }}>COURSE</p>
                    <p className="text-xs font-mono" style={{ color: "#b5653a" }}>{selectedNode.course}</p>
                  </div>
                )}
                {selectedNode.prereqs.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.3)" }}>Requires:</span>
                    {selectedNode.prereqs.map(p => (
                      <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(181,101,58,0.06)", color: "#b5653a" }}>
                        {skillNodes.find(n => n.id === p)?.label}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {unlockedNodes.size >= 5 && (
            <motion.div className="mt-4 rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "rgba(80,70,60,0.03)", border: "1px solid rgba(180,140,100,0.1)" }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: "#b5653a" }}>Value Delivered</p>
              {valueDelivered.map((v, i) => (
                <motion.div key={i} className="flex items-start gap-2 mb-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}>
                  <span className="text-xs mt-0.5">🎓</span>
                  <span className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{v}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTreeWorld;
