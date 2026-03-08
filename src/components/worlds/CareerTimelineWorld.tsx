import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { brandLogos } from "@/data/brandLogos";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

interface NodeData {
  id: string;
  label: string;
  /** Grid position for layout — col (0-3), row (0-1) */
  col: number;
  row: number;
}

interface RolePuzzle {
  title: string;
  prompt: string;
  nodes: NodeData[];
  /** Correct sequence of node IDs */
  sequence: string[];
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
      prompt: "Connect the nodes to trace how I automated firewall compliance at RBC.",
      nodes: [
        { id: "drift", label: "Config Drift Scanner", col: 0, row: 0 },
        { id: "ansible", label: "Ansible Playbooks", col: 1, row: 1 },
        { id: "splunk", label: "Splunk Aggregator", col: 2, row: 0 },
        { id: "report", label: "Audit Report", col: 3, row: 1 },
      ],
      sequence: ["drift", "ansible", "splunk", "report"],
      success: "This flow is exactly what cut manual audit effort by 60% and produced consistent compliance evidence.",
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
      title: "Migration Pipeline",
      prompt: "Connect the architecture flow that enabled zero-downtime cloud migration.",
      nodes: [
        { id: "deps", label: "Dependency Map", col: 0, row: 1 },
        { id: "tf", label: "Terraform Provision", col: 1, row: 0 },
        { id: "shadow", label: "Traffic Shadowing", col: 2, row: 1 },
        { id: "dns", label: "DNS Cutover", col: 3, row: 0 },
      ],
      sequence: ["deps", "tf", "shadow", "dns"],
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
      title: "Multi-Account Governance",
      prompt: "Connect the governance controls that stabilized 200+ cloud accounts.",
      nodes: [
        { id: "arch", label: "Account Archetypes", col: 0, row: 0 },
        { id: "guard", label: "Policy Guardrails", col: 1, row: 1 },
        { id: "obs", label: "Central Observability", col: 2, row: 0 },
        { id: "sla", label: "SLA Scorecards", col: 3, row: 1 },
      ],
      sequence: ["arch", "guard", "obs", "sla"],
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
      title: "CI/CD Pipeline",
      prompt: "Connect the delivery pipeline that moved deploys from 5 days to 2 hours.",
      nodes: [
        { id: "build", label: "Build + Scan", col: 0, row: 1 },
        { id: "gates", label: "Security Gates", col: 1, row: 0 },
        { id: "gitops", label: "GitOps → EKS", col: 2, row: 1 },
        { id: "health", label: "Health + Rollback", col: 3, row: 0 },
      ],
      sequence: ["build", "gates", "gitops", "health"],
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
      title: "Platform Scale Architecture",
      prompt: "Connect the platform strategy that scaled to 1000+ developers.",
      nodes: [
        { id: "golden", label: "Golden Templates", col: 0, row: 0 },
        { id: "bootstrap", label: "Auto Bootstrap", col: 1, row: 1 },
        { id: "multi", label: "Multi-Region", col: 2, row: 0 },
        { id: "selfserve", label: "Self-Serve Portal", col: 3, row: 1 },
      ],
      sequence: ["golden", "bootstrap", "multi", "selfserve"],
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
      title: "AI Governance Pipeline",
      prompt: "Connect the controls used to ship enterprise AI safely.",
      nodes: [
        { id: "intake", label: "Model Intake", col: 0, row: 1 },
        { id: "guardrail", label: "Guardrails", col: 1, row: 0 },
        { id: "redteam", label: "Red-Team Testing", col: 2, row: 1 },
        { id: "monitor", label: "Prod Monitoring", col: 3, row: 0 },
      ],
      sequence: ["intake", "guardrail", "redteam", "monitor"],
      success: "These controls made AI adoption possible without compromising banking-grade security.",
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   CONNECT-THE-NODES PUZZLE COMPONENT
   ═══════════════════════════════════════════════════════════ */

const NODE_W = 130;
const NODE_H = 56;
const GRID_GAP_X = 160;
const GRID_GAP_Y = 80;
const PAD_X = 30;
const PAD_Y = 30;

const getNodeCenter = (node: NodeData) => ({
  x: PAD_X + node.col * GRID_GAP_X + NODE_W / 2,
  y: PAD_Y + node.row * GRID_GAP_Y + NODE_H / 2,
});

const ConnectPuzzle = ({
  puzzle,
  color,
  solved,
  onSolve,
}: {
  puzzle: RolePuzzle;
  color: string;
  solved: boolean;
  onSolve: () => void;
}) => {
  const [connected, setConnected] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const svgW = PAD_X * 2 + (3) * GRID_GAP_X + NODE_W;
  const svgH = PAD_Y * 2 + GRID_GAP_Y + NODE_H;

  useEffect(() => {
    setConnected([]);
    setWrongId(null);
  }, [puzzle.title]);

  const nextExpected = puzzle.sequence[connected.length];
  const isDone = solved || connected.length === puzzle.sequence.length;

  const handleClick = (id: string) => {
    if (isDone) return;
    if (id === nextExpected) {
      const next = [...connected, id];
      setConnected(next);
      setWrongId(null);
      if (next.length === puzzle.sequence.length) onSolve();
    } else {
      setWrongId(id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const reset = () => {
    setConnected([]);
    setWrongId(null);
  };

  // Build line segments between connected nodes
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < connected.length; i++) {
    const from = puzzle.nodes.find(n => n.id === connected[i - 1])!;
    const to = puzzle.nodes.find(n => n.id === connected[i])!;
    const a = getNodeCenter(from);
    const b = getNodeCenter(to);
    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
          <p className="text-xs font-body mt-0.5" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>
        </div>
        {!isDone && (
          <button onClick={reset} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
            style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>
            Reset
          </button>
        )}
      </div>

      {/* Node canvas */}
      <div className="relative rounded-xl overflow-hidden" style={{ width: svgW, maxWidth: "100%", height: svgH, background: `${color}04`, border: `1px solid ${color}15` }}>
        {/* SVG lines */}
        <svg className="absolute inset-0" width={svgW} height={svgH} style={{ pointerEvents: "none" }}>
          {lines.map((l, i) => (
            <motion.line key={i}
              x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke={color} strokeWidth={2.5} strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}
          {/* Dots on connected nodes */}
          {connected.map((id, i) => {
            const node = puzzle.nodes.find(n => n.id === id)!;
            const c = getNodeCenter(node);
            return (
              <motion.circle key={id} cx={c.x} cy={c.y} r={5}
                fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {puzzle.nodes.map((node) => {
          const isConnected = connected.includes(node.id);
          const isNext = node.id === nextExpected;
          const isWrong = wrongId === node.id;
          const pos = { left: PAD_X + node.col * GRID_GAP_X, top: PAD_Y + node.row * GRID_GAP_Y };

          return (
            <motion.button
              key={node.id}
              className="absolute flex items-center justify-center rounded-lg cursor-pointer text-center"
              style={{
                left: pos.left, top: pos.top, width: NODE_W, height: NODE_H,
                background: isConnected ? `${color}15` : isWrong ? "rgba(220,50,50,0.08)" : "#fff",
                border: `2px solid ${isConnected ? color : isWrong ? "#dc3232" : isNext ? `${color}50` : "rgba(180,140,100,0.18)"}`,
                boxShadow: isConnected ? `0 2px 10px ${color}15` : isNext ? `0 0 12px ${color}10` : "0 1px 4px rgba(0,0,0,0.04)",
                zIndex: 2,
              }}
              onClick={() => handleClick(node.id)}
              whileHover={!isConnected && !isDone ? { scale: 1.06 } : {}}
              whileTap={!isConnected && !isDone ? { scale: 0.95 } : {}}
              animate={isWrong ? { x: [0, -5, 5, -3, 3, 0] } : isNext && !isDone ? { boxShadow: [`0 0 0px ${color}00`, `0 0 14px ${color}25`, `0 0 0px ${color}00`] } : {}}
              transition={isWrong ? { duration: 0.35 } : isNext ? { repeat: Infinity, duration: 2 } : {}}
            >
              <div>
                {isConnected && (
                  <span className="text-[8px] font-mono font-bold block mb-0.5" style={{ color }}>
                    {connected.indexOf(node.id) + 1}
                  </span>
                )}
                <span className="text-[10px] font-mono leading-tight" style={{ color: isConnected ? color : isWrong ? "#dc3232" : "#2d2a26" }}>
                  {node.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {puzzle.sequence.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < connected.length ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>Connected</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN CAREER WORLD
   ═══════════════════════════════════════════════════════════ */

const CareerTimelineWorld = ({ startRole }: { startRole?: string }) => {
  const [activeStop, setActiveStop] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [panel, setPanel] = useState<"overview" | "puzzle">("overview");
  const [solvedStops, setSolvedStops] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers = stops.map((_, i) => setTimeout(() => setRevealed(i + 1), 200 + i * 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!startRole) return;
    setActiveStop(startRole.toLowerCase() === "bmo" ? 1 : 0);
  }, [startRole]);

  useEffect(() => {
    setPanel("overview");
  }, [activeStop]);

  const stop = stops[activeStop];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Journey Path */}
      <div className="w-full max-w-5xl mb-6">
        <div className="relative">
          <div className="absolute top-[28px] left-0 right-0 h-[3px] rounded-full" style={{ background: "rgba(180,140,100,0.15)" }}>
            <motion.div className="h-full rounded-full" style={{ background: stop.color }}
              initial={{ width: 0 }} animate={{ width: `${((activeStop + 1) / stops.length) * 100}%` }}
              transition={{ duration: 0.5 }} />
          </div>

          <div className="flex justify-between items-start relative z-10 px-2">
            {stops.slice(0, revealed).map((s, i) => {
              const isActive = i === activeStop;
              const isPast = i < activeStop;
              const isSolved = solvedStops.has(i);
              return (
                <motion.button key={i}
                  className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 px-1"
                  onClick={() => setActiveStop(i)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ minWidth: 70 }}>
                  <motion.div className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                    transition={isActive ? { repeat: Infinity, duration: 2.5 } : {}}
                    style={{
                      background: isActive ? `${s.color}12` : isPast ? `${s.color}06` : "#fefcf9",
                      border: `3px solid ${isActive ? s.color : isPast ? `${s.color}50` : "rgba(180,140,100,0.2)"}`,
                      boxShadow: isActive ? `0 0 16px ${s.color}20` : "none",
                    }}>
                    {brandLogos[s.company] ? (
                      <img src={brandLogos[s.company]} alt={s.company} className="h-5 object-contain" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.company}</span>
                    )}
                    {isSolved && <span className="absolute -bottom-1 -right-1 text-[8px] px-1 rounded" style={{ background: "#2a7d4f", color: "#fff" }}>✓</span>}
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

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div key={activeStop} className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}>

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${stop.color}20` }}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: `${stop.color}06`, borderBottom: `1px solid ${stop.color}12` }}>
              <div className="flex items-center gap-3">
                {brandLogos[stop.company] && <img src={brandLogos[stop.company]} alt={stop.company} className="h-6 object-contain" />}
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: "#2d2a26" }}>{stop.title}</h3>
                  <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.55)" }}>{stop.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPanel("overview")}
                  className="text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{
                    color: panel === "overview" ? stop.color : "rgba(80,70,60,0.55)",
                    background: panel === "overview" ? `${stop.color}10` : "rgba(180,140,100,0.04)",
                    border: `1px solid ${panel === "overview" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}`,
                  }}>Overview</button>
                <button onClick={() => setPanel("puzzle")}
                  className="text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{
                    color: panel === "puzzle" ? stop.color : "rgba(80,70,60,0.55)",
                    background: panel === "puzzle" ? `${stop.color}10` : "rgba(180,140,100,0.04)",
                    border: `1px solid ${panel === "puzzle" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}`,
                  }}>Architect It</button>
              </div>
            </div>

            {panel === "overview" ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5" style={{ background: "#fefcf9" }}>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-wider mb-1.5" style={{ color: stop.color }}>The Story</p>
                    <p className="text-sm font-body italic leading-relaxed" style={{ color: "rgba(45,42,38,0.8)" }}>"{stop.narrative}"</p>
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
                      {stop.techStack.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{ background: `${stop.color}08`, border: `1px solid ${stop.color}15`, color: stop.color }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: "#2a7d4f" }}>Key Wins</p>
                  <div className="space-y-2">
                    {stop.wins.map((w, i) => (
                      <motion.div key={i} className="flex items-start gap-2 p-2.5 rounded-lg"
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                        style={{ background: "rgba(42,125,79,0.04)", border: "1px solid rgba(42,125,79,0.1)" }}>
                        <span className="text-[10px] mt-0.5" style={{ color: "#2a7d4f" }}>▸</span>
                        <span className="text-xs font-body" style={{ color: "rgba(45,42,38,0.8)" }}>{w}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6" style={{ background: "#fefcf9" }}>
                <ConnectPuzzle
                  puzzle={stop.puzzle}
                  color={stop.color}
                  solved={solvedStops.has(activeStop)}
                  onSolve={() => setSolvedStops(prev => new Set(prev).add(activeStop))}
                />
              </div>
            )}

            {/* Nav */}
            <div className="px-6 py-3 flex justify-between items-center"
              style={{ background: "rgba(180,140,100,0.03)", borderTop: "1px solid rgba(180,140,100,0.08)" }}>
              <button onClick={() => setActiveStop(Math.max(0, activeStop - 1))} disabled={activeStop === 0}
                className="flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all disabled:opacity-30"
                style={{ color: "#6b6560", background: "rgba(180,140,100,0.06)", border: "1px solid rgba(180,140,100,0.12)" }}>
                <ChevronLeft size={12} /> Previous
              </button>
              <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.35)" }}>{activeStop + 1} / {stops.length}</span>
              <button onClick={() => setActiveStop(Math.min(stops.length - 1, activeStop + 1))} disabled={activeStop === stops.length - 1}
                className="flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all disabled:opacity-30"
                style={{ color: "#6b6560", background: "rgba(180,140,100,0.06)", border: "1px solid rgba(180,140,100,0.12)" }}>
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
