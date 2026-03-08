export interface TileData {
  id: string;
  icon: string;
  label: string;
  year: string;
  category: "origin" | "education" | "career" | "current";
  // Position on the board (percentage-based for responsive)
  x: number;
  y: number;
  // Detail content
  title: string;
  subtitle: string;
  narrative: string;
  skills?: string[];
}

export const TILES: TileData[] = [
  {
    id: "dos-games",
    icon: "🕹️",
    label: "DOS Games",
    year: "Childhood",
    category: "origin",
    x: 120,
    y: 580,
    title: "The Kid Who Asked Why",
    subtitle: "Where it all began",
    narrative:
      "I didn't just play DOS games — I interrogated them. Every pixel, every sound, every menu screen made me ask the same restless question: how did someone make this? That question never went away. It just got bigger. It became the engine of everything that came after.",
    skills: ["Curiosity", "Problem Solving", "DOS"],
  },
  {
    id: "html-css",
    icon: "🌐",
    label: "HTML & CSS",
    year: "Early Days",
    category: "origin",
    x: 280,
    y: 500,
    title: "Building, Not Just Browsing",
    subtitle: "First lines of code",
    narrative:
      "I found HTML and CSS — and suddenly I wasn't just a consumer anymore. I was building things. Ugly, wonderful things. Websites that looked terrible and worked beautifully. The moment I realized I could create something from nothing, there was no going back.",
    skills: ["HTML", "CSS", "Web Design"],
  },
  {
    id: "networking",
    icon: "🔌",
    label: "Networking",
    year: "Discovery",
    category: "origin",
    x: 440,
    y: 440,
    title: "The Machine Cracked Open",
    subtitle: "Seeing the invisible architecture",
    narrative:
      "Then I found networking. The whole machine cracked open. I could see how packets moved, how systems talked to each other, how the invisible architecture beneath everything was just… patterns. Elegant, learnable patterns. That was the moment — not when I learned what to build, but when I realized I could learn anything.",
    skills: ["TCP/IP", "Network Architecture", "Protocols"],
  },
  {
    id: "dalhousie",
    icon: "🎓",
    label: "Dalhousie",
    year: "2017–2018",
    category: "education",
    x: 620,
    y: 380,
    title: "The Academy",
    subtitle: "Dalhousie University · Master's in Applied CS",
    narrative:
      "Dalhousie wasn't just a degree — it was where curiosity became craft. Where I stopped tinkering and started thinking in systems. The Master's programme taught me to think three moves ahead. Not just 'how does this work?' but 'what breaks when it scales? Where does the attacker look first?' I learned to see the whole board.",
    skills: ["Systems Thinking", "Security", "Automation", "Ethical Hacking"],
  },
  {
    id: "rbc",
    icon: "🏦",
    label: "RBC",
    year: "2018",
    category: "career",
    x: 800,
    y: 320,
    title: "First Move on the Board",
    subtitle: "RBC · DevOps Engineer — Cyber Security",
    narrative:
      "My first move on the board. I walked into one of the largest banks in the country and built automation for cybersecurity compliance. Ansible, Python, Jenkins — the tools of a builder learning how real systems defend themselves. Four months that taught me more than any classroom could.",
    skills: ["Ansible", "Python", "Jenkins", "Palo Alto", "DevOps"],
  },
  {
    id: "bmo-infra",
    icon: "☁️",
    label: "Cloud Infra",
    year: "2019–2020",
    category: "career",
    x: 960,
    y: 400,
    title: "The Foundation",
    subtitle: "BMO · Cloud Infrastructure Engineer",
    narrative:
      "The foundation year. High-pressure cloud migrations, wiring up network connectivity, establishing Infrastructure as Code as the standard. Terraform and CloudFormation became my primary tools. I learned that the best architecture is the one nobody notices — because it just works.",
    skills: ["AWS", "Azure", "Terraform", "CloudFormation", "CI/CD"],
  },
  {
    id: "bmo-senior",
    icon: "📐",
    label: "Senior Eng",
    year: "2020–2021",
    category: "career",
    x: 1100,
    y: 490,
    title: "The Shift to Strategy",
    subtitle: "BMO · Senior Cloud Engineer",
    narrative:
      "I stopped building and started designing. The pivot from implementation to architecture — translating infrastructure complexity into decisions that leadership could act on. Reactive firefighting became proactive SLA optimization. I learned to speak two languages: engineer and executive.",
    skills: ["Architecture", "Technical Consulting", "SLA Optimization"],
  },
  {
    id: "bmo-lead",
    icon: "👥",
    label: "Team Lead",
    year: "2021–2022",
    category: "career",
    x: 1220,
    y: 410,
    title: "Leading the Squad",
    subtitle: "BMO · Team Lead",
    narrative:
      "Leading the squad. We turned container deployments from days into hours. We built CI/CD pipelines that sailed through audits with zero critical findings. The shift from 'I can build this' to 'I can help everyone build this.' Speed transformation, security automation — all of it earned.",
    skills: ["Leadership", "CI/CD", "Container Orchestration", "Security Automation"],
  },
  {
    id: "bmo-principal",
    icon: "🏗️",
    label: "Principal",
    year: "2022–2025",
    category: "career",
    x: 1380,
    y: 340,
    title: "Owning the Platform",
    subtitle: "BMO · Principal Cloud Engineer — Serverless & Containers",
    narrative:
      "Owning the platform. Multi-region architectures supporting thousands of developers across the bank. I led the organizational shift from a 'servers' mindset to a 'services' mindset — reducing infrastructure complexity across hundreds of teams while keeping the pace fast and technical debt manageable.",
    skills: ["Multi-Region", "Serverless", "Kubernetes", "Platform Engineering"],
  },
  {
    id: "bmo-ai",
    icon: "🤖",
    label: "AI Architect",
    year: "2025–Now",
    category: "current",
    x: 1540,
    y: 270,
    title: "The Frontier",
    subtitle: "BMO · Principal Cloud Engineer — AI",
    narrative:
      "Today I'm architecting the secure backbone for enterprise AI. Azure-based AI platforms that integrate enterprise data services while meeting strict model governance and audit requirements. Making sure the most powerful technology of our generation runs on foundations that don't crack under pressure. The board keeps expanding. The questions keep getting better.",
    skills: ["RAG", "MLOps", "LLMOps", "Azure AI", "Model Governance"],
  },
];

export const CATEGORY_COLORS: Record<TileData["category"], string> = {
  origin: "hsl(var(--tile-origin))",
  education: "hsl(var(--tile-education))",
  career: "hsl(var(--tile-career))",
  current: "hsl(var(--tile-current))",
};

export const CATEGORY_LABELS: Record<TileData["category"], string> = {
  origin: "Origin Story",
  education: "Education",
  career: "Career",
  current: "Present Day",
};
