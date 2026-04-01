import { motion } from "framer-motion";

const TEAL = "#0D9488";
const INK = "#0F172A";
const MUTED = "#475569";
const RED = "#DC2626";
const AMBER = "#D97706";
const BLUE = "#2563EB";
const VIOLET = "#7C3AED";

const EventSourcingDiagram = () => (
  <svg viewBox="0 0 400 180" className="w-full max-w-md mx-auto">
    {/* Event Stream (timeline) */}
    <motion.line x1={30} y1={60} x2={370} y2={60} stroke={`${TEAL}30`} strokeWidth={2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />

    {/* Events on the timeline */}
    {[
      { x: 60, label: "Created", color: TEAL },
      { x: 140, label: "Updated", color: BLUE },
      { x: 220, label: "Approved", color: TEAL },
      { x: 300, label: "Deployed", color: AMBER },
    ].map((evt, i) => (
      <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + i * 0.15, type: "spring" }}>
        <circle cx={evt.x} cy={60} r={8} fill={evt.color} />
        <text x={evt.x} y={64} textAnchor="middle" fill="white" fontSize={7} fontFamily="monospace">E{i + 1}</text>
        <text x={evt.x} y={82} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">{evt.label}</text>
      </motion.g>
    ))}

    {/* Arrow labels */}
    <motion.text x={30} y={45} fill={MUTED} fontSize={8} fontFamily="monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      t=0
    </motion.text>
    <motion.text x={350} y={45} fill={MUTED} fontSize={8} fontFamily="monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      now
    </motion.text>

    {/* Current State box */}
    <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
      <rect x={130} y={110} width={140} height={45} rx={4} fill={`${TEAL}08`} stroke={TEAL} strokeWidth={1} />
      <text x={200} y={128} textAnchor="middle" fill={TEAL} fontSize={9} fontFamily="monospace" fontWeight="bold">Current State</text>
      <text x={200} y={145} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">= replay(E1→E4)</text>
    </motion.g>

    {/* Arrow from timeline to state */}
    <motion.path d="M 200 68 L 200 110" fill="none" stroke={`${TEAL}40`} strokeWidth={1} strokeDasharray="4,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />

    <text x={200} y={20} textAnchor="middle" fill={INK} fontSize={10} fontFamily="monospace" fontWeight="bold">
      Immutable Event Log
    </text>
  </svg>
);

const CQRSDiagram = () => (
  <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
    {/* Write side */}
    <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
      <rect x={20} y={30} width={160} height={140} rx={6} fill={`${RED}04`} stroke={`${RED}20`} strokeWidth={1} strokeDasharray="6,4" />
      <text x={100} y={22} textAnchor="middle" fill={RED} fontSize={10} fontFamily="monospace" fontWeight="bold">WRITE SIDE</text>

      <rect x={40} y={50} width={120} height={28} rx={4} fill={`${RED}08`} stroke={`${RED}25`} strokeWidth={1} />
      <text x={100} y={68} textAnchor="middle" fill={RED} fontSize={9} fontFamily="monospace">Commands</text>

      <rect x={40} y={95} width={120} height={28} rx={4} fill={`${AMBER}08`} stroke={`${AMBER}25`} strokeWidth={1} />
      <text x={100} y={113} textAnchor="middle" fill={AMBER} fontSize={9} fontFamily="monospace">Validation</text>

      <rect x={40} y={135} width={120} height={28} rx={4} fill={`${INK}06`} stroke={`${INK}15`} strokeWidth={1} />
      <text x={100} y={153} textAnchor="middle" fill={INK} fontSize={9} fontFamily="monospace">Write Store</text>
    </motion.g>

    {/* Read side */}
    <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <rect x={220} y={30} width={160} height={140} rx={6} fill={`${TEAL}04`} stroke={`${TEAL}20`} strokeWidth={1} strokeDasharray="6,4" />
      <text x={300} y={22} textAnchor="middle" fill={TEAL} fontSize={10} fontFamily="monospace" fontWeight="bold">READ SIDE</text>

      <rect x={240} y={50} width={120} height={28} rx={4} fill={`${TEAL}08`} stroke={`${TEAL}25`} strokeWidth={1} />
      <text x={300} y={68} textAnchor="middle" fill={TEAL} fontSize={9} fontFamily="monospace">Queries</text>

      <rect x={240} y={95} width={120} height={28} rx={4} fill={`${BLUE}08`} stroke={`${BLUE}25`} strokeWidth={1} />
      <text x={300} y={113} textAnchor="middle" fill={BLUE} fontSize={9} fontFamily="monospace">Projections</text>

      <rect x={240} y={135} width={120} height={28} rx={4} fill={`${INK}06`} stroke={`${INK}15`} strokeWidth={1} />
      <text x={300} y={153} textAnchor="middle" fill={INK} fontSize={9} fontFamily="monospace">Read Store</text>
    </motion.g>

    {/* Sync arrow */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <path d="M 160 150 Q 200 185 240 150" fill="none" stroke={VIOLET} strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={200} y={192} textAnchor="middle" fill={VIOLET} fontSize={8} fontFamily="monospace">Event Sync</text>
    </motion.g>

    {/* Animated sync dots */}
    <motion.circle r={3} fill={VIOLET}
      animate={{ offsetDistance: ["0%", "100%"] }}
      style={{ offsetPath: 'path("M 160 150 Q 200 185 240 150")' } as any}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
  </svg>
);

const CircuitBreakerDiagram = () => {
  const states = [
    { label: "CLOSED", desc: "Normal flow", color: TEAL, x: 60, y: 80 },
    { label: "OPEN", desc: "Fail fast", color: RED, x: 200, y: 80 },
    { label: "HALF-OPEN", desc: "Test probe", color: AMBER, x: 340, y: 80 },
  ];

  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-md mx-auto">
      {states.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2, type: "spring" }}>
          <circle cx={s.x} cy={s.y} r={30} fill={`${s.color}10`} stroke={s.color} strokeWidth={1.5} />
          <text x={s.x} y={s.y - 3} textAnchor="middle" fill={s.color} fontSize={8} fontFamily="monospace" fontWeight="bold">{s.label}</text>
          <text x={s.x} y={s.y + 10} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">{s.desc}</text>
        </motion.g>
      ))}

      {/* Transition arrows */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <path d="M 90 70 L 170 70" fill="none" stroke={RED} strokeWidth={1} markerEnd="url(#arrowR)" />
        <text x={130} y={62} textAnchor="middle" fill={RED} fontSize={7} fontFamily="monospace">failures ≥ N</text>

        <path d="M 230 70 L 310 70" fill="none" stroke={AMBER} strokeWidth={1} markerEnd="url(#arrowA)" />
        <text x={270} y={62} textAnchor="middle" fill={AMBER} fontSize={7} fontFamily="monospace">timeout</text>

        <path d="M 340 110 Q 200 150 60 110" fill="none" stroke={TEAL} strokeWidth={1} markerEnd="url(#arrowT)" />
        <text x={200} y={145} textAnchor="middle" fill={TEAL} fontSize={7} fontFamily="monospace">success → reset</text>
      </motion.g>

      <defs>
        <marker id="arrowR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 Z" fill={RED} /></marker>
        <marker id="arrowA" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 Z" fill={AMBER} /></marker>
        <marker id="arrowT" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 Z" fill={TEAL} /></marker>
      </defs>
    </svg>
  );
};

const GenericFlowDiagram = ({ steps }: { steps: string[] }) => (
  <svg viewBox={`0 0 380 ${40 + steps.length * 45}`} className="w-full max-w-sm mx-auto">
    {steps.map((step, i) => {
      const y = 10 + i * 45;
      const colors = [TEAL, BLUE, AMBER, VIOLET, RED];
      const color = colors[i % colors.length];
      return (
        <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={15} y={y} width={350} height={32} rx={4}
            fill={`${color}06`} stroke={`${color}20`} strokeWidth={1} />
          <circle cx={35} cy={y + 16} r={9} fill={color} opacity={0.8} />
          <text x={35} y={y + 20} textAnchor="middle" fill="white" fontSize={8} fontFamily="monospace" fontWeight="bold">{i + 1}</text>
          <text x={55} y={y + 20} fill={INK} fontSize={9} fontFamily="monospace">
            {step.length > 45 ? step.substring(0, 45) + "…" : step}
          </text>
          {i < steps.length - 1 && (
            <motion.line x1={35} y1={y + 32} x2={35} y2={y + 45}
              stroke={`${color}30`} strokeWidth={1.5} strokeDasharray="3,2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.1 + 0.05 }} />
          )}
        </motion.g>
      );
    })}
  </svg>
);

const DIAGRAM_MAP: Record<string, React.ReactNode> = {
  "event-sourcing": <EventSourcingDiagram />,
  "cqrs": <CQRSDiagram />,
  "circuit-breaker": <CircuitBreakerDiagram />,
};

interface CloudPatternDiagramProps {
  patternId: string;
  steps?: string[];
}

const CloudPatternDiagram = ({ patternId, steps }: CloudPatternDiagramProps) => {
  const specific = DIAGRAM_MAP[patternId];
  if (specific) {
    return (
      <motion.div className="p-4 rounded-lg my-4"
        style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <p className="font-mono text-xs uppercase tracking-widest mb-3 text-center" style={{ color: MUTED }}>
          Architecture Diagram
        </p>
        {specific}
      </motion.div>
    );
  }

  if (steps && steps.length > 0) {
    return (
      <motion.div className="p-4 rounded-lg my-4"
        style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <p className="font-mono text-xs uppercase tracking-widest mb-3 text-center" style={{ color: MUTED }}>
          Pattern Flow
        </p>
        <GenericFlowDiagram steps={steps.map(s => s.split("—")[0].split(":")[0].trim().replace(/^\d+\.\s*/, ""))} />
      </motion.div>
    );
  }

  return null;
};

export default CloudPatternDiagram;
