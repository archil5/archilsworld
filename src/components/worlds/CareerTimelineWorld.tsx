import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brandLogos } from "@/data/brandLogos";

interface Milestone {
  title: string;
  desc: string;
  icon: string;
}

interface TimelineRole {
  company: string;
  title: string;
  period: string;
  narrative: string;
  color: string;
  icon: string;
  brandColor: string;
  techStack: string[];
  skillsGained: string[];
  milestones: Milestone[];
  valueDelivered: string[];
  gameMechanic: string;
  mechanicIcon: string;
}

const roles: TimelineRole[] = [
  {
    company: "RBC", title: "DevOps Engineer — Cyber Security",
    period: "Sep–Dec 2018", icon: "🛡️", color: "#005DAA", brandColor: "#005DAA",
    gameMechanic: "First Placement", mechanicIcon: "♟️",
    narrative: "My first move on the board. I walked into one of the largest banks in the country and built automation for cybersecurity compliance. Trial by fire in enterprise-grade security.",
    techStack: ["Ansible", "Python", "Jenkins", "Palo Alto Firewalls", "Splunk", "Linux"],
    skillsGained: ["Security Automation", "Configuration Management", "CI Pipeline Design", "Compliance Scripting"],
    milestones: [
      { title: "First Enterprise Code", desc: "Deployed automation to production within first month", icon: "🚀" },
      { title: "Firewall Automation", desc: "Automated Palo Alto firewall rule management", icon: "🔥" },
      { title: "Compliance Engine", desc: "Built compliance checking scripts saving 20+ hours/week", icon: "⚡" },
    ],
    valueDelivered: [
      "Automated cybersecurity compliance checks across 500+ endpoints",
      "Reduced manual firewall audit time by 60%",
      "Introduced Ansible-based config management to the security team",
    ],
  },
  {
    company: "BMO", title: "Cloud Infrastructure Engineer",
    period: "Mar 2019–May 2020", icon: "☁️", color: "#0075BE", brandColor: "#0075BE",
    gameMechanic: "Resource Gathering", mechanicIcon: "💰",
    narrative: "The foundation year. High-pressure cloud migrations, wiring up network connectivity, establishing Infrastructure as Code as the standard.",
    techStack: ["AWS", "Azure", "Terraform", "CloudFormation", "Python", "Bash", "Jenkins", "Ansible", "Docker"],
    skillsGained: ["Cloud Architecture", "IaC", "Network Design", "Migration Strategy", "Cost Optimization"],
    milestones: [
      { title: "First Cloud Migration", desc: "Migrated 15 workloads from on-prem to AWS", icon: "☁️" },
      { title: "IaC Standard", desc: "Established Terraform as the bank's IaC standard", icon: "📜" },
      { title: "Network Wiring", desc: "Designed VPC peering & Transit Gateway architecture", icon: "🔌" },
    ],
    valueDelivered: [
      "Migrated 50+ applications to cloud, zero downtime",
      "Reduced infrastructure provisioning from weeks to hours",
      "Established IaC patterns adopted by 10+ teams",
      "Cut cloud costs by 30% through right-sizing and reserved instances",
    ],
  },
  {
    company: "BMO", title: "Senior Cloud Engineer",
    period: "Jun 2020–Apr 2021", icon: "📐", color: "#0075BE", brandColor: "#0075BE",
    gameMechanic: "Strategy Phase", mechanicIcon: "🗺️",
    narrative: "I stopped building and started designing. The pivot from implementation to architecture — translating infrastructure complexity into decisions that leadership could act on.",
    techStack: ["AWS", "Azure", "Terraform", "Kubernetes", "Helm", "Datadog", "PagerDuty", "Confluence"],
    skillsGained: ["Solution Architecture", "Technical Consulting", "SLA Design", "Stakeholder Management", "Capacity Planning"],
    milestones: [
      { title: "Architecture Reviews", desc: "Became the go-to reviewer for all cloud designs", icon: "📐" },
      { title: "SLA Framework", desc: "Designed SLA tiers adopted across all cloud workloads", icon: "📊" },
      { title: "Cost Dashboard", desc: "Built real-time cost visibility for 200+ accounts", icon: "💡" },
    ],
    valueDelivered: [
      "Designed architecture patterns reducing deployment failures by 40%",
      "Translated technical complexity into executive-ready decision frameworks",
      "Established SLA optimization program saving $2M annually",
    ],
  },
  {
    company: "BMO", title: "Team Lead",
    period: "May 2021–Jul 2022", icon: "👥", color: "#0075BE", brandColor: "#0075BE",
    gameMechanic: "Alliance Building", mechanicIcon: "🤝",
    narrative: "Leading the squad. We turned container deployments from days into hours. Built CI/CD pipelines that sailed through audits with zero critical findings.",
    techStack: ["Kubernetes", "EKS", "Docker", "Terraform", "GitHub Actions", "ArgoCD", "Vault", "Istio"],
    skillsGained: ["Team Leadership", "Mentoring", "Agile/Scrum", "Security Automation", "Audit Readiness"],
    milestones: [
      { title: "Team Formation", desc: "Built and led a team of 6 cloud engineers", icon: "👥" },
      { title: "Zero Audit Findings", desc: "CI/CD pipelines passed audit with zero critical findings", icon: "✅" },
      { title: "Deployment Velocity", desc: "Container deployments: days → hours", icon: "⚡" },
    ],
    valueDelivered: [
      "Led team of 6 engineers, 100% retention rate",
      "Reduced container deployment time from 5 days to 2 hours",
      "Achieved zero critical audit findings across all pipelines",
      "Mentored 3 engineers to senior-level promotions",
    ],
  },
  {
    company: "BMO", title: "Principal — Serverless & Containers",
    period: "Jul 2022–Aug 2025", icon: "🏗️", color: "#FF9900", brandColor: "#FF9900",
    gameMechanic: "Empire Building", mechanicIcon: "🏰",
    narrative: "Owning the platform. Multi-region architectures supporting thousands of developers. Led the shift from a 'servers' mindset to a 'services' mindset.",
    techStack: ["Kubernetes", "EKS", "Lambda", "Step Functions", "API Gateway", "Terraform", "CDK", "Datadog", "Grafana", "Prometheus"],
    skillsGained: ["Platform Engineering", "Multi-Region Design", "Developer Experience", "Serverless Patterns", "Capacity at Scale"],
    milestones: [
      { title: "Multi-Region", desc: "Architected active-active multi-region platform", icon: "🌍" },
      { title: "1000+ Developers", desc: "Platform serving 1000+ developers across the bank", icon: "👨‍💻" },
      { title: "Servers → Services", desc: "Led cultural + technical shift to serverless-first", icon: "🔄" },
      { title: "Golden Paths", desc: "Created standardized deployment blueprints", icon: "✨" },
    ],
    valueDelivered: [
      "Architected platform supporting 1000+ developers across BMO",
      "Reduced infrastructure complexity by 60% via serverless patterns",
      "Designed multi-region active-active architecture for critical services",
      "Created golden-path templates reducing new service setup from weeks to minutes",
    ],
  },
  {
    company: "BMO", title: "Principal — AI",
    period: "Jun 2025–Present", icon: "🤖", color: "#0078D4", brandColor: "#0078D4",
    gameMechanic: "The Frontier", mechanicIcon: "🧠",
    narrative: "Architecting the secure backbone for enterprise AI. Azure-based AI platforms integrating enterprise data services under strict model governance.",
    techStack: ["Azure OpenAI", "Azure AI Studio", "LangChain", "Vector DBs", "Kubernetes", "MLflow", "Terraform", "Python"],
    skillsGained: ["RAG Architecture", "MLOps", "LLMOps", "Model Governance", "AI Security", "Prompt Engineering"],
    milestones: [
      { title: "AI Platform", desc: "Designed enterprise AI platform architecture", icon: "🧠" },
      { title: "Model Governance", desc: "Built governance framework for LLM deployment", icon: "📋" },
      { title: "RAG Pipeline", desc: "Architected retrieval-augmented generation at scale", icon: "🔗" },
    ],
    valueDelivered: [
      "Architecting secure enterprise AI platform for Canada's 4th largest bank",
      "Designed model governance framework ensuring compliance with banking regulations",
      "Building RAG pipelines integrating petabytes of enterprise data",
      "Establishing AI security standards adopted organization-wide",
    ],
  },
];

const CareerTimelineWorld = ({ startRole }: { startRole?: string }) => {
  const [activeRole, setActiveRole] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [activeTab, setActiveTab] = useState<"story" | "tech" | "milestones" | "value" | "all">("story");
  const [revealedMilestones, setRevealedMilestones] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (startRole) {
      const map: Record<string, number> = {
        rbc: 0, "bmo-infra": 1, "bmo-senior": 2,
        "bmo-lead": 3, "bmo-principal": 4, "bmo-ai": 5,
      };
      setActiveRole(map[startRole] ?? 0);
    }
  }, [startRole]);

  useEffect(() => {
    const timers = roles.map((_, i) =>
      setTimeout(() => setRevealed(i + 1), 300 + i * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setActiveTab("story");
    setRevealedMilestones(new Set());
  }, [activeRole]);

  const role = roles[activeRole];

  const handleFlipMilestone = (idx: number) => {
    setRevealedMilestones(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleShowAll = () => {
    setActiveTab("all");
    setRevealedMilestones(new Set(role.milestones.map((_, i) => i)));
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full items-start">
        {/* Timeline rail */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar py-2 lg:min-w-[180px]">
          {roles.slice(0, revealed).map((r, i) => (
            <motion.button
              key={i}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer"
              onClick={() => setActiveRole(i)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: i === activeRole ? `${r.brandColor}10` : "#fefcf9",
                border: `1px solid ${i === activeRole ? `${r.brandColor}40` : "rgba(180,140,100,0.12)"}`,
                boxShadow: i === activeRole ? `0 2px 12px ${r.brandColor}12` : "none",
              }}
            >
              {brandLogos[r.company] ? (
                <img src={brandLogos[r.company]} alt={r.company} className="h-4 object-contain" />
              ) : (
                <span className="text-sm font-bold px-1.5 py-0.5 rounded" style={{
                  color: "#fff", background: r.brandColor, fontSize: "9px",
                }}>{r.company}</span>
              )}
              <div className="text-left">
                <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.45)" }}>{r.period}</p>
                <p className="text-xs font-display whitespace-nowrap" style={{ color: i === activeRole ? "#2d2a26" : "rgba(80,70,60,0.45)" }}>
                  {r.mechanicIcon} {r.gameMechanic}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active role detail */}
        <motion.div
          key={activeRole}
          className="flex-1 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {/* Header */}
          <div className="rounded-t-xl px-6 py-4" style={{ background: `${role.brandColor}08`, borderBottom: `1px solid ${role.brandColor}20` }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold px-2 py-1 rounded" style={{
                color: "#fff",
                background: role.brandColor,
              }}>{role.company}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: `${role.brandColor}10`, color: role.brandColor }}>
                    {role.mechanicIcon} {role.gameMechanic}
                  </span>
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold" style={{ color: "#2d2a26" }}>{role.title}</h3>
                <p className="font-mono text-xs" style={{ color: "rgba(80,70,60,0.45)" }}>{role.period}</p>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex" style={{ background: "#fefcf9", borderLeft: "1px solid rgba(180,140,100,0.1)", borderRight: "1px solid rgba(180,140,100,0.1)" }}>
            {(["story", "tech", "milestones", "value"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 text-[11px] font-mono uppercase tracking-wider cursor-pointer transition-all"
                style={{
                  color: activeTab === tab || (activeTab === "all") ? "#2d2a26" : "rgba(80,70,60,0.3)",
                  borderBottom: activeTab === tab ? `2px solid ${role.brandColor}` : "2px solid transparent",
                  background: activeTab === tab ? `${role.brandColor}06` : "transparent",
                }}>
                {tab === "story" ? "📖 Story" : tab === "tech" ? "⚡ Stack" : tab === "milestones" ? "🏆 Wins" : "💎 Value"}
              </button>
            ))}
            <button onClick={handleShowAll}
              className="px-3 py-2.5 text-[11px] font-mono uppercase tracking-wider cursor-pointer transition-all"
              style={{
                color: activeTab === "all" ? "#b5653a" : "rgba(181,101,58,0.35)",
                borderBottom: activeTab === "all" ? "2px solid #b5653a" : "2px solid transparent",
                background: activeTab === "all" ? "rgba(181,101,58,0.04)" : "transparent",
              }}>
              ⚡ All
            </button>
          </div>

          {/* Tab content */}
          <div className="rounded-b-xl p-6 max-h-[60vh] overflow-y-auto" style={{ background: "#fefcf9", border: `1px solid rgba(180,140,100,0.1)`, borderTop: "none" }}>
            <AnimatePresence mode="wait">
              {activeTab === "story" && (
                <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="font-body text-base italic leading-relaxed mb-4" style={{ color: "rgba(45,42,38,0.8)" }}>
                    "{role.narrative}"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.skillsGained.map(skill => (
                      <span key={skill} className="text-[11px] font-mono px-2.5 py-1 rounded"
                        style={{ color: role.brandColor, background: `${role.brandColor}08`, border: `1px solid ${role.brandColor}18` }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "tech" && (
                <motion.div key="tech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-3 gap-2">
                    {role.techStack.map((tech, i) => (
                      <motion.div key={tech} className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                        style={{ background: `${role.brandColor}06`, border: `1px solid ${role.brandColor}15` }}>
                        <span className="text-xs" style={{ color: role.brandColor }}>◆</span>
                        <span className="text-xs font-mono" style={{ color: role.brandColor }}>{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "milestones" && (
                <motion.div key="milestones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.3)" }}>Click cards to reveal</p>
                    {revealedMilestones.size < role.milestones.length && (
                      <button onClick={() => setRevealedMilestones(new Set(role.milestones.map((_, i) => i)))}
                        className="text-[10px] font-mono px-2 py-1 rounded cursor-pointer"
                        style={{ color: "#b5653a", background: "rgba(181,101,58,0.06)", border: "1px solid rgba(181,101,58,0.15)" }}>
                        ⚡ Flip All
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {role.milestones.map((m, i) => {
                      const flipped = revealedMilestones.has(i);
                      return (
                        <motion.div key={i} className="cursor-pointer rounded-lg p-4 min-h-[80px] flex items-center justify-center"
                          onClick={() => handleFlipMilestone(i)}
                          initial={{ opacity: 0, rotateY: 180 }} animate={{ opacity: 1, rotateY: flipped ? 0 : 180 }}
                          transition={{ duration: 0.5, type: "spring" }}
                          style={{
                            background: flipped ? `${role.brandColor}06` : "rgba(180,140,100,0.04)",
                            border: `1px solid ${flipped ? `${role.brandColor}20` : "rgba(180,140,100,0.1)"}`,
                          }}>
                          {flipped ? (
                            <div className="text-center">
                              <span className="text-2xl">{m.icon}</span>
                              <p className="text-xs font-display mt-1" style={{ color: "#2d2a26" }}>{m.title}</p>
                              <p className="text-[10px] font-body mt-1" style={{ color: "rgba(45,42,38,0.6)" }}>{m.desc}</p>
                            </div>
                          ) : (
                            <div className="text-center" style={{ transform: "rotateY(180deg)" }}>
                              <span className="text-2xl">🎴</span>
                              <p className="text-[10px] font-mono mt-1" style={{ color: "rgba(80,70,60,0.3)" }}>Click to reveal</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "value" && (
                <motion.div key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {role.valueDelivered.map((v, i) => (
                    <motion.div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                      initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                      style={{ background: "rgba(80,70,60,0.03)", border: "1px solid rgba(180,140,100,0.1)" }}>
                      <span className="text-sm mt-0.5">💎</span>
                      <span className="text-sm font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{v}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "all" && (
                <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: role.brandColor }}>📖 Story</p>
                    <p className="font-body text-base italic leading-relaxed" style={{ color: "rgba(45,42,38,0.8)" }}>
                      "{role.narrative}"
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: role.brandColor }}>⚡ Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {role.techStack.map(tech => (
                        <span key={tech} className="text-[11px] font-mono px-2.5 py-1 rounded"
                          style={{ color: role.brandColor, background: `${role.brandColor}08`, border: `1px solid ${role.brandColor}15` }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: role.brandColor }}>🎯 Skills Gained</p>
                    <div className="flex flex-wrap gap-2">
                      {role.skillsGained.map(skill => (
                        <span key={skill} className="text-[11px] font-mono px-2.5 py-1 rounded"
                          style={{ color: "#2d2a26", background: "rgba(80,70,60,0.05)", border: "1px solid rgba(180,140,100,0.12)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: role.brandColor }}>🏆 Key Wins</p>
                    <div className="space-y-2">
                      {role.milestones.map((m, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded"
                          style={{ background: `${role.brandColor}05`, border: `1px solid ${role.brandColor}10` }}>
                          <span className="text-lg">{m.icon}</span>
                          <div>
                            <p className="text-xs font-display" style={{ color: "#2d2a26" }}>{m.title}</p>
                            <p className="text-[10px] font-body" style={{ color: "rgba(45,42,38,0.6)" }}>{m.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "#b5653a" }}>💎 Value Delivered</p>
                    <div className="space-y-2">
                      {role.valueDelivered.map((v, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded"
                          style={{ background: "rgba(181,101,58,0.03)", border: "1px solid rgba(181,101,58,0.08)" }}>
                          <span className="text-xs mt-0.5">◆</span>
                          <span className="text-xs font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {activeRole < roles.length - 1 && (
            <motion.button
              className="mt-3 text-xs font-display tracking-wider flex items-center gap-2 mx-auto cursor-pointer"
              style={{ color: "rgba(80,70,60,0.4)" }}
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
