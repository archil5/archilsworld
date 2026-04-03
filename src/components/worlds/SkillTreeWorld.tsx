import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const GOLD = "#D97706";

const thesis = {
  title: "Automated Security Compliance in Cloud-Native Environments",
  abstract: "Explored frameworks for automating SOC2 and NIST compliance checks across containerised infrastructure, reducing manual audit effort by 70% while maintaining regulatory accuracy.",
  outcome: "This research directly shaped my approach to 'compliance-as-code' — the pattern I later implemented across BMO's CI/CD platform, replacing weeks of manual audit work.",
};

const highlights = [
  { label: "Distinction", value: "Graduated with Distinction", icon: "🏅" },
  { label: "Duration", value: "2017 — 2018", icon: "📅" },
  { label: "Location", value: "Halifax, Nova Scotia", icon: "📍" },
  { label: "Degree", value: "Master of Applied CS", icon: "🎓" },
];

interface Course {
  code: string;
  name: string;
  takeaway: string;
  tools: string[];
  careerLink: string;
  icon: string;
  color: string;
}

const courses: Course[] = [
  {
    code: "CSCI 5100",
    name: "Advanced Algorithms",
    icon: "⚡",
    color: "#0D9488",
    takeaway: "Learned to think in time complexity — every design decision has a cost you must be able to articulate.",
    tools: ["Python", "Dynamic Programming", "Graph Theory"],
    careerLink: "Directly applies to system design architecture decisions at BMO — evaluating trade-offs at scale.",
  },
  {
    code: "CSCI 5308",
    name: "Advanced Software Dev",
    icon: "🏗️",
    color: "#2563EB",
    takeaway: "Clean architecture, SOLID principles, and why 'it works' is never enough in production.",
    tools: ["Java", "Design Patterns", "TDD", "CI/CD"],
    careerLink: "Foundation for the reusable GitHub Actions workflow library I built at BMO — enforcing consistency at scale.",
  },
  {
    code: "CSCI 5708",
    name: "Network Security",
    icon: "🔐",
    color: "#7C3AED",
    takeaway: "Cryptography, firewalls, threat models — the invisible armour of the internet.",
    tools: ["Wireshark", "Nmap", "OpenSSL", "Kali Linux"],
    careerLink: "The foundation of my zero-trust architecture designs. Private endpoints, mTLS, CMK encryption — all trace back here.",
  },
  {
    code: "CSCI 5709",
    name: "Ethical Hacking Lab",
    icon: "🕵️",
    color: "#DC2626",
    takeaway: "Hands-on penetration testing — learned to think like an attacker to build better defences.",
    tools: ["Metasploit", "Burp Suite", "OWASP", "SQL Injection"],
    careerLink: "Informed my cybersecurity automation work at RBC — you design better defences when you know how attacks work.",
  },
  {
    code: "CSCI 6505",
    name: "Machine Learning",
    icon: "🧠",
    color: "#D97706",
    takeaway: "Statistical foundations that later powered every AI platform decision I've made in production.",
    tools: ["Python", "Scikit-learn", "TensorFlow", "NumPy"],
    careerLink: "The conceptual backbone behind my MLOps pipelines, model governance, and enterprise AI platform at BMO.",
  },
  {
    code: "Applied Project",
    name: "Ansible Automation",
    icon: "🤖",
    color: "#0D9488",
    takeaway: "Built a real compliance automation framework. My bridge from academia to industry — shipped something real.",
    tools: ["Ansible", "Python", "Jenkins", "Linux"],
    careerLink: "The prototype for the security automation I later built at RBC — automated scanning across 10,000+ endpoints.",
  },
];

const keyLearnings = [
  { text: "Systems thinking — understanding how invisible architecture connects everything", icon: "🔗" },
  { text: "Security-first mindset — threat modelling before feature building", icon: "🛡️" },
  { text: "Automation instinct — if you do it twice, script it", icon: "⚙️" },
  { text: "Research discipline — evidence over opinion, always", icon: "📊" },
];

const SkillTreeWorld = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "thesis" | "learnings">("courses");

  return (
    <div className="w-full h-full overflow-y-auto px-4 md:px-8 py-6" style={{ background: "#F8FAFC" }}>
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-7"
          initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full"
            style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}25` }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              Dalhousie University · Halifax, NS
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-1" style={{ color: INK }}>
            Master of Applied Computer Science
          </h2>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>2017 — 2018</p>
        </motion.div>

        {/* Highlights */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {highlights.map((h, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl"
              style={{ background: `${INK}03`, border: `1px solid ${INK}06` }}>
              <span className="text-2xl mb-2">{h.icon}</span>
              <p className="font-display text-sm font-bold mb-0.5" style={{ color: INK }}>{h.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>{h.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            ["courses", "📚 Courses"],
            ["thesis", "🔬 Research"],
            ["learnings", "💡 Takeaways"],
          ] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-xl transition-all"
              style={{
                background: activeTab === tab ? INK : `${INK}04`,
                color: activeTab === tab ? "#F8FAFC" : INK_MUTED,
                border: `1px solid ${activeTab === tab ? "transparent" : `${INK}10`}`,
              }}>
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Course grid */}
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
                    Click any course to see how it connects to my career
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {courses.map((c, i) => {
                      const isActive = selectedCourse?.code === c.code;
                      return (
                        <motion.button key={c.code}
                          className="text-left p-3.5 transition-all rounded-xl"
                          onClick={() => setSelectedCourse(isActive ? null : c)}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                          whileHover={{ y: -2 }}
                          style={{
                            background: isActive ? `${c.color}08` : `${INK}02`,
                            border: `1.5px solid ${isActive ? `${c.color}30` : `${INK}06`}`,
                          }}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-lg">{c.icon}</span>
                            <span className="font-mono text-[9px]" style={{ color: isActive ? c.color : INK_MUTED }}>{c.code}</span>
                          </div>
                          <p className="font-display text-sm font-bold" style={{ color: isActive ? c.color : INK }}>{c.name}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {c.tools.slice(0, 2).map(t => (
                              <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                                style={{ background: `${c.color}08`, color: c.color }}>
                                {t}
                              </span>
                            ))}
                            {c.tools.length > 2 && (
                              <span className="font-mono text-[9px]" style={{ color: INK_MUTED }}>+{c.tools.length - 2}</span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Detail panel */}
                <div className="lg:w-72 shrink-0">
                  <AnimatePresence mode="wait">
                    {selectedCourse ? (
                      <motion.div key={selectedCourse.code}
                        className="rounded-xl overflow-hidden"
                        initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        style={{ border: `1px solid ${selectedCourse.color}20` }}>

                        <div className="px-5 py-4 flex items-center gap-3"
                          style={{ background: `${selectedCourse.color}08`, borderBottom: `1px solid ${selectedCourse.color}12` }}>
                          <span className="text-2xl">{selectedCourse.icon}</span>
                          <div>
                            <p className="font-mono text-[9px]" style={{ color: INK_MUTED }}>{selectedCourse.code}</p>
                            <h3 className="font-display text-base font-bold" style={{ color: selectedCourse.color }}>{selectedCourse.name}</h3>
                          </div>
                        </div>

                        <div className="p-5 space-y-4" style={{ background: "#fff" }}>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: INK_MUTED }}>Takeaway</p>
                            <p className="font-display text-sm italic leading-relaxed" style={{ color: INK_MUTED }}>
                              "{selectedCourse.takeaway}"
                            </p>
                          </div>

                          <div className="p-3 rounded-xl"
                            style={{ background: `${selectedCourse.color}06`, borderLeft: `2px solid ${selectedCourse.color}30` }}>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: selectedCourse.color }}>
                              → Career Impact
                            </p>
                            <p className="font-display text-xs leading-relaxed" style={{ color: INK }}>
                              {selectedCourse.careerLink}
                            </p>
                          </div>

                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: INK_MUTED }}>Stack</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedCourse.tools.map(t => (
                                <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-lg"
                                  style={{ background: `${selectedCourse.color}08`, color: selectedCourse.color, border: `1px solid ${selectedCourse.color}15` }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="placeholder" className="p-8 text-center rounded-xl"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
                        <span className="text-4xl block mb-3">👆</span>
                        <p className="font-display text-sm" style={{ color: INK }}>
                          Select a course
                        </p>
                        <p className="font-mono text-xs mt-1" style={{ color: INK_MUTED }}>
                          See how it connects to my career
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* THESIS TAB */}
          {activeTab === "thesis" && (
            <motion.div key="thesis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-5">

              <div className="p-6 rounded-2xl" style={{ background: `${INK}03`, border: `1px solid ${GOLD}15` }}>
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl shrink-0">🔬</span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: GOLD }}>Applied Research Project</p>
                    <h3 className="font-display text-lg font-bold leading-snug" style={{ color: INK }}>{thesis.title}</h3>
                  </div>
                </div>
                <p className="font-display text-sm leading-relaxed italic" style={{ color: INK_MUTED }}>{thesis.abstract}</p>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: `${COPPER}06`, borderLeft: `3px solid ${COPPER}40` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>
                  Why It Still Matters Today
                </p>
                <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{thesis.outcome}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Compliance", detail: "SOC2 & NIST automation", color: "#7C3AED" },
                  { label: "Reduction", detail: "70% manual audit effort saved", color: COPPER },
                  { label: "Outcome", detail: "Prototype for BMO's IaC pipeline", color: GOLD },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                    <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: item.color }}>{item.label}</p>
                    <p className="font-display text-xs font-bold" style={{ color: INK }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* LEARNINGS TAB */}
          {activeTab === "learnings" && (
            <motion.div key="learnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-4">

              <div className="p-4 rounded-xl mb-2" style={{ background: `${INK}03`, border: `1px solid ${INK}06` }}>
                <p className="font-display text-sm italic leading-relaxed text-center" style={{ color: INK_MUTED }}>
                  "Dalhousie didn't just give me a degree — it gave me a way of thinking that I still use every single day."
                </p>
              </div>

              {keyLearnings.map((l, i) => (
                <motion.div key={i}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
                  <span className="text-2xl shrink-0">{l.icon}</span>
                  <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{l.text}</p>
                </motion.div>
              ))}

              <div className="p-5 rounded-xl mt-4"
                style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>The Through-Line</p>
                <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>
                  Every course fed into a single capability: the ability to take apart a complex system, understand how it fails, and build it back better. That's not a course — it's an instinct. Dalhousie sharpened it.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillTreeWorld;
