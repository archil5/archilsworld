import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { brandLogos } from "@/data/brandLogos";
import ArchDiagramPuzzle, { type DiagramPuzzleData } from "@/components/puzzles/ArchDiagramPuzzle";

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */

interface ProjectShowcase {
  name: string;
  description: string;
  highlights: string[];
}

interface RoleStop {
  company: string;
  title: string;
  period: string;
  color: string;
  narrative: string;
  challenge: string;
  impact: string;
  techStack: string[];
  wins: string[];
  project?: ProjectShowcase;
  diagramPuzzle?: DiagramPuzzleData;
}

/* ───────────────────────────────────────────────────────────
   DIAGRAM 1: Enterprise AI & RAG Platform
   ─────────────────────────────────────────────────────────── */

const aiRagDiagram: DiagramPuzzleData = {
  title: "Architecture Puzzle",
  roleTitle: "Principal Cloud Engineer — AI",
  projectName: "Enterprise AI & RAG Platform",
  description:
    "A secure, internal generative AI system leveraging Azure AI Search, Graph RAG (Cosmos DB), and OpenAI models. It ingests documents, processes them through an orchestration pipeline, and serves context-aware answers through a secure FastAPI backend, fully isolated behind API Gateways and strict content safety filters.",
  color: "#0078D4",
  successMessage:
    "You just reconstructed a production-grade Azure RAG platform — the same architecture powering enterprise AI under full banking compliance (PIPEDA/OSFI). 🏆",
  diagram: {
    groups: [
      { id: "auth", label: "Authentication", x: 1, y: 2, w: 12, h: 12, color: "#4CAF50" },
      { id: "ui", label: "User Interface", x: 14, y: 2, w: 12, h: 12, color: "#2196F3" },
      { id: "ingest", label: "Ingestion Pipeline", x: 1, y: 17, w: 26, h: 18, color: "#FF9800" },
      { id: "api", label: "API & Backend Core", x: 29, y: 2, w: 30, h: 34, color: "#9C27B0" },
      { id: "rag", label: "RAG Engines", x: 61, y: 2, w: 18, h: 18, color: "#E91E63" },
      { id: "knowledge", label: "Knowledge Stores", x: 61, y: 22, w: 18, h: 16, color: "#00BCD4" },
      { id: "ai", label: "AI Model & Tool Pool", x: 81, y: 2, w: 18, h: 34, color: "#FF5722" },
      { id: "obs", label: "Observability & Security", x: 29, y: 40, w: 70, h: 14, color: "#607D8B" },
    ],
    nodes: [
      // Authentication
      { id: "sso", label: "Enterprise SSO & MSAL", x: 7, y: 9, w: 120, h: 34, icon: "🔐" },
      // UI
      { id: "ui", label: "Frontend", x: 20, y: 9, w: 80, h: 34, icon: "💻" },
      // Ingestion
      { id: "upload", label: "User Upload via MFT", x: 5, y: 25, w: 115, h: 34, icon: "📤" },
      { id: "blobup", label: "Blob Storage: Uploads", x: 5, y: 32, w: 130, h: 34, icon: "📂" },
      { id: "do", label: "Data Orchestrator", x: 20, y: 28, w: 120, h: 34, icon: "⚙️" },
      // API & Backend
      { id: "gateway", label: "APIM / API Management", x: 38, y: 9, w: 140, h: 34, icon: "🚪", hidden: true },
      { id: "be", label: "Backend: FastAPI", x: 38, y: 18, w: 120, h: 34, icon: "🐍" },
      { id: "metadb", label: "Cosmos DB: Metadata", x: 50, y: 9, w: 135, h: 34, icon: "🗄️" },
      { id: "blobprompts", label: "Blob Storage: Prompts", x: 50, y: 18, w: 135, h: 34, icon: "📋" },
      // RAG Engines
      { id: "vrag", label: "Vanilla RAG + SAM", x: 70, y: 9, w: 115, h: 34, icon: "🔗" },
      { id: "grag", label: "Graph RAG", x: 70, y: 16, w: 95, h: 34, icon: "🕸️", hidden: true },
      // Knowledge Stores
      { id: "vectordb", label: "Azure AI Search", x: 66, y: 27, w: 120, h: 34, icon: "🔍" },
      { id: "graphdb", label: "Cosmos DB: Graph", x: 74, y: 34, w: 120, h: 34, icon: "🌐" },
      // AI Models
      { id: "safety", label: "OpenAI Content Safety", x: 90, y: 9, w: 135, h: 34, icon: "🛡️", hidden: true },
      { id: "llm", label: "OpenAI Models: o1 & 4o", x: 90, y: 18, w: 140, h: 34, icon: "🧠" },
      { id: "embed", label: "OpenAI Embedding Large", x: 90, y: 27, w: 145, h: 34, icon: "📊" },
      { id: "translate", label: "Azure Custom Translation", x: 90, y: 34, w: 150, h: 34, icon: "🌍" },
      // Observability
      { id: "sec", label: "Azure Key Vault", x: 38, y: 47, w: 115, h: 34, icon: "🔑" },
      { id: "mon", label: "Azure Monitor", x: 58, y: 47, w: 120, h: 34, icon: "📈" },
      { id: "eval", label: "RAIOps Evals", x: 78, y: 47, w: 100, h: 34, icon: "✅", hidden: true },
    ],
    edges: [
      { from: "sso", to: "ui" },
      { from: "ui", to: "gateway", bidirectional: true },
      { from: "gateway", to: "be", bidirectional: true },
      { from: "be", to: "metadb", bidirectional: true },
      { from: "be", to: "blobprompts", bidirectional: true },
      { from: "be", to: "vrag", bidirectional: true },
      { from: "be", to: "grag", bidirectional: true },
      { from: "upload", to: "blobup" },
      { from: "blobup", to: "do" },
      { from: "do", to: "vectordb" },
      { from: "do", to: "graphdb" },
      { from: "do", to: "embed" },
      { from: "vrag", to: "vectordb", bidirectional: true },
      { from: "grag", to: "graphdb", bidirectional: true },
      { from: "vrag", to: "embed" },
      { from: "grag", to: "embed" },
      { from: "vrag", to: "safety" },
      { from: "grag", to: "safety" },
      { from: "safety", to: "llm" },
      { from: "llm", to: "translate" },
      { from: "be", to: "mon", dashed: true },
      { from: "vrag", to: "eval", dashed: true },
    ],
    hiddenNodeIds: ["gateway", "grag", "safety", "eval"],
    wordBank: [
      "APIM / API Management",
      "Graph RAG",
      "OpenAI Content Safety",
      "RAIOps Evals",
      "Azure Firewall",
      "Event Grid",
      "Logic Apps",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 2: Secure API Gateway & Identity Verification
   ─────────────────────────────────────────────────────────── */

const apiGatewayDiagram: DiagramPuzzleData = {
  title: "Architecture Puzzle",
  roleTitle: "Principal Cloud Engineer — Serverless & Containers",
  projectName: "Secure API Gateway & Identity Verification Pattern",
  description:
    "A standardized, zero-trust network doorway for internal on-premise applications communicating with cloud backends. Traffic flows through a private Direct Connect to an AWS Load Balancer, hitting a Private API Gateway. Identity is validated via Custom Lambda Authorizers securely querying an Enterprise Identity Provider through a corporate proxy, before routing to serverless Fargate/Lambda backends.",
  color: "#FF9900",
  successMessage:
    "You've mapped the exact zero-trust API Gateway pattern used to secure enterprise traffic across on-prem and cloud — handling thousands of requests per second at scale. 🔒",
  diagram: {
    groups: [
      { id: "apigw-flow", label: "AWS API Gateway Internal Flow", x: 25, y: 22, w: 50, h: 40, color: "#FF9900" },
      { id: "identity", label: "Identity Verification Flow", x: 25, y: 65, w: 50, h: 18, color: "#4CAF50" },
      { id: "backends", label: "Backend Integrations", x: 78, y: 22, w: 21, h: 55, color: "#2196F3" },
    ],
    nodes: [
      // Entry
      { id: "client", label: "Enterprise On-Premise Client", x: 8, y: 10, w: 160, h: 38, icon: "🏢" },
      { id: "nlb", label: "AWS NLB (TLS)", x: 8, y: 30, w: 120, h: 34, icon: "⚖️" },
      { id: "vpce", label: "API Interface Endpoint", x: 8, y: 50, w: 140, h: 34, icon: "🔗" },
      { id: "apigw", label: "AWS API Gateway", x: 30, y: 30, w: 130, h: 34, icon: "🚪" },
      // API GW Flow
      { id: "respolicy", label: "Resource Policy", x: 38, y: 38, w: 110, h: 30, icon: "📜", hidden: true },
      { id: "cognito", label: "Cognito Authorizer", x: 33, y: 46, w: 120, h: 30, icon: "🪪" },
      { id: "custauth", label: "Custom Lambda Authorizer", x: 48, y: 46, w: 155, h: 30, icon: "⚡", hidden: true },
      { id: "iamauth", label: "IAM Policy", x: 63, y: 46, w: 95, h: 30, icon: "🔐" },
      { id: "apikey", label: "API Key Validation", x: 48, y: 53, w: 130, h: 30, icon: "🔑" },
      { id: "methodreq", label: "Method Request", x: 42, y: 58, w: 110, h: 28 },
      { id: "integreq", label: "Integration Request", x: 56, y: 58, w: 120, h: 28 },
      // Identity verification
      { id: "eni", label: "Elastic Network Interface", x: 30, y: 72, w: 155, h: 32, icon: "🔌" },
      { id: "sgproxy", label: "Corporate SG Proxy", x: 50, y: 72, w: 130, h: 32, icon: "🛡️" },
      { id: "corpidp", label: "Enterprise Identity Provider", x: 70, y: 72, w: 165, h: 32, icon: "🏛️", hidden: true },
      // Backends
      { id: "fargate", label: "ECS Fargate Container", x: 88, y: 35, w: 140, h: 34, icon: "📦" },
      { id: "lambda", label: "Backend Lambda", x: 88, y: 48, w: 120, h: 34, icon: "⚡" },
      { id: "db", label: "Backend Database", x: 88, y: 62, w: 120, h: 34, icon: "🗄️", hidden: true },
    ],
    edges: [
      { from: "client", to: "nlb", label: "Direct Connect" },
      { from: "nlb", to: "vpce" },
      { from: "vpce", to: "apigw" },
      { from: "apigw", to: "respolicy" },
      { from: "respolicy", to: "cognito" },
      { from: "respolicy", to: "custauth" },
      { from: "respolicy", to: "iamauth" },
      { from: "cognito", to: "apikey" },
      { from: "custauth", to: "apikey" },
      { from: "iamauth", to: "apikey" },
      { from: "apikey", to: "methodreq" },
      { from: "methodreq", to: "integreq" },
      { from: "custauth", to: "eni" },
      { from: "eni", to: "sgproxy" },
      { from: "sgproxy", to: "corpidp", bidirectional: true },
      { from: "integreq", to: "fargate", label: "VPC Link" },
      { from: "integreq", to: "lambda", label: "Direct" },
      { from: "fargate", to: "db", bidirectional: true },
    ],
    hiddenNodeIds: ["respolicy", "custauth", "corpidp", "db"],
    wordBank: [
      "Resource Policy",
      "Custom Lambda Authorizer",
      "Enterprise Identity Provider",
      "Backend Database",
      "WAF Rules",
      "CloudFront Distribution",
      "Step Functions",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 3: Ephemeral Autoscaling CI/CD Runners
   ─────────────────────────────────────────────────────────── */

const cicdRunnersDiagram: DiagramPuzzleData = {
  title: "Architecture Puzzle",
  roleTitle: "DevOps Engineer",
  projectName: "Ephemeral Autoscaling CI/CD Runners",
  description:
    "A highly secure, automated pipeline using ephemeral ECS Fargate containers as self-hosted GitHub runners. Triggered by repository events via autoscaling Lambdas, these runners execute in an isolated operations account, pull secure credentials locally, route outbound traffic through a corporate proxy, and deploy to target environments before immediately terminating.",
  color: "#24292e",
  successMessage:
    "You've mapped an enterprise-grade ephemeral runner architecture — zero persistent infrastructure, maximum security, fully automated scaling. This pattern processes thousands of CI/CD jobs daily. 🚀",
  diagram: {
    groups: [
      { id: "ops", label: "Operations Account — Self-Hosted Runner Environment", x: 20, y: 48, w: 55, h: 34, color: "#FF9900" },
      { id: "target", label: "Target Production Environment", x: 78, y: 62, w: 20, h: 20, color: "#4CAF50" },
    ],
    nodes: [
      { id: "dev", label: "Developer", x: 8, y: 8, w: 100, h: 34, icon: "👤" },
      { id: "apprepo", label: "Application Team Repo", x: 25, y: 8, w: 145, h: 34, icon: "📁" },
      { id: "comprepo", label: "Compliance Repo", x: 25, y: 20, w: 120, h: 34, icon: "📋" },
      { id: "gha", label: "GitHub Actions", x: 50, y: 8, w: 120, h: 34, icon: "▶️" },
      { id: "aslambda", label: "Autoscaling Lambda", x: 50, y: 22, w: 130, h: 34, icon: "⚡", hidden: true },
      { id: "runner", label: "Ephemeral Runners (ECS Fargate)", x: 38, y: 58, w: 185, h: 38, icon: "📦" },
      // Ops account resources
      { id: "s3", label: "S3 Build Artifacts", x: 25, y: 68, w: 120, h: 32, icon: "📂" },
      { id: "ssm", label: "SSM Parameters", x: 25, y: 77, w: 115, h: 32, icon: "⚙️" },
      { id: "secrets", label: "Secrets Manager", x: 50, y: 68, w: 120, h: 32, icon: "🔐", hidden: true },
      { id: "ecr", label: "Elastic Container Registry", x: 50, y: 77, w: 155, h: 32, icon: "🐳" },
      // External
      { id: "jfrog", label: "JFrog Artifactory", x: 70, y: 40, w: 120, h: 34, icon: "📦" },
      { id: "proxy", label: "Corporate Proxy", x: 70, y: 52, w: 110, h: 34, icon: "🛡️", hidden: true },
      { id: "internet", label: "Internet / GitHub APIs", x: 90, y: 46, w: 140, h: 34, icon: "🌐" },
      // Target
      { id: "targetinfra", label: "Target Infrastructure", x: 88, y: 72, w: 130, h: 34, icon: "🏗️", hidden: true },
    ],
    edges: [
      { from: "dev", to: "apprepo", label: "Creates PR" },
      { from: "apprepo", to: "comprepo", bidirectional: true, label: "Reusable Workflows" },
      { from: "apprepo", to: "gha", label: "Triggers" },
      { from: "gha", to: "aslambda", label: "on Start" },
      { from: "gha", to: "runner", label: "Run Request" },
      { from: "aslambda", to: "runner", label: "Scale up/down" },
      { from: "runner", to: "s3", bidirectional: true },
      { from: "runner", to: "ssm" },
      { from: "runner", to: "secrets" },
      { from: "runner", to: "ecr" },
      { from: "runner", to: "jfrog", bidirectional: true },
      { from: "runner", to: "proxy" },
      { from: "proxy", to: "internet" },
      { from: "runner", to: "targetinfra", label: "Deploy" },
      { from: "runner", to: "gha", label: "Status", dashed: true },
    ],
    hiddenNodeIds: ["aslambda", "secrets", "proxy", "targetinfra"],
    wordBank: [
      "Autoscaling Lambda",
      "Secrets Manager",
      "Corporate Proxy",
      "Target Infrastructure",
      "CloudWatch Logs",
      "Route 53",
      "API Gateway",
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   ROLE STOPS DATA
   ═══════════════════════════════════════════════════════════ */

const stops: RoleStop[] = [
  {
    company: "BMO",
    title: "Principal Cloud Engineer — AI",
    period: "Jun 2025–Present",
    color: "#0078D4",
    narrative:
      "The frontier. Architecting the secure backbone for enterprise AI — Azure-based platforms with strict model governance, RAG pipelines at scale, and zero-trust networking.",
    challenge: "Build secure AI platform under banking regulations (PIPEDA/OSFI)",
    impact: "Enterprise AI platform serving organization-wide",
    techStack: ["Azure OpenAI", "AI Search", "Cosmos DB", "FastAPI", "LangChain", "Python"],
    wins: [
      "Enterprise RAG platform architecture",
      "Graph RAG with Cosmos DB at petabyte scale",
      "Content safety + model governance framework",
      "Full private networking — zero public exposure",
    ],
    project: {
      name: "Enterprise AI & RAG Platform",
      description: "A secure, internal generative AI system leveraging Azure AI Search, Graph RAG (Cosmos DB), and OpenAI models. It ingests documents, processes them through an orchestration pipeline, and serves context-aware answers through a secure FastAPI backend, fully isolated behind API Gateways and strict content safety filters.",
      highlights: [
        "Azure AI Search + Graph RAG (Cosmos DB) for hybrid retrieval",
        "OpenAI models (o1 & 4o) with content safety filters",
        "Data Orchestrator ingestion pipeline with embedding generation",
        "Full private networking — zero public exposure via APIM",
        "RAIOps open-source evals for model quality monitoring",
      ],
    },
    diagramPuzzle: aiRagDiagram,
  },
  {
    company: "BMO",
    title: "Principal — Serverless & Containers",
    period: "Jul 2022–Aug 2025",
    color: "#FF9900",
    narrative:
      "Owning the platform. Multi-region architectures serving 1000+ developers. Designed the standardized zero-trust API gateway pattern used bank-wide.",
    challenge: "Create a secure, standardized API gateway pattern for 1000+ developers",
    impact: "Zero-trust gateway pattern adopted bank-wide",
    techStack: ["API Gateway", "Lambda", "ECS Fargate", "CDK", "NLB", "Cognito"],
    wins: [
      "Standardized API gateway pattern across enterprise",
      "Custom Lambda Authorizers with corp identity integration",
      "Private API Gateway — no public internet exposure",
      "Multi-region active-active serving 1000+ developers",
    ],
    project: {
      name: "Secure API Gateway & Identity Verification Pattern",
      description: "A standardized, zero-trust network doorway for internal on-premise applications communicating with cloud backends. Traffic flows through a private Direct Connect to an AWS Load Balancer, hitting a Private API Gateway. Identity is validated via Custom Lambda Authorizers securely querying an Enterprise Identity Provider through a corporate proxy, before routing to serverless Fargate/Lambda backends.",
      highlights: [
        "NLB with TLS termination over Direct Connect",
        "Private API Gateway via VPC Interface Endpoints",
        "Custom Lambda Authorizers for enterprise identity verification",
        "Corporate proxy integration for secure identity provider queries",
        "VPC Link to ECS Fargate + direct Lambda backend integrations",
      ],
    },
    diagramPuzzle: apiGatewayDiagram,
  },
  {
    company: "BMO",
    title: "DevOps Engineer",
    period: "Sep 2020–Jul 2022",
    color: "#24292e",
    narrative:
      "Built the CI/CD backbone. Ephemeral runners, automated compliance, and zero-trust deployment pipelines that process thousands of jobs daily.",
    challenge: "Build secure, scalable CI/CD with zero persistent infrastructure",
    impact: "Thousands of CI/CD jobs processed daily with zero persistent runners",
    techStack: ["GitHub Actions", "ECS Fargate", "Lambda", "Terraform", "Docker", "JFrog"],
    wins: [
      "Ephemeral runners — zero persistent infrastructure",
      "Autoscaling Lambda for dynamic runner provisioning",
      "Compliance-as-code via reusable workflows",
      "Corporate proxy integration for secure outbound",
    ],
    project: {
      name: "Ephemeral Autoscaling CI/CD Runners",
      description: "A highly secure, automated pipeline using ephemeral ECS Fargate containers as self-hosted GitHub runners. Triggered by repository events via autoscaling Lambdas, these runners execute in an isolated operations account, pull secure credentials locally, route outbound traffic through a corporate proxy, and deploy to target environments before immediately terminating.",
      highlights: [
        "Ephemeral ECS Fargate containers as self-hosted GitHub runners",
        "Autoscaling Lambda triggered by repository events",
        "Isolated operations account with SSM, Secrets Manager, ECR",
        "Corporate proxy for secure outbound to GitHub APIs",
        "Reusable compliance workflows across application repos",
      ],
    },
    diagramPuzzle: cicdRunnersDiagram,
  },
  {
    company: "RBC",
    title: "DevOps Engineer — Cybersecurity",
    period: "Sep 2018–Sep 2020",
    color: "#003168",
    narrative:
      "Where the journey started. Automating cybersecurity operations at one of Canada's largest banks — vulnerability scanning, compliance automation, and building the tools the security team relied on daily.",
    challenge: "Automate manual cybersecurity processes across enterprise infrastructure",
    impact: "Reduced vulnerability remediation time by 60% through automation",
    techStack: ["Python", "Ansible", "Jenkins", "Splunk", "Linux", "Bash"],
    wins: [
      "Automated vulnerability scanning & remediation workflows",
      "Built security compliance dashboards in Splunk",
      "CI/CD pipelines for security tooling deployment",
      "Infrastructure-as-code for security appliances",
    ],
    project: {
      name: "Cybersecurity Automation Platform",
      description: "An end-to-end automation platform for enterprise cybersecurity operations. Automated vulnerability scanning across thousands of endpoints, integrated findings into Splunk dashboards for real-time visibility, and built Ansible playbooks for automated remediation — reducing manual security operations by over 60%.",
      highlights: [
        "Automated vulnerability scanning across 10,000+ endpoints",
        "Splunk dashboards for real-time security posture visibility",
        "Ansible playbooks for automated remediation workflows",
        "Jenkins pipelines for security tooling CI/CD",
        "Python-based threat intelligence aggregation",
      ],
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   ALL SOLVED TROPHY
   ═══════════════════════════════════════════════════════════ */

const AllSolvedTrophy = () => (
  <motion.div
    className="w-full max-w-3xl mt-6"
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  >
    <div
      className="rounded-xl p-6 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(42,125,79,0.08), rgba(212,165,116,0.08))",
        border: "1px solid rgba(42,125,79,0.2)",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: ["#2a7d4f", "#0078D4", "#FF9900", "#24292e"][i % 4],
            left: `${10 + ((i * 7) % 80)}%`,
            top: `${10 + ((i * 13) % 70)}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + i * 0.3,
            delay: i * 0.15,
          }}
        />
      ))}
      <motion.div
        className="text-5xl mb-3"
        animate={{ rotateY: [0, 360] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        🏆
      </motion.div>
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: "#2a7d4f" }}>
        All Architecture Puzzles Solved
      </h3>
      <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.65)" }}>
        You've completed every cloud architecture challenge — from RAG platforms to zero-trust
        gateways to ephemeral CI/CD.
      </p>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN CAREER WORLD
   ═══════════════════════════════════════════════════════════ */

const CareerTimelineWorld = ({ startRole }: { startRole?: string }) => {
  const [activeStop, setActiveStop] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [panel, setPanel] = useState<"overview" | "puzzle">("overview");
  const [solvedStops, setSolvedStops] = useState<Set<number>>(new Set());
  const allSolved = solvedStops.size === stops.length;

  useEffect(() => {
    const timers = stops.map((_, i) =>
      setTimeout(() => setRevealed(i + 1), 200 + i * 200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!startRole) return;
    const idx = stops.findIndex(
      (s) =>
        s.title.toLowerCase().includes(startRole.toLowerCase()) ||
        s.company.toLowerCase() === startRole.toLowerCase()
    );
    if (idx >= 0) setActiveStop(idx);
  }, [startRole]);

  useEffect(() => {
    setPanel("overview");
  }, [activeStop]);

  const stop = stops[activeStop];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto">
      {/* Hero banner */}
      <motion.div
        className="w-full max-w-3xl mb-4 rounded-xl p-4 text-center"
        style={{
          background: "rgba(180,140,100,0.04)",
          border: "1px solid rgba(180,140,100,0.12)",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(80,70,60,0.5)" }}>
          Think you know cloud architecture?
        </p>
        <p className="text-sm font-display font-bold" style={{ color: "#2d2a26" }}>
          Try solving these flows — {stops.filter(s => s.diagramPuzzle).length} architecture puzzles, {stops.reduce((acc, s) => acc + (s.diagramPuzzle?.diagram.hiddenNodeIds.length || 0), 0)} hidden nodes total
        </p>
      </motion.div>

      {/* Journey Path */}
      <div className="w-full max-w-3xl mb-6">
        <div className="relative">
          <div
            className="absolute top-[28px] left-0 right-0 h-[3px] rounded-full"
            style={{ background: "rgba(180,140,100,0.15)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: stop.color }}
              initial={{ width: 0 }}
              animate={{
                width: `${((activeStop + 1) / stops.length) * 100}%`,
              }}
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
                  style={{ minWidth: 90 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    animate={
                      isActive ? { scale: [1, 1.08, 1] } : {}
                    }
                    transition={
                      isActive
                        ? { repeat: Infinity, duration: 2.5 }
                        : {}
                    }
                    style={{
                      background: isActive
                        ? `${s.color}12`
                        : isPast
                          ? `${s.color}06`
                          : "#fefcf9",
                      border: `3px solid ${isActive ? s.color : isPast ? `${s.color}50` : "rgba(180,140,100,0.2)"}`,
                      boxShadow: isActive
                        ? `0 0 16px ${s.color}20`
                        : "none",
                    }}
                  >
                    {brandLogos[s.company] ? (
                      <img
                        src={brandLogos[s.company]}
                        alt={s.company}
                        className="h-5 object-contain"
                      />
                    ) : (
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: s.color }}
                      >
                        {s.company}
                      </span>
                    )}
                    {isSolved && (
                      <span
                        className="absolute -bottom-1 -right-1 text-[8px] px-1 rounded"
                        style={{
                          background: "#2a7d4f",
                          color: "#fff",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </motion.div>
                  <span
                    className="text-[8px] font-mono text-center leading-tight max-w-[90px]"
                    style={{
                      color: isActive
                        ? "#2d2a26"
                        : "rgba(80,70,60,0.4)",
                    }}
                  >
                    {s.title.replace("Principal — ", "").replace("Principal Cloud Engineer — ", "")}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStop}
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${stop.color}20` }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: `${stop.color}06`,
                borderBottom: `1px solid ${stop.color}12`,
              }}
            >
              <div className="flex items-center gap-3">
                {brandLogos[stop.company] && (
                  <img
                    src={brandLogos[stop.company]}
                    alt={stop.company}
                    className="h-6 object-contain"
                  />
                )}
                <div>
                  <h3
                    className="font-display text-lg font-bold"
                    style={{ color: "#2d2a26" }}
                  >
                    {stop.title}
                  </h3>
                  <p
                    className="text-[10px] font-mono"
                    style={{ color: "rgba(80,70,60,0.55)" }}
                  >
                    {stop.period}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPanel("overview")}
                  className="text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{
                    color:
                      panel === "overview"
                        ? stop.color
                        : "rgba(80,70,60,0.55)",
                    background:
                      panel === "overview"
                        ? `${stop.color}10`
                        : "rgba(180,140,100,0.04)",
                    border: `1px solid ${panel === "overview" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}`,
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setPanel("puzzle")}
                  className="relative text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                  style={{
                    color:
                      panel === "puzzle"
                        ? stop.color
                        : "rgba(80,70,60,0.55)",
                    background:
                      panel === "puzzle"
                        ? `${stop.color}10`
                        : "rgba(180,140,100,0.04)",
                    border: `1px solid ${panel === "puzzle" ? `${stop.color}20` : "rgba(180,140,100,0.1)"}`,
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <motion.span
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        repeatDelay: 1,
                      }}
                    >
                      <Sparkles
                        size={10}
                        style={{
                          color: solvedStops.has(activeStop)
                            ? "#2a7d4f"
                            : stop.color,
                        }}
                      />
                    </motion.span>
                    Solve Puzzle
                    {!solvedStops.has(activeStop) && (
                      <motion.span
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                        style={{ background: stop.color }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                        }}
                      />
                    )}
                  </span>
                </button>
              </div>
            </div>

            {panel === "overview" ? (
              <div
                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
                style={{ background: "#fefcf9" }}
              >
                <div className="space-y-4">
                  <div>
                    <p
                      className="text-[9px] font-mono uppercase tracking-wider mb-1.5"
                      style={{ color: stop.color }}
                    >
                      The Story
                    </p>
                    <p
                      className="text-sm font-body italic leading-relaxed"
                      style={{ color: "rgba(45,42,38,0.8)" }}
                    >
                      "{stop.narrative}"
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(228,77,38,0.04)",
                      border: "1px solid rgba(228,77,38,0.1)",
                    }}
                  >
                    <p
                      className="text-[9px] font-mono uppercase mb-1"
                      style={{ color: "#c0553a" }}
                    >
                      Challenge
                    </p>
                    <p
                      className="text-xs font-body"
                      style={{ color: "rgba(45,42,38,0.75)" }}
                    >
                      {stop.challenge}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: `${stop.color}08`,
                      border: `1px solid ${stop.color}15`,
                    }}
                  >
                    <p
                      className="text-[9px] font-mono uppercase mb-1"
                      style={{ color: stop.color }}
                    >
                      Impact
                    </p>
                    <p
                      className="text-xs font-mono font-bold"
                      style={{ color: stop.color }}
                    >
                      {stop.impact}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[9px] font-mono uppercase tracking-wider mb-2"
                      style={{ color: stop.color }}
                    >
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {stop.techStack.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{
                            background: `${stop.color}08`,
                            border: `1px solid ${stop.color}15`,
                            color: stop.color,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p
                    className="text-[9px] font-mono uppercase tracking-wider mb-2"
                    style={{ color: "#2a7d4f" }}
                  >
                    Key Wins
                  </p>
                  <div className="space-y-2">
                    {stop.wins.map((w, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-lg"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.15 + i * 0.08,
                        }}
                        style={{
                          background: "rgba(42,125,79,0.04)",
                          border: "1px solid rgba(42,125,79,0.1)",
                        }}
                      >
                        <span
                          className="text-[10px] mt-0.5"
                          style={{ color: "#2a7d4f" }}
                        >
                          ▸
                        </span>
                        <span
                          className="text-xs font-body"
                          style={{
                            color: "rgba(45,42,38,0.8)",
                          }}
                        >
                          {w}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Some of My Work — Project Showcase */}
                <div className="col-span-1 md:col-span-2 mt-2">
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: `${stop.color}04`,
                      border: `1px solid ${stop.color}12`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">🏗️</span>
                      <p
                        className="text-[9px] font-mono uppercase tracking-widest"
                        style={{ color: stop.color }}
                      >
                        Featured Project
                      </p>
                    </div>
                    <h4
                      className="font-display text-base font-bold mb-2"
                      style={{ color: "#2d2a26" }}
                    >
                      {stop.project.name}
                    </h4>
                    <p
                      className="text-xs font-body leading-relaxed mb-4"
                      style={{ color: "rgba(45,42,38,0.75)" }}
                    >
                      {stop.project.description}
                    </p>
                    <div className="space-y-1.5">
                      {stop.project.highlights.map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start gap-2 py-1"
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.06 }}
                        >
                          <span
                            className="text-[8px] mt-1 font-mono"
                            style={{ color: stop.color }}
                          >
                            ◆
                          </span>
                          <span
                            className="text-[11px] font-mono"
                            style={{ color: "rgba(45,42,38,0.7)" }}
                          >
                            {h}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="p-6 overflow-y-auto"
                style={{
                  background: "#fefcf9",
                  maxHeight: "70vh",
                }}
              >
                <ArchDiagramPuzzle
                  data={stop.diagramPuzzle}
                  solved={solvedStops.has(activeStop)}
                  onSolve={() =>
                    setSolvedStops((prev) =>
                      new Set(prev).add(activeStop)
                    )
                  }
                />
              </div>
            )}

            {/* Nav */}
            <div
              className="px-6 py-3 flex justify-between items-center"
              style={{
                background: "rgba(180,140,100,0.03)",
                borderTop: "1px solid rgba(180,140,100,0.08)",
              }}
            >
              <button
                onClick={() =>
                  setActiveStop(Math.max(0, activeStop - 1))
                }
                disabled={activeStop === 0}
                className="flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all disabled:opacity-30"
                style={{
                  color: "#6b6560",
                  background: "rgba(180,140,100,0.06)",
                  border: "1px solid rgba(180,140,100,0.12)",
                }}
              >
                <ChevronLeft size={12} /> Previous
              </button>
              <span
                className="text-[9px] font-mono"
                style={{ color: "rgba(80,70,60,0.35)" }}
              >
                {activeStop + 1} / {stops.length}
              </span>
              <button
                onClick={() =>
                  setActiveStop(
                    Math.min(stops.length - 1, activeStop + 1)
                  )
                }
                disabled={activeStop === stops.length - 1}
                className="flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all disabled:opacity-30"
                style={{
                  color: "#6b6560",
                  background: "rgba(180,140,100,0.06)",
                  border: "1px solid rgba(180,140,100,0.12)",
                }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {allSolved && <AllSolvedTrophy />}
      </AnimatePresence>
    </div>
  );
};

export default CareerTimelineWorld;
