import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { brandLogos } from "@/data/brandLogos";

interface RolePuzzle {
  title: string;
  prompt: string;
  steps: string[];
  success: string;
}

interface JourneyStop {
  company: string;
  title: string;
  period: string;
  color: string;
  narrative: string;
  challenge: string;
  impact: string;
  techStack: string[];
  wins: string[];
  puzzle: RolePuzzle;
}

const stops: JourneyStop[] = [
  {
    company: "RBC", title: "DevOps Engineer — Cyber Security",
    period: "Sep–Dec 2018", color: "#005DAA",
    narrative: "First deployment into the field. Built automation for cybersecurity compliance at one of the largest banks in the country.",
    challenge: "500+ endpoints with manual compliance checks",
    impact: "60% reduction in firewall audit time",
    techStack: ["Ansible", "Python", "Jenkins", "Splunk", "Palo Alto", "Linux"],
    wins: ["Automated compliance across 500+ endpoints", "Reduced firewall audit time by 60%", "Introduced Ansible to the security team"],
    puzzle: {
      title: "Compliance Automation Flow",
      prompt: "Place the automation flow in the order I implemented it at RBC.",
      steps: ["Discover endpoint config drift", "Run Ansible compliance playbooks", "Aggregate logs in Splunk", "Generate firewall audit report"],
      success: "This workflow is exactly what cut manual audit effort and produced consistent compliance evidence.",
    },
  },
  {
    company: "BMO", title: "Cloud Infrastructure Engineer",
    period: "Mar 2019–May 2020", color: "#0075BE",
    narrative: "The foundation year. High-pressure cloud migrations, wiring up network connectivity, establishing Infrastructure as Code as the standard.",
    challenge: "Migrate 50+ legacy apps to cloud with zero downtime",
    impact: "50+ apps migrated, zero downtime",
    techStack: ["AWS", "Azure", "Terraform", "CloudFormation", "Docker", "Jenkins"],
    wins: ["Provisioning: weeks → hours", "IaC patterns adopted by 10+ teams", "30% cloud cost reduction"],
    puzzle: {
      title: "Migration Sequencer",
      prompt: "Order the migration plan that enabled zero-downtime cutovers.",
      steps: ["Baseline dependency map", "Provision target infra with Terraform", "Run parallel validation + traffic shadowing", "Execute staged DNS cutover"],
      success: "This playbook let teams migrate safely while keeping customer-facing systems online.",
    },
  },
  {
    company: "BMO", title: "Senior Cloud Engineer",
    period: "Jun 2020–Apr 2021", color: "#0075BE",
    narrative: "Stopped building, started designing. The pivot from implementation to architecture — translating complexity into leadership decisions.",
    challenge: "200+ cloud accounts with no unified standards",
    impact: "$2M annual savings from SLA program",
    techStack: ["AWS", "Azure", "Kubernetes", "Helm", "Datadog", "Confluence"],
    wins: ["Architecture patterns reducing failures by 40%", "Executive-ready decision frameworks", "SLA program saving $2M/year"],
    puzzle: {
      title: "Multi-Account Governance Puzzle",
      prompt: "Arrange the controls that stabilized 200+ cloud accounts.",
      steps: ["Define account archetypes + ownership", "Apply baseline policies/guardrails", "Centralize observability + tagging", "Enforce SLA scorecards and reviews"],
      success: "That governance stack transformed fragmented cloud estates into a measurable operating model.",
    },
  },
  {
    company: "BMO", title: "Team Lead",
    period: "May 2021–Jul 2022", color: "#0075BE",
    narrative: "Leading the squad. Container deployments from days to hours. Pipelines that sailed through audits with zero critical findings.",
    challenge: "Container platform with 5-day deploy cycles",
    impact: "Deployments: 5 days → 2 hours",
    techStack: ["Kubernetes", "EKS", "GitHub Actions", "ArgoCD", "Vault", "Istio"],
    wins: ["Led team of 6, 100% retention", "Zero critical audit findings", "3 engineers promoted to senior"],
    puzzle: {
      title: "CI/CD Pipeline Builder",
      prompt: "Build the delivery pipeline order that moved deploys from 5 days to 2 hours.",
      steps: ["Build + scan container image", "Run integration/security gates", "Promote via GitOps to EKS", "Post-deploy health + rollback checks"],
      success: "This pipeline pattern was the engine behind faster releases and clean audits.",
    },
  },
  {
    company: "BMO", title: "Principal — Serverless & Containers",
    period: "Jul 2022–Aug 2025", color: "#FF9900",
    narrative: "Owning the platform. Multi-region architectures serving 1000+ developers. Led the cultural shift from servers to services.",
    challenge: "Scale platform for 1000+ devs bank-wide",
    impact: "Platform serving 1000+ developers",
    techStack: ["EKS", "Lambda", "Step Functions", "API Gateway", "CDK", "Grafana"],
    wins: ["60% complexity reduction via serverless", "Multi-region active-active", "Golden-path templates: weeks → minutes"],
    puzzle: {
      title: "Platform Scale Puzzle",
      prompt: "Put the platform scaling strategy in the right sequence.",
      steps: ["Define golden-path templates", "Automate environment bootstrapping", "Deploy active-active multi-region", "Publish developer self-serve workflows"],
      success: "This is how we scaled reliability and speed across 1000+ engineers.",
    },
  },
  {
    company: "BMO", title: "Principal — AI",
    period: "Jun 2025–Present", color: "#0078D4",
    narrative: "The frontier. Architecting the secure backbone for enterprise AI — Azure-based platforms with strict model governance.",
    challenge: "Build secure AI platform under banking regs",
    impact: "Enterprise AI at scale",
    techStack: ["Azure OpenAI", "AI Studio", "LangChain", "Vector DBs", "MLflow", "Python"],
    wins: ["Enterprise AI platform architecture", "Model governance framework", "RAG at petabyte scale", "AI security standards org-wide"],
    puzzle: {
      title: "AI Governance Workflow",
      prompt: "Sequence the controls used to ship enterprise AI safely.",
      steps: ["Model intake + risk classification", "Guardrail and policy enforcement", "RAG evaluation + red-team testing", "Production monitoring + governance review"],
      success: "These controls made AI adoption possible without compromising banking-grade security.",
    },
  },
];

const shuffle = <T,>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const CareerTimelineWorld = () => {
  const [activeStop, setActiveStop] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [panel, setPanel] = useState<"overview" | "puzzle">("overview");

  const [poolSteps, setPoolSteps] = useState<string[]>([]);
  const [pickedSteps, setPickedSteps] = useState<string[]>([]);
  const [wrongStep, setWrongStep] = useState<string | null>(null);
  const [solvedStops, setSolvedStops] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers = stops.map((_, i) => setTimeout(() => setRevealed(i + 1), 200 + i * 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const steps = stops[activeStop].puzzle.steps;
    setPoolSteps(shuffle(steps));
    setPickedSteps([]);
    setWrongStep(null);
    setPanel("overview");
  }, [activeStop]);

  const stop = stops[activeStop];
  const expected = stop.puzzle.steps[pickedSteps.length];
  const puzzleSolved = solvedStops.has(activeStop);

  const handlePickStep = (step: string) => {
    if (puzzleSolved) return;

    if (step === expected) {
      const next = [...pickedSteps, step];
      setPickedSteps(next);
      setPoolSteps(prev => prev.filter(s => s !== step));

      if (next.length === stop.puzzle.steps.length) {
        setSolvedStops(prev => new Set(prev).add(activeStop));
      }
      return;
    }

    setWrongStep(step);
    setTimeout(() => setWrongStep(null), 500);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="w-full max-w-5xl mb-6">
        <div className="relative">
          <div className="absolute top-[28px] left-0 right-0 h-[3px] rounded-full" style={{ background: "rgba(180,140,100,0.15)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: stop.color }}
              initial={{ width: 0 }}
              animate={{ width: `${((activeStop + 1) / stops.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-between items-start relative z-10 px-2">
            {stops.slice(0, revealed).map((s, i) => {
              const isActive = i === activeStop;
              const isPast = i < activeStop;
              const isSolved = solvedStops.has(i);

              return (
                <motion.button
                  key={i}
                  className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 px-1"
                  onClick={() => setActiveStop(i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ minWidth: 70 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                    transition={isActive ? { repeat: Infinity, duration: 2.5 } : {}}
                    style={{
                      background: isActive ? `${s.color}12` : isPast ? `${s.color}06` : "#fefcf9",
                      border: `3px solid ${isActive ? s.color : isPast ? `${s.color}50` : "rgba(180,140,100,0.2)"}`,
                      boxShadow: isActive ? `0 0 16px ${s.color}20` : "none",
                    }}
                  >
                    {brandLogos[s.company] ? (
                      <img src={brandLogos[s.company]} alt={s.company} className="h-5 object-contain" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.company}</span>
                    )}
                    {isSolved && <span className="absolute -bottom-1 -right-1 text-[9px] px-1 rounded" style={{ background: "#2a7d4f", color: "#fff" }}>✓</span>}
                  </motion.div>
                  <span className="text-[8px] font-mono text-center" style={{ color: isActive ? "#2d2a26" : "rgba(80,70,60,0.4)" }}>
                    {s.period.split("–")[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStop}
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${stop.color}20` }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: `${stop.color}06`, borderBottom: `1px solid ${stop.color}12` }}>
              <div className="flex items-center gap-3">
                {brandLogos[stop.company] && <img src={brandLogos[stop.company]} alt={stop.company} className="h-6 object-contain" />}
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: "#2d2a26" }}>{stop.title}</h3>
                  <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.55)" }}>{stop.period}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPanel("overview")}
                  className="text-[10px] font-mono px-2.5 py-1 rounded"
                  style={{
                    color: panel === "overview" ? stop.color : "rgba(80,70,60,0.55)",
                    background: panel === "overview" ? `${stop.color}10` : "rgba(180,140,100,0.04)",
                    border: `1px solid ${panel === "overview" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}`,
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setPanel("puzzle")}
                  className="text-[10px] font-mono px-2.5 py-1 rounded"
                  style={{
                    color: panel === "puzzle" ? stop.color : "rgba(80,70,60,0.55)",
                    background: panel === "puzzle" ? `${stop.color}10` : "rgba(180,140,100,0.04)",
                    border: `1px solid ${panel === "puzzle" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}`,
                  }}
                >
                  Role Puzzle
                </button>
              </div>
            </div>

            {panel === "overview" ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5" style={{ background: "#fefcf9" }}>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-wider mb-1.5" style={{ color: stop.color }}>The Story</p>
                    <p className="text-sm font-body italic leading-relaxed" style={{ color: "rgba(45,42,38,0.8)" }}>
                      "{stop.narrative}"
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "rgba(228,77,38,0.04)", border: "1px solid rgba(228,77,38,0.1)" }}>
                    <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#c0553a" }}>Challenge</p>
                    <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.75)" }}>{stop.challenge}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: `${stop.color}08`, border: `1px solid ${stop.color}15` }}>
                    <p className="text-[9px] font-mono uppercase mb-1" style={{ color: stop.color }}>Impact</p>
                    <p className="text-xs font-mono font-bold" style={{ color: stop.color }}>{stop.impact}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: stop.color }}>Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {stop.techStack.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: `${stop.color}08`, border: `1px solid ${stop.color}15`, color: stop.color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: "#2a7d4f" }}>Key Wins</p>
                  <div className="space-y-2">
                    {stop.wins.map((w, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-lg"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        style={{ background: "rgba(42,125,79,0.04)", border: "1px solid rgba(42,125,79,0.1)" }}
                      >
                        <span className="text-[10px] mt-0.5" style={{ color: "#2a7d4f" }}>▸</span>
                        <span className="text-xs font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{w}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4" style={{ background: "#fefcf9" }}>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: stop.color }}>{stop.puzzle.title}</p>
                  <p className="text-sm font-body mt-1" style={{ color: "rgba(45,42,38,0.75)" }}>{stop.puzzle.prompt}</p>
                </div>

                <div className="rounded-lg p-3" style={{ background: `${stop.color}06`, border: `1px solid ${stop.color}15` }}>
                  <p className="text-[9px] font-mono mb-2" style={{ color: "rgba(80,70,60,0.55)" }}>
                    Progress: {pickedSteps.length}/{stop.puzzle.steps.length}
                  </p>
                  <div className="space-y-2">
                    {pickedSteps.map((step, i) => (
                      <div key={step} className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
                        <span className="text-[10px] font-mono w-5 h-5 rounded flex items-center justify-center" style={{ background: "#2a7d4f", color: "#fff" }}>{i + 1}</span>
                        <span className="text-xs font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{step}</span>
                      </div>
                    ))}
                    {!puzzleSolved && (
                      <div className="px-3 py-2 rounded border border-dashed" style={{ borderColor: "rgba(180,140,100,0.25)", color: "rgba(80,70,60,0.45)" }}>
                        <span className="text-[10px] font-mono">Next: choose the correct next step</span>
                      </div>
                    )}
                  </div>
                </div>

                {!puzzleSolved && (
                  <div className="flex flex-wrap gap-2">
                    {poolSteps.map((step) => {
                      const wrong = wrongStep === step;
                      return (
                        <motion.button
                          key={step}
                          onClick={() => handlePickStep(step)}
                          className="text-xs font-body px-3 py-2 rounded cursor-pointer"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          animate={wrong ? { x: [0, -6, 6, -3, 3, 0] } : {}}
                          style={{
                            background: wrong ? "rgba(220,50,50,0.08)" : "#fff",
                            color: wrong ? "#dc3232" : "rgba(45,42,38,0.8)",
                            border: `1px solid ${wrong ? "rgba(220,50,50,0.3)" : "rgba(180,140,100,0.18)"}`,
                          }}
                        >
                          {step}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {puzzleSolved && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-3"
                    style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}
                  >
                    <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>Solved</p>
                    <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{stop.puzzle.success}</p>
                  </motion.div>
                )}
              </div>
            )}

            <div className="px-6 py-3 flex justify-between items-center" style={{ background: "rgba(180,140,100,0.03)", borderTop: "1px solid rgba(180,140,100,0.08)" }}>
              <button
                onClick={() => setActiveStop(Math.max(0, activeStop - 1))}
                disabled={activeStop === 0}
                className="flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all disabled:opacity-30"
                style={{ color: "#6b6560", background: "rgba(180,140,100,0.06)", border: "1px solid rgba(180,140,100,0.12)" }}
              >
                <ChevronLeft size={12} /> Previous
              </button>
              <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.35)" }}>
                {activeStop + 1} / {stops.length}
              </span>
              <button
                onClick={() => setActiveStop(Math.min(stops.length - 1, activeStop + 1))}
                disabled={activeStop === stops.length - 1}
                className="flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all disabled:opacity-30"
                style={{ color: "#6b6560", background: "rgba(180,140,100,0.06)", border: "1px solid rgba(180,140,100,0.12)" }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CareerTimelineWorld;
