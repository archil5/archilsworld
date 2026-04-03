import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Server, Activity, GitMerge, Shield, Layers, Network, Timer, RefreshCcw, Globe, Flame } from "lucide-react";

const PATTERNS = [
  {
    id: "cp-dp",
    name: "Control Plane vs Data Plane",
    icon: <Server size={20} />,
    insight: "The data plane must survive the death of the control plane.",
    description: "The control plane manages state (config, provisioning). The data plane executes work (traffic). If etcd (control) dies, existing Kubernetes Pods (data) must keep serving traffic using their last known good configuration.",
    actionLabel: "Kill Control Plane",
    color: "blue"
  },
  {
    id: "blast-radius",
    name: "Blast Radius & Shuffle Sharding",
    icon: <Shield size={20} />,
    insight: "Quantify failure domains before designing features.",
    description: "Don't just handle failures—design their shape. Using cell-based architecture or shuffle sharding ensures a poisoned request or localized outage mathematically bounds the percentage of impacted customers.",
    actionLabel: "Inject Poison Pill",
    color: "emerald"
  },
  {
    id: "saga",
    name: "Process Manager (Saga)",
    icon: <GitMerge size={20} />,
    insight: "Decouple orchestration from implementation.",
    description: "Choreography is impossible to debug. Pure orchestration couples logic. A Process Manager holds state transitions and issues commands, letting domain services own their own logic. When a child saga fails, the manager orchestrates backward recovery.",
    actionLabel: "Simulate Step 3 Failure",
    color: "purple"
  },
  {
    id: "tail-latency",
    name: "Tail Latency & Hedged Requests",
    icon: <Timer size={20} />,
    insight: "P99 at high fan-out is an architecture problem.",
    description: "If you fan out to 100 services, your composite P50 is dictated by their P99. A hedged request sends a duplicate request if the first doesn't return by the median latency, converting a P99 tail problem into a P50 problem.",
    actionLabel: "Fire Hedged Request",
    color: "amber"
  },
  {
    id: "exactly-once",
    name: "Idempotency & Outbox Pattern",
    icon: <RefreshCcw size={20} />,
    insight: "Exactly-once delivery doesn't exist.",
    description: "Network realities force at-least-once delivery. Rely on application-level idempotency (unique keys, conditional writes) or the Outbox/Inbox pattern to ensure processing N times yields the exact same state as processing once.",
    actionLabel: "Fire Duplicate Events",
    color: "pink"
  },
  {
    id: "active-active",
    name: "Active-Active (CRDTs)",
    icon: <Globe size={20} />,
    insight: "Consistency is a dial, not a binary.",
    description: "Multi-region writes require conflict resolution. Last-Write-Wins often silently destroys data. Conflict-free Replicated Data Types (CRDTs) mathematically guarantee concurrent updates can merge without data loss.",
    actionLabel: "Simulate Concurrent Write",
    color: "indigo"
  },
  {
    id: "chaos",
    name: "Chaos Engineering",
    icon: <Flame size={20} />,
    insight: "Validate assumptions, don't just test bugs.",
    description: "Killing a pod is easy. Injecting a 5-minute clock skew or silent network packet loss exposes the real gaps between your architecture diagrams and production reality.",
    actionLabel: "Inject Network Latency",
    color: "orange"
  },
  {
    id: "backpressure",
    name: "Adaptive Backpressure",
    icon: <Layers size={20} />,
    insight: "Without backpressure, overload causes death spirals.",
    description: "Queuing excess load kills systems via cascading timeouts. An API gateway using load shedding and adaptive concurrency limits rejects work at the edge (503) to keep internal systems at a stable operating point.",
    actionLabel: "Trigger Traffic Spike",
    color: "red"
  }
];

const Packet = ({ delay = 0, color = "bg-slate-400", x = [0, 100], y = [0,0], duration = 1, repeat = Infinity }) => (
  <motion.div
    className={`absolute w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${color}`}
    animate={{ x, y, opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat, ease: "linear" }}
  />
);

export default function CloudPatternsModule({ onBack }: { onBack: () => void }) {
  const [activeId, setActiveId] = useState(PATTERNS[0].id);
  const activePattern = PATTERNS.find(p => p.id === activeId) || PATTERNS[0];
  const [simState, setSimState] = useState<"steady" | "triggered" | "resolved">("steady");

  const triggerSimulation = () => {
    setSimState("triggered");
    setTimeout(() => setSimState("resolved"), 2500);
    setTimeout(() => setSimState("steady"), 6000);
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 bg-[#0B1120] text-slate-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-mono text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> System Architecture
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Pattern Index */}
          <div className="lg:col-span-4 flex flex-col gap-3 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Principal Patterns</h2>
            {PATTERNS.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => { setActiveId(pattern.id); setSimState("steady"); }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-3 ${
                  activeId === pattern.id 
                    ? `bg-slate-800/80 border-slate-600 shadow-lg` 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeId === pattern.id ? `bg-${pattern.color}-500/20 text-${pattern.color}-400` : 'bg-slate-800 text-slate-500'}`}>
                    {pattern.icon}
                  </div>
                  <h3 className={`font-bold font-display text-sm ${activeId === pattern.id ? 'text-white' : 'text-slate-300'}`}>
                    {pattern.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Interactive Dashboard */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Context & Theory */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-white mb-2">{activePattern.name}</h3>
              <p className="text-emerald-400 font-mono text-xs mb-6 uppercase tracking-wider">{activePattern.insight}</p>
              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                {activePattern.description}
              </p>
            </div>

            {/* Live Telemetry Sandbox */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 relative overflow-hidden h-[400px] flex flex-col items-center justify-center shadow-2xl ring-1 ring-white/5">
              
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

              <div className="absolute top-4 left-6 flex items-center gap-3 z-20">
                <Activity size={16} className={simState === "triggered" ? "text-red-500" : "text-blue-500"} />
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                  Live Telemetry / {activePattern.id}
                </span>
              </div>

              <button 
                onClick={triggerSimulation}
                disabled={simState !== "steady"}
                className="absolute top-4 right-6 z-20 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-colors"
              >
                {simState === "steady" ? activePattern.actionLabel : "Executing..."}
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePattern.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full max-w-2xl h-full flex items-center justify-center relative z-10 font-mono text-xs"
                >
                  
                  {/* --- SIM: CONTROL PLANE VS DATA PLANE --- */}
                  {activePattern.id === "cp-dp" && (
                    <div className="flex flex-col gap-12 w-full px-12">
                      {/* Control Plane */}
                      <div className="flex items-center gap-8">
                        <div className="w-24 text-right text-slate-500 uppercase text-[10px]">Control Plane</div>
                        <motion.div 
                          animate={simState !== "steady" ? { backgroundColor: "#450a0a", borderColor: "#ef4444" } : { backgroundColor: "#1e3a8a", borderColor: "#3b82f6" }}
                          className="w-32 h-16 border-2 rounded-lg flex items-center justify-center text-slate-300 relative"
                        >
                          etcd / API
                          {simState !== "steady" && <span className="absolute -top-6 text-red-500 text-[10px] font-bold">OFFLINE</span>}
                        </motion.div>
                        <div className="flex-1 h-0.5 bg-slate-800 relative">
                          {simState === "steady" && <Packet color="bg-blue-500" x={[0, 100]} duration={2} />}
                          {simState === "steady" && <span className="absolute -top-4 left-4 text-[8px] text-blue-500">Config Sync</span>}
                        </div>
                      </div>

                      {/* Data Plane */}
                      <div className="flex items-center gap-8">
                        <div className="w-24 text-right text-slate-500 uppercase text-[10px]">Data Plane</div>
                        <div className="w-32 h-16 border-2 border-emerald-600 bg-emerald-900/30 rounded-lg flex flex-col items-center justify-center text-emerald-400 relative shadow-[0_0_15px_rgba(5,150,105,0.2)]">
                          Gateway
                          <span className="text-[8px] opacity-70 mt-1">Cached Config</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-slate-800 relative">
                          <Packet color="bg-emerald-400" x={[0, 200]} duration={0.8} delay={0} />
                          <Packet color="bg-emerald-400" x={[0, 200]} duration={0.8} delay={0.4} />
                          <span className="absolute -top-4 left-4 text-[8px] text-emerald-500">Live User Traffic</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SIM: TAIL LATENCY & HEDGED REQUESTS --- */}
                  {activePattern.id === "tail-latency" && (
                    <div className="w-full flex flex-col gap-6 relative px-8">
                      <div className="absolute left-[50%] top-0 bottom-0 border-l border-dashed border-slate-700" />
                      <span className="absolute left-[50%] -top-6 -translate-x-1/2 text-[10px] text-slate-500">P50 Timeout (Hedge Trigger)</span>

                      {/* Slow Request */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-right text-slate-500">Req 1</div>
                        <div className="flex-1 h-4 bg-slate-800 rounded-full relative overflow-hidden">
                          <motion.div 
                            animate={simState !== "steady" ? { width: ["0%", "100%"] } : { width: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className={`h-full ${simState === "resolved" ? 'bg-red-900' : 'bg-blue-500'}`}
                          />
                        </div>
                        <div className="w-12 text-xs text-red-400">{simState !== "steady" ? "Slow" : ""}</div>
                      </div>

                      {/* Hedged Request */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-right text-slate-500">Req 2 (Hedge)</div>
                        <div className="flex-1 h-4 bg-slate-800 rounded-full relative overflow-hidden">
                          {simState !== "steady" && (
                            <motion.div 
                              initial={{ width: "0%" }}
                              animate={{ width: ["0%", "100%"] }}
                              transition={{ duration: 0.5, delay: 2, ease: "easeOut" }} // Triggers at P50
                              className="h-full bg-emerald-500"
                            />
                          )}
                        </div>
                        <div className="w-12 text-xs text-emerald-400">{simState === "resolved" ? "Won" : ""}</div>
                      </div>
                      
                      {simState === "resolved" && (
                        <div className="text-center mt-4 text-emerald-400 text-[10px] uppercase">
                          Req 1 Cancelled. Tail Latency Bypassed.
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- SIM: BACKPRESSURE --- */}
                  {activePattern.id === "backpressure" && (
                    <div className="flex justify-between items-center w-full px-8 gap-8">
                      <div className="flex flex-col gap-2 relative">
                        <span className="text-[10px] text-slate-500 uppercase absolute -top-8 -left-4">Ingress</span>
                        {/* High volume traffic incoming */}
                        <div className="w-32 h-1 bg-transparent relative">
                          {simState === "steady" && <Packet color="bg-blue-400" x={[-50, 50]} duration={1} />}
                          {simState !== "steady" && [...Array(10)].map((_, i) => (
                            <Packet key={i} color="bg-red-400" x={[-50, 30]} duration={0.5} delay={i * 0.1} />
                          ))}
                        </div>
                      </div>

                      <motion.div 
                        animate={simState !== "steady" ? { backgroundColor: "#7f1d1d", borderColor: "#ef4444" } : {}}
                        className="w-24 h-24 border-2 border-slate-600 bg-slate-800 rounded-lg flex flex-col items-center justify-center z-10 relative"
                      >
                        Gateway
                        {simState !== "steady" && <span className="absolute -top-6 text-red-400 text-[10px] font-bold">LOAD SHEDDING</span>}
                        {simState !== "steady" && (
                           <div className="absolute -bottom-8 text-red-500 text-[10px] flex flex-col items-center">
                             <span>↓ 503 Rejected</span>
                           </div>
                        )}
                      </motion.div>

                      <div className="flex flex-col items-center">
                        <div className="w-24 h-16 border-2 border-emerald-600 bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-400">
                          Internal DB
                        </div>
                        <span className="text-[8px] mt-2 text-emerald-500">Stable Operating Point</span>
                      </div>
                    </div>
                  )}

                  {/* Fallback for others to keep code concise - identical rendering pattern */}
                  {!["cp-dp", "tail-latency", "backpressure"].includes(activePattern.id) && (
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-4">
                      <Activity className="animate-pulse" size={32} />
                      <div className="uppercase tracking-widest text-[10px]">
                        [{activePattern.name}] Telemetry Engine Ready
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
