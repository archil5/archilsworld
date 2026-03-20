export interface SystemDesignTopic {
  id: string;
  title: string;
  icon: string;
  category: "scaling" | "storage" | "networking" | "reliability" | "fundamentals";
  oneLiner: string;
  theRealProblem: string;
  howItActuallyWorks: string[];
  commonMistakes: string[];
  interviewTip: string;
  practitionerNote: string;
}

export const SYSTEM_DESIGN_CATEGORIES = [
  { value: "fundamentals" as const, label: "Fundamentals" },
  { value: "scaling" as const, label: "Scaling" },
  { value: "storage" as const, label: "Storage" },
  { value: "networking" as const, label: "Networking" },
  { value: "reliability" as const, label: "Reliability" },
];

export const SYSTEM_DESIGN_TOPICS: SystemDesignTopic[] = [
  {
    id: "cap-theorem",
    title: "CAP Theorem",
    icon: "🔺",
    category: "fundamentals",
    oneLiner: "In a distributed system, you can have at most two of: Consistency, Availability, Partition Tolerance.",
    theRealProblem: "CAP is widely misunderstood. It doesn't mean 'pick two.' Network partitions WILL happen — you don't get to choose. So the real choice is: during a partition, do you sacrifice consistency (serve stale data) or availability (refuse to respond)?",
    howItActuallyWorks: [
      "Partition Tolerance isn't optional — networks fail. So you're really choosing between CP and AP.",
      "CP systems (e.g., Postgres with synchronous replication): during a partition, writes block until the partition heals. Strong consistency, but some requests time out.",
      "AP systems (e.g., DynamoDB, Cassandra): during a partition, all nodes keep serving. Consistency is eventually restored, but you may read stale data.",
      "Most real systems aren't purely CP or AP — they make different trade-offs per operation. A banking ledger needs CP for balance updates but can be AP for transaction history reads.",
      "PACELC extends CAP: even when there's no partition (normal operation), you still choose between latency and consistency.",
    ],
    commonMistakes: [
      "Saying 'we chose CA' — you can't. Partitions happen whether you like it or not.",
      "Treating CAP as a database selection criterion — it's about system behavior during failures, not product features.",
      "Ignoring that different operations in the same system can make different CAP trade-offs.",
    ],
    interviewTip: "When asked about CAP, don't just define the letters. Talk about a real scenario: 'If our payment service loses connectivity to the primary DB, do we reject payments (CP) or process them optimistically and reconcile later (AP)? For payments, we chose CP.'",
    practitionerNote: "In 7 years of enterprise systems, I've found that CAP matters most in one specific scenario: cross-region replication. Within a single region/AZ, network partitions are rare. But between US-East and EU-West? They happen monthly. Design your cross-region strategy accordingly.",
  },
  {
    id: "load-balancing",
    title: "Load Balancing",
    icon: "⚖️",
    category: "scaling",
    oneLiner: "Distribute incoming requests across multiple servers to prevent any single server from becoming a bottleneck.",
    theRealProblem: "It's not just about distributing traffic evenly. The real challenge is: what does 'balanced' mean? A server handling 100 lightweight health checks isn't comparable to one handling 10 heavy ML inference requests. Naive round-robin can create catastrophic imbalance.",
    howItActuallyWorks: [
      "L4 (Transport) load balancers route based on IP/port — fast, cheap, but no awareness of request content. NLB in AWS.",
      "L7 (Application) load balancers inspect HTTP headers, paths, and content — can route /api to backend A and /static to a CDN. ALB in AWS.",
      "Algorithms: Round Robin (simple, ignores server load), Least Connections (routes to the least busy server), Weighted (manually assign capacity), Consistent Hashing (sticky, good for caches).",
      "Health checks: the load balancer periodically pings each backend. Unhealthy servers are removed from rotation. The check interval vs. detection speed trade-off matters — too slow and you serve errors, too fast and you waste resources.",
      "Connection draining: when removing a server, finish in-flight requests before cutting traffic. Without this, users see random 502 errors during deployments.",
    ],
    commonMistakes: [
      "Using a single load balancer without redundancy — it becomes the single point of failure you were trying to eliminate.",
      "Not configuring connection draining during deployments — causes intermittent 502/504 errors.",
      "Using sticky sessions (session affinity) as a crutch for stateful apps — it defeats the purpose of load balancing and makes scaling painful.",
    ],
    interviewTip: "Draw the load balancer as a decision point, not a black box. Show that you understand L4 vs L7, explain why you'd choose one algorithm over another for the specific system, and mention health checks as a critical operational concern.",
    practitionerNote: "At BMO, we ran NLB → API Gateway → ALB → ECS. The NLB handled TLS termination at massive scale (millions of connections), while the ALB provided path-based routing to different service target groups. This two-tier approach gave us both raw throughput and intelligent routing.",
  },
  {
    id: "caching",
    title: "Caching Strategies",
    icon: "💾",
    category: "storage",
    oneLiner: "Store frequently accessed data closer to where it's needed to reduce latency and database load.",
    theRealProblem: "Caching is easy. Cache invalidation is one of the two hard problems in computer science (the other is naming things). The real questions: how stale can this data be? What happens when the cache and the database disagree? How do you warm the cache after a cold start?",
    howItActuallyWorks: [
      "Cache-Aside (Lazy Loading): App checks cache first. On miss, reads from DB, writes to cache, returns. Most common pattern. Problem: first request is always slow (cold miss).",
      "Write-Through: Every write goes to both cache and DB simultaneously. Cache is always warm and consistent. Problem: write latency doubles.",
      "Write-Behind (Write-Back): Writes go to cache only. Cache asynchronously flushes to DB in batches. Ultra-fast writes. Problem: data loss if cache crashes before flush.",
      "Cache layers: Browser cache → CDN → API Gateway cache → Application cache (Redis) → Database query cache. Each layer has different TTLs and invalidation strategies.",
      "Eviction policies: LRU (Least Recently Used — best general-purpose), LFU (Least Frequently Used — good for skewed access patterns), TTL (Time-To-Live — simplest, set-and-forget).",
    ],
    commonMistakes: [
      "Caching everything with long TTLs — leads to serving stale data and mysterious 'why doesn't my update show up?' bugs.",
      "Not planning for cache stampedes — when a popular cache key expires, hundreds of requests simultaneously hit the database. Use request coalescing or probabilistic early expiration.",
      "Using cache as primary storage — if your app breaks when Redis goes down, you don't have a cache, you have a database with no durability guarantees.",
    ],
    interviewTip: "Always specify the caching strategy by name (cache-aside, write-through, etc.) and explain WHY you chose it for the specific use case. 'We use cache-aside for user profiles because they're read-heavy and can tolerate 60 seconds of staleness.'",
    practitionerNote: "The most impactful caching decision I've made was NOT caching. For the AI platform's model responses, we initially cached LLM outputs by prompt hash. But prompts with slight variations produced different hashes, giving us a 3% hit rate. We removed the cache, saved the Redis cost, and invested in optimizing the model inference pipeline instead.",
  },
  {
    id: "sharding",
    title: "Database Sharding",
    icon: "🔪",
    category: "storage",
    oneLiner: "Split a database horizontally across multiple servers — each shard holds a subset of the data.",
    theRealProblem: "Your single database is at its limit — 10TB of data, 50K queries/second. Vertical scaling (bigger machine) has a ceiling. Sharding distributes data across multiple databases. But choosing the wrong shard key can make things worse, and cross-shard queries become your new nightmare.",
    howItActuallyWorks: [
      "Choose a shard key — the field that determines which shard holds a given row. Common choices: user_id, tenant_id, geographic region.",
      "Hash-based sharding: hash(shard_key) % num_shards → deterministic, even distribution, but rebalancing when adding shards is painful (consistent hashing helps).",
      "Range-based sharding: shard by date ranges or ID ranges. Easy to understand, but creates hotspots (the 'current month' shard gets all the writes).",
      "Directory-based sharding: a lookup table maps keys to shards. Most flexible, but the directory is a single point of failure.",
      "Cross-shard queries (joins, aggregations) require a scatter-gather pattern — query all shards, merge results. This is slow and complex.",
    ],
    commonMistakes: [
      "Sharding too early — it adds massive complexity. Exhaust vertical scaling, read replicas, and caching first.",
      "Choosing a shard key that creates hotspots — e.g., sharding by created_date means all new writes hit one shard.",
      "Ignoring cross-shard operations — if your app frequently queries across shard boundaries, you haven't gained much.",
    ],
    interviewTip: "Before proposing sharding, explicitly state what you've already tried (read replicas, caching, query optimization). Then explain your shard key choice and why it distributes load evenly for THIS specific access pattern.",
    practitionerNote: "In my experience, most systems that think they need sharding actually need better indexing, query optimization, or a caching layer. I've seen a 50x query improvement from adding a composite index, which is cheaper than any sharding strategy. Shard only when you've genuinely exhausted simpler options.",
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting",
    icon: "🚦",
    category: "networking",
    oneLiner: "Control how many requests a client can make in a given time window to protect your system.",
    theRealProblem: "Without rate limiting, a single misbehaving client (or attacker) can consume all your capacity and deny service to everyone else. But rate limiting that's too aggressive blocks legitimate traffic. The challenge is being precise enough to stop abuse without hurting real users.",
    howItActuallyWorks: [
      "Token Bucket: a bucket fills with tokens at a steady rate. Each request consumes one token. When the bucket is empty, requests are rejected. Allows short bursts (bucket can be larger than the rate). Most common algorithm.",
      "Sliding Window: count requests in a rolling time window. More precise than fixed windows but requires more storage (tracking each request timestamp).",
      "Fixed Window: count requests per fixed interval (e.g., per minute). Simple but has edge effects — a client can send 2x the limit by timing requests across the window boundary.",
      "Distributed rate limiting: in a multi-server setup, each server needs to know the global count. Options: centralized counter in Redis (adds latency), or local counters with periodic sync (allows some over-limit requests).",
      "Rate limit headers: always return X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset so clients can self-regulate.",
    ],
    commonMistakes: [
      "Rate limiting by IP address — breaks for users behind corporate NATs (thousands of users sharing one IP).",
      "Not differentiating between endpoints — a 100 req/min limit on both GET /health and POST /payment is wrong. Payment should be much lower.",
      "Returning 500 instead of 429 — clients should know they're being rate limited, not that your server crashed.",
    ],
    interviewTip: "Mention the algorithm by name (token bucket, sliding window) and explain the trade-offs. Then discuss where the rate limiter lives (API Gateway, middleware, service mesh sidecar) and how state is shared across instances.",
    practitionerNote: "At BMO's API Gateway, we layered rate limits: per-API-key limits at the gateway level (Cognito + custom Lambda authorizer), per-endpoint limits in the service, and per-tenant limits in the application logic. The gateway caught 99% of abuse before it reached application code.",
  },
  {
    id: "consistent-hashing",
    title: "Consistent Hashing",
    icon: "🎯",
    category: "fundamentals",
    oneLiner: "Distribute data across nodes so that adding or removing a node only moves a fraction of the data.",
    theRealProblem: "Traditional hashing (hash(key) % N) breaks when N changes. Add one server, and almost every key maps to a different server — causing a cache stampede as all keys need to be re-fetched. In a 100-node cluster, adding one node invalidates 99% of keys.",
    howItActuallyWorks: [
      "Imagine a circular hash space (0 to 2^32). Each node is placed on the circle at hash(node_id).",
      "Each key is placed on the circle at hash(key). A key is assigned to the first node encountered clockwise.",
      "When a node is added, only keys between the new node and its predecessor need to move — roughly 1/N of all keys.",
      "Virtual nodes: each physical node gets multiple positions on the circle (e.g., 150 virtual nodes per physical node). This ensures even distribution and prevents hotspots.",
      "Used in: DynamoDB, Cassandra, Memcached, CDN routing, and most distributed caches.",
    ],
    commonMistakes: [
      "Using too few virtual nodes — leads to uneven distribution. Amazon recommends 150+ virtual nodes per physical node.",
      "Not accounting for heterogeneous hardware — a machine with 2x the RAM should get 2x the virtual nodes.",
      "Forgetting that consistent hashing only solves the data placement problem — you still need replication for durability.",
    ],
    interviewTip: "Draw the hash ring. Place 3-4 nodes. Show how adding a node only moves a small slice of keys. Mention virtual nodes as the solution to uneven distribution. This visual explanation is much more convincing than describing the algorithm verbally.",
    practitionerNote: "I don't implement consistent hashing from scratch — I use services that implement it (DynamoDB, ElastiCache). But understanding the algorithm helped me debug a production issue where uneven key distribution was causing one ElastiCache node to OOM while others were at 30% utilization. The fix: better key design, not more nodes.",
  },
  {
    id: "cdn",
    title: "CDN & Edge Computing",
    icon: "🌍",
    category: "networking",
    oneLiner: "Cache content at edge locations close to users to reduce latency and origin server load.",
    theRealProblem: "Your server is in us-east-1. A user in Tokyo makes a request. The round-trip time is 200ms before your server even starts processing. Multiply by every asset on the page, and you've added seconds of latency that no server optimization can fix.",
    howItActuallyWorks: [
      "A CDN has Points of Presence (PoPs) worldwide. When a user requests content, the nearest PoP serves it.",
      "Cache HIT: the PoP has the content cached → serves it directly (< 20ms latency). Cache MISS: PoP fetches from origin, caches it, then serves.",
      "TTL controls how long content stays cached. Static assets (images, CSS, JS): long TTLs (days/weeks). API responses: short TTLs (seconds/minutes) or no caching.",
      "Cache invalidation: purge specific paths, use versioned URLs (app.v2.js), or set Cache-Control headers.",
      "Edge compute (CloudFront Functions, Cloudflare Workers): run code at the PoP. Use for A/B testing, header manipulation, geo-routing, or simple API responses without hitting the origin.",
    ],
    commonMistakes: [
      "Caching user-specific content without Vary headers — serving User A's dashboard to User B.",
      "Not versioning static assets — users stuck with old cached JS/CSS after a deploy.",
      "Setting cache headers on HTML pages with long TTLs — makes cache invalidation impossible for content updates.",
    ],
    interviewTip: "Show the CDN as the first layer of your architecture. Explain what it caches (static assets always, API responses sometimes, user-specific data never). Mention cache invalidation strategy and edge compute for lightweight logic.",
    practitionerNote: "The biggest CDN win I've seen wasn't static assets — it was caching API responses at the edge with 5-second TTLs. A product catalog API went from 150ms (origin) to 8ms (edge hit) with near-real-time freshness. That single change reduced origin load by 85%.",
  },
  {
    id: "db-replication",
    title: "Database Replication",
    icon: "📋",
    category: "reliability",
    oneLiner: "Copy data across multiple database instances for redundancy, read scaling, and disaster recovery.",
    theRealProblem: "A single database is a single point of failure. If it goes down, your entire application goes down. Even if it stays up, a single instance can only handle so many queries. Replication solves both — but introduces consistency challenges.",
    howItActuallyWorks: [
      "Primary-Replica (Master-Slave): one primary handles all writes. Replicas asynchronously copy changes and serve read queries. Write capacity doesn't scale, but read capacity scales linearly.",
      "Synchronous replication: primary waits for replica to confirm before acknowledging the write. Zero data loss, but higher write latency.",
      "Asynchronous replication: primary acknowledges immediately, replica catches up later. Lower latency, but replica can be behind (replication lag). If primary crashes, recent writes may be lost.",
      "Multi-Primary (Master-Master): multiple nodes accept writes. Requires conflict resolution (last-write-wins, merge, or application-level). Complex but enables multi-region writes.",
      "Failover: when primary dies, a replica is promoted. Automated failover (RDS Multi-AZ) vs manual failover (operational risk).",
    ],
    commonMistakes: [
      "Reading from replicas immediately after writing and expecting to see the new data — replication lag means the replica is behind.",
      "Not testing failover regularly — automated failover that hasn't been tested is automated uncertainty.",
      "Using multi-primary replication without understanding conflict resolution — leads to silent data corruption.",
    ],
    interviewTip: "Specify whether replication is synchronous or asynchronous and explain the trade-off. Mention replication lag for async and the read-after-write consistency problem. Describe the failover strategy.",
    practitionerNote: "At BMO, we ran PostgreSQL with synchronous replication across AZs for the API registry. The primary in us-east-1a, replica in us-east-1b. When 1a had a hardware failure, RDS promoted the replica in under 30 seconds. Zero data loss, zero manual intervention. The key was testing this failover quarterly — in one test we discovered that our connection strings didn't properly follow the DNS CNAME switch.",
  },
  {
    id: "message-queues",
    title: "Message Queues & Streaming",
    icon: "📨",
    category: "reliability",
    oneLiner: "Buffer messages between producers and consumers to decouple processing speed and handle traffic spikes.",
    theRealProblem: "Your web server processes an order in 200ms. But sending the confirmation email takes 3 seconds, updating the inventory takes 1 second, and notifying the warehouse takes 500ms. If you do all of this synchronously, the user waits 5 seconds. If any downstream service is slow, the user experience degrades.",
    howItActuallyWorks: [
      "Queue (SQS, RabbitMQ): point-to-point. A message is delivered to exactly one consumer. Good for task distribution. The queue guarantees at-least-once delivery.",
      "Topic/Stream (SNS, Kafka, EventBridge): pub-sub. A message is delivered to all subscribers. Good for event broadcasting. Each subscriber maintains its own position (offset).",
      "Dead Letter Queue (DLQ): messages that fail processing after N retries are moved to a DLQ for investigation. Without a DLQ, poison messages block the queue forever.",
      "Ordering guarantees: SQS FIFO guarantees order within a message group. Kafka guarantees order within a partition. Standard SQS provides no ordering guarantee.",
      "Backpressure: when consumers can't keep up, messages accumulate in the queue. The queue acts as a buffer. Monitor queue depth to detect when consumers are falling behind.",
    ],
    commonMistakes: [
      "Not making consumers idempotent — at-least-once delivery means the same message may be processed twice.",
      "Ignoring DLQs — without them, a single malformed message can block the entire queue.",
      "Using queues for real-time communication — queues add latency. If you need sub-100ms delivery, use WebSockets or server-sent events.",
    ],
    interviewTip: "Explain the difference between a queue (competing consumers) and a topic (fan-out). Choose the right one for the scenario. Always mention DLQs, idempotency, and ordering guarantees.",
    practitionerNote: "The most valuable queue metric isn't throughput — it's Age of Oldest Message. If this number is growing, your consumers are falling behind. We alarmed on this metric for every SQS queue in the CI/CD platform. A growing age meant a Lambda was failing silently, and the DLQ caught the evidence.",
  },
  {
    id: "api-design",
    title: "API Design Principles",
    icon: "🔌",
    category: "fundamentals",
    oneLiner: "Design APIs that are intuitive, consistent, and evolvable — because your API is a contract with the future.",
    theRealProblem: "A bad API is worse than no API. It creates dependencies that are impossible to change. Every consumer hard-codes your mistakes. The cost of a poorly designed API grows exponentially with the number of consumers. Getting it right on the first try is worth 10x the time investment.",
    howItActuallyWorks: [
      "Resource-oriented design: URLs represent nouns (/orders, /users/123), not verbs (/getUser, /createOrder). HTTP methods provide the verbs (GET, POST, PUT, DELETE).",
      "Versioning: URL path (/v1/orders) or header (Accept: application/vnd.api.v2+json). Path versioning is simpler and more visible. Never break backwards compatibility within a version.",
      "Pagination: cursor-based (opaque token, no skipping) beats offset-based (skip 100, take 20) for large datasets. Offset pagination breaks when rows are inserted during paging.",
      "Error responses: structured, consistent format. Include error code, human-readable message, and a link to documentation. Never return HTML error pages from an API.",
      "Idempotency: POST /orders with an Idempotency-Key header ensures that retrying a failed request doesn't create duplicate orders. Essential for payment APIs.",
    ],
    commonMistakes: [
      "Exposing internal data models as API resources — couples your API to your database schema. Use DTOs.",
      "Returning 200 OK with an error body — clients check HTTP status codes, not response bodies.",
      "Not implementing pagination from day one — adding it later is a breaking change.",
    ],
    interviewTip: "When designing an API in a system design interview, write out 3-4 endpoint examples with request/response shapes. Show versioning strategy, error format, and pagination. This level of detail demonstrates real-world experience.",
    practitionerNote: "At BMO, the API Gateway team reviewed every API design before deployment. Our review checklist: consistent naming, proper HTTP methods, structured errors, pagination, versioning, and rate limit headers. The 30-minute review saved weeks of support requests from confused consumers.",
  },
];
