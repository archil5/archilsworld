import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Eye, Cloud, FileCode, Container, GitBranch } from "lucide-react";
import { brandLogos } from "@/data/brandLogos";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

type PuzzleType = "aws-arch" | "terraform-debug" | "k8s-scheduler" | "cicd-pipeline";

interface BasePuzzle {
  type: PuzzleType;
  title: string;
  prompt: string;
  success: string;
}

// 1) AWS Architecture Builder — place services in correct slots
interface AwsService { id: string; name: string; icon: string; desc: string }
interface ArchSlot { id: string; label: string; tier: string; correctService: string }
interface AwsArchPuzzle extends BasePuzzle {
  type: "aws-arch";
  services: AwsService[];
  slots: ArchSlot[];
  tiers: string[];
  extreme?: boolean;
}

// 2) Terraform Plan Debugger — find & fix broken lines
interface TfLine { id: string; code: string; isBroken: boolean; fix?: string; hint?: string }
interface TerraformPuzzle extends BasePuzzle {
  type: "terraform-debug";
  fileName: string;
  lines: TfLine[];
}

// 3) K8s Pod Scheduler — assign pods to nodes
interface Pod { id: string; name: string; cpu: number; mem: number; icon: string }
interface K8sNode { id: string; name: string; cpuCap: number; memCap: number; labels: string[] }
interface K8sPuzzle extends BasePuzzle {
  type: "k8s-scheduler";
  pods: Pod[];
  nodes: K8sNode[];
  solution: Record<string, string>;
}

// 4) CI/CD Pipeline Builder — arrange stages
interface PipelineStage { id: string; label: string; icon: string; desc: string }
interface CicdPuzzle extends BasePuzzle {
  type: "cicd-pipeline";
  stages: PipelineStage[];
  correctOrder: string[];
}

type RolePuzzle = AwsArchPuzzle | TerraformPuzzle | K8sPuzzle | CicdPuzzle;

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
      type: "cicd-pipeline",
      title: "Security Automation Pipeline",
      prompt: "Arrange the security automation stages in the correct order — this is the exact compliance pipeline I built at RBC.",
      stages: [
        { id: "scan", label: "Ansible: Scan Drift", icon: "🔍", desc: "Scan 500+ endpoints for config drift against CIS benchmarks" },
        { id: "parse", label: "Python: Parse Findings", icon: "📋", desc: "Filter critical & high-severity findings from scan results" },
        { id: "remediate", label: "Ansible: Remediate", icon: "🔧", desc: "Auto-remediate firewall rule violations across Palo Alto fleet" },
        { id: "validate", label: "Python: Validate", icon: "✅", desc: "Re-validate all endpoints pass compliance baseline" },
        { id: "report", label: "Splunk: Push Audit", icon: "📊", desc: "Push audit evidence to Splunk for executive reporting" },
        { id: "notify", label: "Jenkins: Gate", icon: "🚦", desc: "Trigger Jenkins pipeline gate for sign-off & archival" },
      ],
      correctOrder: ["scan", "parse", "remediate", "validate", "report", "notify"],
      success: "This pipeline cut manual audit effort by 60% and produced bank-ready compliance evidence every cycle.",
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
      type: "aws-arch",
      title: "Zero-Downtime Migration Architecture",
      prompt: "Place each AWS service into the correct architecture slot to build the migration pipeline I designed for 50+ applications.",
      tiers: ["Ingress", "Compute", "Data", "Monitoring"],
      services: [
        { id: "alb", name: "ALB", icon: "⚖️", desc: "Application Load Balancer — distributes traffic across targets" },
        { id: "r53", name: "Route 53", icon: "🌐", desc: "DNS service — weighted routing for blue/green cutover" },
        { id: "ecs", name: "ECS Fargate", icon: "📦", desc: "Serverless container orchestration — no EC2 management" },
        { id: "rds", name: "RDS Aurora", icon: "🗄️", desc: "Managed relational database — multi-AZ for HA" },
        { id: "s3", name: "S3", icon: "📂", desc: "Object storage — static assets & migration artifacts" },
        { id: "cw", name: "CloudWatch", icon: "📊", desc: "Monitoring & alerting — SLO tracking post-migration" },
      ],
      slots: [
        { id: "slot-dns", label: "DNS & Routing", tier: "Ingress", correctService: "r53" },
        { id: "slot-lb", label: "Load Balancer", tier: "Ingress", correctService: "alb" },
        { id: "slot-compute", label: "Container Runtime", tier: "Compute", correctService: "ecs" },
        { id: "slot-db", label: "Database", tier: "Data", correctService: "rds" },
        { id: "slot-storage", label: "Artifact Store", tier: "Data", correctService: "s3" },
        { id: "slot-monitor", label: "Observability", tier: "Monitoring", correctService: "cw" },
      ],
      success: "This architecture migrated 50+ applications without a single minute of customer-facing downtime.",
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
      type: "terraform-debug",
      title: "Multi-Account Governance — Fix the Terraform",
      prompt: "This Terraform config manages 200+ cloud accounts but has bugs. Click on each broken line to fix it — these are real mistakes I caught during governance rollout.",
      fileName: "governance.tf",
      lines: [
        { id: "l1", code: 'resource "aws_organizations_account" "sandbox" {', isBroken: false },
        { id: "l2", code: '  name  = "sandbox-dev"', isBroken: false },
        { id: "l3", code: '  email = "sandbox@bmo.com"', isBroken: false },
        { id: "l4", code: '  parent_id = aws_organizations_unit.dev.id', isBroken: false },
        { id: "l5", code: '  tags = {', isBroken: false },
        { id: "l6", code: '    CostCenter = ""', isBroken: true, fix: '    CostCenter = "CC-4420-DEV"', hint: "Empty CostCenter tag — untagged accounts waste $50K/month" },
        { id: "l7", code: '  }', isBroken: false },
        { id: "l8", code: '}', isBroken: false },
        { id: "l9", code: '', isBroken: false },
        { id: "l10", code: 'resource "aws_budgets_budget" "sandbox_limit" {', isBroken: false },
        { id: "l11", code: '  budget_type  = "COST"', isBroken: false },
        { id: "l12", code: '  limit_amount = "999999"', isBroken: true, fix: '  limit_amount = "500"', hint: "Budget limit too high — sandbox should cap at $500/month" },
        { id: "l13", code: '  limit_unit   = "USD"', isBroken: false },
        { id: "l14", code: '  time_unit    = "MONTHLY"', isBroken: false },
        { id: "l15", code: '}', isBroken: false },
        { id: "l16", code: '', isBroken: false },
        { id: "l17", code: 'resource "aws_iam_policy" "sandbox_boundary" {', isBroken: false },
        { id: "l18", code: '  name   = "SandboxBoundary"', isBroken: false },
        { id: "l19", code: '  policy = jsonencode({', isBroken: false },
        { id: "l20", code: '    Statement = [{', isBroken: false },
        { id: "l21", code: '      Effect   = "Allow"', isBroken: true, fix: '      Effect   = "Deny"', hint: "Should DENY production actions in sandbox — Allow is a privilege escalation risk" },
        { id: "l22", code: '      Action   = ["iam:CreateUser", "organizations:*"]', isBroken: false },
        { id: "l23", code: '      Resource = "*"', isBroken: true, fix: '      Resource = "arn:aws:iam::*:role/SandboxRole"', hint: "Wildcard resource on IAM actions — scope to sandbox roles only" },
        { id: "l24", code: '    }]', isBroken: false },
        { id: "l25", code: '  })', isBroken: false },
        { id: "l26", code: '}', isBroken: false },
      ],
      success: "These exact fixes stabilized 200+ accounts and saved $2M/year by killing untagged sandbox resources automatically.",
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
      type: "k8s-scheduler",
      title: "EKS Pod Scheduler",
      prompt: "Assign each pod to the correct EKS node based on CPU/memory constraints and node labels. This is how I planned workload placement for our container platform.",
      pods: [
        { id: "api", name: "api-gateway", cpu: 2, mem: 4, icon: "🌐" },
        { id: "worker", name: "batch-worker", cpu: 4, mem: 8, icon: "⚙️" },
        { id: "cache", name: "redis-cache", cpu: 1, mem: 8, icon: "💾" },
        { id: "monitor", name: "datadog-agent", cpu: 1, mem: 2, icon: "📊" },
        { id: "vault", name: "vault-injector", cpu: 1, mem: 2, icon: "🔐" },
        { id: "istio", name: "istio-proxy", cpu: 2, mem: 4, icon: "🔀" },
      ],
      nodes: [
        { id: "compute", name: "m5.2xlarge (Compute)", cpuCap: 8, memCap: 16, labels: ["workload=compute"] },
        { id: "memory", name: "r5.xlarge (Memory)", cpuCap: 4, memCap: 16, labels: ["workload=memory"] },
        { id: "system", name: "t3.large (System)", cpuCap: 2, memCap: 4, labels: ["workload=system"] },
      ],
      solution: { "api": "compute", "worker": "compute", "cache": "memory", "monitor": "system", "vault": "system", "istio": "memory" },
      success: "This scheduling strategy cut deploy cycles from 5 days to under 2 hours with zero resource contention.",
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
      type: "aws-arch",
      title: "Serverless Event-Driven Architecture",
      prompt: "Build the multi-region serverless architecture I designed for 1000+ developers — place each AWS service in its correct slot.",
      tiers: ["API Layer", "Processing", "Storage", "Orchestration"],
      services: [
        { id: "apigw", name: "API Gateway", icon: "🚪", desc: "REST/WebSocket API endpoint — request routing & throttling" },
        { id: "lambda", name: "Lambda", icon: "⚡", desc: "Serverless functions — event-driven compute, zero servers" },
        { id: "sqs", name: "SQS", icon: "📨", desc: "Message queue — decouples producers and consumers" },
        { id: "dynamo", name: "DynamoDB", icon: "🗃️", desc: "NoSQL database — single-digit ms latency at any scale" },
        { id: "step", name: "Step Functions", icon: "🔄", desc: "Workflow orchestration — visual state machines for complex flows" },
        { id: "eventbridge", name: "EventBridge", icon: "📡", desc: "Event bus — routes events between services and accounts" },
      ],
      slots: [
        { id: "slot-api", label: "API Endpoint", tier: "API Layer", correctService: "apigw" },
        { id: "slot-compute", label: "Compute", tier: "Processing", correctService: "lambda" },
        { id: "slot-queue", label: "Message Queue", tier: "Processing", correctService: "sqs" },
        { id: "slot-db", label: "Database", tier: "Storage", correctService: "dynamo" },
        { id: "slot-workflow", label: "Workflow Engine", tier: "Orchestration", correctService: "step" },
        { id: "slot-events", label: "Event Router", tier: "Orchestration", correctService: "eventbridge" },
      ],
      success: "This event-driven architecture served 1000+ developers with 60% less complexity than the previous monolith.",
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
      type: "aws-arch",
      title: "Azure Enterprise RAG Architecture",
      prompt: "⚠️ EXTREME DIFFICULTY — This is a 10-service, 6-tier Azure RAG architecture. You need deep knowledge of Azure AI services, networking, identity, and data pipelines to solve this. Think smart. Think like an architect.",
      extreme: true,
      tiers: ["Identity & Security", "Networking", "Data Ingestion", "Vector & Search", "AI Inference", "Orchestration & UX"],
      services: [
        { id: "entra", name: "Entra ID", icon: "🔐", desc: "Identity provider — RBAC, conditional access, managed identities for zero-trust" },
        { id: "keyvault", name: "Key Vault", icon: "🔑", desc: "Secrets management — API keys, certificates, encryption keys with HSM backing" },
        { id: "apim", name: "API Management", icon: "🚪", desc: "API gateway — rate limiting, auth policies, usage analytics, prompt filtering" },
        { id: "privatelink", name: "Private Link", icon: "🔒", desc: "Private networking — all AI traffic stays on Microsoft backbone, no public internet" },
        { id: "blob", name: "Blob Storage", icon: "📂", desc: "Document lake — PDFs, images, compliance docs ingested for RAG pipeline" },
        { id: "docintl", name: "Document Intelligence", icon: "📄", desc: "AI document cracking — OCR, layout analysis, table extraction from scanned docs" },
        { id: "aisearch", name: "AI Search", icon: "🔍", desc: "Vector + keyword hybrid search — semantic ranking, custom skillsets, index projections" },
        { id: "cosmosdb", name: "Cosmos DB", icon: "🌐", desc: "Vector database — DiskANN index, chat history, session state at global scale" },
        { id: "openai", name: "Azure OpenAI", icon: "🧠", desc: "GPT-4o & embeddings — content filtering, PTU provisioning, managed deployments" },
        { id: "appservice", name: "App Service", icon: "💻", desc: "Frontend & orchestrator — LangChain app, streaming responses, auth integration" },
      ],
      slots: [
        { id: "slot-identity", label: "Zero-Trust Identity", tier: "Identity & Security", correctService: "entra" },
        { id: "slot-secrets", label: "Secrets & Keys", tier: "Identity & Security", correctService: "keyvault" },
        { id: "slot-gateway", label: "API Gateway & Filtering", tier: "Networking", correctService: "apim" },
        { id: "slot-network", label: "Private Connectivity", tier: "Networking", correctService: "privatelink" },
        { id: "slot-docs", label: "Document Lake", tier: "Data Ingestion", correctService: "blob" },
        { id: "slot-crack", label: "Document Cracking (OCR)", tier: "Data Ingestion", correctService: "docintl" },
        { id: "slot-search", label: "Hybrid Search Index", tier: "Vector & Search", correctService: "aisearch" },
        { id: "slot-vector", label: "Vector DB & Chat History", tier: "Vector & Search", correctService: "cosmosdb" },
        { id: "slot-llm", label: "LLM Inference", tier: "AI Inference", correctService: "openai" },
        { id: "slot-app", label: "Orchestrator & Frontend", tier: "Orchestration & UX", correctService: "appservice" },
      ],
      success: "You just architected a production-grade Azure RAG platform — the same architecture powering enterprise AI at BMO under full banking compliance. Not many can solve this one. 🏆",
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   PUZZLE 1: AWS ARCHITECTURE BUILDER (Canvas Diagram)
   ═══════════════════════════════════════════════════════════ */

const AwsArchBuilderPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton, onReset }: {
  puzzle: AwsArchPuzzle; color: string; solved: boolean; onSolve: () => void;
  autoReveal?: boolean; revealButton?: React.ReactNode; onReset?: () => void;
}) => {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<{ slotId: string; msg: string } | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoReveal) {
      const auto: Record<string, string> = {};
      puzzle.slots.forEach(s => { auto[s.id] = s.correctService; });
      setPlacements(auto);
    }
  }, [autoReveal, puzzle.slots]);

  const isDone = solved || autoReveal || Object.keys(placements).length === puzzle.slots.length;
  const placedServices = new Set(Object.values(placements));
  const availableServices = puzzle.services.filter(s => !placedServices.has(s.id));

  // Layout: compute node positions on canvas
  const tierCount = puzzle.tiers.length;
  const isExtreme = puzzle.extreme;
  const canvasH = isExtreme ? 520 : 340;
  const canvasW = 600; // logical width

  const getSlotPositions = useCallback(() => {
    const positions: Record<string, { x: number; y: number; tier: string }> = {};
    const tierH = canvasH / tierCount;
    puzzle.tiers.forEach((tier, tIdx) => {
      const tierSlots = puzzle.slots.filter(s => s.tier === tier);
      const slotW = canvasW / (tierSlots.length + 1);
      tierSlots.forEach((slot, sIdx) => {
        positions[slot.id] = {
          x: slotW * (sIdx + 1),
          y: tierH * tIdx + tierH / 2,
          tier,
        };
      });
    });
    return positions;
  }, [puzzle, canvasH, canvasW, tierCount]);

  const slotPositions = getSlotPositions();

  // Get arrows: connect slots between adjacent tiers
  const arrows = useMemo(() => {
    const result: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];
    for (let t = 0; t < puzzle.tiers.length - 1; t++) {
      const fromSlots = puzzle.slots.filter(s => s.tier === puzzle.tiers[t]);
      const toSlots = puzzle.slots.filter(s => s.tier === puzzle.tiers[t + 1]);
      fromSlots.forEach(fs => {
        toSlots.forEach(ts => {
          const from = slotPositions[fs.id];
          const to = slotPositions[ts.id];
          if (from && to) {
            result.push({ from: { x: from.x, y: from.y + 18 }, to: { x: to.x, y: to.y - 18 } });
          }
        });
      });
    }
    return result;
  }, [puzzle, slotPositions]);

  const handleDragStart = (e: React.DragEvent, serviceId: string) => {
    setWrongFeedback(null);
    e.dataTransfer.setData("text/plain", serviceId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    const serviceId = e.dataTransfer.getData("text/plain");
    if (!serviceId || isDone) return;
    const slot = puzzle.slots.find(s => s.id === slotId);
    if (!slot) return;
    if (serviceId === slot.correctService) {
      setWrongFeedback(null);
      setPlacements(prev => {
        const next = { ...prev, [slotId]: serviceId };
        if (Object.keys(next).length === puzzle.slots.length) onSolve();
        return next;
      });
    } else {
      const svc = puzzle.services.find(s => s.id === serviceId);
      setWrongFeedback({
        slotId,
        msg: `${svc?.name || serviceId} doesn't fit "${slot.label}" — think about what this tier actually needs.`,
      });
      setTimeout(() => setWrongFeedback(null), 3500);
    }
  };

  const nodeW = isExtreme ? 120 : 130;
  const nodeH = 36;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        <button onClick={() => { setPlacements({}); setWrongFeedback(null); onReset?.(); }}
          className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
          style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>
      </div>

      {/* Extreme difficulty warning */}
      {puzzle.extreme && !isDone && (
        <motion.div className="rounded-lg p-2.5 flex items-start gap-2"
          style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.2)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.span className="text-sm shrink-0" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>⚠️</motion.span>
          <p className="text-[9px] font-body" style={{ color: "rgba(45,42,38,0.65)" }}>
            <strong style={{ color: "#dc3232" }}>Extreme Difficulty</strong> — {puzzle.services.length} services, {puzzle.tiers.length} tiers.
            Drag each service from the palette onto the correct node in the diagram. Wrong drops tell you why.
          </p>
        </motion.div>
      )}

      {/* Wrong feedback */}
      <AnimatePresence>
        {wrongFeedback && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-lg p-2 flex items-center gap-2"
            style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.18)" }}>
            <span>❌</span>
            <p className="text-[9px] font-mono" style={{ color: "#dc3232" }}>{wrongFeedback.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service palette — compact horizontal strip */}
      {!isDone && availableServices.length > 0 && (
        <div className="rounded-lg p-2" style={{ background: "rgba(180,140,100,0.04)", border: "1px solid rgba(180,140,100,0.1)" }}>
          <p className="text-[7px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "rgba(80,70,60,0.4)" }}>
            Drag services ↓ onto the diagram ({availableServices.length} remaining)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableServices.map(svc => (
              <div key={svc.id}
                draggable
                onDragStart={(e) => handleDragStart(e, svc.id)}
                onMouseEnter={() => setHoveredService(svc.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="relative px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing select-none transition-all"
                style={{
                  background: "#fefcf9",
                  border: `1.5px solid rgba(180,140,100,0.2)`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  fontSize: 10,
                }}>
                <span className="font-mono flex items-center gap-1">
                  <span>{svc.icon}</span>
                  <span style={{ color: "#2d2a26", fontWeight: 600 }}>{svc.name}</span>
                </span>
                {/* Tooltip on hover */}
                {hoveredService === svc.id && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 top-full mt-1 z-50 p-2 rounded-md w-48"
                    style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
                    <p className="text-[9px] font-body leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{svc.desc}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canvas diagram with SVG arrows */}
      <div ref={canvasRef} className="relative rounded-lg overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${color}04 0%, ${color}08 100%)`, border: `1px solid ${color}20`, height: canvasH }}>

        {/* Tier labels on left edge */}
        {puzzle.tiers.map((tier, tIdx) => {
          const tierH = canvasH / tierCount;
          return (
            <div key={tier} className="absolute left-0 flex items-center px-1.5"
              style={{ top: tierH * tIdx, height: tierH, borderBottom: tIdx < tierCount - 1 ? `1px dashed ${color}15` : "none" }}>
              <p className="text-[7px] font-mono font-bold uppercase tracking-wider writing-mode-vertical"
                style={{ color: `${color}60`, writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>
                {tier}
              </p>
            </div>
          );
        })}

        {/* SVG arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id={`arrowhead-${color.replace("#", "")}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={`${color}35`} />
            </marker>
          </defs>
          {arrows.map((a, i) => {
            // Convert logical coords to percentages
            const x1 = (a.from.x / canvasW) * 100;
            const y1 = (a.from.y / canvasH) * 100;
            const x2 = (a.to.x / canvasW) * 100;
            const y2 = (a.to.y / canvasH) * 100;
            // Curve midpoint
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            return (
              <line key={i}
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                stroke={`${color}25`}
                strokeWidth="1.5"
                strokeDasharray="4 3"
                markerEnd={`url(#arrowhead-${color.replace("#", "")})`}
              />
            );
          })}
        </svg>

        {/* Slot nodes */}
        {puzzle.slots.map(slot => {
          const pos = slotPositions[slot.id];
          if (!pos) return null;
          const placed = placements[slot.id];
          const service = placed ? puzzle.services.find(s => s.id === placed) : null;
          const isOver = dragOverSlot === slot.id;
          const isWrong = wrongFeedback?.slotId === slot.id;
          return (
            <motion.div key={slot.id}
              className="absolute flex flex-col items-center justify-center rounded-lg transition-all"
              style={{
                left: `calc(${(pos.x / canvasW) * 100}% - ${nodeW / 2}px)`,
                top: `calc(${(pos.y / canvasH) * 100}% - ${nodeH / 2}px)`,
                width: nodeW,
                height: nodeH,
                background: placed ? `${color}15` : isOver ? `${color}10` : "rgba(254,252,249,0.9)",
                border: `2px ${placed ? "solid" : "dashed"} ${placed ? `${color}60` : isOver ? color : isWrong ? "#dc3232" : `${color}30`}`,
                boxShadow: placed ? `0 2px 8px ${color}15` : isOver ? `0 0 12px ${color}20` : "0 1px 4px rgba(0,0,0,0.06)",
                zIndex: 2,
                cursor: isDone ? "default" : "default",
              }}
              animate={isWrong ? { x: [0, -4, 4, -3, 3, 0] } : isOver ? { scale: 1.05 } : { scale: 1 }}
              transition={isWrong ? { duration: 0.35 } : { duration: 0.15 }}
              onDragOver={(e) => { e.preventDefault(); setDragOverSlot(slot.id); }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => handleDrop(e as unknown as React.DragEvent, slot.id)}>
              {service ? (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 px-2">
                  <span className="text-sm">{service.icon}</span>
                  <span className="text-[9px] font-mono font-bold" style={{ color }}>{service.name}</span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center px-1.5">
                  <span className="text-[8px] font-mono text-center leading-tight" style={{ color: isOver ? color : "rgba(80,70,60,0.4)" }}>
                    {isOver ? "Release ↓" : slot.label}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {puzzle.slots.map((s, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: placements[s.id] ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Architecture Complete</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}
      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 2: TERRAFORM PLAN DEBUGGER
   ═══════════════════════════════════════════════════════════ */

const TerraformDebuggerPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton, onReset }: {
  puzzle: TerraformPuzzle; color: string; solved: boolean; onSolve: () => void;
  autoReveal?: boolean; revealButton?: React.ReactNode; onReset?: () => void;
}) => {
  const [fixed, setFixed] = useState<Set<string>>(new Set());
  const brokenLines = puzzle.lines.filter(l => l.isBroken);
  const totalBroken = brokenLines.length;

  useEffect(() => {
    if (autoReveal) setFixed(new Set(brokenLines.map(l => l.id)));
  }, [autoReveal]);

  const isDone = solved || autoReveal || fixed.size === totalBroken;

  const handleLineClick = (line: TfLine) => {
    if (isDone || !line.isBroken || fixed.has(line.id)) return;
    setFixed(prev => {
      const next = new Set(prev);
      next.add(line.id);
      if (next.size === totalBroken) onSolve();
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        <button onClick={() => { setFixed(new Set()); onReset?.(); }}
          className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
          style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>
      <p className="text-[9px] font-mono px-2 py-1 rounded inline-block" style={{ background: `${color}08`, color, border: `1px solid ${color}20` }}>
        🐛 {totalBroken - fixed.size} bug{totalBroken - fixed.size !== 1 ? "s" : ""} remaining
      </p>

      {/* Code block */}
      <div className="rounded-lg overflow-hidden" style={{ background: "#1a1a2e", border: "1px solid #2a2a4a" }}>
        <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: "#12122a" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f56" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#27c93f" }} />
          <span className="text-[9px] font-mono ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{puzzle.fileName}</span>
        </div>
        <div className="p-3 overflow-x-auto">
          {puzzle.lines.map((line, idx) => {
            const isFixed = fixed.has(line.id);
            const isBroken = line.isBroken && !isFixed;
            return (
              <motion.div key={line.id}
                onClick={() => handleLineClick(line)}
                className={`flex items-start gap-2 px-1 py-0.5 rounded-sm ${line.isBroken && !isDone ? "cursor-pointer" : ""}`}
                style={{
                  background: isFixed ? "rgba(42,125,79,0.1)" : isBroken ? "rgba(220,50,50,0.05)" : "transparent",
                }}
                whileHover={isBroken ? { background: "rgba(220,50,50,0.12)" } : {}}>
                <span className="text-[9px] font-mono w-5 text-right shrink-0 select-none"
                  style={{ color: isBroken ? "#dc3232" : isFixed ? "#2a7d4f" : "rgba(255,255,255,0.2)" }}>{idx + 1}</span>
                <span className="text-[11px] font-mono whitespace-pre" style={{
                  color: isFixed ? "#7ee8a8" : isBroken ? "#ff8888" : line.code === "" ? "transparent" : "rgba(255,255,255,0.75)",
                  textDecoration: isFixed ? "none" : isBroken ? "wavy underline" : "none",
                  textDecorationColor: isBroken ? "#dc323260" : undefined,
                }}>
                  {isFixed && line.fix ? line.fix : line.code || " "}
                </span>
                {isBroken && (
                  <motion.span className="text-[8px] shrink-0 ml-auto"
                    animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    ⚠️
                  </motion.span>
                )}
                {isFixed && (
                  <span className="text-[8px] shrink-0 ml-auto">✅</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fixed hints */}
      {fixed.size > 0 && (
        <div className="space-y-1.5">
          {brokenLines.filter(l => fixed.has(l.id)).map(l => (
            <motion.div key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="text-[9px] font-mono p-2 rounded-lg flex items-start gap-2"
              style={{ background: "rgba(42,125,79,0.04)", border: "1px solid rgba(42,125,79,0.1)", color: "rgba(45,42,38,0.7)" }}>
              <span style={{ color: "#2a7d4f" }}>✓</span> {l.hint}
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {brokenLines.map((l, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: fixed.has(l.id) ? "#2a7d4f" : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ All Bugs Fixed</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}
      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 3: K8S POD SCHEDULER
   ═══════════════════════════════════════════════════════════ */

const K8sPodSchedulerPuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton, onReset }: {
  puzzle: K8sPuzzle; color: string; solved: boolean; onSolve: () => void;
  autoReveal?: boolean; revealButton?: React.ReactNode; onReset?: () => void;
}) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [wrongNode, setWrongNode] = useState<string | null>(null);

  useEffect(() => {
    if (autoReveal) setAssignments({ ...puzzle.solution });
  }, [autoReveal, puzzle.solution]);

  const isDone = solved || autoReveal || Object.keys(assignments).length === puzzle.pods.length;
  const assignedPods = new Set(Object.keys(assignments));
  const availablePods = puzzle.pods.filter(p => !assignedPods.has(p.id));

  const getNodeUsage = (nodeId: string) => {
    let cpu = 0, mem = 0;
    Object.entries(assignments).forEach(([podId, nId]) => {
      if (nId === nodeId) {
        const pod = puzzle.pods.find(p => p.id === podId);
        if (pod) { cpu += pod.cpu; mem += pod.mem; }
      }
    });
    return { cpu, mem };
  };

  const handleNodeClick = (nodeId: string) => {
    if (isDone || !selectedPod) return;
    if (puzzle.solution[selectedPod] === nodeId) {
      setAssignments(prev => {
        const next = { ...prev, [selectedPod]: nodeId };
        if (Object.keys(next).length === puzzle.pods.length) onSolve();
        return next;
      });
      setSelectedPod(null);
    } else {
      setWrongNode(nodeId);
      setTimeout(() => setWrongNode(null), 500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Container size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        <button onClick={() => { setAssignments({}); setSelectedPod(null); onReset?.(); }}
          className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
          style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Pod palette */}
      {!isDone && (
        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg" style={{ background: "rgba(180,140,100,0.04)", border: "1px solid rgba(180,140,100,0.1)" }}>
          <p className="w-full text-[8px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(80,70,60,0.45)" }}>
            {selectedPod ? "Assign to a node below ↓" : "Select a pod to schedule ↓"}
          </p>
          {availablePods.map(pod => (
            <motion.button key={pod.id}
              onClick={() => setSelectedPod(pod.id === selectedPod ? null : pod.id)}
              className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
              style={{
                background: selectedPod === pod.id ? `${color}15` : "#fefcf9",
                border: `1.5px solid ${selectedPod === pod.id ? color : "rgba(180,140,100,0.15)"}`,
                color: selectedPod === pod.id ? color : "#2d2a26",
              }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {pod.icon} {pod.name}
              <span className="ml-1 opacity-50">({pod.cpu}cpu, {pod.mem}Gi)</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Nodes */}
      <div className="space-y-2.5">
        {puzzle.nodes.map(node => {
          const usage = getNodeUsage(node.id);
          const isWrong = wrongNode === node.id;
          const assignedHere = Object.entries(assignments).filter(([, nId]) => nId === node.id)
            .map(([pId]) => puzzle.pods.find(p => p.id === pId)!);
          return (
            <motion.div key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={`rounded-lg p-3 ${selectedPod ? "cursor-pointer" : ""}`}
              style={{
                background: selectedPod ? `${color}04` : "#fefcf9",
                border: `1.5px solid ${isWrong ? "#dc3232" : selectedPod ? `${color}25` : "rgba(180,140,100,0.15)"}`,
              }}
              animate={isWrong ? { x: [0, -3, 3, -2, 2, 0] } : {}}
              transition={isWrong ? { duration: 0.35 } : {}}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-mono font-bold" style={{ color: "#2d2a26" }}>🖥️ {node.name}</p>
                <div className="flex items-center gap-2">
                  {node.labels.map(l => (
                    <span key={l} className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: `${color}08`, color, border: `1px solid ${color}15` }}>{l}</span>
                  ))}
                </div>
              </div>
              {/* Capacity bars */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="flex justify-between text-[8px] font-mono mb-0.5" style={{ color: "rgba(80,70,60,0.5)" }}>
                    <span>CPU</span><span>{usage.cpu}/{node.cpuCap}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(180,140,100,0.1)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: usage.cpu > node.cpuCap ? "#dc3232" : color }}
                      animate={{ width: `${Math.min((usage.cpu / node.cpuCap) * 100, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] font-mono mb-0.5" style={{ color: "rgba(80,70,60,0.5)" }}>
                    <span>Memory</span><span>{usage.mem}/{node.memCap}Gi</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(180,140,100,0.1)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: usage.mem > node.memCap ? "#dc3232" : color }}
                      animate={{ width: `${Math.min((usage.mem / node.memCap) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
              {/* Assigned pods */}
              {assignedHere.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {assignedHere.map(p => (
                    <span key={p.id} className="text-[9px] font-mono px-2 py-0.5 rounded"
                      style={{ background: `${color}08`, border: `1px solid ${color}15`, color }}>
                      {p.icon} {p.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {puzzle.pods.map((p, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: assignments[p.id] ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ All Pods Scheduled</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}
      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE 4: CI/CD PIPELINE BUILDER
   ═══════════════════════════════════════════════════════════ */

const CicdPipelinePuzzle = ({ puzzle, color, solved, onSolve, autoReveal, revealButton, onReset }: {
  puzzle: CicdPuzzle; color: string; solved: boolean; onSolve: () => void;
  autoReveal?: boolean; revealButton?: React.ReactNode; onReset?: () => void;
}) => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => { if (autoReveal) setPlaced([...puzzle.correctOrder]); }, [autoReveal, puzzle.correctOrder]);

  const isDone = solved || autoReveal || placed.length === puzzle.correctOrder.length;
  const nextExpected = puzzle.correctOrder[placed.length];
  const placedSet = new Set(placed);

  const handleClick = (id: string) => {
    if (isDone || placedSet.has(id)) return;
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
          <GitBranch size={14} style={{ color }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{puzzle.title}</p>
        </div>
        <button onClick={() => { setPlaced([]); setWrongId(null); onReset?.(); }}
          className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
          style={{ color: "rgba(80,70,60,0.5)", background: "rgba(80,70,60,0.04)", border: "1px solid rgba(80,70,60,0.1)" }}>Reset</button>
      </div>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.7)" }}>{puzzle.prompt}</p>

      {/* Placed pipeline */}
      {placed.length > 0 && (
        <div className="rounded-lg p-2.5" style={{ background: "#1a1a2e", border: "1px solid #2a2a4a" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#27c93f" }} />
            <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>Pipeline ({placed.length}/{puzzle.correctOrder.length})</span>
          </div>
          {placed.map((id, i) => {
            const stage = puzzle.stages.find(s => s.id === id)!;
            return (
              <motion.div key={id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 py-1 px-2">
                <span className="text-[9px] font-mono" style={{ color: `${color}80` }}>{i + 1}.</span>
                <span className="text-xs">{stage.icon}</span>
                <span className="text-[11px] font-mono" style={{ color: "#7ee8a8" }}>{stage.label}</span>
                {i < placed.length - 1 && <span className="text-[8px] ml-auto" style={{ color: "rgba(255,255,255,0.2)" }}>→</span>}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Available stages */}
      {!isDone && (
        <div className="space-y-1.5">
          <p className="text-[8px] font-mono uppercase tracking-widest" style={{ color: "rgba(80,70,60,0.45)" }}>
            Click the next stage ({placed.length + 1}/{puzzle.correctOrder.length})
          </p>
          {puzzle.stages.filter(s => !placedSet.has(s.id)).map(stage => {
            const isWrong = wrongId === stage.id;
            return (
              <motion.button key={stage.id}
                onClick={() => handleClick(stage.id)}
                className="w-full text-left p-2.5 rounded-lg cursor-pointer transition-all flex items-start gap-2.5"
                style={{
                  background: isWrong ? "rgba(220,50,50,0.06)" : "#fefcf9",
                  border: `1.5px solid ${isWrong ? "#dc3232" : "rgba(180,140,100,0.15)"}`,
                }}
                animate={isWrong ? { x: [0, -3, 3, -2, 2, 0] } : {}}
                transition={isWrong ? { duration: 0.35 } : {}}
                whileHover={{ background: `${color}06` }}>
                <span className="text-base mt-0.5">{stage.icon}</span>
                <div>
                  <p className="text-xs font-mono font-bold" style={{ color: "#2d2a26" }}>{stage.label}</p>
                  <p className="text-[9px] font-body" style={{ color: "rgba(45,42,38,0.55)" }}>{stage.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {puzzle.correctOrder.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < placed.length ? color : "rgba(180,140,100,0.12)" }} />
        ))}
      </div>

      {isDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.06)", border: "1px solid rgba(42,125,79,0.15)" }}>
          <p className="text-[9px] font-mono uppercase mb-1" style={{ color: "#2a7d4f" }}>✓ Pipeline Complete</p>
          <p className="text-sm font-body" style={{ color: "rgba(45,42,38,0.78)" }}>{puzzle.success}</p>
        </motion.div>
      )}
      {!isDone && revealButton}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   REVEAL SOLUTION BUTTON
   ═══════════════════════════════════════════════════════════ */

const RevealButton = ({ onReveal, color, solved }: { onReveal: () => void; color: string; solved: boolean }) => {
  if (solved) return null;
  return (
    <motion.button onClick={onReveal}
      className="flex items-center gap-1.5 text-[9px] font-mono px-3 py-1.5 rounded-lg cursor-pointer transition-all mt-2"
      style={{ color: "rgba(80,70,60,0.5)", background: "rgba(180,140,100,0.04)", border: "1px solid rgba(180,140,100,0.12)" }}
      whileHover={{ scale: 1.03, background: `${color}08` }} whileTap={{ scale: 0.97 }}>
      <Eye size={10} /> Reveal Solution
    </motion.button>
  );
};

/* ═══════════════════════════════════════════════════════════
   PUZZLE ROUTER
   ═══════════════════════════════════════════════════════════ */

const PuzzleRouter = ({ puzzle, color, solved, onSolve, onUnsolve }: {
  puzzle: RolePuzzle; color: string; solved: boolean; onSolve: () => void; onUnsolve: () => void;
}) => {
  const [autoReveal, setAutoReveal] = useState(false);
  const handleReveal = useCallback(() => { setAutoReveal(true); onSolve(); }, [onSolve]);
  const handleReset = useCallback(() => { setAutoReveal(false); onUnsolve(); }, [onUnsolve]);

  useEffect(() => { setAutoReveal(false); }, [puzzle.title]);

  const revealButton = <RevealButton onReveal={handleReveal} color={color} solved={solved || autoReveal} />;

  switch (puzzle.type) {
    case "aws-arch": return <AwsArchBuilderPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} onReset={handleReset} />;
    case "terraform-debug": return <TerraformDebuggerPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} onReset={handleReset} />;
    case "k8s-scheduler": return <K8sPodSchedulerPuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} onReset={handleReset} />;
    case "cicd-pipeline": return <CicdPipelinePuzzle puzzle={puzzle} color={color} solved={solved} onSolve={onSolve} autoReveal={autoReveal} revealButton={revealButton} onReset={handleReset} />;
  }
};

/* ═══════════════════════════════════════════════════════════
   MAIN CAREER WORLD
   ═══════════════════════════════════════════════════════════ */

const puzzleLabel: Record<PuzzleType, string> = {
  "aws-arch": "Build Architecture",
  "terraform-debug": "Debug Terraform",
  "k8s-scheduler": "Schedule Pods",
  "cicd-pipeline": "Build Pipeline",
};

const AllSolvedTrophy = ({ color }: { color: string }) => (
  <motion.div className="w-full max-w-3xl mb-6"
    initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}>
    <div className="rounded-xl p-6 text-center relative overflow-hidden" style={{
      background: "linear-gradient(135deg, rgba(42,125,79,0.08), rgba(212,165,116,0.08))",
      border: "1px solid rgba(42,125,79,0.2)",
    }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: ["#2a7d4f", "#b5653a", "#0075BE", "#FF9900", "#005DAA", "#0078D4"][i % 6], left: `${10 + (i * 7) % 80}%`, top: `${10 + (i * 13) % 70}%` }}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.15 }} />
      ))}
      <motion.div className="text-5xl mb-3" animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>🏆</motion.div>
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: "#2a7d4f" }}>All Puzzles Mastered</h3>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.65)" }}>
        You've completed every cloud engineering challenge — from security automation to Azure AI governance.
      </p>
      <div className="flex justify-center gap-1.5 mt-3">
        {["☁️", "🔧", "📦", "🔄"].map((e, i) => (
          <motion.span key={i} className="text-sm" initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}>{e}</motion.span>
        ))}
      </div>
    </div>
  </motion.div>
);

const CareerTimelineWorld = ({ startRole }: { startRole?: string }) => {
  const [activeStop, setActiveStop] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [panel, setPanel] = useState<"overview" | "puzzle">("overview");
  const [solvedStops, setSolvedStops] = useState<Set<number>>(new Set());
  const allSolved = solvedStops.size === stops.length;

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
                <button onClick={() => setPanel("puzzle")} className="relative text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{ color: panel === "puzzle" ? stop.color : "rgba(80,70,60,0.55)", background: panel === "puzzle" ? `${stop.color}10` : "rgba(180,140,100,0.04)", border: `1px solid ${panel === "puzzle" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}` }}>
                  <span className="flex items-center gap-1.5">
                    <motion.span animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}>
                      <Sparkles size={10} style={{ color: solvedStops.has(activeStop) ? "#2a7d4f" : stop.color }} />
                    </motion.span>
                    {puzzleLabel[stop.puzzle.type]}
                    {!solvedStops.has(activeStop) && (
                      <motion.span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: stop.color }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                    )}
                  </span>
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
                  onSolve={() => setSolvedStops(prev => new Set(prev).add(activeStop))}
                  onUnsolve={() => setSolvedStops(prev => { const next = new Set(prev); next.delete(activeStop); return next; })} />
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
      <AnimatePresence>
        {allSolved && <AllSolvedTrophy color={stop.color} />}
      </AnimatePresence>
    </div>
  );
};

export default CareerTimelineWorld;
