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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Packet({
  className,
  x,
  y,
  duration = 1.6,
  delay = 0,
}: {
  className: string;
  x: number[];
  y: number[];
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("absolute h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]", className)}
      animate={{ x, y, opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.85] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className={cn("text-xl font-semibold", accent)}>{value}</div>
    </div>
  );
}

function Scene({ conceptId, incidentMode }: { conceptId: string; incidentMode: boolean }) {
  switch (conceptId) {
    case "planes":
      return (
        <div className="relative flex h-full w-full flex-col justify-center gap-8 px-4 md:px-10">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-300">Control Plane</div>
                  <div className="mt-1 text-sm text-slate-300">config • policy • provisioning</div>
                </div>
                <CloudCog className="h-6 w-6 text-cyan-300" />
              </div>
              <div className="space-y-2">
                {["Deploy config", "Change policy", "Rotate secrets"].map((item, i) => (
                  <motion.div
                    key={item}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm",
                      incidentMode && i === 1
                        ? "border-rose-400/50 bg-rose-500/20 text-rose-100"
                        : "border-white/10 bg-white/5 text-slate-200",
                    )}
                    animate={incidentMode && i === 1 ? { x: [-3, 3, -3] } : { x: 0 }}
                    transition={{ repeat: incidentMode && i === 1 ? Infinity : 0, duration: 0.35 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">Data Plane</div>
                  <div className="mt-1 text-sm text-slate-300">requests • traffic • real users</div>
                </div>
                <Activity className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="relative h-24 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
                <Packet className="bg-emerald-300 text-emerald-300" x={[-10, 280]} y={[26, 26]} />
                <Packet className="bg-emerald-300 text-emerald-300" x={[-10, 280]} y={[58, 58]} delay={0.6} />
                <Packet className="bg-emerald-300 text-emerald-300" x={[-10, 280]} y={[42, 42]} delay={1.1} />
                <div className="absolute left-3 top-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  last known good config {incidentMode ? "active" : "cached"}
                </div>
              </div>
            </div>
          </div>

          {incidentMode && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100"
            >
              Control plane is coughing loudly. Data plane keeps serving on cached state. Users remain blissfully unaware.
            </motion.div>
          )}
        </div>
      );

    case "blast-radius":
      return (
        <div className="relative grid h-full w-full gap-4 p-4 md:grid-cols-3 md:p-8">
          {[1, 2, 3].map((cell) => {
            const hit = incidentMode && cell === 2;
            return (
              <motion.div
                key={cell}
                animate={hit ? { y: [-2, 2, -2] } : { y: 0 }}
                transition={{ repeat: hit ? Infinity : 0, duration: 0.35 }}
                className={cn(
                  "rounded-3xl border p-5",
                  hit
                    ? "border-rose-400/60 bg-rose-500/10"
                    : "border-white/10 bg-white/5",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Cell {cell}</div>
                    <div className="mt-1 text-sm text-slate-200">users, compute, db</div>
                  </div>
                  <Layers3 className={cn("h-5 w-5", hit ? "text-rose-300" : "text-slate-300")} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-xl border px-3 py-4 text-center text-xs",
                        hit && i > 1
                          ? "border-rose-400/50 bg-rose-500/20 text-rose-100"
                          : "border-white/10 bg-slate-950/40 text-slate-300",
                      )}
                    >
                      svc-{cell}.{i + 1}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
          {incidentMode && (
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              Only one cell is on fire. Everybody else still gets to keep their weekend.
            </div>
          )}
        </div>
      );

    case "saga":
      return (
        <div className="relative flex h-full w-full items-center justify-center px-6">
          <div className="absolute top-6 text-[10px] uppercase tracking-[0.3em] text-slate-500">order pipeline</div>
          <div className="relative flex w-full max-w-3xl items-center justify-between">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-16 rounded-2xl border border-fuchsia-400/40 bg-fuchsia-500/10 px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">Orchestrator</div>
              <div className="mt-1 text-sm text-slate-200">keeps receipts</div>
            </div>
            {["Order", "Payment", "Inventory"].map((name, i) => {
              const failed = incidentMode && i === 2;
              const compensating = incidentMode && i < 2;
              return (
                <div key={name} className="relative flex flex-col items-center">
                  <motion.div
                    animate={failed ? { x: [-2, 2, -2] } : { x: 0 }}
                    transition={{ repeat: failed ? Infinity : 0, duration: 0.35 }}
                    className={cn(
                      "flex h-24 w-24 items-center justify-center rounded-3xl border text-center text-sm",
                      failed
                        ? "border-rose-400/60 bg-rose-500/10 text-rose-100"
                        : compensating
                          ? "border-amber-400/50 bg-amber-500/10 text-amber-100"
                          : "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
                    )}
                  >
                    {name}
                  </motion.div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    {failed ? "failed" : compensating ? "compensating" : "committed"}
                  </div>
                </div>
              );
            })}

            {!incidentMode && (
              <>
                <Packet className="bg-cyan-300 text-cyan-300" x={[70, 260]} y={[0, 0]} />
                <Packet className="bg-cyan-300 text-cyan-300" x={[310, 500]} y={[0, 0]} delay={0.8} />
              </>
            )}

            {incidentMode && (
              <>
                <Packet className="bg-amber-300 text-amber-300" x={[500, 310]} y={[0, 0]} />
                <Packet className="bg-amber-300 text-amber-300" x={[260, 70]} y={[0, 0]} delay={0.8} />
              </>
            )}
          </div>
        </div>
      );

    case "tail-latency":
      return (
        <div className="flex h-full w-full flex-col justify-center px-6 md:px-10">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-500">fan-out request race</div>
          <div className="grid gap-3">
            {Array.from({ length: 8 }).map((_, i) => {
              const slow = incidentMode && i === 6;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 text-xs uppercase tracking-[0.2em] text-slate-500">svc-{i + 1}</div>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className={cn("h-full rounded-full", slow ? "bg-rose-400" : "bg-cyan-300")}
                      animate={{ width: slow ? "92%" : `${28 + i * 6}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                  <div className={cn("w-16 text-right text-sm", slow ? "text-rose-200" : "text-slate-300")}>
                    {slow ? "811ms" : `${40 + i * 9}ms`}
                  </div>
                </div>
              );
            })}
          </div>
          {incidentMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-cyan-100"
            >
              One straggler dominates the composite experience. This is why teams end up talking about hedging, cancellation, and fast-path isolation.
            </motion.div>
          )}
        </div>
      );

    case "exactly-once":
      return (
        <div className="relative flex h-full w-full items-center justify-center px-6">
          <div className="grid w-full max-w-3xl gap-6 md:grid-cols-[1fr_180px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">inbox</div>
              <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
                <Packet className="bg-fuchsia-300 text-fuchsia-300" x={[-10, 180]} y={[24, 24]} />
                <Packet className="bg-fuchsia-300 text-fuchsia-300" x={[-10, 180]} y={[58, 58]} delay={0.5} />
                {incidentMode && <Packet className="bg-rose-300 text-rose-300" x={[-10, 180]} y={[92, 92]} delay={0.2} />}
                {incidentMode && <Packet className="bg-rose-300 text-rose-300" x={[-10, 180]} y={[92, 92]} delay={0.8} />}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
              <Receipt className="h-8 w-8 text-emerald-300" />
              <div className="text-center text-xs uppercase tracking-[0.24em] text-emerald-200">idempotency ledger</div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-center text-sm text-slate-200">
                msg-1042 ✓
              </div>
              {incidentMode && (
                <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-center text-sm text-slate-200">
                  msg-1042 duplicate
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">business outcome</div>
              <div className="grid gap-3">
                {[
                  incidentMode ? "Charge card once" : "Charge card",
                  incidentMode ? "Send email once" : "Send email",
                  incidentMode ? "Write order once" : "Write order",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
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
        <div className="relative flex h-full w-full items-center justify-center px-6">
          <div className="grid w-full max-w-3xl gap-4 md:grid-cols-[1fr_120px_1fr]">
            {[
              { name: "Region A", color: "cyan", note: incidentMode ? "cart + tacos" : "cart synced" },
              { name: "Region B", color: incidentMode ? "rose" : "emerald", note: incidentMode ? "cart + nachos" : "cart synced" },
            ].map((region) => (
              <div
                key={region.name}
                className={cn(
                  "rounded-3xl border p-5",
                  region.color === "rose"
                    ? "border-rose-400/50 bg-rose-500/10"
                    : region.color === "emerald"
                      ? "border-emerald-400/50 bg-emerald-500/10"
                      : "border-cyan-400/50 bg-cyan-500/10",
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-300">{region.name}</div>
                    <div className="mt-1 text-sm text-slate-200">nearest users write here</div>
                  </div>
                  <Globe2 className="h-5 w-5 text-slate-200" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-6 text-center text-sm text-slate-100">
                  {region.note}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center">
              <motion.div
                animate={incidentMode ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
                transition={{ repeat: incidentMode ? Infinity : 0, duration: 1.2 }}
                className={cn(
                  "rounded-2xl border px-4 py-5 text-center text-xs uppercase tracking-[0.22em]",
                  incidentMode
                    ? "border-amber-400/50 bg-amber-500/10 text-amber-100"
                    : "border-white/10 bg-white/5 text-slate-300",
                )}
              >
                {incidentMode ? "conflict" : "replication"}
              </motion.div>
            </div>
          </div>
        </div>
      );

    case "chaos":
      return (
        <div className="grid h-full w-full gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">steady state</div>
                <div className="mt-1 text-sm text-slate-200">p99 &lt; 200ms • error rate &lt; 0.1%</div>
              </div>
              <Bot className="h-5 w-5 text-slate-300" />
            </div>
            <div className="grid gap-3">
              {["latency", "error", "saturation"].map((item, i) => (
                <div key={item}>
                  <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item}</div>
                  <div className="h-3 rounded-full bg-slate-950/50">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        incidentMode && i === 1 ? "bg-rose-400" : "bg-emerald-400",
                      )}
                      animate={{ width: incidentMode && i === 1 ? "76%" : `${30 + i * 9}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-5">
            <div className="mb-4 text-xs uppercase tracking-[0.24em] text-fuchsia-200">hypothesis</div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-100">
              {incidentMode
                ? "If network latency spikes between services, retries should stay bounded and customer-facing latency should degrade but remain within tolerance."
                : "If AZ-B disappears, Cell 2 should degrade locally while other cells continue serving normally."}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-fuchsia-100">
              <FlaskConical className="h-4 w-4" />
              {incidentMode ? "fault injected" : "ready to validate"}
            </div>
          </div>
        </div>
      );

    case "backpressure":
      return (
        <div className="relative flex h-full w-full items-center justify-center px-6">
          <div className="grid w-full max-w-4xl gap-4 md:grid-cols-[1fr_1fr_1fr]">
            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-200">incoming traffic</div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-3 rounded-full bg-cyan-300"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">queue</div>
              <div className="flex h-40 items-end gap-2 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                {Array.from({ length: incidentMode ? 9 : 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${28 + (i % 4) * 14}px` }}
                    className={cn(
                      "w-full rounded-t-md",
                      incidentMode && i > 6 ? "bg-rose-400" : "bg-amber-300",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-emerald-200">backpressure signal</div>
              <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50">
                <motion.div
                  animate={incidentMode ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className={cn(
                    "rounded-full border px-5 py-4 text-sm uppercase tracking-[0.2em]",
                    incidentMode
                      ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100"
                      : "border-white/10 bg-white/5 text-slate-300",
                  )}
                >
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

export default function DistributedSystemsPanicRoom({ onBack }: { onBack?: () => void }) {
  const [activeId, setActiveId] = useState(CONCEPTS[0].id);
  const [mode, setMode] = useState<Mode>("playful");
  const [incidentMode, setIncidentMode] = useState(false);

  const active = useMemo(
    () => CONCEPTS.find((concept) => concept.id === activeId) ?? CONCEPTS[0],
    [activeId],
  );

  const explanation = mode === "playful" ? active.playful : active.principal;

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 h-full overflow-y-auto">
      <div className="relative overflow-hidden min-h-full">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(192,132,252,0.16),transparent_22%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.14),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-10">
          
          {/* Header Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                portfolio lab
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                {([
                  ["playful", "Fun mode"],
                  ["principal", "Deep mode"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm transition",
                      mode === value
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-white/10",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIncidentMode((current) => !current)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                  incidentMode
                    ? "border-rose-400/40 bg-rose-500/15 text-rose-100 hover:bg-rose-500/20"
                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15",
                )}
              >
                {incidentMode ? <TrafficCone className="h-4 w-4" /> : <LifeBuoy className="h-4 w-4" />}
                {incidentMode ? "Restore system" : "Trigger incident"}
              </button>
            </div>
          </div>

          {/* Hero Intro */}
          <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-fuchsia-200">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  distributed systems panic room
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  eight concepts • one interactive story
                </div>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                I rewired this from a boring pattern catalog into a tiny incident simulator.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                Instead of dumping architecture jargon into cards, this version tells the story like production is slightly on fire and you are the adult in the room.
                Each concept gets a live scene, a plain-English translation, a principal-level explanation, and a portfolio-ready takeaway.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                {[
                  "funny but credible",
                  "interactive instead of static",
                  "good for portfolio storytelling",
                  "feels like a product, not homework",
                ].map((item) => (
                  <div key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard label="Active Concept" value={active.title} accent="text-cyan-200" />
              <StatCard label={active.metricLabel} value={active.metricValue} accent="text-emerald-200" />
            </div>
          </div>

          {/* Main 3-Column Layout */}
          <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)_340px]">
            
            {/* Column 1: Sidebar Navigation */}
            <aside className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-md h-fit">
              <div className="mb-3 flex items-center justify-between px-3 pt-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">mission board</div>
                  <div className="mt-1 text-sm text-slate-300">Pick a concept, then break it safely.</div>
                </div>
                <RadioTower className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-2">
                {CONCEPTS.map((concept, index) => {
                  const activeCard = concept.id === activeId;
                  return (
                    <button
                      key={concept.id}
                      onClick={() => {
                        setActiveId(concept.id);
                        setIncidentMode(false);
                      }}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition",
                        activeCard
                          ? "border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.18)]"
                          : "border-white/10 bg-black/10 hover:bg-white/5",
                      )}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100">
                          {concept.icon}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">0{index + 1}</div>
                      </div>
                      <div className="text-sm font-medium text-white">{concept.title}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-400">{concept.eyebrow}</div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Column 2: Interactive Scene & Explanation */}
            <main className="flex min-h-[550px] flex-col rounded-[28px] border border-white/10 bg-[#0B1120] overflow-hidden">
              <div className="flex-1 relative py-8">
                <Scene conceptId={activeId} incidentMode={incidentMode} />
              </div>
              <div className="border-t border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <BrainCircuit className="h-4 w-4" />
                  {mode === "playful" ? "The Sandbox Translation" : "The Principal Translation"}
                </div>
                <p className="text-base leading-relaxed text-slate-200">
                  {explanation}
                </p>
                
                {/* What Architects Do */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="mb-4 text-xs uppercase tracking-[0.2em] text-cyan-400">What Architects Actually Do</div>
                  <ul className="grid gap-3 sm:grid-cols-1">
                    {active.whatArchitectsDo.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <ChevronRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </main>

            {/* Column 3: The Ammo Cards */}
            <aside className="space-y-4 h-fit">
              <div className="rounded-[28px] border border-fuchsia-500/20 bg-fuchsia-500/5 p-6 backdrop-blur-md">
                <div className="mb-3 text-xs uppercase tracking-[0.2em] text-fuchsia-400">The Hook</div>
                <div className="text-sm leading-relaxed text-fuchsia-100">{active.hook}</div>
              </div>
              <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md">
                <div className="mb-3 text-xs uppercase tracking-[0.2em] text-emerald-400">Why It Matters</div>
                <div className="text-sm leading-relaxed text-emerald-100">{active.whyItMatters}</div>
              </div>
              <div className="rounded-[28px] border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-md">
                <div className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-400">Interview Ammo</div>
                <div className="text-sm font-medium leading-relaxed text-cyan-100 border-l-2 border-cyan-500/50 pl-4 py-1 italic">
                  "{active.interviewAmmo}"
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}
