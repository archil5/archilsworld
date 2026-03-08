import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { CHAPTERS } from "@/data/chapters";
import HexTile from "@/components/three/HexTile";
import BoardPath from "@/components/three/BoardPath";
import Particles from "@/components/three/Particles";
import GamePiece from "@/components/three/GamePiece";
import BoardSurface from "@/components/three/BoardSurface";
import CameraController from "@/components/three/CameraController";
import ChapterOverlay from "@/components/ChapterOverlay";
import WorldDive from "@/components/WorldDive";

const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set([0]));
  const [showOverlay, setShowOverlay] = useState(false);
  const [diveChapter, setDiveChapter] = useState<typeof CHAPTERS[0] | null>(null);
  const scrollRef = useRef(0);
  const targetScroll = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const isDiving = diveChapter !== null;

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
        setShowOverlay(false);
      }
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setShowOverlay(true), 800);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { if (!isDiving) touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDiving) return;
      e.preventDefault();
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      targetScroll.current += delta * 0.001;
      targetScroll.current = Math.max(0, Math.min(1, targetScroll.current));
      const idx = Math.round(targetScroll.current * (CHAPTERS.length - 1));
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        setVisitedSet(prev => new Set(prev).add(idx));
        setShowOverlay(false);
      }
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setShowOverlay(true), 800);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDiving) setDiveChapter(null);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKey);
    const t = setTimeout(() => setShowOverlay(true), 1500);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKey);
      clearTimeout(scrollTimeout.current);
      clearTimeout(t);
    };
  }, [activeIndex, isDiving]);

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
    targetScroll.current = index / (CHAPTERS.length - 1);
    setActiveIndex(index);
    setVisitedSet(prev => new Set(prev).add(index));
    setShowOverlay(false);
    setTimeout(() => setShowOverlay(true), 600);
  }, []);

  const handleDive = useCallback(() => {
    setDiveChapter(CHAPTERS[activeIndex]);
  }, [activeIndex]);

  const chapter = CHAPTERS[activeIndex];

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: "#080c12" }}>
      <Canvas
        shadows
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 8, 8] }}
        className="absolute inset-0"
        gl={{ antialias: true, toneMapping: 3 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} color="#b8cce8" />
          <directionalLight
            position={[10, 15, 5]}
            intensity={0.8}
            color="#a8c4e8"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[3, 3, -2]} intensity={0.5} color="#0078D4" distance={15} />
          <fog attach="fog" args={["#080c12", 8, 30]} />

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
            />
          ))}

          <GamePiece targetPosition={chapter.position} />
          <Particles count={150} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h1 className="font-display text-2xl md:text-3xl tracking-wide" style={{ color: "#e2e8f0" }}>
          Archil Patel
        </h1>
        <p className="font-body text-sm italic mt-0.5" style={{ color: "rgba(148,163,184,0.5)" }}>
          Principal Cloud Engineer · A Journey in Tiles
        </p>
      </div>

      {/* Scroll progress */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="w-0.5 rounded-full relative overflow-hidden" style={{ height: 200, background: "rgba(0,120,212,0.15)" }}>
          <div
            className="w-full rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%`, background: "linear-gradient(to bottom, #0078D4, #FF9900)" }}
          />
        </div>
        <p className="text-[10px] font-mono mt-2" style={{ color: "rgba(148,163,184,0.4)" }}>
          {activeIndex + 1}/{CHAPTERS.length}
        </p>
      </div>

      {/* Nav dots */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {CHAPTERS.map((ch, i) => (
          <button key={ch.id} className="group relative flex items-center" onClick={() => handleTileClick(i)}>
            <div
              className="w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                background: i === activeIndex ? ch.color : visitedSet.has(i) ? "rgba(148,163,184,0.5)" : "rgba(148,163,184,0.15)",
                boxShadow: i === activeIndex ? `0 0 10px ${ch.color}` : "none",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
            <span
              className="absolute left-5 whitespace-nowrap text-xs font-display tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2 py-1 rounded"
              style={{ color: "#e2e8f0", background: "rgba(8,12,18,0.9)", border: "1px solid rgba(148,163,184,0.2)" }}
            >
              {ch.brandLogo ? (
                <span className="font-bold mr-1" style={{ color: ch.color }}>{ch.brandLogo}</span>
              ) : null}
              {ch.label}
            </span>
          </button>
        ))}
      </div>

      <ChapterOverlay chapter={chapter} visible={showOverlay && !isDiving} onDive={handleDive} />

      {activeIndex === 0 && !showOverlay && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
          <p className="text-xs font-display tracking-[0.3em] uppercase" style={{ color: "rgba(148,163,184,0.5)" }}>
            Scroll to journey
          </p>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none" className="opacity-50">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="#0078D4" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2.5" fill="#0078D4">
              <animate attributeName="cy" values="8;18;8" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}

      <WorldDive chapter={diveChapter} onClose={() => setDiveChapter(null)} />
    </div>
  );
};

export default Experience;
