import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import type { ArchDiagram } from "./ArchDiagramPuzzle";

const VW = 1400;
const VH = 800;

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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(z => Math.min(3, z + 0.3));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.3));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.max(0.5, Math.min(3, z - e.deltaY * 0.003)));
    } else {
      setPan(p => ({
        x: p.x - e.deltaX * 0.5,
        y: p.y - e.deltaY * 0.5,
      }));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan(p => ({
      x: p.x + (e.clientX - lastMouse.current.x),
      y: p.y + (e.clientY - lastMouse.current.y),
    }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => setIsPanning(false);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;
    e.stopPropagation();
    setPan(p => ({
      x: p.x + (e.touches[0].clientX - lastMouse.current.x),
      y: p.y + (e.touches[0].clientY - lastMouse.current.y),
    }));
    lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = () => setIsPanning(false);

  const wrapperClass = isFullscreen
    ? "fixed inset-0 z-[100] flex flex-col"
    : "relative";

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-[8px] font-mono uppercase tracking-widest" style={{ color: `${color}90` }}>
          Solution Architecture
        </p>
      )}
      <div className={wrapperClass} style={isFullscreen ? { background: "#0a0c12" } : {}}>
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-t-xl"
          style={{
            background: "#15171f",
            border: `1px solid ${color}25`,
            borderBottom: "none",
            ...(isFullscreen ? { borderRadius: 0 } : {}),
          }}
        >
          <div className="flex items-center gap-1">
            <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer" title="Zoom out">
              <ZoomOut size={14} color="rgba(255,255,255,0.6)" />
            </button>
            <span className="text-[10px] font-mono px-2 min-w-[40px] text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer" title="Zoom in">
              <ZoomIn size={14} color="rgba(255,255,255,0.6)" />
            </button>
            <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
            <button onClick={handleReset} className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer" title="Reset view">
              <RotateCcw size={13} color="rgba(255,255,255,0.6)" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
              Scroll to pan · Ctrl+Scroll to zoom · Drag to move
            </span>
            <button
              onClick={() => { setIsFullscreen(f => !f); handleReset(); }}
              className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize2 size={13} color="rgba(255,255,255,0.6)" />
            </button>
          </div>
        </div>

        {/* Diagram container */}
        <motion.div
          ref={containerRef}
          className="overflow-hidden rounded-b-xl"
          style={{
            background: "#0f1117",
            border: `1px solid ${color}25`,
            borderTop: "none",
            height: isFullscreen ? "100%" : 420,
            cursor: isPanning ? "grabbing" : "grab",
            ...(isFullscreen ? { borderRadius: 0, flex: 1 } : {}),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isPanning ? "none" : "transform 0.2s ease-out",
              width: "100%",
              height: "100%",
            }}
          >
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{ display: "block" }}
            >
              {/* Background grid */}
              <defs>
                <pattern id="ro-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke={color} strokeWidth="0.3" opacity="0.06" />
                </pattern>
                <marker id="ro-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={`${color}`} opacity="0.5" />
                </marker>
                <marker id="ro-arrow-rev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                  <polygon points="8 0, 0 3, 8 6" fill={`${color}`} opacity="0.5" />
                </marker>
                <filter id="node-glow">
                  <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                </filter>
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
                      rx={10}
                      fill={`${group.color || color}`}
                      fillOpacity={0.05}
                      stroke={`${group.color || color}`}
                      strokeOpacity={0.2}
                      strokeWidth={1.5}
                    />
                    <text
                      x={gx + 10} y={gy + 16}
                      fill={`${group.color || color}`}
                      fillOpacity={0.6}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="600"
                      letterSpacing="1.5"
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
                      strokeOpacity={0.3}
                      strokeWidth="2"
                      strokeDasharray={edge.dashed ? "6 4" : "none"}
                      markerEnd="url(#ro-arrow)"
                      markerStart={edge.bidirectional ? "url(#ro-arrow-rev)" : undefined}
                    />
                    {edge.label && (
                      <text
                        x={((fromNode.x + toNode.x) / 2 / 100) * VW}
                        y={((fromNode.y + toNode.y) / 2 / 100) * VH - 8}
                        textAnchor="middle"
                        fill={color}
                        fillOpacity={0.45}
                        fontSize="10"
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
                const w = node.w ? node.w * 1.15 : 160;
                const h = node.h ? node.h * 1.15 : 44;
                const cx = (node.x / 100) * VW;
                const cy = (node.y / 100) * VH;
                const nx = cx - w / 2;
                const ny = cy - h / 2;
                return (
                  <g key={node.id} filter="url(#node-glow)">
                    <rect
                      x={nx} y={ny} width={w} height={h}
                      rx={8}
                      fill="rgba(20,22,30,0.9)"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={1.5}
                    />
                    {node.icon && (
                      <text
                        x={nx + 12} y={cy + 5}
                        fontSize="15"
                        textAnchor="start"
                      >
                        {node.icon}
                      </text>
                    )}
                    <text
                      x={node.icon ? nx + 32 : cx}
                      y={cy + 4.5}
                      textAnchor={node.icon ? "start" : "middle"}
                      fill="rgba(255,255,255,0.9)"
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="700"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Fullscreen close hint */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => { setIsFullscreen(false); handleReset(); }}
              className="text-[10px] font-mono px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Press ESC or click to exit fullscreen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyDiagram;
