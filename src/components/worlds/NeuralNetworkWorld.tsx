import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Board-game mechanic: BOSS ENCOUNTER / DECK REVEAL ──
   Progressive reveal of "AI cards" — user clicks to reveal each capability.
   Like drawing from a deck in a card game. Each card shows a skill/platform piece. */

interface AICard {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: "platform" | "skill" | "impact";
  revealed: boolean;
}

const initialCards: AICard[] = [
  { id: "azure-ai", title: "Azure OpenAI", desc: "Enterprise-grade GPT deployment with content filtering & rate governance", icon: "🧠", category: "platform", revealed: false },
  { id: "rag", title: "RAG Architecture", desc: "Retrieval-augmented generation connecting LLMs to petabytes of enterprise data", icon: "🔗", category: "platform", revealed: false },
  { id: "mlops", title: "MLOps Pipeline", desc: "Automated model training, evaluation, and deployment with MLflow", icon: "⚙️", category: "platform", revealed: false },
  { id: "governance", title: "Model Governance", desc: "Framework ensuring AI compliance with banking regulations and audit trails", icon: "📋", category: "skill", revealed: false },
  { id: "security", title: "AI Security", desc: "Prompt injection defense, data leakage prevention, red-teaming", icon: "🛡️", category: "skill", revealed: false },
  { id: "vector-db", title: "Vector Databases", desc: "Semantic search over millions of documents with embedding pipelines", icon: "🗄️", category: "platform", revealed: false },
  { id: "langchain", title: "LangChain / Agents", desc: "Orchestrating multi-step AI workflows with tool-calling agents", icon: "🔧", category: "skill", revealed: false },
  { id: "impact", title: "Enterprise Impact", desc: "Architecting AI for Canada's 4th largest bank — serving millions", icon: "🏦", category: "impact", revealed: false },
];

interface NeuralNode {
  x: number;
  y: number;
  layer: number;
}

const NeuralNetworkWorld = () => {
  const [cards, setCards] = useState(initialCards);
  const [selectedCard, setSelectedCard] = useState<AICard | null>(null);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [firing, setFiring] = useState<[number, number][]>([]);
  const [activeTab, setActiveTab] = useState<"cards" | "network" | "stack">("cards");

  const techStack = [
    "Azure OpenAI", "Azure AI Studio", "LangChain", "LlamaIndex",
    "Pinecone", "Cosmos DB", "MLflow", "Kubernetes",
    "Terraform", "Python", "TypeScript", "FastAPI",
  ];

  const valueDelivered = [
    "Architecting secure enterprise AI platform for BMO",
    "Designed model governance ensuring regulatory compliance",
    "Building RAG pipelines integrating petabytes of data",
    "Establishing AI security standards organization-wide",
    "Reduced AI experimentation cycle from months to weeks",
  ];

  // Neural network visualization
  useEffect(() => {
    const layers = [3, 5, 7, 5, 3, 1];
    const allNodes: NeuralNode[] = [];
    layers.forEach((count, li) => {
      const layerX = 50 + (li / (layers.length - 1)) * 500;
      for (let i = 0; i < count; i++) {
        allNodes.push({ x: layerX, y: (300 / (count + 1)) * (i + 1), layer: li });
      }
    });
    setNodes(allNodes);
  }, []);

  useEffect(() => {
    if (!nodes.length) return;
    const interval = setInterval(() => {
      const srcLayer = Math.floor(Math.random() * 5);
      const srcs = nodes.map((n, i) => ({ ...n, idx: i })).filter(n => n.layer === srcLayer);
      const tgts = nodes.map((n, i) => ({ ...n, idx: i })).filter(n => n.layer === srcLayer + 1);
      if (srcs.length && tgts.length) {
        const s = srcs[Math.floor(Math.random() * srcs.length)];
        const t = tgts[Math.floor(Math.random() * tgts.length)];
        setFiring(prev => [...prev.slice(-12), [s.idx, t.idx]]);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [nodes.length]);

  const handleRevealCard = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, revealed: true } : c));
    setSelectedCard(cards.find(c => c.id === id) || null);
  };

  const revealedCount = cards.filter(c => c.revealed).length;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(155,89,182,0.6)" }}>
            BMO · Principal Cloud Engineer — AI · 2025–Present
          </p>
          <div className="flex items-center gap-2 justify-center mt-1">
            <span className="text-[10px] font-mono" style={{ color: "rgba(232,196,96,0.4)" }}>
              Cards revealed: {revealedCount}/{cards.length}
            </span>
            {revealedCount === cards.length && (
              <motion.span className="text-[10px] font-mono" style={{ color: "#9b59b6" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}>
                🐉 BOSS DEFEATED
              </motion.span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center">
          {(["cards", "network", "stack"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase cursor-pointer transition-all"
              style={{
                background: activeTab === tab ? "rgba(155,89,182,0.15)" : "rgba(40,30,20,0.4)",
                color: activeTab === tab ? "#9b59b6" : "rgba(232,196,96,0.4)",
                border: `1px solid ${activeTab === tab ? "rgba(155,89,182,0.3)" : "rgba(232,196,96,0.1)"}`,
              }}>
              {tab === "cards" ? "🎴 Draw Cards" : tab === "network" ? "🧠 Neural Net" : "⚡ Stack & Value"}
            </button>
          ))}
        </div>

        {activeTab === "cards" && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Card grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  className="cursor-pointer rounded-xl p-4 min-h-[120px] flex flex-col items-center justify-center text-center"
                  onClick={() => handleRevealCard(card.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(155,89,182,0.3)" }}
                  style={{
                    background: card.revealed ? "rgba(155,89,182,0.12)" : "rgba(40,30,20,0.6)",
                    border: `1px solid ${card.revealed ? "rgba(155,89,182,0.4)" : "rgba(232,196,96,0.1)"}`,
                  }}
                >
                  {card.revealed ? (
                    <>
                      <span className="text-2xl mb-1">{card.icon}</span>
                      <p className="text-[11px] font-display" style={{ color: "#9b59b6" }}>{card.title}</p>
                      <p className="text-[9px] font-body mt-1" style={{ color: "rgba(240,230,208,0.5)" }}>
                        {card.category}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl mb-1">🎴</span>
                      <p className="text-[10px] font-mono" style={{ color: "rgba(232,196,96,0.25)" }}>Draw</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected card detail */}
            <AnimatePresence mode="wait">
              {selectedCard && selectedCard.revealed && (
                <motion.div
                  key={selectedCard.id}
                  className="lg:w-72 rounded-xl p-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ background: "rgba(155,89,182,0.08)", border: "1px solid rgba(155,89,182,0.25)" }}
                >
                  <span className="text-4xl">{selectedCard.icon}</span>
                  <h3 className="font-display text-lg mt-2" style={{ color: "#9b59b6" }}>{selectedCard.title}</h3>
                  <p className="text-[10px] font-mono uppercase tracking-wider mt-1 mb-3" style={{ color: "rgba(155,89,182,0.5)" }}>
                    {selectedCard.category}
                  </p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(240,230,208,0.8)" }}>
                    {selectedCard.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "network" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <svg viewBox="0 0 600 320" className="w-full max-w-2xl">
              {nodes.map((src, si) =>
                nodes.filter(tgt => tgt.layer === src.layer + 1).map((tgt, ti) => (
                  <line key={`bg-${si}-${ti}`} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                    stroke="rgba(155,89,182,0.04)" strokeWidth="0.5" />
                ))
              )}
              {firing.map(([s, t], fi) => {
                if (!nodes[s] || !nodes[t]) return null;
                return (
                  <motion.line key={`f-${fi}-${s}-${t}`}
                    x1={nodes[s].x} y1={nodes[s].y} x2={nodes[t].x} y2={nodes[t].y}
                    stroke="#9b59b6" strokeWidth="2"
                    initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }}
                  />
                );
              })}
              {nodes.map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y} r={4}
                  fill="rgba(155,89,182,0.4)" stroke="rgba(155,89,182,0.2)" strokeWidth="1" />
              ))}
              {["Data", "Embed", "Attention", "FFN", "Output", "Decision"].map((label, i) => (
                <text key={label} x={50 + (i / 5) * 500} y={310} textAnchor="middle"
                  fill="rgba(155,89,182,0.3)" fontSize="9" fontFamily="JetBrains Mono, monospace">
                  {label}
                </text>
              ))}
            </svg>
            <p className="font-body text-sm italic text-center max-w-md" style={{ color: "rgba(240,230,208,0.6)" }}>
              "The board keeps expanding. The questions keep getting better. And I'm still that kid who needs to know how it works."
            </p>
          </motion.div>
        )}

        {activeTab === "stack" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6 max-w-3xl mx-auto">
            <div className="flex-1">
              <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: "#9b59b6" }}>Tech Stack</p>
              <div className="grid grid-cols-3 gap-2">
                {techStack.map((t, i) => (
                  <motion.div key={t} className="px-3 py-2 rounded text-center"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: "rgba(155,89,182,0.08)", border: "1px solid rgba(155,89,182,0.2)" }}>
                    <span className="text-xs font-mono" style={{ color: "#9b59b6" }}>{t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: "#e8c460" }}>Value Delivered</p>
              <div className="space-y-2">
                {valueDelivered.map((v, i) => (
                  <motion.div key={i} className="flex items-start gap-2 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ background: "rgba(232,196,96,0.04)", border: "1px solid rgba(232,196,96,0.1)" }}>
                    <span className="text-xs mt-0.5">💎</span>
                    <span className="text-xs font-body" style={{ color: "rgba(240,230,208,0.75)" }}>{v}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NeuralNetworkWorld;
