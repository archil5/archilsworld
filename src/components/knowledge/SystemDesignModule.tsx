import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SYSTEM_DESIGN_TOPICS, SYSTEM_DESIGN_CATEGORIES, type SystemDesignTopic } from "@/data/systemDesign";

const INK = "hsl(220, 30%, 10%)";
const INK_MUTED = "hsl(220, 12%, 38%)";
const COPPER = "hsl(144, 14%, 55%)";

interface SystemDesignModuleProps {
  onBack: () => void;
}

const SystemDesignModule = ({ onBack }: SystemDesignModuleProps) => {
  const [selectedTopic, setSelectedTopic] = useState<SystemDesignTopic | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return SYSTEM_DESIGN_TOPICS.filter(t => {
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
        || t.oneLiner.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, categoryFilter]);

  if (selectedTopic) {
    return (
      <div className="h-full flex flex-col" style={{ background: "#E8E0D0" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-2 px-3 py-1.5 transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <span className="font-mono text-mono-xs tracking-wider">Topics</span>
          </button>
          <h2 className="font-display text-display-sm" style={{ color: INK }}>
            {selectedTopic.icon} {selectedTopic.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* One-liner */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>
                "{selectedTopic.oneLiner}"
              </p>
            </motion.div>

            {/* The Real Problem */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "hsl(5, 50%, 48%)" }}>
                The Real Problem (Not the Textbook Version)
              </p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedTopic.theRealProblem}</p>
            </motion.div>

            {/* How It Actually Works */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-3" style={{ color: COPPER }}>
                How It Actually Works
              </p>
              <div className="space-y-2">
                {selectedTopic.howItActuallyWorks.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.04 }}
                    className="p-3" style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}15` }}>
                    <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Common Mistakes */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-3" style={{ color: "hsl(5, 50%, 48%)" }}>
                Common Mistakes I've Seen
              </p>
              <div className="space-y-2">
                {selectedTopic.commonMistakes.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 p-3"
                    style={{ background: "hsl(5 50% 48% / 0.04)", borderLeft: "2px solid hsl(5 50% 48% / 0.2)" }}>
                    <span className="font-mono text-mono-xs mt-0.5" style={{ color: "hsl(5, 50%, 48%)" }}>✗</span>
                    <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{m}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Interview Tip */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="p-4" style={{ background: `${INK}03`, borderLeft: "2px solid hsl(43 55% 55% / 0.3)" }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "hsl(43, 55%, 55%)" }}>
                Interview Tip
              </p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedTopic.interviewTip}</p>
            </motion.div>

            {/* Practitioner Note */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: COPPER }}>
                From the Trenches
              </p>
              <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{selectedTopic.practitionerNote}</p>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => {
                  const idx = SYSTEM_DESIGN_TOPICS.findIndex(t => t.id === selectedTopic.id);
                  if (idx > 0) setSelectedTopic(SYSTEM_DESIGN_TOPICS[idx - 1]);
                }}
                disabled={SYSTEM_DESIGN_TOPICS.findIndex(t => t.id === selectedTopic.id) === 0}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                ← Prev
              </button>
              <span className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
                {SYSTEM_DESIGN_TOPICS.findIndex(t => t.id === selectedTopic.id) + 1} / {SYSTEM_DESIGN_TOPICS.length}
              </span>
              <button
                onClick={() => {
                  const idx = SYSTEM_DESIGN_TOPICS.findIndex(t => t.id === selectedTopic.id);
                  if (idx < SYSTEM_DESIGN_TOPICS.length - 1) setSelectedTopic(SYSTEM_DESIGN_TOPICS[idx + 1]);
                }}
                disabled={SYSTEM_DESIGN_TOPICS.findIndex(t => t.id === selectedTopic.id) === SYSTEM_DESIGN_TOPICS.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 font-mono text-mono-xs tracking-wider disabled:opacity-20 transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#E8E0D0" }}>
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="font-mono text-mono-xs tracking-wider">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-display-sm" style={{ color: INK }}>System Design Essentials</h2>
          <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>{SYSTEM_DESIGN_TOPICS.length} topics</p>
        </div>
      </div>

      <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
        style={{ borderBottom: `1px solid ${INK}06` }}>
        <div className="relative flex-1 max-w-xs">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search topics..." className="w-full px-3 py-1.5 font-mono text-mono-sm outline-none"
            style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setCategoryFilter("all")}
            className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
            style={{
              background: categoryFilter === "all" ? INK : `${INK}04`,
              color: categoryFilter === "all" ? "#E8E0D0" : INK_MUTED,
              border: `1px solid ${INK}15`,
            }}>All</button>
          {SYSTEM_DESIGN_CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
              className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
              style={{
                background: categoryFilter === cat.value ? INK : `${INK}04`,
                color: categoryFilter === cat.value ? "#E8E0D0" : INK_MUTED,
                border: `1px solid ${INK}15`,
              }}>{cat.label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
          {filtered.map((t, i) => (
            <motion.button key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => setSelectedTopic(t)}
              className="text-left p-4 md:p-5 transition-all group"
              style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
              whileHover={{ y: -2, rotate: 0.5 }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base mb-1" style={{ color: INK }}>{t.title}</h3>
                  <p className="font-mono text-mono-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{t.oneLiner}</p>
                  <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                    style={{ borderBottom: `1px solid ${INK}10`, color: INK_MUTED }}>{t.category}</span>
                </div>
                <span className="font-mono text-mono-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: COPPER }}>→</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemDesignModule;
