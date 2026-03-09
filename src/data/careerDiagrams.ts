import type { DiagramPuzzleData } from "@/components/puzzles/ArchDiagramPuzzle";

/* ═══════════════════════════════════════════════════════════
   FUN PUZZLES — One unique puzzle per career role
   ═══════════════════════════════════════════════════════════ */

/* Role 0: BMO Principal Cloud Engineer — AI */
export const funPuzzleAI: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "☁️ AI Architecture Challenge",
  projectName: "Archie the AI Butler 🤖",
  description:
    "Oh no — Archie the AI Butler has lost his brain! He can't remember how to process voice commands, look up recipes, or control the smart home. Rebuild his neural pipeline so he can get back to making the perfect cup of tea.",
  color: "#0078D4",
  successMessage:
    "🎉 Archie is back online! He's already brewing tea and dimming the lights. You're a certified AI whisperer! 🧠☕",
  diagram: {
    groups: [
      { id: "input", label: "Voice Input Layer", x: 8, y: 8, w: 20, h: 30, color: "#2196F3" },
      { id: "brain", label: "Archie's Brain", x: 30, y: 8, w: 38, h: 30, color: "#9C27B0" },
      { id: "output", label: "Smart Home Actions", x: 70, y: 8, w: 22, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "mic", label: "Smart Microphone", x: 18, y: 18, w: 130, h: 30, icon: "🎙️" },
      { id: "stt", label: "Speech-to-Text", x: 18, y: 30, w: 115, h: 30, icon: "📝", hidden: true },
      { id: "nlu", label: "Intent Classifier (NLU)", x: 49, y: 14, w: 155, h: 30, icon: "🧠", hidden: true },
      { id: "rag", label: "Recipe Knowledge Base", x: 49, y: 24, w: 155, h: 30, icon: "📚" },
      { id: "planner", label: "Action Planner", x: 49, y: 34, w: 115, h: 30, icon: "📋", hidden: true },
      { id: "lights", label: "Smart Lights", x: 81, y: 14, w: 100, h: 28, icon: "💡" },
      { id: "kettle", label: "Smart Kettle", x: 81, y: 24, w: 100, h: 28, icon: "☕", hidden: true },
      { id: "speaker", label: "Voice Response", x: 81, y: 34, w: 115, h: 28, icon: "🔊" },
    ],
    edges: [
      { from: "mic", to: "stt", label: "Audio Stream" },
      { from: "stt", to: "nlu", label: "Text" },
      { from: "nlu", to: "rag", label: "Query" },
      { from: "nlu", to: "planner", label: "Intent" },
      { from: "planner", to: "lights", label: "dim(50%)" },
      { from: "planner", to: "kettle", label: "brew(earl grey)" },
      { from: "planner", to: "speaker", label: "respond()" },
    ],
    hiddenNodeIds: ["stt", "nlu", "planner", "kettle"],
    wordBank: [
      "Speech-to-Text",
      "Intent Classifier (NLU)",
      "Action Planner",
      "Smart Kettle",
      "Blockchain Node",
      "GPS Tracker",
    ],
  },
  techStack: ["NLU", "RAG", "IoT", "Voice AI"],
  services: ["Speech-to-Text", "Knowledge Base", "Smart Home Hub"],
  layers: ["Voice Input Layer", "Archie's Brain", "Smart Home Actions"],
};

/* Role 1: BMO Principal — Serverless & Containers */
export const funPuzzleServerless: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🐾 Serverless Challenge",
  projectName: "Pixel Paws: Pet Social Network 🐕",
  description:
    "Pixel Paws is the hottest new social network for pets — but the backend is a mess! Photos aren't uploading, the feed is broken, and notifications are stuck. Wire up the serverless architecture so cats and dogs can share selfies again.",
  color: "#FF9900",
  successMessage:
    "🎉 Pixel Paws is live! Pets everywhere are posting selfies and getting treats. You're the serverless hero of the animal kingdom! 🐾",
  diagram: {
    groups: [
      { id: "client", label: "Mobile App", x: 8, y: 8, w: 15, h: 30, color: "#2196F3" },
      { id: "api", label: "API Layer", x: 25, y: 8, w: 20, h: 30, color: "#FF9900" },
      { id: "backend", label: "Backend Services", x: 47, y: 8, w: 30, h: 30, color: "#4CAF50" },
      { id: "storage", label: "Data & Storage", x: 79, y: 8, w: 18, h: 30, color: "#9C27B0" },
    ],
    nodes: [
      { id: "app", label: "Pixel Paws App", x: 15, y: 18, w: 120, h: 30, icon: "📱" },
      { id: "cdn", label: "Photo CDN", x: 15, y: 30, w: 90, h: 28, icon: "⚡", hidden: true },
      { id: "apigw", label: "API Gateway", x: 35, y: 18, w: 100, h: 30, icon: "🚪" },
      { id: "auth", label: "Pet Auth (OAuth)", x: 35, y: 30, w: 120, h: 28, icon: "🔐", hidden: true },
      { id: "upload", label: "Photo Upload Lambda", x: 62, y: 14, w: 145, h: 28, icon: "📸", hidden: true },
      { id: "feed", label: "Feed Generator", x: 62, y: 24, w: 120, h: 28, icon: "📰" },
      { id: "notify", label: "Treat Notification SNS", x: 62, y: 34, w: 155, h: 28, icon: "🔔", hidden: true },
      { id: "s3", label: "Photo Bucket (S3)", x: 88, y: 18, w: 130, h: 28, icon: "🪣" },
      { id: "db", label: "Pet Profiles (DynamoDB)", x: 88, y: 30, w: 155, h: 28, icon: "🗄️" },
    ],
    edges: [
      { from: "app", to: "apigw", label: "HTTPS" },
      { from: "app", to: "cdn", label: "Fetch Photos" },
      { from: "apigw", to: "auth", label: "Verify Token" },
      { from: "apigw", to: "upload", label: "POST /photo" },
      { from: "apigw", to: "feed", label: "GET /feed" },
      { from: "upload", to: "s3", label: "Store" },
      { from: "upload", to: "notify", label: "New Photo Event" },
      { from: "feed", to: "db", label: "Query" },
    ],
    hiddenNodeIds: ["cdn", "auth", "upload", "notify"],
    wordBank: [
      "Photo CDN",
      "Pet Auth (OAuth)",
      "Photo Upload Lambda",
      "Treat Notification SNS",
      "Blockchain Ledger",
      "GPS Tracker",
    ],
  },
  techStack: ["Lambda", "API Gateway", "DynamoDB", "S3", "SNS"],
  services: ["CDN", "OAuth", "Event Notifications"],
  layers: ["Mobile App", "API Layer", "Backend Services", "Data & Storage"],
};

/* Role 2: BMO DevOps Engineer */
export const funPuzzleDevOps: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🚀 DevOps Challenge",
  projectName: "Mission: Deploy to Mars 🪐",
  description:
    "Houston, we have a problem! The Mars colony deployment pipeline is offline. Satellites are down, the rover can't get updates, and mission control is panicking. Rebuild the interplanetary CI/CD pipeline before the oxygen generators run out of patches!",
  color: "#24292e",
  successMessage:
    "🎉 Mission accomplished! The Mars colony is back online and the rover just deployed v2.0 of the oxygen generator firmware. You're an interplanetary DevOps hero! 🪐🚀",
  diagram: {
    groups: [
      { id: "earth", label: "Earth (Mission Control)", x: 8, y: 8, w: 25, h: 30, color: "#2196F3" },
      { id: "relay", label: "Space Relay Network", x: 35, y: 8, w: 28, h: 30, color: "#FF5722" },
      { id: "mars", label: "Mars Colony", x: 65, y: 8, w: 28, h: 30, color: "#E53E3E" },
    ],
    nodes: [
      { id: "dev", label: "Developer Workstation", x: 20, y: 14, w: 145, h: 28, icon: "💻" },
      { id: "git", label: "Git Repository", x: 20, y: 24, w: 110, h: 28, icon: "📁", hidden: true },
      { id: "ci", label: "CI Build Server", x: 20, y: 34, w: 110, h: 28, icon: "🔨" },
      { id: "sat1", label: "Deep Space Satellite", x: 49, y: 14, w: 140, h: 28, icon: "🛰️", hidden: true },
      { id: "encrypt", label: "Encryption Relay", x: 49, y: 24, w: 125, h: 28, icon: "🔐" },
      { id: "buffer", label: "Signal Buffer Station", x: 49, y: 34, w: 140, h: 28, icon: "📡", hidden: true },
      { id: "receiver", label: "Colony Receiver", x: 79, y: 14, w: 120, h: 28, icon: "📡" },
      { id: "deploy", label: "Rover Deployment Agent", x: 79, y: 24, w: 155, h: 28, icon: "🤖", hidden: true },
      { id: "rover", label: "Mars Rover (Runtime)", x: 79, y: 34, w: 140, h: 28, icon: "🔴" },
    ],
    edges: [
      { from: "dev", to: "git", label: "git push" },
      { from: "git", to: "ci", label: "Webhook" },
      { from: "ci", to: "sat1", label: "Beam Artifact" },
      { from: "sat1", to: "encrypt", label: "Encrypt" },
      { from: "encrypt", to: "buffer", label: "Relay" },
      { from: "buffer", to: "receiver", label: "Transmit" },
      { from: "receiver", to: "deploy", label: "Verify" },
      { from: "deploy", to: "rover", label: "Flash Firmware" },
    ],
    hiddenNodeIds: ["git", "sat1", "buffer", "deploy"],
    wordBank: [
      "Git Repository",
      "Deep Space Satellite",
      "Signal Buffer Station",
      "Rover Deployment Agent",
      "Wormhole Router",
      "Alien Firewall",
    ],
  },
  techStack: ["Git", "CI/CD", "Encryption", "Satellite Relay"],
  services: ["Deep Space Network", "Signal Buffer", "Deployment Agent"],
  layers: ["Earth (Mission Control)", "Space Relay Network", "Mars Colony"],
};

/* Role 3: RBC DevOps Engineer — Cybersecurity */
export const funPuzzleSecurity: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🛡️ Security Challenge",
  projectName: "Bank Heist Defense: Operation Firewall 🏦",
  description:
    "Alert! Cyber criminals are attempting to breach the Royal Vault. The security systems have been scrambled and the defense layers are offline. Rebuild the multi-layered security architecture before the hackers steal the digital gold!",
  color: "#003168",
  successMessage:
    "🎉 The vault is secure! All defense layers are operational and the hackers have been repelled. You're a certified cybersecurity hero! 🛡️🏦",
  diagram: {
    groups: [
      { id: "perimeter", label: "Perimeter Defense", x: 8, y: 8, w: 20, h: 30, color: "#E53E3E" },
      { id: "network", label: "Network Layer", x: 30, y: 8, w: 22, h: 30, color: "#FF9900" },
      { id: "app", label: "Application Layer", x: 54, y: 8, w: 22, h: 30, color: "#4CAF50" },
      { id: "vault", label: "The Royal Vault", x: 78, y: 8, w: 18, h: 30, color: "#9C27B0" },
    ],
    nodes: [
      { id: "hacker", label: "Cyber Criminals", x: 5, y: 5, w: 115, h: 28, icon: "🦹" },
      { id: "waf", label: "Web Application Firewall", x: 18, y: 18, w: 160, h: 28, icon: "🔥", hidden: true },
      { id: "ddos", label: "DDoS Shield", x: 18, y: 30, w: 100, h: 28, icon: "🛡️" },
      { id: "ids", label: "Intrusion Detection (IDS)", x: 41, y: 18, w: 160, h: 28, icon: "👁️", hidden: true },
      { id: "vpn", label: "Encrypted VPN Tunnel", x: 41, y: 30, w: 155, h: 28, icon: "🔒" },
      { id: "mfa", label: "Multi-Factor Auth (MFA)", x: 65, y: 18, w: 160, h: 28, icon: "🔐", hidden: true },
      { id: "audit", label: "Audit Logger (SIEM)", x: 65, y: 30, w: 145, h: 28, icon: "📋" },
      { id: "vault_door", label: "Vault Access Control", x: 87, y: 18, w: 140, h: 28, icon: "🚪", hidden: true },
      { id: "gold", label: "Digital Gold Reserves", x: 87, y: 30, w: 145, h: 28, icon: "🪙" },
    ],
    edges: [
      { from: "hacker", to: "waf", label: "Attack!" },
      { from: "waf", to: "ddos", label: "Filter" },
      { from: "ddos", to: "ids", label: "Inspect" },
      { from: "ids", to: "vpn", label: "Validate" },
      { from: "vpn", to: "mfa", label: "Authenticate" },
      { from: "mfa", to: "audit", label: "Log Access" },
      { from: "mfa", to: "vault_door", label: "Authorize" },
      { from: "vault_door", to: "gold", label: "Grant Access" },
    ],
    hiddenNodeIds: ["waf", "ids", "mfa", "vault_door"],
    wordBank: [
      "Web Application Firewall",
      "Intrusion Detection (IDS)",
      "Multi-Factor Auth (MFA)",
      "Vault Access Control",
      "Quantum Decryptor",
      "Alien Scanner",
    ],
  },
  techStack: ["WAF", "IDS/IPS", "MFA", "SIEM", "VPN"],
  services: ["DDoS Shield", "Audit Logging", "Access Control"],
  layers: ["Perimeter Defense", "Network Layer", "Application Layer", "The Royal Vault"],
};

/* ═══════════════════════════════════════════════════════════
   CAREER ARCHITECTURE DIAGRAMS
   ═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   DIAGRAM 1: Enterprise AI & GraphRAG Platform (Azure)
   ─────────────────────────────────────────────────────────── */

export const aiRagDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Principal Cloud Engineer — AI",
  projectName: "Enterprise AI & GraphRAG Platform (Azure)",
  description:
    "The Challenge: We needed to bring Generative AI to the enterprise, but strict data residency and security boundaries meant using public SaaS solutions was out of the question. The Architecture: I designed a fully private, multi-modal Retrieval-Augmented Generation (RAG) platform on Azure. To handle complex context, I implemented a dual-RAG pattern combining Azure AI Search for vector retrieval and Cosmos DB for intricate GraphRAG relationships. The Complexity: The real engineering feat was the security posture. I eliminated all public internet exposure. Every component, from the OpenAI model pool to the databases, communicates strictly over Azure Private Endpoints. To eradicate shared credentials, I implemented User Managed Identities across the board, and ensured all data at rest was encrypted using Customer Managed Keys (CMK) locked in Azure Key Vault.",
  color: "#0078D4",
  successMessage:
    "You just reconstructed a production-grade Azure RAG platform with strict financial sector compliance — zero public internet exposure, CMK encryption, and Private Endpoints throughout. 🏆",
  techStack: ["Azure OpenAI", "FastAPI", "LangChain", "Python", "Cosmos DB", "Azure AI Search"],
  services: ["Azure APIM", "Key Vault", "Blob Storage", "Private Endpoints", "Entra ID", "Content Safety"],
  layers: ["Frontend Subnet", "API Management", "Data & Orchestration", "AI Model Pool"],
  diagram: {
    groups: [
      { id: "vpc", label: "Azure Virtual Network", x: 15, y: 5, w: 83, h: 90, color: "#0078D4" },
      { id: "ui", label: "Frontend Subnet", x: 17, y: 10, w: 18, h: 18, color: "#2196F3" },
      { id: "api", label: "API Management", x: 37, y: 10, w: 18, h: 20, color: "#9C27B0" },
      { id: "data", label: "Data & Orchestration", x: 57, y: 10, w: 20, h: 45, color: "#00BCD4" },
      { id: "ai", label: "AI Model Pool", x: 79, y: 10, w: 17, h: 45, color: "#FF5722" },
    ],
    nodes: [
      { id: "entraid", label: "Enterprise SSO (Entra ID)", x: 8, y: 22, w: 150, h: 36, icon: "🔐" },
      { id: "frontend", label: "React/NextJS", x: 26, y: 20, w: 120, h: 34, icon: "💻" },
      { id: "apim", label: "Azure APIM", x: 46, y: 18, w: 100, h: 34, icon: "🚪" },
      { id: "backend", label: "FastAPI Backend", x: 46, y: 28, w: 120, h: 34, icon: "🐍", hidden: true },
      { id: "ingestion", label: "Enterprise File Transfer", x: 67, y: 14, w: 145, h: 30, icon: "📂" },
      { id: "orchestrator", label: "Data Orchestrator", x: 67, y: 22, w: 130, h: 30, icon: "⚙️", hidden: true },
      { id: "blob", label: "Blob Storage (Uploads)", x: 67, y: 30, w: 145, h: 30, icon: "📦" },
      { id: "kv", label: "Azure Key Vault (CMK)", x: 67, y: 38, w: 140, h: 30, icon: "🔑" },
      { id: "vectordb", label: "Azure AI Search", x: 67, y: 46, w: 120, h: 30, icon: "🔍", hidden: true },
      { id: "graphdb", label: "Cosmos DB", x: 67, y: 54, w: 100, h: 30, icon: "🕸️", hidden: true },
      { id: "safety", label: "Content Safety", x: 88, y: 18, w: 115, h: 30, icon: "🛡️", hidden: true },
      { id: "o1", label: "OpenAI o1", x: 88, y: 28, w: 90, h: 30, icon: "🧠" },
      { id: "gpt4o", label: "OpenAI 4o", x: 88, y: 38, w: 90, h: 30, icon: "🤖" },
      { id: "embed", label: "Embedding Large", x: 88, y: 48, w: 125, h: 30, icon: "📊" },
    ],
    edges: [
      { from: "frontend", to: "entraid", label: "Authenticate" },
      { from: "frontend", to: "apim", label: "Private Endpoint" },
      { from: "apim", to: "backend", label: "Managed Identity" },
      { from: "backend", to: "kv", label: "Fetch CMK/Secrets" },
      { from: "ingestion", to: "blob", label: "Upload" },
      { from: "blob", to: "orchestrator", label: "Ingest SAM Data" },
      { from: "orchestrator", to: "vectordb", label: "Index Vectors" },
      { from: "orchestrator", to: "graphdb", label: "Index Graph Entities" },
      { from: "backend", to: "vectordb", label: "Vanilla RAG" },
      { from: "backend", to: "graphdb", label: "Graph RAG" },
      { from: "backend", to: "safety", label: "Validate Prompt" },
      { from: "safety", to: "gpt4o", label: "Generate Response" },
      { from: "safety", to: "o1", label: "Generate Response" },
    ],
    hiddenNodeIds: ["backend", "orchestrator", "vectordb", "graphdb", "safety"],
    wordBank: [
      "FastAPI Backend",
      "Data Orchestrator",
      "Azure AI Search",
      "Cosmos DB",
      "Content Safety",
      "Azure Firewall",
      "Event Grid",
      "Logic Apps",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 2: Ephemeral CI/CD GitHub Runners (AWS)
   ─────────────────────────────────────────────────────────── */

export const cicdRunnersDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Principal Engineer — Serverless & Containers",
  projectName: "Ephemeral CI/CD GitHub Runners (AWS)",
  description:
    "The Challenge: Running our CI/CD pipelines on shared or public GitHub runners posed a massive security risk for our proprietary code and deployment credentials. The Architecture: I engineered a self-hosted, event-driven runner architecture within a strictly governed, dedicated AWS Operations account. When a deployment is triggered, an AWS Lambda function dynamically spins up ephemeral ECS Fargate containers to execute the workflow, tearing them down immediately after the job finishes. The Complexity: I designed this with a zero-trust mindset. The Fargate runners sit in fully isolated private subnets, assuming strict OIDC IAM roles. They pull CMK-encrypted credentials from AWS Secrets Manager via VPC Endpoints, and route all outbound GitHub API status updates through a tightly controlled corporate proxy to ensure zero direct internet access.",
  color: "#24292e",
  successMessage:
    "You've mapped an enterprise-grade ephemeral runner architecture — zero persistent infrastructure, maximum security, fully automated scaling. This pattern processes thousands of CI/CD jobs daily. 🚀",
  techStack: ["GitHub Actions", "ECS Fargate", "Lambda", "Terraform", "Docker", "CDK"],
  services: ["Secrets Manager (CMK)", "ECR", "S3", "VPC Endpoints", "OIDC", "Corporate Proxy"],
  layers: ["Enterprise Operations Account", "Runner VPC", "Private Subnet", "VPC Endpoints", "Target Workload Account"],
  diagram: {
    groups: [
      { id: "ops", label: "Enterprise Operations Account", x: 10, y: 18, w: 60, h: 60, color: "#FF9900" },
      { id: "vpc", label: "Runner VPC", x: 12, y: 26, w: 56, h: 50, color: "#0078D4" },
      { id: "private", label: "Private Subnet", x: 14, y: 32, w: 26, h: 30, color: "#4CAF50" },
      { id: "endpoints", label: "VPC Endpoints", x: 42, y: 32, w: 24, h: 42, color: "#9C27B0" },
      { id: "target", label: "Target Workload Account", x: 74, y: 45, w: 22, h: 28, color: "#00BCD4" },
    ],
    nodes: [
      { id: "github", label: "GitHub Enterprise", x: 8, y: 10, w: 130, h: 34, icon: "🐙" },
      { id: "lambda", label: "Autoscaling Lambda", x: 22, y: 22, w: 135, h: 32, icon: "⚡" },
      { id: "ecs", label: "Fargate Runner Cluster", x: 27, y: 40, w: 155, h: 34, icon: "📦", hidden: true },
      { id: "proxy", label: "Corporate Proxy", x: 27, y: 54, w: 120, h: 32, icon: "🛡️" },
      { id: "secrets", label: "Secrets Manager (CMK)", x: 54, y: 36, w: 155, h: 30, icon: "🔐", hidden: true },
      { id: "ecr", label: "Elastic Container Registry", x: 54, y: 46, w: 165, h: 30, icon: "🐳" },
      { id: "s3", label: "Build Artifacts (S3)", x: 54, y: 56, w: 135, h: 30, icon: "📦" },
      { id: "iam", label: "OIDC Assumed Role", x: 85, y: 52, w: 135, h: 30, icon: "🔑", hidden: true },
      { id: "infra", label: "RDS / Lambda / ECS", x: 85, y: 62, w: 130, h: 30, icon: "🏗️" },
    ],
    edges: [
      { from: "github", to: "lambda", label: "Webhook (Workflow Start)" },
      { from: "lambda", to: "ecs", label: "Provision Task" },
      { from: "ecs", to: "secrets", label: "Fetch Credentials" },
      { from: "ecs", to: "ecr", label: "Pull Images" },
      { from: "ecs", to: "iam", label: "Assume Role" },
      { from: "iam", to: "infra", label: "CDK Deploy" },
      { from: "ecs", to: "proxy", label: "Outbound Status" },
      { from: "proxy", to: "github", label: "Send Outcome" },
    ],
    hiddenNodeIds: ["ecs", "secrets", "iam"],
    wordBank: [
      "Fargate Runner Cluster",
      "Secrets Manager (CMK)",
      "OIDC Assumed Role",
      "CloudWatch Logs",
      "Route 53",
      "API Gateway",
      "Step Functions",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 3: Private API Gateway & Auth Pattern
   ─────────────────────────────────────────────────────────── */

export const apiGatewayDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Team Lead",
  projectName: "Private API Gateway & Zero-Trust Auth Pattern",
  description:
    "The Challenge: We needed a standardized, bulletproof way for corporate on-premise applications to securely consume modern AWS cloud workloads without ever crossing the public internet. The Architecture: I led the design of a zero-trust edge integration pattern. I routed our on-premise Direct Connect traffic through an AWS Network Load Balancer (for TLS termination), forwarding the traffic to a strictly Private API Gateway via an API Interface Endpoint. The Complexity: To secure the backend, I built a custom Lambda Authorizer that authenticates incoming requests against a corporate Cognito User Pool via a secure internal proxy. Only fully validated, authorized traffic is allowed to pass through a VPC Link and Elastic Network Interfaces (ENI) to execute on the backend Fargate containers.",
  color: "#FF9900",
  successMessage:
    "You've mapped the exact zero-trust API Gateway pattern used to secure enterprise traffic across on-prem and cloud — handling thousands of requests per second at scale. 🔒",
  techStack: ["API Gateway", "Lambda", "ECS Fargate", "CDK", "Cognito", "NLB"],
  services: ["NLB (TLS Termination)", "VPC Endpoints", "VPC Link", "ENI", "Direct Connect"],
  layers: ["Network Resource VPC", "API Gateway VPC", "Managed Lambda VPC", "Shared Workload VPC"],
  diagram: {
    groups: [
      { id: "net", label: "Network Resource VPC", x: 10, y: 10, w: 20, h: 30, color: "#0078D4" },
      { id: "gateway", label: "API Gateway VPC", x: 32, y: 10, w: 20, h: 30, color: "#9C27B0" },
      { id: "auth", label: "Managed Lambda VPC", x: 54, y: 10, w: 20, h: 30, color: "#4CAF50" },
      { id: "workload", label: "Shared Workload VPC", x: 76, y: 10, w: 22, h: 42, color: "#00BCD4" },
    ],
    nodes: [
      { id: "onprem", label: "Corporate On-Premise Client", x: 5, y: 5, w: 165, h: 32, icon: "🏢" },
      { id: "dx", label: "Direct Connect", x: 5, y: 15, w: 110, h: 30, icon: "🔗" },
      { id: "nlb", label: "AWS NLB (TLS Termination)", x: 20, y: 22, w: 165, h: 32, icon: "⚖️", hidden: true },
      { id: "vpce", label: "API Interface Endpoint", x: 20, y: 32, w: 150, h: 32, icon: "🔌" },
      { id: "apigw", label: "Private API Gateway", x: 42, y: 22, w: 145, h: 32, icon: "🚪", hidden: true },
      { id: "policy", label: "Resource Policy & API Key", x: 42, y: 32, w: 160, h: 32, icon: "📜" },
      { id: "authorizer", label: "Custom Lambda Authorizer", x: 64, y: 22, w: 165, h: 32, icon: "⚡", hidden: true },
      { id: "cognito", label: "Corporate Cognito User Pool", x: 64, y: 32, w: 165, h: 32, icon: "🪪" },
      { id: "vpclink", label: "VPC Link Integration", x: 87, y: 18, w: 140, h: 30, icon: "🔗" },
      { id: "eni", label: "Elastic Network Interface", x: 87, y: 28, w: 155, h: 30, icon: "🔌", hidden: true },
      { id: "fargate", label: "Backend API Container", x: 87, y: 38, w: 145, h: 30, icon: "📦", hidden: true },
      { id: "db", label: "Backend Database", x: 87, y: 48, w: 120, h: 30, icon: "🗄️" },
    ],
    edges: [
      { from: "onprem", to: "dx", label: "HTTPS" },
      { from: "dx", to: "nlb", label: "Forward" },
      { from: "nlb", to: "vpce", label: "Forward" },
      { from: "vpce", to: "apigw", label: "Request" },
      { from: "apigw", to: "policy", label: "Evaluate" },
      { from: "apigw", to: "authorizer", label: "Validate Token" },
      { from: "authorizer", to: "cognito", label: "Verify via Secure Proxy" },
      { from: "apigw", to: "vpclink", label: "Authorized Traffic" },
      { from: "vpclink", to: "eni", label: "Route" },
      { from: "eni", to: "fargate", label: "Execute" },
      { from: "fargate", to: "db", label: "Query" },
    ],
    hiddenNodeIds: ["nlb", "apigw", "authorizer", "eni", "fargate"],
    wordBank: [
      "AWS NLB (TLS Termination)",
      "Private API Gateway",
      "Custom Lambda Authorizer",
      "Elastic Network Interface",
      "Backend API Container",
      "CloudFront",
      "WAF Rules",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 4: Automated AWS MLOps Pipeline
   ─────────────────────────────────────────────────────────── */

export const mlOpsPipelineDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Principal Engineer — Serverless & Containers",
  projectName: "Automated AWS MLOps Pipeline",
  description:
    "The Challenge: Data scientists were bogged down by manual infrastructure provisioning, and our machine learning deployments lacked traceability and automated governance. The Architecture: I architected a fully serverless, end-to-end MLOps pipeline. By integrating KubeFlow with AWS Step Functions, I created an event-driven workflow that automatically orchestrates containerized data pre-processing and hyperparameter optimization via Amazon SageMaker. The Complexity: The system is completely self-regulating. Model lineage is meticulously tracked via SageMaker Feature Store. Once approved, the model deploys to an Elastic Auto-scaling endpoint with Data Capture enabled. This telemetry continuously feeds into SageMaker Model Monitor and Clarify, which automatically trigger CI/CD retraining pipelines if data drift or bias is detected.",
  color: "#FF9900",
  successMessage:
    "You've assembled a production MLOps pipeline that automatically trains, evaluates, registers, deploys, and monitors ML models — with full lineage tracking and bias detection. 🤖",
  techStack: ["SageMaker Pipelines", "Step Functions", "KubeFlow", "Docker", "CodeBuild"],
  services: ["Feature Store", "Model Registry", "Model Monitor", "Clarify", "CodeCommit", "CloudFormation"],
  layers: ["CI Pipeline (Build)", "Step Functions Workflow", "Data & Quality", "CD Pipeline (Deploy)", "Inference"],
  diagram: {
    groups: [
      { id: "ci", label: "CodePipeline (Build)", x: 8, y: 8, w: 22, h: 27, color: "#4CAF50" },
      { id: "step", label: "AWS Step Functions Workflow", x: 32, y: 8, w: 36, h: 27, color: "#FF5722" },
      { id: "gov", label: "Data & Quality", x: 70, y: 8, w: 18, h: 27, color: "#9C27B0" },
      { id: "cd", label: "CodePipeline (Deploy)", x: 90, y: 8, w: 8, h: 27, color: "#00BCD4" },
      { id: "serve", label: "Inference", x: 32, y: 37, w: 36, h: 22, color: "#2196F3" },
    ],
    nodes: [
      { id: "k8s", label: "KubeFlow Operator", x: 8, y: 3, w: 125, h: 30, icon: "☸️" },
      { id: "codecommit", label: "CodeCommit", x: 19, y: 13, w: 100, h: 28, icon: "📁", hidden: true },
      { id: "codebuild", label: "CodeBuild", x: 19, y: 22, w: 95, h: 28, icon: "🔨" },
      { id: "container", label: "Custom Container", x: 19, y: 30, w: 125, h: 28, icon: "🐳" },
      { id: "prep", label: "Pre-processing & Feature Eng", x: 50, y: 13, w: 165, h: 28, icon: "⚙️", hidden: true },
      { id: "train", label: "Model Training / HPO", x: 50, y: 21, w: 140, h: 28, icon: "🧠", hidden: true },
      { id: "eval", label: "Model Evaluation / Tests", x: 50, y: 29, w: 150, h: 28, icon: "📊" },
      { id: "featurestore", label: "SageMaker Feature Store", x: 79, y: 13, w: 160, h: 28, icon: "🗂️" },
      { id: "clarify", label: "SageMaker Clarify", x: 79, y: 21, w: 125, h: 28, icon: "🔍", hidden: true },
      { id: "registry", label: "Model Registry", x: 79, y: 29, w: 110, h: 28, icon: "📦", hidden: true },
      { id: "cfn", label: "CloudFormation Template", x: 94, y: 21, w: 160, h: 30, icon: "📜", hidden: true },
      { id: "endpoint", label: "Elastic Auto-scaling Endpoint", x: 50, y: 44, w: 170, h: 30, icon: "🚀", hidden: true },
      { id: "monitor", label: "Model Monitor", x: 50, y: 52, w: 110, h: 30, icon: "📈" },
    ],
    edges: [
      { from: "k8s", to: "prep", label: "Trigger" },
      { from: "container", to: "prep", label: "Inject Image" },
      { from: "prep", to: "train" },
      { from: "train", to: "eval" },
      { from: "eval", to: "registry", label: "Register" },
      { from: "registry", to: "cfn", label: "Approve & Deploy" },
      { from: "cfn", to: "endpoint", label: "Provision" },
      { from: "endpoint", to: "monitor", label: "Data Capture" },
      { from: "endpoint", to: "clarify", label: "Bias/Drift Check" },
      { from: "monitor", to: "codecommit", label: "Trigger Retraining Alarm" },
    ],
    hiddenNodeIds: ["codecommit", "prep", "train", "clarify", "registry", "cfn", "endpoint"],
    wordBank: [
      "CodeCommit",
      "Pre-processing & Feature Eng",
      "Model Training / HPO",
      "SageMaker Clarify",
      "Model Registry",
      "CloudFormation Template",
      "Elastic Auto-scaling Endpoint",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 5: Highly Available Container Architecture
   ─────────────────────────────────────────────────────────── */

export const haContainerDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Team Lead",
  projectName: "Highly Available Container Architecture",
  description:
    "The Challenge: Our core backend APIs required a resilient, enterprise-grade hosting platform that could survive an Availability Zone failure without compromising on strict security mandates. The Architecture: I directed my team in building a highly available container foundation using AWS ECS Fargate. To protect the perimeter, I placed an Application Load Balancer behind AWS WAF, routing all traffic exclusively into private subnets distributed across multiple Availability Zones. The Complexity: We decoupled everything for maximum security. Each container runs with distinct, least-privilege IAM Task Execution roles. All configurations and container images are pulled privately via VPC Endpoints, and ephemeral data is encrypted with AWS KMS. For stateful resilience, I implemented a PostgreSQL Master-Replica database architecture spanning across the AZs to guarantee immediate failover.",
  color: "#FF9900",
  successMessage:
    "You've mapped a production-grade, highly available container architecture with multi-AZ failover, WAF protection, and encrypted data at rest. 🏗️",
  techStack: ["ECS Fargate", "PostgreSQL", "Docker", "Terraform", "CDK"],
  services: ["ALB", "WAF", "Route 53", "KMS", "VPC Endpoints", "ECR", "Secrets Manager"],
  layers: ["Edge", "Production VPC", "Availability Zone A", "Availability Zone B"],
  diagram: {
    groups: [
      { id: "edge", label: "Edge", x: 4, y: 8, w: 14, h: 27, color: "#FF5722" },
      { id: "vpc", label: "Production VPC", x: 20, y: 8, w: 78, h: 62, color: "#0078D4" },
      { id: "aza", label: "Availability Zone A", x: 22, y: 14, w: 36, h: 30, color: "#4CAF50" },
      { id: "azb", label: "Availability Zone B", x: 60, y: 14, w: 36, h: 30, color: "#9C27B0" },
    ],
    nodes: [
      { id: "dns", label: "Route 53", x: 11, y: 14, w: 80, h: 28, icon: "🌐", hidden: true },
      { id: "waf", label: "AWS WAF", x: 11, y: 22, w: 75, h: 28, icon: "🛡️" },
      { id: "alb", label: "Application Load Balancer", x: 11, y: 30, w: 155, h: 28, icon: "⚖️", hidden: true },
      { id: "vpce", label: "VPC Endpoints (ECR, Secrets)", x: 40, y: 10, w: 170, h: 26, icon: "🔌" },
      { id: "kms", label: "AWS KMS (CMK)", x: 78, y: 10, w: 110, h: 26, icon: "🔑", hidden: true },
      { id: "fargate_a", label: "Fargate Task (IAM Role)", x: 40, y: 24, w: 150, h: 30, icon: "📦", hidden: true },
      { id: "db_master", label: "PostgreSQL Master (KMS Encrypted)", x: 40, y: 36, w: 195, h: 30, icon: "🗄️", hidden: true },
      { id: "fargate_b", label: "Fargate Task (IAM Role)", x: 78, y: 24, w: 150, h: 30, icon: "📦" },
      { id: "db_replica", label: "PostgreSQL Replica (KMS Encrypted)", x: 78, y: 36, w: 200, h: 30, icon: "🗄️" },
    ],
    edges: [
      { from: "dns", to: "waf" },
      { from: "waf", to: "alb" },
      { from: "alb", to: "fargate_a", label: "Balance" },
      { from: "alb", to: "fargate_b", label: "Balance" },
      { from: "db_master", to: "db_replica", label: "Async Replication" },
      { from: "vpce", to: "fargate_a", label: "Pull Image/Secrets" },
      { from: "kms", to: "fargate_a", label: "Decrypt Env Vars" },
      { from: "fargate_a", to: "db_master", label: "R/W" },
      { from: "fargate_b", to: "db_replica", label: "Read" },
    ],
    hiddenNodeIds: ["dns", "alb", "kms", "fargate_a", "db_master"],
    wordBank: [
      "Route 53",
      "Application Load Balancer",
      "AWS KMS (CMK)",
      "Fargate Task (IAM Role)",
      "PostgreSQL Master (KMS Encrypted)",
      "CloudFront",
      "ElastiCache",
    ],
  },
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 6: Enterprise Multi-Account AI/MLOps Platform
   ─────────────────────────────────────────────────────────── */

export const multiAccountMlOpsDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Principal Cloud Engineer — AI",
  projectName: "Enterprise Multi-Account AI/MLOps Platform",
  description:
    "The Challenge: Scaling our AI capabilities meant deploying models across multiple environments, but mixing development and production workloads in a single AWS account violated our compliance standards. The Architecture: I designed an enterprise-scale, multi-account MLOps control plane. I isolated the machine learning lifecycle by establishing four dedicated AWS accounts—Development, Automation, Staging, and Production—all governed centrally by Azure DevOps pipelines. The Complexity: This required deep cross-account identity and encryption management. I established strict IAM trust relationships and cross-account KMS (CMK) key sharing. Model training happens securely in the Automation account. Once an artifact hits the Model Registry and is approved, Amazon EventBridge seamlessly triggers the deployment pipeline to provision serverless inference endpoints in the locked-down Production environment.",
  color: "#0078D4",
  successMessage:
    "You've architected an enterprise multi-account MLOps platform with strict boundary isolation, cross-account IAM trusts, and automated deployment pipelines across Dev, Automation, and Production environments. 🏢",
  techStack: ["SageMaker Pipelines", "EventBridge", "Azure DevOps", "CloudFormation", "KMS"],
  services: ["SageMaker Studio", "Amazon EMR", "Model Registry", "API Gateway", "IAM AssumeRoles", "CloudTrail"],
  layers: ["AWS Dev Account", "AWS Automation Account", "AWS Production Account", "Enterprise Governance"],
  diagram: {
    groups: [
      { id: "dev", label: "AWS Dev Account", x: 8, y: 18, w: 20, h: 27, color: "#4CAF50" },
      { id: "auto", label: "AWS Automation Account", x: 30, y: 8, w: 38, h: 48, color: "#FF9900" },
      { id: "prod", label: "AWS Production Account", x: 70, y: 18, w: 22, h: 27, color: "#00BCD4" },
      { id: "security", label: "Enterprise Governance", x: 94, y: 18, w: 5, h: 27, color: "#9C27B0" },
    ],
    nodes: [
      { id: "azdevops", label: "Azure DevOps (CI/CD)", x: 8, y: 5, w: 140, h: 30, icon: "🔵" },
      { id: "studio", label: "SageMaker Studio (Notebooks)", x: 18, y: 27, w: 165, h: 30, icon: "💻", hidden: true },
      { id: "emr", label: "Amazon EMR", x: 18, y: 38, w: 100, h: 30, icon: "📊" },
      { id: "prep", label: "Prep", x: 38, y: 15, w: 60, h: 26, icon: "⚙️" },
      { id: "train", label: "Train", x: 46, y: 15, w: 60, h: 26, icon: "🧠", hidden: true },
      { id: "eval", label: "Eval", x: 54, y: 15, w: 55, h: 26, icon: "📊", hidden: true },
      { id: "register", label: "Register", x: 62, y: 15, w: 75, h: 26, icon: "📦", hidden: true },
      { id: "registry", label: "Model Registry", x: 49, y: 28, w: 110, h: 30, icon: "📁" },
      { id: "event", label: "Amazon EventBridge", x: 49, y: 38, w: 145, h: 30, icon: "📡", hidden: true },
      { id: "kms", label: "Cross-Account KMS (CMK)", x: 49, y: 48, w: 165, h: 30, icon: "🔑" },
      { id: "api", label: "Amazon API Gateway", x: 81, y: 27, w: 145, h: 30, icon: "🚪", hidden: true },
      { id: "inference", label: "Real-Time / Serverless Endpoint", x: 81, y: 38, w: 190, h: 30, icon: "🚀" },
      { id: "iam", label: "Strict AssumeRoles", x: 96, y: 27, w: 125, h: 26, icon: "🔐", hidden: true },
      { id: "cloudtrail", label: "Auditing", x: 96, y: 38, w: 80, h: 26, icon: "📜" },
    ],
    edges: [
      { from: "studio", to: "azdevops", label: "Commit Code" },
      { from: "azdevops", to: "prep", label: "Trigger Build/Train" },
      { from: "prep", to: "train" },
      { from: "train", to: "eval" },
      { from: "eval", to: "register" },
      { from: "register", to: "registry", label: "Output Artifact (KMS)" },
      { from: "registry", to: "event", label: "State Change (Approved)" },
      { from: "event", to: "azdevops", label: "Webhook Trigger" },
      { from: "azdevops", to: "api", label: "Deploy CloudFormation" },
      { from: "api", to: "inference", label: "Route Traffic" },
      { from: "iam", to: "prep", label: "Govern Access" },
    ],
    hiddenNodeIds: ["studio", "train", "eval", "register", "event", "api", "iam"],
    wordBank: [
      "SageMaker Studio (Notebooks)",
      "Train",
      "Eval",
      "Register",
      "Amazon EventBridge",
      "Amazon API Gateway",
      "Strict AssumeRoles",
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   ADDITIONAL FUN PUZZLES — 5 puzzles per role
   ═══════════════════════════════════════════════════════════ */

/* ─── AI Role Puzzles (2-5) ─────────────────────────────── */

export const funPuzzleAI2: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "☁️ AI Architecture Challenge",
  projectName: "The Chatbot Factory 🏭",
  description:
    "The Chatbot Factory is in chaos! Customer service bots are giving wrong answers because the knowledge retrieval is broken. Fix the RAG pipeline before angry customers flood the support lines!",
  color: "#0078D4",
  successMessage: "🎉 The bots are back online and customers are happy again! You're a RAG master! 🤖",
  diagram: {
    groups: [
      { id: "input", label: "Customer Query", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "rag", label: "RAG Pipeline", x: 28, y: 8, w: 40, h: 30, color: "#9C27B0" },
      { id: "output", label: "Response", x: 70, y: 8, w: 22, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "user", label: "Customer Message", x: 17, y: 18, w: 130, h: 30, icon: "💬" },
      { id: "embed", label: "Query Embedder", x: 17, y: 30, w: 115, h: 30, icon: "🔢", hidden: true },
      { id: "search", label: "Vector Search", x: 48, y: 14, w: 110, h: 30, icon: "🔍", hidden: true },
      { id: "docs", label: "Knowledge Docs", x: 48, y: 24, w: 120, h: 30, icon: "📄" },
      { id: "rerank", label: "Reranker Model", x: 48, y: 34, w: 115, h: 30, icon: "📊", hidden: true },
      { id: "llm", label: "LLM Generator", x: 81, y: 18, w: 110, h: 30, icon: "🧠" },
      { id: "response", label: "Bot Response", x: 81, y: 30, w: 105, h: 30, icon: "💬", hidden: true },
    ],
    edges: [
      { from: "user", to: "embed", label: "Encode" },
      { from: "embed", to: "search", label: "Query" },
      { from: "search", to: "docs", label: "Retrieve" },
      { from: "docs", to: "rerank", label: "Score" },
      { from: "rerank", to: "llm", label: "Context" },
      { from: "llm", to: "response", label: "Generate" },
    ],
    hiddenNodeIds: ["embed", "search", "rerank", "response"],
    wordBank: ["Query Embedder", "Vector Search", "Reranker Model", "Bot Response", "Blockchain", "GPS"],
  },
  techStack: ["Embeddings", "Vector DB", "Reranking", "LLM"],
  services: ["Query Encoder", "Retrieval", "Generation"],
  layers: ["Customer Query", "RAG Pipeline", "Response"],
};

export const funPuzzleAI3: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "☁️ AI Architecture Challenge",
  projectName: "Dream Analyzer 3000 💭",
  description:
    "People are uploading their dream descriptions but the AI can't analyze them! The multi-modal pipeline is disconnected. Wire it up so the Dream Analyzer can interpret text AND images!",
  color: "#0078D4",
  successMessage: "🎉 Dream Analyzer is interpreting dreams beautifully! Sweet dreams are made of good architecture! 💭",
  diagram: {
    groups: [
      { id: "input", label: "Dream Input", x: 8, y: 8, w: 20, h: 30, color: "#2196F3" },
      { id: "process", label: "Multi-Modal AI", x: 30, y: 8, w: 38, h: 30, color: "#9C27B0" },
      { id: "output", label: "Interpretation", x: 70, y: 8, w: 22, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "text", label: "Dream Text", x: 18, y: 16, w: 95, h: 28, icon: "📝" },
      { id: "image", label: "Dream Sketch", x: 18, y: 28, w: 105, h: 28, icon: "🎨", hidden: true },
      { id: "textenc", label: "Text Encoder", x: 49, y: 14, w: 105, h: 28, icon: "📖", hidden: true },
      { id: "imgenc", label: "Image Encoder", x: 49, y: 24, w: 115, h: 28, icon: "🖼️" },
      { id: "fusion", label: "Cross-Modal Fusion", x: 49, y: 34, w: 140, h: 28, icon: "🔗", hidden: true },
      { id: "analysis", label: "Dream Analyzer LLM", x: 81, y: 20, w: 140, h: 28, icon: "🔮" },
      { id: "output", label: "Dream Report", x: 81, y: 32, w: 105, h: 28, icon: "📋", hidden: true },
    ],
    edges: [
      { from: "text", to: "textenc" },
      { from: "image", to: "imgenc" },
      { from: "textenc", to: "fusion" },
      { from: "imgenc", to: "fusion" },
      { from: "fusion", to: "analysis" },
      { from: "analysis", to: "output" },
    ],
    hiddenNodeIds: ["image", "textenc", "fusion", "output"],
    wordBank: ["Dream Sketch", "Text Encoder", "Cross-Modal Fusion", "Dream Report", "Quantum Bit", "Satellite"],
  },
  techStack: ["Multi-Modal", "Vision AI", "NLP", "Fusion Models"],
  services: ["Encoders", "Fusion Layer", "Analysis"],
  layers: ["Dream Input", "Multi-Modal AI", "Interpretation"],
};

export const funPuzzleAI4: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "☁️ AI Architecture Challenge",
  projectName: "Code Wizard Assistant 🧙‍♂️",
  description:
    "Developers need an AI coding assistant but it keeps generating buggy code! Fix the code generation pipeline with proper context retrieval and validation!",
  color: "#0078D4",
  successMessage: "🎉 Code Wizard is writing clean code! Developers are shipping faster than ever! 🧙‍♂️✨",
  diagram: {
    groups: [
      { id: "ide", label: "Developer IDE", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "ai", label: "AI Engine", x: 28, y: 8, w: 42, h: 30, color: "#9C27B0" },
      { id: "validate", label: "Validation", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "prompt", label: "Code Prompt", x: 17, y: 18, w: 105, h: 28, icon: "⌨️" },
      { id: "context", label: "Context Fetcher", x: 17, y: 30, w: 120, h: 28, icon: "📂", hidden: true },
      { id: "repo", label: "Code Repository", x: 49, y: 14, w: 120, h: 28, icon: "📁" },
      { id: "codegen", label: "Code Generator LLM", x: 49, y: 24, w: 140, h: 28, icon: "🧠", hidden: true },
      { id: "review", label: "Auto-Reviewer AI", x: 49, y: 34, w: 130, h: 28, icon: "👀", hidden: true },
      { id: "lint", label: "Linter & Tests", x: 82, y: 20, w: 105, h: 28, icon: "✅" },
      { id: "output", label: "Clean Code", x: 82, y: 32, w: 95, h: 28, icon: "💎", hidden: true },
    ],
    edges: [
      { from: "prompt", to: "context" },
      { from: "context", to: "repo" },
      { from: "repo", to: "codegen" },
      { from: "codegen", to: "review" },
      { from: "review", to: "lint" },
      { from: "lint", to: "output" },
    ],
    hiddenNodeIds: ["context", "codegen", "review", "output"],
    wordBank: ["Context Fetcher", "Code Generator LLM", "Auto-Reviewer AI", "Clean Code", "Time Machine", "Teleporter"],
  },
  techStack: ["Code LLM", "RAG", "Static Analysis"],
  services: ["Context Retrieval", "Generation", "Validation"],
  layers: ["Developer IDE", "AI Engine", "Validation"],
};

export const funPuzzleAI5: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "☁️ AI Architecture Challenge",
  projectName: "Emotion DJ 🎧",
  description:
    "The AI DJ reads the crowd's mood but the emotion detection pipeline is broken! Wire it up so the DJ can play songs that match the vibe!",
  color: "#0078D4",
  successMessage: "🎉 Emotion DJ is reading the room perfectly! The party is absolutely vibing! 🎉🎧",
  diagram: {
    groups: [
      { id: "capture", label: "Crowd Capture", x: 8, y: 8, w: 20, h: 30, color: "#2196F3" },
      { id: "ai", label: "Emotion AI", x: 30, y: 8, w: 38, h: 30, color: "#9C27B0" },
      { id: "music", label: "Music Control", x: 70, y: 8, w: 22, h: 30, color: "#FF9900" },
    ],
    nodes: [
      { id: "camera", label: "Crowd Camera", x: 18, y: 18, w: 115, h: 28, icon: "📹" },
      { id: "audio", label: "Ambient Audio", x: 18, y: 30, w: 110, h: 28, icon: "🎤", hidden: true },
      { id: "face", label: "Face Emotion AI", x: 49, y: 14, w: 125, h: 28, icon: "😊", hidden: true },
      { id: "energy", label: "Energy Analyzer", x: 49, y: 24, w: 125, h: 28, icon: "⚡" },
      { id: "mood", label: "Mood Classifier", x: 49, y: 34, w: 120, h: 28, icon: "🎭", hidden: true },
      { id: "recommend", label: "Song Recommender", x: 81, y: 20, w: 135, h: 28, icon: "🎵" },
      { id: "dj", label: "Auto DJ Mixer", x: 81, y: 32, w: 110, h: 28, icon: "🎧", hidden: true },
    ],
    edges: [
      { from: "camera", to: "face" },
      { from: "audio", to: "energy" },
      { from: "face", to: "mood" },
      { from: "energy", to: "mood" },
      { from: "mood", to: "recommend" },
      { from: "recommend", to: "dj" },
    ],
    hiddenNodeIds: ["audio", "face", "mood", "dj"],
    wordBank: ["Ambient Audio", "Face Emotion AI", "Mood Classifier", "Auto DJ Mixer", "Weather Sensor", "Radar"],
  },
  techStack: ["Computer Vision", "Audio Analysis", "Emotion AI"],
  services: ["Face Detection", "Mood Analysis", "Recommendations"],
  layers: ["Crowd Capture", "Emotion AI", "Music Control"],
};

/* ─── Serverless Role Puzzles (2-5) ─────────────────────── */

export const funPuzzleServerless2: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🐾 Serverless Challenge",
  projectName: "FoodTruck Finder 🚚🌮",
  description:
    "Hungry people can't find food trucks! The real-time location service is down. Wire up the serverless location tracking so tacos can find their way to hungry mouths!",
  color: "#FF9900",
  successMessage: "🎉 Food trucks are being found! Hungry people are eating delicious tacos! 🌮",
  diagram: {
    groups: [
      { id: "trucks", label: "Food Trucks", x: 8, y: 8, w: 18, h: 30, color: "#FF5722" },
      { id: "backend", label: "Real-Time Backend", x: 28, y: 8, w: 42, h: 30, color: "#FF9900" },
      { id: "users", label: "Hungry Users", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "gps", label: "Truck GPS", x: 17, y: 18, w: 90, h: 28, icon: "📍" },
      { id: "iot", label: "IoT Hub", x: 17, y: 30, w: 80, h: 28, icon: "📡", hidden: true },
      { id: "stream", label: "Kinesis Stream", x: 49, y: 14, w: 115, h: 28, icon: "🌊", hidden: true },
      { id: "lambda", label: "Location Lambda", x: 49, y: 24, w: 125, h: 28, icon: "⚡" },
      { id: "geo", label: "Geo Database", x: 49, y: 34, w: 110, h: 28, icon: "🗺️", hidden: true },
      { id: "api", label: "Location API", x: 82, y: 20, w: 100, h: 28, icon: "🔌" },
      { id: "app", label: "Mobile App", x: 82, y: 32, w: 95, h: 28, icon: "📱", hidden: true },
    ],
    edges: [
      { from: "gps", to: "iot" },
      { from: "iot", to: "stream" },
      { from: "stream", to: "lambda" },
      { from: "lambda", to: "geo" },
      { from: "geo", to: "api" },
      { from: "api", to: "app" },
    ],
    hiddenNodeIds: ["iot", "stream", "geo", "app"],
    wordBank: ["IoT Hub", "Kinesis Stream", "Geo Database", "Mobile App", "Satellite Phone", "Telegraph"],
  },
  techStack: ["IoT Core", "Kinesis", "Lambda", "DynamoDB"],
  services: ["GPS Tracking", "Streaming", "Geo-queries"],
  layers: ["Food Trucks", "Real-Time Backend", "Hungry Users"],
};

export const funPuzzleServerless3: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🐾 Serverless Challenge",
  projectName: "Meme Generator 9000 😂",
  description:
    "The viral meme generator is broken! Images aren't being processed and captions aren't being added. Fix the serverless image pipeline before the internet runs out of fresh memes!",
  color: "#FF9900",
  successMessage: "🎉 Memes are flowing again! The internet is safe for another day! 😂🔥",
  diagram: {
    groups: [
      { id: "upload", label: "Upload", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "process", label: "Image Pipeline", x: 28, y: 8, w: 42, h: 30, color: "#FF9900" },
      { id: "serve", label: "CDN", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "user", label: "Meme Upload", x: 17, y: 20, w: 105, h: 28, icon: "📤" },
      { id: "s3raw", label: "Raw Bucket", x: 17, y: 32, w: 100, h: 28, icon: "🪣", hidden: true },
      { id: "trigger", label: "S3 Trigger", x: 49, y: 14, w: 90, h: 28, icon: "⚡", hidden: true },
      { id: "resize", label: "Resize Lambda", x: 49, y: 24, w: 115, h: 28, icon: "📐" },
      { id: "caption", label: "Caption Lambda", x: 49, y: 34, w: 120, h: 28, icon: "✍️", hidden: true },
      { id: "s3out", label: "Meme Bucket", x: 82, y: 20, w: 105, h: 28, icon: "🎭" },
      { id: "cdn", label: "CloudFront", x: 82, y: 32, w: 100, h: 28, icon: "🌐", hidden: true },
    ],
    edges: [
      { from: "user", to: "s3raw" },
      { from: "s3raw", to: "trigger" },
      { from: "trigger", to: "resize" },
      { from: "resize", to: "caption" },
      { from: "caption", to: "s3out" },
      { from: "s3out", to: "cdn" },
    ],
    hiddenNodeIds: ["s3raw", "trigger", "caption", "cdn"],
    wordBank: ["Raw Bucket", "S3 Trigger", "Caption Lambda", "CloudFront", "Fax Machine", "Carrier Pigeon"],
  },
  techStack: ["S3", "Lambda", "CloudFront", "Sharp.js"],
  services: ["Image Processing", "CDN", "Triggers"],
  layers: ["Upload", "Image Pipeline", "CDN"],
};

export const funPuzzleServerless4: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🐾 Serverless Challenge",
  projectName: "Pizza Ordering Express 🍕",
  description:
    "Pizza orders are getting lost! The ordering system needs to handle thousands of hungry customers. Fix the event-driven architecture before pizzas go cold!",
  color: "#FF9900",
  successMessage: "🎉 Pizzas are being delivered hot and fresh! You're a pizza-saving hero! 🍕🦸",
  diagram: {
    groups: [
      { id: "order", label: "Order Intake", x: 8, y: 8, w: 20, h: 30, color: "#E53E3E" },
      { id: "process", label: "Order Processing", x: 30, y: 8, w: 38, h: 30, color: "#FF9900" },
      { id: "fulfil", label: "Fulfillment", x: 70, y: 8, w: 22, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "app", label: "Pizza App", x: 18, y: 18, w: 90, h: 28, icon: "📱" },
      { id: "api", label: "Order API", x: 18, y: 30, w: 85, h: 28, icon: "🚪", hidden: true },
      { id: "queue", label: "Order Queue (SQS)", x: 49, y: 14, w: 135, h: 28, icon: "📬", hidden: true },
      { id: "processor", label: "Order Processor", x: 49, y: 24, w: 125, h: 28, icon: "⚡" },
      { id: "db", label: "Orders DB", x: 49, y: 34, w: 95, h: 28, icon: "🗄️", hidden: true },
      { id: "kitchen", label: "Kitchen Display", x: 81, y: 20, w: 120, h: 28, icon: "👨‍🍳" },
      { id: "notify", label: "SMS Notification", x: 81, y: 32, w: 125, h: 28, icon: "📲", hidden: true },
    ],
    edges: [
      { from: "app", to: "api" },
      { from: "api", to: "queue" },
      { from: "queue", to: "processor" },
      { from: "processor", to: "db" },
      { from: "processor", to: "kitchen" },
      { from: "kitchen", to: "notify" },
    ],
    hiddenNodeIds: ["api", "queue", "db", "notify"],
    wordBank: ["Order API", "Order Queue (SQS)", "Orders DB", "SMS Notification", "Smoke Signal", "Owl Post"],
  },
  techStack: ["API Gateway", "SQS", "Lambda", "DynamoDB"],
  services: ["Queueing", "Processing", "Notifications"],
  layers: ["Order Intake", "Order Processing", "Fulfillment"],
};

export const funPuzzleServerless5: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🐾 Serverless Challenge",
  projectName: "Weather Alert System 🌪️",
  description:
    "Storm warnings aren't reaching people! The real-time alert system is down. Wire up the event-driven notification pipeline before the next storm hits!",
  color: "#FF9900",
  successMessage: "🎉 Alerts are going out! People are staying safe from storms! 🌈☀️",
  diagram: {
    groups: [
      { id: "sensors", label: "Weather Sensors", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "process", label: "Alert Engine", x: 28, y: 8, w: 42, h: 30, color: "#FF9900" },
      { id: "notify", label: "Notifications", x: 72, y: 8, w: 20, h: 30, color: "#E53E3E" },
    ],
    nodes: [
      { id: "sensor", label: "IoT Sensors", x: 17, y: 18, w: 100, h: 28, icon: "🌡️" },
      { id: "ingest", label: "Data Ingest", x: 17, y: 30, w: 95, h: 28, icon: "📊", hidden: true },
      { id: "analyze", label: "Storm Analyzer", x: 49, y: 14, w: 120, h: 28, icon: "🔍", hidden: true },
      { id: "rules", label: "Alert Rules Engine", x: 49, y: 24, w: 135, h: 28, icon: "⚡" },
      { id: "severity", label: "Severity Classifier", x: 49, y: 34, w: 140, h: 28, icon: "⚠️", hidden: true },
      { id: "push", label: "Push Notifications", x: 82, y: 20, w: 140, h: 28, icon: "📲" },
      { id: "siren", label: "Emergency Sirens", x: 82, y: 32, w: 130, h: 28, icon: "🚨", hidden: true },
    ],
    edges: [
      { from: "sensor", to: "ingest" },
      { from: "ingest", to: "analyze" },
      { from: "analyze", to: "rules" },
      { from: "rules", to: "severity" },
      { from: "severity", to: "push" },
      { from: "severity", to: "siren" },
    ],
    hiddenNodeIds: ["ingest", "analyze", "severity", "siren"],
    wordBank: ["Data Ingest", "Storm Analyzer", "Severity Classifier", "Emergency Sirens", "Crystal Ball", "Tin Can"],
  },
  techStack: ["IoT Core", "Lambda", "SNS", "EventBridge"],
  services: ["Data Ingestion", "Analysis", "Multi-Channel Alerts"],
  layers: ["Weather Sensors", "Alert Engine", "Notifications"],
};

/* ─── DevOps Role Puzzles (2-5) ─────────────────────────── */

export const funPuzzleDevOps2: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🚀 DevOps Challenge",
  projectName: "GitOps Galaxy 🌌",
  description:
    "The GitOps deployment pipeline is broken! Kubernetes clusters aren't syncing with Git. Fix the continuous deployment flow before the fleet drifts into chaos!",
  color: "#24292e",
  successMessage: "🎉 Clusters are in sync! The GitOps galaxy is harmonious again! 🌌✨",
  diagram: {
    groups: [
      { id: "git", label: "Git Repository", x: 8, y: 8, w: 20, h: 30, color: "#24292e" },
      { id: "cd", label: "CD Pipeline", x: 30, y: 8, w: 38, h: 30, color: "#FF9900" },
      { id: "k8s", label: "Kubernetes", x: 70, y: 8, w: 22, h: 30, color: "#326CE5" },
    ],
    nodes: [
      { id: "push", label: "Git Push", x: 18, y: 18, w: 85, h: 28, icon: "📤" },
      { id: "manifest", label: "K8s Manifests", x: 18, y: 30, w: 110, h: 28, icon: "📄", hidden: true },
      { id: "webhook", label: "Webhook Trigger", x: 49, y: 14, w: 125, h: 28, icon: "🔔", hidden: true },
      { id: "argocd", label: "ArgoCD Sync", x: 49, y: 24, w: 110, h: 28, icon: "🔄" },
      { id: "validate", label: "Config Validator", x: 49, y: 34, w: 125, h: 28, icon: "✅", hidden: true },
      { id: "deploy", label: "Pod Deployment", x: 81, y: 20, w: 120, h: 28, icon: "☸️" },
      { id: "monitor", label: "Health Monitor", x: 81, y: 32, w: 115, h: 28, icon: "📊", hidden: true },
    ],
    edges: [
      { from: "push", to: "manifest" },
      { from: "manifest", to: "webhook" },
      { from: "webhook", to: "argocd" },
      { from: "argocd", to: "validate" },
      { from: "validate", to: "deploy" },
      { from: "deploy", to: "monitor" },
    ],
    hiddenNodeIds: ["manifest", "webhook", "validate", "monitor"],
    wordBank: ["K8s Manifests", "Webhook Trigger", "Config Validator", "Health Monitor", "Magic Wand", "Fortune Teller"],
  },
  techStack: ["Git", "ArgoCD", "Kubernetes", "Helm"],
  services: ["GitOps", "Validation", "Monitoring"],
  layers: ["Git Repository", "CD Pipeline", "Kubernetes"],
};

export const funPuzzleDevOps3: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🚀 DevOps Challenge",
  projectName: "Log Detective Agency 🔎",
  description:
    "Logs are disappearing! The centralized logging pipeline is broken and engineers can't debug issues. Fix it before the mystery goes unsolved forever!",
  color: "#24292e",
  successMessage: "🎉 The case is solved! Logs are flowing and bugs are being caught! 🔎🕵️",
  diagram: {
    groups: [
      { id: "apps", label: "Applications", x: 8, y: 8, w: 18, h: 30, color: "#4CAF50" },
      { id: "collect", label: "Collection Layer", x: 28, y: 8, w: 42, h: 30, color: "#FF9900" },
      { id: "analyze", label: "Analysis", x: 72, y: 8, w: 20, h: 30, color: "#9C27B0" },
    ],
    nodes: [
      { id: "app1", label: "Microservice A", x: 17, y: 16, w: 115, h: 26, icon: "📦" },
      { id: "app2", label: "Microservice B", x: 17, y: 30, w: 115, h: 26, icon: "📦", hidden: true },
      { id: "agent", label: "Log Agent", x: 49, y: 14, w: 95, h: 28, icon: "📡", hidden: true },
      { id: "kafka", label: "Kafka Stream", x: 49, y: 24, w: 110, h: 28, icon: "🌊" },
      { id: "elastic", label: "Elasticsearch", x: 49, y: 34, w: 110, h: 28, icon: "🔍", hidden: true },
      { id: "kibana", label: "Kibana Dashboard", x: 82, y: 20, w: 135, h: 28, icon: "📊" },
      { id: "alert", label: "Alert Manager", x: 82, y: 32, w: 115, h: 28, icon: "🚨", hidden: true },
    ],
    edges: [
      { from: "app1", to: "agent" },
      { from: "app2", to: "agent" },
      { from: "agent", to: "kafka" },
      { from: "kafka", to: "elastic" },
      { from: "elastic", to: "kibana" },
      { from: "elastic", to: "alert" },
    ],
    hiddenNodeIds: ["app2", "agent", "elastic", "alert"],
    wordBank: ["Microservice B", "Log Agent", "Elasticsearch", "Alert Manager", "Telepathy", "Smoke Signals"],
  },
  techStack: ["Fluentd", "Kafka", "Elasticsearch", "Kibana"],
  services: ["Log Collection", "Streaming", "Visualization"],
  layers: ["Applications", "Collection Layer", "Analysis"],
};

export const funPuzzleDevOps4: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🚀 DevOps Challenge",
  projectName: "Chaos Monkey Training Camp 🐒",
  description:
    "The chaos engineering platform is offline! Engineers can't test system resilience. Wire up the chaos injection pipeline before production goes down unexpectedly!",
  color: "#24292e",
  successMessage: "🎉 Chaos is controlled! Systems are battle-tested and resilient! 🐒💪",
  diagram: {
    groups: [
      { id: "control", label: "Control Plane", x: 8, y: 8, w: 20, h: 30, color: "#E53E3E" },
      { id: "inject", label: "Chaos Injection", x: 30, y: 8, w: 38, h: 30, color: "#FF9900" },
      { id: "observe", label: "Observability", x: 70, y: 8, w: 22, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "schedule", label: "Chaos Scheduler", x: 18, y: 18, w: 125, h: 28, icon: "📅" },
      { id: "config", label: "Experiment Config", x: 18, y: 30, w: 135, h: 28, icon: "⚙️", hidden: true },
      { id: "inject", label: "Chaos Injector", x: 49, y: 14, w: 115, h: 28, icon: "💉", hidden: true },
      { id: "target", label: "Target Services", x: 49, y: 24, w: 120, h: 28, icon: "🎯" },
      { id: "blast", label: "Blast Radius Limiter", x: 49, y: 34, w: 150, h: 28, icon: "🛡️", hidden: true },
      { id: "metrics", label: "Metrics Collector", x: 81, y: 20, w: 130, h: 28, icon: "📊" },
      { id: "report", label: "Resilience Report", x: 81, y: 32, w: 130, h: 28, icon: "📋", hidden: true },
    ],
    edges: [
      { from: "schedule", to: "config" },
      { from: "config", to: "inject" },
      { from: "inject", to: "target" },
      { from: "inject", to: "blast" },
      { from: "target", to: "metrics" },
      { from: "metrics", to: "report" },
    ],
    hiddenNodeIds: ["config", "inject", "blast", "report"],
    wordBank: ["Experiment Config", "Chaos Injector", "Blast Radius Limiter", "Resilience Report", "Banana", "Coconut"],
  },
  techStack: ["Chaos Monkey", "LitmusChaos", "Prometheus", "Grafana"],
  services: ["Scheduling", "Injection", "Reporting"],
  layers: ["Control Plane", "Chaos Injection", "Observability"],
};

export const funPuzzleDevOps5: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🚀 DevOps Challenge",
  projectName: "Secret Keeper Vault 🔐",
  description:
    "Secrets are leaking! The centralized secrets management pipeline is broken. Fix it before sensitive credentials end up in the wrong hands!",
  color: "#24292e",
  successMessage: "🎉 Secrets are secure! The vault is impenetrable! 🔐✨",
  diagram: {
    groups: [
      { id: "apps", label: "Applications", x: 8, y: 8, w: 18, h: 30, color: "#4CAF50" },
      { id: "vault", label: "Secrets Vault", x: 28, y: 8, w: 42, h: 30, color: "#24292e" },
      { id: "audit", label: "Compliance", x: 72, y: 8, w: 20, h: 30, color: "#9C27B0" },
    ],
    nodes: [
      { id: "app", label: "Application", x: 17, y: 20, w: 100, h: 28, icon: "📦" },
      { id: "agent", label: "Vault Agent", x: 17, y: 32, w: 100, h: 28, icon: "🤖", hidden: true },
      { id: "auth", label: "Auth Method", x: 49, y: 14, w: 105, h: 28, icon: "🔑", hidden: true },
      { id: "policy", label: "ACL Policies", x: 49, y: 24, w: 100, h: 28, icon: "📜" },
      { id: "secrets", label: "Secrets Engine", x: 49, y: 34, w: 120, h: 28, icon: "🔐", hidden: true },
      { id: "rotate", label: "Auto-Rotation", x: 82, y: 20, w: 115, h: 28, icon: "🔄" },
      { id: "audit", label: "Audit Log", x: 82, y: 32, w: 90, h: 28, icon: "📋", hidden: true },
    ],
    edges: [
      { from: "app", to: "agent" },
      { from: "agent", to: "auth" },
      { from: "auth", to: "policy" },
      { from: "policy", to: "secrets" },
      { from: "secrets", to: "rotate" },
      { from: "secrets", to: "audit" },
    ],
    hiddenNodeIds: ["agent", "auth", "secrets", "audit"],
    wordBank: ["Vault Agent", "Auth Method", "Secrets Engine", "Audit Log", "Treasure Map", "Skeleton Key"],
  },
  techStack: ["HashiCorp Vault", "Kubernetes", "AWS KMS"],
  services: ["Authentication", "Policies", "Rotation"],
  layers: ["Applications", "Secrets Vault", "Compliance"],
};

/* ─── Security Role Puzzles (2-5) ─────────────────────────── */

export const funPuzzleSecurity2: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🛡️ Security Challenge",
  projectName: "Threat Hunter HQ 🎯",
  description:
    "Cyber threats are going undetected! The threat detection pipeline is broken. Wire up the security monitoring before hackers slip through!",
  color: "#003168",
  successMessage: "🎉 Threats are being detected! The hunters are on patrol! 🎯🛡️",
  diagram: {
    groups: [
      { id: "sources", label: "Log Sources", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "detect", label: "Detection Engine", x: 28, y: 8, w: 42, h: 30, color: "#E53E3E" },
      { id: "respond", label: "Response", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "firewall", label: "Firewall Logs", x: 17, y: 16, w: 110, h: 26, icon: "🔥" },
      { id: "endpoint", label: "Endpoint Logs", x: 17, y: 30, w: 110, h: 26, icon: "💻", hidden: true },
      { id: "siem", label: "SIEM Platform", x: 49, y: 14, w: 115, h: 28, icon: "🔍", hidden: true },
      { id: "rules", label: "Detection Rules", x: 49, y: 24, w: 120, h: 28, icon: "📋" },
      { id: "ml", label: "ML Anomaly Detector", x: 49, y: 34, w: 150, h: 28, icon: "🤖", hidden: true },
      { id: "alert", label: "Security Alert", x: 82, y: 20, w: 110, h: 28, icon: "🚨" },
      { id: "ticket", label: "Incident Ticket", x: 82, y: 32, w: 115, h: 28, icon: "🎫", hidden: true },
    ],
    edges: [
      { from: "firewall", to: "siem" },
      { from: "endpoint", to: "siem" },
      { from: "siem", to: "rules" },
      { from: "siem", to: "ml" },
      { from: "rules", to: "alert" },
      { from: "ml", to: "alert" },
      { from: "alert", to: "ticket" },
    ],
    hiddenNodeIds: ["endpoint", "siem", "ml", "ticket"],
    wordBank: ["Endpoint Logs", "SIEM Platform", "ML Anomaly Detector", "Incident Ticket", "Crystal Ball", "Radar"],
  },
  techStack: ["SIEM", "Machine Learning", "SOAR"],
  services: ["Log Collection", "Detection", "Alerting"],
  layers: ["Log Sources", "Detection Engine", "Response"],
};

export const funPuzzleSecurity3: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🛡️ Security Challenge",
  projectName: "Identity Fortress 🏰",
  description:
    "User identities are being compromised! The zero-trust identity system is down. Fix the authentication pipeline before imposters take over!",
  color: "#003168",
  successMessage: "🎉 Identities are verified! The fortress stands strong! 🏰✨",
  diagram: {
    groups: [
      { id: "user", label: "User Access", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "auth", label: "Authentication", x: 28, y: 8, w: 42, h: 30, color: "#9C27B0" },
      { id: "access", label: "Authorization", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "login", label: "Login Request", x: 17, y: 18, w: 115, h: 28, icon: "🔑" },
      { id: "sso", label: "SSO Provider", x: 17, y: 30, w: 105, h: 28, icon: "🌐", hidden: true },
      { id: "mfa", label: "MFA Challenge", x: 49, y: 14, w: 115, h: 28, icon: "📱", hidden: true },
      { id: "risk", label: "Risk Analyzer", x: 49, y: 24, w: 110, h: 28, icon: "⚠️" },
      { id: "token", label: "Token Service", x: 49, y: 34, w: 110, h: 28, icon: "🎟️", hidden: true },
      { id: "rbac", label: "RBAC Engine", x: 82, y: 20, w: 105, h: 28, icon: "👥" },
      { id: "grant", label: "Access Grant", x: 82, y: 32, w: 105, h: 28, icon: "✅", hidden: true },
    ],
    edges: [
      { from: "login", to: "sso" },
      { from: "sso", to: "mfa" },
      { from: "mfa", to: "risk" },
      { from: "risk", to: "token" },
      { from: "token", to: "rbac" },
      { from: "rbac", to: "grant" },
    ],
    hiddenNodeIds: ["sso", "mfa", "token", "grant"],
    wordBank: ["SSO Provider", "MFA Challenge", "Token Service", "Access Grant", "Magic Password", "Secret Handshake"],
  },
  techStack: ["OAuth 2.0", "SAML", "MFA", "JWT"],
  services: ["SSO", "Risk Analysis", "RBAC"],
  layers: ["User Access", "Authentication", "Authorization"],
};

export const funPuzzleSecurity4: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🛡️ Security Challenge",
  projectName: "Vulnerability Scanner 5000 🔬",
  description:
    "Security vulnerabilities are piling up! The automated scanning pipeline is broken. Fix it before the bugs become exploits!",
  color: "#003168",
  successMessage: "🎉 Vulnerabilities are being found and fixed! The system is hardened! 🔬💪",
  diagram: {
    groups: [
      { id: "code", label: "Code Repository", x: 8, y: 8, w: 18, h: 30, color: "#24292e" },
      { id: "scan", label: "Scanning Pipeline", x: 28, y: 8, w: 42, h: 30, color: "#E53E3E" },
      { id: "fix", label: "Remediation", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "commit", label: "Code Commit", x: 17, y: 18, w: 105, h: 28, icon: "📝" },
      { id: "trigger", label: "CI Trigger", x: 17, y: 30, w: 90, h: 28, icon: "⚡", hidden: true },
      { id: "sast", label: "SAST Scanner", x: 49, y: 14, w: 110, h: 28, icon: "🔍", hidden: true },
      { id: "deps", label: "Dependency Check", x: 49, y: 24, w: 130, h: 28, icon: "📦" },
      { id: "container", label: "Container Scan", x: 49, y: 34, w: 120, h: 28, icon: "🐳", hidden: true },
      { id: "report", label: "Findings Report", x: 82, y: 20, w: 120, h: 28, icon: "📋" },
      { id: "pr", label: "Fix PR Created", x: 82, y: 32, w: 115, h: 28, icon: "🔧", hidden: true },
    ],
    edges: [
      { from: "commit", to: "trigger" },
      { from: "trigger", to: "sast" },
      { from: "trigger", to: "deps" },
      { from: "trigger", to: "container" },
      { from: "sast", to: "report" },
      { from: "deps", to: "report" },
      { from: "container", to: "report" },
      { from: "report", to: "pr" },
    ],
    hiddenNodeIds: ["trigger", "sast", "container", "pr"],
    wordBank: ["CI Trigger", "SAST Scanner", "Container Scan", "Fix PR Created", "Wishful Thinking", "Ignore Button"],
  },
  techStack: ["Snyk", "SonarQube", "Trivy", "GitHub Actions"],
  services: ["SAST", "SCA", "Container Scanning"],
  layers: ["Code Repository", "Scanning Pipeline", "Remediation"],
};

export const funPuzzleSecurity5: DiagramPuzzleData = {
  title: "Fun Puzzle",
  roleTitle: "🛡️ Security Challenge",
  projectName: "Data Privacy Shield 🛡️",
  description:
    "Sensitive data is being exposed! The data classification and masking pipeline is broken. Fix it before privacy regulations catch up!",
  color: "#003168",
  successMessage: "🎉 Data is protected! Privacy is maintained! 🛡️🔒",
  diagram: {
    groups: [
      { id: "data", label: "Data Sources", x: 8, y: 8, w: 18, h: 30, color: "#2196F3" },
      { id: "classify", label: "Classification", x: 28, y: 8, w: 42, h: 30, color: "#9C27B0" },
      { id: "protect", label: "Protection", x: 72, y: 8, w: 20, h: 30, color: "#4CAF50" },
    ],
    nodes: [
      { id: "db", label: "Database", x: 17, y: 18, w: 90, h: 28, icon: "🗄️" },
      { id: "files", label: "File Storage", x: 17, y: 30, w: 100, h: 28, icon: "📁", hidden: true },
      { id: "scanner", label: "PII Scanner", x: 49, y: 14, w: 100, h: 28, icon: "🔍", hidden: true },
      { id: "classify", label: "Data Classifier", x: 49, y: 24, w: 115, h: 28, icon: "🏷️" },
      { id: "policy", label: "Privacy Policy", x: 49, y: 34, w: 110, h: 28, icon: "📜", hidden: true },
      { id: "mask", label: "Data Masking", x: 82, y: 20, w: 110, h: 28, icon: "🎭" },
      { id: "encrypt", label: "Encryption", x: 82, y: 32, w: 95, h: 28, icon: "🔐", hidden: true },
    ],
    edges: [
      { from: "db", to: "scanner" },
      { from: "files", to: "scanner" },
      { from: "scanner", to: "classify" },
      { from: "classify", to: "policy" },
      { from: "policy", to: "mask" },
      { from: "policy", to: "encrypt" },
    ],
    hiddenNodeIds: ["files", "scanner", "policy", "encrypt"],
    wordBank: ["File Storage", "PII Scanner", "Privacy Policy", "Encryption", "Paper Shredder", "Invisible Ink"],
  },
  techStack: ["DLP", "Data Classification", "Encryption"],
  services: ["PII Detection", "Policy Engine", "Masking"],
  layers: ["Data Sources", "Classification", "Protection"],
};

/* ═══════════════════════════════════════════════════════════
   EXPORT PUZZLE COLLECTIONS PER ROLE
   ═══════════════════════════════════════════════════════════ */

export const aiPuzzles = [funPuzzleAI, funPuzzleAI2, funPuzzleAI3, funPuzzleAI4, funPuzzleAI5];
export const serverlessPuzzles = [funPuzzleServerless, funPuzzleServerless2, funPuzzleServerless3, funPuzzleServerless4, funPuzzleServerless5];
export const devOpsPuzzles = [funPuzzleDevOps, funPuzzleDevOps2, funPuzzleDevOps3, funPuzzleDevOps4, funPuzzleDevOps5];
export const securityPuzzles = [funPuzzleSecurity, funPuzzleSecurity2, funPuzzleSecurity3, funPuzzleSecurity4, funPuzzleSecurity5];
