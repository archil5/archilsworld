import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimelineRole {
  company: string;
  title: string;
  period: string;
  narrative: string;
  skills: string[];
  color: string;
  icon: string;
}

const roles: TimelineRole[] = [
  {
    company: "RBC", title: "DevOps Engineer — Cyber Security",
    period: "Sep–Dec 2018", icon: "🛡️", color: "#4a9eff",
    narrative: "My first move on the board. I walked into one of the largest banks in the country and built automation for cybersecurity compliance.",
    skills: ["Ansible", "Python", "Jenkins"],
  },
  {
    company: "BMO", title: "Cloud Infrastructure Engineer",
    period: "Mar 2019–May 2020", icon: "☁️", color: "#d4883a",
    narrative: "The foundation year. High-pressure cloud migrations. I learned that the best architecture is the one nobody notices.",
    skills: ["AWS", "Azure", "Terraform"],
  },
  {
    company: "BMO", title: "Senior Cloud Engineer",
    period: "Jun 2020–Apr 2021", icon: "📐", color: "#d4883a",
    narrative: "I stopped building and started designing. The pivot from implementation to architecture.",
    skills: ["Architecture", "Consulting", "SLA"],
  },
  {
    company: "BMO", title: "Team Lead",
    period: "May 2021–Jul 2022", icon: "👥", color: "#d4883a",
    narrative: "Leading the squad. Container deployments from days to hours. Zero critical audit findings.",
    skills: ["Leadership", "CI/CD", "Security"],
  },
  {
    company: "BMO", title: "Principal — Serverless & Containers",
    period: "Jul 2022–Aug 2025", icon: "🏗️", color: "#d4883a",
    narrative: "Owning the platform. Multi-region. The shift from 'servers' to 'services.'",
    skills: ["Kubernetes", "Serverless", "Platform"],
  },
  {
    company: "BMO", title: "Principal — AI",
    period: "Jun 2025–Present", icon: "🤖", color: "#9b59b6",
    narrative: "Architecting the secure backbone for enterprise AI. The board keeps expanding.",
    skills: ["RAG", "MLOps", "Azure AI"],
  },
];

const CareerTimelineWorld = ({ startRole }: { startRole?: string }) => {
  const [activeRole, setActiveRole] = useState(0);
  const [revealed, setRevealed] = useState(0);

  // Find starting index based on which tile was clicked
  useEffect(() => {
    if (startRole) {
      const map: Record<string, number> = {
        rbc: 0, "bmo-infra": 1, "bmo-senior": 2,
        "bmo-lead": 3, "bmo-principal": 4, "bmo-ai": 5,
      };
      const idx = map[startRole] ?? 0;
      setActiveRole(idx);
    }
  }, [startRole]);

  useEffect(() => {
    const timers = roles.map((_, i) =>
      setTimeout(() => setRevealed(i + 1), 300 + i * 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const role = roles[activeRole];

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl w-full items-center">
        {/* Timeline rail */}
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar py-2">
          {roles.slice(0, revealed).map((r, i) => (
            <motion.button
              key={i}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer"
              onClick={() => setActiveRole(i)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: i === activeRole ? `${r.color}20` : "rgba(40,30,20,0.4)",
                border: `1px solid ${i === activeRole ? r.color : "rgba(232,196,96,0.1)"}`,
                boxShadow: i === activeRole ? `0 0 20px ${r.color}30` : "none",
              }}
            >
              <span className="text-lg">{r.icon}</span>
              <div className="text-left">
                <p className="text-[10px] font-mono" style={{ color: "rgba(232,196,96,0.5)" }}>
                  {r.period}
                </p>
                <p className="text-xs font-display whitespace-nowrap" style={{ color: i === activeRole ? "#e8c460" : "rgba(232,196,96,0.5)" }}>
                  {r.company}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active role detail */}
        <motion.div
          key={activeRole}
          className="flex-1 max-w-lg"
          initial={{ opacity: 0, y: 30, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{ perspective: 800 }}
        >
          <div
            className="rounded-xl p-8"
            style={{
              background: "rgba(40,30,20,0.6)",
              border: `1px solid ${role.color}40`,
              boxShadow: `0 0 40px ${role.color}15`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{role.icon}</span>
              <div>
                <p className="font-display text-sm uppercase tracking-widest" style={{ color: role.color }}>
                  {role.company}
                </p>
                <p className="font-mono text-xs" style={{ color: "rgba(232,196,96,0.4)" }}>
                  {role.period}
                </p>
              </div>
            </div>

            <h3 className="font-display text-xl md:text-2xl font-bold mb-4" style={{ color: "#f0e6d0" }}>
              {role.title}
            </h3>

            <p className="font-body text-base italic leading-relaxed mb-6" style={{ color: "rgba(240,230,208,0.75)" }}>
              {role.narrative}
            </p>

            <div className="flex flex-wrap gap-2">
              {role.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  className="text-[11px] font-mono px-2.5 py-1 rounded"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{
                    color: role.color,
                    background: `${role.color}15`,
                    border: `1px solid ${role.color}30`,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Navigate hint */}
          {activeRole < roles.length - 1 && (
            <motion.button
              className="mt-4 text-xs font-display tracking-wider flex items-center gap-2 mx-auto cursor-pointer"
              style={{ color: "rgba(232,196,96,0.4)" }}
              onClick={() => setActiveRole(prev => Math.min(prev + 1, roles.length - 1))}
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Next role →
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CareerTimelineWorld;
