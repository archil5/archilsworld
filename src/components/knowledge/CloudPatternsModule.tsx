import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Server, Database, Zap, Shield, SplitSquareHorizontal, ArrowRightLeft } from "lucide-react";

const PATTERNS = [
  {
    id: "circuit-breaker",
    name: "Circuit Breaker",
    icon: <Zap size={20} />,
    tagline: "Fail fast, don't cascade.",
    description: "Instead of waiting for a broken downstream service to time out (which hangs your main API), the circuit 'trips'. It immediately rejects requests until the downstream service is healthy again.",
    color: "blue"
  },
  {
    id: "cqrs",
    name: "CQRS",
    icon: <SplitSquareHorizontal size={20} />,
    tagline: "Separate reads from writes.",
    description: "Command Query Responsibility Segregation. You split your database paths. Heavy, complex 'Writes' don't lock up the database for users who just want to 'Read' data quickly.",
    color: "emerald"
  },
  {
    id: "sidecar",
    name: "Sidecar",
    icon: <Shield size={20} />,
    tagline: "Attach helpers without touching core code.",
    description: "Need logging, mTLS, or monitoring on a legacy app? Don't rewrite the app. Attach a 'Sidecar' container next to it to handle all the peripheral networking tasks.",
    color: "purple"
  }
];

const Packet = ({ delay = 0, color = "bg-slate-400", path = ["0%", "100%"] }) => (
  <motion.div
    className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${color}`}
    animate={{ left: path, opacity: [0, 1, 1, 0] }}
    transition={{ repeat: Infinity, duration: 2, delay, ease: "linear" }}
  />
);

export default function CloudPatternsModule({ onBack }: { onBack: () => void }) {
  const [activePattern, setActivePattern] = useState(PATTERNS[0]);

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-mono text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Hub
        </button>

        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Cloud Architecture Patterns</h2>
          <p className="font-mono text-sm text-slate-500">Interactive blueprints. Select a pattern to see how it shapes data flow.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Pattern Selector */}
          <div className="lg:col-span-4 space-y-3">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setActivePattern(pattern)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
                  activePattern.id === pattern.id 
                    ? `bg-white border-${pattern.color}-500 shadow-md ring-4 ring-${pattern.color}-500/10` 
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${activePattern.id === pattern.id ? `bg-${pattern.color}-100 text-${pattern.color}-600` : 'bg-slate-100 text-slate-400'}`}>
                  {pattern.icon}
                </div>
                <div>
                  <h3 className={`font-bold font-display ${activePattern.id === pattern.id ? 'text-slate-900' : 'text-slate-700'}`}>
                    {pattern.name}
                  </h3>
                  <p className="font-mono text-[10px] mt-1 opacity-70 uppercase tracking-wider">{pattern.tagline}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Interactive Sandbox */}
          <div className="lg:col-span-8">
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 h-[400px] relative overflow-hidden shadow-sm flex flex-col justify-center items-center">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePattern.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex justify-center items-center h-full"
                >
                  
                  {/* --- CIRCUIT BREAKER DIAGRAM --- */}
                  {activePattern.id === "circuit-breaker" && (
                    <div className="flex items-center gap-12 w-full max-w-md relative font-mono text-xs">
                      <div className="text-center z-10"><div className="w-16 h-16 bg-blue-100 border-2 border-blue-500 rounded-xl flex items-center justify-center mb-2"><Server className="text-blue-600"/></div>Gateway</div>
                      
                      {/* The Broken Connection */}
                      <div className="flex-1 h-1 bg-slate-200 relative">
                        {/* Traffic hitting the breaker */}
                        <Packet color="bg-blue-500" path={["0%", "45%"]} />
                        <Packet delay={1} color="bg-blue-500" path={["0%", "45%"]} />
                        
                        {/* The Tripped Breaker */}
                        <motion.div 
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-10 bg-red-500 origin-bottom"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 45 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-8 text-[10px] text-red-500 font-bold tracking-widest uppercase">Tripped</span>
                        
                        {/* Bouncing back (Fail Fast) */}
                        <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-400" animate={{ left: ["45%", "0%"], opacity: [0, 1, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 1 }} />
                      </div>

                      <div className="text-center z-10 opacity-50"><div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 rounded-xl flex items-center justify-center mb-2"><Database className="text-slate-400"/></div>Failing DB</div>
                    </div>
                  )}

                  {/* --- CQRS DIAGRAM --- */}
                  {activePattern.id === "cqrs" && (
                    <div className="flex flex-col items-center gap-8 w-full font-mono text-xs">
                      <div className="flex items-center justify-between w-full max-w-lg">
                        <div className="text-center z-10"><div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-xl flex items-center justify-center mb-2"><Server className="text-emerald-600"/></div>Client</div>
                        
                        <div className="flex-1 px-8 relative h-32 flex flex-col justify-between">
                          {/* Top Path (Writes) */}
                          <div className="w-full h-1 bg-slate-200 relative">
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 uppercase">Commands (Writes)</span>
                            <Packet color="bg-orange-500" delay={0} />
                            <Packet color="bg-orange-500" delay={1.5} />
                          </div>
                          {/* Bottom Path (Reads) */}
                          <div className="w-full h-1 bg-slate-200 relative">
                             <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 uppercase">Queries (Reads)</span>
                             <Packet color="bg-emerald-500" path={["100%", "0%"]} delay={0.5} />
                             <Packet color="bg-emerald-500" path={["100%", "0%"]} delay={1} />
                             <Packet color="bg-emerald-500" path={["100%", "0%"]} delay={1.5} />
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="text-center z-10"><div className="w-12 h-12 bg-orange-50 border-2 border-orange-300 rounded-lg flex items-center justify-center mb-1"><Database size={20} className="text-orange-500"/></div>Write DB</div>
                          <div className="text-center z-10"><div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-300 rounded-lg flex items-center justify-center mb-1"><Database size={20} className="text-emerald-500"/></div>Read DB</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SIDECAR DIAGRAM --- */}
                  {activePattern.id === "sidecar" && (
                    <div className="flex items-center gap-12 w-full max-w-md relative font-mono text-xs">
                      <div className="text-center z-10"><div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 rounded-xl flex items-center justify-center mb-2"><ArrowRightLeft className="text-slate-500"/></div>Network</div>
                      
                      <div className="flex-1 h-1 bg-purple-200 relative">
                        <Packet color="bg-purple-500" delay={0} />
                        <Packet color="bg-purple-500" delay={1} />
                      </div>

                      {/* Container Pod */}
                      <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl relative bg-slate-50 flex items-center gap-4">
                         <span className="absolute -top-3 left-4 bg-slate-50 px-2 text-[10px] text-slate-400 font-bold uppercase">Pod</span>
                         
                         {/* Sidecar Proxy */}
                         <div className="text-center z-10">
                           <div className="w-12 h-12 bg-purple-100 border-2 border-purple-500 rounded-lg flex items-center justify-center mb-1 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                             <Shield size={20} className="text-purple-600"/>
                           </div>
                           <span className="text-[10px]">Sidecar Proxy</span>
                         </div>

                         {/* Legacy App */}
                         <div className="text-center z-10">
                           <div className="w-16 h-16 bg-slate-800 border-2 border-slate-900 rounded-xl flex items-center justify-center mb-1">
                             <Server className="text-slate-300"/>
                           </div>
                           <span className="text-[10px]">Legacy App</span>
                         </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Explanation Box */}
            <div className="mt-6 bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800">
               <h4 className="font-display text-white font-bold text-lg mb-2 flex items-center gap-2">
                 {activePattern.icon} {activePattern.name} in Practice
               </h4>
               <p className="leading-relaxed font-medium">
                 {activePattern.description}
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
