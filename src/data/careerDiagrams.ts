import type { DiagramPuzzleData } from "@/components/puzzles/ArchDiagramPuzzle";

/* ═══════════════════════════════════════════════════════════
   CAREER ARCHITECTURE DIAGRAMS
   ═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   GENERIC CLOUD PUZZLE (Fun, not related to actual work)
   ─────────────────────────────────────────────────────────── */

export const genericCloudPuzzle: DiagramPuzzleData = {
  title: "Cloud Services Puzzle",
  roleTitle: "☁️ Cloud Skills Check",
  projectName: "Disaster Recovery: The Cloud is Down! 🚨",
  description:
    "Uh oh — a production meltdown! The cloud is on fire 🔥 and you need to rebuild the disaster recovery architecture from scratch. Route traffic through a global CDN, spin up failover databases, and get the incident response pipeline back online. Can you reconstruct the DR runbook before the SLA clock runs out?",
  color: "#E53E3E",
  successMessage:
    "🎉 SLA saved! You successfully reconstructed the full Disaster Recovery architecture and the on-call team can finally sleep tonight. You're a certified Cloud Hero! 🦸",
  diagram: {
    groups: [
      { id: "primary", label: "Primary Region (US-EAST-1)", x: 8, y: 10, w: 38, h: 75, color: "#3182CE" },
      { id: "dr", label: "DR Region (US-WEST-2)", x: 54, y: 10, w: 38, h: 75, color: "#E53E3E" },
      { id: "global", label: "Global Layer", x: 8, y: 3, w: 84, h: 6, color: "#805AD5" },
    ],
    nodes: [
      // Global Layer
      { id: "dns_failover", label: "DNS Failover Policy", x: 30, y: 5.5, w: 145, h: 26, icon: "🌐", hidden: true },
      { id: "cdn", label: "Global CDN", x: 73, y: 5.5, w: 100, h: 26, icon: "⚡" },

      // Primary Region
      { id: "alb_primary", label: "Load Balancer (Primary)", x: 20, y: 22, w: 155, h: 30, icon: "⚖️" },
      { id: "app_primary", label: "App Servers (Active)", x: 20, y: 35, w: 150, h: 30, icon: "🖥️", hidden: true },
      { id: "db_primary", label: "RDS Primary (Multi-AZ)", x: 20, y: 50, w: 155, h: 30, icon: "🗄️" },
      { id: "backup", label: "Automated Backups (S3)", x: 20, y: 65, w: 160, h: 30, icon: "💾", hidden: true },

      // DR Region
      { id: "alb_dr", label: "Load Balancer (Standby)", x: 73, y: 22, w: 155, h: 30, icon: "⚖️", hidden: true },
      { id: "app_dr", label: "App Servers (Warm Standby)", x: 73, y: 35, w: 175, h: 30, icon: "🖥️" },
      { id: "db_replica", label: "RDS Read Replica (DR)", x: 73, y: 50, w: 165, h: 30, icon: "🗄️", hidden: true },
      { id: "restore", label: "Backup Restore Pipeline", x: 73, y: 65, w: 175, h: 30, icon: "♻️" },
    ],
    edges: [
      { from: "cdn", to: "dns_failover", label: "Health Check" },
      { from: "dns_failover", to: "alb_primary", label: "Route (Primary)" },
      { from: "dns_failover", to: "alb_dr", label: "Failover Route" },
      { from: "alb_primary", to: "app_primary", label: "Forward" },
      { from: "app_primary", to: "db_primary", label: "R/W" },
      { from: "db_primary", to: "db_replica", label: "Cross-Region Replication" },
      { from: "db_primary", to: "backup", label: "Nightly Backup" },
      { from: "backup", to: "restore", label: "S3 Cross-Region Copy" },
      { from: "alb_dr", to: "app_dr", label: "Forward" },
      { from: "app_dr", to: "db_replica", label: "Read" },
      { from: "restore", to: "db_replica", label: "Point-in-Time Restore" },
    ],
    hiddenNodeIds: ["dns_failover", "app_primary", "backup", "alb_dr", "db_replica"],
    wordBank: [
      "DNS Failover Policy",
      "App Servers (Active)",
      "Automated Backups (S3)",
      "Load Balancer (Standby)",
      "RDS Read Replica (DR)",
      "WAF Rules",
      "CloudWatch Alarms",
      "SNS Alerts",
    ],
  },
  techStack: ["Route 53", "CloudFront", "RDS", "S3", "EC2"],
  services: ["DNS Failover", "Cross-Region Replication", "Automated Backups", "Warm Standby"],
  layers: ["Global Layer", "Primary Region", "DR Region"],
};

/* ───────────────────────────────────────────────────────────
   DIAGRAM 1: Enterprise AI & GraphRAG Platform (Azure)
   ─────────────────────────────────────────────────────────── */

export const aiRagDiagram: DiagramPuzzleData = {
  title: "Solution Architecture",
  roleTitle: "Principal Cloud Engineer — AI",
  projectName: "Enterprise AI & GraphRAG Platform (Azure)",
  description:
    "I engineered a highly secure, multi-modal Retrieval-Augmented Generation (RAG) architecture that complies with strict financial sector data boundaries. The complexity involved orchestrating dual RAG patterns (Vanilla vector search and GraphRAG) while ensuring zero public internet exposure. I locked down every component—from Cosmos DB to OpenAI models—using Azure Private Endpoints and User Managed Identities, eliminating shared credentials. All data at rest is encrypted via Customer Managed Keys (CMK) stored in Azure Key Vault.",
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
      // Auth (outside VPC)
      { id: "entraid", label: "Enterprise SSO (Entra ID)", x: 8, y: 22, w: 150, h: 36, icon: "🔐" },
      // Frontend Subnet
      { id: "frontend", label: "React/NextJS", x: 26, y: 20, w: 120, h: 34, icon: "💻" },
      // API Management
      { id: "apim", label: "Azure APIM", x: 46, y: 18, w: 100, h: 34, icon: "🚪" },
      { id: "backend", label: "FastAPI Backend", x: 46, y: 28, w: 120, h: 34, icon: "🐍", hidden: true },
      // Data & Orchestration
      { id: "ingestion", label: "Enterprise File Transfer", x: 67, y: 14, w: 145, h: 30, icon: "📂" },
      { id: "orchestrator", label: "Data Orchestrator", x: 67, y: 22, w: 130, h: 30, icon: "⚙️", hidden: true },
      { id: "blob", label: "Blob Storage (Uploads)", x: 67, y: 30, w: 145, h: 30, icon: "📦" },
      { id: "kv", label: "Azure Key Vault (CMK)", x: 67, y: 38, w: 140, h: 30, icon: "🔑" },
      { id: "vectordb", label: "Azure AI Search", x: 67, y: 46, w: 120, h: 30, icon: "🔍", hidden: true },
      { id: "graphdb", label: "Cosmos DB", x: 67, y: 54, w: 100, h: 30, icon: "🕸️", hidden: true },
      // AI Model Pool
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
    "I designed a completely isolated, self-hosted GitHub Actions runner environment to execute CI/CD securely within an enterprise Operations account. The complexity lay in the autoscaling orchestration and security constraints. I utilized Lambda to dynamically spin up ephemeral ECS Fargate tasks in private subnets. These runners assume strict OIDC IAM roles, pull CMK-encrypted credentials from Secrets Manager via VPC Endpoints, and route all outbound GitHub API calls through an internal proxy, ensuring zero direct internet access.",
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
      // GitHub (external)
      { id: "github", label: "GitHub Enterprise", x: 8, y: 10, w: 130, h: 34, icon: "🐙" },
      // Operations Account
      { id: "lambda", label: "Autoscaling Lambda", x: 22, y: 22, w: 135, h: 32, icon: "⚡" },
      // Private Subnet
      { id: "ecs", label: "Fargate Runner Cluster", x: 27, y: 40, w: 155, h: 34, icon: "📦", hidden: true },
      { id: "proxy", label: "Corporate Proxy", x: 27, y: 54, w: 120, h: 32, icon: "🛡️" },
      // VPC Endpoints
      { id: "secrets", label: "Secrets Manager (CMK)", x: 54, y: 36, w: 155, h: 30, icon: "🔐", hidden: true },
      { id: "ecr", label: "Elastic Container Registry", x: 54, y: 46, w: 165, h: 30, icon: "🐳" },
      { id: "s3", label: "Build Artifacts (S3)", x: 54, y: 56, w: 135, h: 30, icon: "📦" },
      // Target Account
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
    "I led the implementation of a zero-trust API integration pattern for routing corporate on-premise traffic to AWS workloads. This required a multi-layered network design: terminating TLS at a Network Load Balancer, forwarding through an AWS API Interface Endpoint, and hitting a Private API Gateway. Authentication complexity was handled via a custom Lambda Authorizer cross-referencing a corporate Cognito User Pool through an internal proxy, finally routing validated traffic to backend Fargate containers via a VPC Link and Elastic Network Interfaces (ENI).",
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
      // External
      { id: "onprem", label: "Corporate On-Premise Client", x: 5, y: 5, w: 165, h: 32, icon: "🏢" },
      { id: "dx", label: "Direct Connect", x: 5, y: 15, w: 110, h: 30, icon: "🔗" },
      // Network Resource VPC
      { id: "nlb", label: "AWS NLB (TLS Termination)", x: 20, y: 22, w: 165, h: 32, icon: "⚖️", hidden: true },
      { id: "vpce", label: "API Interface Endpoint", x: 20, y: 32, w: 150, h: 32, icon: "🔌" },
      // API Gateway VPC
      { id: "apigw", label: "Private API Gateway", x: 42, y: 22, w: 145, h: 32, icon: "🚪", hidden: true },
      { id: "policy", label: "Resource Policy & API Key", x: 42, y: 32, w: 160, h: 32, icon: "📜" },
      // Managed Lambda VPC
      { id: "authorizer", label: "Custom Lambda Authorizer", x: 64, y: 22, w: 165, h: 32, icon: "⚡", hidden: true },
      { id: "cognito", label: "Corporate Cognito User Pool", x: 64, y: 32, w: 165, h: 32, icon: "🪪" },
      // Shared Workload VPC
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
    "I architected an end-to-end, serverless MLOps pipeline integrating native Kubernetes operators with AWS managed services. The complexity involved coordinating Apache Airflow (MWAA) and AWS Step Functions to manage containerized pre-processing and hyperparameter optimization (HPO). Model lineage was strictly tracked via SageMaker Feature Store, and endpoints were deployed with Elastic Autoscaling and Data Capture enabled, feeding directly into SageMaker Model Monitor and Clarify to trigger automated retraining pipelines.",
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
      // External trigger
      { id: "k8s", label: "KubeFlow Operator", x: 8, y: 3, w: 125, h: 30, icon: "☸️" },
      // CI Pipeline
      { id: "codecommit", label: "CodeCommit", x: 19, y: 13, w: 100, h: 28, icon: "📁", hidden: true },
      { id: "codebuild", label: "CodeBuild", x: 19, y: 22, w: 95, h: 28, icon: "🔨" },
      { id: "container", label: "Custom Container", x: 19, y: 30, w: 125, h: 28, icon: "🐳" },
      // Step Functions
      { id: "prep", label: "Pre-processing & Feature Eng", x: 50, y: 13, w: 165, h: 28, icon: "⚙️", hidden: true },
      { id: "train", label: "Model Training / HPO", x: 50, y: 21, w: 140, h: 28, icon: "🧠", hidden: true },
      { id: "eval", label: "Model Evaluation / Tests", x: 50, y: 29, w: 150, h: 28, icon: "📊" },
      // Governance
      { id: "featurestore", label: "SageMaker Feature Store", x: 79, y: 13, w: 160, h: 28, icon: "🗂️" },
      { id: "clarify", label: "SageMaker Clarify", x: 79, y: 21, w: 125, h: 28, icon: "🔍", hidden: true },
      { id: "registry", label: "Model Registry", x: 79, y: 29, w: 110, h: 28, icon: "📦", hidden: true },
      // CD Pipeline
      { id: "cfn", label: "CloudFormation Template", x: 94, y: 21, w: 160, h: 30, icon: "📜", hidden: true },
      // Serving
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
    "I established a highly resilient, multi-AZ container platform utilizing ECS Fargate. To meet enterprise security mandates, I decoupled the network perimeter using an Application Load Balancer behind AWS WAF, routing traffic to private subnets. Every container utilizes distinct IAM Task Execution roles, pulls configurations via VPC Endpoints from ECR and Secrets Manager, and encrypts ephemeral data via AWS KMS. The database tier utilizes a PostgreSQL Master-Replica architecture across Availability Zones for immediate failover capabilities.",
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
      // Edge
      { id: "dns", label: "Route 53", x: 11, y: 14, w: 80, h: 28, icon: "🌐", hidden: true },
      { id: "waf", label: "AWS WAF", x: 11, y: 22, w: 75, h: 28, icon: "🛡️" },
      { id: "alb", label: "Application Load Balancer", x: 11, y: 30, w: 155, h: 28, icon: "⚖️", hidden: true },
      // VPC Resources
      { id: "vpce", label: "VPC Endpoints (ECR, Secrets)", x: 40, y: 10, w: 170, h: 26, icon: "🔌" },
      { id: "kms", label: "AWS KMS (CMK)", x: 78, y: 10, w: 110, h: 26, icon: "🔑", hidden: true },
      // AZ A
      { id: "fargate_a", label: "Fargate Task (IAM Role)", x: 40, y: 24, w: 150, h: 30, icon: "📦", hidden: true },
      { id: "db_master", label: "PostgreSQL Master (KMS Encrypted)", x: 40, y: 36, w: 195, h: 30, icon: "🗄️", hidden: true },
      // AZ B
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
    "I architected an enterprise-scale MLOps platform enforcing strict boundary isolation across four AWS accounts (Development, Automation, Staging, Production) governed by Azure DevOps. The complexity involved managing cross-account IAM trusts and CMK KMS key sharing. Model training executed in the Automation account via SageMaker Pipelines. Once a model artifact was evaluated, registered, and approved, Amazon EventBridge triggered the deployment pipeline to provision Real-Time or Async Serverless Inference endpoints in the locked-down Production account.",
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
      // External
      { id: "azdevops", label: "Azure DevOps (CI/CD)", x: 8, y: 5, w: 140, h: 30, icon: "🔵" },
      // Dev Account
      { id: "studio", label: "SageMaker Studio (Notebooks)", x: 18, y: 27, w: 165, h: 30, icon: "💻", hidden: true },
      { id: "emr", label: "Amazon EMR", x: 18, y: 38, w: 100, h: 30, icon: "📊" },
      // Automation Account — Pipeline stages
      { id: "prep", label: "Prep", x: 38, y: 15, w: 60, h: 26, icon: "⚙️" },
      { id: "train", label: "Train", x: 46, y: 15, w: 60, h: 26, icon: "🧠", hidden: true },
      { id: "eval", label: "Eval", x: 54, y: 15, w: 55, h: 26, icon: "📊", hidden: true },
      { id: "register", label: "Register", x: 62, y: 15, w: 75, h: 26, icon: "📦", hidden: true },
      { id: "registry", label: "Model Registry", x: 49, y: 28, w: 110, h: 30, icon: "📁" },
      { id: "event", label: "Amazon EventBridge", x: 49, y: 38, w: 145, h: 30, icon: "📡", hidden: true },
      { id: "kms", label: "Cross-Account KMS (CMK)", x: 49, y: 48, w: 165, h: 30, icon: "🔑" },
      // Production Account
      { id: "api", label: "Amazon API Gateway", x: 81, y: 27, w: 145, h: 30, icon: "🚪", hidden: true },
      { id: "inference", label: "Real-Time / Serverless Endpoint", x: 81, y: 38, w: 190, h: 30, icon: "🚀" },
      // Security
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
