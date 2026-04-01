import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLOUD_PATTERNS, CLOUD_PATTERN_CATEGORIES, type CloudPattern } from "@/data/cloudPatterns";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

interface CloudPatternsModuleProps {
  onBack: () => void;
}

const CloudPatternsModule = ({ onBack }: CloudPatternsModuleProps) => {
  const [selectedPattern, setSelectedPattern] = useState<CloudPattern | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return CLOUD_PATTERNS.filter(p => {
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
        || p.oneLiner.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, categoryFilter]);

  if (selectedPattern) {
    return (
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => setSelectedPattern(null)}
            className="flex items-center gap-2 px-3 py-1.5 transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <span className="font-mono text-mono-xs tracking-wider">Patterns</span>
          </button>
          <h2 className="font-display text-display-sm" style={{ color: INK }}>
            {selectedPattern.icon} {selectedPattern.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* One-liner */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>
                "{selectedPattern.oneLiner}"
              </p>
            </motion.div>

            {/* Problem */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#DC2626" }}>The Problem</p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.problem}</p>
            </motion.div>

            {/* Solution */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: COPPER }}>The Solution</p>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{selectedPattern.solution}</p>
            </motion.div>

            {/* How It Works */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-3" style={{ color: INK_MUTED }}>How It Actually Works</p>
              <div className="space-y-2">
                {selectedPattern.howItWorks.map((step, i) => (
                  <div key={i} className="flex gap-3 p-3" style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}15` }}>
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center font-mono text-mono-xs"
                      style={{ background: `${COPPER}10`, color: COPPER }}>{i + 1}</span>
                    <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trade-offs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-3" style={{ color: INK_MUTED }}>Trade-offs</p>
              <div className="space-y-3">
                {selectedPattern.tradeoffs.map((t, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <div className="p-3" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}25` }}>
                      <p className="font-mono text-mono-xs mb-1" style={{ color: COPPER }}>✓ PRO</p>
                      <p className="font-display text-sm" style={{ color: INK }}>{t.pro}</p>
                    </div>
                    <div className="p-3" style={{ background: "hsl(0 72% 51% / 0.04)", borderLeft: "2px solid hsl(0 72% 51% / 0.2)" }}>
                      <p className="font-mono text-mono-xs mb-1" style={{ color: "#DC2626" }}>✗ CON</p>
                      <p className="font-display text-sm" style={{ color: INK }}>{t.con}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Real World */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="p-4" style={{ background: `${INK}03`, borderLeft: `2px solid hsl(36 95% 44% / 0.3)` }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#D97706" }}>From Production</p>
              <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{selectedPattern.realWorld}</p>
            </motion.div>

            {/* When to Use / Not */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: COPPER }}>When To Use</p>
                {selectedPattern.whenToUse.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <span className="font-mono text-mono-xs mt-0.5" style={{ color: COPPER }}>▸</span>
                    <span className="font-display text-sm" style={{ color: INK }}>{w}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#DC2626" }}>When NOT To Use</p>
                {selectedPattern.whenNotToUse.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <span className="font-mono text-mono-xs mt-0.5" style={{ color: "#DC2626" }}>✗</span>
                    <span className="font-display text-sm" style={{ color: INK }}>{w}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Related */}
            <div className="flex gap-2 flex-wrap pt-2">
              <span className="font-mono text-mono-xs uppercase tracking-[0.1em]" style={{ color: INK_MUTED }}>Related:</span>
              {selectedPattern.relatedPatterns.map(r => (
                <button key={r}
                  onClick={() => {
                    const p = CLOUD_PATTERNS.find(cp => cp.title === r);
                    if (p) setSelectedPattern(p);
                  }}
                  className="font-mono text-mono-xs px-2 py-0.5 transition-all"
                  style={{ color: COPPER, borderBottom: `1px solid ${COPPER}25` }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="font-mono text-mono-xs tracking-wider">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-display-sm" style={{ color: INK }}>Cloud Architecture Patterns</h2>
          <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>{CLOUD_PATTERNS.length} patterns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
        style={{ borderBottom: `1px solid ${INK}06` }}>
        <div className="relative flex-1 max-w-xs">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patterns..." className="w-full px-3 py-1.5 font-mono text-mono-sm outline-none"
            style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setCategoryFilter("all")}
            className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
            style={{
              background: categoryFilter === "all" ? INK : `${INK}04`,
              color: categoryFilter === "all" ? "#F8FAFC" : INK_MUTED,
              border: `1px solid ${INK}15`,
            }}>All</button>
          {CLOUD_PATTERN_CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
              className="px-3 py-1 font-mono text-mono-xs uppercase tracking-[0.1em] transition-all"
              style={{
                background: categoryFilter === cat.value ? INK : `${INK}04`,
                color: categoryFilter === cat.value ? "#F8FAFC" : INK_MUTED,
                border: `1px solid ${INK}15`,
              }}>{cat.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
          {filtered.map((p, i) => (
            <motion.button key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => setSelectedPattern(p)}
              className="text-left p-4 md:p-5 transition-all group"
              style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
              whileHover={{ y: -2, rotate: 0.5 }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base mb-1" style={{ color: INK }}>{p.title}</h3>
                  <p className="font-mono text-mono-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{p.oneLiner}</p>
                  <span className="font-mono text-mono-xs uppercase tracking-[0.1em] px-2 py-0.5"
                    style={{ borderBottom: `1px solid ${INK}10`, color: INK_MUTED }}>{p.category}</span>
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

export default CloudPatternsModule;
