import { motion } from "framer-motion";

const TEAL = "#0D9488";
const INK = "#0F172A";
const MUTED = "#475569";
const RED = "#DC2626";
const AMBER = "#D97706";
const BLUE = "#2563EB";

const MiniLineChart = ({ data, color, label }: { data: number[]; color: string; label: string }) => {
  const w = 300, h = 80, pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = points + ` ${w - pad},${h - pad} ${pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full max-w-xs mx-auto">
      <motion.polygon points={areaPoints} fill={`${color}08`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <motion.polyline points={points} fill="none" stroke={color} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
      {/* End dot */}
      {data.length > 0 && (
        <motion.circle
          cx={w - pad}
          cy={pad + (1 - (data[data.length - 1] - min) / range) * (h - pad * 2)}
          r={4} fill={color}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
        />
      )}
      <text x={w / 2} y={h + 15} textAnchor="middle" fill={MUTED} fontSize={9} fontFamily="monospace">{label}</text>
    </svg>
  );
};

const OwnershipPie = () => (
  <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
    {/* Simplified pie showing ownership */}
    <motion.circle cx={100} cy={100} r={70} fill="none" stroke={`${INK}08`} strokeWidth={20}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
    <motion.circle cx={100} cy={100} r={70} fill="none" stroke={TEAL} strokeWidth={20}
      strokeDasharray="440" strokeDashoffset={440 - 440 * 0.001}
      transform="rotate(-90 100 100)"
      initial={{ strokeDashoffset: 440 }} animate={{ strokeDashoffset: 440 - 440 * 0.001 }}
      transition={{ delay: 0.5, duration: 0.8 }} />
    <text x={100} y={95} textAnchor="middle" fill={TEAL} fontSize={14} fontFamily="monospace" fontWeight="bold">0.1%</text>
    <text x={100} y={112} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">Your slice</text>
  </svg>
);

const CompoundGrowthChart = () => {
  // Simple compound growth: $100/month for 30 years at 10%
  const years = Array.from({ length: 31 }, (_, i) => i);
  const invested = years.map(y => y * 1200);
  const compounded = years.map(y => {
    let total = 0;
    for (let m = 0; m < y * 12; m++) {
      total = (total + 100) * (1 + 0.10 / 12);
    }
    return Math.round(total);
  });

  const maxVal = Math.max(...compounded);
  const w = 320, h = 140, pad = 30;

  const toPoint = (arr: number[], i: number) => {
    const x = pad + (i / (years.length - 1)) * (w - pad * 2);
    const y = h - pad - ((arr[i] / maxVal) * (h - pad * 2));
    return { x, y };
  };

  return (
    <svg viewBox={`0 0 ${w} ${h + 30}`} className="w-full max-w-sm mx-auto">
      {/* Invested line */}
      <motion.polyline
        points={years.map(i => { const p = toPoint(invested, i); return `${p.x},${p.y}`; }).join(" ")}
        fill="none" stroke={MUTED} strokeWidth={1.5} strokeDasharray="4,3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />

      {/* Compounded line */}
      <motion.polyline
        points={years.map(i => { const p = toPoint(compounded, i); return `${p.x},${p.y}`; }).join(" ")}
        fill="none" stroke={TEAL} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />

      {/* Gap highlight at year 30 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <line x1={w - pad} y1={toPoint(invested, 30).y} x2={w - pad} y2={toPoint(compounded, 30).y}
          stroke={TEAL} strokeWidth={1} strokeDasharray="3,2" />
        <text x={w - pad + 5} y={(toPoint(invested, 30).y + toPoint(compounded, 30).y) / 2}
          fill={TEAL} fontSize={8} fontFamily="monospace" fontWeight="bold">
          +${Math.round((compounded[30] - invested[30]) / 1000)}k
        </text>
      </motion.g>

      {/* Labels */}
      <text x={pad} y={h + 15} fill={MUTED} fontSize={8} fontFamily="monospace">Year 0</text>
      <text x={w - pad} y={h + 15} textAnchor="end" fill={MUTED} fontSize={8} fontFamily="monospace">Year 30</text>
      <text x={w / 2} y={h + 28} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">
        $100/mo at 10% annual return
      </text>

      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={pad} y1={8} x2={pad + 20} y2={8} stroke={MUTED} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={pad + 25} y={11} fill={MUTED} fontSize={7} fontFamily="monospace">Invested</text>
        <line x1={pad + 80} y1={8} x2={pad + 100} y2={8} stroke={TEAL} strokeWidth={2} />
        <text x={pad + 105} y={11} fill={TEAL} fontSize={7} fontFamily="monospace">With compounding</text>
      </motion.g>
    </svg>
  );
};

const RiskRewardBar = () => (
  <svg viewBox="0 0 300 100" className="w-full max-w-xs mx-auto">
    {[
      { label: "Savings", risk: 5, reward: 8, color: TEAL },
      { label: "Bonds", risk: 15, reward: 20, color: BLUE },
      { label: "ETFs", risk: 35, reward: 45, color: AMBER },
      { label: "Stocks", risk: 60, reward: 70, color: RED },
    ].map((item, i) => {
      const y = 5 + i * 24;
      return (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <text x={5} y={y + 14} fill={INK} fontSize={9} fontFamily="monospace">{item.label}</text>
          <rect x={65} y={y + 3} width={220} height={16} rx={2} fill={`${INK}04`} />
          <motion.rect x={65} y={y + 3} width={0} height={8} rx={2} fill={`${item.color}40`}
            animate={{ width: item.risk * 2.2 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} />
          <motion.rect x={65} y={y + 11} width={0} height={8} rx={2} fill={item.color}
            animate={{ width: item.reward * 2.2 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }} />
        </motion.g>
      );
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x={200} y={3} width={8} height={8} fill={`${MUTED}40`} />
      <text x={212} y={10} fill={MUTED} fontSize={7} fontFamily="monospace">Risk</text>
      <rect x={245} y={3} width={8} height={8} fill={TEAL} />
      <text x={257} y={10} fill={MUTED} fontSize={7} fontFamily="monospace">Reward</text>
    </motion.g>
  </svg>
);

const VISUAL_MAP: Record<string, React.ReactNode> = {
  "what-is-stock": <OwnershipPie />,
  "how-market-works": <MiniLineChart data={[100, 105, 98, 110, 108, 115, 112, 120, 118, 125, 130, 128, 135]} color={TEAL} label="Price over time — supply & demand" />,
  "stock-vs-etf": <RiskRewardBar />,
  "how-to-make-money": <CompoundGrowthChart />,
  "reading-stock-chart": <MiniLineChart data={[50, 52, 48, 55, 53, 58, 56, 60, 57, 62, 65, 63, 68, 70]} color={BLUE} label="Candlestick vs Line — same data, different detail" />,
  "risk-management": <RiskRewardBar />,
};

interface StockVisualProps {
  topicId: string;
}

const StockVisual = ({ topicId }: StockVisualProps) => {
  const visual = VISUAL_MAP[topicId];
  if (!visual) return null;

  return (
    <motion.div className="p-4 rounded-lg mb-4"
      style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {visual}
    </motion.div>
  );
};

export default StockVisual;
