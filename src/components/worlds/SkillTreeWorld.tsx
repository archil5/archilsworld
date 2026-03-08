import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Poster header */}
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: "rgba(139,105,20,0.08)", border: "1px solid rgba(139,105,20,0.2)" }}>
            <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "#8B6914" }}>
              Dalhousie University · Halifax, NS
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold mb-1" style={{ color: "#2d2a26" }}>
            Master of Applied Computer Science
          </h2>
          <p className="text-xs font-mono" style={{ color: "rgba(80,70,60,0.55)" }}>2017 — 2018</p>
        </motion.div>

        {/* Highlight stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {highlights.map((h, i) => (
            <div key={i} className="text-center p-3 rounded-lg"
              style={{ background: "rgba(139,105,20,0.04)", border: "1px solid rgba(139,105,20,0.1)" }}>
              <p className="text-[10px] font-mono uppercase mt-1" style={{ color: "rgba(80,70,60,0.45)" }}>{h.label}</p>
              <p className="text-xs font-display font-bold" style={{ color: "#2d2a26" }}>{h.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: Thesis + Courses */}
          <div className="flex-1 space-y-4">
            {/* Thesis */}
            <motion.div className="rounded-xl p-5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: "rgba(139,105,20,0.04)", border: "1px solid rgba(139,105,20,0.15)" }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "#8B6914" }}>
                Applied Research
              </p>
              <h3 className="font-display text-sm font-bold mb-2" style={{ color: "#2d2a26" }}>{thesis.title}</h3>
              <p className="text-xs font-body italic leading-relaxed" style={{ color: "rgba(45,42,38,0.7)" }}>
                {thesis.abstract}
              </p>
            </motion.div>

            {/* Course grid */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "#8B6914" }}>
                Key Courses · Click to explore
              </p>
              <div className="grid grid-cols-2 gap-2">
                {courses.map((c, i) => {
                  const isActive = selectedCourse?.code === c.code;
                  return (
                    <motion.button key={c.code}
                      className="text-left p-3 rounded-lg cursor-pointer transition-all"
                      onClick={() => setSelectedCourse(isActive ? null : c)}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                      style={{
                        background: isActive ? "rgba(139,105,20,0.08)" : "#fefcf9",
                        border: `1px solid ${isActive ? "rgba(139,105,20,0.3)" : "rgba(180,140,100,0.1)"}`,
                        boxShadow: isActive ? "0 2px 12px rgba(139,105,20,0.1)" : "none",
                      }}>
                      <p className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.45)" }}>{c.code}</p>
                      <p className="text-xs font-display font-bold" style={{ color: isActive ? "#8B6914" : "#2d2a26" }}>{c.name}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Detail + Key Learnings */}
          <div className="lg:w-72 space-y-4">
            <AnimatePresence mode="wait">
              {selectedCourse ? (
                <motion.div key={selectedCourse.code} className="rounded-xl p-5"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ background: "#fefcf9", border: "1px solid rgba(139,105,20,0.15)" }}>
                  <div className="mb-3">
                    <p className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.45)" }}>{selectedCourse.code}</p>
                    <h3 className="font-display text-sm font-bold" style={{ color: "#8B6914" }}>{selectedCourse.name}</h3>
                  </div>
                  <p className="text-xs font-body italic leading-relaxed mb-3" style={{ color: "rgba(45,42,38,0.75)" }}>
                    "{selectedCourse.takeaway}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCourse.tools.map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded"
                        style={{ background: "rgba(139,105,20,0.06)", border: "1px solid rgba(139,105,20,0.12)", color: "#8B6914" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="placeholder" className="rounded-xl p-5 text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ background: "#fefcf9", border: "1px solid rgba(180,140,100,0.1)" }}>
                  <p className="text-sm font-body italic" style={{ color: "rgba(80,70,60,0.45)" }}>
                    Select a course to see details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Key learnings */}
            <motion.div className="rounded-xl p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ background: "rgba(42,125,79,0.04)", border: "1px solid rgba(42,125,79,0.12)" }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "#2a7d4f" }}>
                Key Takeaways
              </p>
              {keyLearnings.map((l, i) => (
                <motion.div key={i} className="flex items-start gap-2 mb-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <span className="text-[10px] mt-0.5" style={{ color: "#2a7d4f" }}>▸</span>
                  <span className="text-[11px] font-body leading-relaxed" style={{ color: "rgba(45,42,38,0.7)" }}>{l}</span>
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
