import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const lines = [
  { text: "C:\\>", delay: 0, type: "prompt" as const },
  { text: "dir ARCHIL\\GAMES", delay: 400, type: "command" as const },
  { text: "", delay: 800, type: "blank" as const },
  { text: " Volume in drive C has no label.", delay: 900, type: "output" as const },
  { text: " Directory of C:\\ARCHIL\\GAMES", delay: 1100, type: "output" as const },
  { text: "", delay: 1300, type: "blank" as const },
  { text: " PRINCE    EXE    125,232  1989-10-03", delay: 1500, type: "output" as const },
  { text: " DOOM      EXE    266,240  1993-12-10", delay: 1700, type: "output" as const },
  { text: " WOLFENST  EXE    742,912  1992-05-05", delay: 1900, type: "output" as const },
  { text: " OREGON    EXE     64,128  1990-01-15", delay: 2100, type: "output" as const },
  { text: "", delay: 2400, type: "blank" as const },
  { text: "C:\\>", delay: 2600, type: "prompt" as const },
  { text: "THINK.EXE /QUESTION", delay: 2800, type: "command" as const },
  { text: "", delay: 3200, type: "blank" as const },
  { text: "██████████████████████████████████████", delay: 3400, type: "highlight" as const },
  { text: "  HOW DID SOMEONE MAKE THIS?", delay: 3600, type: "highlight" as const },
  { text: "██████████████████████████████████████", delay: 3800, type: "highlight" as const },
  { text: "", delay: 4200, type: "blank" as const },
  { text: "Loading CURIOSITY.SYS..........done.", delay: 4400, type: "system" as const },
  { text: "Initializing OBSESSION.DRV.....done.", delay: 4800, type: "system" as const },
  { text: "Running WHY_ENGINE v1.0........done.", delay: 5200, type: "system" as const },
  { text: "", delay: 5600, type: "blank" as const },
  { text: "I didn't just play these games.", delay: 5800, type: "story" as const },
  { text: "I interrogated them.", delay: 6200, type: "story" as const },
  { text: "Every pixel. Every sound.", delay: 6600, type: "story" as const },
  { text: "Every menu screen.", delay: 7000, type: "story" as const },
  { text: "", delay: 7400, type: "blank" as const },
  { text: "That question never went away.", delay: 7600, type: "story" as const },
  { text: "It just got bigger.", delay: 8000, type: "story" as const },
  { text: "It became the engine of everything.", delay: 8400, type: "story" as const },
];

const DosTerminalWorld = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [cursorBlink, setCursorBlink] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    const blinkInterval = setInterval(() => setCursorBlink((b) => !b), 530);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(blinkInterval);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const getColor = (type: string) => {
    switch (type) {
      case "prompt": return "#aaaaaa";
      case "command": return "#ffffff";
      case "output": return "#55ff55";
      case "highlight": return "#ffff55";
      case "system": return "#55ffff";
      case "story": return "#ff9955";
      default: return "#888888";
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{
          background: "#0a0a0a",
          border: "2px solid #333",
          boxShadow: "0 0 60px rgba(0,255,0,0.1), inset 0 0 100px rgba(0,0,0,0.5)",
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#1a1a2e", borderBottom: "1px solid #333" }}>
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs font-mono text-gray-500">MS-DOS Prompt — ARCHIL.EXE</span>
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          className="p-6 font-mono text-sm leading-relaxed overflow-y-auto"
          style={{ height: 420, background: "linear-gradient(180deg, #0a0a0a, #0f0f1a)" }}
        >
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="min-h-[1.4em]">
              {line.type === "prompt" ? (
                <span style={{ color: "#aaaaaa" }}>
                  {line.text}
                  {i === visibleLines - 1 && cursorBlink && (
                    <span className="inline-block w-2 h-4 ml-1 align-middle" style={{ background: "#55ff55" }} />
                  )}
                </span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    color: getColor(line.type),
                    textShadow: line.type === "highlight" ? "0 0 10px rgba(255,255,85,0.5)" : undefined,
                    fontSize: line.type === "story" ? "15px" : undefined,
                    fontStyle: line.type === "story" ? "italic" : undefined,
                  }}
                >
                  {line.text}
                </motion.span>
              )}
            </div>
          ))}
          {visibleLines >= lines.length && cursorBlink && (
            <div>
              <span style={{ color: "#aaaaaa" }}>C:\&gt;</span>
              <span className="inline-block w-2 h-4 ml-1 align-middle" style={{ background: "#55ff55" }} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DosTerminalWorld;
