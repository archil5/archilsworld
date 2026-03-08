import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TILES, CATEGORY_COLORS } from "@/data/tiles";
import type { TileData } from "@/data/tiles";
import TileDetail from "@/components/TileDetail";
import meeple from "@/assets/meeple.png";

const BOARD_W = 1700;
const BOARD_H = 800;

const GameBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTile, setActiveTile] = useState<TileData | null>(null);
  const [piecePos, setPiecePos] = useState({ x: TILES[0].x, y: TILES[0].y });
  const [visitedTiles, setVisitedTiles] = useState<Set<string>>(new Set());

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Center board on mount
  useEffect(() => {
    const center = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      setPan({
        x: (cw - BOARD_W) / 2,
        y: (ch - BOARD_H) / 2,
      });
    };
    center();
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, []);

  const handleTileClick = useCallback((tile: TileData) => {
    setPiecePos({ x: tile.x, y: tile.y });
    setVisitedTiles((prev) => new Set(prev).add(tile.id));
    // Delay detail opening so piece animation plays first
    setTimeout(() => setActiveTile(tile), 400);
  }, []);

  // Mouse panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".tile")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Touch panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".tile")) return;
    const t = e.touches[0];
    setIsPanning(true);
    panStart.current = { x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning) return;
    const t = e.touches[0];
    setPan({
      x: panStart.current.panX + (t.clientX - panStart.current.x),
      y: panStart.current.panY + (t.clientY - panStart.current.y),
    });
  };

  return (
    <div
      ref={containerRef}
      className="board-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsPanning(false)}
    >
      <div className="board-overlay" />

      {/* Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <h1 className="board-title">Archil Patel</h1>
        <p className="board-subtitle mt-1">Click a tile to explore my journey</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-wrap gap-3">
        {(["origin", "education", "career", "current"] as const).map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            <span className="text-xs font-display tracking-wider capitalize" style={{ color: "hsl(var(--foreground) / 0.5)" }}>
              {cat}
            </span>
          </div>
        ))}
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="game-board absolute"
        style={{
          width: BOARD_W,
          height: BOARD_H,
          left: pan.x,
          top: pan.y,
        }}
      >
        {/* Path lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={BOARD_W}
          height={BOARD_H}
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(43, 80%, 50%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(270, 40%, 45%)" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {TILES.slice(1).map((tile, i) => {
            const prev = TILES[i];
            return (
              <line
                key={tile.id}
                x1={prev.x + 50}
                y1={prev.y + 50}
                x2={tile.x + 50}
                y2={tile.y + 50}
                stroke="url(#pathGrad)"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
            );
          })}
        </svg>

        {/* Tiles */}
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.id}
            className={`tile ${activeTile?.id === tile.id ? "active" : ""}`}
            style={{ left: tile.x, top: tile.y }}
            initial={{ opacity: 0, scale: 0, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring", damping: 12 }}
            onClick={() => handleTileClick(tile)}
          >
            <div className="tile-inner">
              <span className="tile-icon">{tile.icon}</span>
              <span className="tile-label">{tile.label}</span>
              <span className="tile-year">{tile.year}</span>
              <div
                className="tile-strip"
                style={{ background: CATEGORY_COLORS[tile.category] }}
              />
              {visitedTiles.has(tile.id) && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold"
                  style={{
                    background: "hsl(var(--gold))",
                    color: "hsl(var(--ink))",
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Game piece (meeple) */}
        <motion.div
          className="absolute z-20 pointer-events-none"
          animate={{
            left: piecePos.x + 30,
            top: piecePos.y - 35,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 120, mass: 0.8 }}
        >
          <div className="animate-float-piece">
            <img src={meeple} alt="Game piece" className="w-10 h-10 drop-shadow-lg" />
          </div>
        </motion.div>
      </div>

      {/* Detail overlay */}
      <TileDetail tile={activeTile} onClose={() => setActiveTile(null)} />

      {/* Instructions hint */}
      <AnimatePresence>
        {!activeTile && visitedTiles.size === 0 && (
          <motion.div
            className="absolute bottom-6 right-6 z-30 text-right"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-xs font-mono" style={{ color: "hsl(var(--foreground) / 0.4)" }}>
              Drag to pan · Click tiles to explore
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="absolute top-6 right-6 z-30">
        <p className="text-xs font-mono" style={{ color: "hsl(var(--foreground) / 0.4)" }}>
          {visitedTiles.size} / {TILES.length} discovered
        </p>
      </div>
    </div>
  );
};

export default GameBoard;
