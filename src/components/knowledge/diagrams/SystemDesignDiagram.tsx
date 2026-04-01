import { motion } from "framer-motion";

const TEAL = "#0D9488";
const INK = "#0F172A";
const MUTED = "#475569";
const RED = "#DC2626";
const AMBER = "#D97706";
const BLUE = "#2563EB";

// Animated flowing dots along a path
const FlowDot = ({ delay, cx, cy, dx, dy, color }: { delay: number; cx: number; cy: number; dx: number; dy: number; color: string }) => (
  <motion.circle
    r={3}
    fill={color}
    initial={{ cx, cy, opacity: 0 }}
    animate={{ cx: cx + dx, cy: cy + dy, opacity: [0, 1, 1, 0] }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: "linear" }}
  />
);

const LoadBalancerDiagram = () => (
  <svg viewBox="0 0 400 220" className="w-full max-w-md mx-auto">
    {/* Client */}
    <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <rect x={165} y={10} width={70} height={32} rx={4} fill={`${INK}08`} stroke={INK} strokeWidth={1} />
      <text x={200} y={30} textAnchor="middle" fill={INK} fontSize={11} fontFamily="monospace">Clients</text>
    </motion.g>

    {/* Load Balancer */}
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
      <rect x={145} y={70} width={110} height={36} rx={6} fill={`${TEAL}15`} stroke={TEAL} strokeWidth={1.5} />
      <text x={200} y={92} textAnchor="middle" fill={TEAL} fontSize={11} fontFamily="monospace" fontWeight="bold">Load Balancer</text>
    </motion.g>

    {/* Servers */}
    {[0, 1, 2].map((i) => {
      const x = 60 + i * 130;
      return (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
          <rect x={x} y={140} width={80} height={40} rx={4} fill={`${BLUE}08`} stroke={BLUE} strokeWidth={1} />
          <text x={x + 40} y={155} textAnchor="middle" fill={BLUE} fontSize={10} fontFamily="monospace">Server {i + 1}</text>
          <motion.rect x={x + 8} y={165} width={0} height={4} rx={2} fill={TEAL}
            animate={{ width: [0, 20 + Math.random() * 40, 20 + Math.random() * 40, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }} />
          <text x={x + 40} y={175} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">
            {["25%", "40%", "35%"][i]} load
          </text>
        </motion.g>
      );
    })}

    {/* Connection lines */}
    <line x1={200} y1={42} x2={200} y2={70} stroke={`${INK}20`} strokeWidth={1} strokeDasharray="4,3" />
    {[100, 200, 300].map((x, i) => (
      <line key={i} x1={200} y1={106} x2={x} y2={140} stroke={`${TEAL}25`} strokeWidth={1} strokeDasharray="4,3" />
    ))}

    {/* Animated data packets */}
    <FlowDot delay={0} cx={200} cy={42} dx={0} dy={28} color={TEAL} />
    <FlowDot delay={0.5} cx={200} cy={106} dx={-100} dy={34} color={BLUE} />
    <FlowDot delay={1.0} cx={200} cy={106} dx={0} dy={34} color={BLUE} />
    <FlowDot delay={1.5} cx={200} cy={106} dx={100} dy={34} color={BLUE} />

    {/* Labels */}
    <motion.text x={340} y={90} fill={MUTED} fontSize={8} fontFamily="monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Round Robin
    </motion.text>
  </svg>
);

const CAPTriangleDiagram = () => (
  <svg viewBox="0 0 360 260" className="w-full max-w-sm mx-auto">
    {/* Triangle */}
    <motion.polygon
      points="180,30 40,220 320,220"
      fill={`${TEAL}06`}
      stroke={`${TEAL}30`}
      strokeWidth={1.5}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      style={{ transformOrigin: "180px 140px" }}
    />

    {/* Vertices */}
    {[
      { x: 180, y: 20, label: "Consistency", desc: "Every read gets latest write", color: BLUE },
      { x: 20, y: 232, label: "Availability", desc: "Every request gets response", color: TEAL },
      { x: 320, y: 232, label: "Partition\nTolerance", desc: "Works despite network splits", color: AMBER },
    ].map((v, i) => (
      <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}>
        <circle cx={v.x + (i === 0 ? 0 : i === 1 ? 20 : -20)} cy={v.y} r={8} fill={v.color} opacity={0.8} />
        <text x={v.x + (i === 0 ? 0 : i === 1 ? 20 : -20)} y={v.y - 14} textAnchor="middle" fill={v.color} fontSize={11} fontFamily="monospace" fontWeight="bold">
          {v.label.split("\n").map((l, j) => (
            <tspan key={j} x={v.x + (i === 0 ? 0 : i === 1 ? 20 : -20)} dy={j * 13}>{l}</tspan>
          ))}
        </text>
      </motion.g>
    ))}

    {/* "Pick 2" indicator */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x={140} y={125} width={80} height={28} rx={14} fill={`${RED}10`} stroke={`${RED}30`} strokeWidth={1} />
      <text x={180} y={143} textAnchor="middle" fill={RED} fontSize={10} fontFamily="monospace" fontWeight="bold">Pick 2</text>
    </motion.g>

    {/* Edge labels */}
    {[
      { x: 100, y: 120, label: "CP", desc: "Postgres" },
      { x: 260, y: 120, label: "AP", desc: "DynamoDB" },
      { x: 180, y: 240, label: "CA", desc: "(theoretical)" },
    ].map((e, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1 + i * 0.1 }}>
        <text x={e.x} y={e.y} textAnchor="middle" fill={MUTED} fontSize={9} fontFamily="monospace">{e.label}</text>
        <text x={e.x} y={e.y + 12} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">{e.desc}</text>
      </motion.g>
    ))}
  </svg>
);

const CachingDiagram = () => (
  <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
    {/* App */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={10} y={75} width={70} height={50} rx={4} fill={`${INK}06`} stroke={INK} strokeWidth={1} />
      <text x={45} y={100} textAnchor="middle" fill={INK} fontSize={10} fontFamily="monospace">App</text>
    </motion.g>

    {/* Cache */}
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
      <rect x={130} y={55} width={100} height={40} rx={20} fill={`${AMBER}10`} stroke={AMBER} strokeWidth={1.5} />
      <text x={180} y={79} textAnchor="middle" fill={AMBER} fontSize={10} fontFamily="monospace" fontWeight="bold">Cache</text>
      <text x={180} y={108} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">~1ms response</text>
    </motion.g>

    {/* Database */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={290} y={60} width={90} height={80} rx={4} fill={`${BLUE}06`} stroke={BLUE} strokeWidth={1} />
      <text x={335} y={95} textAnchor="middle" fill={BLUE} fontSize={10} fontFamily="monospace">Database</text>
      <text x={335} y={110} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">~50ms</text>
    </motion.g>

    {/* Cache Hit path (fast) */}
    <motion.path d="M 80 90 L 130 80" fill="none" stroke={TEAL} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.5 }} />
    <motion.path d="M 130 85 L 80 95" fill="none" stroke={TEAL} strokeWidth={1.5} strokeDasharray="4,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />

    {/* Cache Miss path (slow) */}
    <motion.path d="M 230 75 L 290 80" fill="none" stroke={`${RED}50`} strokeWidth={1} strokeDasharray="4,3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />

    {/* Labels */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x={85} y={60} width={40} height={16} rx={8} fill={`${TEAL}15`} />
      <text x={105} y={72} textAnchor="middle" fill={TEAL} fontSize={8} fontFamily="monospace">HIT ⚡</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <rect x={245} y={60} width={40} height={16} rx={8} fill={`${RED}10`} />
      <text x={265} y={72} textAnchor="middle" fill={RED} fontSize={8} fontFamily="monospace">MISS</text>
    </motion.g>

    {/* Animated hit rate bar */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      <text x={130} y={155} fill={MUTED} fontSize={8} fontFamily="monospace">Hit Rate</text>
      <rect x={130} y={160} width={150} height={8} rx={4} fill={`${INK}08`} />
      <motion.rect x={130} y={160} width={0} height={8} rx={4} fill={TEAL}
        animate={{ width: 127 }} transition={{ delay: 1.2, duration: 1, ease: "easeOut" }} />
      <text x={285} y={168} fill={TEAL} fontSize={8} fontFamily="monospace">85%</text>
    </motion.g>
  </svg>
);

const ShardingDiagram = () => (
  <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
    {/* Single DB */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={160} y={10} width={80} height={35} rx={4} fill={`${RED}08`} stroke={RED} strokeWidth={1} />
      <text x={200} y={30} textAnchor="middle" fill={RED} fontSize={9} fontFamily="monospace">Single DB</text>
      <text x={200} y={40} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">⚠ bottleneck</text>
    </motion.g>

    {/* Arrow down */}
    <motion.path d="M 200 45 L 200 65" fill="none" stroke={MUTED} strokeWidth={1} markerEnd="url(#arrow)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />

    {/* Sharded DBs */}
    {[
      { label: "Users A-H", color: TEAL, data: "2.1M rows" },
      { label: "Users I-P", color: BLUE, data: "1.8M rows" },
      { label: "Users Q-Z", color: AMBER, data: "2.3M rows" },
    ].map((shard, i) => {
      const x = 40 + i * 130;
      return (
        <motion.g key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}>
          <rect x={x} y={80} width={100} height={50} rx={4} fill={`${shard.color}08`} stroke={shard.color} strokeWidth={1} />
          <text x={x + 50} y={98} textAnchor="middle" fill={shard.color} fontSize={9} fontFamily="monospace" fontWeight="bold">
            Shard {i + 1}
          </text>
          <text x={x + 50} y={112} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">{shard.label}</text>
          <text x={x + 50} y={124} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">{shard.data}</text>

          {/* Animated write indicator */}
          <motion.rect x={x + 10} y={132} width={0} height={3} rx={1.5} fill={shard.color}
            animate={{ width: [0, 30 + Math.random() * 50, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }} />
        </motion.g>
      );
    })}

    {/* Shard key label */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      <text x={200} y={160} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">
        Shard key: user_id → hash % 3
      </text>
    </motion.g>

    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M 0 0 L 8 4 L 0 8 Z" fill={MUTED} />
      </marker>
    </defs>
  </svg>
);

const GenericFlowDiagram = ({ steps }: { steps: string[] }) => (
  <svg viewBox={`0 0 400 ${60 + steps.length * 55}`} className="w-full max-w-md mx-auto">
    {steps.map((step, i) => {
      const y = 15 + i * 55;
      const isLast = i === steps.length - 1;
      return (
        <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20} y={y} width={360} height={38} rx={4}
            fill={i === 0 ? `${TEAL}08` : i === steps.length - 1 ? `${BLUE}08` : `${INK}03`}
            stroke={i === 0 ? TEAL : i === steps.length - 1 ? BLUE : `${INK}12`}
            strokeWidth={1} />
          <circle cx={40} cy={y + 19} r={10} fill={i === 0 ? TEAL : i === steps.length - 1 ? BLUE : `${INK}15`} />
          <text x={40} y={y + 23} textAnchor="middle" fill="white" fontSize={9} fontFamily="monospace" fontWeight="bold">
            {i + 1}
          </text>
          <text x={60} y={y + 23} fill={INK} fontSize={10} fontFamily="monospace">
            {step.length > 50 ? step.substring(0, 50) + "…" : step}
          </text>
          {!isLast && (
            <motion.line x1={40} y1={y + 38} x2={40} y2={y + 55}
              stroke={`${TEAL}30`} strokeWidth={1.5} strokeDasharray="3,3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.12 + 0.1 }} />
          )}
        </motion.g>
      );
    })}
  </svg>
);

// Map topic IDs to specific diagrams
const DIAGRAM_MAP: Record<string, React.ReactNode> = {
  "load-balancing": <LoadBalancerDiagram />,
  "cap-theorem": <CAPTriangleDiagram />,
  "caching": <CachingDiagram />,
  "sharding": <ShardingDiagram />,
};

interface SystemDesignDiagramProps {
  topicId: string;
  steps?: string[];
}

const SystemDesignDiagram = ({ topicId, steps }: SystemDesignDiagramProps) => {
  const specific = DIAGRAM_MAP[topicId];
  if (specific) {
    return (
      <motion.div
        className="p-4 rounded-lg my-4"
        style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest mb-3 text-center" style={{ color: MUTED }}>
          Visual Overview
        </p>
        {specific}
      </motion.div>
    );
  }

  if (steps && steps.length > 0) {
    return (
      <motion.div
        className="p-4 rounded-lg my-4"
        style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest mb-3 text-center" style={{ color: MUTED }}>
          How It Works
        </p>
        <GenericFlowDiagram steps={steps.map(s => s.split("—")[0].split(":")[0].trim())} />
      </motion.div>
    );
  }

  return null;
};

export default SystemDesignDiagram;
