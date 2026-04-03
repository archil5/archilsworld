import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SYSTEM_DESIGN_TOPICS, SYSTEM_DESIGN_CATEGORIES, type SystemDesignTopic } from "@/data/systemDesign";
import SystemDesignDiagram from "./diagrams/SystemDesignDiagram";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const PURPLE = "#7C3AED";
const AMBER = "#D97706";
const RED = "#DC2626";
const GREEN = "#16A34A";

/* ── Architect Scenarios ─────────────────────────────────── */
interface ArchScenario {
  id: string;
  title: string;
  scale: string;
  icon: string;
  situation: string;
  constraint: string;
  choices: {
    label: string;
    description: string;
    isOptimal: boolean;
    tradeoff: string;
  }[];
  optimalReasoning: string;
  archilNote: string;
  followUp: string;
}

const SCENARIOS: ArchScenario[] = [
  {
    id: "rate-limit",
    title: "Your API is being hammered",
    scale: "50M requests/day",
    icon: "🔥",
    situation: "Your public API is getting 50M requests/day. A single misbehaving client is sending 2M of those. Other users are experiencing timeouts. Your backend services are falling over.",
    constraint: "You need to cap per-client requests without dropping legitimate traffic. Latency budget: <10ms overhead.",
    choices: [
      { label: "Token Bucket at API Gateway", description: "Each client gets a bucket of tokens. Tokens refill at a fixed rate. Burst traffic allowed up to bucket size.", isOptimal: true, tradeoff: "Allows short bursts while enforcing sustained limits. Gateway-level = zero backend impact. Sub-millisecond check. Industry standard." },
      { label: "Fixed Window Counter", description: "Count requests per client in 60-second windows. Reject anything over the limit.", isOptimal: false, tradeoff: "Simple but dangerous: a client can fire 2x the limit by hitting both the end of one window and the start of the next (the boundary exploit)." },
      { label: "Block by IP at Load Balancer", description: "Detect high-traffic IPs and add them to a blocklist.", isOptimal: false, tradeoff: "Crude and brittle. Shared IPs (corporate NAT) would block legitimate users. Doesn't handle API key abuse." },
    ],
    optimalReasoning: "Token Bucket is the right algorithm. It allows bursts (real traffic patterns are bursty) while enforcing average throughput. Sliding Window Log is more accurate but expensive. Token Bucket is the sweet spot.",
    archilNote: "At BMO, we implemented Token Bucket in our Private API Gateway Lambda Authorizer. The key insight: rate limit on API Key, not IP — gives you per-client granularity without NAT problems.",
    followUp: "Interview trap: 'What happens in a distributed system with 10 API Gateway nodes?' You need a distributed counter (Redis with Lua scripts for atomicity) — each node alone can't track global rate.",
  },
  {
    id: "database-scale",
    title: "Your database is choking",
    scale: "1B rows, 100K reads/sec",
    icon: "🗄️",
    situation: "Your e-commerce platform just hit 1B orders. Read queries for the order history page take 8 seconds. Writes are slow because indexes are massive. Your single PostgreSQL instance is at 95% CPU.",
    constraint: "Order history reads can tolerate 1-2 second lag. Writes (new orders) cannot be lost — must be consistent.",
    choices: [
      { label: "Read Replicas + Database Sharding", description: "Replicas for read traffic. Shard writes by customer_id range across multiple primaries.", isOptimal: true, tradeoff: "Replicas handle the read storm with near-zero lag. Sharding splits write pressure. Proven at billions of rows in production." },
      { label: "Move Everything to Cassandra", description: "Migrate the entire platform to a distributed NoSQL database designed for high write throughput.", isOptimal: false, tradeoff: "Cassandra is excellent but a full migration is months of risk. Also, strong consistency for new orders is harder to achieve." },
      { label: "Add More Indexes", description: "Create composite indexes for the most common query patterns.", isOptimal: false, tradeoff: "More indexes slow down writes even further and increase storage. You're fighting the wrong problem." },
    ],
    optimalReasoning: "Read replicas solve 80% of the problem immediately. Sharding by customer_id is predictable and gives you linear scale. The order history query is a perfect read replica candidate — 1-2s lag is fine for historical data.",
    archilNote: "The pattern I've seen consistently work: read replicas for the immediate crisis, then plan horizontal sharding based on the actual access pattern. Don't over-engineer until you understand the hotspots.",
    followUp: "Next question: 'What's your sharding key?' Wrong key = hotspots. customer_id is usually safe (uniform distribution). Order date is dangerous (all new orders hit one shard).",
  },
  {
    id: "caching-strategy",
    title: "Cache invalidation gone wrong",
    scale: "5M active users, 200ms latency target",
    icon: "⚡",
    situation: "Your product catalogue has 10M items. 95% of traffic hits 1% of items (Pareto). Cache hit rate is 40% — terrible. But when you update a product price, some users see stale prices for up to 30 minutes. Legal team is not happy.",
    constraint: "Price changes must be visible within 60 seconds. You can't clear the entire cache on every update.",
    choices: [
      { label: "Cache-Aside + Event-Driven Invalidation", description: "Application checks cache first. On price update, publish an event that specifically invalidates the affected item's cache key.", isOptimal: true, tradeoff: "Surgical invalidation — only the changed item's cache is cleared. Event-driven means updates propagate within seconds. Cache hit rate jumps to 95%+ for hot items." },
      { label: "Short TTL on Everything (60s)", description: "Set all cache entries to expire after 60 seconds max.", isOptimal: false, tradeoff: "Solves the stale data problem but destroys your cache hit rate. At 5M users, cache misses become a thundering herd problem." },
      { label: "Write-Through Cache", description: "Every database write simultaneously writes to cache. Cache is always fresh.", isOptimal: false, tradeoff: "You'd write to cache for every product update, including products nobody is viewing. Cache fills with cold data. No burst handling." },
    ],
    optimalReasoning: "Cache-Aside with event-driven invalidation is the production-proven pattern. You get high cache hit rates on hot items AND near-real-time updates on changes. The event (product.price.updated) triggers targeted cache key deletion — no full cache flush needed.",
    archilNote: "The 'thundering herd' problem is the real trap here: when a popular cached item expires, 10,000 requests simultaneously miss and hammer the DB. Use cache stampede protection — probabilistic early expiration or a lock to let only one thread refresh.",
    followUp: "How do you handle cache stampedes? Probabilistic early refresh (PER) — before TTL expires, some requests 'volunteer' to refresh early. Prevents the simultaneous miss spike.",
  },
  {
    id: "message-queue",
    title: "Event ordering is broken",
    scale: "10K events/sec, financial domain",
    icon: "📬",
    situation: "Your financial platform processes account events: deposit, withdrawal, balance_check. In a Kafka setup, events sometimes arrive out of order because they're on different partitions. A withdrawal processed before the deposit it depends on causes negative balances.",
    constraint: "All events for a single account must be processed in strict order. Throughput must stay at 10K/sec.",
    choices: [
      { label: "Partition by Account ID", description: "Use account_id as the Kafka partition key. All events for the same account go to the same partition and are consumed in order.", isOptimal: true, tradeoff: "Kafka guarantees ordering within a partition. By keying on account_id, you get strict per-account ordering with no throughput penalty." },
      { label: "Single-Partition Topic", description: "Put all events in one partition — guaranteed global ordering.", isOptimal: false, tradeoff: "You lose all parallelism. One partition = one consumer. 10K events/sec through a single consumer is a bottleneck. This doesn't scale." },
      { label: "Sequence Numbers + Reordering Buffer", description: "Add a sequence number to each event. Consumers buffer and reorder before processing.", isOptimal: false, tradeoff: "Complex to implement correctly. Buffer size? Timeout? What if a message is lost? You're reinventing what Kafka's partition ordering already gives you." },
    ],
    optimalReasoning: "Partition by Account ID is the elegant solution. Kafka's core guarantee is ordering within a partition. By choosing a partition key that maps to your business entity (account), you get exactly the semantics you need — free.",
    archilNote: "This is one of my favourite system design lessons: fight the architecture, not with it. Kafka was built for exactly this. The moment someone suggests a reordering buffer, ask 'are we re-implementing Kafka's core feature?' Usually that ends the discussion.",
    followUp: "Watch out for hot partitions: if a single account has 100x more events than others (a trading algorithm), that partition becomes a bottleneck. Composite keys (account_id + event_type) can help distribute without breaking ordering guarantees.",
  },
  {
    id: "load-balancing",
    title: "Traffic spike is killing one server",
    scale: "500K concurrent users, sudden 10x spike",
    icon: "⚖️",
    situation: "You run a ticketing platform. Taylor Swift just announced a tour. Traffic went from 50K to 500K concurrent users in 90 seconds. Three of your ten servers are at 100% CPU while the others are at 20%. Your load balancer is Round Robin.",
    constraint: "Must handle spikes in < 30s. Can't change the app servers right now. Some requests involve heavy computation (price calculation), others are fast (show homepage).",
    choices: [
      { label: "Least Connections + Auto Scaling", description: "Switch load balancer to Least Connections algorithm. Trigger auto scaling on CPU > 70%.", isOptimal: true, tradeoff: "Least Connections routes new requests to the server with fewest active connections — naturally handles request duration variance. Auto scaling handles the volume surge." },
      { label: "Add More Servers Manually", description: "SSH into the cloud console and provision 20 more servers.", isOptimal: false, tradeoff: "Too slow (minutes). By the time you're done, the spike is over or the system has failed. No automation = not scalable." },
      { label: "Rate Limit All Users to 10 req/min", description: "Protect the servers by throttling every user equally.", isOptimal: false, tradeoff: "You'd throttle legitimate purchase attempts. Revenue loss. Also doesn't fix the root problem: uneven load distribution." },
    ],
    optimalReasoning: "Least Connections is the right algorithm for mixed-duration requests. Round Robin is blind to how long each request takes — it just rotates. Least Connections routes to the server doing less work right now. Pair with auto scaling triggered on CPU/connection count.",
    archilNote: "Round Robin is fine for homogeneous requests. The moment you mix fast (static assets) and slow (DB-heavy) requests, Least Connections or Weighted Round Robin wins. The Taylor Swift ticket sale scenario is actually a famous real-world case study.",
    followUp: "Virtual queue pattern: instead of dropping connections during spikes, place users in a virtual waiting room with a position number. Ticketmaster does this. Smooths the demand curve and prevents thundering herd on backend.",
  },
];

/* ── Scenario Card ───────────────────────────────────────── */
const ScenarioCard = ({ scenario }: { scenario: ArchScenario }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selected !== null && scenario.choices[selected].isOptimal;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowResult(true);
  };

  const reset = () => { setSelected(null); setShowResult(false); };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${PURPLE}15`, background: "#fff" }}>
      <div className="px-5 py-4" style={{ background: `${PURPLE}06`, borderBottom: `1px solid ${PURPLE}10` }}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{scenario.icon}</span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: PURPLE }}>
              Scenario · {scenario.scale}
            </p>
            <h3 className="font-display text-base font-bold mb-1" style={{ color: INK }}>{scenario.title}</h3>
            <p className="font-display text-sm leading-relaxed" style={{ color: INK_MUTED }}>{scenario.situation}</p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-xl" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}15` }}>
          <p className="font-mono text-xs" style={{ color: AMBER }}>
            <span className="font-bold">Constraint: </span>{scenario.constraint}
          </p>
        </div>
      </div>

      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
          What's your call?
        </p>
        <div className="space-y-2.5 mb-4">
          {scenario.choices.map((choice, i) => {
            const isSel = selected === i;
            let bg = `${INK}03`; let border = `${INK}08`; let tc = INK;
            if (showResult && choice.isOptimal) { bg = `${GREEN}10`; border = `${GREEN}30`; tc = GREEN; }
            else if (showResult && isSel && !choice.isOptimal) { bg = `${RED}06`; border = `${RED}20`; tc = RED; }

            return (
              <motion.button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                whileHover={selected === null ? { x: 3 } : {}}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{ background: bg, border: `1.5px solid ${border}` }}>
                <p className="font-display text-sm font-semibold mb-0.5" style={{ color: tc }}>
                  {choice.label} {showResult && choice.isOptimal ? "✓" : showResult && isSel ? "✗" : ""}
                </p>
                <p className="font-display text-xs leading-relaxed" style={{ color: INK_MUTED }}>{choice.description}</p>
                {showResult && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 pt-2" style={{ borderTop: `1px solid ${tc}20` }}>
                    <p className="font-mono text-[10px]" style={{ color: tc }}>{choice.tradeoff}</p>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="p-4 rounded-xl"
                style={{ background: isCorrect ? `${GREEN}06` : `${AMBER}06`, border: `1px solid ${isCorrect ? `${GREEN}15` : `${AMBER}15`}` }}>
                <p className="font-display text-sm font-bold mb-2" style={{ color: isCorrect ? GREEN : AMBER }}>
                  {isCorrect ? "✅ Right call." : "💡 Close — here's the optimal approach:"}
                </p>
                <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{scenario.optimalReasoning}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: COPPER }}>From the Trenches</p>
                <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{scenario.archilNote}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}15` }}>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: PURPLE }}>Interview Follow-up</p>
                <p className="font-display text-xs leading-relaxed" style={{ color: INK }}>{scenario.followUp}</p>
              </div>
              <button onClick={reset} className="font-mono text-[10px] px-3 py-1.5 rounded-lg"
                style={{ color: INK_MUTED, background: `${INK}06` }}>Try again ↺</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Architect Mode ──────────────────────────────────────── */
const ArchitectMode = () => {
  const [ci, setCi] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-5 flex items-center gap-2 flex-wrap">
          <p className="font-mono text-xs uppercase tracking-widest mr-2" style={{ color: INK_MUTED }}>Scenario:</p>
          {SCENARIOS.map((s, i) => (
            <button key={s.id} onClick={() => setCi(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
              style={{
                background: ci === i ? INK : `${INK}04`,
                color: ci === i ? "#F8FAFC" : INK_MUTED,
                border: `1px solid ${ci === i ? "transparent" : `${INK}10`}`,
              }}>
              {s.icon} {s.title.split(" ").slice(0, 3).join(" ")}…
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={ci} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ScenarioCard scenario={SCENARIOS[ci]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Topic Detail ────────────────────────────────────────── */
const TopicDetail = ({ topic, onBack }: { topic: SystemDesignTopic; onBack: () => void }) => (
  <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
    <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${INK}08` }}>
      <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
        style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        <span className="font-mono text-xs">Topics</span>
      </button>
      <h2 className="font-display text-lg font-bold" style={{ color: INK }}>{topic.icon} {topic.title}</h2>
    </div>

    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
          <p className="font-display text-base italic leading-relaxed" style={{ color: INK }}>"{topic.oneLiner}"</p>
        </motion.div>

        <SystemDesignDiagram topicId={topic.id} steps={topic.howItActuallyWorks} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: RED }}>
            The Real Problem (Not the Textbook Version)
          </p>
          <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{topic.theRealProblem}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: COPPER }}>How It Actually Works</p>
          <div className="space-y-2">
            {topic.howItActuallyWorks.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.04 }}
                className="p-3 rounded-xl" style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}15` }}>
                <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: RED }}>Common Mistakes I've Seen</p>
          <div className="space-y-2">
            {topic.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: `${RED}04`, borderLeft: `2px solid ${RED}20` }}>
                <span className="font-mono text-xs mt-0.5" style={{ color: RED }}>✗</span>
                <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{m}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-4 rounded-xl" style={{ background: `${INK}03`, borderLeft: `2px solid ${AMBER}30` }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>Interview Tip</p>
          <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{topic.interviewTip}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-4 rounded-xl" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
          <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: COPPER }}>From the Trenches</p>
          <p className="font-display text-sm leading-relaxed italic" style={{ color: INK }}>{topic.practitionerNote}</p>
        </motion.div>
      </div>
    </div>
  </div>
);

/* ── Main Component ──────────────────────────────────────── */
interface SystemDesignModuleProps { onBack: () => void; }

const SystemDesignModule = ({ onBack }: SystemDesignModuleProps) => {
  const [selectedTopic, setSelectedTopic] = useState<SystemDesignTopic | null>(null);
  const [activeTab, setActiveTab] = useState<"study" | "architect">("study");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return SYSTEM_DESIGN_TOPICS.filter(t => {
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
        || t.oneLiner.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, categoryFilter]);

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${INK}08` }}>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs">Hub</span>
        </button>
        <div className="text-right">
          <h2 className="font-display text-lg font-bold" style={{ color: INK }}>System Design</h2>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>{SYSTEM_DESIGN_TOPICS.length} topics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-4 md:px-8 py-2 flex gap-2" style={{ borderBottom: `1px solid ${INK}06` }}>
        {([["study", "⚙️ Study Topics"], ["architect", "🏗️ Architect Challenge"]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-lg transition-all"
            style={{
              background: activeTab === tab ? INK : `${INK}04`,
              color: activeTab === tab ? "#F8FAFC" : INK_MUTED,
              border: `1px solid ${activeTab === tab ? "transparent" : `${INK}10`}`,
            }}>
            {label}
            {tab === "architect" && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: `${PURPLE}20`, color: PURPLE }}>5 scenarios</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "architect" ? <ArchitectMode /> : (
        <>
          <div className="shrink-0 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
            style={{ borderBottom: `1px solid ${INK}06` }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search topics..." className="flex-1 max-w-xs px-3 py-1.5 font-mono text-xs outline-none rounded-lg"
              style={{ background: `${INK}03`, border: `1px solid ${INK}08`, color: INK }} />
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setCategoryFilter("all")}
                className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                style={{ background: categoryFilter === "all" ? INK : `${INK}04`, color: categoryFilter === "all" ? "#F8FAFC" : INK_MUTED, border: `1px solid ${INK}12` }}>All</button>
              {SYSTEM_DESIGN_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                  className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                  style={{ background: categoryFilter === cat.value ? INK : `${INK}04`, color: categoryFilter === cat.value ? "#F8FAFC" : INK_MUTED, border: `1px solid ${INK}12` }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
              {filtered.map((t, i) => (
                <motion.button key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }} onClick={() => setSelectedTopic(t)}
                  className="text-left p-4 md:p-5 transition-all group rounded-xl"
                  style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
                  whileHover={{ y: -2, rotate: 0.5 }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base mb-1" style={{ color: INK }}>{t.title}</h3>
                      <p className="font-mono text-xs leading-relaxed mb-2" style={{ color: INK_MUTED }}>{t.oneLiner}</p>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: `${INK}06`, color: INK_MUTED }}>{t.category}</span>
                    </div>
                    <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: COPPER }}>→</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemDesignModule;
