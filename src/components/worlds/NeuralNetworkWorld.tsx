import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface NeuralNode {
  x: number;
  y: number;
  layer: number;
  active: boolean;
}

const storyLines = [
  "Today I'm architecting the secure backbone",
  "for enterprise AI at BMO.",
  "Azure-based AI platforms",
  "integrating enterprise data services",
  "under strict model governance.",
  "Making sure the most powerful technology",
  "of our generation runs on foundations",
  "that don't crack under pressure.",
  "",
  "The board keeps expanding.",
  "The questions keep getting better.",
  "And I'm still that kid who needs to know",
  "how it works.",
];

const NeuralNetworkWorld = () => {
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [firing, setFiring] = useState<[number, number][]>([]);
  const [storyIdx, setStoryIdx] = useState(-1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Create neural network layout
  useEffect(() => {
    const layers = [4, 6, 8, 6, 4, 2];
    const allNodes: NeuralNode[] = [];
    const width = 600;
    const height = 350;

    layers.forEach((count, layerIdx) => {
      const layerX = 60 + (layerIdx / (layers.length - 1)) * (width - 120);
      for (let i = 0; i < count; i++) {
        const y = (height / (count + 1)) * (i + 1);
        allNodes.push({ x: layerX, y, layer: layerIdx, active: false });
      }
    });
    setNodes(allNodes);
  }, []);

  // Fire random connections
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length === 0) return;

      // Pick a random node and fire to connected nodes in next layer
      const sourceLayer = Math.floor(Math.random() * 5);
      const sourceNodes = nodes.filter(n => n.layer === sourceLayer);
      const targetNodes = nodes.filter(n => n.layer === sourceLayer + 1);

      if (sourceNodes.length && targetNodes.length) {
        const src = sourceNodes[Math.floor(Math.random() * sourceNodes.length)];
        const tgt = targetNodes[Math.floor(Math.random() * targetNodes.length)];
        const srcIdx = nodes.indexOf(src);
        const tgtIdx = nodes.indexOf(tgt);

        setFiring(prev => [...prev.slice(-20), [srcIdx, tgtIdx]]);

        // Activate nodes
        setNodes(prev => prev.map((n, i) => ({
          ...n,
          active: i === srcIdx || i === tgtIdx ? true : n.active,
        })));

        // Deactivate after delay
        setTimeout(() => {
          setNodes(prev => prev.map((n, i) => ({
            ...n,
            active: i === srcIdx || i === tgtIdx ? false : n.active,
          })));
        }, 500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [nodes.length]);

  // Clean up old firings
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFiring(prev => prev.slice(-8));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Story reveal
  useEffect(() => {
    const timers = storyLines.map((_, i) =>
      setTimeout(() => setStoryIdx(i), 1500 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const layerLabels = ["Data", "Embed", "Attention", "FFN", "Output", "Decision"];

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col gap-6 max-w-4xl w-full items-center">
        {/* Neural network visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <svg ref={svgRef} viewBox="0 0 600 400" className="w-full max-w-2xl">
            {/* Layer labels */}
            {layerLabels.map((label, i) => (
              <text
                key={label}
                x={60 + (i / 5) * 480}
                y={385}
                textAnchor="middle"
                fill="rgba(232,196,96,0.3)"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {label}
              </text>
            ))}

            {/* Dormant connections (faint) */}
            {nodes.map((src, si) =>
              nodes
                .filter(tgt => tgt.layer === src.layer + 1)
                .map((tgt, ti) => (
                  <line
                    key={`bg-${si}-${ti}`}
                    x1={src.x} y1={src.y}
                    x2={tgt.x} y2={tgt.y}
                    stroke="rgba(232,196,96,0.03)"
                    strokeWidth="0.5"
                  />
                ))
            )}

            {/* Active firings */}
            {firing.map(([srcIdx, tgtIdx], fi) => {
              if (!nodes[srcIdx] || !nodes[tgtIdx]) return null;
              return (
                <motion.line
                  key={`fire-${fi}-${srcIdx}-${tgtIdx}`}
                  x1={nodes[srcIdx].x} y1={nodes[srcIdx].y}
                  x2={nodes[tgtIdx].x} y2={nodes[tgtIdx].y}
                  stroke="#9b59b6"
                  strokeWidth="2"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node, i) => (
              <g key={i}>
                {node.active && (
                  <circle cx={node.x} cy={node.y} r={12} fill="rgba(155,89,182,0.2)">
                    <animate attributeName="r" values="8;14;8" dur="0.6s" />
                  </circle>
                )}
                <circle
                  cx={node.x} cy={node.y} r={5}
                  fill={node.active ? "#9b59b6" : "rgba(232,196,96,0.3)"}
                  stroke={node.active ? "#9b59b6" : "rgba(232,196,96,0.15)"}
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Story */}
        <div className="max-w-lg text-center space-y-1.5">
          <p className="font-display text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(155,89,182,0.6)" }}>
            BMO · Principal Cloud Engineer — AI · 2025–Present
          </p>
          {storyLines.slice(0, storyIdx + 1).map((line, i) => (
            <motion.p
              key={i}
              className={`font-body ${line === "" ? "h-2" : "text-base"}`}
              style={{
                color: i >= 9 ? "#e8c460" : "rgba(240,230,208,0.7)",
                fontStyle: i >= 9 ? "italic" : "normal",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkWorld;
