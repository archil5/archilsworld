import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAPTERS } from "@/data/chapters";
import HexTile from "@/components/three/HexTile";
import BoardPath from "@/components/three/BoardPath";
import Particles from "@/components/three/Particles";
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
  const [diveAnimating, setDiveAnimating] = useState(false);
  const scrollRef = useRef(0);
  const targetScroll = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const isDiving = diveChapter !== null;
  const skipPopState = useRef(false);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    targetScroll.current = clamped / (CHAPTERS.length - 1);
    setActiveIndex(clamped);
    setVisitedSet(prev => new Set(prev).add(clamped));
    setShowOverlay(false);
    setTimeout(() => setShowOverlay(true), 600);
    skipPopState.current = true;
    window.history.pushState({ tile: clamped }, "");
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
        setShowOverlay(false);
      }
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setShowOverlay(true), 800);
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
        if (dx < 0) goTo(activeIndex + 1);
        else goTo(activeIndex - 1);
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
    const t = setTimeout(() => setShowOverlay(true), 1500);

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
    window.history.replaceState({ tile: 0 }, "");

    const handlePopState = (e: PopStateEvent) => {
      if (skipPopState.current) {
        skipPopState.current = false;
        return;
      }
      if (diveChapter !== null) {
        setDiveChapter(null);
        window.history.pushState({ tile: activeIndex }, "");
        return;
      }
      if (e.state && typeof e.state.tile === "number") {
        const idx = e.state.tile;
        targetScroll.current = idx / (CHAPTERS.length - 1);
        setActiveIndex(idx);
        setVisitedSet(prev => new Set(prev).add(idx));
        setShowOverlay(false);
        setTimeout(() => setShowOverlay(true), 600);
      } else if (activeIndex > 0) {
        const prev = activeIndex - 1;
        targetScroll.current = prev / (CHAPTERS.length - 1);
        setActiveIndex(prev);
        setShowOverlay(false);
        setTimeout(() => setShowOverlay(true), 600);
        window.history.pushState({ tile: prev }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeIndex, diveChapter]);

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
    setDiveAnimating(true);
    window.history.pushState({ tile: activeIndex, dive: true }, "");
    setTimeout(() => {
      setDiveChapter(CHAPTERS[activeIndex]);
      setDiveAnimating(false);
    }, 700);
  }, [activeIndex]);

  const chapter = CHAPTERS[activeIndex];

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: "#F8FAFC" }}>
      {/* Dive zoom */}
      <motion.div
        className="absolute inset-0"
        animate={diveAnimating ? { scale: [1, 2.5], opacity: [1, 0] } : { scale: 1, opacity: 1 }}
        transition={diveAnimating ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      >
      <Canvas
        shadows
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 8, 8] }}
        className="absolute inset-0"
        style={{ visibility: isDiving ? "hidden" : "visible" }}
        gl={{ antialias: true, toneMapping: 3 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} color="#f0f4f8" />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.1}
            color="#f8fafc"
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
          <fog attach="fog" args={["#F8FAFC", 12, 35]} />

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
              showExplore={i === activeIndex && showOverlay && !isDiving}
              onExplore={handleDive}
              exploreHint={ch.exploreHint}
            />
          ))}

          <Particles count={150} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
      </motion.div>

      {/* Dive flash */}
      <AnimatePresence>
        {diveAnimating && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${chapter.color}, #E8E0D0)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Title — top left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-20 pointer-events-none">
        <h1 className="font-display text-display-sm md:text-display-md tracking-wider" style={{ color: "#0F172A" }}>
          Archil Patel
        </h1>
        <p className="font-mono text-mono-xs mt-1 hidden sm:block" style={{ color: "#64748B" }}>
          Principal Cloud Engineer · A Journey in Tiles
        </p>
      </div>

      {/* Bottom nav */}
      {!isDiving && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <motion.button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-all disabled:opacity-15 disabled:cursor-default"
            style={{
              background: "hsl(222 47% 11% / 0.06)",
              border: "1px solid hsl(222 47% 11% / 0.12)",
              color: "#0F172A",
            }}
            whileHover={{ background: "hsl(222 47% 11% / 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </motion.button>

          <div className="flex items-center gap-2 px-4 py-2.5" style={{
            background: "hsl(210 40% 98% / 0.9)",
            border: "1px solid hsl(222 47% 11% / 0.08)",
          }}>
            {CHAPTERS.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => goTo(i)}
                className="relative group transition-all duration-300"
                style={{
                  width: i === activeIndex ? 20 : 6,
                  height: 6,
                  background: i === activeIndex ? ch.color : visitedSet.has(i) ? "hsl(222 47% 11% / 0.5)" : "hsl(222 47% 11% / 0.15)",
                }}
                title={ch.label}
              >
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-mono-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2 py-0.5 hidden md:block"
                  style={{
                    color: "#0F172A",
                    background: "hsl(210 40% 98% / 0.95)",
                    border: "1px solid hsl(222 47% 11% / 0.08)",
                  }}
                >
                  {ch.label}
                </span>
              </button>
            ))}
          </div>

          <span className="font-mono text-mono-xs px-2 py-1" style={{
            color: "#64748B",
            background: "hsl(210 40% 98% / 0.8)",
            border: "1px solid hsl(222 47% 11% / 0.06)",
          }}>
            {activeIndex + 1}/{CHAPTERS.length}
          </span>

          <motion.button
            onClick={goNext}
            disabled={activeIndex === CHAPTERS.length - 1}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-all disabled:opacity-15 disabled:cursor-default"
            style={{
              background: "hsl(222 47% 11% / 0.06)",
              border: "1px solid hsl(222 47% 11% / 0.12)",
              color: "#0F172A",
            }}
            whileHover={{ background: "hsl(222 47% 11% / 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </motion.button>
        </div>
      )}

      {/* Chapter overlay */}
      <ChapterOverlay chapter={chapter} visible={showOverlay && !isDiving} onDive={handleDive} />

      {activeIndex === 0 && !showOverlay && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
          <p className="font-mono text-mono-xs tracking-[0.3em] uppercase" style={{ color: "#64748B" }}>
            Swipe or tap arrows
          </p>
        </div>
      )}

      {/* Keyboard hint */}
      {!isDiving && (
        <div className="absolute top-6 right-6 md:top-8 md:right-10 z-20 pointer-events-none hidden md:block">
          <div className="flex items-center gap-2 font-mono text-mono-xs" style={{ color: "hsl(215 16% 47% / 0.3)" }}>
            <span className="px-1.5 py-0.5" style={{ border: "1px solid hsl(215 16% 47% / 0.15)" }}>←→</span>
            navigate
            <span className="px-1.5 py-0.5 ml-2" style={{ border: "1px solid hsl(215 16% 47% / 0.15)" }}>Enter</span>
            dive in
          </div>
        </div>
      )}

      <WorldDive chapter={diveChapter} onClose={() => setDiveChapter(null)} />
    </div>
  );
};

export default Experience;