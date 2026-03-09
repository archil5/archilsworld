import type { DiagramPuzzleData } from "@/components/puzzles/ArchDiagramPuzzle";

/* ═══════════════════════════════════════════════════════════
   CAREER ARCHITECTURE DIAGRAMS
   ═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   DIAGRAM 1: Enterprise AI & RAG Platform
   ─────────────────────────────────────────────────────────── */

export const aiRagDiagram: DiagramPuzzleData = {
  title: "Architecture Puzzle",
  roleTitle: "Principal Cloud Engineer — AI",
  projectName: "Enterprise AI & RAG Platform",
  description:
    "A secure, enterprise-grade AI and Retrieval-Augmented Generation (RAG) platform on Azure. I engineered the ingestion pipelines using Data Orchestrators to process documents into Azure AI Search for vector retrieval and Cosmos DB for Graph RAG. I integrated Azure API Management as a secure gateway, ensuring all internal LLM traffic routes through OpenAI Content Safety filters before hitting the core GPT models.",
  color: "#0078D4",
  successMessage:
    "You just reconstructed a production-grade Azure RAG platform — the same architecture powering enterprise AI under full banking compliance (PIPEDA/OSFI). 🏆",
  diagram: {
    groups: [
      { id: "auth", label: "Authentication", x: 2, y: 5, w: 14, h: 15, color: "#4CAF50" },
      { id: "ui", label: "User Interface", x: 18, y: 5, w: 14, h: 15, color: "#2196F3" },
      { id: "gateway", label: "API Gateway", x: 34, y: 5, w: 14, h: 15, color: "#9C27B0" },
      { id: "backend", label: "Backend Core", x: 50, y: 5, w: 14, h: 30, color: "#FF9800" },
      { id: "databases", label: "Knowledge Stores", x: 66, y: 5, w: 16, h: 30, color: "#00BCD4" },
      { id: "ai", label: "AI Core", x: 84, y: 5, w: 14, h: 30, color: "#FF5722" },
    ],
    nodes: [
      // Authentication
      { id: "entraid", label: "Entra ID (SSO)", x: 9, y: 13, w: 120, h: 36, icon: "🔐" },
      
      // User Interface
      { id: "frontend", label: "User Interface", x: 25, y: 13, w: 120, h: 36, icon: "💻" },
      
      // API Gateway
      { id: "apim", label: "Azure API Management", x: 41, y: 13, w: 160, h: 36, icon: "🚪", hidden: true },
      
      // Backend
      { id: "fastapi", label: "FastAPI Backend", x: 57, y: 13, w: 130, h: 36, icon: "🐍" },
      { id: "orchestrator", label: "Data Orchestrator", x: 57, y: 28, w: 140, h: 36, icon: "⚙️" },
      
      // Knowledge Stores
      { id: "vectordb", label: "Azure AI Search", x: 74, y: 13, w: 130, h: 36, icon: "🔍" },
      { id: "graphdb", label: "Cosmos DB (Graph)", x: 74, y: 28, w: 140, h: 36, icon: "🕸️", hidden: true },
      
      // AI Core
      { id: "safety", label: "Content Safety", x: 91, y: 13, w: 120, h: 36, icon: "🛡️", hidden: true },
      { id: "llm", label: "OpenAI Models", x: 91, y: 28, w: 120, h: 36, icon: "🧠", hidden: true },
    ],
    edges: [
      { from: "entraid", to: "frontend", label: "Authenticates" },
      { from: "frontend", to: "apim", label: "HTTPS" },
      { from: "apim", to: "fastapi", label: "API Calls" },
      { from: "fastapi", to: "vectordb", label: "Vanilla RAG" },
      { from: "fastapi", to: "graphdb", label: "Graph RAG" },
      { from: "fastapi", to: "safety", label: "Filter Query" },
      { from: "safety", to: "llm", label: "Generate Response" },
      { from: "orchestrator", to: "vectordb", label: "Ingest Vectors" },
      { from: "orchestrator", to: "graphdb", label: "Ingest Graph" },
    ],
    hiddenNodeIds: ["apim", "graphdb", "safety", "llm"],
    wordBank: [
      "Azure API Management",
      "Cosmos DB (Graph)",
      "Content Safety",
      "OpenAI Models",
      "Azure Firewall",
      "Event Grid",
      "Logic Apps",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 2: Secure API Gateway & Identity Verification
   ─────────────────────────────────────────────────────────── */

export const apiGatewayDiagram: DiagramPuzzleData = {
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

export const cicdRunnersDiagram: DiagramPuzzleData = {
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
