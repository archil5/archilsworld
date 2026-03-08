import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const fileSystem: Record<string, string[]> = {
  "C:\\>": ["Type HELP for commands", ""],
  "HELP": [
    "Available commands:",
    "  DIR        - List files",
    "  PLAY       - Run a game",
    "  THINK      - The big question",
    "  SKILLS     - What I learned",
    "  ABOUT      - My story",
    "",
  ],
  "DIR": [
    " Volume in drive C has no label.",
    " Directory of C:\\ARCHIL\\GAMES",
    "",
    " PRINCE    EXE    125,232  1989-10-03",
    " DOOM      EXE    266,240  1993-12-10",
    " WOLFENST  EXE    742,912  1992-05-05",
    " OREGON    EXE     64,128  1990-01-15",
    " LEMMINGS  EXE     98,304  1991-02-14",
    "",
    " 5 File(s)    1,196,816 bytes free",
    "",
  ],
  "PLAY": [
    "Loading PRINCE.EXE...",
    "████████████████████ 100%",
    "",
    "I didn't just play these games.",
    "I interrogated them.",
    "Every pixel. Every sound. Every menu screen.",
    "",
    "That question never went away.",
    "",
  ],
  "THINK": [
    "██████████████████████████████████████",
    "  HOW DID SOMEONE MAKE THIS?",
    "██████████████████████████████████████",
    "",
    "Loading CURIOSITY.SYS..........done.",
    "Initializing OBSESSION.DRV.....done.",
    "Running WHY_ENGINE v1.0........done.",
    "",
    "This question became the engine",
    "of everything that came after.",
    "",
  ],
  "SKILLS": [
    "┌─────────────────────────────────┐",
    "│  SKILLS UNLOCKED (Childhood)   │",
    "├─────────────────────────────────┤",
    "│  ✓ Curiosity        [████████] │",
    "│  ✓ Problem Solving   [███████] │",
    "│  ✓ Pattern Recognition [█████] │",
    "│  ✓ Persistence       [██████] │",
    "│  ✓ Self-Teaching     [███████] │",
    "└─────────────────────────────────┘",
    "",
    "VALUE: Learned that the best way",
    "to understand something is to",
    "take it apart and rebuild it.",
    "",
  ],
  "ABOUT": [
    "┌─ CHAPTER: The Kid Who Asked Why ─┐",
    "│                                   │",
    "│  Era: Childhood                   │",
    "│  Location: Home PC                │",
    "│  Tech: MS-DOS 6.22               │",
    "│  Hardware: 486DX, 4MB RAM        │",
    "│                                   │",
    "│  I wasn't just a consumer.        │",
    "│  I was a reverse engineer          │",
    "│  before I knew the word existed.  │",
    "└───────────────────────────────────┘",
    "",
  ],
};

const validCommands = Object.keys(fileSystem).filter(k => k !== "C:\\>");

const DosTerminalWorld = () => {
  const [history, setHistory] = useState<{ text: string; type: string }[]>([]);
  const [input, setInput] = useState("");
  const [cursorBlink, setCursorBlink] = useState(true);
  const [commandsUsed, setCommandsUsed] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const boot = [
      { text: "ARCHIL-DOS v1.0 — Personal History Terminal", type: "system" },
      { text: "Copyright (C) Archil's Memory Bank", type: "system" },
      { text: "", type: "blank" },
      { text: "Type HELP for available commands.", type: "output" },
      { text: "Or click 'Reveal All' to see everything at once.", type: "hint" },
      { text: "", type: "blank" },
    ];
    const timers = boot.map((line, i) =>
      setTimeout(() => setHistory(prev => [...prev, line]), 200 + i * 300)
    );
    const blink = setInterval(() => setCursorBlink(b => !b), 530);
    return () => { timers.forEach(clearTimeout); clearInterval(blink); };
  }, []);

  const executeCommand = useCallback((cmd: string) => {
    const upper = cmd.trim().toUpperCase();
    const newLines: { text: string; type: string }[] = [
      { text: `C:\\> ${cmd}`, type: "command" },
    ];
    if (fileSystem[upper]) {
      setCommandsUsed(prev => new Set(prev).add(upper));
      fileSystem[upper].forEach(line => {
        const type = line.startsWith("█") ? "highlight" :
                     line.startsWith("  ✓") ? "skill" :
                     line.startsWith("VALUE") ? "value" :
                     line.startsWith("│") || line.startsWith("┌") || line.startsWith("├") || line.startsWith("└") ? "box" :
                     "output";
        newLines.push({ text: line, type });
      });
    } else {
      newLines.push({ text: `Bad command or file name: '${cmd}'`, type: "error" });
      newLines.push({ text: "Type HELP for available commands.", type: "hint" });
    }
    setHistory(prev => [...prev, ...newLines]);
    setInput("");
  }, []);

  const handleRevealAll = () => {
    const allLines: { text: string; type: string }[] = [
      { text: "C:\\> REVEAL_ALL", type: "command" },
      { text: "", type: "blank" },
    ];
    validCommands.forEach(cmd => {
      allLines.push({ text: `═══ ${cmd} ═══`, type: "highlight" });
      fileSystem[cmd]?.forEach(line => {
        const type = line.startsWith("█") ? "highlight" :
                     line.startsWith("  ✓") ? "skill" :
                     line.startsWith("VALUE") ? "value" :
                     line.startsWith("│") || line.startsWith("┌") || line.startsWith("├") || line.startsWith("└") ? "box" :
                     "output";
        allLines.push({ text: line, type });
      });
    });
    setCommandsUsed(new Set(validCommands));
    setHistory(prev => [...prev, ...allLines]);
  };

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [history]);

  const getColor = (type: string) => {
    switch (type) {
      case "command": return "#2d2a26";
      case "output": return "#2a7d4f";
      case "highlight": return "#b5653a";
      case "system": return "#3d7aaf";
      case "hint": return "#8a8078";
      case "error": return "#c44040";
      case "skill": return "#3d7aaf";
      case "value": return "#b5653a";
      case "box": return "#6b6560";
      default: return "#8a8078";
    }
  };

  const progress = Math.round((commandsUsed.size / validCommands.length) * 100);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <span className="text-[10px] font-mono" style={{ color: "#3d7aaf" }}>
            DISCOVERY: {commandsUsed.size}/{validCommands.length}
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(61,122,175,0.1)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "#3d7aaf" }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
          {progress < 100 && (
            <button onClick={handleRevealAll}
              className="text-[10px] font-mono px-3 py-1 rounded cursor-pointer transition-all"
              style={{ color: "#b5653a", background: "rgba(181,101,58,0.08)", border: "1px solid rgba(181,101,58,0.2)" }}>
              ⚡ Reveal All
            </button>
          )}
          {progress === 100 && (
            <motion.span className="text-[10px] font-mono" style={{ color: "#b5653a" }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}>★ COMPLETE</motion.span>
          )}
        </motion.div>

        <motion.div className="rounded-xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{ background: "#1e1e1e", border: "1px solid #e0d8cc",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
          onClick={() => inputRef.current?.focus()}>
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#282828", borderBottom: "1px solid #3a3a3a" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            <span className="ml-2 text-xs font-mono" style={{ color: "#888" }}>ARCHIL-DOS — Interactive Terminal</span>
          </div>

          <div ref={containerRef} className="p-6 font-mono text-sm leading-relaxed overflow-y-auto"
            style={{ height: 400, background: "#1e1e1e" }}>
            {history.map((line, i) => (
              <div key={i} className="min-h-[1.4em]">
                <span style={{ color: getColor(line.type),
                  textShadow: line.type === "highlight" ? "0 0 6px rgba(181,101,58,0.3)" : undefined,
                  fontStyle: line.type === "value" ? "italic" : undefined }}>
                  {line.text}
                </span>
              </div>
            ))}
            <div className="flex items-center min-h-[1.4em]">
              <span style={{ color: "#888" }}>C:\&gt;&nbsp;</span>
              <input ref={inputRef} value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) executeCommand(input); }}
                className="bg-transparent border-none outline-none font-mono text-sm flex-1"
                style={{ color: "#e0e0e0", caretColor: "#28c840" }} autoFocus spellCheck={false} />
              {cursorBlink && !input && <span className="inline-block w-2 h-4" style={{ background: "#28c840" }} />}
            </div>
          </div>
        </motion.div>

        <motion.div className="flex flex-wrap gap-2 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          {validCommands.map(cmd => (
            <button key={cmd} onClick={() => executeCommand(cmd)}
              className="text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all"
              style={{
                color: commandsUsed.has(cmd) ? "#2a7d4f" : "rgba(42,125,79,0.5)",
                background: commandsUsed.has(cmd) ? "rgba(42,125,79,0.08)" : "rgba(42,125,79,0.04)",
                border: `1px solid ${commandsUsed.has(cmd) ? "rgba(42,125,79,0.25)" : "rgba(42,125,79,0.1)"}`,
                textDecoration: commandsUsed.has(cmd) ? "line-through" : "none",
              }}>
              {cmd}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DosTerminalWorld;
