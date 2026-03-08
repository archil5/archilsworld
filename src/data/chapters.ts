export interface ChapterData {
  id: string;
  icon: string;
  label: string;
  year: string;
  category: "origin" | "education" | "career" | "current";
  title: string;
  subtitle: string;
  narrative: string;
  skills?: string[];
  position: [number, number, number];
  color: string;
  brandLogo?: string;
  image?: string;
}

export const CHAPTERS: ChapterData[] = [
  {
    id: "dos-games",
    icon: "🕹️",
    label: "DOS Games",
    year: "Childhood",
    category: "origin",
    title: "The Kid Who Asked Why",
    subtitle: "Where it all began",
    narrative: "I didn't just play DOS games — I interrogated them. Every pixel, every sound, every menu screen made me ask the same restless question: how did someone make this?",
    skills: ["Curiosity", "Problem Solving", "DOS"],
    position: [-6, 0, 0],
    color: "#00C853",
  },
  {
    id: "html-css",
    icon: "🌐",
    label: "HTML & CSS",
    year: "Early Days",
    category: "origin",
    title: "Building, Not Just Browsing",
    subtitle: "First lines of code",
    narrative: "I found HTML and CSS — and suddenly I wasn't just a consumer anymore. I was building things. Ugly, wonderful things.",
    skills: ["HTML", "CSS", "Web Design"],
    position: [-3, 0, -2],
    color: "#E44D26",
  },
  {
    id: "networking",
    icon: "🔌",
    label: "Networking",
    year: "Discovery",
    category: "origin",
    title: "The Machine Cracked Open",
    subtitle: "Seeing the invisible architecture",
    narrative: "Then I found networking. The whole machine cracked open. I could see how packets moved, how systems talked to each other.",
    skills: ["TCP/IP", "Network Architecture", "Protocols"],
    position: [0, 0, -1],
    color: "#0078D4",
  },
  {
    id: "dalhousie",
    icon: "🎓",
    label: "Dalhousie",
    year: "2017–2018",
    category: "education",
    title: "The Academy",
    subtitle: "Dalhousie University · Master's in Applied CS",
    narrative: "Dalhousie wasn't just a degree — it was where curiosity became craft. The Master's programme taught me to think three moves ahead.",
    skills: ["Systems Thinking", "Security", "Automation", "Ethical Hacking"],
    position: [3, 0, -3],
    color: "#FFD700",
    brandLogo: "Dalhousie",
  },
  {
    id: "career",
    icon: "💼",
    label: "Career",
    year: "2018–Present",
    category: "career",
    title: "The Full Journey",
    subtitle: "RBC → BMO · From DevOps to Principal to AI",
    narrative: "From cybersecurity automation at RBC to architecting enterprise AI platforms at BMO — seven years of building, leading, and transforming at scale.",
    skills: ["AWS", "Azure", "Kubernetes", "Terraform", "AI/ML", "Leadership"],
    position: [6, 0, -1],
    color: "#0075BE",
    brandLogo: "Career",
  },
  {
    id: "contact",
    icon: "📬",
    label: "Contact",
    year: "Now",
    category: "current",
    title: "Let's Connect",
    subtitle: "The next chapter starts with a conversation",
    narrative: "I'm always open to connecting — whether it's about cloud architecture, AI, leadership, or the next big thing.",
    position: [9, 0, -3],
    color: "#b5653a",
    image: "archil",
  },
];
