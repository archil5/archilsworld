import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { brandLogos, careerLogos, chapterImages } from "@/data/brandLogos";
import HexTile from "@/components/three/HexTile";
import BoardPath from "@/components/three/BoardPath";
import Particles from "@/components/three/Particles";
import BoardSurface from "@/components/three/BoardSurface";
import CameraController from "@/components/three/CameraController";
import WorldDive from "@/components/WorldDive";

/* ═══════════════════════════════════════════════════════════
   TILE POPUP — small cloud/tooltip to explore a world
   ═══════════════════════════════════════════════════════════ */

const TilePopup = ({
  chapter,
  visible,
  onDive,
}: {
  chapter: typeof CHAPTERS[0];
  visible: boolean;
  onDive: () => void;
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key={chapter.id}
        className="absolute z-40 pointer-events-auto"
        style={{ bottom: 100, left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <div
          className="relative rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg backdrop-blur-sm"
          style={{
            background: "rgba(254,252,249,0.96)",
            border: `1.5px solid ${chapter.color}30`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px ${chapter.color}10`,
            minWidth: 280,
          }}
        >
          {/* Tail / arrow pointing down */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45"
            style={{
              background: "rgba(254,252,249,0.96)",
              borderRight: `1.5px solid ${chapter.color}30`,
              borderBottom: `1.5px solid ${chapter.color}30`,
            }}
          />

          {/* Icon / image */}
          <div className="flex-shrink-0">
            {chapter.image && chapterImages[chapter.image] ? (
              <img
                src={chapterImages[chapter.image]}
                alt={chapter.label}
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: `2px solid ${chapter.color}35` }}
              />
            ) : chapter.brandLogo === "Career" ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-1 rounded" style={{ background: `${chapter.color}08` }}>
                <img src={careerLogos.RBC} alt="RBC" className="h-4 object-contain" />
                <img src={careerLogos.BMO} alt="BMO" className="h-4 object-contain" />
              </span>
            ) : chapter.brandLogo && brandLogos[chapter.brandLogo] ? (
              <span className="inline-flex items-center px-1.5 py-1 rounded" style={{ background: `${chapter.color}08` }}>
                <img src={brandLogos[chapter.brandLogo]} alt={chapter.brandLogo} className="h-5 object-contain" />
              </span>
            ) : (
              <span className="text-2xl">{chapter.icon}</span>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-bold truncate" style={{ color: "#2d2a26" }}>
              {chapter.title}
            </p>
            <p className="text-[10px] font-mono mt-0.5 truncate" style={{ color: "#6b6560" }}>
              {chapter.subtitle}
            </p>
          </div>

          {/* Explore button */}
          <motion.button
            onClick={onDive}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl cursor-pointer font-display text-xs tracking-wide"
            style={{
              background: `${chapter.color}15`,
              border: `1px solid ${chapter.color}30`,
              color: chapter.color,
            }}
            whileHover={{ scale: 1.06, background: `${chapter.color}25` }}
            whileTap={{ scale: 0.95 }}
          >
            Explore
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              →
            </motion.span>
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════════
   MAIN EXPERIENCE
   ═══════════════════════════════════════════════════════════ */

const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set([0]));
  const [showPopup, setShowPopup] = useState(false);
  const [diveChapter, setDiveChapter] = useState<typeof CHAPTERS[0] | null>(null);
  const scrollRef = useRef(0);
  const targetScroll = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const isDiving = diveChapter !== null;

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    targetScroll.current = clamped / (CHAPTERS.length - 1);
    setActiveIndex(clamped);
    setVisitedSet(prev => new Set(prev).add(clamped));
    setShowPopup(false);
    setTimeout(() => setShowPopup(true), 600);
  }, []);

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isDiving) return;
      e.preventDefault();
      targetScroll.current += e.deltaY * 0.0003;
      targetScroll.current = Math.max(0, Math.min(1, targetScroll.current));
      const idx = Math.round(targetScroll.current * (CHAPTERS.length - 1));
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        setVisitedSet(prev => new Set(prev).add(idx));
        setShowPopup(false);
      }
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setShowPopup(true), 800);
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let swiped = false;
    const SWIPE_THRESHOLD = 50;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDiving) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swiped = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDiving || swiped) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;

      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
        e.preventDefault();
        swiped = true;
        if (dx < 0) {
          goTo(activeIndex + 1);
        } else {
          goTo(activeIndex - 1);
        }
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDiving) { setDiveChapter(null); return; }
      if (isDiving) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(activeIndex + 1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(activeIndex - 1); }
      if (e.key === "Enter") { setDiveChapter(CHAPTERS[activeIndex]); }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKey);
    const t = setTimeout(() => setShowPopup(true), 1500);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKey);
      clearTimeout(scrollTimeout.current);
      clearTimeout(t);
    };
  }, [activeIndex, isDiving, goTo]);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      scrollRef.current += (targetScroll.current - scrollRef.current) * 0.08;
      setScrollProgress(scrollRef.current);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleTileClick = useCallback((index: number) => {
    goTo(index);
  }, [goTo]);

  const handleDive = useCallback(() => {
    setDiveChapter(CHAPTERS[activeIndex]);
  }, [activeIndex]);

  const chapter = CHAPTERS[activeIndex];

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: "#f5f0e8" }}>
      <Canvas
        shadows
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 8, 8] }}
        className="absolute inset-0"
        style={{ visibility: isDiving ? "hidden" : "visible" }}
        gl={{ antialias: true, toneMapping: 3 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} color="#faf5ee" />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.2}
            color="#fff5e6"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[3, 3, -2]} intensity={0.3} color="#c8956c" distance={15} />
          <fog attach="fog" args={["#f5f0e8", 12, 35]} />

          <CameraController scrollProgress={scrollProgress} activeIndex={activeIndex} />
          <BoardSurface />
          <BoardPath chapters={CHAPTERS} />

          {CHAPTERS.map((ch, i) => (
            <HexTile
              key={ch.id}
              position={ch.position}
              color={ch.color}
              isActive={i === activeIndex}
              isVisited={visitedSet.has(i)}
              onClick={() => handleTileClick(i)}
              index={i}
              icon={ch.icon}
              label={ch.label}
              brandLogo={ch.brandLogo}
              image={ch.image}
            />
          ))}

          <Particles count={150} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h1 className="font-display text-2xl md:text-3xl tracking-wide" style={{ color: "#2d2a26" }}>
          Archil Patel
        </h1>
        <p className="font-body text-sm italic mt-0.5" style={{ color: "#6b6560" }}>
          Principal Cloud Engineer · A Journey in Tiles
        </p>
      </div>

      {/* Single bottom navigation bar */}
      {!isDiving && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <motion.button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-20 disabled:cursor-default"
            style={{
              background: "rgba(245,240,232,0.9)",
              border: "1px solid rgba(180,140,100,0.25)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              color: "#2d2a26",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} />
          </motion.button>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full" style={{
            background: "rgba(245,240,232,0.95)",
            border: "1px solid rgba(180,140,100,0.2)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}>
            {CHAPTERS.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => goTo(i)}
                className="relative group transition-all duration-300 cursor-pointer rounded-full flex items-center justify-center"
                style={{
                  width: i === activeIndex ? 32 : 10,
                  height: 10,
                  background: i === activeIndex ? ch.color : visitedSet.has(i) ? "rgba(107,101,96,0.45)" : "rgba(107,101,96,0.15)",
                  boxShadow: i === activeIndex ? `0 0 10px ${ch.color}60` : "none",
                }}
                title={ch.label}
              >
                {/* Hover label */}
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-display tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2 py-0.5 rounded"
                  style={{
                    color: "#2d2a26",
                    background: "rgba(245,240,232,0.95)",
                    border: "1px solid rgba(180,140,100,0.2)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  {ch.label}
                </span>
              </button>
            ))}
          </div>

          {/* Step counter */}
          <span className="text-[10px] font-mono px-2 py-1 rounded-full" style={{
            color: "#6b6560",
            background: "rgba(245,240,232,0.9)",
            border: "1px solid rgba(180,140,100,0.15)",
          }}>
            {activeIndex + 1}/{CHAPTERS.length}
          </span>

          <motion.button
            onClick={goNext}
            disabled={activeIndex === CHAPTERS.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-20 disabled:cursor-default"
            style={{
              background: "rgba(245,240,232,0.9)",
              border: "1px solid rgba(180,140,100,0.25)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              color: "#2d2a26",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      )}

      {/* Tile popup — small cloud near bottom center */}
      <TilePopup chapter={chapter} visible={showPopup && !isDiving} onDive={handleDive} />

      {activeIndex === 0 && !showPopup && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
          <p className="text-xs font-display tracking-[0.3em] uppercase" style={{ color: "#6b6560" }}>
            Scroll or use arrows
          </p>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none" className="opacity-50">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="#b5653a" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2.5" fill="#b5653a">
              <animate attributeName="cy" values="8;18;8" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}

      {/* Keyboard hint */}
      {!isDiving && (
        <div className="absolute top-6 right-8 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: "rgba(107,101,96,0.4)" }}>
            <span className="px-1.5 py-0.5 rounded" style={{ border: "1px solid rgba(107,101,96,0.2)" }}>←→</span>
            navigate
            <span className="px-1.5 py-0.5 rounded ml-2" style={{ border: "1px solid rgba(107,101,96,0.2)" }}>Enter</span>
            dive in
          </div>
        </div>
      )}

      <WorldDive chapter={diveChapter} onClose={() => setDiveChapter(null)} />
    </div>
  );
};

export default Experience;
