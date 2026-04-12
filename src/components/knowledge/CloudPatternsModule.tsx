import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Bot,
  BrainCircuit,
  ChevronRight,
  CloudCog,
  FlaskConical,
  Globe2,
  Layers3,
  LifeBuoy,
  Network,
  RadioTower,
  Receipt,
  ShieldAlert,
  Sparkles,
  TimerReset,
  TrafficCone,
  Waves,
} from "lucide-react";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const BLUE = "#2563EB";
const PURPLE = "#7C3AED";
const AMBER = "#D97706";
const RED = "#DC2626";

type Mode = "playful" | "principal";

type Concept = {
  id: string;
  title: string;
  eyebrow: string;
  icon: React.ReactNode;
  tag: string;
  danger: string;
  hook: string;
  playful: string;
  principal: string;
  whyItMatters: string;
  whatArchitectsDo: string[];
  portfolioLine: string;
  interviewAmmo: string;
  metricLabel: string;
  metricValue: string;
};

const CONCEPTS: Concept[] = [
  {
    id: "planes",
    title: "Control Plane vs Data Plane",
    eyebrow: "Two systems pretending to be one",
    icon: <CloudCog className="h-4 w-4" />,
    tag: "resilience",
    danger: "Control plane panics. Users should not.",
    hook: "If the dashboard explodes, your production traffic should still keep walking like nothing happened.",
    playful:
      "Think of it like a restaurant. The manager can lose the reservation iPad, but the kitchen should still be able to keep serving the burritos already in progress.",
    principal:
      "The control plane manages config, provisioning, and policy. The data plane serves live traffic. Mature systems let the data plane continue on last known good state when control operations degrade.",
    whyItMatters:
      "This is what separates a scary admin incident from a customer-facing outage.",
    whatArchitectsDo: [
      "Cache last-known-good config in the data plane.",
      "Deploy control-plane changes separately from traffic-serving runtime changes.",
      "Write separate failure assumptions, SLAs, and runbooks for each plane.",
    ],
    portfolioLine:
      "I wanted this section to feel like an outage simulator, not a textbook card grid.",
    interviewAmmo:
      "A healthy architecture lets operations lose editability before users lose availability.",
    metricLabel: "Traffic Survives",
    metricValue: "99.95%",
  },
  {
    id: "blast-radius",
    title: "Blast Radius Engineering",
    eyebrow: "Design the size of failure before the feature",
    icon: <ShieldAlert className="h-4 w-4" />,
    tag: "failure domains",
    danger: "One bad cell should not ruin everybody's lunch.",
    hook: "The question is not 'can it fail?' The question is 'how many people cry when it does?'",
    playful:
      "If your whole platform tips over because one service sneezed, that is not architecture. That is a haunted Jenga tower.",
    principal:
      "Principal-level systems define bounded failure domains through cells, bulkheads, shuffle sharding, and limits on dependency fan-out.",
    whyItMatters:
      "When systems fail, the winner is usually the company that contained the damage before the postmortem started.",
    whatArchitectsDo: [
      "Partition users or traffic into cells with isolated infrastructure.",
      "Separate resources by traffic class so low-priority load cannot starve critical paths.",
      "Quantify impact with numbers, not vibes: percent affected, latency hit, degraded behavior.",
    ],
    portfolioLine:
      "I turned this into a clickable 'which cell burns?' scene because the idea is visual, not abstract.",
    interviewAmmo:
      "Good architects do not just predict failure. They pre-shape its perimeter.",
    metricLabel: "Users Affected",
    metricValue: "12.5%",
  },
  {
    id: "saga",
    title: "Saga, Orchestration, and Recovery",
    eyebrow: "Distributed transactions without 2PC drama",
    icon: <Network className="h-4 w-4" />,
    tag: "consistency",
    danger: "Inventory says no. Payment already said yes.",
    hook: "Distributed systems are where 'undo' becomes a personality trait.",
    playful:
      "Three services walk into a bar. One commits, one charges a card, one discovers stock is gone. Suddenly everybody is doing apology choreography.",
    principal:
      "Sagas break a cross-service transaction into local commits with compensating actions. The hard part is not the happy path. It is choosing whether to retry, roll back, or move forward partially.",
    whyItMatters:
      "This is the difference between 'system recovered' and 'finance opens a spreadsheet with your name on it.'",
    whatArchitectsDo: [
      "Pick clear saga boundaries and explicit outcome states.",
      "Make compensating actions intentional instead of magical wishful thinking.",
      "Prefer visible process flow and observability over invisible event spaghetti.",
    ],
    portfolioLine:
      "I made the rollback animation loud on purpose because compensation should feel expensive.",
    interviewAmmo:
      "In distributed transactions, recovery design matters more than happy-path choreography.",
    metricLabel: "Compensations Fired",
    metricValue: "2 events",
  },
  {
    id: "tail-latency",
    title: "Tail Latency Amplification",
    eyebrow: "P99 is where optimism goes to die",
    icon: <TimerReset className="h-4 w-4" />,
    tag: "performance",
    danger: "One slow dependency ruins the composite request.",
    hook: "Your median latency is cute. Your tail latency is what ruins the demo.",
    playful:
      "Ninety-nine services are behaving. One service is doing yoga in the slow lane. Guess which one your users remember.",
    principal:
      "Fan-out systems are governed by the slow tail of downstream dependencies. Hedged requests, cancellation, and latency-class isolation are architectural tools, not micro-optimizations.",
    whyItMatters:
      "At scale, bad tails feel like random slowness to users and random panic to teams.",
    whatArchitectsDo: [
      "Watch composite latency, not just per-service averages.",
      "Use hedged requests only when downstream work is cancellable and idempotent.",
      "Separate fast paths from slow analytical or noisy-neighbor workloads.",
    ],
    portfolioLine:
      "This section behaves like a race because latency feels more obvious when you can see the straggler lose in public.",
    interviewAmmo:
      "Large fan-out turns single-service tail latency into a system-wide architecture problem.",
    metricLabel: "Composite P99",
    metricValue: "842ms",
  },
  {
    id: "exactly-once",
    title: "Exactly-Once Is a Fairy Tale",
    eyebrow: "Design for idempotency instead",
    icon: <Receipt className="h-4 w-4" />,
    tag: "messaging",
    danger: "The same message shows up wearing a fake moustache.",
    hook: "Messages get duplicated. Reality does not care about our branding.",
    playful:
      "The packet said, 'Trust me, I only came once.' The ledger said, 'That is what you said three times ago too.'",
    principal:
      "Real systems trade protocol guarantees for liveness and performance. The practical answer is idempotent processing with keys, conditional writes, and carefully bounded dedupe windows.",
    whyItMatters:
      "Without this, you do not have distributed architecture. You have surprise refunds and duplicate charges.",
    whatArchitectsDo: [
      "Attach unique idempotency keys to requests and events.",
      "Store processing outcome atomically with business effect when possible.",
      "Audit downstream side effects individually: email, billing, writes, and notifications all need their own protection.",
    ],
    portfolioLine:
      "I made the duplicate packet visible because hidden duplicates are exactly how expensive bugs look before finance finds them.",
    interviewAmmo:
      "Exactly-once delivery is less useful than exactly-once business outcome.",
    metricLabel: "Duplicates Dropped",
    metricValue: "3 / 4",
  },
  {
    id: "active-active",
    title: "Multi-Region Active-Active",
    eyebrow: "The CAP theorem with a customer support queue",
    icon: <Globe2 className="h-4 w-4" />,
    tag: "global systems",
    danger: "Two regions write. One truth has to win.",
    hook: "Active-active sounds glamorous until two regions confidently disagree at the same time.",
    playful:
      "Region A says the cart has tacos. Region B says the cart has nachos. The user says, 'Why not both?' Finance says, 'Absolutely not for bank transfers.'",
    principal:
      "Conflict resolution strategy is a product decision disguised as infrastructure. Some domains can merge with CRDT-style semantics. Others require optimistic locking, stronger coordination, or compensating flows.",
    whyItMatters:
      "Global availability is cheap to promise and painfully expensive to make correct.",
    whatArchitectsDo: [
      "Classify which operations tolerate eventual consistency and which do not.",
      "Choose merge semantics per domain instead of using one global rule everywhere.",
      "Measure cost of inconsistency in time and money, not just latency.",
    ],
    portfolioLine:
      "I framed this as a conflict board because users do not care about CAP terminology; they care whether their state makes sense.",
    interviewAmmo:
      "The right active-active design is determined by conflict cost, not architecture fashion.",
    metricLabel: "Conflict Window",
    metricValue: "30 sec",
  },
  {
    id: "chaos",
    title: "Chaos Engineering",
    eyebrow: "Architecture validation, not party tricks",
    icon: <FlaskConical className="h-4 w-4" />,
    tag: "validation",
    danger: "You do not know your system until you upset it politely.",
    hook: "Chaos is not 'break random stuff.' Chaos is 'prove your architecture story survives contact with reality.'",
    playful:
      "Anybody can say 'it should degrade gracefully.' Chaos engineering is where the system says, 'that is adorable.'",
    principal:
      "Useful chaos work starts with a written hypothesis, steady-state metrics, scoped blast radius, and the smallest fault needed to validate the assumption.",
    whyItMatters:
      "Most resilience plans are fiction until a failure shows whether the system agrees.",
    whatArchitectsDo: [
      "Write the hypothesis before the experiment.",
      "Measure steady state with explicit latency and error thresholds.",
      "Favor realistic network and dependency faults, not only process death.",
    ],
    portfolioLine:
      "I wanted this panel to feel like a lab notebook because chaos should look disciplined, not reckless.",
    interviewAmmo:
      "Chaos validates architecture assumptions; testing validates implementation behavior.",
    metricLabel: "Hypothesis Match",
    metricValue: "84%",
  },
  {
    id: "backpressure",
    title: "Backpressure and Adaptive Capacity",
    eyebrow: "How systems avoid retry-fueled self-destruction",
    icon: <Waves className="h-4 w-4" />,
    tag: "overload control",
    danger: "Queues grow. Retries pile on. Everything gets dramatic.",
    hook: "Overload is survivable. Retry storms with no backpressure are not.",
    playful:
      "The system is screaming 'I am full,' but the upstream caller keeps sending work like an aunt serving more food after you said no twice.",
    principal:
      "Overload-resistant systems propagate backpressure signals up the stack so offered load drops toward actual capacity. Without that signal, queueing and retries create death spirals.",
    whyItMatters:
      "Graceful degradation is usually just disciplined refusal instead of slow collapse.",
    whatArchitectsDo: [
      "Cap queues and reject work before latency becomes meaningless.",
      "Propagate load-shed signals upstream instead of hiding distress.",
      "Coordinate retry policy with concurrency and timeouts to avoid amplification.",
    ],
    portfolioLine:
      "I made the queue visually overflow because backpressure is easier to respect when you can watch the pipe jam in real time.",
    interviewAmmo:
      "A resilient system does not accept infinite work. It communicates limits early and consistently.",
    metricLabel: "Queue Depth",
    metricValue: "127 → 42",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

const TAG_COLORS: Record<string, string> = {
  resilience: COPPER,
  "failure domains": RED,
  consistency: PURPLE,
  performance: AMBER,
  messaging: BLUE,
  "global systems": "#0891B2",
  validation: "#059669",
  "overload control": "#DC2626",
};

/* ── Scene Components (light-themed) ─────────────────────── */

function Packet({
  color,
  x,
  y,
  duration = 1.6,
  delay = 0,
}: {
  color: string;
  x: number[];
  y: number[];
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute h-2.5 w-2.5 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
      animate={{ x, y, opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.85] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

function SceneBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}
    >
      {children}
    </div>
  );
}

function Scene({ conceptId, incidentMode }: { conceptId: string; incidentMode: boolean }) {
  const sceneLabel = (text: string, color: string = INK_MUTED) => (
    <div className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color }}>{text}</div>
  );

  switch (conceptId) {
    case "planes":
      return (
        <div className="flex flex-col gap-4 px-4 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-5" style={{ background: `${COPPER}06`, border: `1px solid ${COPPER}15` }}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  {sceneLabel("Control Plane", COPPER)}
                  <p className="font-mono text-xs" style={{ color: INK_MUTED }}>config · policy · provisioning</p>
                </div>
                <CloudCog className="h-5 w-5" style={{ color: COPPER }} />
              </div>
              <div className="space-y-2">
                {["Deploy config", "Change policy", "Rotate secrets"].map((item, i) => (
                  <motion.div
                    key={item}
                    className="rounded-lg border px-3 py-2 font-mono text-xs"
                    style={{
                      background: incidentMode && i === 1 ? `${RED}08` : `${INK}03`,
                      border: `1px solid ${incidentMode && i === 1 ? `${RED}30` : `${INK}08`}`,
                      color: incidentMode && i === 1 ? RED : INK,
                    }}
                    animate={incidentMode && i === 1 ? { x: [-2, 2, -2] } : { x: 0 }}
                    transition={{ repeat: incidentMode && i === 1 ? Infinity : 0, duration: 0.35 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-5" style={{ background: `${COPPER}04`, border: `1px solid ${COPPER}10` }}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  {sceneLabel("Data Plane", "#059669")}
                  <p className="font-mono text-xs" style={{ color: INK_MUTED }}>requests · traffic · real users</p>
                </div>
                <Activity className="h-5 w-5" style={{ color: "#059669" }} />
              </div>
              <div className="relative h-20 overflow-hidden rounded-lg" style={{ background: `${INK}04`, border: `1px solid ${INK}06` }}>
                <Packet color={COPPER} x={[-10, 260]} y={[20, 20]} />
                <Packet color={COPPER} x={[-10, 260]} y={[44, 44]} delay={0.6} />
                <Packet color={COPPER} x={[-10, 260]} y={[32, 32]} delay={1.1} />
                <div className="absolute left-2 top-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                  last known good config {incidentMode ? "active" : "cached"}
                </div>
              </div>
            </div>
          </div>

          {incidentMode && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border p-4 font-mono text-xs leading-relaxed"
              style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}20`, color: AMBER }}>
              Control plane is coughing loudly. Data plane keeps serving on cached state. Users remain blissfully unaware.
            </motion.div>
          )}
        </div>
      );

    case "blast-radius":
      return (
        <div className="relative grid gap-4 px-4 md:px-8 md:grid-cols-3">
          {[1, 2, 3].map((cell) => {
            const hit = incidentMode && cell === 2;
            return (
              <motion.div key={cell}
                animate={hit ? { y: [-2, 2, -2] } : { y: 0 }}
                transition={{ repeat: hit ? Infinity : 0, duration: 0.35 }}
                className="rounded-xl border p-4"
                style={{
                  background: hit ? `${RED}06` : `${INK}03`,
                  border: `1px solid ${hit ? `${RED}25` : `${INK}08`}`,
                }}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    {sceneLabel(`Cell ${cell}`, hit ? RED : INK_MUTED)}
                    <p className="font-mono text-[10px]" style={{ color: INK_MUTED }}>users, compute, db</p>
                  </div>
                  <Layers3 className="h-4 w-4" style={{ color: hit ? RED : INK_MUTED }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg border px-2 py-3 text-center font-mono text-[10px]"
                      style={{
                        background: hit && i > 1 ? `${RED}08` : `${INK}03`,
                        border: `1px solid ${hit && i > 1 ? `${RED}20` : `${INK}06`}`,
                        color: hit && i > 1 ? RED : INK_MUTED,
                      }}>
                      svc-{cell}.{i + 1}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
          {incidentMode && (
            <div className="absolute bottom-2 left-4 right-4 rounded-xl border p-3 font-mono text-xs"
              style={{ background: `${COPPER}08`, border: `1px solid ${COPPER}20`, color: COPPER }}>
              Only one cell is on fire. Everybody else still gets to keep their weekend.
            </div>
          )}
        </div>
      );

    case "saga":
      return (
        <div className="relative flex flex-col items-center justify-center px-6 py-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] mb-6" style={{ color: INK_MUTED }}>order pipeline</div>
          <div className="rounded-xl border px-5 py-2 mb-8 font-mono text-xs"
            style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}15`, color: PURPLE }}>
            <BrainCircuit className="h-3.5 w-3.5 inline mr-2" />Orchestrator — keeps receipts
          </div>
          <div className="flex w-full max-w-md items-center justify-between relative">
            {["Order", "Payment", "Inventory"].map((name, i) => {
              const failed = incidentMode && i === 2;
              const compensating = incidentMode && i < 2;
              const color = failed ? RED : compensating ? AMBER : COPPER;
              return (
                <div key={name} className="flex flex-col items-center">
                  <motion.div
                    animate={failed ? { x: [-2, 2, -2] } : { x: 0 }}
                    transition={{ repeat: failed ? Infinity : 0, duration: 0.35 }}
                    className="flex h-20 w-20 items-center justify-center rounded-xl border font-mono text-xs font-medium"
                    style={{ background: `${color}08`, border: `1px solid ${color}20`, color }}>
                    {name}
                  </motion.div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-wider" style={{ color }}>
                    {failed ? "failed" : compensating ? "compensating" : "committed"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "tail-latency":
      return (
        <div className="flex flex-col justify-center px-4 md:px-8">
          {sceneLabel("fan-out request race")}
          <div className="grid gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => {
              const slow = incidentMode && i === 6;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-16 font-mono text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>svc-{i + 1}</div>
                  <div className="h-3.5 flex-1 overflow-hidden rounded-full" style={{ background: `${INK}06` }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: slow ? RED : COPPER }}
                      animate={{ width: slow ? "92%" : `${28 + i * 6}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                  <div className="w-14 text-right font-mono text-xs font-medium" style={{ color: slow ? RED : INK_MUTED }}>
                    {slow ? "811ms" : `${40 + i * 9}ms`}
                  </div>
                </div>
              );
            })}
          </div>
          {incidentMode && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-xl border p-4 font-mono text-xs leading-relaxed"
              style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}15`, color: BLUE }}>
              One straggler dominates the composite experience. This is why teams end up talking about hedging, cancellation, and fast-path isolation.
            </motion.div>
          )}
        </div>
      );

    case "exactly-once":
      return (
        <div className="flex items-center justify-center px-4 md:px-6">
          <div className="grid w-full max-w-2xl gap-4 md:grid-cols-[1fr_140px_1fr]">
            <div className="rounded-xl border p-4" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
              {sceneLabel("inbox")}
              <div className="relative h-28 overflow-hidden rounded-lg" style={{ background: `${INK}04`, border: `1px solid ${INK}06` }}>
                <Packet color={PURPLE} x={[-10, 160]} y={[20, 20]} />
                <Packet color={PURPLE} x={[-10, 160]} y={[50, 50]} delay={0.5} />
                {incidentMode && <Packet color={RED} x={[-10, 160]} y={[80, 80]} delay={0.2} />}
                {incidentMode && <Packet color={RED} x={[-10, 160]} y={[80, 80]} delay={0.8} />}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4"
              style={{ background: `${COPPER}06`, border: `1px solid ${COPPER}15` }}>
              <Receipt className="h-6 w-6" style={{ color: COPPER }} />
              <div className="font-mono text-[9px] uppercase tracking-wider text-center" style={{ color: COPPER }}>idempotency ledger</div>
              <div className="rounded-lg border px-2 py-1.5 font-mono text-[10px] text-center"
                style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }}>
                msg-1042 ✓
              </div>
              {incidentMode && (
                <div className="rounded-lg border px-2 py-1.5 font-mono text-[10px] text-center"
                  style={{ background: `${RED}06`, border: `1px solid ${RED}15`, color: RED }}>
                  msg-1042 dup
                </div>
              )}
            </div>

            <div className="rounded-xl border p-4" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
              {sceneLabel("business outcome")}
              <div className="grid gap-2">
                {[
                  incidentMode ? "Charge card once" : "Charge card",
                  incidentMode ? "Send email once" : "Send email",
                  incidentMode ? "Write order once" : "Write order",
                ].map((item) => (
                  <div key={item} className="rounded-lg border px-3 py-2 font-mono text-xs"
                    style={{ background: `${INK}03`, border: `1px solid ${INK}06`, color: INK }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "active-active":
      return (
        <div className="flex items-center justify-center px-4 md:px-6">
          <div className="grid w-full max-w-2xl gap-4 md:grid-cols-[1fr_100px_1fr]">
            {[
              { name: "Region A", color: BLUE, note: incidentMode ? "cart + tacos" : "cart synced" },
              { name: "Region B", color: incidentMode ? RED : COPPER, note: incidentMode ? "cart + nachos" : "cart synced" },
            ].map((region) => (
              <div key={region.name} className="rounded-xl border p-4"
                style={{ background: `${region.color}06`, border: `1px solid ${region.color}15` }}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    {sceneLabel(region.name, region.color)}
                    <p className="font-mono text-[10px]" style={{ color: INK_MUTED }}>nearest users write here</p>
                  </div>
                  <Globe2 className="h-4 w-4" style={{ color: region.color }} />
                </div>
                <div className="rounded-lg border px-3 py-5 text-center font-mono text-xs font-medium"
                  style={{ background: `${INK}03`, border: `1px solid ${INK}06`, color: INK }}>
                  {region.note}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center">
              <motion.div
                animate={incidentMode ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
                transition={{ repeat: incidentMode ? Infinity : 0, duration: 1.2 }}
                className="rounded-xl border px-3 py-4 text-center font-mono text-[10px] uppercase tracking-wider"
                style={{
                  background: incidentMode ? `${AMBER}08` : `${INK}03`,
                  border: `1px solid ${incidentMode ? `${AMBER}20` : `${INK}08`}`,
                  color: incidentMode ? AMBER : INK_MUTED,
                }}>
                {incidentMode ? "conflict" : "replication"}
              </motion.div>
            </div>
          </div>
        </div>
      );

    case "chaos":
      return (
        <div className="grid gap-4 px-4 md:px-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border p-5" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                {sceneLabel("steady state")}
                <p className="font-mono text-xs" style={{ color: INK_MUTED }}>p99 &lt; 200ms · error rate &lt; 0.1%</p>
              </div>
              <Bot className="h-4 w-4" style={{ color: INK_MUTED }} />
            </div>
            <div className="grid gap-3">
              {["latency", "error", "saturation"].map((item, i) => (
                <div key={item}>
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: INK_MUTED }}>{item}</div>
                  <div className="h-3 rounded-full" style={{ background: `${INK}06` }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: incidentMode && i === 1 ? RED : COPPER }}
                      animate={{ width: incidentMode && i === 1 ? "76%" : `${30 + i * 9}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}15` }}>
            {sceneLabel("hypothesis", PURPLE)}
            <div className="rounded-lg border p-3 font-mono text-xs leading-relaxed"
              style={{ background: `${INK}03`, border: `1px solid ${INK}06`, color: INK }}>
              {incidentMode
                ? "If network latency spikes between services, retries should stay bounded and customer-facing latency should degrade but remain within tolerance."
                : "If AZ-B disappears, Cell 2 should degrade locally while other cells continue serving normally."}
            </div>
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: PURPLE }}>
              <FlaskConical className="h-3.5 w-3.5" />
              {incidentMode ? "fault injected" : "ready to validate"}
            </div>
          </div>
        </div>
      );

    case "backpressure":
      return (
        <div className="flex items-center justify-center px-4 md:px-6">
          <div className="grid w-full max-w-3xl gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4" style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}15` }}>
              {sceneLabel("incoming traffic", BLUE)}
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div key={i} className="h-2.5 rounded-full" style={{ background: BLUE }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
              {sceneLabel("queue")}
              <div className="flex h-32 items-end gap-1.5 rounded-lg border p-2"
                style={{ background: `${INK}04`, border: `1px solid ${INK}06` }}>
                {Array.from({ length: incidentMode ? 9 : 5 }).map((_, i) => (
                  <motion.div key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${28 + (i % 4) * 14}px` }}
                    className="w-full rounded-t"
                    style={{ background: incidentMode && i > 6 ? RED : AMBER }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ background: `${COPPER}06`, border: `1px solid ${COPPER}15` }}>
              {sceneLabel("backpressure signal", COPPER)}
              <div className="flex h-32 flex-col items-center justify-center rounded-lg border"
                style={{ background: `${INK}04`, border: `1px solid ${INK}06` }}>
                <motion.div
                  animate={incidentMode ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="rounded-full border px-4 py-3 font-mono text-[10px] uppercase tracking-wider"
                  style={{
                    background: incidentMode ? `${COPPER}10` : `${INK}04`,
                    border: `1px solid ${incidentMode ? `${COPPER}25` : `${INK}08`}`,
                    color: incidentMode ? COPPER : INK_MUTED,
                  }}>
                  {incidentMode ? "slow down" : "stable flow"}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ── Main Component ──────────────────────────────────────── */

export default function CloudPatternsModule({ onBack }: { onBack?: () => void }) {
  const [activeId, setActiveId] = useState(CONCEPTS[0].id);
  const [mode, setMode] = useState<Mode>("playful");
  const [incidentMode, setIncidentMode] = useState(false);

  const active = useMemo(
    () => CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0],
    [activeId],
  );

  const explanation = mode === "playful" ? active.playful : active.principal;
  const tagColor = TAG_COLORS[active.tag] ?? COPPER;

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8" style={{ background: "#F8FAFC" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
                style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
              <Sparkles className="h-3 w-3" style={{ color: BLUE }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: BLUE }}>
                Incident Simulator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${INK}10` }}>
              {([["playful", "Fun mode"], ["principal", "Deep mode"]] as const).map(([value, label]) => (
                <button key={value} onClick={() => setMode(value)}
                  className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all"
                  style={{
                    background: mode === value ? `${BLUE}10` : "transparent",
                    color: mode === value ? BLUE : INK_MUTED,
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Incident toggle */}
            <button onClick={() => setIncidentMode((c) => !c)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all"
              style={{
                background: incidentMode ? `${RED}08` : `${COPPER}08`,
                border: `1px solid ${incidentMode ? `${RED}20` : `${COPPER}15`}`,
                color: incidentMode ? RED : COPPER,
              }}>
              {incidentMode ? <TrafficCone className="h-3.5 w-3.5" /> : <LifeBuoy className="h-3.5 w-3.5" />}
              {incidentMode ? "Restore" : "Trigger incident"}
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <div className="rounded-xl border p-6 md:p-8" style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}20` }}>
                ☁️ distributed systems panic room
              </span>
              <span className="font-mono text-[10px]" style={{ color: INK_MUTED }}>
                8 concepts · interactive
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: INK }}>
              Cloud Architecture — The Incident Simulator
            </h1>
            <p className="font-mono text-xs leading-relaxed max-w-2xl" style={{ color: INK_MUTED }}>
              Instead of dumping architecture jargon into cards, this tells the story like production is slightly on fire
              and you are the adult in the room. Each concept gets a live scene, a plain-English translation,
              and a portfolio-ready takeaway.
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_280px]">

          {/* Sidebar */}
          <aside className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: INK_MUTED }}>mission board</span>
              <RadioTower className="h-3.5 w-3.5" style={{ color: INK_MUTED }} />
            </div>
            {CONCEPTS.map((concept, index) => {
              const isActive = concept.id === activeId;
              const cTag = TAG_COLORS[concept.tag] ?? COPPER;
              return (
                <button key={concept.id}
                  onClick={() => { setActiveId(concept.id); setIncidentMode(false); }}
                  className="w-full rounded-xl border p-3 text-left transition-all"
                  style={{
                    background: isActive ? `${BLUE}06` : `${INK}02`,
                    border: `1px solid ${isActive ? `${BLUE}20` : `${INK}06`}`,
                  }}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
                      style={{ background: `${cTag}10`, color: cTag }}>
                      {concept.icon}
                    </div>
                    <span className="font-mono text-[9px]" style={{ color: INK_MUTED }}>0{index + 1}</span>
                  </div>
                  <div className="font-display text-xs font-semibold" style={{ color: INK }}>{concept.title}</div>
                  <div className="font-mono text-[9px] mt-0.5 leading-relaxed" style={{ color: INK_MUTED }}>{concept.eyebrow}</div>
                </button>
              );
            })}
          </aside>

          {/* Center: Scene + Explanation */}
          <main className="flex flex-col rounded-xl overflow-hidden" style={{ border: `1px solid ${INK}08` }}>
            {/* Scene */}
            <div className="flex-1 min-h-[320px] py-6" style={{ background: `${INK}02` }}>
              <Scene conceptId={activeId} incidentMode={incidentMode} />
            </div>

            {/* Explanation */}
            <div className="border-t p-5 md:p-6" style={{ background: `${INK}03`, borderColor: `${INK}06` }}>
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="h-3.5 w-3.5" style={{ color: BLUE }} />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: BLUE }}>
                  {mode === "playful" ? "The Sandbox Translation" : "The Principal Translation"}
                </span>
              </div>
              <p className="font-mono text-xs leading-relaxed mb-5" style={{ color: INK }}>
                {explanation}
              </p>

              {/* What Architects Do */}
              <div className="border-t pt-4" style={{ borderColor: `${INK}06` }}>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] mb-3 block" style={{ color: COPPER }}>
                  What Architects Actually Do
                </span>
                <ul className="grid gap-2">
                  {active.whatArchitectsDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 rounded-lg border p-3 font-mono text-xs leading-relaxed"
                      style={{ background: `${INK}02`, border: `1px solid ${INK}06`, color: INK }}>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: COPPER }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </main>

          {/* Right sidebar: Ammo Cards */}
          <aside className="space-y-4">
            {/* Stats */}
            <div className="rounded-xl border p-4" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
              <span className="font-mono text-[9px] uppercase tracking-wider block mb-1" style={{ color: INK_MUTED }}>
                {active.metricLabel}
              </span>
              <span className="font-display text-xl font-bold" style={{ color: BLUE }}>{active.metricValue}</span>
            </div>

            {/* Tag */}
            <div className="rounded-xl border p-4" style={{ background: `${tagColor}06`, border: `1px solid ${tagColor}15` }}>
              <span className="font-mono text-[9px] uppercase tracking-wider block mb-1" style={{ color: tagColor }}>
                Category
              </span>
              <span className="font-mono text-xs font-medium" style={{ color: INK }}>{active.tag}</span>
            </div>

            {/* Hook */}
            <div className="rounded-xl border p-4" style={{ background: `${PURPLE}04`, border: `1px solid ${PURPLE}12` }}>
              <span className="font-mono text-[9px] uppercase tracking-wider block mb-2" style={{ color: PURPLE }}>The Hook</span>
              <p className="font-mono text-xs leading-relaxed" style={{ color: INK }}>{active.hook}</p>
            </div>

            {/* Why It Matters */}
            <div className="rounded-xl border p-4" style={{ background: `${COPPER}04`, border: `1px solid ${COPPER}12` }}>
              <span className="font-mono text-[9px] uppercase tracking-wider block mb-2" style={{ color: COPPER }}>Why It Matters</span>
              <p className="font-mono text-xs leading-relaxed" style={{ color: INK }}>{active.whyItMatters}</p>
            </div>

            {/* Interview Ammo */}
            <div className="rounded-xl border p-4" style={{ background: `${BLUE}04`, border: `1px solid ${BLUE}12` }}>
              <span className="font-mono text-[9px] uppercase tracking-wider block mb-2" style={{ color: BLUE }}>Interview Ammo</span>
              <p className="font-mono text-xs leading-relaxed italic border-l-2 pl-3 py-1"
                style={{ color: INK, borderColor: `${BLUE}40` }}>
                "{active.interviewAmmo}"
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
