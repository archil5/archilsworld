import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

const thesis = {
  title: "Automated Security Compliance in Cloud-Native Environments",
  abstract: "Explored frameworks for automating SOC2 and NIST compliance checks across containerized infrastructure, reducing manual audit effort by 70% while maintaining regulatory accuracy.",
};

const highlights = [
  { label: "Distinction", value: "Graduated with Distinction" },
  { label: "Duration", value: "2017 — 2018" },
  { label: "Location", value: "Halifax, Nova Scotia" },
  { label: "Degree", value: "Master of Applied Computer Science" },
];

interface Course {
  code: string;
  name: string;
  takeaway: string;
  tools: string[];
}

const courses: Course[] = [
  { code: "CSCI 5100", name: "Advanced Algorithms", takeaway: "Learned to think in time complexity — every design decision has a cost.", tools: ["Python", "Dynamic Programming", "Graph Theory"] },
  { code: "CSCI 5308", name: "Advanced Software Dev", takeaway: "Clean architecture, SOLID principles, and why 'it works' isn't enough.", tools: ["Java", "Design Patterns", "TDD", "CI/CD"] },
  { code: "CSCI 5708", name: "Network Security", takeaway: "Cryptography, firewalls, threat models — the invisible armor of the internet.", tools: ["Wireshark", "Nmap", "OpenSSL", "Kali Linux"] },
  { code: "CSCI 5709", name: "Ethical Hacking Lab", takeaway: "Hands-on penetration testing — learned to think like an attacker to build better defenses.", tools: ["Metasploit", "Burp Suite", "OWASP", "SQL Injection"] },
  { code: "CSCI 6505", name: "Machine Learning", takeaway: "Statistical foundations that would later power my AI platform work.", tools: ["Python", "Scikit-learn", "TensorFlow", "NumPy"] },
  { code: "Applied Project", name: "Ansible Automation", takeaway: "Built a real compliance automation framework — my bridge from academia to industry.", tools: ["Ansible", "Python", "Jenkins", "Linux"] },
];

const keyLearnings = [
  "Systems thinking — understanding how invisible architecture connects everything",
  "Security-first mindset — threat modelling before feature building",
  "Automation instinct — if you do it twice, script it",
  "Research discipline — evidence over opinion, always",
];

const SkillTreeWorld = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
            style={{ borderBottom: "1px solid hsl(36 95% 44% / 0.3)" }}>
            <span className="font-mono text-mono-xs uppercase tracking-[0.2em]" style={{ color: "#D97706" }}>
              Dalhousie University · Halifax, NS
            </span>
          </div>
          <h2 className="font-display text-display-md md:text-display-lg font-bold mb-1" style={{ color: INK }}>
            Master of Applied Computer Science
          </h2>
          <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>2017 — 2018</p>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {highlights.map((h, i) => (
            <div key={i} className="text-center p-4"
              style={{ background: `${INK}03`, borderLeft: "2px solid hsl(36 95% 44% / 0.2)" }}>
              <p className="font-mono text-mono-xs uppercase mt-1" style={{ color: INK_MUTED }}>{h.label}</p>
              <p className="font-display text-sm font-bold" style={{ color: INK }}>{h.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-5">
            {/* Thesis */}
            <motion.div className="p-5" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: `${INK}03`, borderLeft: "2px solid hsl(36 95% 44% / 0.3)" }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#D97706" }}>
                Applied Research
              </p>
              <h3 className="font-display text-base font-bold mb-2" style={{ color: INK }}>{thesis.title}</h3>
              <p className="font-display text-sm italic leading-relaxed" style={{ color: INK_MUTED }}>
                {thesis.abstract}
              </p>
            </motion.div>

            {/* Courses */}
            <div>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-3" style={{ color: "#D97706" }}>
                Key Courses · Click to explore
              </p>
              <div className="grid grid-cols-2 gap-2">
                {courses.map((c, i) => {
                  const isActive = selectedCourse?.code === c.code;
                  return (
                    <motion.button key={c.code}
                      className="text-left p-3 transition-all"
                      onClick={() => setSelectedCourse(isActive ? null : c)}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                      style={{
                        background: isActive ? `${INK}06` : `${INK}02`,
                        borderLeft: isActive ? "2px solid hsl(43, 55%, 55%)" : "2px solid transparent",
                        border: `1px solid ${isActive ? "hsl(36 95% 44% / 0.2)" : `${INK}06`}`,
                      }}>
                      <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>{c.code}</p>
                      <p className="font-display text-sm font-bold" style={{ color: isActive ? "#D97706" : INK }}>{c.name}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:w-72 space-y-5">
            <AnimatePresence mode="wait">
              {selectedCourse ? (
                <motion.div key={selectedCourse.code} className="p-5"
                  initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ background: `${INK}03`, border: `1px solid hsl(36 95% 44% / 0.15)` }}>
                  <div className="mb-3">
                    <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>{selectedCourse.code}</p>
                    <h3 className="font-display text-base font-bold" style={{ color: "#D97706" }}>{selectedCourse.name}</h3>
                  </div>
                  <p className="font-display text-sm italic leading-relaxed mb-4" style={{ color: INK_MUTED }}>
                    "{selectedCourse.takeaway}"
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourse.tools.map(t => (
                      <span key={t} className="font-mono text-mono-xs px-2 py-0.5"
                        style={{ background: "hsl(36 95% 44% / 0.06)", borderBottom: "1px solid hsl(36 95% 44% / 0.15)", color: "#D97706" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="placeholder" className="p-5 text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
                  <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>
                    Select a course to see details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
              <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: COPPER }}>
                Key Takeaways
              </p>
              {keyLearnings.map((l, i) => (
                <motion.div key={i} className="flex items-start gap-2 mb-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <span className="font-mono text-mono-xs mt-0.5" style={{ color: COPPER }}>▸</span>
                  <span className="font-display text-sm leading-relaxed" style={{ color: INK_MUTED }}>{l}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeWorld;