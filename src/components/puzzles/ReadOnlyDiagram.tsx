import { motion } from "framer-motion";
import type { ArchDiagram } from "./ArchDiagramPuzzle";

const containerW = 900;
const containerH = 600;

const getEdgePath = (
  from: { x: number; y: number; w?: number; h?: number },
  to: { x: number; y: number; w?: number; h?: number }
) => {
  const nw = (n: typeof from) => ((n.w || 140) / 2);
  const nh = (n: typeof from) => ((n.h || 40) / 2);
  const fx = (from.x / 100) * containerW;
  const fy = (from.y / 100) * containerH;
  const tx = (to.x / 100) * containerW;
  const ty = (to.y / 100) * containerH;
  let x1 = fx, y1 = fy, x2 = tx, y2 = ty;
  const dx = tx - fx;
  const dy = ty - fy;
  if (Math.abs(dx) > Math.abs(dy)) {
    x1 = dx > 0 ? fx + nw(from) : fx - nw(from);
    x2 = dx > 0 ? tx - nw(to) : tx + nw(to);
  } else {
    y1 = dy > 0 ? fy + nh(from) : fy - nh(from);
    y2 = dy > 0 ? ty - nh(to) : ty + nh(to);
  }
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  if (Math.abs(dx) > Math.abs(dy)) {
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
};

interface ReadOnlyDiagramProps {
  diagram: ArchDiagram;
  color: string;
  title?: string;
}

const ReadOnlyDiagram = ({ diagram, color, title }: ReadOnlyDiagramProps) => {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-[8px] font-mono uppercase tracking-widest" style={{ color: `${color}90` }}>
          Solution Architecture
        </p>
      )}
      <motion.div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "#0f1117",
          border: `1px solid ${color}30`,
          paddingBottom: `${(containerH / containerW) * 100}%`,
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(${color}40 1px, transparent 1px), linear-gradient(90deg, ${color}40 1px, transparent 1px)`,
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
                background: `${group.color || color}08`,
                border: `1px solid ${group.color || color}20`,
              }}
            >
              <span
                className="absolute top-1 left-2 text-[7px] font-mono uppercase tracking-wider"
                style={{ color: `${group.color || color}60` }}
              >
                {group.label}
              </span>
            </div>
          ))}

          {/* Edges */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${containerW} ${containerH}`}
            preserveAspectRatio="none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker id="ro-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={`${color}60`} />
              </marker>
              <marker id="ro-arrow-rev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                <polygon points="8 0, 0 3, 8 6" fill={`${color}60`} />
              </marker>
            </defs>
            {diagram.edges.map((edge, i) => {
              const fromNode = diagram.nodes.find((n) => n.id === edge.from);
              const toNode = diagram.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const path = getEdgePath(fromNode, toNode);
              return (
                <g key={i}>
                  <path
                    d={path}
                    fill="none"
                    stroke={`${color}35`}
                    strokeWidth="1.5"
                    strokeDasharray={edge.dashed ? "4 3" : "none"}
                    markerEnd="url(#ro-arrow)"
                    markerStart={edge.bidirectional ? "url(#ro-arrow-rev)" : undefined}
                  />
                  {edge.label && (
                    <text
                      x={((fromNode.x + toNode.x) / 2 / 100) * containerW}
                      y={((fromNode.y + toNode.y) / 2 / 100) * containerH - 6}
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

          {/* Nodes — all revealed */}
          {diagram.nodes.map((node, i) => {
            const w = node.w || 140;
            const h = node.h || 40;
            return (
              <motion.div
                key={node.id}
                className="absolute flex items-center justify-center rounded-md"
                style={{
                  left: `calc(${node.x}% - ${w / 2}px)`,
                  top: `calc(${node.y}% - ${h / 2}px)`,
                  width: w,
                  height: h,
                  zIndex: 2,
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid rgba(255,255,255,0.12)`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.02, duration: 0.3 }}
              >
                <div className="flex items-center gap-1.5 px-2">
                  {node.icon && <span className="text-xs">{node.icon}</span>}
                  <span
                    className="text-[9px] font-mono font-bold text-center leading-tight"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {node.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ReadOnlyDiagram;
