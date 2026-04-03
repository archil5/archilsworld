export type AICategory = "rag" | "graphrag" | "agents" | "llmops" | "enterprise" | "embeddings" | "context" | "prompts";
export type AIDepth = "intermediate" | "advanced" | "expert";

export interface AITopic {
  id: string;
  title: string;
  icon: string;
  category: AICategory;
  depth: AIDepth;
  oneLiner: string;
  theRealProblem: string;
  howItActuallyWorks: string[];
  productionGotchas: string[];
  archilNote: string;
  interviewAngle: string;
}

export const AI_CATEGORIES: { value: AICategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "rag", label: "RAG" },
  { value: "graphrag", label: "GraphRAG" },
  { value: "agents", label: "Agents" },
  { value: "llmops", label: "LLMOps" },
  { value: "enterprise", label: "Enterprise AI" },
  { value: "embeddings", label: "Embeddings" },
  { value: "context", label: "Context" },
  { value: "prompts", label: "Prompts" },
];

export const AI_TOPICS: AITopic[] = [
  {
    id: "rag-beyond-basics",
    title: "RAG: Beyond the Basics",
    icon: "🔍",
    category: "rag",
    depth: "advanced",
    oneLiner: "Naive RAG is a prototype. Production RAG is a system engineering problem.",
    theRealProblem:
      "Most people implement RAG as: chunk document → embed → store → retrieve top-k → stuff into prompt → done. That works for demos. In production it fails constantly — wrong chunks get retrieved, the LLM hallucinates context it was never given, and precision drops off a cliff on complex queries. The real problem is that retrieval is a ranking problem, not a lookup problem. You're not finding documents; you're finding the right evidence for the exact question being asked.",
    howItActuallyWorks: [
      "Ingestion is where most pipelines fail first. Fixed-size chunking (e.g. 512 tokens) destroys semantic coherence — a paragraph about risk management gets split mid-sentence and both halves become useless. Semantic chunking groups by meaning using a sliding window + similarity threshold. Hierarchical chunking stores both full documents and fine-grained chunks, then retrieves at multiple granularities depending on query type.",
      "Query transformation matters more than chunk size. Raw user queries are often underspecified. HyDE (Hypothetical Document Embedding) generates a synthetic answer first, then embeds that — because the hypothetical answer will be closer to real documentation in embedding space than the bare question. Multi-query expansion generates 3-5 rephrasings and unions the results.",
      "Hybrid search — dense vector retrieval plus BM25 keyword search combined via Reciprocal Rank Fusion — consistently outperforms either alone. Dense retrieval captures semantic similarity; BM25 captures exact terminology (critical for technical docs with specific product names, error codes, regulation numbers).",
      "Reranking is the highest-leverage improvement most pipelines skip. Bi-encoder retrieval (your embedding model) is fast but imprecise. Cross-encoder reranking (like Cohere Rerank or BGE-Reranker) reads query and each candidate chunk together — far more accurate but expensive. Run retrieval at top-50, rerank to top-5. The latency cost is worth it.",
      "Contextual compression then strips irrelevant sentences from the retrieved chunks before they hit the LLM context window. Retrieved chunks are rarely 100% relevant — compressing them to the relevant spans improves answer quality and reduces token cost.",
    ],
    productionGotchas: [
      "The lost-in-the-middle problem: LLMs attend strongly to the beginning and end of their context window. Evidence buried in the middle gets systematically ignored. Order your retrieved chunks with highest-confidence first and last, not in retrieval score order.",
      "Embedding model mismatch: the model you use at ingestion time must be identical to query time — including version. OpenAI changed text-embedding-ada-002 behaviour in a minor update and broke retrieval for teams who had pre-indexed with the old version.",
      "Chunk boundary bleed: if a table or code block straddles a chunk boundary, neither chunk makes sense independently. Use document-structure-aware chunkers (Unstructured.io, LlamaParse for PDFs) that respect headings, tables, and code blocks.",
      "Retrieval recall vs precision trade-off: fetching more chunks (top-50) improves recall but filling the context window with irrelevant material actively hurts answer quality. Reranking + contextual compression resolves this tension.",
      "Stale vector indexes: when source documents update, you need incremental re-indexing. Naive full re-index on every update doesn't scale. Track document hashes, only re-embed changed chunks.",
    ],
    archilNote:
      "At BMO, we implemented a dual-RAG pattern — vanilla vector RAG for narrow factual lookups, GraphRAG for complex relationship queries. The switching logic was based on query classification: if the query contained relational language ('how does X relate to Y', 'what entities are connected to Z'), we routed to GraphRAG. For direct lookups ('what is the policy on X'), vector RAG. The hybrid approach gave us 40% better answer relevance on complex queries vs pure vector retrieval.",
    interviewAngle:
      "When asked 'how would you improve RAG quality' — most candidates say 'better chunking' or 'bigger embedding model'. The real answer is a reranking pass and query transformation. Interviewers who know RAG deeply will probe whether you understand the retrieval-quality ceiling of bi-encoders vs cross-encoders.",
  },

  {
    id: "graphrag-knowledge-graphs",
    title: "GraphRAG & Knowledge Graphs",
    icon: "🕸️",
    category: "graphrag",
    depth: "expert",
    oneLiner: "Vector search finds similar documents. GraphRAG traverses relationships between entities. These are fundamentally different retrieval problems.",
    theRealProblem:
      "Dense vector retrieval operates on semantic similarity. It answers 'what documents are about similar topics?' — excellent for single-hop lookups. But many real enterprise queries are relational: 'What are the downstream dependencies of Component X?', 'Which compliance controls apply to all systems that handle PII and connect to external APIs?', 'What were the cascading impacts of the 2023 service disruption?'. These require traversing a graph of entity relationships — something cosine similarity cannot do. Vector search returns the most similar chunk; GraphRAG follows edges.",
    howItActuallyWorks: [
      "Entity extraction is the first step. Run Named Entity Recognition (NER) across all documents to identify people, organizations, systems, policies, concepts, and their relationships. Fine-tuned NER models significantly outperform generic spaCy models on domain-specific text (banking, healthcare, legal). Each entity becomes a node; each relationship becomes a directed edge.",
      "Entity resolution deduplicates. 'Azure OpenAI', 'Azure Open AI', 'AOAI', and 'Azure OpenAI Service' are the same entity. Without resolution your graph has four orphaned nodes instead of one connected node. Blocking strategies (similarity threshold + attribute matching) identify candidate pairs; a classifier decides whether to merge.",
      "Community detection (Leiden or Louvain algorithm) clusters the graph into semantically coherent communities — groups of entities that are densely connected to each other and sparsely connected to the rest. Each community gets summarized into a 'community report' — a high-level description of what that cluster represents. These reports become queryable themselves.",
      "Query processing in GraphRAG: the question is decomposed into entity mentions and relationship assertions. Entity mentions are linked to graph nodes (entity linking). The retriever then traverses edges from those seed nodes — local search for depth-first traversal of specific entity neighborhoods, global search for querying across community summaries for high-level synthesis questions.",
      "Multi-hop reasoning: GraphRAG can chain traversals. 'What teams are responsible for systems that process financial transactions and have open security findings?' requires: find 'financial transaction' entities → traverse to connected systems → traverse to responsible teams → filter by open security findings. Four hops. Vector search would hallucinate this. Graph traversal computes it.",
    ],
    productionGotchas: [
      "Graph construction cost is high upfront. Entity extraction + resolution + community detection on a million-document corpus takes hours. Design your pipeline for incremental updates: add new entities and edges, only re-run community detection when the graph structure changes significantly.",
      "Entity resolution false positives destroy the graph. Merging two distinct entities (two people with the same name) creates incorrect relationships and propagates bad information through every query that touches those nodes. Err on the side of under-merging; add disambiguation context to entity names.",
      "Community summaries go stale. When underlying documents update, the community summaries (generated by LLM) don't automatically refresh. Track which documents feed into which communities and invalidate summaries when source content changes.",
      "GraphRAG is expensive at query time. Local search (entity neighborhood) is fast. Global search (across all community summaries) is slow and token-heavy — it runs a map-reduce over hundreds of community reports. Reserve global search for genuinely synthesis-type questions.",
      "Cosmos DB for GraphRAG (our stack) requires careful partition key design. Partitioning by entity type gives hot partitions for high-frequency types (Person, System). Partition by entity ID hash for uniform distribution.",
    ],
    archilNote:
      "The use case that made GraphRAG non-negotiable for us was regulatory impact analysis. When a new OSFI guideline landed, the question was always: 'Which of our systems are affected and what controls need updating?' That's a graph query — policy → applicable systems → responsible teams → existing controls. Vector search kept returning documents about similar policies. GraphRAG traversed to the actual answer. The engineering cost was real but the query quality difference was impossible to ignore.",
    interviewAngle:
      "GraphRAG vs vector RAG is an increasingly common interview question at AI-focused companies. The nuanced answer: they're complementary, not competitive. Vector RAG for high-volume factual lookups; GraphRAG for low-volume relational queries. The engineering cost of GraphRAG (graph construction, maintenance, entity resolution) is only justified when your query patterns are genuinely relational.",
  },

  {
    id: "agentic-ai-patterns",
    title: "Agentic AI: Production Patterns",
    icon: "🤖",
    category: "agents",
    depth: "expert",
    oneLiner: "An agent that works in a demo and an agent that works in production are completely different systems.",
    theRealProblem:
      "Agentic AI is where the gap between demos and production is widest. A demo agent runs 3 steps on a clean input and works perfectly. A production agent runs 50 steps on ambiguous inputs, hits rate limits, receives malformed tool outputs, gets confused mid-chain, loops indefinitely, and makes expensive API calls for free. The core engineering problem isn't making agents smart — it's making agents reliable, bounded, and recoverable.",
    howItActuallyWorks: [
      "The ReAct (Reason + Act) loop is the foundation. On each step: the LLM reasons about the current state, selects a tool + parameters, receives the tool result, reasons again. The key insight is that reasoning and acting are interleaved — the agent is continuously re-evaluating whether its plan is still correct given new information. This is fundamentally different from a static chain-of-thought.",
      "Tool calling mechanics: tools are described to the model as JSON schemas (name, description, parameter types, required fields). The model outputs structured JSON specifying which tool to call and with what arguments. Your orchestration layer validates the schema, executes the tool, and returns the result as a tool message. Bad tool descriptions are the #1 source of tool misuse — be obsessively specific about what each tool does and does NOT do.",
      "Multi-agent orchestration patterns: Supervisor pattern — one orchestrator LLM decides which specialist agent handles each subtask (better for complex routing decisions). Parallel pattern — multiple agents run simultaneously on independent subtasks, results are merged (better for research/information gathering). Sequential pattern — output of each agent feeds the next (better for multi-stage transformation pipelines). Choose based on whether tasks are independent or dependent.",
      "Memory systems: In-context memory is everything in the current conversation window (expensive, bounded). External memory is a vector store of past interactions (persistent, queryable). Episodic memory stores complete past 'episodes' — full agent runs with inputs, steps, and outcomes — for retrospective learning. Production agents need all three: context for immediate coherence, external for long-term recall, episodic for debugging and improvement.",
      "Guardrails for production: input validation (refuse malformed or out-of-scope requests before the agent starts), step budget (hard cap on the number of reasoning steps — an agent that loops 50 times costs you money and returns garbage), output validation (check that tool calls reference valid entities, that the final answer is grounded in retrieved context), circuit breakers (if the same tool call has failed 3 times with the same parameters, abort rather than retry).",
    ],
    productionGotchas: [
      "Silent failures are the worst failure mode. An agent that errors loudly is easy to debug. An agent that completes successfully but produces wrong output with high confidence is a production disaster. Implement output grounding checks — verify that claims in the final answer have citation support from the retrieved context.",
      "Infinite loops don't look like loops. The agent may alternate between two valid-looking actions (search → analyse → search → analyse) without converging. Detect this by hashing (tool name + parameters) for each step and aborting if you see a repeat within the same run.",
      "Tool call hallucination: models sometimes call tools with parameters that don't exist (hallucinated field names) or with values that look plausible but are fabricated. Strict Pydantic validation on tool inputs catches this before execution.",
      "Latency stacking: a 5-step agent with 2s per LLM call + 1s per tool call = 15s total. That's unacceptable for interactive use. Use streaming for user-facing responses so users see progress during reasoning steps. Run independent subtasks in parallel. Cache deterministic tool results.",
      "Cost explosion: an agent in a feedback loop can make hundreds of LLM calls before hitting your budget limit. Implement per-run token budgets and alert on unusual consumption patterns. A single runaway agent shouldn't cost you $50.",
    ],
    archilNote:
      "The hardest problem we faced with Agentic AI at BMO was non-determinism in compliance-sensitive workflows. The same input could produce different tool call sequences on different runs — acceptable for research tasks, completely unacceptable for anything touching customer data or regulatory reporting. Our solution: for deterministic workflows, use structured orchestration (Step Functions) where the agent decides what to do but a state machine enforces the sequence. For exploratory workflows, pure agentic. The hybrid approach gave us the intelligence of agents without the unpredictability.",
    interviewAngle:
      "When asked about agent architectures, describe the failure modes before describing the happy path. Interviewers who've built production agents know the failure modes are the hard part. Mentioning circuit breakers, step budgets, and output grounding immediately signals you've operated these systems rather than just read about them.",
  },

  {
    id: "llmops-lifecycle",
    title: "LLMOps: The Production Discipline",
    icon: "⚙️",
    category: "llmops",
    depth: "advanced",
    oneLiner: "LLMOps is MLOps plus the specific chaos that comes from probabilistic outputs and non-deterministic behaviour.",
    theRealProblem:
      "The software engineering practices that work for deterministic systems break down for LLMs. You can't unit-test a prompt like you unit-test a function — the same prompt returns different outputs on different runs. Traditional ML model monitoring (track accuracy vs ground truth) doesn't work when ground truth is a human judgment call. Versioning a prompt feels trivial until you discover that changing two words shifted 8% of your outputs from 'correct' to 'hallucinated'. LLMOps is about building the infrastructure to catch these problems before they reach production and trace them back to cause when they do.",
    howItActuallyWorks: [
      "Prompt versioning: treat every prompt as source code. Store prompts in a registry with semantic versioning (major.minor.patch — major for structural changes, minor for wording, patch for typo fixes). Tag every LLM response with the exact prompt version that generated it. This means you can bisect production quality degradation to a specific prompt change, the same way you'd bisect a bug to a specific commit.",
      "Evaluation harnesses: RAGAS (Retrieval Augmented Generation Assessment) gives you automated metrics — faithfulness (is the answer grounded in retrieved context?), answer relevance (does the answer address the question?), context precision (what fraction of retrieved context was actually used?), context recall (did retrieval find the relevant documents?). Run these on a held-out eval set on every prompt version change before deploying.",
      "LLM-as-judge: for outputs where you can't define a ground truth (summarization quality, response tone, reasoning coherence), use a stronger LLM (GPT-4o) to evaluate the output of your deployed model. This scales to thousands of evaluations without human labor. Calibrate the judge against human annotations first to quantify its reliability.",
      "A/B testing models: shadow deployment routes a percentage of real traffic to the new model version while continuing to serve the old version to users. Collect both outputs, evaluate with LLM-as-judge on the shadow responses, promote to production only when evaluation metrics are statistically significantly better. Never update a production model without a shadow period.",
      "Drift detection: semantic drift means the distribution of user queries shifts over time — your eval set stops representing real traffic. Track query embedding distributions (PCA or t-SNE) over time; when the cluster shape changes significantly, refresh your eval set. Accuracy drift means model quality changes without query distribution changes — often caused by upstream model updates from providers (especially for API-hosted models).",
    ],
    productionGotchas: [
      "Provider model updates will silently break you. Azure OpenAI updates model versions on a schedule. A system prompt that worked perfectly on gpt-4-0613 may produce systematically different outputs on gpt-4-0125. Pin to specific model versions in production. Test new versions in shadow before allowing the update.",
      "Eval set contamination: if your eval set was created from past model outputs (common when bootstrapping), you're measuring self-consistency rather than accuracy. Ground truth must come from human judgment or verifiable external sources.",
      "The temperature trap: temperature=0 feels 'deterministic' but isn't — different sampling seeds still produce variation, and some models explicitly document that temperature=0 doesn't guarantee identical outputs. Use it for consistency, not for testing.",
      "Cost attribution goes wrong at scale. When you have 20 different prompts each making LLM calls, token costs blur together. Tag every API call with a prompt ID and workflow ID. Your cost monitoring should show you which specific prompt version and which user workflow is responsible for spend spikes.",
      "Human feedback loops decay in quality. Thumbs up/down ratings drift in meaning as users become habituated (they rate faster and think less). Interleave targeted evaluation tasks (binary preference tests between two outputs) with passive feedback collection.",
    ],
    archilNote:
      "The LLMOps piece that surprised me most was how much prompt versioning mattered in practice. In six months of running our enterprise AI platform, we made 47 prompt changes across our various workflows. Without versioning, we would have had no way to correlate the quality regression we saw in week 14 with the 'minor wording improvement' made in week 12. With the registry, it took us 20 minutes to bisect, revert, and confirm. The tooling felt like overhead until the first time it saved us.",
    interviewAngle:
      "LLMOps is a differentiator in interviews for senior AI roles. Most candidates can describe a RAG pipeline. Far fewer can describe how they'd manage prompt versioning, detect drift, and A/B test models in production. Speaking to RAGAS, LLM-as-judge, and shadow deployments signals operational maturity.",
  },

  {
    id: "enterprise-ai-constraints",
    title: "Enterprise AI: The Real Constraints",
    icon: "🔐",
    category: "enterprise",
    depth: "expert",
    oneLiner: "Building AI in a regulated environment means every architectural decision is a security and compliance decision first.",
    theRealProblem:
      "Every AI tutorial assumes you can send data to an API. In banking, healthcare, or any regulated industry, that assumption is invalid by default. PII, financial transaction data, and proprietary models cannot touch public infrastructure. The question isn't 'how do I build a RAG system?' — it's 'how do I build a RAG system where no data ever leaves our private network, every access is authenticated and authorized, all data at rest is encrypted with our own keys, and I can prove all of that to an auditor?' That's a fundamentally harder engineering problem.",
    howItActuallyWorks: [
      "Private networking means zero public endpoints. Every service in your AI stack — the LLM API, vector database, blob storage, key vault — communicates exclusively over Azure Private Endpoints or AWS VPC Endpoints. Traffic never traverses the public internet. In practice this means provisioning a Private DNS Zone for each service so your VNet resolves the service's public hostname to its private IP. Without this, even 'private' services have their management plane exposed.",
      "User Managed Identities (UMI) replace API keys and connection strings. Instead of storing a key to access Azure AI Search, your application's managed identity is granted the 'Search Index Data Reader' role. The identity is authenticated via Azure AD token, not a secret. No secrets in environment variables, no secrets in config files, no credential rotation. When an identity is compromised, you revoke the role assignment — not hunt through every service that was using the shared key.",
      "Customer Managed Keys (CMK) for encryption at rest: the data in your vector index, your LLM outputs stored in Cosmos DB, your embeddings in blob storage — all encrypted with keys that live in your Azure Key Vault, not in the service's managed encryption. You control the key lifecycle. If a compliance requirement demands it, you can revoke the key and the data becomes cryptographically inaccessible. OSFI and PIPEDA both have provisions that CMK satisfies.",
      "Content safety as a layer, not an afterthought. Azure Content Safety API provides category-level harm detection (violence, self-harm, sexual content, hate speech) with configurable severity thresholds. But for enterprise AI, you also need custom content safety: detection of PII in outputs (model may leak training data patterns), detection of confidential internal terminology in responses meant for external users, prompt injection detection (users crafting inputs designed to override system prompts).",
      "Hallucination guardrails require architectural enforcement, not just prompting. Prompting the model to 'only answer based on provided context' is insufficient — models ignore this instruction regularly. Implement grounding checks: extract claims from the LLM output, verify each claim has a supporting passage in the retrieved context (using embedding similarity or a dedicated claim-extraction LLM), reject or flag responses where claims exceed a grounding threshold.",
    ],
    productionGotchas: [
      "Private DNS resolution is the most common operational failure. If your Private DNS Zone isn't linked to every VNet that needs to resolve the private endpoint, those VNets resolve the service's public hostname — and if the service blocks public access, you get a cryptic connection timeout rather than a clear error.",
      "CMK adds latency. Every encryption/decryption operation calls Key Vault. At scale (high-volume vector searches), Key Vault rate limits become a real constraint. Use Key Vault caching — cache the data encryption key in memory within the service, only call Key Vault when the cache expires or a new key version is needed.",
      "Content safety false positives in technical domains. A content safety filter trained on consumer internet data will flag legitimate discussions of financial risk, security vulnerabilities, or medical procedures. Tune thresholds for your domain and establish an appeals/override process for legitimate false positives.",
      "PIPEDA 'right to be forgotten' requires deleting data from vector indexes. A customer's personal data embedded in your vector store cannot just be 'logically deleted' — you need to actually remove the embedding vectors (and potentially re-embed documents that referenced the individual). Most vector databases support filtered deletion; test this before you need it in a compliance audit.",
      "Model governance for regulated AI: in Canada, OSFI expects you to document model risk assessment, validate model outputs against defined performance thresholds, and have a model change management process. 'We swapped the model and it seemed better' is not acceptable. Every model change requires a documented evaluation result.",
    ],
    archilNote:
      "The regulatory constraint that caught us most off guard was around AI model explainability. OSFI's B-10 guideline on model risk management expects you to be able to explain why a model produced a specific output — for a black-box LLM, that's fundamentally difficult. Our solution: for any decision that affects a customer (loan eligibility, fraud flag, etc.), the LLM output must include explicit citations to the documents or rules that support its conclusion. We architected the retrieval pipeline specifically to preserve citation chains, so every output is traceable. Explainability wasn't optional — it was a regulatory requirement we had to engineer around.",
    interviewAngle:
      "Enterprise AI architecture questions probe whether you understand the gap between 'AI that works' and 'AI that's compliant'. If you can speak to private endpoints, CMK, UMI, content safety layers, and grounding checks without prompting, you immediately signal production experience in regulated environments. Most candidates who've only worked at startups have never needed to think about any of this.",
  },

  {
    id: "embeddings-under-the-hood",
    title: "Embeddings: Under the Hood",
    icon: "📐",
    category: "embeddings",
    depth: "advanced",
    oneLiner: "An embedding is a point in high-dimensional space. Everything about retrieval quality flows from understanding what 'close' means in that space.",
    theRealProblem:
      "Most teams treat embeddings as a black box — send text in, get vector out, store it, query it. The problem is that when retrieval quality is bad, they have no framework for diagnosing why. Is it the chunking? The embedding model? The similarity metric? The index configuration? Without understanding how embeddings actually work, you're debugging by guessing. And embedding quality problems are uniquely hard to debug because everything seems to 'work' — you get retrieval results, they're just not the right ones.",
    howItActuallyWorks: [
      "Embedding models map variable-length text to a fixed-dimensional vector (768, 1536, or 3072 dimensions depending on model). The training objective is contrastive: texts that are semantically related are pulled close together in the vector space; texts that are unrelated are pushed apart. This is typically achieved via in-batch negative training or hard negative mining with curated pairs. The key: 'similar' in embedding space means 'semantically related' as defined by the model's training distribution.",
      "Cosine similarity measures the angle between two vectors, not their magnitude. Two vectors pointing in the same direction have cosine similarity of 1 regardless of their lengths. This is preferable to Euclidean distance for text embeddings because the magnitude of an embedding vector correlates with the length of the source text — a 3-word sentence and a 300-word document about the same topic should have high similarity, but their magnitudes will differ wildly.",
      "The curse of dimensionality makes high-dimensional similarity deceptive. In 1536 dimensions, the ratio of the distance to the nearest neighbour vs the farthest neighbour approaches 1 — meaning all points become approximately equally 'close'. This manifests as retrieval returning results that all have suspiciously similar similarity scores. Dimensionality reduction (Matryoshka embeddings allow truncating to lower dimensions) or hybrid search with lexical signals helps.",
      "Domain mismatch is the most common retrieval quality problem. General-purpose embedding models (text-embedding-ada-002, e5-large) are trained on internet text. If your documents contain specialised domain terminology (banking regulation codes, medical device nomenclature, legal citations), the model may not have seen enough training examples to place domain terms accurately in the vector space. Fine-tuning with domain-specific positive/negative pairs significantly improves retrieval for specialised corpora.",
      "Late chunking (ColBERT-style) generates token-level embeddings rather than a single document embedding. Instead of one vector per chunk, you get one vector per token. At query time, MaxSim (maximum similarity across all token pairs) is used instead of cosine similarity. This preserves fine-grained term information that gets averaged away in single-vector embeddings — particularly valuable for precise technical retrieval where specific terms must match.",
    ],
    productionGotchas: [
      "Never compare embeddings across models. If you upgrade your embedding model, you must re-embed the entire corpus. Mixing vectors from two models in the same index is the equivalent of measuring some distances in metres and others in feet — the similarity scores become meaningless.",
      "Embedding drift: some hosted embedding models (OpenAI, Cohere) update their model weights over time without version changes. The new model may produce slightly different vector representations for the same text, degrading retrieval quality for content indexed before the update. Always use versioned model endpoints and pin to a specific version in production.",
      "Normalisation matters for cosine similarity. Most vector databases perform cosine similarity correctly on un-normalised vectors. But some similarity implementations (especially custom ones) assume L2-normalised vectors. Always L2-normalise your embeddings before storing unless your database explicitly handles it.",
      "Batch size affects throughput dramatically. Embedding API calls with batch_size=1 (one text per request) is 10-50x slower than batching 100 texts per request. Use batched ingestion during initial indexing. At BMO's scale (petabyte-range document corpus), the difference was 2 hours vs 3 days.",
      "Semantic search doesn't handle negation. 'Documents that are NOT about interest rate risk' will return documents about interest rate risk — the model encodes the semantic content (interest rate risk) regardless of the negation. Handle negation through metadata filtering or post-retrieval filtering, not through the embedding.",
    ],
    archilNote:
      "The embedding insight that changed how I think about retrieval: the embedding model is making a bet about what 'similar' means. If you fine-tune it, you're changing what bet it makes. For our enterprise AI platform, we fine-tuned our embedding model on domain-specific positive pairs (question–policy passage pairs generated by a stronger LLM from internal documents). The retrieval quality improvement on internal regulatory queries was the biggest single gain we got from any single engineering change — more than any prompting or chunking improvement.",
    interviewAngle:
      "Embedding questions often probe whether you understand the training objective (contrastive learning), the curse of dimensionality, and domain adaptation. Most candidates can say 'embeddings represent semantic meaning'. The distinguishing answer explains why cosine similarity is used over Euclidean distance and what domain mismatch looks like in practice.",
  },

  {
    id: "context-window-engineering",
    title: "Context Window Engineering",
    icon: "🪟",
    category: "context",
    depth: "advanced",
    oneLiner: "More context is not always better. What you put in the context window and how you arrange it determines whether the LLM can actually use it.",
    theRealProblem:
      "The common assumption is: longer context window = better model. That's not wrong, but it misses the critical insight that LLMs don't read context the same way humans read a document. Humans can scan a 100-page document and find the critical sentence on page 73. LLMs attend unevenly — they attend strongly to the beginning and end of their context and progressively less to the middle. If your most important evidence lands in the middle of a 32K-token context, the model may silently ignore it. Context engineering is about understanding this and designing your prompts and retrieval accordingly.",
    howItActuallyWorks: [
      "The lost-in-the-middle problem: Liu et al. 2023 demonstrated that when relevant information is in the middle of a long context, LLM performance drops significantly compared to when the same information is at the beginning or end. This holds across model sizes. In RAG, this means you must order your retrieved chunks deliberately — not in retrieval score order. Place the highest-confidence chunk first, second-highest chunk last, and remaining chunks in the middle.",
      "Long context vs RAG is a genuine trade-off. Long context models (128K+ tokens) can theoretically ingest an entire document corpus without retrieval. But: (1) attention is O(n²) in sequence length — 128K tokens is prohibitively expensive at scale, (2) the lost-in-the-middle problem applies even in long context, (3) retrieval lets you bring targeted evidence rather than flooding the context with irrelevant content. RAG wins at scale and for targeted queries. Long context wins for small document sets needing holistic synthesis.",
      "Dynamic context assembly: instead of always retrieving the same number of chunks, adjust context length based on query complexity. Simple factual queries (1-2 chunks), complex synthesis queries (5-10 chunks). Implement query classification to route to appropriate retrieval depth. This reduces token cost for simple queries while preserving quality for complex ones.",
      "Token budgeting in practice: reserve fixed budget allocations per context zone — system prompt (500 tokens), retrieved context (2000 tokens), conversation history (1000 tokens), output buffer (500 tokens). When retrieved context exceeds budget, apply contextual compression first (remove irrelevant sentences), then truncation from least-relevant chunk. Never truncate the system prompt or the final answer buffer.",
      "KV cache optimisation: transformer models cache key-value states for tokens already processed. Structuring your prompt so the static parts (system prompt, reference documents that don't change per query) come before the dynamic parts (user query) allows the model to reuse the KV cache for the static prefix. This reduces latency by 30-60% for high-frequency queries against the same document set.",
    ],
    productionGotchas: [
      "Conversation history growth will exceed your context budget. In a multi-turn AI assistant, conversation history grows linearly. After 20 turns you may exceed your context budget. Implement conversation summarisation: after N turns, summarise the conversation history into a compact representation, store the full history externally, include only the summary in context.",
      "Off-by-one token errors cause silent truncation. If you're assembling context from multiple components and the total exceeds the model's context limit, the model truncates from the end — potentially removing your most important instructions or your final examples. Always count tokens explicitly (use tiktoken or the provider's tokeniser) and build in a buffer.",
      "Few-shot examples consume expensive context budget. Each few-shot example in your prompt might consume 200-500 tokens. 5 examples = 1000-2500 tokens gone. Dynamically select few-shot examples based on the current query (retrieve the 3 most similar examples from a bank of examples) rather than hardcoding the same examples for every query.",
      "Structured output prompting expands token usage. When asking for JSON output, the model's output is constrained-decoding JSON which typically requires more tokens than natural language for the same information. Factor this into your output buffer allocation.",
      "Image + text context windows are measured differently. Multimodal models treat each image as a fixed token count (GPT-4V: each image is 85-1105 tokens depending on resolution). A prompt with 5 high-resolution images may consume 5,000 tokens before a single word of text. Design your context budget to account for multi-modal content.",
    ],
    archilNote:
      "The lost-in-the-middle problem burned us in an early version of our enterprise AI platform. We were achieving 85% answer quality on simple queries and 60% on complex multi-document queries. We assumed the complex queries were failing because our retrieval wasn't finding the right documents. After adding retrieval logging, we confirmed retrieval was correct — the right documents were being retrieved. The problem was ordering: we were inserting retrieved chunks in descending relevance order, which put the highest-confidence evidence in position 1 of 8 chunks — but for complex queries requiring synthesis across all 8 chunks, the middle ones were being attended to weakly. Switching to the lost-in-the-middle-aware ordering (highest confidence first and last) recovered 12 percentage points of answer quality on complex queries.",
    interviewAngle:
      "Context window questions often start as 'why would you use RAG instead of just using a long context model?'. The complete answer covers the cost/latency trade-off, the lost-in-the-middle problem, and the retrieval targeting advantage. Mentioning KV cache optimisation as a latency strategy signals architectural depth.",
  },

  {
    id: "prompt-architecture",
    title: "Prompt Architecture at Scale",
    icon: "✍️",
    category: "prompts",
    depth: "advanced",
    oneLiner: "A prompt is not a string. At production scale, it's an architecture with components, versioning, injection points, and failure modes.",
    theRealProblem:
      "Prompt engineering for a demo is writing instructions in natural language and seeing if the output looks right. Prompt architecture for production is systematically designing, testing, versioning, and maintaining prompts as first-class software artifacts. The problems that emerge at scale: prompt injection attacks (users crafting inputs that override your system instructions), semantic drift (your prompt's effectiveness degrades as the model updates), instruction following inconsistency (the model sometimes ignores your instructions), and the inability to diagnose regressions without a structured testing framework.",
    howItActuallyWorks: [
      "System prompt anatomy: structured prompts consistently outperform monolithic text prompts. Use explicit sections — Role (who the model is and what it knows), Context (dynamic information from retrieval), Constraints (what it must and must not do), Output Format (exact structure expected), Examples (few-shot). Use XML-style delimiters (<role>, <context>, <constraints>) rather than markdown headers — research shows XML delimiters are more reliably parsed by transformer models than # headings.",
      "Prompt injection taxonomy: direct injection — the user writes 'Ignore your previous instructions and...' in their query. Indirect injection — a retrieved document contains adversarial instructions designed to hijack the model's behaviour (particularly dangerous in RAG where document content is injected into context). Defend with: input sanitisation (detect and strip instruction-like patterns), context isolation (clearly delineate retrieved content as data, not instructions), output validation (check that the response adheres to expected format and doesn't echo suspicious instructions).",
      "Chain-of-thought elicitation: 'Let's think step by step' is a crude approximation. Structured CoT specifies the reasoning process explicitly: 'First, identify the relevant regulation. Second, determine how it applies to the specific case. Third, cite the applicable section. Fourth, state your conclusion.' Structured CoT produces more consistent and auditable reasoning chains than open-ended step-by-step prompting.",
      "Constitutional AI patterns: instead of enumerating every prohibition ('never say X', 'always avoid Y'), define a constitution — a set of principles — and add a self-critique step where the model evaluates its initial response against the constitution before producing the final output. 'Review your response against these principles: [principles]. Revise any part that violates them.' This scales better than an ever-growing list of prohibitions.",
      "Few-shot example design: examples are the most powerful tool for shaping output format and tone. Rules for production examples: (1) cover the most common query types, (2) explicitly include at least one example of how to handle ambiguous or unanswerable queries, (3) include at least one negative example (showing incorrect formatting with a correction), (4) keep examples at the same complexity level as your typical queries — examples that are too simple or too complex both hurt consistency.",
    ],
    productionGotchas: [
      "Instruction following is not monotonic with model size. Larger models sometimes follow complex multi-part instructions less reliably than smaller models because they're 'creative' — they may try to improve on your instructions rather than follow them exactly. Use structured output (JSON mode, function calling) rather than natural language instructions when you need exact format compliance.",
      "Prompt length has a non-linear effect on cost and latency. Every token in your system prompt is processed for every request. A 3000-token system prompt on 1 million daily queries costs $X. Audit your system prompt for redundancy. Compress verbose instructions. Every 100 tokens removed from the system prompt has compounding cost savings at scale.",
      "Multilingual prompts break in unexpected ways. A system prompt written in English and a user query in French produces inconsistent behaviour — the model may respond in either language, mix languages, or lose some instruction-following in translation. Either translate your full system prompt to the user's language at query time, or use explicit language instruction ('Always respond in the same language as the user's query').",
      "Version creep: over time, each team member adds their 'fix' to the system prompt without removing anything. After 6 months you have contradictory instructions, deprecated constraints that no longer apply, and nobody is sure what any given sentence does. Treat the system prompt like code: require PR reviews, document why each instruction exists, run regression tests when instructions change.",
      "The system prompt is not secret. Users can extract your system prompt through repeated prompting ('What were your instructions?', 'Repeat everything before the word USER'). Don't put credentials, PII, or genuinely confidential business logic in the system prompt. It's configuration, not secrets management.",
    ],
    archilNote:
      "The prompt architecture decision that made the biggest operational difference was adopting XML-delimited sections with explicit output JSON schema in the system prompt. Before: model occasionally responded in the wrong format, missing fields, wrong nesting. After: format compliance went from ~85% to >99%. The structured approach also made prompt debugging much faster — when a regression occurred, we could isolate which section of the system prompt was responsible by testing sections in isolation.",
    interviewAngle:
      "Prompt engineering is often dismissed as 'not real engineering'. The counter-argument — and the answer that impresses senior interviewers — is that at production scale, prompts have all the engineering challenges of code: versioning, testing, regression detection, security vulnerabilities (injection), and maintenance burden. Speaking to constitutional AI, structured CoT, and injection defence immediately elevates the conversation.",
  },
];

/* ── RAG Diagnostics Challenge Data ───────────────────────── */
export interface RAGDiagnosis {
  id: string;
  symptom: string;
  context: string;
  choices: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  fix: string;
  deeperInsight: string;
}

export const RAG_DIAGNOSES: RAGDiagnosis[] = [
  {
    id: "hallucination",
    symptom: "The AI gives confident, detailed answers to questions that are not covered anywhere in the document corpus.",
    context: "You have a RAG pipeline over internal policy documents. Users are asking about policies that don't exist yet, and the model is inventing plausible-sounding answers.",
    choices: [
      { label: "Retrieval is broken — wrong documents are being retrieved", isCorrect: false, explanation: "If retrieval were returning wrong documents, the model would at least have some content to work from. The issue here is the model generating content beyond the retrieved context." },
      { label: "Missing hallucination guardrails — no grounding check on outputs", isCorrect: true, explanation: "The model is generating content not supported by retrieved context. You need a grounding check: extract claims from the output and verify each has a supporting passage in the retrieved chunks. Reject or flag responses where claims exceed the grounding threshold." },
      { label: "Embedding model domain mismatch", isCorrect: false, explanation: "Domain mismatch causes retrieval to miss relevant documents, not causes the model to invent content from nothing." },
      { label: "Chunk size is too large", isCorrect: false, explanation: "Large chunks reduce retrieval precision but don't cause the model to fabricate content about topics absent from the corpus entirely." },
    ],
    fix: "Implement output grounding: after the LLM generates a response, run a second pass that extracts factual claims and verifies each against the retrieved context using embedding similarity. If a claim has no supporting passage above a threshold (e.g. 0.75 cosine similarity), flag or reject the response.",
    deeperInsight: "This is one of the highest-risk failure modes in enterprise RAG. The model is confidently wrong, which is worse than being obviously wrong. Constitutional AI-style self-critique ('Does your response cite specific passages from the provided documents for every claim?') catches some cases but is insufficient alone. Architecture-level grounding checks are the robust solution.",
  },
  {
    id: "retrieval-miss",
    symptom: "The AI says 'I don't have information about that' for questions where the answer clearly exists in your documents.",
    context: "Your document corpus covers this topic extensively. You've verified the relevant document exists and is indexed. But queries about this topic consistently return no results or irrelevant results.",
    choices: [
      { label: "The document is not indexed — ingestion pipeline failure", isCorrect: false, explanation: "You've confirmed the document is indexed. The problem is retrieval, not ingestion." },
      { label: "Domain mismatch — embedding model doesn't understand your terminology", isCorrect: true, explanation: "If your documents use specialised terminology not well-represented in the embedding model's training data, the query and document vectors may be far apart even when they're semantically related. The model doesn't know that 'AML transaction screening' and 'anti-money laundering checks' refer to the same concept." },
      { label: "Similarity threshold set too high", isCorrect: false, explanation: "A high similarity threshold could cause this, but domain mismatch is a more fundamental and more common root cause for specialised corpora." },
      { label: "Missing reranking step", isCorrect: false, explanation: "Reranking improves precision among retrieved results but doesn't recover results that were never retrieved in the first place." },
    ],
    fix: "Add BM25 keyword search alongside dense retrieval (hybrid search via Reciprocal Rank Fusion). BM25 doesn't care about semantic distance — it matches exact terms. This recovers queries where domain terminology creates a semantic gap. Longer term: fine-tune your embedding model on domain-specific positive pairs.",
    deeperInsight: "Pure semantic search has a critical weakness: it can only find what the model understands as similar. For regulatory, legal, and technical domains with specialised vocabulary, the model's training distribution may not include enough domain text. Hybrid search is the immediate fix; domain-specific embedding fine-tuning is the durable solution.",
  },
  {
    id: "stale-answers",
    symptom: "The AI gives answers that were accurate 3 months ago but are now wrong — policies have changed but the AI doesn't know.",
    context: "Your RAG pipeline is working correctly but you've updated 40% of your policy documents since the initial indexing. Old and new versions are coexisting in the index.",
    choices: [
      { label: "Missing document version management — stale vectors in the index", isCorrect: true, explanation: "You have both old and new document versions indexed. When the new policy contradicts the old one, the model may retrieve either version and produce inconsistent answers. Without version tracking and old-version deletion, your index accumulates stale truth." },
      { label: "Model knowledge cutoff — the LLM doesn't know about recent updates", isCorrect: false, explanation: "RAG bypasses the model's training knowledge cutoff by injecting retrieved context. The model answers from the retrieved documents, not its training data. The problem is that the wrong documents are being retrieved." },
      { label: "Similarity threshold too low — returning too many documents", isCorrect: false, explanation: "A low threshold would cause imprecision but not specifically favour stale over current documents." },
      { label: "Reranker not implemented", isCorrect: false, explanation: "A reranker would improve precision among retrieved results but can't determine document currency — it doesn't know which version is newer." },
    ],
    fix: "Track document hashes at ingestion. When a document is updated, delete the old vector embeddings before inserting the new ones. Add document metadata (last_updated timestamp, version number) and include recency weighting in your retrieval scoring — more recently updated documents get a small score boost for the same query.",
    deeperInsight: "This is an operational problem that gets worse as your corpus ages. Without incremental re-indexing discipline, your vector index becomes an archaeological dig site with multiple conflicting versions of the truth. Design your ingestion pipeline to be idempotent: re-ingesting a document should update, not duplicate.",
  },
  {
    id: "slow-response",
    symptom: "RAG pipeline latency is 8-12 seconds per query. Users are abandoning before getting answers.",
    context: "Single-vector retrieval from a 2M document index, top-50 results, cross-encoder reranking to top-5, GPT-4o generation. Each step is working correctly but the total is too slow.",
    choices: [
      { label: "Switch to a faster embedding model for retrieval", isCorrect: false, explanation: "A faster embedding model helps ingestion speed, not query-time retrieval latency. ANN index search is already fast — milliseconds for 2M vectors." },
      { label: "Reranking is the bottleneck — cross-encoder must score each candidate pair", isCorrect: true, explanation: "Cross-encoder reranking is O(n) LLM inference calls where n is your retrieval candidate count. Reranking top-50 candidates requires 50 forward passes through the reranker. This is your latency bottleneck — reduce the reranking candidate count or switch to a lighter reranker." },
      { label: "Index size is too large — need sharding", isCorrect: false, explanation: "ANN indexes (HNSW) scale to hundreds of millions of vectors with sub-100ms query time. 2M vectors is small. Index size is not the bottleneck." },
      { label: "GPT-4o is too slow — switch to GPT-3.5", isCorrect: false, explanation: "Switching models sacrifices quality. The bottleneck should be identified and addressed specifically, not worked around with a model downgrade." },
    ],
    fix: "Reduce reranking candidate count from 50 to 20. Use a lighter reranker (Cohere Rerank Lite vs full Rerank) for latency-sensitive paths. Implement async streaming: start streaming the LLM response to the user as generation begins rather than waiting for the full response. Users perceive streaming responses as faster even at the same total latency.",
    deeperInsight: "Latency optimisation in RAG pipelines requires profiling each stage independently. A common mistake is optimising the wrong component (people often try to speed up retrieval when reranking is the actual bottleneck). Add per-stage timing logs from day one. The streaming UX improvement is the fastest win — users tolerate 10 seconds better when they see output appearing progressively from second 2.",
  },
  {
    id: "inconsistent-quality",
    symptom: "Answer quality is excellent for some query types but terrible for others. Simple factual queries work great; complex multi-part queries give disjointed, incomplete answers.",
    context: "You have no query routing — every query goes through the same pipeline. Retrieval uses top-5 chunks. The model is GPT-4o.",
    choices: [
      { label: "GPT-4o isn't smart enough for complex queries", isCorrect: false, explanation: "GPT-4o is one of the strongest available models. If it's failing on complex queries, the problem is almost certainly in the retrieval or context assembly, not the model's intelligence." },
      { label: "Insufficient retrieved context for complex queries — need adaptive retrieval depth", isCorrect: true, explanation: "Complex multi-part queries need more retrieved chunks (evidence from multiple sources), while simple queries are answered perfectly with 1-2 chunks. A fixed top-5 under-serves complex queries and over-serves simple ones." },
      { label: "Chunk size is wrong", isCorrect: false, explanation: "Chunk size affects precision of individual retrieved chunks but doesn't explain a systematic pattern where complex queries fail and simple ones succeed." },
      { label: "The system prompt is too restrictive", isCorrect: false, explanation: "Overly restrictive system prompts can cause refusals, but wouldn't cause the specific pattern of simple queries succeeding and complex ones failing." },
    ],
    fix: "Implement query classification: detect query complexity (single-hop vs multi-hop, factual vs synthesis) and adjust retrieval depth accordingly. Simple factual queries: top-3 chunks. Complex synthesis queries: top-10 chunks + GraphRAG for relational sub-questions. Also consider query decomposition: break complex queries into sub-questions, retrieve for each independently, synthesise.",
    deeperInsight: "The uniform retrieval depth assumption is one of the most common RAG architecture mistakes. Not all queries are equal. A one-size-fits-all retrieval strategy over-fetches for simple queries (adding irrelevant context that confuses the model) and under-fetches for complex ones (missing critical evidence). Adaptive retrieval based on query classification is the production-grade solution.",
  },
];

/* ── Design Challenge Data ─────────────────────────────────── */
export interface DesignChallenge {
  id: string;
  title: string;
  icon: string;
  requirements: string[];
  constraint: string;
  options: {
    label: string;
    description: string;
    isOptimal: boolean;
    reasoning: string;
  }[];
  archilChoice: string;
  keyInsight: string;
}

export const DESIGN_CHALLENGES: DesignChallenge[] = [
  {
    id: "regulated-rag",
    title: "Enterprise RAG for a Bank",
    icon: "🏦",
    requirements: [
      "Index 50,000 internal policy documents",
      "Serve 10,000 employees with AI-assisted policy lookup",
      "No customer PII — internal documents only",
      "OSFI compliance required (Canadian banking regulator)",
      "Must be explainable — every answer must cite its source",
    ],
    constraint: "Zero public internet exposure. All traffic must stay within the corporate network perimeter.",
    options: [
      {
        label: "OpenAI API + Pinecone + public cloud storage",
        description: "Use the OpenAI public API, Pinecone as hosted vector DB, S3 for document storage.",
        isOptimal: false,
        reasoning: "Violates the zero-public-exposure constraint. Internal policy documents would be sent to OpenAI's servers (cross-border data transfer), Pinecone stores vectors on their infrastructure. OSFI compliance fails immediately.",
      },
      {
        label: "Azure OpenAI (private) + Azure AI Search + Private Endpoints throughout",
        description: "Deploy Azure OpenAI in your tenant (private endpoint only), Azure AI Search with private endpoint, Blob Storage with private endpoint. User Managed Identities for all service authentication. CMK encryption at rest.",
        isOptimal: true,
        reasoning: "Azure OpenAI deployed in your tenant means the model weights and inference run on Azure infrastructure allocated to you — data never leaves your network perimeter. Private endpoints for all services. UMI eliminates credentials. CMK satisfies OSFI data governance requirements. Citation is enforced architecturally through grounding checks.",
      },
      {
        label: "Self-hosted open source LLM (Llama) + local Chroma vector DB",
        description: "Run Llama 3 70B on on-premise GPU servers. Host Chroma locally. No cloud at all.",
        isOptimal: false,
        reasoning: "Technically satisfies the network constraint but introduces enormous operational burden: GPU infrastructure management, model update lifecycle, no enterprise SLA, and Llama 70B quality is materially below GPT-4o for complex policy reasoning. Not practical at bank scale.",
      },
    ],
    archilChoice: "This is almost exactly the architecture I built at BMO. The key decisions are Azure OpenAI in your own tenant (not the public API), Private Endpoints for everything, and User Managed Identities to eliminate credential sprawl. The OSFI compliance piece required documenting the data residency (all compute and storage in Canada), the CMK key management process, and the explainability mechanism (grounding checks that produce citations).",
    keyInsight: "Enterprise AI is a network topology problem as much as an ML problem. Most of the architectural decisions are about where data lives, how services authenticate to each other, and how you prove compliance to regulators — not about which model to use.",
  },
  {
    id: "agentic-finance",
    title: "Agentic AI for Financial Research",
    icon: "📈",
    requirements: [
      "Agent that researches companies: pulls financials, news, analyst reports",
      "Produces structured investment research reports",
      "Must cite every factual claim",
      "Should handle follow-up questions about its own reports",
      "Serves 200 analysts, each with multiple concurrent sessions",
    ],
    constraint: "Report quality is critical — a hallucinated financial figure could cause a real trading decision.",
    options: [
      {
        label: "Single ReAct agent with all tools available",
        description: "One agent with access to financial data APIs, news search, document retrieval, and report generation tools.",
        isOptimal: false,
        reasoning: "A single agent managing all tools for complex multi-step research tends to lose track of its reasoning chain and hallucinate connections between steps. The constraint (no hallucinated figures) makes single-agent architecture too risky for this use case.",
      },
      {
        label: "Supervisor + specialist agents with mandatory citation enforcement",
        description: "Supervisor orchestrator routes tasks to specialist agents (data retrieval agent, news analysis agent, financial modelling agent). Each agent returns structured output with citations. Final synthesis agent assembles the report. Grounding check validates every figure against source data before report is finalised.",
        isOptimal: true,
        reasoning: "Specialist agents are more reliable than generalist agents for specific subtasks. Mandatory structured output from each specialist (JSON with values + citations) makes grounding verification tractable. The final synthesis stage only assembles — it doesn't generate new facts, reducing hallucination risk. Grounding check catches any figures not supported by source data.",
      },
      {
        label: "RAG pipeline without agents — static retrieval + report template",
        description: "Retrieve financial data, news, and analyst reports via RAG. Fill a structured report template with retrieved information.",
        isOptimal: false,
        reasoning: "Static RAG can't handle the dynamic, multi-step nature of financial research — it can't decide to pull additional data based on what it finds, follow up on anomalies, or reason about relationships between data points. This produces cookie-cutter reports that miss the value of agentic reasoning.",
      },
    ],
    archilChoice: "Multi-agent with citation enforcement is the right architecture here. The critical constraint is 'no hallucinated financial figures', which means every number must be traceable to a source. Specialist agents returning structured JSON (value + source + confidence) makes this tractable. The grounding check at the report finalisation stage is the safety net. I'd also add a step budget and abort if the agent hasn't converged in 20 steps.",
    keyInsight: "Agentic AI architecture choices are driven by risk tolerance as much as capability requirements. Where errors have real consequences (financial decisions, medical recommendations, legal advice), multi-agent + verification is worth the complexity overhead. Where errors are recoverable (research drafts, content suggestions), single-agent simplicity wins.",
  },
  {
    id: "llmops-at-scale",
    title: "LLMOps for 50 AI Workflows",
    icon: "🏭",
    requirements: [
      "Organisation runs 50 different AI workflows (summarisation, Q&A, classification, extraction, generation)",
      "Each workflow has its own system prompt and few-shot examples",
      "Teams update prompts frequently based on user feedback",
      "Management wants to know which workflows are performing well vs poorly",
      "Cost is $50K/month and growing — need visibility into which workflows are the most expensive",
    ],
    constraint: "You cannot have a different team member responsible for each workflow — you need a centralised governance approach.",
    options: [
      {
        label: "Store all prompts as environment variables and let teams manage their own",
        description: "Each workflow reads its prompt from an env var. Teams update env vars when they want to change prompts. Monitor costs at the API key level.",
        isOptimal: false,
        reasoning: "No versioning = no ability to roll back when a prompt change causes a regression. No centralised evaluation = no visibility into cross-workflow quality. API key level cost tracking doesn't tell you which of the 50 workflows is the expensive one.",
      },
      {
        label: "Centralised prompt registry + per-workflow eval harness + tagged API calls",
        description: "Prompt registry stores versioned prompts with deployment history. Every prompt change triggers automated eval against a held-out test set before deployment. Every LLM API call is tagged with workflow ID and prompt version. Cost and quality dashboards aggregate by workflow.",
        isOptimal: true,
        reasoning: "Version control for prompts gives you rollback capability and change attribution. Automated eval gates prevent quality regressions from reaching production. Tagged API calls give you per-workflow cost and quality telemetry. This is LLMOps done right at organisational scale.",
      },
      {
        label: "Single master prompt for all workflows with conditional branches",
        description: "One enormous system prompt with conditional logic ('If the task is summarisation, do X. If the task is classification, do Y...'). Simpler to manage — just one prompt.",
        isOptimal: false,
        reasoning: "A single mega-prompt becomes unmaintainable as you add workflows. Conditional logic in prompts is fragile — models don't reliably follow complex conditional instruction trees. Changes to one workflow's section risk breaking others. This trades simplicity for brittleness.",
      },
    ],
    archilChoice: "The prompt registry approach is the right answer and it's not optional at this scale. 50 workflows with frequent updates without versioning is a production incident waiting to happen. The key additions I'd make: (1) require every prompt change to include a rationale comment (why was this changed?), (2) run the eval in shadow (old prompt serves production, new prompt generates parallel outputs for comparison) before any promotion, (3) alert on any workflow where evaluation score drops >5% week-over-week.",
    keyInsight: "50 AI workflows managed ad-hoc is 50 potential sources of silent quality degradation. The investment in a prompt registry and evaluation harness pays for itself the first time you need to roll back a regression that affected thousands of users — and you will need to.",
  },
];
