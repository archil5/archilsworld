import { motion } from "framer-motion";

const TEAL = "#0D9488";
const INK = "#0F172A";
const MUTED = "#475569";
const RED = "#DC2626";
const AMBER = "#D97706";
const BLUE = "#2563EB";
const VIOLET = "#7C3AED";

const FirstPrinciplesDiagram = () => (
  <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto">
    {/* Assumptions being stripped away */}
    {[
      { y: 15, label: "Convention", w: 260, color: `${RED}15` },
      { y: 45, label: "Assumption", w: 220, color: `${AMBER}15` },
      { y: 75, label: "Habit", w: 180, color: `${MUTED}10` },
    ].map((layer, i) => (
      <motion.g key={i} initial={{ opacity: 1 }} animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5 + i * 0.3, duration: 0.5 }}>
        <rect x={(320 - layer.w) / 2} y={layer.y} width={layer.w} height={24} rx={4}
          fill={layer.color} stroke={`${INK}10`} strokeWidth={1} />
        <text x={160} y={layer.y + 16} textAnchor="middle" fill={MUTED} fontSize={9} fontFamily="monospace">
          ✗ {layer.label}
        </text>
      </motion.g>
    ))}

    {/* Core truth */}
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: "spring" }}>
      <rect x={80} y={115} width={160} height={40} rx={6} fill={`${TEAL}12`} stroke={TEAL} strokeWidth={2} />
      <text x={160} y={135} textAnchor="middle" fill={TEAL} fontSize={11} fontFamily="monospace" fontWeight="bold">
        Fundamental Truth
      </text>
      <text x={160} y={148} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">
        Build up from here ↑
      </text>
    </motion.g>

    {/* Arrows down */}
    <motion.path d="M 160 105 L 160 115" fill="none" stroke={TEAL} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3 }} />
  </svg>
);

const InversionDiagram = () => (
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto">
    {/* Left: How to succeed? */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <rect x={10} y={20} width={140} height={120} rx={6} fill={`${MUTED}06`} stroke={`${INK}10`} strokeWidth={1} />
      <text x={80} y={14} textAnchor="middle" fill={MUTED} fontSize={9} fontFamily="monospace">Normal Thinking</text>
      <text x={80} y={45} textAnchor="middle" fill={MUTED} fontSize={9} fontFamily="monospace">"How to succeed?"</text>
      <text x={80} y={65} textAnchor="middle" fill={MUTED} fontSize={20}>🤔</text>
      <text x={80} y={90} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">Hard to define</text>
      <text x={80} y={105} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">Vague answers</text>
      <text x={80} y={130} textAnchor="middle" fill={RED} fontSize={8} fontFamily="monospace">✗ Often fails</text>
    </motion.g>

    {/* Arrow */}
    <motion.text x={170} y={85} textAnchor="middle" fill={TEAL} fontSize={20}
      initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 180 }}
      transition={{ delay: 0.5 }}>
      ↻
    </motion.text>

    {/* Right: How to guarantee failure? */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <rect x={190} y={20} width={140} height={120} rx={6} fill={`${TEAL}06`} stroke={TEAL} strokeWidth={1.5} />
      <text x={260} y={14} textAnchor="middle" fill={TEAL} fontSize={9} fontFamily="monospace" fontWeight="bold">Inversion</text>
      <text x={260} y={45} textAnchor="middle" fill={TEAL} fontSize={9} fontFamily="monospace">"How to fail?"</text>
      <text x={260} y={65} textAnchor="middle" fill={TEAL} fontSize={20}>🔄</text>
      <text x={260} y={90} textAnchor="middle" fill={INK} fontSize={8} fontFamily="monospace">Easy to list</text>
      <text x={260} y={105} textAnchor="middle" fill={INK} fontSize={8} fontFamily="monospace">Then avoid all</text>
      <text x={260} y={130} textAnchor="middle" fill={TEAL} fontSize={8} fontFamily="monospace">✓ Clear path</text>
    </motion.g>
  </svg>
);

const SecondOrderDiagram = () => (
  <svg viewBox="0 0 360 140" className="w-full max-w-sm mx-auto">
    {/* Chain of consequences */}
    {[
      { x: 10, label: "Action", desc: "Add feature", color: BLUE },
      { x: 95, label: "1st Order", desc: "Users happy", color: TEAL },
      { x: 185, label: "2nd Order", desc: "More support", color: AMBER },
      { x: 275, label: "3rd Order", desc: "Team burnout", color: RED },
    ].map((step, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.25 }}>
        <rect x={step.x} y={30} width={75} height={60} rx={4}
          fill={`${step.color}08`} stroke={step.color} strokeWidth={1} />
        <text x={step.x + 37} y={52} textAnchor="middle" fill={step.color} fontSize={8} fontFamily="monospace" fontWeight="bold">
          {step.label}
        </text>
        <text x={step.x + 37} y={70} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">
          {step.desc}
        </text>
        {i < 3 && (
          <motion.path d={`M ${step.x + 75} 60 L ${step.x + 95} 60`}
            fill="none" stroke={`${INK}20`} strokeWidth={1} markerEnd="url(#arrowM)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.25 + 0.15 }} />
        )}
      </motion.g>
    ))}

    {/* "Think further" prompt */}
    <motion.text x={180} y={120} textAnchor="middle" fill={AMBER} fontSize={9} fontFamily="monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      ↑ Most people stop at 1st order
    </motion.text>

    <defs>
      <marker id="arrowM" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 Z" fill={`${INK}30`} />
      </marker>
    </defs>
  </svg>
);

const MapVsTerritoryDiagram = () => (
  <svg viewBox="0 0 300 140" className="w-full max-w-xs mx-auto">
    {/* Map (simplified) */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <rect x={20} y={20} width={110} height={90} rx={4} fill={`${BLUE}06`} stroke={BLUE} strokeWidth={1} />
      <text x={75} y={15} textAnchor="middle" fill={BLUE} fontSize={9} fontFamily="monospace">The Map</text>
      {/* Simple straight lines */}
      <line x1={40} y1={45} x2={110} y2={45} stroke={`${BLUE}30`} strokeWidth={2} />
      <line x1={40} y1={65} x2={110} y2={65} stroke={`${BLUE}30`} strokeWidth={2} />
      <line x1={40} y1={85} x2={110} y2={85} stroke={`${BLUE}30`} strokeWidth={2} />
      <text x={75} y={105} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Clean, simple</text>
    </motion.g>

    {/* ≠ sign */}
    <motion.text x={150} y={70} textAnchor="middle" fill={RED} fontSize={18} fontWeight="bold"
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
      ≠
    </motion.text>

    {/* Territory (messy) */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={20} width={110} height={90} rx={4} fill={`${TEAL}06`} stroke={TEAL} strokeWidth={1} />
      <text x={225} y={15} textAnchor="middle" fill={TEAL} fontSize={9} fontFamily="monospace">The Territory</text>
      {/* Messy squiggly paths */}
      <motion.path d="M 190 45 Q 210 35 230 50 Q 250 60 260 45" fill="none" stroke={TEAL} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
      <motion.path d="M 185 65 Q 205 75 225 60 Q 245 50 265 70" fill="none" stroke={TEAL} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.8 }} />
      <motion.path d="M 190 85 Q 215 95 235 80 Q 255 70 260 90" fill="none" stroke={TEAL} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />
      <text x={225} y={105} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Messy, real</text>
    </motion.g>
  </svg>
);

const VISUAL_MAP: Record<string, React.ReactNode> = {
  "first-principles": <FirstPrinciplesDiagram />,
  "inversion": <InversionDiagram />,
  "second-order": <SecondOrderDiagram />,
  "map-territory": <MapVsTerritoryDiagram />,
};

interface MentalModelVisualProps {
  modelId: string;
}

const MentalModelVisual = ({ modelId }: MentalModelVisualProps) => {
  const visual = VISUAL_MAP[modelId];
  if (!visual) return null;

  return (
    <motion.div className="p-4 rounded-lg mb-4"
      style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {visual}
    </motion.div>
  );
};

export default MentalModelVisual;
