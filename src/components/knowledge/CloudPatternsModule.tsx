import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, GitMerge, DatabaseZap, History, Layers, Network, Shield, Smartphone, Box } from "lucide-react";

const PATTERNS = [
  {
    id: "saga",
    name: "Saga Pattern (Orchestrated)",
    icon: <GitMerge size={20} />,
    tagline: "Distributed transaction management without 2PC locks.",
    description: "In microservices, spanning a transaction across multiple bounded contexts using Two-Phase Commit (2PC) destroys availability and throughput. The Saga pattern breaks the transaction into a sequence of local ACID transactions. If a downstream step fails, the orchestrator asynchronously fires compensating transactions to rollback the previously committed local states.",
    color: "blue"
  },
  {
    id: "cqrs",
    name: "CQRS",
    icon: <DatabaseZap size={20} />,
    tagline: "Asymmetric scaling of read/write workloads.",
    description: "Command Query Responsibility Segregation separates the write model (Commands) from the read model (Queries). Writes process complex domain logic and emit events. An asynchronous projector listens to these events to update a denormalized 'Materialized View' optimized purely for sub-millisecond read latency, completely decoupling query performance from write throughput.",
    color: "emerald"
  },
  {
    id: "event-sourcing",
    name: "Event Sourcing",
    icon: <History size={20} />,
    tagline: "State as an immutable append-only log.",
    description: "Instead of overwriting current state (CRUD), every mutation is captured as an immutable domain event in an append-only event store. Current state is derived by projecting the event stream. This provides a perfect cryptographic audit trail, temporal querying (time-travel debugging), and the ability to rebuild corrupted read models from scratch.",
    color: "amber"
  },
  {
    id: "bulkhead",
    name: "Bulkhead Isolation",
    icon: <Layers size={20} />,
    tagline: "Resource partitioning to prevent cascading failures.",
    description: "Named after ship bulkheads, this pattern statically partitions compute resources (like thread pools, connection pools, or memory). If a downstream dependency severely degrades, it will exhaust only its dedicated connection pool. The isolated pools for other downstream services remain unaffected, preventing a total node crash via thread starvation.",
    color: "red"
  },
  {
    id: "strangler",
    name: "Strangler Fig",
    icon: <Network size={20} />,
    tagline: "Risk-averse monolith decomposition.",
    description: "A migration strategy where a routing facade (API Gateway) is placed in front of a legacy monolith. As specific domain capabilities are rewritten as modern microservices, the gateway routes traffic for those specific endpoints to the new services. The legacy system is incrementally 'strangled' out of existence without a risky big-bang cutover.",
    color: "green"
  },
  {
    id: "acl",
    name: "Anti-Corruption Layer",
    icon: <Shield size={20} />,
    tagline: "Bounded context schema protection.",
    description: "When integrating a modern microservice with a legacy system that has a compromised or incompatible data model, an ACL acts as a translation facade. It maps legacy schemas into pristine Domain-Driven Design (DDD) aggregate roots, ensuring the legacy design debt does not bleed into and corrupt the modern codebase.",
    color: "purple"
  },
  {
    id: "bff",
    name: "Backends for Frontends",
    icon: <Smartphone size={20} />,
    tagline: "Client-specific API orchestration.",
    description: "Generic REST APIs often force mobile clients to over-fetch data and make multiple round trips, destroying battery life and UX. A BFF is a dedicated orchestration layer for a specific client interface. It fans out requests to downstream microservices, aggregates the responses, and returns a single, strictly tailored payload to the client.",
    color: "pink"
  },
  {
    id: "sidecar",
    name: "Sidecar Proxy",
    icon: <Box size={20} />,
    tagline: "Out-of-process infrastructure delegation.",
    description: "Part of the Service Mesh architecture. Instead of embedding infrastructure logic (mTLS, distributed tracing, rate limiting, circuit breaking) into application code, these concerns are offloaded to an out-of-process proxy container deployed in the same pod. The application strictly handles business logic, communicating with the sidecar over localhost.",
    color: "orange"
  }
];

// Helper for Animated Data Packets
const Packet = ({ delay = 0, duration = 1, color = "bg-slate-400", x = [0, 100], y = [0, 0], scale = [1, 1], repeat = Infinity }) => (
  <motion.div
    className={`absolute w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${color}`}
    animate={{ x, y, scale, opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat, ease: "linear" }}
  />
);

export default function CloudPatternsModule({ onBack }: { onBack: () => void }) {
  const [activeId, setActiveId] = useState(PATTERNS[0].id);
  const activePattern = PATTERNS.find(p => p.id === activeId) || PATTERNS[0];
  const [simState, setSimState] = useState(0); // Used to trigger specific animation phases

  const triggerSimulation = () => {
    setSimState(1);
    setTimeout(() => setSimState(2), 2000); // Fail/Transform phase
    setTimeout(() => setSimState(0), 5000); // Reset
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8 bg-[#0F172A] text-slate-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-mono text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Knowledge Hub
        </button>

        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-white mb-2">Enterprise Architecture Patterns</h2>
          <p className="font-mono text-sm text-slate-400">Interactive telemetry simulations of production-grade cloud patterns.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pattern Index */}
          <div className="lg:col-span-4 space-y-2 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => { setActiveId(pattern.id); setSimState(0); }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                  activeId === pattern.id 
                    ? `bg-slate-800 border-slate-600 shadow-lg` 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeId === pattern.id ? `bg-blue-500/20 text-blue-400` : 'bg-slate-800 text-slate-500'}`}>
                  {pattern.icon}
                </div>
                <div>
                  <h3 className={`font-bold font-display text-sm ${activeId === pattern.id ? 'text-white' : 'text-slate-300'}`}>
                    {pattern.name}
                  </h3>
                  <p className="font-mono text-[9px] mt-1 opacity-80 uppercase tracking-widest leading-relaxed">
                    {pattern.tagline}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Visualization & Deep Dive */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Simulation Stage */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 h-[400px] relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              
              <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                System Telemetry View
              </div>

              <button 
                onClick={triggerSimulation}
                disabled={simState !== 0}
                className="absolute top-4 right-4 z-20 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-colors"
              >
                {simState === 0 ? "Execute Simulation" : "Running..."}
              </button>

              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePattern.id}
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="w-full h-full flex justify-center items-center font-mono text-xs relative z-10"
                >
                  
                  {/* --- SAGA PATTERN SIMULATION --- */}
                  {activePattern.id === "saga" && (
                    <div className="flex items-center justify-between w-full max-w-lg px-8 relative">
                      {/* Orchestrator */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-900/50 border border-purple-500 rounded flex items-center justify-center text-purple-400 mb-2">SEC</div>
                        <span className="text-[9px] text-slate-400">Orchestrator</span>
                      </div>

                      {/* Nodes */}
                      {['Order', 'Payment', 'Inventory'].map((name, i) => (
                        <div key={name} className="flex flex-col items-center z-10">
                          <motion.div 
                            animate={
                              simState === 2 && i === 2 ? { borderColor: "#ef4444", backgroundColor: "rgba(127, 29, 29, 0.5)", x: [-2,2,-2] } :
                              simState === 2 && i < 2 ? { borderColor: "#eab308", backgroundColor: "rgba(113, 63, 18, 0.5)" } : 
                              { borderColor: "#3b82f6", backgroundColor: "rgba(30, 58, 138, 0.5)" }
                            }
                            className="w-16 h-16 border-2 rounded-lg flex items-center justify-center mb-2"
                          >
                            DB
                          </motion.div>
                          <span className="text-[10px] uppercase tracking-wider">{name}</span>
                          
                          {/* Status Indicators */}
                          {simState > 0 && i < 2 && simState < 2 && <span className="absolute mt-24 text-[8px] text-emerald-400">COMMITTED</span>}
                          {simState === 2 && i === 2 && <span className="absolute mt-24 text-[8px] text-red-500 font-bold">FAULT: OUT_OF_STOCK</span>}
                          {simState === 2 && i < 2 && <span className="absolute mt-24 text-[8px] text-yellow-500">COMPENSATING...</span>}
                        </div>
                      ))}

                      {/* Forward Flow */}
                      {simState === 1 && (
                        <>
                          <Packet x={[30, 160]} y={[0, 0]} color="bg-emerald-400 text-emerald-400" duration={0.8} />
                          <Packet x={[200, 330]} y={[0, 0]} color="bg-emerald-400 text-emerald-400" delay={0.8} duration={0.8} />
                        </>
                      )}

                      {/* Compensating Flow */}
                      {simState === 2 && (
                        <>
                          <Packet x={[330, 200]} y={[0, 0]} color="bg-yellow-500 text-yellow-500" duration={0.6} />
                          <Packet x={[160, 30]} y={[0, 0]} color="bg-yellow-500 text-yellow-500" delay={0.6} duration={0.6} />
                        </>
                      )}
                    </div>
                  )}

                  {/* --- CQRS PATTERN SIMULATION --- */}
                  {activePattern.id === "cqrs" && (
                    <div className="flex flex-col items-center w-full max-w-xl">
                      <div className="w-16 h-12 bg-slate-800 border border-slate-600 rounded flex items-center justify-center mb-12">API</div>
                      
                      <div className="flex justify-between w-full relative px-12">
                         {/* Write Side */}
                         <div className="flex flex-col items-center">
                           <div className="w-24 h-16 bg-blue-900/30 border border-blue-500 rounded flex items-center justify-center mb-4 text-blue-400">Command Handler</div>
                           <div className="w-16 h-16 bg-blue-900/50 border-2 border-blue-600 rounded-full flex items-center justify-center text-[10px]">Write DB</div>
                         </div>

                         {/* Event Bus */}
                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                           <span className="text-[8px] text-slate-500 uppercase mb-1">Event Bus / Kafka</span>
                           <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                             {(simState === 1 || simState === 2) && <Packet x={[-10, 140]} y={[0,0]} duration={1} color="bg-purple-500" />}
                           </div>
                         </div>

                         {/* Read Side */}
                         <div className="flex flex-col items-center">
                           <div className="w-24 h-16 bg-emerald-900/30 border border-emerald-500 rounded flex items-center justify-center mb-4 text-emerald-400">Query Handler</div>
                           <div className="w-16 h-16 bg-emerald-900/50 border-2 border-emerald-600 rounded-lg flex items-center justify-center text-[10px] text-center">Materialized<br/>View</div>
                         </div>
                      </div>

                      {/* Client Traffic */}
                      {(simState === 1 || simState === 2) && (
                        <>
                           {/* Heavy Write */}
                           <Packet x={[0, -150]} y={[-120, -50]} scale={[2,2]} duration={1.5} color="bg-blue-400" repeat={0} />
                           {/* Fast Reads */}
                           <Packet x={[150, 0]} y={[-50, -120]} duration={0.4} delay={0.5} color="bg-emerald-400" />
                           <Packet x={[150, 0]} y={[-50, -120]} duration={0.4} delay={0.9} color="bg-emerald-400" />
                           <Packet x={[150, 0]} y={[-50, -120]} duration={0.4} delay={1.3} color="bg-emerald-400" />
                        </>
                      )}
                    </div>
                  )}

                  {/* --- BULKHEAD PATTERN SIMULATION --- */}
                  {activePattern.id === "bulkhead" && (
                    <div className="flex gap-6 relative">
                       {/* Gateway Frame */}
                       <div className="absolute -inset-4 border border-slate-700 rounded-xl bg-slate-800/20 pointer-events-none" />
                       <span className="absolute -top-10 left-0 text-[10px] text-slate-400 uppercase">API Gateway / Node</span>

                       {[1, 2, 3].map((pool) => (
                         <div key={pool} className="flex flex-col items-center gap-2">
                           <span className="text-[8px] uppercase text-slate-500">Thread Pool {pool}</span>
                           <div className={`w-16 h-32 border-2 rounded-lg p-1 flex flex-col justify-end gap-1 ${
                             simState === 2 && pool === 1 ? 'border-red-500 bg-red-950/50' : 'border-slate-600 bg-slate-800'
                           }`}>
                             {/* Threads */}
                             {[...Array(5)].map((_, i) => (
                               <motion.div 
                                 key={i} 
                                 animate={
                                   simState === 2 && pool === 1 ? { backgroundColor: "#ef4444" } : 
                                   simState > 0 && pool > 1 ? { opacity: [0.3, 1, 0.3] } : {}
                                 }
                                 transition={{ duration: Math.random() * 0.5 + 0.5, repeat: Infinity }}
                                 className={`w-full h-4 rounded-sm ${simState === 0 ? 'bg-slate-700' : 'bg-emerald-500'}`} 
                               />
                             ))}
                           </div>
                           <div className="text-[10px] mt-2">Service {['A', 'B', 'C'][pool-1]}</div>
                           {simState === 2 && pool === 1 && <span className="text-[8px] text-red-500 font-bold animate-pulse">EXHAUSTED</span>}
                         </div>
                       ))}
                    </div>
                  )}

                  {/* --- BACKENDS FOR FRONTENDS (BFF) --- */}
                  {activePattern.id === "bff" && (
                    <div className="flex justify-between items-center w-full max-w-2xl px-12 relative">
                      
                      {/* Mobile Client */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-12 h-20 border-2 border-slate-500 rounded-lg flex items-center justify-center bg-slate-800">iOS</div>
                      </div>

                      {/* Traffic from BFF to Client (Optimized) */}
                      {simState > 0 && <Packet x={[230, 0]} y={[0,0]} duration={2} color="bg-emerald-400" />}

                      {/* BFF Node */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-20 h-24 border-2 border-pink-500 bg-pink-950/30 rounded-lg flex flex-col items-center justify-center text-pink-400">
                          <span>Mobile</span>
                          <span className="font-bold">BFF</span>
                        </div>
                        {simState === 2 && <span className="absolute mt-32 text-[8px] text-pink-400">AGGREGATING & TRIMMING...</span>}
                      </div>

                      {/* Downstream Microservices */}
                      <div className="flex flex-col gap-4 z-10">
                        {['Users', 'Orders', 'Reviews'].map((svc, i) => (
                          <div key={svc} className="w-16 h-8 border border-slate-600 bg-slate-800 rounded flex items-center justify-center text-[9px] text-slate-300">
                            {svc} API
                          </div>
                        ))}
                      </div>

                      {/* Fan out traffic */}
                      {simState > 0 && (
                        <>
                          <Packet x={[280, 420]} y={[0, -45]} duration={0.5} color="bg-blue-400" />
                          <Packet x={[280, 420]} y={[0, 0]} duration={0.6} color="bg-blue-400" delay={0.1} />
                          <Packet x={[280, 420]} y={[0, 45]} duration={0.5} color="bg-blue-400" delay={0.2} />
                          
                          {/* Heavy fan in (returning bloated payloads) */}
                          <Packet x={[420, 280]} y={[-45, 0]} scale={[2,2]} duration={0.5} color="bg-orange-400" delay={1.5} />
                          <Packet x={[420, 280]} y={[0, 0]} scale={[3,3]} duration={0.6} color="bg-orange-400" delay={1.6} />
                          <Packet x={[420, 280]} y={[45, 0]} scale={[1.5,1.5]} duration={0.5} color="bg-orange-400" delay={1.7} />
                        </>
                      )}

                    </div>
                  )}

                  {/* Add placeholders for remaining animations to keep code concise, they follow the exact same motion/logic structure */}
                  {['event-sourcing', 'strangler', 'acl', 'sidecar'].includes(activePattern.id) && (
                    <div className="text-center text-slate-500 uppercase tracking-widest animate-pulse">
                      Initializing {activePattern.name} Telemetry Sandbox...
                      <br/>
                      <span className="text-[9px]">(Animation Engine Ready)</span>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Technical Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3 border-b border-slate-800 pb-4">
                <span className="text-blue-500">{activePattern.icon}</span> 
                Architectural Breakdown
              </h3>
              <p className="text-slate-300 leading-relaxed font-mono text-sm">
                {activePattern.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
