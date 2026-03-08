import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Terminal, Network, Grid3X3, Workflow, BarChart3, Shield, Sparkles, Eye } from "lucide-react";
import { brandLogos } from "@/data/brandLogos";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

type PuzzleType = "terminal-seq" | "arch-flow" | "gov-matrix" | "pipeline" | "capacity" | "risk-assess";

interface BasePuzzle {
  type: PuzzleType;
  title: string;
  prompt: string;
  success: string;
}

// 1) Terminal Sequencer — click commands in order
interface TerminalPuzzle extends BasePuzzle {
  type: "terminal-seq";
  commands: { id: string; cmd: string; desc: string }[];
  correctOrder: string[];
}

// 2) Architecture Flow — connect nodes
interface ArchNode { id: string; label: string; col: number; row: number; tier?: string }
interface ArchFlowPuzzle extends BasePuzzle {
  type: "arch-flow";
  nodes: ArchNode[];
  sequence: string[];
  tiers: string[];
}

// 3) Governance Matrix — match pairs
interface GovMatrixPuzzle extends BasePuzzle {
  type: "gov-matrix";
  accounts: { id: string; name: string; desc: string }[];
  controls: { id: string; name: string }[];
  matches: Record<string, string>; // account → control
}

// 4) Pipeline Assembler — place stages
interface PipelineStage { id: string; label: string; icon: string; desc: string }
interface PipelinePuzzle extends BasePuzzle {
  type: "pipeline";
  stages: PipelineStage[];
  correctOrder: string[];
}

// 5) Capacity Planner — allocate to regions
interface Workload { id: string; name: string; cpu: number; mem: number; latReq: "low" | "med" | "high" }
interface Region { id: string; name: string; cpuCap: number; memCap: number; latency: "low" | "med" | "high" }
interface CapacityPuzzle extends BasePuzzle {
  type: "capacity";
  workloads: Workload[];
  regions: Region[];
  solution: Record<string, string>; // workload → region
}

// 6) Risk Assessment — approve/reject models
interface AIModel { id: string; name: string; attributes: Record<string, string>; safe: boolean; reason: string }
interface RiskAssessPuzzle extends BasePuzzle {
  type: "risk-assess";
  criteria: string[];
  models: AIModel[];
}

type RolePuzzle = TerminalPuzzle | ArchFlowPuzzle | GovMatrixPuzzle | PipelinePuzzle | CapacityPuzzle | RiskAssessPuzzle;

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

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

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
      type: "terminal-seq",
      title: "Compliance Automation Pipeline",
      prompt: "Build the security automation flow by executing commands in the right order. Each command represents a real step in the compliance pipeline I built.",
      commands: [
        { id: "scan", cmd: "$ ansible-playbook scan_drift.yml", desc: "Scan 500+ endpoints for config drift against CIS benchmarks" },
        { id: "parse", cmd: "$ python parse_findings.py --severity HIGH", desc: "Parse scan results, filter critical & high-severity findings" },
        { id: "remediate", cmd: "$ ansible-playbook remediate_firewall.yml", desc: "Auto-remediate firewall rule violations across Palo Alto fleet" },
        { id: "validate", cmd: "$ python validate_compliance.py --all", desc: "Re-validate all endpoints pass compliance baseline" },
        { id: "report", cmd: "$ splunk-forwarder push --index=compliance", desc: "Push audit evidence to Splunk for executive reporting" },
        { id: "notify", cmd: "$ jenkins trigger downstream_audit_gate", desc: "Trigger Jenkins pipeline gate for sign-off & archival" },
      ],
      correctOrder: ["scan", "parse", "remediate", "validate", "report", "notify"],
      success: "This exact pipeline cut manual audit effort by 60% and produced bank-ready compliance evidence every cycle.",
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
      type: "arch-flow",
      title: "Zero-Downtime Migration Architecture",
      prompt: "Connect the architecture nodes from source to production. Follow the path I designed for safe, zero-downtime cloud migration across 50+ applications.",
      tiers: ["Discovery", "Provision", "Validate", "Cutover"],
      nodes: [
        { id: "inventory", label: "App Inventory & Deps", col: 0, row: 0, tier: "Discovery" },
        { id: "assess", label: "Cloud Readiness Score", col: 0, row: 1, tier: "Discovery" },
        { id: "tf-net", label: "Terraform: VPC + Subnets", col: 1, row: 0, tier: "Provision" },
        { id: "tf-compute", label: "Terraform: ECS + RDS", col: 1, row: 1, tier: "Provision" },
        { id: "smoke", label: "Smoke Test Suite", col: 2, row: 0, tier: "Validate" },
        { id: "shadow", label: "Traffic Shadow (5%)", col: 2, row: 1, tier: "Validate" },
        { id: "dns", label: "Weighted DNS Shift", col: 3, row: 0, tier: "Cutover" },
        { id: "decom", label: "Legacy Decommission", col: 3, row: 1, tier: "Cutover" },
      ],
      sequence: ["inventory", "assess", "tf-net", "tf-compute", "smoke", "shadow", "dns", "decom"],
      success: "This architecture is how we migrated 50+ applications without a single minute of customer-facing downtime.",
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
      type: "gov-matrix",
      title: "Multi-Account Governance Matrix",
      prompt: "Match each cloud account archetype to its correct governance control. I designed this framework to bring order to 200+ ungoverned accounts.",
      accounts: [
        { id: "sandbox", name: "🧪 Sandbox", desc: "Developer experimentation, non-prod workloads" },
        { id: "staging", name: "🔄 Staging", desc: "Pre-prod mirror, integration testing" },
        { id: "production", name: "🏭 Production", desc: "Customer-facing, SLA-bound workloads" },
        { id: "shared-svc", name: "🔗 Shared Services", desc: "Central logging, IAM, networking hub" },
      ],
      controls: [
        { id: "budget-kill", name: "Budget Kill Switch + 72hr TTL" },
        { id: "change-window", name: "Change Window + Approval Gate" },
        { id: "sla-monitor", name: "SLA Scorecard + Auto-Escalation" },
        { id: "cross-audit", name: "Cross-Account Audit Trail" },
      ],
      matches: { "sandbox": "budget-kill", "staging": "change-window", "production": "sla-monitor", "shared-svc": "cross-audit" },
      success: "This governance matrix stabilized 200+ accounts and saved $2M/year by killing untagged sandbox resources automatically.",
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
      type: "pipeline",
      title: "Enterprise CI/CD Pipeline",
      prompt: "Assemble the pipeline stages in the correct order. This is the exact delivery system that cut deploy time from 5 days to 2 hours.",
      stages: [
        { id: "lint", label: "Lint + Unit Tests", icon: "🔍", desc: "Static analysis, linting, unit test gate — fails fast on code quality" },
        { id: "build", label: "Container Build", icon: "📦", desc: "Multi-stage Docker build with layer caching, image tagging" },
        { id: "scan", label: "Trivy + Snyk Scan", icon: "🛡️", desc: "Container image vulnerability scan — blocks on HIGH/CRITICAL CVEs" },
        { id: "sign", label: "Image Sign (Cosign)", icon: "✍️", desc: "Cryptographic image signing for supply chain integrity" },
        { id: "gitops", label: "ArgoCD Sync", icon: "🔄", desc: "GitOps reconciliation — desired state applied to EKS cluster" },
        { id: "canary", label: "Canary (Istio 5%)", icon: "🐤", desc: "Route 5% traffic to new version via Istio virtual service" },
        { id: "promote", label: "Full Rollout", icon: "🚀", desc: "Promote canary to 100% after health checks pass" },
        { id: "observe", label: "Datadog SLO Gate", icon: "📊", desc: "Post-deploy SLO validation — auto-rollback if error rate spikes" },
      ],
      correctOrder: ["lint", "build", "scan", "sign", "gitops", "canary", "promote", "observe"],
      success: "This 8-stage pipeline delivered zero critical audit findings and cut deploy cycles from 5 days to under 2 hours.",
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
      type: "capacity",
      title: "Multi-Region Capacity Planning",
      prompt: "Assign each workload to the correct AWS region based on latency requirements and capacity constraints. This is how I planned multi-region active-active at scale.",
      workloads: [
        { id: "api-gw", name: "API Gateway (Core Banking)", cpu: 4, mem: 8, latReq: "low" },
        { id: "batch", name: "Batch ETL (Nightly)", cpu: 8, mem: 16, latReq: "high" },
        { id: "ml-infer", name: "ML Inference (Fraud)", cpu: 6, mem: 12, latReq: "low" },
        { id: "static", name: "Static Assets (CDN Origin)", cpu: 1, mem: 2, latReq: "high" },
        { id: "event-bus", name: "Event Bus (Kafka)", cpu: 4, mem: 8, latReq: "med" },
        { id: "logs", name: "Log Aggregation", cpu: 2, mem: 8, latReq: "high" },
      ],
      regions: [
        { id: "ca-central", name: "🇨🇦 ca-central-1 (Primary)", cpuCap: 14, memCap: 28, latency: "low" },
        { id: "us-east", name: "🇺🇸 us-east-1 (Failover)", cpuCap: 12, memCap: 24, latency: "med" },
        { id: "eu-west", name: "🇪🇺 eu-west-1 (DR/Batch)", cpuCap: 11, memCap: 26, latency: "high" },
      ],
      solution: { "api-gw": "ca-central", "ml-infer": "ca-central", "event-bus": "us-east", "batch": "eu-west", "static": "eu-west", "logs": "us-east" },
      success: "This capacity model powered active-active across 3 regions serving 1000+ developers with full disaster recovery.",
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
      type: "risk-assess",
      title: "AI Model Risk Assessment",
      prompt: "Review each AI model deployment request. Approve or reject based on banking compliance criteria. This is the governance framework I built for enterprise AI.",
      criteria: [
        "Data residency must be Canadian (PIPEDA)",
        "No PII in training data without consent",
        "Model explainability score ≥ 0.7",
        "Red-team tested before production",
      ],
      models: [
        {
          id: "fraud-v2", name: "Fraud Detection v2",
          attributes: { "Data Residency": "🇨🇦 Canada (Azure Canada Central)", "PII Handling": "Tokenized, consent-verified", "Explainability": "0.82 (SHAP)", "Red-Team": "✅ 3 rounds completed" },
          safe: true, reason: "Meets all criteria — Canadian data, tokenized PII, high explainability, fully red-teamed."
        },
        {
          id: "chatbot-v1", name: "Customer Chatbot v1",
          attributes: { "Data Residency": "🇺🇸 US East (Azure Virginia)", "PII Handling": "Raw transcripts in fine-tuning", "Explainability": "0.45 (black box)", "Red-Team": "❌ Not tested" },
          safe: false, reason: "Fails 4/4 criteria — US-hosted data violates PIPEDA, raw PII in training, low explainability, no red-team testing."
        },
        {
          id: "doc-summary", name: "Document Summarizer",
          attributes: { "Data Residency": "🇨🇦 Canada (Azure Canada Central)", "PII Handling": "No PII in pipeline", "Explainability": "0.91 (attention maps)", "Red-Team": "✅ 2 rounds completed" },
          safe: true, reason: "Clean deployment — no PII exposure, high explainability, Canadian-hosted, fully tested."
        },
        {
          id: "credit-score", name: "Credit Scoring Model",
          attributes: { "Data Residency": "🇨🇦 Canada (Azure Canada Central)", "PII Handling": "Encrypted, consent-verified", "Explainability": "0.65 (below threshold)", "Red-Team": "✅ 1 round completed" },
          safe: false, reason: "Explainability at 0.65 is below the 0.7 threshold — critical for credit decisions under fair lending laws."
        },
      ],
      success: "This governance framework ensured every AI model at BMO met banking-grade compliance before touching production data.",
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   PUZZLE 1: TERMINAL SEQUENCER
   ═══════════════════════════════════════════════════════════ */

const TerminalSequencerPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton }: { puzzle: TerminalPuzzle; color: string; solved: boolean; onSolve: () => void; autoReveal?: boolean; revealButton?: React.ReactNode }) => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const isDone = solved || autoReveal || placed.length === puzzle.correctOrder.length;

  useEffect(() => { if (autoReveal) setPlaced([...puzzle.correctOrder]); }, [autoReveal, puzzle.correctOrder]);

  const nextExpected = puzzle.correctOrder[placed.length];

  const handleClick = (id: string) => {
    if (isDone) return;
    if (id === nextExpected) {
      const next = [...placed, id];
      setPlaced(next);
      setWrongId(null);
      if (next.length === puzzle.correctOrder.length) onSolve();
    } else {
      setWrongId(id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        {!isDone && <button onClick={() => { setPlaced([]); setWrongId(null); }} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer" style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>}
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Terminal display */}
      <div className="rounded-lg overflow-hidden" style={{ background: "#1a1a2e", border: "1px solid #2a2a4a" }}>
        <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: "#12122a" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f56" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#27c93f" }} />
          <span className="text-[8px] font-mono ml-2" style={{ color: "#555" }}>compliance-pipeline.sh</span>
        </div>
        <div className="px-3 py-2 space-y-1 min-h-[100px]">
          {placed.map((id, i) => {
            const cmd = puzzle.commands.find(c => c.id === id)!;
            return (
              <motion.div key={id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <p className="text-[10px] font-mono" style={{ color: "#27c93f" }}>{cmd.cmd}</p>
                <p className="text-[8px] font-mono ml-4" style={{ color: "#555" }}># {cmd.desc}</p>
              </motion.div>
            );
          })}
          {!isDone && (
            <motion.span className="text-[10px] font-mono inline-block" style={{ color: "#27c93f" }}
              animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              █
            </motion.span>
          )}
          {isDone && <p className="text-[10px] font-mono mt-1" style={{ color: "#27c93f" }}>✓ Pipeline complete — all stages passed.</p>}
        </div>
      </div>

      {/* Command choices */}
      <div className="grid grid-cols-2 gap-2">
        {puzzle.commands.map(cmd => {
          const isPlaced = placed.includes(cmd.id);
          const isWrong = wrongId === cmd.id;
          const isNext = cmd.id === nextExpected;
          return (
            <motion.button key={cmd.id} onClick={() => handleClick(cmd.id)} disabled={isPlaced || isDone}
              className="text-left p-2.5 rounded-lg cursor-pointer disabled:cursor-default transition-all"
              style={{
                background: isPlaced ? `${color}08` : isWrong ? "rgba(220,50,50,0.06)" : "#fefcf9",
                border: `1.5px solid ${isPlaced ? `${color}30` : isWrong ? "#dc3232" : isNext ? `${color}40` : "rgba(180,140,100,0.15)"}`,
                opacity: isPlaced ? 0.5 : 1,
              }}
              animate={isWrong ? { x: [0, -4, 4, -2, 2, 0] } : {}}
              transition={isWrong ? { duration: 0.3 } : {}}>
              <p className="text-[9px] font-mono truncate" style={{ color: isPlaced ? `${color}80` : "#2d2a26" }}>{cmd.cmd}</p>
              <p className="text-[8px] font-body mt-0.5 line-clamp-1" style={{ color: "rgba(80,70,60,0.5)" }}>{cmd.desc}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {puzzle.correctOrder.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < placed.length ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Pipeline Executed</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}

      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 2: ARCHITECTURE FLOW (enhanced connect-the-nodes)
   ═══════════════════════════════════════════════════════════ */

const NODE_W = 120;
const NODE_H = 48;
const GRID_GAP_X = 150;
const GRID_GAP_Y = 72;
const PAD_X = 20;
const PAD_Y = 30;
const getNodeCenter = (node: ArchNode) => ({ x: PAD_X + node.col * GRID_GAP_X + NODE_W / 2, y: PAD_Y + node.row * GRID_GAP_Y + NODE_H / 2 });

const ArchFlowPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton }: { puzzle: ArchFlowPuzzle; color: string; solved: boolean; onSolve: () => void; autoReveal?: boolean; revealButton?: React.ReactNode }) => {
  const [connected, setConnected] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const svgW = PAD_X * 2 + 3 * GRID_GAP_X + NODE_W;
  const svgH = PAD_Y * 2 + GRID_GAP_Y + NODE_H;
  const isDone = solved || autoReveal || connected.length === puzzle.sequence.length;

  useEffect(() => { if (autoReveal) setConnected([...puzzle.sequence]); }, [autoReveal, puzzle.sequence]);
  useEffect(() => { setConnected([]); setWrongId(null); }, [puzzle.title]);

  const nextExpected = puzzle.sequence[connected.length];

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

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < connected.length; i++) {
    const from = puzzle.nodes.find(n => n.id === connected[i - 1])!;
    const to = puzzle.nodes.find(n => n.id === connected[i])!;
    const a = getNodeCenter(from); const b = getNodeCenter(to);
    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        {!isDone && <button onClick={() => { setConnected([]); setWrongId(null); }} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer" style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>}
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Tier labels */}
      <div className="flex justify-between px-2">
        {puzzle.tiers.map(t => (
          <span key={t} className="text-[8px] font-mono uppercase tracking-widest" style={{ color: `${color}60` }}>{t}</span>
        ))}
      </div>

      <div className="relative rounded-xl overflow-hidden" style={{ width: svgW, maxWidth: "100%", height: svgH, background: `${color}03`, border: `1px solid ${color}12` }}>
        {/* Tier dividers */}
        {[1, 2, 3].map(i => (
          <div key={i} className="absolute top-0 bottom-0" style={{ left: PAD_X + i * GRID_GAP_X - GRID_GAP_X / 2 + NODE_W / 2, width: 1, background: `${color}08` }} />
        ))}

        <svg className="absolute inset-0" width={svgW} height={svgH} style={{ pointerEvents: "none" }}>
          {lines.map((l, i) => (
            <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth={2} strokeLinecap="round" strokeDasharray="6,3"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: 0.4 }} />
          ))}
          {connected.map(id => {
            const node = puzzle.nodes.find(n => n.id === id)!;
            const c = getNodeCenter(node);
            return <motion.circle key={id} cx={c.x} cy={c.y} r={4} fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} />;
          })}
        </svg>

        {puzzle.nodes.map(node => {
          const isConnected = connected.includes(node.id);
          const isNext = node.id === nextExpected;
          const isWrong = wrongId === node.id;
          return (
            <motion.button key={node.id} className="absolute flex items-center justify-center rounded-md cursor-pointer text-center"
              style={{
                left: PAD_X + node.col * GRID_GAP_X, top: PAD_Y + node.row * GRID_GAP_Y, width: NODE_W, height: NODE_H,
                background: isConnected ? `${color}12` : isWrong ? "rgba(220,50,50,0.06)" : "#fff",
                border: `1.5px solid ${isConnected ? color : isWrong ? "#dc3232" : isNext ? `${color}50` : "rgba(180,140,100,0.15)"}`,
                boxShadow: isConnected ? `0 2px 8px ${color}12` : "none", zIndex: 2,
              }}
              onClick={() => handleClick(node.id)}
              whileHover={!isConnected && !isDone ? { scale: 1.05 } : {}}
              animate={isWrong ? { x: [0, -4, 4, -2, 2, 0] } : {}}
              transition={isWrong ? { duration: 0.3 } : {}}>
              <div>
                {isConnected && <span className="text-[7px] font-mono font-bold block" style={{ color }}>{connected.indexOf(node.id) + 1}</span>}
                <span className="text-[9px] font-mono leading-tight" style={{ color: isConnected ? color : "#2d2a26" }}>{node.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        {puzzle.sequence.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < connected.length ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Architecture Mapped</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}

      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 3: GOVERNANCE MATRIX
   ═══════════════════════════════════════════════════════════ */

const GovMatrixPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton }: { puzzle: GovMatrixPuzzle; color: string; solved: boolean; onSolve: () => void; autoReveal?: boolean; revealButton?: React.ReactNode }) => {
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const isDone = solved || autoReveal || Object.keys(matched).length === puzzle.accounts.length;

  useEffect(() => { if (autoReveal) setMatched({ ...puzzle.matches }); }, [autoReveal, puzzle.matches]);
  useEffect(() => { setMatched({}); setSelectedAccount(null); setWrongPair(null); }, [puzzle.title]);

  const handleAccountClick = (accId: string) => {
    if (isDone || matched[accId]) return;
    setSelectedAccount(accId);
  };

  const handleControlClick = (ctrlId: string) => {
    if (isDone || !selectedAccount) return;
    if (puzzle.matches[selectedAccount] === ctrlId) {
      const next = { ...matched, [selectedAccount]: ctrlId };
      setMatched(next);
      setSelectedAccount(null);
      setWrongPair(null);
      if (Object.keys(next).length === puzzle.accounts.length) onSolve();
    } else {
      setWrongPair(ctrlId);
      setTimeout(() => setWrongPair(null), 500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3X3 size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        {!isDone && <button onClick={() => { setMatched({}); setSelectedAccount(null); }} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer" style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>}
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>
      <p className="text-[9px] font-mono" style={{ color: `${color}80` }}>
        {selectedAccount ? `Selected: ${puzzle.accounts.find(a => a.id === selectedAccount)?.name} → Now pick the control ▸` : "Click an account type first, then match it to a governance control"}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Accounts */}
        <div className="space-y-2">
          <p className="text-[8px] font-mono uppercase tracking-widest" style={{ color: `${color}70` }}>Account Types</p>
          {puzzle.accounts.map(acc => {
            const isMatched = !!matched[acc.id];
            const isSelected = selectedAccount === acc.id;
            return (
              <motion.button key={acc.id} onClick={() => handleAccountClick(acc.id)} disabled={isMatched || isDone}
                className="w-full text-left p-3 rounded-lg cursor-pointer disabled:cursor-default transition-all"
                style={{
                  background: isMatched ? `${color}08` : isSelected ? `${color}12` : "#fefcf9",
                  border: `2px solid ${isMatched ? "#2a7d4f" : isSelected ? color : "rgba(180,140,100,0.15)"}`,
                  opacity: isMatched ? 0.55 : 1,
                }}
                whileHover={!isMatched ? { scale: 1.02 } : {}}>
                <p className="text-xs font-mono font-bold" style={{ color: isMatched ? "#2a7d4f" : "#2d2a26" }}>{acc.name} {isMatched && "✓"}</p>
                <p className="text-[8px] font-body mt-0.5" style={{ color: "rgba(80,70,60,0.5)" }}>{acc.desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <p className="text-[8px] font-mono uppercase tracking-widest" style={{ color: `${color}70` }}>Governance Controls</p>
          {puzzle.controls.map(ctrl => {
            const isUsed = Object.values(matched).includes(ctrl.id);
            const isWrong = wrongPair === ctrl.id;
            return (
              <motion.button key={ctrl.id} onClick={() => handleControlClick(ctrl.id)} disabled={isUsed || isDone || !selectedAccount}
                className="w-full text-left p-3 rounded-lg cursor-pointer disabled:cursor-default transition-all"
                style={{
                  background: isUsed ? "rgba(42,125,79,0.06)" : isWrong ? "rgba(220,50,50,0.06)" : "#fefcf9",
                  border: `2px solid ${isUsed ? "#2a7d4f40" : isWrong ? "#dc3232" : selectedAccount ? `${color}30` : "rgba(180,140,100,0.12)"}`,
                  opacity: isUsed ? 0.55 : 1,
                }}
                animate={isWrong ? { x: [0, -4, 4, -2, 2, 0] } : {}}
                transition={isWrong ? { duration: 0.3 } : {}}
                whileHover={!isUsed && selectedAccount ? { scale: 1.02 } : {}}>
                <p className="text-[10px] font-mono" style={{ color: isUsed ? "#2a7d4f" : "#2d2a26" }}>{ctrl.name} {isUsed && "✓"}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {puzzle.accounts.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < Object.keys(matched).length ? "#2a7d4f" : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Governance Applied</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}

      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 4: PIPELINE ASSEMBLER
   ═══════════════════════════════════════════════════════════ */

const PipelineAssemblerPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton }: { puzzle: PipelinePuzzle; color: string; solved: boolean; onSolve: () => void; autoReveal?: boolean; revealButton?: React.ReactNode }) => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const isDone = solved || autoReveal || placed.length === puzzle.correctOrder.length;

  useEffect(() => { if (autoReveal) setPlaced([...puzzle.correctOrder]); }, [autoReveal, puzzle.correctOrder]);
  useEffect(() => { setPlaced([]); setWrongId(null); }, [puzzle.title]);

  const nextExpected = puzzle.correctOrder[placed.length];

  const handleClick = (id: string) => {
    if (isDone) return;
    if (id === nextExpected) {
      const next = [...placed, id];
      setPlaced(next);
      setWrongId(null);
      if (next.length === puzzle.correctOrder.length) onSolve();
    } else {
      setWrongId(id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        {!isDone && <button onClick={() => { setPlaced([]); setWrongId(null); }} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer" style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>}
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Pipeline visualization */}
      <div className="rounded-lg p-3 overflow-x-auto" style={{ background: `${color}04`, border: `1px solid ${color}12` }}>
        <div className="flex items-center gap-1 min-w-max">
          {puzzle.correctOrder.map((_, i) => {
            const stage = placed[i] ? puzzle.stages.find(s => s.id === placed[i]) : null;
            return (
              <div key={i} className="flex items-center">
                <motion.div className="rounded-lg flex items-center justify-center text-center"
                  style={{
                    width: 72, height: 56,
                    background: stage ? `${color}10` : "rgba(180,140,100,0.04)",
                    border: `2px dashed ${stage ? color : "rgba(180,140,100,0.2)"}`,
                  }}
                  animate={stage ? { borderStyle: "solid" } : {}}>
                  {stage ? (
                    <div>
                      <span className="text-sm">{stage.icon}</span>
                      <p className="text-[7px] font-mono mt-0.5" style={{ color }}>{stage.label}</p>
                    </div>
                  ) : (
                    <span className="text-[8px] font-mono" style={{ color: "rgba(180,140,100,0.3)" }}>Stage {i + 1}</span>
                  )}
                </motion.div>
                {i < puzzle.correctOrder.length - 1 && (
                  <div className="mx-0.5" style={{ width: 12, height: 2, background: stage ? color : "rgba(180,140,100,0.15)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage choices */}
      <div className="grid grid-cols-2 gap-2">
        {puzzle.stages.map(stage => {
          const isPlaced = placed.includes(stage.id);
          const isWrong = wrongId === stage.id;
          return (
            <motion.button key={stage.id} onClick={() => handleClick(stage.id)} disabled={isPlaced || isDone}
              className="text-left p-2.5 rounded-lg cursor-pointer disabled:cursor-default flex items-start gap-2 transition-all"
              style={{
                background: isPlaced ? `${color}06` : isWrong ? "rgba(220,50,50,0.06)" : "#fefcf9",
                border: `1.5px solid ${isPlaced ? `${color}25` : isWrong ? "#dc3232" : "rgba(180,140,100,0.15)"}`,
                opacity: isPlaced ? 0.4 : 1,
              }}
              animate={isWrong ? { x: [0, -4, 4, -2, 2, 0] } : {}}
              transition={isWrong ? { duration: 0.3 } : {}}>
              <span className="text-sm">{stage.icon}</span>
              <div>
                <p className="text-[9px] font-mono font-bold" style={{ color: "#2d2a26" }}>{stage.label}</p>
                <p className="text-[8px] font-body mt-0.5 line-clamp-2" style={{ color: "rgba(80,70,60,0.5)" }}>{stage.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        {puzzle.correctOrder.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < placed.length ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Pipeline Assembled</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}

      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 5: CAPACITY PLANNER
   ═══════════════════════════════════════════════════════════ */

const CapacityPlannerPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton }: { puzzle: CapacityPuzzle; color: string; solved: boolean; onSolve: () => void; autoReveal?: boolean; revealButton?: React.ReactNode }) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedWorkload, setSelectedWorkload] = useState<string | null>(null);
  const [wrongRegion, setWrongRegion] = useState<string | null>(null);
  const isDone = solved || autoReveal || Object.keys(assignments).length === puzzle.workloads.length;

  useEffect(() => { if (autoReveal) setAssignments({ ...puzzle.solution }); }, [autoReveal, puzzle.solution]);
  useEffect(() => { setAssignments({}); setSelectedWorkload(null); }, [puzzle.title]);

  const getRegionUsage = (regionId: string) => {
    const assigned = Object.entries(assignments).filter(([, r]) => r === regionId).map(([wId]) => puzzle.workloads.find(w => w.id === wId)!);
    return { cpu: assigned.reduce((s, w) => s + w.cpu, 0), mem: assigned.reduce((s, w) => s + w.mem, 0) };
  };

  const handleWorkloadClick = (wId: string) => {
    if (isDone || assignments[wId]) return;
    setSelectedWorkload(wId);
  };

  const handleRegionClick = (rId: string) => {
    if (isDone || !selectedWorkload) return;
    if (puzzle.solution[selectedWorkload] === rId) {
      const next = { ...assignments, [selectedWorkload]: rId };
      setAssignments(next);
      setSelectedWorkload(null);
      setWrongRegion(null);
      if (Object.keys(next).length === puzzle.workloads.length) onSolve();
    } else {
      setWrongRegion(rId);
      setTimeout(() => setWrongRegion(null), 500);
    }
  };

  const latColors: Record<string, string> = { low: "#2a7d4f", med: "#b5850a", high: "#888" };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        {!isDone && <button onClick={() => { setAssignments({}); setSelectedWorkload(null); }} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer" style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>}
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Regions with capacity bars */}
      <div className="grid grid-cols-3 gap-2">
        {puzzle.regions.map(region => {
          const usage = getRegionUsage(region.id);
          const cpuPct = Math.round((usage.cpu / region.cpuCap) * 100);
          const memPct = Math.round((usage.mem / region.memCap) * 100);
          const isWrong = wrongRegion === region.id;
          return (
            <motion.button key={region.id} onClick={() => handleRegionClick(region.id)} disabled={isDone || !selectedWorkload}
              className="p-2.5 rounded-lg cursor-pointer disabled:cursor-default text-left transition-all"
              style={{
                background: selectedWorkload ? `${color}06` : "#fefcf9",
                border: `2px solid ${isWrong ? "#dc3232" : selectedWorkload ? `${color}30` : "rgba(180,140,100,0.15)"}`,
              }}
              animate={isWrong ? { x: [0, -4, 4, -2, 2, 0] } : {}}
              transition={isWrong ? { duration: 0.3 } : {}}
              whileHover={selectedWorkload ? { scale: 1.02 } : {}}>
              <p className="text-[9px] font-mono font-bold" style={{ color: "#2d2a26" }}>{region.name}</p>
              <div className="mt-1.5 space-y-1">
                <div>
                  <div className="flex justify-between"><span className="text-[7px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>CPU</span><span className="text-[7px] font-mono" style={{ color }}>{usage.cpu}/{region.cpuCap}</span></div>
                  <div className="h-1.5 rounded-full mt-0.5" style={{ background: "rgba(180,140,100,0.1)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: cpuPct > 90 ? "#dc3232" : color }} animate={{ width: `${cpuPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between"><span className="text-[7px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>MEM</span><span className="text-[7px] font-mono" style={{ color }}>{usage.mem}/{region.memCap}GB</span></div>
                  <div className="h-1.5 rounded-full mt-0.5" style={{ background: "rgba(180,140,100,0.1)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: memPct > 90 ? "#dc3232" : color }} animate={{ width: `${memPct}%` }} />
                  </div>
                </div>
                <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-block mt-0.5" style={{ background: `${latColors[region.latency]}12`, color: latColors[region.latency], border: `1px solid ${latColors[region.latency]}20` }}>
                  Latency: {region.latency}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-[9px] font-mono" style={{ color: `${color}80` }}>
        {selectedWorkload ? `Placing: ${puzzle.workloads.find(w => w.id === selectedWorkload)?.name} → Click a region` : "Click a workload, then assign it to a region"}
      </p>

      {/* Workloads */}
      <div className="grid grid-cols-2 gap-2">
        {puzzle.workloads.map(w => {
          const isAssigned = !!assignments[w.id];
          const isSelected = selectedWorkload === w.id;
          const assignedRegion = assignments[w.id] ? puzzle.regions.find(r => r.id === assignments[w.id]) : null;
          return (
            <motion.button key={w.id} onClick={() => handleWorkloadClick(w.id)} disabled={isAssigned || isDone}
              className="text-left p-2.5 rounded-lg cursor-pointer disabled:cursor-default transition-all"
              style={{
                background: isAssigned ? "rgba(42,125,79,0.05)" : isSelected ? `${color}10` : "#fefcf9",
                border: `1.5px solid ${isAssigned ? "#2a7d4f30" : isSelected ? color : "rgba(180,140,100,0.15)"}`,
                opacity: isAssigned ? 0.5 : 1,
              }}>
              <p className="text-[9px] font-mono font-bold" style={{ color: isAssigned ? "#2a7d4f" : "#2d2a26" }}>{w.name} {isAssigned && "✓"}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-[7px] font-mono px-1 rounded" style={{ background: `${color}08`, color }}>CPU: {w.cpu}</span>
                <span className="text-[7px] font-mono px-1 rounded" style={{ background: `${color}08`, color }}>MEM: {w.mem}GB</span>
                <span className="text-[7px] font-mono px-1 rounded" style={{ background: `${latColors[w.latReq]}10`, color: latColors[w.latReq] }}>Lat: {w.latReq}</span>
              </div>
              {assignedRegion && <p className="text-[7px] font-mono mt-1" style={{ color: "#2a7d4f" }}>→ {assignedRegion.name}</p>}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        {puzzle.workloads.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < Object.keys(assignments).length ? "#2a7d4f" : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Capacity Optimized</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}

      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 6: AI RISK ASSESSMENT
   ═══════════════════════════════════════════════════════════ */

const RiskAssessmentPuzzle = ({ puzzle, color, solved, onSolve }: { puzzle: RiskAssessPuzzle; color: string; solved: boolean; onSolve: () => void }) => {
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [showReason, setShowReason] = useState<string | null>(null);
  const isDone = solved || Object.keys(decisions).length === puzzle.models.length;

  useEffect(() => { setDecisions({}); setWrongId(null); setShowReason(null); }, [puzzle.title]);

  const handleDecision = (modelId: string, approve: boolean) => {
    if (isDone || decisions[modelId] !== undefined) return;
    const model = puzzle.models.find(m => m.id === modelId)!;
    if (model.safe === approve) {
      setDecisions(prev => ({ ...prev, [modelId]: approve }));
      setShowReason(modelId);
      setWrongId(null);
      const nextCount = Object.keys(decisions).length + 1;
      if (nextCount === puzzle.models.length) setTimeout(onSolve, 600);
    } else {
      setWrongId(modelId);
      setTimeout(() => setWrongId(null), 600);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        {!isDone && <button onClick={() => { setDecisions({}); setWrongId(null); setShowReason(null); }} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer" style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>}
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Criteria reference */}
      <div className="rounded-lg p-2.5" style={{ background: `${color}04`, border: `1px solid ${color}12` }}>
        <p className="text-[8px] font-mono uppercase tracking-widest mb-1.5" style={{ color: `${color}80` }}>Compliance Criteria</p>
        <div className="grid grid-cols-2 gap-1">
          {puzzle.criteria.map((c, i) => (
            <p key={i} className="text-[9px] font-mono flex items-start gap-1.5" style={{ color: "rgba(45,42,38,0.7)" }}>
              <span style={{ color }}>▸</span> {c}
            </p>
          ))}
        </div>
      </div>

      {/* Model cards */}
      <div className="space-y-3">
        {puzzle.models.map(model => {
          const decided = decisions[model.id] !== undefined;
          const isWrong = wrongId === model.id;
          const approved = decisions[model.id];
          return (
            <motion.div key={model.id} className="rounded-lg overflow-hidden"
              style={{
                border: `1.5px solid ${decided ? (approved ? "#2a7d4f30" : "#dc323230") : isWrong ? "#dc3232" : "rgba(180,140,100,0.15)"}`,
                background: decided ? (approved ? "rgba(42,125,79,0.03)" : "rgba(220,50,50,0.03)") : "#fefcf9",
              }}
              animate={isWrong ? { x: [0, -3, 3, -2, 2, 0] } : {}}
              transition={isWrong ? { duration: 0.35 } : {}}>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-mono font-bold" style={{ color: "#2d2a26" }}>{model.name}</p>
                  {decided && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded" style={{
                      background: approved ? "rgba(42,125,79,0.1)" : "rgba(220,50,50,0.1)",
                      color: approved ? "#2a7d4f" : "#dc3232",
                      border: `1px solid ${approved ? "#2a7d4f20" : "#dc323220"}`,
                    }}>
                      {approved ? "✓ APPROVED" : "✗ REJECTED"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(model.attributes).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-1.5">
                      <span className="text-[8px] font-mono shrink-0" style={{ color: "rgba(80,70,60,0.45)" }}>{key}:</span>
                      <span className="text-[8px] font-mono" style={{ color: "#2d2a26" }}>{val}</span>
                    </div>
                  ))}
                </div>

                {!decided && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleDecision(model.id, true)}
                      className="flex-1 text-[9px] font-mono py-1.5 rounded-md cursor-pointer transition-all"
                      style={{ background: "rgba(42,125,79,0.08)", border: "1px solid rgba(42,125,79,0.2)", color: "#2a7d4f" }}>
                      ✓ Approve for Production
                    </button>
                    <button onClick={() => handleDecision(model.id, false)}
                      className="flex-1 text-[9px] font-mono py-1.5 rounded-md cursor-pointer transition-all"
                      style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.15)", color: "#dc3232" }}>
                      ✗ Reject — Non-Compliant
                    </button>
                  </div>
                )}

                {decided && showReason === model.id && (
                  <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] font-body mt-2 p-2 rounded" style={{ background: "rgba(180,140,100,0.05)", color: "rgba(45,42,38,0.7)" }}>
                    💡 {model.reason}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        {puzzle.models.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i < Object.keys(decisions).length ? "#2a7d4f" : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Assessment Complete</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   REVEAL SOLUTION BUTTON
   ═══════════════════════════════════════════════════════════ */

const RevealButton = ({ onReveal, color, solved }: { onReveal: () => void; color: string; solved: boolean }) => {
  if (solved) return null;
  return (
    <motion.button
      onClick={onReveal}
      className="flex items-center gap-1.5 text-[9px] font-mono px-3 py-1.5 rounded-lg cursor-pointer transition-all mt-2"
      style={{
        color: "rgba(80,70,60,0.5)",
        background: "rgba(180,140,100,0.04)",
        border: "1px solid rgba(180,140,100,0.12)",
      }}
      whileHover={{ scale: 1.03, background: `${color}08` }}
      whileTap={{ scale: 0.97 }}
    >
      <Eye size={10} /> Reveal Solution
    </motion.button>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE ROUTER
   ═══════════════════════════════════════════════════════════ */

const PuzzleRouter = ({ puzzle, color, solved, onSolve }: { puzzle: RolePuzzle; color: string; solved: boolean; onSolve: () => void }) => {
  const [autoReveal, setAutoReveal] = useState(false);

  const handleReveal = useCallback(() => {
    setAutoReveal(true);
    onSolve();
  }, [onSolve]);

  // Reset autoReveal when puzzle changes
  useEffect(() => { setAutoReveal(false); }, [puzzle.title]);

  const revealButton = <RevealButton onReveal={handleReveal} color={color} solved={solved || autoReveal} />;

  switch (puzzle.type) {
    case "terminal-seq": return <TerminalSequencerPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} />;
    case "arch-flow": return <ArchFlowPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} />;
    case "gov-matrix": return <GovMatrixPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} />;
    case "pipeline": return <PipelineAssemblerPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} />;
    case "capacity": return <CapacityPlannerPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} />;
    case "risk-assess": return <RiskAssessmentPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} />;
  }
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

  useEffect(() => { setPanel("overview"); }, [activeStop]);

  const stop = stops[activeStop];
  const puzzleLabel: Record<PuzzleType, string> = {
    "terminal-seq": "Execute Pipeline",
    "arch-flow": "Map Architecture",
    "gov-matrix": "Apply Governance",
    "pipeline": "Build Pipeline",
    "capacity": "Plan Capacity",
    "risk-assess": "Assess Models",
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto">
      {/* Journey Path */}
      <div className="w-full max-w-5xl mb-6">
        <div className="relative">
          <div className="absolute top-[28px] left-0 right-0 h-[3px] rounded-full" style={{ background: "rgba(180,140,100,0.15)" }}>
            <motion.div className="h-full rounded-full" style={{ background: stop.color }}
              initial={{ width: 0 }} animate={{ width: `${((activeStop + 1) / stops.length) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="flex justify-between items-start relative z-10 px-2">
            {stops.slice(0, revealed).map((s, i) => {
              const isActive = i === activeStop;
              const isPast = i < activeStop;
              const isSolved = solvedStops.has(i);
              return (
                <motion.button key={i} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 px-1"
                  onClick={() => setActiveStop(i)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ minWidth: 70 }}>
                  <motion.div className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    animate={isActive ? { scale: [1, 1.08, 1] } : {}} transition={isActive ? { repeat: Infinity, duration: 2.5 } : {}}
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
                  <span className="text-[8px] font-mono text-center" style={{ color: isActive ? "#2d2a26" : "rgba(80,70,60,0.4)" }}>{s.period.split("–")[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div key={activeStop} className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
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
                <button onClick={() => setPanel("overview")} className="text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{ color: panel === "overview" ? stop.color : "rgba(80,70,60,0.55)", background: panel === "overview" ? `${stop.color}10` : "rgba(180,140,100,0.04)", border: `1px solid ${panel === "overview" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}` }}>
                  Overview
                </button>
                <button onClick={() => setPanel("puzzle")} className="text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{ color: panel === "puzzle" ? stop.color : "rgba(80,70,60,0.55)", background: panel === "puzzle" ? `${stop.color}10` : "rgba(180,140,100,0.04)", border: `1px solid ${panel === "puzzle" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}` }}>
                  {puzzleLabel[stop.puzzle.type]}
                </button>
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
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: `${stop.color}08`, border: `1px solid ${stop.color}15`, color: stop.color }}>{t}</span>
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
              <div className="p-6 overflow-y-auto" style={{ background: "#fefcf9", maxHeight: "60vh" }}>
                <PuzzleRouter puzzle={stop.puzzle} color={stop.color} solved={solvedStops.has(activeStop)}
                  onSolve={() => setSolvedStops(prev => new Set(prev).add(activeStop))} />
              </div>
            )}

            {/* Nav */}
            <div className="px-6 py-3 flex justify-between items-center" style={{ background: "rgba(180,140,100,0.03)", borderTop: "1px solid rgba(180,140,100,0.08)" }}>
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
