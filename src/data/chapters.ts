export interface ChapterData {
  id: string;
  icon: string;
  label: string;
  year: string;
  category: "origin" | "education" | "career" | "current";
  title: string;
  subtitle: string;
  narrative: string;
  tagline: string;
  exploreHint: string;
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
    label: "Curious Mind",
    year: "Childhood",
    category: "origin",
    title: "The Kid Who Asked Why",
    subtitle: "Where it all began",
    narrative: "I didn't just play DOS games — I interrogated them. Every pixel, every sound, every menu screen made me ask the same restless question: how did someone make this?",
    tagline: "The one who took things apart to understand how they worked",
    exploreHint: "Step into the mind that broke every toy to see how it worked",
    skills: ["Curiosity", "Problem Solving", "DOS"],
    position: [-5, 0, 0],
    color: "#2d4a7a",
    image: "curious-mind",
  },
  {
    id: "web-foundations",
    icon: "🌐",
    label: "Web & Network",
    year: "Early Days",
    category: "origin",
    title: "Building & Connecting",
    subtitle: "From HTML to packets — the full picture",
    narrative: "I found HTML and CSS — and suddenly I wasn't just a consumer anymore. Then networking cracked open the whole machine. I could see how everything talked to everything.",
    tagline: "Where I stopped consuming and started creating",
    exploreHint: "See where code met curiosity and the web came alive",
    skills: ["HTML", "CSS", "TCP/IP", "Network Architecture", "Web Design"],
    position: [-1.5, 0, -2],
    color: "#E44D26",
    image: "web-network",
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
    tagline: "Where curiosity became craft and thinking sharpened",
    exploreHint: "Inside the lab ↗",
    skills: ["Systems Thinking", "Security", "Automation", "Ethical Hacking"],
    position: [2, 0, -3],
    color: "#8B6914",
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
    tagline: "Seven years of building what banks run on",
    exploreHint: "The full story ↗",
    skills: ["AWS", "Azure", "Kubernetes", "Terraform", "AI/ML", "Leadership"],
    position: [5.5, 0, -1],
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
    tagline: "The next move is yours — let's talk",
    exploreHint: "Say hello ↗",
    position: [9, 0, -3],
    color: "#b5653a",
    image: "archil",
  },
];
