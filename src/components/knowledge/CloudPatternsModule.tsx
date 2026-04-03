import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  BrainCircuit,
  ChevronRight,
  CloudCog,
  FlaskConical,
  Globe2,
  Layers3,
  LifeBuoy,
  Network,
  Receipt,
  ShieldAlert,
  Sparkles,
  TimerReset,
  TrafficCone,
  Waves,
  Zap,
} from "lucide-react";

type Mode = "playful" | "principal";

type Concept = {
  id: string;
  title: string;
  eyebrow: string;
  icon: ReactNode;
  tag: string;
  hook: string;
  funny: string;
  deep: string;
  why: string;
  moves: string[];
  portfolio: string;
  interview: string;
  statLabel: string;
  statValue: string;
};

const CONCEPTS: Concept[] = [
  {
    id: "planes",
    title: "Control Plane vs Data Plane",
    eyebrow: "Two systems pretending to be one",
    icon: <CloudCog className="h-4 w-4" />,
    tag: "resilience",
    hook: "If the admin layer falls over, your users should not notice.",
    funny:
      "This is like the restaurant manager losing the reservation iPad while the kitchen still keeps serving burritos. Embarrassing? Yes. End of civilization? No.",
    deep:
      "The control plane owns provisioning, policy, and configuration. The data plane serves live traffic. Mature systems let the data plane continue on cached last-known-good state when the control plane degrades.",
    why:
      "This is what separates a scary internal incident from a public outage and angry customers.",
    moves: [
      "Cache last-known-good config in traffic-serving systems.",
      "Deploy control-plane changes separately from runtime changes.",
      "Write separate failure assumptions and runbooks for each plane.",
    ],
    portfolio:
      "I wanted this section to feel like an outage simulator, not a static card with jargon glued to it.",
    interview:
      "A healthy system loses editability before it loses availability.",
    statLabel: "Traffic survives",
    statValue: "99.95%",
  },
  {
    id: "blast",
    title: "Blast Radius Engineering",
    eyebrow: "Design the size of failure before the feature",
    icon: <ShieldAlert className="h-4 w-4" />,
    tag: "failure domains",
    hook: "The real question is not can it fail. It is who suffers when it does.",
    funny:
      "If one service sneezes and the entire platform faints dramatically, that is not architecture. That is a haunted Jenga tower.",
    deep:
      "Principal-level systems define bounded failure domains using cells, bulkheads, shuffle sharding, and explicit limits on dependency spread. The point is controlled damage, not blind optimism.",
    why:
      "Good systems fail in small, boring, isolated ways instead of big, expensive, all-hands ways.",
    moves: [
      "Partition users or traffic into isolated cells.",
      "Separate critical resources so low-priority load cannot starve important paths.",
      "Quantify failure with numbers, not vibes.",
    ],
    portfolio:
      "I turned this into a little failure map because blast radius is visual. You should be able to see the boundary of pain.",
    interview:
      "Great architects do not just predict failure. They pre-shape its perimeter.",
    statLabel: "Users affected",
    statValue: "12.5%",
  },
  {
    id: "saga",
    title: "Saga and Compensation",
    eyebrow: "Distributed transactions without 2PC drama",
    icon: <Network className="h-4 w-4" />,
    tag: "consistency",
    hook: "When one service says yes and another says absolutely not, recovery becomes the real design.",
    funny:
      "Order says placed. Payment says charged. Inventory says lol no. Suddenly everybody is doing apology choreography.",
    deep:
      "Sagas break a multi-service transaction into local commits plus compensating actions. The hard part is not the happy path. It is choosing when to retry, roll back, or move forward partially.",
    why:
      "This is the difference between graceful recovery and finance opening a spreadsheet with your name on it.",
    moves: [
      "Make compensations explicit instead of magical.",
      "Keep saga outcomes visible and debuggable.",
      "Design recovery paths before shipping the happy path.",
    ],
    portfolio:
      "I made rollback feel dramatic on purpose because compensation should feel expensive and real.",
    interview:
      "In distributed systems, recovery design matters more than happy-path choreography.",
    statLabel: "Compensations",
    statValue: "2 fired",
  },
  {
    id: "tail",
    title: "Tail Latency Amplification",
    eyebrow: "P99 is where optimism goes to die",
    icon: <TimerReset className="h-4 w-4" />,
    tag: "performance",
    hook: "One slow dependency can dominate the whole experience.",
    funny:
      "Your median latency is cute. Your tail latency is the one that ruins the demo in front of leadership.",
    deep:
      "Fan-out systems are governed by slow tails, not just averages. Hedged requests, cancellation, and isolation of fast paths are architectural tools, not tiny code tweaks.",
    why:
      "At scale, users experience random slowness while engineers experience random panic. Both come from the same tail problem.",
    moves: [
      "Measure composite latency, not only per-service averages.",
      "Use hedging only when work is cancellable and idempotent.",
      "Separate fast paths from noisy neighbors and slow analytical work.",
    ],
    portfolio:
      "I presented latency as a race so the straggler becomes obvious immediately.",
    interview:
      "At scale, bad tail latency is an architecture problem long before it is a code problem.",
    statLabel: "Composite P99",
    statValue: "842ms",
  },
  {
    id: "once",
    title: "Exactly-Once Is a Fairy Tale",
    eyebrow: "Design for idempotency instead",
    icon: <Receipt className="h-4 w-4" />,
    tag: "messaging",
    hook: "Messages duplicate. Reality does not care that we dislike this.",
    funny:
      "The packet said, 'trust me, I only came once.' The ledger said, 'that is what you said the last three times too.'",
    deep:
      "The practical goal is not mythical exactly-once delivery. It is exactly-once business outcome through idempotency keys, conditional writes, and carefully designed deduplication.",
    why:
      "Without this, you do not have resilient distributed architecture. You have duplicate charges and surprise emails.",
    moves: [
      "Attach unique idempotency keys to requests and events.",
      "Store business effect and processing outcome together when possible.",
      "Protect every downstream side effect individually.",
    ],
    portfolio:
      "I made duplicate packets visible because hidden duplicates are how very expensive bugs quietly enter production.",
    interview:
      "Exactly-once delivery matters less than exactly-once business outcome.",
    statLabel: "Duplicates dropped",
    statValue: "3/4",
  },
  {
    id: "active",
    title: "Multi-Region Active-Active",
    eyebrow: "High availability with conflict drama built in",
    icon: <Globe2 className="h-4 w-4" />,
    tag: "global systems",
    hook: "Two regions can both be right locally and wrong globally at the same time.",
    funny:
      "Region A says the cart has tacos. Region B says the cart has nachos. The user says great. Finance says absolutely not for bank transfers.",
    deep:
      "Conflict resolution is a product decision disguised as infrastructure. Some operations tolerate eventual consistency. Others need stronger guarantees or compensating flows.",
    why:
      "Global availability is easy to promise and hard to make correct when concurrent writes disagree.",
    moves: [
      "Classify which operations tolerate inconsistency and which do not.",
      "Choose merge semantics per domain instead of one global rule.",
      "Measure the cost of inconsistency in time and money.",
    ],
    portfolio:
      "I framed this as a conflict board because users do not care about CAP theory. They care whether the state makes sense.",
    interview:
      "The right active-active design is determined by conflict cost, not architecture fashion.",
    statLabel: "Conflict window",
    statValue: "30 sec",
  },
  {
    id: "chaos",
    title: "Chaos Engineering",
    eyebrow: "Architecture validation, not random destruction",
    icon: <FlaskConical className="h-4 w-4" />,
    tag: "validation",
    hook: "A system is only as resilient as the assumptions it can survive.",
    funny:
      "Anybody can say 'it should degrade gracefully.' Chaos engineering is where the system says, 'that is adorable.'",
    deep:
      "Useful chaos work starts with a written hypothesis, steady-state metrics, bounded blast radius, and the smallest fault needed to validate the assumption.",
    why:
      "Most resilience plans are fiction until the system has a chance to disagree with them in public.",
    moves: [
      "Write the hypothesis before the blast.",
      "Measure steady state with explicit thresholds.",
      "Prefer realistic network and dependency faults, not just process death.",
    ],
    portfolio:
      "I wanted this to feel like a lab notebook, because good chaos work is disciplined, not reckless.",
    interview:
      "Chaos validates architecture assumptions. Testing validates implementation behavior.",
    statLabel: "Hypothesis match",
    statValue: "84%",
  },
  {
    id: "backpressure",
    title: "Backpressure and Adaptive Capacity",
    eyebrow: "How systems avoid retry-fueled self-destruction",
    icon: <Waves className="h-4 w-4" />,
    tag: "overload control",
    hook: "Overload is survivable. Retry storms are not.",
    funny:
      "The downstream system is yelling 'I am full' while upstream keeps sending work like an aunt piling more food onto your plate after you already said no twice.",
    deep:
      "Overload-resistant systems propagate backpressure so offered load drops toward actual capacity. Without that signal, queues grow, retries multiply, and latency becomes performance fan fiction.",
    why:
      "Graceful degradation usually means refusing work honestly instead of collapsing slowly and dramatically.",
    moves: [
      "Cap queues and shed load early.",
      "Propagate distress upstream instead of hiding it.",
      "Coordinate retry policy with concurrency and timeout policy.",
    ],
    portfolio:
      "I made the queue physically swell because backpressure becomes obvious when you can literally watch the pipe jam.",
    interview:
      "Resilient systems do not accept infinite work. They communicate limits early and consistently.",
    statLabel: "Queue depth",
    statValue: "127 → 42",
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className={cn("text-xl font-semibold text-white", accent)}>{value}</div>
    </div>
  );
}

function PulseDot({ color = "bg-emerald-400" }: { color?: string }) {
  return (
    <motion.div
      className={cn("h-2.5 w-2.5 rounded-full", color)}
      animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.2, 0.9] }}
      transition={{ duration: 1.8, repeat: Infinity }}
    />
  );
}

function Packet({
  className,
  x,
  y,
  delay = 0,
  duration = 1.8,
}: {
  className: string;
  x: number[];
  y: number[];
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={cn("absolute h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]", className)}
      animate={{ x, y, opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.85] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

function Scene({ id, incident }: { id: string; incident: boolean }) {
  if (id === "planes") {
    return (
      <div className="grid h-full gap-4 p-4 md:grid-cols-2 md:p-8">
        <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">Control plane</div>
              <div className="mt-1 text-sm text-slate-300">config • policy • provisioning</div>
            </div>
            <CloudCog className="h-6 w-6 text-cyan-200" />
          </div>
          <div className="space-y-2">
            {['Deploy config', 'Rotate secret', 'Change policy'].map((item, index) => (
              <motion.div
                key={item}
                animate={incident && index === 1 ? { x: [-3, 3, -3] } : { x: 0 }}
                transition={{ repeat: incident && index === 1 ? Infinity : 0, duration: 0.35 }}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm",
                  incident && index === 1
                    ? "border-rose-400/50 bg-rose-500/15 text-rose-100"
                    : "border-white/10 bg-black/20 text-slate-200",
                )}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-emerald-200">Data plane</div>
              <div className="mt-1 text-sm text-slate-300">live traffic • real users</div>
            </div>
            <Activity className="h-6 w-6 text-emerald-200" />
          </div>
          <div className="relative h-40 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
            <Packet className="bg-emerald-300 text-emerald-300" x={[-10, 320]} y={[40, 40]} />
            <Packet className="bg-emerald-300 text-emerald-300" x={[-10, 320]} y={[78, 78]} delay={0.55} />
            <Packet className="bg-emerald-300 text-emerald-300" x={[-10, 320]} y={[116, 116]} delay={1.1} />
            <div className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.22em] text-slate-500">
              {incident ? 'running on last known good config' : 'healthy steady traffic'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "blast") {
    return (
      <div className="grid h-full gap-4 p-4 md:grid-cols-3 md:p-8">
        {[1, 2, 3].map((cell) => {
          const hit = incident && cell === 2;
          return (
            <motion.div
              key={cell}
              animate={hit ? { y: [-2, 2, -2] } : { y: 0 }}
              transition={{ repeat: hit ? Infinity : 0, duration: 0.35 }}
              className={cn(
                "rounded-3xl border p-5",
                hit ? "border-rose-400/50 bg-rose-500/10" : "border-white/10 bg-white/5",
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Cell {cell}</div>
                  <div className="mt-1 text-sm text-slate-200">db • queue • compute</div>
                </div>
                <Layers3 className={cn("h-5 w-5", hit ? "text-rose-200" : "text-slate-300")} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-2xl border px-3 py-4 text-center text-xs",
                      hit && i > 1
                        ? "border-rose-400/50 bg-rose-500/15 text-rose-100"
                        : "border-white/10 bg-black/20 text-slate-300",
                    )}
                  >
                    svc-{cell}.{i + 1}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (id === "saga") {
    return (
      <div className="relative flex h-full items-center justify-center px-8">
        <div className="absolute top-8 rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-3 text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-fuchsia-200">Orchestrator</div>
          <div className="mt-1 text-sm text-slate-200">keeps receipts and regrets</div>
        </div>
        <div className="relative flex w-full max-w-3xl items-center justify-between pt-10">
          {['Order', 'Payment', 'Inventory'].map((name, index) => {
            const failed = incident && index === 2;
            const compensating = incident && index < 2;
            return (
              <div key={name} className="relative flex flex-col items-center">
                <motion.div
                  animate={failed ? { x: [-3, 3, -3] } : { x: 0 }}
                  transition={{ repeat: failed ? Infinity : 0, duration: 0.35 }}
                  className={cn(
                    "flex h-24 w-24 items-center justify-center rounded-3xl border text-sm",
                    failed
                      ? "border-rose-400/50 bg-rose-500/10 text-rose-100"
                      : compensating
                        ? "border-amber-400/50 bg-amber-500/10 text-amber-100"
                        : "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
                  )}
                >
                  {name}
                </motion.div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  {failed ? 'failed' : compensating ? 'compensating' : 'committed'}
                </div>
              </div>
            );
          })}

          {!incident && (
            <>
              <Packet className="bg-cyan-300 text-cyan-300" x={[70, 275]} y={[0, 0]} />
              <Packet className="bg-cyan-300 text-cyan-300" x={[315, 520]} y={[0, 0]} delay={0.8} />
            </>
          )}

          {incident && (
            <>
              <Packet className="bg-amber-300 text-amber-300" x={[520, 315]} y={[0, 0]} />
              <Packet className="bg-amber-300 text-amber-300" x={[275, 70]} y={[0, 0]} delay={0.8} />
            </>
          )}
        </div>
      </div>
    );
  }

  if (id === "tail") {
    return (
      <div className="flex h-full flex-col justify-center px-6 md:px-10">
        <div className="mb-5 text-[10px] uppercase tracking-[0.24em] text-slate-500">fan-out request race</div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => {
            const slow = incident && i === 6;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-16 text-xs uppercase tracking-[0.2em] text-slate-500">svc-{i + 1}</div>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={cn("h-full rounded-full", slow ? "bg-rose-400" : "bg-cyan-300")}
                    animate={{ width: slow ? '92%' : `${28 + i * 7}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <div className={cn("w-16 text-right text-sm", slow ? "text-rose-200" : "text-slate-300")}>
                  {slow ? '811ms' : `${43 + i * 8}ms`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (id === "once") {
    return (
      <div className="grid h-full gap-4 p-4 md:grid-cols-[1fr_180px_1fr] md:p-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">Inbox</div>
          <div className="relative h-44 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
            <Packet className="bg-fuchsia-300 text-fuchsia-300" x={[-10, 220]} y={[34, 34]} />
            <Packet className="bg-fuchsia-300 text-fuchsia-300" x={[-10, 220]} y={[80, 80]} delay={0.7} />
            {incident && <Packet className="bg-rose-300 text-rose-300" x={[-10, 220]} y={[126, 126]} delay={0.15} />}
            {incident && <Packet className="bg-rose-300 text-rose-300" x={[-10, 220]} y={[126, 126]} delay={0.9} />}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <Receipt className="h-8 w-8 text-emerald-200" />
          <div className="text-center text-xs uppercase tracking-[0.22em] text-emerald-100">Idempotency ledger</div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">msg-1042 ✓</div>
          {incident && (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-slate-200">
              msg-1042 duplicate
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">Business outcome</div>
          <div className="space-y-3">
            {['Charge once', 'Send once', 'Write once'].map((line) => (
              <div key={line} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-200">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "active") {
    return (
      <div className="grid h-full gap-4 p-4 md:grid-cols-[1fr_120px_1fr] md:p-8">
        {[{ name: 'Region A', note: incident ? 'cart + tacos' : 'cart synced', color: 'cyan' }, { name: 'Region B', note: incident ? 'cart + nachos' : 'cart synced', color: incident ? 'rose' : 'emerald' }].map((region) => (
          <div
            key={region.name}
            className={cn(
              "rounded-3xl border p-5",
              region.color === 'rose'
                ? 'border-rose-400/50 bg-rose-500/10'
                : region.color === 'emerald'
                  ? 'border-emerald-400/50 bg-emerald-500/10'
                  : 'border-cyan-400/50 bg-cyan-500/10',
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-300">{region.name}</div>
                <div className="mt-1 text-sm text-slate-200">closest users write here</div>
              </div>
              <Globe2 className="h-5 w-5 text-slate-200" />
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-slate-100">
              {region.note}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center">
          <motion.div
            animate={incident ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
            transition={{ repeat: incident ? Infinity : 0, duration: 1.2 }}
            className={cn(
              "rounded-2xl border px-4 py-5 text-center text-xs uppercase tracking-[0.22em]",
              incident
                ? 'border-amber-400/50 bg-amber-500/10 text-amber-100'
                : 'border-white/10 bg-white/5 text-slate-300',
            )}
          >
            {incident ? 'conflict' : 'replication'}
          </motion.div>
        </div>
      </div>
    );
  }

  if (id === "chaos") {
    return (
      <div className="grid h-full gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">Steady state</div>
          <div className="space-y-4">
            {['latency', 'error rate', 'saturation'].map((item, index) => (
              <div key={item}>
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item}</div>
                <div className="h-3 rounded-full bg-slate-950/50">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      incident && index === 1 ? 'bg-rose-400' : 'bg-emerald-400',
                    )}
                    animate={{ width: incident && index === 1 ? '72%' : `${30 + index * 10}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.24em] text-fuchsia-200">Hypothesis</div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-100">
            {incident
              ? 'If network latency spikes between services, retries should stay bounded and customer-facing latency should degrade but remain within tolerance.'
              : 'If one availability zone disappears, only its bounded cell should degrade while the rest of the platform stays boring.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-[1fr_1fr_1fr] md:p-8">
      <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-5">
        <div className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-200">Incoming traffic</div>
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
        <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">Queue</div>
        <div className="flex h-44 items-end gap-2 rounded-3xl border border-white/10 bg-slate-950/50 p-3">
          {Array.from({ length: incident ? 9 : 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${28 + (i % 4) * 14}px` }}
              className={cn("w-full rounded-t-md", incident && i > 6 ? 'bg-rose-400' : 'bg-amber-300')}
            />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
        <div className="mb-4 text-xs uppercase tracking-[0.24em] text-emerald-100">Backpressure signal</div>
        <div className="flex h-44 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/50">
          <motion.div
            animate={incident ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className={cn(
              "rounded-full border px-5 py-4 text-sm uppercase tracking-[0.2em]",
              incident
                ? 'border-emerald-300/60 bg-emerald-500/20 text-emerald-100'
                : 'border-white/10 bg-white/5 text-slate-300',
            )}
          >
            {incident ? 'slow down' : 'stable flow'}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function DistributedSystemsPanicRoom({ onBack }: { onBack?: () => void }) {
  const [activeId, setActiveId] = useState(CONCEPTS[0].id);
  const [mode, setMode] = useState<Mode>('playful');
  const [incident, setIncident] = useState(false);

  const active = useMemo(() => CONCEPTS.find((item) => item.id === activeId) ?? CONCEPTS[0], [activeId]);

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_25%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_20%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              portfolio lab
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              {([
                ['playful', 'Fun mode'],
                ['principal', 'Deep mode'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition",
                    mode === value ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIncident((current) => !current)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                incident
                  ? 'border-rose-400/40 bg-rose-500/15 text-rose-100 hover:bg-rose-500/20'
                  : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15',
              )}
            >
              {incident ? <TrafficCone className="h-4 w-4" /> : <LifeBuoy className="h-4 w-4" />}
              {incident ? 'Restore system' : 'Trigger incident'}
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-fuchsia-200">
                <BrainCircuit className="h-3.5 w-3.5" />
                distributed systems panic room
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                interactive portfolio story
              </div>
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              I rebuilt this from a pattern catalog into a tiny incident simulator.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Instead of dropping architecture jargon into flat cards, this version explains the ideas like production is slightly on fire and you are the adult in the room.
              Every concept has a live scene, a plain-English translation, a principal-level explanation, and a portfolio-ready takeaway.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              {['funny but credible', 'interactive not static', 'portfolio-ready storytelling', 'feels like a product'].map((item) => (
                <div key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Stat label="Active concept" value={active.title} accent="text-cyan-200" />
            <Stat label={active.statLabel} value={active.statValue} accent="text-emerald-200" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)_360px]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <div className="mb-3 px-3 pt-2">
              <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">Concept board</div>
              <div className="mt-1 text-sm text-slate-300">Pick a concept, then break it safely.</div>
            </div>

            <div className="space-y-2">
              {CONCEPTS.map((concept, index) => {
                const isActive = concept.id === activeId;
                return (
                  <button
                    key={concept.id}
                    onClick={() => {
                      setActiveId(concept.id);
                      setIncident(false);
                    }}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition",
                      isActive
                        ? 'border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.18)]'
                        : 'border-white/10 bg-black/10 hover:bg-white/5',
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
                    <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {concept.tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-md md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Interactive stage</div>
                <div className="mt-1 text-base font-medium text-white">{active.hook}</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-300">
                <PulseDot color={incident ? 'bg-rose-400' : 'bg-emerald-400'} />
                {incident ? 'incident mode' : 'stable mode'}
              </div>
            </div>

            <div className="relative h-[430px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.95),rgba(2,6,23,1))]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(51,65,85,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,65,85,0.35)_1px,transparent_1px)] bg-[size:38px_38px] opacity-30" />
              <Scene id={active.id} incident={incident} />
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Narrative panel</div>
                <div className="mt-1 text-sm text-slate-300">Funny first, serious when needed.</div>
              </div>
              <Zap className="h-4 w-4 text-amber-200" />
            </div>

            <div className="mb-4 rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                {mode === 'playful' ? 'Fun mode' : 'Deep mode'}
              </div>
              <p className="text-sm leading-7 text-slate-100">{mode === 'playful' ? active.funny : active.deep}</p>
            </div>

            <div className="mb-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-cyan-200">Why this matters</div>
              <p className="text-sm leading-7 text-cyan-50">{active.why}</p>
            </div>

            <div className="mb-4 rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-slate-500">What strong architects do</div>
              <div className="space-y-2">
                {active.moves.map((move) => (
                  <div key={move} className="flex items-start gap-2 text-sm leading-6 text-slate-200">
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                    <span>{move}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4">
                <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-amber-100">Portfolio note</div>
                <p className="text-sm leading-7 text-amber-50">{active.portfolio}</p>
              </div>

              <div className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
                <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-fuchsia-100">Interview line</div>
                <p className="text-sm leading-7 text-fuchsia-50">{active.interview}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
