import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { brandLogos, careerLogos, chapterImages } from "@/data/brandLogos";
import HexTile from "@/components/three/HexTile";
import BoardPath from "@/components/three/BoardPath";
import Particles from "@/components/three/Particles";
import BoardSurface from "@/components/three/BoardSurface";
import CameraController from "@/components/three/CameraController";
import ChapterOverlay from "@/components/ChapterOverlay";
import WorldDive from "@/components/WorldDive";
import { useProgressiveTheme } from "@/hooks/useProgressiveTheme";

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
  const theme = useProgressiveTheme(activeIndex, CHAPTERS.length);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    targetScroll.current = clamped / (CHAPTERS.length - 1);
    setActiveIndex(clamped);
    setVisitedSet(prev => new Set(prev).add(clamped));
    setShowOverlay(false);
    setTimeout(() => setShowOverlay(true), 600);
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

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
        e.preventDefault();
        swiped = true;
        if (dx < 0) {
          goTo(activeIndex + 1); // swipe left → next
        } else {
          goTo(activeIndex - 1); // swipe right → prev
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

  // Determine the theme index of the chapter being dived into
  const diveThemeIndex = diveChapter ? CHAPTERS.findIndex(c => c.id === diveChapter.id) : activeIndex;

  // Lamp light intensity: bright at tile 0, fades to 0 by last tile
  const lampIntensity = 1 - activeIndex / (CHAPTERS.length - 1);

  return (
    <div
      className="w-screen h-screen relative overflow-hidden transition-colors duration-700"
      style={{ background: theme.bg }}
    >
      {/* Lamp light effect - warm radial glow from top-left */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: lampIntensity,
          background: `
            radial-gradient(ellipse 80% 70% at 5% 0%, rgba(255,220,160,${0.35 * lampIntensity}) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 0% 10%, rgba(255,200,120,${0.2 * lampIntensity}) 0%, transparent 50%),
            radial-gradient(ellipse 120% 100% at 10% -10%, rgba(255,240,200,${0.12 * lampIntensity}) 0%, transparent 70%)
          `,
        }}
      />
      {/* Subtle light rays */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: lampIntensity * 0.5,
          background: `
            linear-gradient(135deg, rgba(255,220,160,${0.08 * lampIntensity}) 0%, transparent 40%),
            linear-gradient(150deg, rgba(255,200,120,${0.05 * lampIntensity}) 0%, transparent 35%)
          `,
        }}
      />
      <Canvas
        shadows
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 8, 8] }}
        className="absolute inset-0"
        style={{ visibility: isDiving ? "hidden" : "visible" }}
        gl={{ antialias: true, toneMapping: 3 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={theme.ambientIntensity} color="#faf5ee" />
          <directionalLight
            position={[10, 15, 5]}
            intensity={theme.directionalIntensity}
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
          <pointLight position={[3, 3, -2]} intensity={theme.isDark ? 0.5 : 0.3} color="#c8956c" distance={15} />
          <fog attach="fog" args={[theme.fog, 12, 35]} />

          <CameraController scrollProgress={scrollProgress} activeIndex={activeIndex} />
          <BoardSurface groundColor={theme.ground} hexColor={theme.hexGrid} />
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

          <Particles count={150} color={theme.particle} opacity={theme.particleOpacity} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h1 className="font-display text-2xl md:text-3xl tracking-wide transition-colors duration-700" style={{ color: theme.text }}>
          Archil Patel
        </h1>
        <p className="font-body text-sm italic mt-0.5 transition-colors duration-700" style={{ color: theme.textMuted }}>
          Principal Cloud Engineer · A Journey in Tiles
        </p>
      </div>

      {/* Navigation arrows */}
      {!isDiving && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <motion.button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-20 disabled:cursor-default"
            style={{
              background: theme.uiBg,
              border: `1px solid ${theme.uiBorder}`,
              boxShadow: `0 2px 10px ${theme.uiShadow}`,
              color: theme.text,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} />
          </motion.button>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-full" style={{
            background: theme.uiBg,
            border: `1px solid ${theme.uiBorder}`,
            boxShadow: `0 2px 10px ${theme.uiShadow}`,
          }}>
            {CHAPTERS.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => goTo(i)}
                className="transition-all duration-300 cursor-pointer rounded-full"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  background: i === activeIndex ? ch.color : visitedSet.has(i)
                    ? (theme.isDark ? "rgba(200,190,180,0.4)" : "rgba(107,101,96,0.4)")
                    : (theme.isDark ? "rgba(200,190,180,0.15)" : "rgba(107,101,96,0.15)"),
                  boxShadow: i === activeIndex ? `0 0 8px ${ch.color}50` : "none",
                }}
                title={ch.label}
              />
            ))}
          </div>

          <motion.button
            onClick={goNext}
            disabled={activeIndex === CHAPTERS.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-20 disabled:cursor-default"
            style={{
              background: theme.uiBg,
              border: `1px solid ${theme.uiBorder}`,
              boxShadow: `0 2px 10px ${theme.uiShadow}`,
              color: theme.text,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      )}

      {/* Scroll progress */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="w-0.5 rounded-full relative overflow-hidden" style={{
          height: 200,
          background: theme.isDark ? "rgba(181,101,58,0.2)" : "rgba(180,140,100,0.15)",
        }}>
          <div
            className="w-full rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%`, background: "linear-gradient(to bottom, #b5653a, #d4a574)" }}
          />
        </div>
        <p className="text-[10px] font-mono mt-2 transition-colors duration-700" style={{ color: theme.textMuted }}>
          {activeIndex + 1}/{CHAPTERS.length}
        </p>
      </div>

      {/* Nav dots - left side */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {CHAPTERS.map((ch, i) => (
          <button key={ch.id} className="group relative flex items-center" onClick={() => goTo(i)}>
            <div
              className="w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                background: i === activeIndex ? ch.color : visitedSet.has(i)
                  ? (theme.isDark ? "rgba(200,190,180,0.5)" : "rgba(107,101,96,0.5)")
                  : (theme.isDark ? "rgba(200,190,180,0.2)" : "rgba(107,101,96,0.2)"),
                boxShadow: i === activeIndex ? `0 0 10px ${ch.color}60` : "none",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
            <span
              className="absolute left-5 whitespace-nowrap text-xs font-display tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2 py-1 rounded flex items-center gap-2"
              style={{
                color: theme.text,
                background: theme.uiBg,
                border: `1px solid ${theme.uiBorder}`,
                boxShadow: `0 2px 8px ${theme.uiShadow}`,
              }}
            >
              {ch.image && chapterImages[ch.image] ? (
                <img src={chapterImages[ch.image]} alt={ch.label} className="h-4 w-4 rounded-full object-cover" />
              ) : ch.brandLogo === "Career" ? (
                <>
                  <img src={careerLogos.RBC} alt="RBC" className="h-3.5 object-contain" />
                  <img src={careerLogos.BMO} alt="BMO" className="h-3.5 object-contain" />
                </>
              ) : ch.brandLogo && brandLogos[ch.brandLogo] ? (
                <img src={brandLogos[ch.brandLogo]} alt={ch.brandLogo} className="h-3.5 object-contain" />
              ) : null}
              {ch.label}
            </span>
          </button>
        ))}
      </div>

      <ChapterOverlay chapter={chapter} visible={showOverlay && !isDiving} onDive={handleDive} theme={theme} />

      {activeIndex === 0 && !showOverlay && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
          <p className="text-xs font-display tracking-[0.3em] uppercase" style={{ color: theme.textMuted }}>
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
          <div className="flex items-center gap-1.5 text-[9px] font-mono transition-colors duration-700" style={{ color: theme.textFaint }}>
            <span className="px-1.5 py-0.5 rounded" style={{ border: `1px solid ${theme.uiBorder}` }}>←→</span>
            navigate
            <span className="px-1.5 py-0.5 rounded ml-2" style={{ border: `1px solid ${theme.uiBorder}` }}>Enter</span>
            dive in
          </div>
        </div>
      )}

      <WorldDive chapter={diveChapter} onClose={() => setDiveChapter(null)} themeIndex={diveThemeIndex} totalChapters={CHAPTERS.length} />
    </div>
  );
};

export default Experience;
