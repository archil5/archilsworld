import { motion } from "framer-motion";
import type { ArchDiagram } from "./ArchDiagramPuzzle";

const VW = 1200;
const VH = 700;

const getEdgePath = (
  from: { x: number; y: number; w?: number; h?: number },
  to: { x: number; y: number; w?: number; h?: number }
) => {
  const nw = (n: typeof from) => ((n.w || 140) / 2);
  const nh = (n: typeof from) => ((n.h || 40) / 2);
  const fx = (from.x / 100) * VW;
  const fy = (from.y / 100) * VH;
  const tx = (to.x / 100) * VW;
  const ty = (to.y / 100) * VH;
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
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block" }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="ro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.3" opacity="0.08" />
            </pattern>
            <marker id="ro-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={`${color}`} opacity="0.5" />
            </marker>
            <marker id="ro-arrow-rev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
              <polygon points="8 0, 0 3, 8 6" fill={`${color}`} opacity="0.5" />
            </marker>
          </defs>
          <rect width={VW} height={VH} fill="url(#ro-grid)" />

          {/* Groups */}
          {diagram.groups?.map((group) => {
            const gx = (group.x / 100) * VW;
            const gy = (group.y / 100) * VH;
            const gw = (group.w / 100) * VW;
            const gh = (group.h / 100) * VH;
            return (
              <g key={group.id}>
                <rect
                  x={gx} y={gy} width={gw} height={gh}
                  rx={8}
                  fill={`${group.color || color}`}
                  fillOpacity={0.04}
                  stroke={`${group.color || color}`}
                  strokeOpacity={0.15}
                  strokeWidth={1}
                />
                <text
                  x={gx + 8} y={gy + 12}
                  fill={`${group.color || color}`}
                  fillOpacity={0.5}
                  fontSize="9"
                  fontFamily="monospace"
                  letterSpacing="1"
                >
                  {group.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Edges */}
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
                  stroke={color}
                  strokeOpacity={0.25}
                  strokeWidth="1.5"
                  strokeDasharray={edge.dashed ? "4 3" : "none"}
                  markerEnd="url(#ro-arrow)"
                  markerStart={edge.bidirectional ? "url(#ro-arrow-rev)" : undefined}
                />
                {edge.label && (
                  <text
                    x={((fromNode.x + toNode.x) / 2 / 100) * VW}
                    y={((fromNode.y + toNode.y) / 2 / 100) * VH - 6}
                    textAnchor="middle"
                    fill={color}
                    fillOpacity={0.4}
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {diagram.nodes.map((node) => {
            const w = node.w || 140;
            const h = node.h || 40;
            const cx = (node.x / 100) * VW;
            const cy = (node.y / 100) * VH;
            const nx = cx - w / 2;
            const ny = cy - h / 2;
            return (
              <g key={node.id}>
                <rect
                  x={nx} y={ny} width={w} height={h}
                  rx={6}
                  fill="rgba(255,255,255,0.07)"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1}
                />
                {node.icon && (
                  <text
                    x={nx + 10} y={cy + 4}
                    fontSize="12"
                    textAnchor="start"
                  >
                    {node.icon}
                  </text>
                )}
                <text
                  x={node.icon ? nx + 26 : cx}
                  y={cy + 3.5}
                  textAnchor={node.icon ? "start" : "middle"}
                  fill="rgba(255,255,255,0.85)"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
};

export default ReadOnlyDiagram;
