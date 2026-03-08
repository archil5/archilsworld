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

const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set([0]));
  const [showOverlay, setShowOverlay] = useState(false);
  const scrollRef = useRef(0);
  const targetScroll = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Handle scroll / wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScroll.current += e.deltaY * 0.0003;
      targetScroll.current = Math.max(0, Math.min(1, targetScroll.current));

      // Calculate active index from scroll
      const idx = Math.round(targetScroll.current * (CHAPTERS.length - 1));
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        setVisitedSet((prev) => new Set(prev).add(idx));
        setShowOverlay(false);
      }

      // Show overlay after settling
      clearTimeout(scrollTimeout.current);
      isScrolling.current = true;
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        setShowOverlay(true);
      }, 800);
    };

    // Touch handling
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      targetScroll.current += delta * 0.001;
      targetScroll.current = Math.max(0, Math.min(1, targetScroll.current));

      const idx = Math.round(targetScroll.current * (CHAPTERS.length - 1));
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        setVisitedSet((prev) => new Set(prev).add(idx));
        setShowOverlay(false);
      }

      clearTimeout(scrollTimeout.current);
      isScrolling.current = true;
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        setShowOverlay(true);
      }, 800);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Show initial overlay
    const t = setTimeout(() => setShowOverlay(true), 1500);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(scrollTimeout.current);
      clearTimeout(t);
    };
  }, [activeIndex]);

  // Smooth scroll interpolation
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

  const handleTileClick = useCallback(
    (index: number) => {
      targetScroll.current = index / (CHAPTERS.length - 1);
      setActiveIndex(index);
      setVisitedSet((prev) => new Set(prev).add(index));
      setShowOverlay(false);
      setTimeout(() => setShowOverlay(true), 600);
    },
    []
  );

  const chapter = CHAPTERS[activeIndex];

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: "#1a130b" }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 8, 8] }}
        className="absolute inset-0"
        gl={{ antialias: true, toneMapping: 3 }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.15} color="#ffecd2" />
          <directionalLight
            position={[10, 15, 5]}
            intensity={0.8}
            color="#ffe4b5"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[3, 3, -2]} intensity={0.5} color="#ff9944" distance={15} />

          {/* Fog */}
          <fog attach="fog" args={["#1a130b", 8, 30]} />

          {/* Camera */}
          <CameraController scrollProgress={scrollProgress} activeIndex={activeIndex} />

          {/* Board surface */}
          <BoardSurface />

          {/* Path */}
          <BoardPath chapters={CHAPTERS} />

          {/* Tiles */}
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

          {/* Game piece */}
          <GamePiece targetPosition={chapter.position} />

          {/* Particles */}
          <Particles count={150} />

          <Environment preset="sunset" />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h1 className="font-display text-2xl md:text-3xl tracking-wide" style={{ color: "#e8c460" }}>
          Archil Patel
        </h1>
        <p className="font-body text-sm italic mt-0.5" style={{ color: "rgba(232,196,96,0.4)" }}>
          Principal Cloud Engineer · A Journey in Tiles
        </p>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-0">
        <div
          className="w-0.5 rounded-full relative overflow-hidden"
          style={{ height: 200, background: "rgba(232,196,96,0.15)" }}
        >
          <div
            className="w-full rounded-full transition-all duration-300"
            style={{
              height: `${scrollProgress * 100}%`,
              background: "linear-gradient(to bottom, #e8c460, #d4883a)",
            }}
          />
        </div>
        <p className="text-[10px] font-mono mt-2" style={{ color: "rgba(232,196,96,0.4)" }}>
          {activeIndex + 1}/{CHAPTERS.length}
        </p>
      </div>

      {/* Tile navigation dots */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {CHAPTERS.map((ch, i) => (
          <button
            key={ch.id}
            className="group relative flex items-center"
            onClick={() => handleTileClick(i)}
          >
            <div
              className="w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                background: i === activeIndex ? ch.color : visitedSet.has(i) ? "rgba(232,196,96,0.5)" : "rgba(232,196,96,0.15)",
                boxShadow: i === activeIndex ? `0 0 10px ${ch.color}` : "none",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
            <span
              className="absolute left-5 whitespace-nowrap text-xs font-display tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2 py-1 rounded"
              style={{
                color: "#e8c460",
                background: "rgba(26,19,11,0.9)",
                border: "1px solid rgba(232,196,96,0.2)",
              }}
            >
              {ch.label}
            </span>
          </button>
        ))}
      </div>

      {/* Chapter info overlay */}
      <ChapterOverlay chapter={chapter} visible={showOverlay} />

      {/* Scroll hint */}
      {activeIndex === 0 && !showOverlay && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
          <p className="text-xs font-display tracking-[0.3em] uppercase" style={{ color: "rgba(232,196,96,0.5)" }}>
            Scroll to journey
          </p>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none" className="opacity-50">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="#e8c460" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2.5" fill="#e8c460">
              <animate attributeName="cy" values="8;18;8" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Experience;
