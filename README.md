# Archil Patel — Interactive 3D Portfolio

An immersive, board-game-inspired portfolio built with React Three Fiber. Navigate a 3D hex-tile journey through my career — from childhood curiosity to enterprise AI architecture.

## ✨ Live Demo

**[archilpatel.com](https://archilpatel.com)** *(or your deployed URL)*

## 🎮 Experience Overview

This isn't a typical portfolio. It's an **interactive 3D board game** where each hex tile represents a chapter of my journey:

| Tile | Chapter | What's Inside |
|------|---------|---------------|
| 🕹️ | **Curious Mind** | DOS terminal nostalgia — where my tech curiosity began |
| 🌐 | **Web & Network** | Early days of HTML/CSS and network fundamentals |
| 🎓 | **Dalhousie** | Master's in Applied CS — skill tree visualization |
| 💼 | **Career** | RBC → BMO timeline with interactive architecture diagrams |
| 📬 | **Contact** | Connect with me |

### Key Features

- **3D Board Navigation** — Scroll/swipe/arrow keys to move between hex tiles
- **Cinematic Dive Animations** — Zoom into each "world" with dramatic transitions
- **Interactive Architecture Puzzles** — 20+ drag-and-drop cloud architecture challenges
- **Mobile-Friendly** — Full touch support with responsive layouts
- **Parchment Aesthetic** — Strategy board game visual design (think Wingspan/Catan)

## 🏗️ Architecture

```
src/
├── components/
│   ├── Experience.tsx           # Main 3D scene orchestrator
│   ├── WorldDive.tsx            # Chapter world container + animations
│   ├── ChapterOverlay.tsx       # Bottom info panel with typewriter effect
│   │
│   ├── three/                   # React Three Fiber components
│   │   ├── HexTile.tsx          # Interactive hex tiles with popups
│   │   ├── BoardPath.tsx        # Connecting paths between tiles
│   │   ├── BoardSurface.tsx     # Parchment board background
│   │   ├── CameraController.tsx # Smooth camera follow
│   │   ├── GamePiece.tsx        # Meeple game piece
│   │   └── Particles.tsx        # Ambient floating particles
│   │
│   ├── worlds/                  # Each chapter's immersive content
│   │   ├── DosTerminalWorld.tsx       # Retro DOS terminal
│   │   ├── WebFoundationsWorld.tsx    # Web/network learning journey
│   │   ├── SkillTreeWorld.tsx         # Interactive skill visualization
│   │   ├── CareerTimelineWorld.tsx    # Full career with arch diagrams
│   │   └── ContactWorld.tsx           # Contact form
│   │
│   └── puzzles/                 # Architecture puzzle system
│       ├── ArchDiagramPuzzle.tsx      # Drag-and-drop puzzle engine
│       └── ReadOnlyDiagram.tsx        # Zoomable diagram viewer
│
├── data/
│   ├── chapters.ts              # Tile positions, colors, narratives
│   ├── careerDiagrams.ts        # 20+ architecture diagrams & puzzles
│   └── brandLogos.ts            # Company logo mappings
│
└── assets/                      # Images (curious-mind, web-network, etc.)
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **3D Engine** | React Three Fiber + Drei |
| **Framework** | React 18 + TypeScript |
| **Styling** | Tailwind CSS + Custom Design Tokens |
| **Animation** | Framer Motion |
| **Build** | Vite |
| **UI Components** | shadcn/ui |

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/archil5/archilsworld.git
cd archilsworld

# Install
npm install

# Dev server (localhost:8080)
npm run dev

# Production build
npm run build
```

## 📦 Deployment

### GitHub Pages (Automated)

The repo includes `.github/workflows/deploy.yml` for automatic deployment:

1. Enable GitHub Pages: **Settings → Pages → Source: GitHub Actions**
2. Push to `main` — deploys automatically

### Manual Deploy

```bash
npm run build
# Deploy the `dist/` folder to any static host
```

## 🎯 Career Highlights

The **Career** world showcases real enterprise architectures I've designed:

- **Enterprise AI Platform** — Agentic AI, LLMOps, GraphRAG on Azure
- **Zero-Trust API Gateway** — Private API Gateway + Lambda Authorizers
- **Multi-Account MLOps** — Cross-account SageMaker pipelines
- **Ephemeral CI/CD** — Autoscaling GitHub runners on ECS Fargate
- **Cybersecurity Automation** — 10,000+ endpoint vulnerability scanning

Each architecture includes interactive puzzles to test your cloud knowledge!

## 👨‍💻 About Me

**Archil Patel** — Principal Cloud Engineer specializing in enterprise AI platforms, serverless architectures, and zero-trust security patterns. Currently building secure GenAI solutions at BMO in Canada.

**Domains**: Azure AI (RAG/GraphRAG/LLMOps), AWS Serverless & Containers, MLOps, DevSecOps

## 📄 License

Personal portfolio project. Architecture diagrams represent simplified versions of enterprise solutions.

---

*Built with ❤️ using React Three Fiber and way too much coffee.*
