import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

export interface DiagramNode {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w?: number; // width in px (default 140)
  h?: number; // height in px (default 40)
  group?: string;
  icon?: string;
  hidden?: boolean; // puzzle blank
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  bidirectional?: boolean;
}

export interface DiagramGroup {
  id: string;
  label: string;
  x: number; // percentage
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface ArchDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  hiddenNodeIds: string[]; // which nodes are blanks
  wordBank: string[]; // extra decoy terms + correct answers (labels)
}

export interface DiagramPuzzleData {
  title: string;
  roleTitle: string;
  projectName: string;
  description: string;
  diagram: ArchDiagram;
  successMessage: string;
  color: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert";
  techStack?: string[];
  services?: string[];
  layers?: string[];
}

/* ═══════════════════════════════════════════════════════════
   ARROW PATH HELPER
   ═══════════════════════════════════════════════════════════ */

const getNodeCenter = (node: DiagramNode) => ({
  x: node.x,
  y: node.y,
});

const getEdgePath = (
  from: DiagramNode,
  to: DiagramNode,
  containerW: number,
  containerH: number
) => {
  const nw = (n: DiagramNode) => (n.w || 140) / 2;
  const nh = (n: DiagramNode) => (n.h || 40) / 2;

  const fx = (from.x / 100) * containerW;
  const fy = (from.y / 100) * containerH;
  const tx = (to.x / 100) * containerW;
  const ty = (to.y / 100) * containerH;

  // Determine exit/entry points based on direction
  let x1 = fx, y1 = fy, x2 = tx, y2 = ty;
  const dx = tx - fx;
  const dy = ty - fy;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal dominant
    x1 = dx > 0 ? fx + nw(from) : fx - nw(from);
    x2 = dx > 0 ? tx - nw(to) : tx + nw(to);
  } else {
    // Vertical dominant
    y1 = dy > 0 ? fy + nh(from) : fy - nh(from);
    y2 = dy > 0 ? ty - nh(to) : ty + nh(to);
  }

  // Bezier control points for smooth curves
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  if (Math.abs(dx) > Math.abs(dy)) {
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  } else {
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  }
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE COMPONENT
   ═══════════════════════════════════════════════════════════ */

const ArchDiagramPuzzle = ({
  data,
  solved,
  onSolve,
}: {
  data: DiagramPuzzleData;
  solved: boolean;
  onSolve: () => void;
}) => {
  const { diagram, color } = data;

  // If already solved on mount, pre-fill all placements
  const initialPlacements = useMemo(() => {
    if (!solved) return {};
    const auto: Record<string, string> = {};
    diagram.nodes
      .filter((n) => diagram.hiddenNodeIds.includes(n.id))
      .forEach((n) => { auto[n.id] = n.label; });
    return auto;
  }, [solved, diagram]);

  const [placements, setPlacements] = useState<Record<string, string>>(initialPlacements);
  const [dragOverNode, setDragOverNode] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const [autoReveal, setAutoReveal] = useState(solved);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const containerW = 900;
  const containerH = 600;

  const hiddenNodes = useMemo(
    () => diagram.nodes.filter((n) => diagram.hiddenNodeIds.includes(n.id)),
    [diagram]
  );

  const correctAnswers = useMemo(() => {
    const map: Record<string, string> = {};
    hiddenNodes.forEach((n) => {
      map[n.id] = n.label;
    });
    return map;
  }, [hiddenNodes]);

  const isDone =
    solved ||
    autoReveal ||
    Object.keys(placements).length === hiddenNodes.length;

  const usedTerms = new Set(Object.values(placements));
  const availableTerms = diagram.wordBank.filter((t) => !usedTerms.has(t));

  // Handle drag
  const handleDragStart = (e: React.DragEvent, term: string) => {
    setWrongFeedback(null);
    e.dataTransfer.setData("text/plain", term);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, nodeId: string) => {
      e.preventDefault();
      setDragOverNode(null);
      if (isDone) return;
      const term = e.dataTransfer.getData("text/plain");
      if (!term) return;
      const correct = correctAnswers[nodeId];
      if (term === correct) {
        setWrongFeedback(null);
        setPlacements((prev) => {
          const next = { ...prev, [nodeId]: term };
          if (Object.keys(next).length === hiddenNodes.length) onSolve();
          return next;
        });
      } else {
        setWrongFeedback(
          `"${term}" doesn't belong here — think about what this component actually does.`
        );
        setTimeout(() => setWrongFeedback(null), 3000);
      }
    },
    [isDone, correctAnswers, hiddenNodes.length, onSolve]
  );

  // Click-to-place for mobile
  const handleNodeClick = (nodeId: string) => {
    if (isDone || !selectedTerm) return;
    if (placements[nodeId]) return;
    const correct = correctAnswers[nodeId];
    if (selectedTerm === correct) {
      setWrongFeedback(null);
      setPlacements((prev) => {
        const next = { ...prev, [nodeId]: selectedTerm };
        if (Object.keys(next).length === hiddenNodes.length) onSolve();
        return next;
      });
      setSelectedTerm(null);
    } else {
      setWrongFeedback(
        `"${selectedTerm}" doesn't fit here — try another placement.`
      );
      setTimeout(() => setWrongFeedback(null), 3000);
    }
  };

  const handleReveal = () => {
    setAutoReveal(true);
    const auto: Record<string, string> = {};
    hiddenNodes.forEach((n) => {
      auto[n.id] = n.label;
    });
    setPlacements(auto);
    onSolve();
  };

  const handleReset = () => {
    setPlacements({});
    setAutoReveal(false);
    setWrongFeedback(null);
    setSelectedTerm(null);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="font-display text-base font-bold"
            style={{ color: "#2d2a26" }}
          >
            {data.projectName}
          </h3>
          <p
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color }}
          >
            {data.roleTitle}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
          style={{
            color: "rgba(80,70,60,0.5)",
            background: "rgba(80,70,60,0.04)",
            border: "1px solid rgba(80,70,60,0.1)",
          }}
        >
          Reset
        </button>
      </div>

      {/* Description */}
      <p
        className="text-xs font-body leading-relaxed"
        style={{ color: "rgba(45,42,38,0.7)" }}
      >
        {data.description}
      </p>

      {/* Challenge prompt */}
      {!isDone && (
        <motion.div
          className="rounded-lg p-3 flex items-start gap-2"
          style={{
            background: `${color}08`,
            border: `1px solid ${color}20`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-sm">🧩</span>
          <div>
            <p
              className="text-[10px] font-mono font-bold uppercase mb-1"
              style={{ color }}
            >
              Architecture Challenge
            </p>
            <p
              className="text-[10px] font-body"
              style={{ color: "rgba(45,42,38,0.65)" }}
            >
              {hiddenNodes.length} key services are missing from this diagram.
              Drag the correct terms from the bank below into the empty slots —
              or tap a term then tap a blank node.
            </p>
          </div>
        </motion.div>
      )}

      {/* Wrong feedback */}
      <AnimatePresence>
        {wrongFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg p-2 flex items-center gap-2"
            style={{
              background: "rgba(220,50,50,0.06)",
              border: "1px solid rgba(220,50,50,0.18)",
            }}
          >
            <span>❌</span>
            <p
              className="text-[9px] font-mono"
              style={{ color: "#dc3232" }}
            >
              {wrongFeedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word bank */}
      {!isDone && availableTerms.length > 0 && (
        <div
          className="rounded-lg p-2.5"
          style={{
            background: "rgba(180,140,100,0.04)",
            border: "1px solid rgba(180,140,100,0.1)",
          }}
        >
          <p
            className="text-[7px] font-mono uppercase tracking-widest mb-2"
            style={{ color: "rgba(80,70,60,0.4)" }}
          >
            Term Bank — drag or tap to place ({availableTerms.length} remaining)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableTerms.map((term) => (
              <motion.div
                key={term}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e as unknown as React.DragEvent, term)
                }
                onClick={() =>
                  setSelectedTerm(selectedTerm === term ? null : term)
                }
                className="px-2.5 py-1.5 rounded-md cursor-grab active:cursor-grabbing select-none transition-all"
                style={{
                  background:
                    selectedTerm === term ? `${color}15` : "#fefcf9",
                  border: `1.5px solid ${selectedTerm === term ? color : "rgba(180,140,100,0.2)"}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  fontSize: 10,
                  color: selectedTerm === term ? color : "#2d2a26",
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {term}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Diagram canvas */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "#fefcf9",
          border: `1px solid ${color}20`,
          paddingBottom: `${(containerH / containerW) * 100}%`,
          boxShadow: "0 2px 12px rgba(180,140,100,0.08)",
        }}
      >
        <div className="absolute inset-0">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(${color}30 1px, transparent 1px),
                linear-gradient(90deg, ${color}30 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Groups */}
          {diagram.groups?.map((group) => (
            <div
              key={group.id}
              className="absolute rounded-lg"
              style={{
                left: `${group.x}%`,
                top: `${group.y}%`,
                width: `${group.w}%`,
                height: `${group.h}%`,
                background: `${group.color || color}10`,
                border: `1px solid ${group.color || color}25`,
              }}
            >
              <span
                className="absolute top-1 left-2 text-[7px] font-mono uppercase tracking-wider"
                style={{ color: `${group.color || color}90` }}
              >
                {group.label}
              </span>
            </div>
          ))}

          {/* SVG Edges */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${containerW} ${containerH}`}
            preserveAspectRatio="none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrow-head"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill={`${color}60`}
                />
              </marker>
              <marker
                id="arrow-head-rev"
                markerWidth="8"
                markerHeight="6"
                refX="1"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="8 0, 0 3, 8 6"
                  fill={`${color}60`}
                />
              </marker>
            </defs>
            {diagram.edges.map((edge, i) => {
              const fromNode = diagram.nodes.find(
                (n) => n.id === edge.from
              );
              const toNode = diagram.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const path = getEdgePath(
                fromNode,
                toNode,
                containerW,
                containerH
              );
              return (
                <g key={i}>
                  <path
                    d={path}
                    fill="none"
                    stroke={`${color}35`}
                    strokeWidth="1.5"
                    strokeDasharray={edge.dashed ? "4 3" : "none"}
                    markerEnd="url(#arrow-head)"
                    markerStart={
                      edge.bidirectional
                        ? "url(#arrow-head-rev)"
                        : undefined
                    }
                  />
                  {edge.label && (
                    <text
                      x={
                        ((fromNode.x + toNode.x) / 2 / 100) *
                        containerW
                      }
                      y={
                        ((fromNode.y + toNode.y) / 2 / 100) *
                          containerH -
                        6
                      }
                      textAnchor="middle"
                      fill={`${color}50`}
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {diagram.nodes.map((node) => {
            const isHidden = diagram.hiddenNodeIds.includes(node.id);
            const placed = placements[node.id];
            const isBlank = isHidden && !placed && !autoReveal;
            const isOver = dragOverNode === node.id;
            const w = node.w || 140;
            const h = node.h || 40;

            return (
              <motion.div
                key={node.id}
                className="absolute flex items-center justify-center rounded-md transition-all"
                style={{
                  left: `calc(${node.x}% - ${w / 2}px)`,
                  top: `calc(${node.y}% - ${h / 2}px)`,
                  width: w,
                  height: h,
                  zIndex: 2,
                  background: isBlank
                    ? isOver
                      ? `${color}15`
                      : "rgba(180,140,100,0.04)"
                    : placed
                      ? `${color}12`
                      : "#fff",
                  border: isBlank
                    ? `2px dashed ${isOver ? color : `${color}50`}`
                    : placed
                      ? `2px solid ${color}60`
                      : `1px solid rgba(180,140,100,0.2)`,
                  boxShadow: placed
                    ? `0 0 12px ${color}20`
                    : isOver
                      ? `0 0 16px ${color}25`
                      : "0 2px 8px rgba(180,140,100,0.08)",
                  cursor: isBlank ? "pointer" : "default",
                }}
                animate={
                  isOver ? { scale: 1.08 } : placed ? { scale: [1, 1.05, 1] } : {}
                }
                transition={placed ? { duration: 0.3 } : { duration: 0.15 }}
                onDragOver={(e) => {
                  if (isBlank) {
                    e.preventDefault();
                    setDragOverNode(node.id);
                  }
                }}
                onDragLeave={() => setDragOverNode(null)}
                onDrop={(e) => {
                  if (isBlank) handleDrop(e as unknown as React.DragEvent, node.id);
                }}
                onClick={() => {
                  if (isBlank) handleNodeClick(node.id);
                }}
              >
                {isBlank ? (
                  <motion.span
                    className="text-[9px] font-mono text-center px-1"
                    style={{ color: isOver ? color : `${color}50` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {isOver ? "Drop here ↓" : "? ? ?"}
                  </motion.span>
                ) : (
                  <div className="flex items-center gap-1.5 px-2">
                    {node.icon && <span className="text-xs">{node.icon}</span>}
                    <span
                      className="text-[9px] font-mono font-bold text-center leading-tight"
                      style={{
                        color: placed
                          ? "#2a7d4f"
                          : "#2d2a26",
                      }}
                    >
                      {placed || node.label}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {hiddenNodes.map((n, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: placements[n.id] ? "#2a7d4f" : "rgba(180,140,100,0.12)",
            }}
          />
        ))}
      </div>

      {/* Success */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3"
          style={{
            background: "rgba(42,125,79,0.06)",
            border: "1px solid rgba(42,125,79,0.15)",
          }}
        >
          <p
            className="text-[9px] font-mono uppercase mb-1"
            style={{ color: "#2a7d4f" }}
          >
            ✓ Architecture Complete
          </p>
          <p
            className="text-sm font-body"
            style={{ color: "rgba(45,42,38,0.78)" }}
          >
            {data.successMessage}
          </p>
        </motion.div>
      )}

      {/* Reveal button */}
      {!isDone && (
        <motion.button
          onClick={handleReveal}
          className="flex items-center gap-1.5 text-[9px] font-mono px-3 py-1.5 rounded-lg cursor-pointer transition-all mt-1"
          style={{
            color: "rgba(80,70,60,0.5)",
            background: "rgba(180,140,100,0.04)",
            border: "1px solid rgba(180,140,100,0.12)",
          }}
          whileHover={{ scale: 1.03, background: `${color}08` }}
          whileTap={{ scale: 0.97 }}
        >
          <Eye size={10} /> Reveal Solution
        </motion.button>
      )}
    </div>
  );
};

export default ArchDiagramPuzzle;
