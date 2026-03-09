import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { brandLogos } from "@/data/brandLogos";
import ArchDiagramPuzzle, { type DiagramPuzzleData } from "@/components/puzzles/ArchDiagramPuzzle";
import ReadOnlyDiagram from "@/components/puzzles/ReadOnlyDiagram";
import { 
  aiRagDiagram, 
  apiGatewayDiagram, 
  cicdRunnersDiagram,
  mlOpsPipelineDiagram,
  haContainerDiagram,
  multiAccountMlOpsDiagram
} from "@/data/careerDiagrams";

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

/* ═══════════════════════════════════════════════════════════
   Diagrams imported from src/data/careerDiagrams.ts
   ═══════════════════════════════════════════════════════════ */


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
  const puzzleStops = stops.filter(s => s.diagramPuzzle);
  const allSolved = puzzleStops.length > 0 && solvedStops.size === puzzleStops.length;

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
                {stop.diagramPuzzle && (
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
                )}
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

                    {/* Read-only architecture diagram */}
                    {stop.diagramPuzzle && (
                      <div className="mt-4">
                        <ReadOnlyDiagram
                          diagram={stop.diagramPuzzle.diagram}
                          color={stop.color}
                          title={stop.diagramPuzzle.projectName}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : stop.diagramPuzzle ? (
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
            ) : null}

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
