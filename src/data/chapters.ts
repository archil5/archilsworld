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
  brandLogo?: string; // text-based brand identifier
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
  },
  {
    id: "rbc",
    icon: "🏦",
    label: "RBC",
    year: "2018",
    category: "career",
    title: "First Move on the Board",
    subtitle: "RBC · DevOps Engineer — Cyber Security",
    narrative: "My first move on the board. I walked into one of the largest banks in the country and built automation for cybersecurity compliance.",
    skills: ["Ansible", "Python", "Jenkins", "Palo Alto", "DevOps"],
    position: [6, 0, -1],
    color: "#005DAA",
    brandLogo: "RBC",
  },
  {
    id: "bmo",
    icon: "☁️",
    label: "BMO",
    year: "2019–Present",
    category: "career",
    title: "The Full Journey",
    subtitle: "BMO · Cloud Infra → Senior → Lead → Principal → AI",
    narrative: "From cloud infrastructure to AI architecture — seven years of building, leading, and transforming platform engineering at scale.",
    skills: ["AWS", "Azure", "Kubernetes", "Terraform", "AI/ML"],
    position: [9, 0, -3],
    color: "#0075BE",
    brandLogo: "BMO",
  },
];
