export interface MentalModel {
  id: string;
  title: string;
  icon: string;
  category: "thinking" | "engineering" | "leadership" | "puzzle";
  oneLiner: string;
  explanation: string[];
  engineeringApplication: string;
  example: string;
}

export interface LogicPuzzle {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: "logic" | "math" | "pattern" | "lateral";
  question: string;
  hints: string[];
  answer: string;
  explanation: string;
}

export const MENTAL_MODEL_CATEGORIES = [
  { value: "thinking" as const, label: "Thinking" },
  { value: "engineering" as const, label: "Engineering" },
  { value: "leadership" as const, label: "Leadership" },
  { value: "puzzle" as const, label: "Puzzles" },
];

export const MENTAL_MODELS: MentalModel[] = [
  {
    id: "first-principles",
    title: "First Principles Thinking",
    icon: "🔬",
    category: "thinking",
    oneLiner: "Strip away assumptions until you reach fundamental truths, then reason up from there.",
    explanation: [
      "Most people think by analogy: 'this is like that, so we should do what they did.' It's faster but limits you to incremental improvement.",
      "First principles thinking asks: what are the underlying facts that we know to be true? Then builds solutions from those truths, ignoring convention.",
      "Elon Musk applied this to battery costs: instead of accepting the market price, he broke batteries into raw materials (cobalt, nickel, lithium) and found they cost 80% less.",
      "The framework: (1) Define the problem. (2) List all assumptions. (3) Challenge each assumption — is it truly fundamental? (4) Rebuild from the remaining truths.",
    ],
    engineeringApplication: "When our CI/CD pipeline took 45 minutes, everyone assumed it was 'just slow.' First principles: what actually happens? We found 60% of the time was spent downloading dependencies that hadn't changed. We introduced layer caching. Build time dropped to 8 minutes. We didn't optimize the pipeline — we questioned what the pipeline was doing.",
    example: "'We need a database.' Do you? Or do you need to persist state? Maybe an S3 object, a configuration file, or an in-memory cache is the right tool. The assumption that 'persistence = database' is so deeply embedded that teams spin up RDS instances for data that fits in a JSON file.",
  },
  {
    id: "inversion",
    title: "Inversion",
    icon: "🔄",
    category: "thinking",
    oneLiner: "Instead of asking 'how do I succeed?', ask 'how would I guarantee failure?' — then avoid those things.",
    explanation: [
      "Charlie Munger's favorite: 'Invert, always invert.' Instead of figuring out how to build a great system, figure out how to build a terrible one — then do the opposite.",
      "It's psychologically easier to identify what leads to failure than to define what leads to success. We're better at spotting mistakes than inventing solutions.",
      "The approach: (1) Define the goal. (2) Invert: what would guarantee failure? (3) List all the ways to fail. (4) Systematically avoid every item on the list.",
      "Stoics called this 'premeditatio malorum' — premeditation of evils. By imagining everything that could go wrong, you inoculate yourself against it.",
    ],
    engineeringApplication: "Before launching the AI platform, I asked: 'How would I guarantee this platform fails catastrophically in production?' Answers: no model versioning (can't rollback), no input validation (prompt injection), no rate limiting (runaway costs), no monitoring (silent failures). We built defenses against every failure mode before launch. Inversion gave us the security checklist that compliance didn't.",
    example: "Want a high-performing engineering team? Invert: how do you guarantee a terrible team? Hire only for technical skills (ignore collaboration), never give feedback, make people compete instead of collaborate, punish risk-taking. Now avoid all of that.",
  },
  {
    id: "second-order",
    title: "Second-Order Thinking",
    icon: "♟️",
    category: "thinking",
    oneLiner: "First-order: what happens next? Second-order: and then what happens after that?",
    explanation: [
      "First-order thinking is direct and obvious. Everyone does it. Second-order thinking asks: 'And then what?' — following the chain of consequences.",
      "Example: 'Let's add a cache to speed up reads.' First-order: reads get faster. Second-order: cache invalidation bugs cause stale data. Third-order: users lose trust in the data and start refreshing constantly, generating MORE load than before.",
      "Howard Marks: 'First-level thinking is simplistic and superficial. Second-level thinking is deep, complex, and convoluted.'",
      "The discipline: for every decision, ask 'and then what?' at least twice. Map out the 2nd and 3rd order effects. Often the right decision at order 1 is wrong at order 2.",
    ],
    engineeringApplication: "We considered automating PR approvals for 'low-risk' changes. First-order: faster deployments. Second-order: developers start gaming the 'low-risk' classification to skip reviews. Third-order: code quality degrades, production incidents increase. We kept human reviews but automated everything around them (auto-running tests, auto-formatting, auto-labeling).",
    example: "Adding a microservice to 'simplify' a monolith. First-order: cleaner separation. Second-order: now you need service discovery, distributed tracing, network policies, and a deploy pipeline for each service. Third-order: the team that could ship features daily now ships weekly because operational overhead tripled.",
  },
  {
    id: "map-territory",
    title: "The Map Is Not the Territory",
    icon: "🗺️",
    category: "thinking",
    oneLiner: "Models are useful simplifications of reality — don't confuse the model with the real thing.",
    explanation: [
      "Alfred Korzybski: 'The map is not the territory.' Every diagram, metric, dashboard, and mental model is a simplified representation. It leaves things out. Sometimes the things it leaves out are what matter most.",
      "A system architecture diagram shows boxes and arrows. It doesn't show latency, human error, or the fact that the team maintaining Service B is burned out and shipping bugs.",
      "Metrics are maps. 'CPU utilization is 30%' doesn't tell you about memory pressure, GC pauses, or the fact that one thread is pegged at 100% while 15 are idle.",
      "The antidote: always ask 'what is this map NOT showing me?' and go look at the territory directly (production logs, user behavior, actual system behavior under load).",
    ],
    engineeringApplication: "Our observability dashboard showed all green — CPU, memory, latency all within bounds. But users reported 'the app feels slow.' The dashboard (map) didn't capture client-side rendering time, DNS resolution delays, or the CDN cache miss rate for a specific region. We had to look at the territory (Real User Monitoring) to find the problem.",
    example: "Story points are a map of effort. A '3-point' story that requires coordinating with 3 teams is harder than an '8-point' story you can do alone. The story point map doesn't capture coordination cost, context switching, or dependency waiting. Teams that optimize for velocity (the map) often sacrifice actual throughput (the territory).",
  },
  {
    id: "leverage-points",
    title: "Leverage Points",
    icon: "🎯",
    category: "engineering",
    oneLiner: "Small changes in the right place produce outsized results. Find the leverage point, not the obvious fix.",
    explanation: [
      "Donella Meadows identified 12 leverage points in systems — places where a small intervention produces large change. The most powerful: changing the goals, rules, or mental models of the system.",
      "In software: optimizing a function that runs once is low leverage. Optimizing the hot path that runs millions of times is high leverage. Same effort, vastly different impact.",
      "The trap: we default to working on what's visible and urgent, not what's impactful. A production bug is visible and urgent. Improving the deploy pipeline is invisible but high-leverage.",
      "Finding leverage: look for force multipliers — things that make EVERYTHING else easier. Automated testing, CI/CD, monitoring, developer tooling. One hour invested in a reusable tool saves hundreds of hours across the team.",
    ],
    engineeringApplication: "When I joined the DevOps team, there were 15 open production incidents. The instinct was to fix them one by one. Instead, I found the leverage point: 70% of incidents were caused by missing monitoring. We invested 2 weeks in observability (structured logging, alerting, dashboards). Over the next quarter, incident volume dropped 60% — not because we fixed bugs, but because we caught them before users did.",
    example: "The highest-leverage thing a senior engineer can do is rarely writing code. It's writing a design doc that prevents 5 teams from building the same thing 5 different ways. Or writing a runbook that lets junior engineers handle incidents without escalation. Leverage is about multiplying your impact beyond your direct output.",
  },
  {
    id: "reversibility",
    title: "Reversible vs. Irreversible Decisions",
    icon: "🚪",
    category: "leadership",
    oneLiner: "Decide fast on reversible decisions. Deliberate carefully on irreversible ones.",
    explanation: [
      "Jeff Bezos calls these Type 1 (irreversible, one-way door) and Type 2 (reversible, two-way door) decisions.",
      "Type 1: choosing your primary database, signing a 3-year cloud contract, making a public API. These are hard to undo. Invest time in analysis.",
      "Type 2: choosing a UI framework, naming a service, picking a logging library. These can be changed later. Decide in hours, not weeks.",
      "The organizational failure: treating every decision as Type 1. This creates analysis paralysis, infinite design reviews, and glacial execution speed.",
    ],
    engineeringApplication: "When our team debated between two observability vendors for 3 weeks, I asked: 'Is this reversible?' Yes — we can switch vendors by changing a config. It's a Type 2 decision. We picked one in 30 minutes, shipped it, and evaluated based on real usage instead of hypothetical comparisons. We're still using it two years later.",
    example: "Database schema design is somewhere between Type 1 and Type 2. Adding a column is easy (Type 2). Changing the primary key or splitting a table is hard (Type 1). Recognize the gradient — not everything is binary.",
  },
  {
    id: "occams-razor",
    title: "Occam's Razor",
    icon: "✂️",
    category: "engineering",
    oneLiner: "The simplest explanation — or solution — is usually the right one.",
    explanation: [
      "When you hear hoofbeats, think horses, not zebras. The simplest explanation that fits the evidence is most likely correct.",
      "In engineering: if a service is returning 500 errors after a deployment, the deployment probably broke it. Don't start by investigating cosmic ray bit-flips.",
      "Applied to architecture: the simplest design that meets requirements is the best design. Complexity is a cost, not a feature. Every additional component is another thing that can fail.",
      "The discipline: before adding complexity, ask 'is there a simpler way to achieve the same result?' Often there is, and you save weeks of debugging time.",
    ],
    engineeringApplication: "A team proposed a complex event-driven architecture with 7 services, 3 queues, and a state machine to handle a workflow that processed 50 requests per day. I asked: 'What if we just put this in a single Lambda function with a DynamoDB table?' It took 2 days to build instead of 2 months. It's been running for 3 years without incident.",
    example: "Debugging production: a junior engineer spent 3 days investigating a memory leak with heap dumps and profiler traces. The actual cause: a config file had the memory limit set to 256MB instead of 2GB. Always check the simple things first.",
  },
  {
    id: "hanlons-razor",
    title: "Hanlon's Razor",
    icon: "🤷",
    category: "leadership",
    oneLiner: "Never attribute to malice what can be explained by ignorance, mistakes, or miscommunication.",
    explanation: [
      "When someone breaks something, your first instinct might be 'they didn't care' or 'they were careless.' More often: they didn't know, they were under pressure, or the system made it too easy to make that mistake.",
      "This shifts your response from blame to improvement: instead of 'why did you do that?', ask 'how do we make it impossible to do that?'",
      "In incident response: blame creates fear. Fear creates hiding. Hiding creates bigger incidents. Blameless post-mortems aren't soft — they're strategic.",
      "The real insight: if a competent person made a mistake, the system allowed it. Fix the system (guardrails, automation, better defaults), not the person.",
    ],
    engineeringApplication: "A junior engineer deleted a production table. The instinct was to restrict DB access. But Hanlon's Razor: they were following a runbook that said 'drop table' without specifying the environment. The fix: automated environment detection in all scripts, production databases require a second approval, and the runbook was rewritten. The engineer became one of our best — because we didn't destroy their confidence.",
    example: "When a PR review gets a terse 'LGTM' from a senior engineer, it's easy to assume they don't care. More likely: they're in 6 meetings today, have 12 PRs to review, and are doing their best with limited attention. Fix the process (smaller PRs, async reviews, dedicated review time), not the person.",
  },
];

export const LOGIC_PUZZLES: LogicPuzzle[] = [
  {
    id: "monty-hall",
    title: "The Monty Hall Problem",
    difficulty: "medium",
    category: "math",
    question: "You're on a game show. There are 3 doors. Behind one door is a car; behind the others, goats. You pick door #1. The host, who knows what's behind the doors, opens door #3 to reveal a goat. He offers you the chance to switch to door #2. Should you switch?",
    hints: [
      "Your initial pick had a 1/3 chance of being correct.",
      "The host's action gives you new information — he always reveals a goat.",
      "Think about what happens if you ALWAYS switch vs. NEVER switch.",
    ],
    answer: "Yes, always switch. Switching gives you a 2/3 chance of winning.",
    explanation: "When you first picked, you had a 1/3 chance of being right and a 2/3 chance of being wrong. When the host reveals a goat, that 2/3 probability doesn't disappear — it concentrates on the remaining unpicked door. If you switch, you win 2/3 of the time. This is counterintuitive because we think the reveal creates a 50/50 situation, but the host's knowledge breaks the symmetry.",
  },
  {
    id: "bridge-crossing",
    title: "Bridge at Night",
    difficulty: "hard",
    category: "logic",
    question: "Four people need to cross a bridge at night. They have one flashlight. The bridge holds at most 2 people at once. Each person walks at different speeds: A = 1 min, B = 2 min, C = 5 min, D = 10 min. When two people cross together, they go at the slower person's speed. What's the minimum time to get everyone across?",
    hints: [
      "The naive approach (fastest person escorts everyone) takes 19 minutes. You can do better.",
      "Think about how to minimize the impact of the two slowest people.",
      "What if the two slowest cross together?",
    ],
    answer: "17 minutes.",
    explanation: "A+B cross (2 min). A returns (1 min). C+D cross (10 min). B returns (2 min). A+B cross (2 min). Total: 2+1+10+2+2 = 17 minutes. The key insight: make the two slowest people cross together so you only 'pay' for the slower one once. The naive approach (A escorts B, C, D individually) costs 2+1+5+1+10 = 19 minutes.",
  },
  {
    id: "water-jugs",
    title: "Water Jugs",
    difficulty: "medium",
    category: "logic",
    question: "You have a 5-liter jug and a 3-liter jug. No markings. You need exactly 4 liters. How do you measure it?",
    hints: [
      "You can fill a jug, empty it, or pour from one to another.",
      "Start by filling the 5-liter jug.",
      "Think about what happens when you pour from 5 into 3.",
    ],
    answer: "Fill 5L → Pour into 3L (5 has 2L left) → Empty 3L → Pour 2L from 5 into 3 → Fill 5L → Pour from 5 into 3 (3 needs 1L) → 5 now has exactly 4L.",
    explanation: "Step by step: (1) Fill 5L jug. (2) Pour from 5L into 3L — 5L now has 2L, 3L is full. (3) Empty the 3L jug. (4) Pour the 2L from 5L into 3L — 3L now has 2L, 5L is empty. (5) Fill 5L jug again. (6) Pour from 5L into 3L (which needs 1 more liter) — 5L now has exactly 4L. This is a classic example of working backwards from the goal: 4 = 5 - 1, and you can create 1 by using the 3L jug as a measuring tool.",
  },
  {
    id: "two-eggs",
    title: "Two Egg Problem",
    difficulty: "hard",
    category: "math",
    question: "You have 2 identical eggs and a 100-floor building. You need to find the highest floor from which an egg can be dropped without breaking. If an egg breaks, you can't reuse it. If it survives, you can reuse it. What's the minimum number of drops to guarantee finding the answer in the worst case?",
    hints: [
      "Binary search won't work — if your first egg breaks at floor 50, you only have one egg left and must go floor by floor from 1 to 49.",
      "Think about an approach where the total work stays constant no matter when the first egg breaks.",
      "If you drop egg 1 at floor X, and it breaks, you check floors 1 through X-1 with egg 2. That's X-1 drops. What if the next gap is X-1?",
    ],
    answer: "14 drops. Drop the first egg at floors 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100.",
    explanation: "The key insight: each time egg 1 survives and you go higher, you have one fewer drop remaining for egg 2. So the gaps between egg 1 drops should decrease by 1 each time. If you start at floor 14: worst case if it breaks is 13 more drops (floors 1-13) = 14 total. Next try floor 27 (gap of 13): worst case is 12 more drops = 14 total. Then 39 (gap 12), 50 (gap 11), etc. Solve: X + (X-1) + (X-2) + ... + 1 ≥ 100 → X(X+1)/2 ≥ 100 → X = 14.",
  },
  {
    id: "prisoners-hats",
    title: "100 Prisoners & Hats",
    difficulty: "hard",
    category: "logic",
    question: "100 prisoners stand in a line, each wearing a red or blue hat. Each can see ALL hats in front of them, but not their own or behind them. Starting from the back, each must guess their own hat color. They can only say 'Red' or 'Blue'. They can plan a strategy beforehand. What strategy guarantees saving at least 99 prisoners?",
    hints: [
      "The prisoner at the back can see all 99 hats in front.",
      "That prisoner's answer can encode information for everyone else.",
      "Think about parity — odd vs. even count of one color.",
    ],
    answer: "The back prisoner counts red hats. If even, says 'Red'. If odd, says 'Blue'. Each subsequent prisoner counts the red hats they see and uses the running parity to deduce their own hat.",
    explanation: "The back prisoner sacrifices (50/50 chance) to encode parity information. They agree: say 'Red' if you see an even number of red hats, 'Blue' if odd. The next prisoner counts red hats they can see. If the parity doesn't match what they expect (given the 'Red'/'Blue' signal), their hat must be red. Each person tracks the running parity as answers are given. This guarantees 99 correct answers. The back prisoner is correct 50% of the time. This is information theory in action — one bit of data (even/odd) cascades to save 99 people.",
  },
  {
    id: "light-switches",
    title: "Light Switches",
    difficulty: "easy",
    category: "lateral",
    question: "You're outside a room with 3 light switches. Inside the room is a single light bulb. You can flip switches as much as you want, but you can only enter the room once. How do you determine which switch controls the bulb?",
    hints: [
      "You can only see the bulb once — but seeing isn't the only sense you can use.",
      "What happens to a light bulb that's been on for a while?",
      "Think about a property of the bulb other than whether it's lit.",
    ],
    answer: "Turn switch 1 on for 10 minutes, then turn it off. Turn switch 2 on. Enter the room. If the bulb is on → switch 2. If off and warm → switch 1. If off and cold → switch 3.",
    explanation: "The trick is using heat as a second information channel. You have 3 states to distinguish but can only enter once. Light gives you on/off (2 states). Adding temperature gives you on, off+warm, off+cold (3 states). This is a real-world example of encoding information — the same principle behind how computers represent data with voltage levels.",
  },
  {
    id: "balance-scale",
    title: "9 Balls, 1 Heavier",
    difficulty: "easy",
    category: "math",
    question: "You have 9 identical-looking balls. One is slightly heavier than the rest. You have a balance scale. What's the minimum number of weighings needed to guarantee finding the heavy ball?",
    hints: [
      "With each weighing, you can divide the balls into 3 groups, not 2.",
      "Think about how much information each weighing gives you.",
      "Each weighing has 3 outcomes: left heavy, right heavy, or balanced.",
    ],
    answer: "2 weighings.",
    explanation: "Divide into 3 groups of 3. Weigh group A vs group B. If one side is heavier, the heavy ball is in that group of 3. If balanced, it's in group C. Now take the group of 3 containing the heavy ball, pick 2 and weigh them. If one is heavier, that's your ball. If balanced, it's the third. 2 weighings, guaranteed. Each weighing gives log₂(3) ≈ 1.58 bits of information. You need log₂(9) ≈ 3.17 bits. 2 weighings give you 2 × 1.58 = 3.17 bits — exactly enough.",
  },
  {
    id: "100-lockers",
    title: "100 Lockers",
    difficulty: "medium",
    category: "pattern",
    question: "100 closed lockers in a row. Student 1 opens every locker. Student 2 toggles every 2nd locker. Student 3 toggles every 3rd locker. This continues for all 100 students. After all students are done, which lockers are open?",
    hints: [
      "A locker is toggled once for each of its divisors. Locker 12 is toggled by students 1, 2, 3, 4, 6, 12.",
      "A locker ends up open if it's toggled an ODD number of times.",
      "Which numbers have an odd number of divisors?",
    ],
    answer: "Lockers 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 — the perfect squares.",
    explanation: "Every locker is toggled once per divisor it has. Divisors come in pairs: for 12, the pairs are (1,12), (2,6), (3,4). Paired divisors → even number of toggles → locker ends up closed. But perfect squares have an unpaired divisor: for 36, (1,36), (2,18), (3,12), (4,9), (6,6) — 6 is paired with itself. Odd number of divisors → odd toggles → locker stays open. There are 10 perfect squares from 1 to 100.",
  },
];
