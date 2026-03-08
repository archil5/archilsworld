import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brandLogos } from "@/data/brandLogos";

interface RoleLevel {
  level: number;
  company: string;
  title: string;
  period: string;
  color: string;
  brandColor: string;
  xpGained: number;
  narrative: string;
  bossChallenge: string;
  skillsUnlocked: string[];
  techStack: string[];
  loot: string[];
  impactMetric: string;
}

const roles: RoleLevel[] = [
  {
    level: 1, company: "RBC", title: "DevOps Engineer — Cyber Security",
    period: "Sep–Dec 2018", color: "#005DAA", brandColor: "#005DAA", xpGained: 1500,
    narrative: "First deployment into the field. Walked into one of the largest banks in the country and built automation for cybersecurity compliance.",
    bossChallenge: "500+ endpoints with manual compliance checks — automate or drown.",
    skillsUnlocked: ["Security Automation", "CI Pipeline Design", "Config Management", "Compliance Scripting"],
    techStack: ["Ansible", "Python", "Jenkins", "Splunk", "Palo Alto", "Linux"],
    loot: ["Automated compliance across 500+ endpoints", "Reduced firewall audit time by 60%", "Introduced Ansible to the security team"],
    impactMetric: "60% audit time reduction",
  },
  {
    level: 2, company: "BMO", title: "Cloud Infrastructure Engineer",
    period: "Mar 2019–May 2020", color: "#0075BE", brandColor: "#0075BE", xpGained: 3000,
    narrative: "The foundation year. High-pressure cloud migrations, Infrastructure as Code, and building the patterns everyone else would follow.",
    bossChallenge: "Migrate 50+ legacy apps to cloud with zero downtime.",
    skillsUnlocked: ["Cloud Architecture", "IaC", "Network Design", "Migration Strategy", "Cost Optimization"],
    techStack: ["AWS", "Azure", "Terraform", "CloudFormation", "Docker", "Jenkins", "Python"],
    loot: ["50+ apps migrated, zero downtime", "Provisioning: weeks → hours", "IaC patterns adopted by 10+ teams", "30% cloud cost reduction"],
    impactMetric: "50+ zero-downtime migrations",
  },
  {
    level: 3, company: "BMO", title: "Senior Cloud Engineer",
    period: "Jun 2020–Apr 2021", color: "#0075BE", brandColor: "#0075BE", xpGained: 4500,
    narrative: "Stopped building, started designing. The pivot from implementation to architecture — translating complexity into leadership decisions.",
    bossChallenge: "200+ cloud accounts with no unified architecture standards.",
    skillsUnlocked: ["Solution Architecture", "Technical Consulting", "SLA Design", "Stakeholder Management"],
    techStack: ["AWS", "Azure", "Kubernetes", "Helm", "Datadog", "Confluence"],
    loot: ["Architecture patterns reducing failures by 40%", "Executive-ready decision frameworks", "SLA program saving $2M/year"],
    impactMetric: "$2M annual savings",
  },
  {
    level: 4, company: "BMO", title: "Team Lead",
    period: "May 2021–Jul 2022", color: "#0075BE", brandColor: "#0075BE", xpGained: 6000,
    narrative: "Leading the squad. Container deployments from days to hours. Pipelines that sailed through audits with zero critical findings.",
    bossChallenge: "Container platform with 5-day deployments and audit gaps.",
    skillsUnlocked: ["Team Leadership", "Mentoring", "Agile/Scrum", "Security Automation", "Audit Readiness"],
    techStack: ["Kubernetes", "EKS", "Docker", "GitHub Actions", "ArgoCD", "Vault", "Istio"],
    loot: ["Led team of 6, 100% retention", "Deployments: 5 days → 2 hours", "Zero critical audit findings", "3 engineers promoted to senior"],
    impactMetric: "5 days → 2 hours",
  },
  {
    level: 5, company: "BMO", title: "Principal — Serverless & Containers",
    period: "Jul 2022–Aug 2025", color: "#FF9900", brandColor: "#FF9900", xpGained: 9000,
    narrative: "Owning the platform. Multi-region architectures serving 1000+ developers. Led the cultural shift from servers to services.",
    bossChallenge: "Scale platform to support 1000+ devs across the entire bank.",
    skillsUnlocked: ["Platform Engineering", "Multi-Region Design", "Developer Experience", "Serverless Patterns"],
    techStack: ["EKS", "Lambda", "Step Functions", "API Gateway", "CDK", "Datadog", "Grafana", "Prometheus"],
    loot: ["Platform serving 1000+ developers", "60% complexity reduction via serverless", "Multi-region active-active architecture", "Golden-path templates: weeks → minutes"],
    impactMetric: "1000+ developers served",
  },
  {
    level: 6, company: "BMO", title: "Principal — AI",
    period: "Jun 2025–Present", color: "#0078D4", brandColor: "#0078D4", xpGained: 12000,
    narrative: "The frontier. Architecting the secure backbone for enterprise AI — Azure-based platforms with strict model governance for Canada's 4th largest bank.",
    bossChallenge: "Build secure enterprise AI platform under banking regulations.",
    skillsUnlocked: ["RAG Architecture", "MLOps", "LLMOps", "Model Governance", "AI Security", "Prompt Engineering"],
    techStack: ["Azure OpenAI", "AI Studio", "LangChain", "Vector DBs", "Kubernetes", "MLflow", "Python"],
    loot: ["Enterprise AI platform architecture", "Model governance framework", "RAG pipelines at petabyte scale", "AI security standards org-wide"],
    impactMetric: "Enterprise AI at scale",
  },
];

const CareerTimelineWorld = ({ startRole }: { startRole?: string }) => {
  const [activeLevel, setActiveLevel] = useState(0);
  const [revealedLevels, setRevealedLevels] = useState(0);
  const [activeTab, setActiveTab] = useState<"story" | "boss" | "loot" | "tech">("story");

  useEffect(() => {
    const timers = roles.map((_, i) =>
      setTimeout(() => setRevealedLevels(i + 1), 200 + i * 250)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => setActiveTab("story"), [activeLevel]);

  const role = roles[activeLevel];
  const totalXP = roles.slice(0, activeLevel + 1).reduce((s, r) => s + r.xpGained, 0);
  const maxXP = roles.reduce((s, r) => s + r.xpGained, 0);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-5 max-w-6xl w-full items-start">
        {/* Level rail */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar py-1 lg:min-w-[200px]">
          {roles.slice(0, revealedLevels).map((r, i) => (
            <motion.button key={i}
              className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
              onClick={() => setActiveLevel(i)}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              style={{
                background: i === activeLevel ? `${r.brandColor}10` : "#fefcf9",
                border: `1px solid ${i === activeLevel ? `${r.brandColor}40` : "rgba(180,140,100,0.1)"}`,
                boxShadow: i === activeLevel ? `0 2px 12px ${r.brandColor}15` : "none",
              }}>
              <span className="text-xs font-mono font-black w-7 h-7 flex items-center justify-center rounded-full"
                style={{ background: i <= activeLevel ? r.brandColor : "rgba(180,140,100,0.15)", color: i <= activeLevel ? "#fff" : "rgba(80,70,60,0.4)" }}>
                {r.level}
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  {brandLogos[r.company] && (
                    <img src={brandLogos[r.company]} alt={r.company} className="h-3.5 object-contain" />
                  )}
                  <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>{r.period}</span>
                </div>
                <p className="text-[11px] font-display font-bold whitespace-nowrap"
                  style={{ color: i === activeLevel ? "#2d2a26" : "rgba(80,70,60,0.55)" }}>
                  {r.title.length > 28 ? r.title.slice(0, 26) + "…" : r.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main content */}
        <motion.div key={activeLevel} className="flex-1 max-w-2xl"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header with XP bar */}
          <div className="rounded-t-xl px-5 py-4" style={{ background: `${role.brandColor}08`, borderBottom: `1px solid ${role.brandColor}20` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-black px-3 py-1 rounded-lg"
                  style={{ background: role.brandColor, color: "#fff" }}>
                  LV.{role.level}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: "#2d2a26" }}>{role.title}</h3>
                  <div className="flex items-center gap-2">
                    {brandLogos[role.company] && (
                      <img src={brandLogos[role.company]} alt={role.company} className="h-4 object-contain" />
                    )}
                    <span className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.55)" }}>{role.period}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono uppercase" style={{ color: role.brandColor }}>Impact</p>
                <p className="text-xs font-mono font-bold" style={{ color: "#2d2a26" }}>{role.impactMetric}</p>
              </div>
            </div>
            {/* XP Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.45)" }}>XP</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(180,140,100,0.12)" }}>
                <motion.div className="h-full rounded-full" style={{ background: role.brandColor }}
                  initial={{ width: 0 }} animate={{ width: `${(totalXP / maxXP) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }} />
              </div>
              <span className="text-[9px] font-mono font-bold" style={{ color: role.brandColor }}>
                {totalXP.toLocaleString()} / {maxXP.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex" style={{ background: "#fefcf9", borderLeft: "1px solid rgba(180,140,100,0.1)", borderRight: "1px solid rgba(180,140,100,0.1)" }}>
            {(["story", "boss", "loot", "tech"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 text-[11px] font-mono uppercase tracking-wider cursor-pointer transition-all"
                style={{
                  color: activeTab === tab ? "#2d2a26" : "rgba(80,70,60,0.45)",
                  borderBottom: activeTab === tab ? `2px solid ${role.brandColor}` : "2px solid transparent",
                  background: activeTab === tab ? `${role.brandColor}06` : "transparent",
                }}>
                {tab === "story" ? "📖 Quest" : tab === "boss" ? "⚔️ Boss" : tab === "loot" ? "🏆 Loot" : "⚡ Stack"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="rounded-b-xl p-5 max-h-[55vh] overflow-y-auto"
            style={{ background: "#fefcf9", border: "1px solid rgba(180,140,100,0.1)", borderTop: "none" }}>
            <AnimatePresence mode="wait">
              {activeTab === "story" && (
                <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="font-body text-sm italic leading-relaxed mb-4" style={{ color: "rgba(45,42,38,0.8)" }}>
                    "{role.narrative}"
                  </p>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: role.brandColor }}>
                      🎯 Skills Unlocked
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.skillsUnlocked.map(s => (
                        <span key={s} className="text-[11px] font-mono px-2.5 py-1 rounded"
                          style={{ color: role.brandColor, background: `${role.brandColor}08`, border: `1px solid ${role.brandColor}18` }}>
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "boss" && (
                <motion.div key="boss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="rounded-lg p-5 mb-4" style={{ background: "rgba(228,77,38,0.04)", border: "1px solid rgba(228,77,38,0.15)" }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "#E44D26" }}>
                      ⚔️ Boss Challenge
                    </p>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(45,42,38,0.8)" }}>
                      {role.bossChallenge}
                    </p>
                  </div>
                  <div className="rounded-lg p-4" style={{ background: "rgba(42,125,79,0.04)", border: "1px solid rgba(42,125,79,0.15)" }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "#2a7d4f" }}>
                      ✅ Result
                    </p>
                    <p className="text-sm font-mono font-bold" style={{ color: "#2a7d4f" }}>{role.impactMetric}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === "loot" && (
                <motion.div key="loot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: role.brandColor }}>
                    🏆 Achievements Unlocked
                  </p>
                  <div className="space-y-2">
                    {role.loot.map((l, i) => (
                      <motion.div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        style={{ background: `${role.brandColor}04`, border: `1px solid ${role.brandColor}10` }}>
                        <span className="text-sm">🎖️</span>
                        <span className="text-xs font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{l}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "tech" && (
                <motion.div key="tech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-3 gap-2">
                    {role.techStack.map((t, i) => (
                      <motion.div key={t} className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                        style={{ background: `${role.brandColor}06`, border: `1px solid ${role.brandColor}12` }}>
                        <span className="text-xs" style={{ color: role.brandColor }}>◆</span>
                        <span className="text-xs font-mono" style={{ color: role.brandColor }}>{t}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerTimelineWorld;
