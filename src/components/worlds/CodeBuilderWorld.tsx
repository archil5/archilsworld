import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const htmlLines = [
  '<!DOCTYPE html>',
  '<html>',
  '<head>',
  '  <title>My First Website</title>',
  '  <style>',
  '    body { background: #1a1a2e; color: #eee; }',
  '    h1 { color: #e8c460; font-size: 32px; }',
  '    .magic { color: #4fc3f7; }',
  '  </style>',
  '</head>',
  '<body>',
  '  <h1>Hello, World!</h1>',
  '  <p class="magic">I made this.</p>',
  '  <p>It\'s ugly. It\'s wonderful.</p>',
  '  <p>And it\'s <strong>mine</strong>.</p>',
  '</body>',
  '</html>',
];

const storyLines = [
  "I found HTML and CSS —",
  "and suddenly I wasn't just a consumer anymore.",
  "I was building things.",
  "Ugly, wonderful things.",
  "The moment I realized I could create",
  "something from nothing…",
  "there was no going back.",
];

const CodeBuilderWorld = () => {
  const [typedLines, setTypedLines] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [storyIndex, setStoryIndex] = useState(-1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    htmlLines.forEach((_, i) => {
      timers.push(setTimeout(() => setTypedLines(i + 1), 300 + i * 200));
    });
    timers.push(setTimeout(() => setShowPreview(true), 300 + htmlLines.length * 200 + 400));
    storyLines.forEach((_, i) => {
      timers.push(setTimeout(() => setStoryIndex(i), 300 + htmlLines.length * 200 + 1000 + i * 600));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl h-[500px]">
        {/* Code editor */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ background: "#1e1e2e", border: "1px solid #333" }}
        >
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#181825", borderBottom: "1px solid #333" }}>
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs font-mono text-gray-500 ml-2">index.html</span>
          </div>
          <div className="p-4 font-mono text-xs overflow-y-auto h-[calc(100%-36px)]">
            {htmlLines.slice(0, typedLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex"
              >
                <span className="w-6 text-right mr-3 select-none" style={{ color: "#555" }}>{i + 1}</span>
                <span style={{ color: line.includes('<') ? '#89b4fa' : line.includes(':') ? '#f9e2af' : '#cdd6f4' }}>
                  {line}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live preview */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden flex flex-col"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ background: "#1a1a2e", border: "1px solid #333" }}
        >
          <div className="px-4 py-2 flex items-center" style={{ background: "#181825", borderBottom: "1px solid #333" }}>
            <span className="text-xs font-mono text-gray-500">Preview</span>
            {showPreview && (
              <motion.span
                className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ background: "#22c55e30", color: "#22c55e" }}
              >
                ● Live
              </motion.span>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence>
              {showPreview && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                  <motion.h1
                    className="text-3xl font-bold mb-4"
                    style={{ color: "#e8c460" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Hello, World!
                  </motion.h1>
                  <motion.p
                    className="text-lg mb-2"
                    style={{ color: "#4fc3f7" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    I made this.
                  </motion.p>
                  <motion.p
                    className="mb-2"
                    style={{ color: "#eee" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    It's ugly. It's wonderful.
                  </motion.p>
                  <motion.p
                    style={{ color: "#eee" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    And it's <strong style={{ color: "#f9e2af" }}>mine</strong>.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story text */}
            <div className="mt-8 space-y-2">
              {storyLines.slice(0, storyIndex + 1).map((line, i) => (
                <motion.p
                  key={i}
                  className="font-body text-base italic"
                  style={{ color: "rgba(232,196,96,0.7)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeBuilderWorld;
