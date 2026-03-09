# Archil Patel — Cloud Architecture Portfolio

An interactive, gamified portfolio showcasing enterprise cloud architecture solutions built across AI/ML, serverless, containers, DevOps, and cybersecurity domains.

## 🎮 What This Portfolio Offers

- **Interactive Architecture Diagrams** — Real-world solution architectures (Azure RAG, AWS MLOps, Zero-Trust API Gateways) presented as explorable, zoomable diagrams
- **Fun Architecture Puzzles** — 20 drag-and-drop puzzles across 4 career roles with difficulty levels (Easy → Expert), covering real-world scenarios like LLMOps, Service Mesh, GraphRAG, and SOAR platforms
- **Storytelling Career Timeline** — Each role tells the story of challenges faced, architectures designed, and lessons learned
- **Board Game Theme** — The entire portfolio is designed as a strategy board game, reflecting my problem-solving mindset

## 🏗️ Architecture & Code Structure

```
src/
├── pages/
│   └── Index.tsx              # Entry point with intro screen
├── components/
│   ├── Experience.tsx         # Main game board with chapter tiles
│   ├── ChapterOverlay.tsx     # Full-screen chapter view
│   ├── WorldDive.tsx          # World container
│   ├── worlds/                # Each "world" is a chapter section
│   │   ├── CareerTimelineWorld.tsx   # Career journey with puzzles
│   │   ├── SkillTreeWorld.tsx        # Technical skills visualization
│   │   ├── CodeBuilderWorld.tsx      # Code showcase
│   │   ├── NetworkWorld.tsx          # Professional network
│   │   ├── ContactWorld.tsx          # Contact information
│   │   └── ...
│   ├── puzzles/               # Interactive puzzle components
│   │   ├── ArchDiagramPuzzle.tsx     # Drag-and-drop architecture puzzle
│   │   └── ReadOnlyDiagram.tsx       # Zoomable read-only diagram viewer
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── data/
│   ├── careerDiagrams.ts      # All architecture diagrams + 20 puzzles
│   ├── chapters.ts            # Chapter/tile definitions
│   └── brandLogos.ts          # Company logo mappings
└── assets/                    # Images and static assets
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript** — Type-safe component architecture
- **Vite** — Fast build tooling
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **Framer Motion** — Smooth animations and transitions
- **shadcn/ui** — Accessible component primitives
- **React Router** — Client-side routing

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/archil5/archilsworld.git
cd archilsworld

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### GitHub Pages Deployment

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment to GitHub Pages.

1. Enable GitHub Pages in your repo settings (Settings → Pages → Source: GitHub Actions)
2. Push to `main` — the workflow will build and deploy automatically

## 👨‍💻 About Me

**Archil Patel** — Principal Cloud Engineer specializing in enterprise AI platforms, serverless architectures, and zero-trust security patterns. Currently building secure GenAI solutions at scale in Canada's financial sector.

**Domains**: Azure AI (RAG/GraphRAG), AWS Serverless & Containers, MLOps, DevSecOps, Cybersecurity Automation

## 📄 License

This project is for portfolio/personal use.
