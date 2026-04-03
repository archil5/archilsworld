import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Server, Database, Zap, ShieldAlert, Activity, RefreshCcw, Layers } from "lucide-react";

export default function CloudPatternsModule({ onBack }: { onBack: () => void }) {
  // States: "healthy" | "degraded" | "critical" | "crashed" | "recovered_cb" | "wrong_fix"
  const [sysState, setSysState] = useState<string>("healthy");
  const [threadCount, setThreadCount] = useState(0);
  const MAX_THREADS = 20;

  // The Simulation Engine
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sysState === "healthy") {
      // Threads process normally and clear out
      interval = setInterval(() => setThreadCount(prev => Math.max(0, prev > 2 ? prev - 2 : 0)), 500);
      // Trigger incident after 4 seconds
      setTimeout(() => setSysState("degraded"), 4000);
    } 
    else if (sysState === "degraded" || sysState === "critical") {
      // Downstream is slow, threads pile up
      interval = setInterval(() => {
        setThreadCount(prev => {
          const next = prev + 1;
          if (next >= MAX_THREADS) {
            setSysState("crashed");
            return MAX_THREADS;
          }
          if (next > MAX_THREADS * 0.7 && sysState !== "critical") setSysState("critical");
          return next;
        });
      }, 400);
    }
    else if (sysState === "recovered_cb") {
      // Circuit breaker is open. Threads fail-fast and drain instantly.
      interval = setInterval(() => setThreadCount(prev => Math.max(0, prev - 3)), 200);
    }

    return () => clearInterval(interval);
  }, [sysState]);

  const handleDeploy = (pattern: string) => {
    if (sysState === "crashed") return;
    
    if (pattern === "Circuit Breaker") {
      setSysState("recovered_cb");
    } else {
      setSysState("wrong_fix");
      setTimeout(() => setSysState("crashed"), 1500);
    }
  };

  const resetSim = () => {
    setSysState("healthy");
    setThreadCount(0);
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8 bg-slate-950 text-slate-200 font-mono">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft size={14} /> Leave Simulator
            </button>
            <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
              <Activity className={sysState === "crashed" ? "text-red-500" : "text-emerald-500"} /> 
              Incident #4042: Cascading Failure
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Watch the telemetry. When the downstream payment service degrades, your API gateway threads will hang waiting for responses. Fix it before the thread pool hits capacity.
            </p>
          </div>

          {/* Telemetry Readout */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-right min-w-[180px]">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">API Thread Pool</p>
            <div className="text-3xl font-bold font-display mb-2 flex justify-end items-end gap-1">
              <span className={threadCount >= MAX_THREADS ? "text-red-500" : threadCount > 10 ? "text-yellow-500" : "text-emerald-500"}>
                {threadCount}
              </span>
              <span className="text-sm text-slate-600 mb-1">/ {MAX_THREADS}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${threadCount >= MAX_THREADS ? "bg-red-500" : threadCount > 12 ? "bg-yellow-500" : "bg-emerald-500"}`}
                animate={{ width: `${(threadCount / MAX_THREADS) * 100}%` }}
                transition={{ type: "tween", ease: "linear", duration: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* --- THE ANIMATED SIMULATION VIEWPORT --- */}
        <div className="bg-slate-900/50 rounded-2xl p-8 border-2 border-slate-800 relative overflow-hidden mb-8 h-[350px] flex items-center justify-center shadow-2xl">
          
          <div className="flex items-center gap-4 w-full max-w-2xl relative z-10">
            
            {/* 1. Client App */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center z-10">
                <span className="text-2xl">📱</span>
              </div>
              <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clients</p>
            </div>

            {/* Path 1: Client to Gateway */}
            <div className="flex-1 h-0.5 bg-slate-800 relative">
               {(sysState === "healthy" || sysState === "degraded" || sysState === "critical") && (
                  <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" animate={{ left: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }} />
               )}
            </div>

            {/* 2. API Gateway (The Victim) */}
            <div className="flex flex-col items-center relative">
              <motion.div 
                animate={
                  sysState === "crashed" ? { scale: 0.9, opacity: 0.5 } :
                  sysState === "critical" ? { x: [-2, 2, -2] } : 
                  sysState === "recovered_cb" ? { scale: [1, 1.05, 1], borderColor: "#3b82f6" } : {}
                }
                transition={{ repeat: sysState === "critical" ? Infinity : 0, duration: 0.1 }}
                className={`w-24 h-24 border-2 rounded-2xl flex flex-col items-center justify-center z-10 relative overflow-hidden bg-slate-900 ${
                  sysState === "crashed" ? "border-red-900 text-red-900" :
                  sysState === "recovered_cb" ? "border-blue-500 text-blue-400" :
                  threadCount > 14 ? "border-red-500 text-red-500" : 
                  "border-emerald-500 text-emerald-400"
                }`}
              >
                <Server size={32} className="mb-2" />
                
                {/* Visual representation of threads backing up */}
                <div className="absolute bottom-0 left-0 w-full flex flex-wrap-reverse content-start gap-1 p-1 opacity-50">
                  {[...Array(threadCount)].map((_, i) => (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-2 h-2 rounded-sm ${sysState === "recovered_cb" ? 'bg-blue-500' : 'bg-current'}`} />
                  ))}
                </div>
              </motion.div>
              <p className="mt-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Order API</p>
              
              {sysState === "crashed" && (
                <div className="absolute -top-8 text-xs font-bold text-red-500 bg-red-950/80 px-3 py-1 rounded border border-red-900">NODE OFFLINE</div>
              )}
            </div>

            {/* Path 2: Gateway to Downstream */}
            <div className="flex-1 h-0.5 relative flex items-center justify-center">
              <div className="absolute w-full h-full bg-slate-800" />
              
              {/* Traffic Animation depending on state */}
              {sysState === "healthy" && (
                 <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" animate={{ left: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear", delay: 0.3 }} />
              )}
              {(sysState === "degraded" || sysState === "critical") && (
                 <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]" animate={{ left: ["0%", "90%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
              )}
              
              {/* THE CIRCUIT BREAKER VIZ */}
              <AnimatePresence>
                {sysState === "recovered_cb" && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    className="absolute z-20 flex flex-col items-center"
                  >
                    <div className="w-1 h-12 bg-red-500 transform rotate-45 shadow-[0_0_15px_red]" />
                    <span className="absolute top-10 text-[8px] font-bold text-red-400 tracking-widest uppercase bg-slate-900 px-2 py-0.5 rounded border border-red-900/50">Tripped</span>
                    
                    {/* Bouncing / Fast failing traffic */}
                    <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]" animate={{ left: ["-50%", "-100%"], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Downstream Service (The Culprit) */}
            <div className="flex flex-col items-center relative">
              <div className={`w-20 h-20 border-2 rounded-2xl flex flex-col items-center justify-center z-10 bg-slate-900 ${
                (sysState === "degraded" || sysState === "critical") ? "border-yellow-600 text-yellow-600" : 
                sysState === "recovered_cb" ? "border-slate-700 text-slate-700 opacity-50" :
                "border-emerald-600 text-emerald-600"
              }`}>
                <Database size={28} />
              </div>
              <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment DB</p>
              
              {(sysState === "degraded" || sysState === "critical") && (
                 <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -top-8 text-xs font-bold text-yellow-500 bg-yellow-950/80 px-3 py-1 rounded border border-yellow-900">TIMING OUT</motion.div>
              )}
            </div>

          </div>

          {/* Background Grid Polish */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        </div>


        {/* --- THE INTERACTIVE PUZZLE CONTROLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Status Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">System Logs</h3>
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-emerald-500">{`> [00:00:00] System running normally. Latency 45ms.`}</p>
              
              {(sysState === "degraded" || sysState === "critical" || sysState === "crashed") && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-500">
                  {`> [00:00:04] WARN: Payment DB latency spiked to 30,000ms. Connections hanging.`}
                </motion.p>
              )}
              
              {sysState === "critical" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-bold">
                  {`> [00:00:08] CRITICAL: Order API thread pool at 80% capacity. Rejecting new connections.`}
                </motion.p>
              )}

              {sysState === "crashed" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 font-bold bg-red-950/30 p-2 border-l-2 border-red-600 mt-2">
                  {`> FATAL EXCEPTION: Thread pool exhausted. Node offline. Outage in progress.`}
                </motion.p>
              )}

              {sysState === "wrong_fix" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-600 mt-2">
                  {`> ERROR: Fix deployed but threads are still hanging on DB connection. Ineffective.`}
                </motion.p>
              )}

              {sysState === "recovered_cb" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400 font-bold bg-blue-950/30 p-2 border-l-2 border-blue-500 mt-2">
                  {`> ACTION SUCCESS: Circuit Breaker deployed and TRIPPED. Failing fast. Thread pool draining. Node saved.`}
                </motion.p>
              )}
            </div>
          </div>

          {/* Action Panel */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Emergency Patch Deployment</h3>
            
            {(sysState === "healthy") && (
               <div className="h-full flex items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center text-sm text-slate-500">
                 Monitoring... wait for an incident to trigger before deploying a fix.
               </div>
            )}

            {(sysState === "degraded" || sysState === "critical" || sysState === "wrong_fix") && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <button onClick={() => handleDeploy("Retry")} className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-left flex items-center gap-4 transition-all group">
                  <div className="p-2 bg-slate-900 rounded-lg group-hover:text-white text-slate-400"><RefreshCcw size={18} /></div>
                  <div>
                    <span className="block font-bold text-slate-200">Retry Pattern</span>
                    <span className="text-[10px] text-slate-500">Keep trying the failing DB connection</span>
                  </div>
                </button>
                
                <button onClick={() => handleDeploy("Circuit Breaker")} className="w-full p-4 rounded-xl border border-blue-900/50 bg-blue-950/20 hover:bg-blue-900/40 hover:border-blue-500 text-left flex items-center gap-4 transition-all group">
                  <div className="p-2 bg-slate-900 rounded-lg text-blue-500"><Zap size={18} /></div>
                  <div>
                    <span className="block font-bold text-blue-100">Circuit Breaker</span>
                    <span className="text-[10px] text-blue-300/70">Trip the connection and fail-fast instantly</span>
                  </div>
                </button>

                <button onClick={() => handleDeploy("Auto Scale")} className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-left flex items-center gap-4 transition-all group">
                  <div className="p-2 bg-slate-900 rounded-lg group-hover:text-white text-slate-400"><Layers size={18} /></div>
                  <div>
                    <span className="block font-bold text-slate-200">Scale API Nodes</span>
                    <span className="text-[10px] text-slate-500">Add more order APIs to handle the traffic</span>
                  </div>
                </button>
              </motion.div>
            )}

            {(sysState === "crashed" || sysState === "recovered_cb") && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-xl border ${sysState === "recovered_cb" ? "bg-blue-950/20 border-blue-900/50" : "bg-red-950/20 border-red-900/50"}`}>
                <h4 className={`text-lg font-bold font-display mb-2 ${sysState === "recovered_cb" ? "text-blue-400" : "text-red-500"}`}>
                  {sysState === "recovered_cb" ? "System Stabilized." : "Post-Mortem: System Crashed."}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {sysState === "recovered_cb" 
                    ? "Exactly. By tripping the circuit breaker, the API gateway stopped waiting on the dead database. It failed fast, returning an immediate error to the user, but crucially, it freed up its threads so the node didn't crash."
                    : "Adding more nodes or retrying a dead database just creates a larger blast radius. You needed to sever the connection to stop the cascading failure."}
                </p>
                <button onClick={resetSim} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors">
                  Restart Simulation
                </button>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
