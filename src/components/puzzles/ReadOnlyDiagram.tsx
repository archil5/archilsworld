import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import type { ArchDiagram } from "./ArchDiagramPuzzle";

const VW = 1600;
const VH = 900;

const getEdgePath = (
  from: { x: number; y: number; w?: number; h?: number },
  to: { x: number; y: number; w?: number; h?: number }
) => {
  const nw = (n: typeof from) => ((n.w || 150) * 1.2 / 2);
  const nh = (n: typeof from) => ((n.h || 44) * 1.2 / 2);
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
    return { path: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, mid: { x: mx, y: (y1 + y2) / 2 } };
  }
  return { path: `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`, mid: { x: (x1 + x2) / 2, y: my } };
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

  const handleZoomIn = () => setZoom(z => Math.min(3, z + 0.3));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.3));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      setZoom((z) => Math.max(0.5, Math.min(3, z - e.deltaY * 0.003)));
      return;
    }

    // Regular scroll/trackpad = pan (not zoom)
    setPan((p) => ({
      x: p.x - e.deltaX / zoom,
      y: p.y - e.deltaY / zoom,
    }));
  }, [zoom]);

  // Pinch-to-zoom via touch events
  const lastTouchDist = useRef(0);
  const handleTouchStartZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const handleTouchMoveZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist.current > 0) {
        const scale = dist / lastTouchDist.current;
        setZoom(z => Math.max(0.5, Math.min(3, z * scale)));
      }
      lastTouchDist.current = dist;
    } else if (isPanning && e.touches.length === 1) {
      e.stopPropagation();
      setPan(p => ({ x: p.x + (e.touches[0].clientX - lastMouse.current.x), y: p.y + (e.touches[0].clientY - lastMouse.current.y) }));
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const handleTouchEndZoom = () => { setIsPanning(false); lastTouchDist.current = 0; };

  const handleMouseDown = (e: React.MouseEvent) => { setIsPanning(true); lastMouse.current = { x: e.clientX, y: e.clientY }; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan(p => ({ x: p.x + (e.clientX - lastMouse.current.x), y: p.y + (e.clientY - lastMouse.current.y) }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => setIsPanning(false);

  // Touch handlers replaced by pinch-to-zoom aware versions above

  const wrapperClass = isFullscreen ? "fixed inset-0 z-[100] flex flex-col" : "relative";

  // Light warm colors
  const bgColor = isFullscreen ? "#faf8f4" : "#fefcf9";
  const borderColor = "hsl(30, 15%, 85%)";
  const groupBorderOpacity = 0.35;
  const nodeBg = "#ffffff";
  const nodeStroke = "hsl(30, 15%, 82%)";
  const textColor = "hsl(220, 20%, 18%)";
  const subtleText = "hsl(220, 10%, 45%)";
  const edgeColor = "hsl(25, 40%, 55%)";

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: edgeColor }}>
          Solution Architecture
        </p>
      )}
      <div className={wrapperClass} style={isFullscreen ? { background: bgColor } : {}}>
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-t-xl"
          style={{
            background: "hsl(30, 20%, 96%)",
            border: `1px solid ${borderColor}`,
            borderBottom: "none",
            ...(isFullscreen ? { borderRadius: 0 } : {}),
          }}
        >
          <div className="flex items-center gap-1">
            <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-black/5 transition-colors cursor-pointer" title="Zoom out">
              <ZoomOut size={14} color={subtleText} />
            </button>
            <span className="text-[10px] font-mono px-2 min-w-[40px] text-center" style={{ color: subtleText }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-black/5 transition-colors cursor-pointer" title="Zoom in">
              <ZoomIn size={14} color={subtleText} />
            </button>
            <div className="w-px h-4 mx-1" style={{ background: borderColor }} />
            <button onClick={handleReset} className="p-1.5 rounded hover:bg-black/5 transition-colors cursor-pointer" title="Reset view">
              <RotateCcw size={13} color={subtleText} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono hidden md:inline" style={{ color: subtleText }}>
              Drag to pan · Ctrl+Scroll to zoom
            </span>
            <button
              onClick={() => { setIsFullscreen(f => !f); handleReset(); }}
              className="p-1.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize2 size={13} color={subtleText} />
            </button>
          </div>
        </div>

        {/* Diagram */}
        <motion.div
          className="overflow-hidden rounded-b-xl overscroll-contain touch-none"
          style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderTop: "none",
            height: isFullscreen ? "100%" : 450,
            cursor: isPanning ? "grabbing" : "grab",
            ...(isFullscreen ? { borderRadius: 0, flex: 1 } : {}),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onWheelCapture={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStartZoom}
          onTouchMove={handleTouchMoveZoom}
          onTouchEnd={handleTouchEndZoom}
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
              <defs>
                <pattern id="ro-grid-light" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(30, 15%, 88%)" strokeWidth="0.5" />
                </pattern>
                <marker id="ro-arrow-light" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                  <polygon points="0 0, 10 4, 0 8" fill={edgeColor} opacity="0.7" />
                </marker>
                <marker id="ro-arrow-rev-light" markerWidth="10" markerHeight="8" refX="1" refY="4" orient="auto">
                  <polygon points="10 0, 0 4, 10 8" fill={edgeColor} opacity="0.7" />
                </marker>
                <filter id="node-shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.08)" />
                </filter>
                <filter id="step-shadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.12)" />
                </filter>
              </defs>
              <rect width={VW} height={VH} fill="url(#ro-grid-light)" />

              {/* Groups */}
              {diagram.groups?.map((group) => {
                const gx = (group.x / 100) * VW;
                const gy = (group.y / 100) * VH;
                const gw = (group.w / 100) * VW;
                const gh = (group.h / 100) * VH;
                const gc = group.color || color;
                return (
                  <g key={group.id}>
                    <rect
                      x={gx} y={gy} width={gw} height={gh}
                      rx={12}
                      fill={gc}
                      fillOpacity={0.04}
                      stroke={gc}
                      strokeOpacity={groupBorderOpacity}
                      strokeWidth={1.5}
                      strokeDasharray="6 3"
                    />
                    <rect
                      x={gx + 8} y={gy + 6} width={group.label.length * 7 + 16} height={18}
                      rx={4}
                      fill={gc}
                      fillOpacity={0.1}
                    />
                    <text
                      x={gx + 16} y={gy + 18}
                      fill={gc}
                      fillOpacity={0.8}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="700"
                      letterSpacing="1"
                    >
                      {group.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* Edges with step numbers */}
              {diagram.edges.map((edge, i) => {
                const fromNode = diagram.nodes.find((n) => n.id === edge.from);
                const toNode = diagram.nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const { path, mid } = getEdgePath(fromNode, toNode);
                const stepNum = i + 1;
                return (
                  <g key={i}>
                    <path
                      d={path}
                      fill="none"
                      stroke={edgeColor}
                      strokeOpacity={0.4}
                      strokeWidth="2"
                      strokeDasharray={edge.dashed ? "8 5" : "none"}
                      markerEnd="url(#ro-arrow-light)"
                      markerStart={edge.bidirectional ? "url(#ro-arrow-rev-light)" : undefined}
                    />
                    {/* Step number circle */}
                    <g filter="url(#step-shadow)">
                      <circle cx={mid.x} cy={mid.y} r={10} fill={color} fillOpacity={0.9} />
                      <text
                        x={mid.x} y={mid.y + 3.5}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        {stepNum}
                      </text>
                    </g>
                    {/* Edge label */}
                    {edge.label && (
                      <text
                        x={mid.x}
                        y={mid.y - 16}
                        textAnchor="middle"
                        fill={subtleText}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {diagram.nodes.map((node) => {
                const w = node.w ? node.w * 1.2 : 170;
                const h = node.h ? node.h * 1.2 : 48;
                const cx = (node.x / 100) * VW;
                const cy = (node.y / 100) * VH;
                const nx = cx - w / 2;
                const ny = cy - h / 2;
                return (
                  <g key={node.id} filter="url(#node-shadow)">
                    <rect
                      x={nx} y={ny} width={w} height={h}
                      rx={8}
                      fill={nodeBg}
                      stroke={nodeStroke}
                      strokeWidth={1.5}
                    />
                    {/* Left color accent bar */}
                    <rect
                      x={nx} y={ny} width={4} height={h}
                      rx={2}
                      fill={color}
                      fillOpacity={0.5}
                    />
                    {node.icon && (
                      <text x={nx + 14} y={cy + 5} fontSize="15" textAnchor="start">
                        {node.icon}
                      </text>
                    )}
                    <text
                      x={node.icon ? nx + 34 : cx}
                      y={cy + 4.5}
                      textAnchor={node.icon ? "start" : "middle"}
                      fill={textColor}
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Fullscreen close */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => { setIsFullscreen(false); handleReset(); }}
              className="text-[10px] font-mono px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-black/5"
              style={{ color: subtleText, background: "hsl(30, 20%, 96%)", border: `1px solid ${borderColor}` }}
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
