import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ServerCrash, Zap, Shield, Database, Activity, Trophy } from "lucide-react";

// The "Deck" of Scenarios
const SCENARIOS = [
  {
    id: "sc-1",
    icon: <ServerCrash size={24} className="text-red-500" />,
    title: "The Cascading Failure",
    problem: "A downstream payment gateway is timing out. Your API threads are hanging while waiting for it, threatening to crash your entire microservice cluster.",
    solution: "Circuit Breaker",
    options: ["Retry Pattern", "Circuit Breaker", "Sidecar"],
    explanation: "The Circuit Breaker pattern trips after a threshold of failures, failing fast and preventing the broken downstream service from taking down your healthy ones."
  },
  {
    id: "sc-2",
    icon: <Database size={24} className="text-orange-500" />,
    title: "The Flash Sale Bottleneck",
    problem: "Marketing just dropped a viral campaign. Your database is locking up because massive volumes of 'Checkout' writes are blocking catalog reads.",
    solution: "CQRS",
    options: ["Saga Pattern", "Ambassador", "CQRS"],
    explanation: "Command Query Responsibility Segregation (CQRS) physically splits the read operations (Queries) from the write operations (Commands), letting you scale them independently."
  },
  {
    id: "sc-3",
    icon: <Shield size={24} className="text-blue-500" />,
    title: "The Legacy Monolith",
    problem: "Security mandates mutual TLS and distributed tracing across all services, but you have a legacy C++ monolith that cannot be recompiled or touched.",
    solution: "Sidecar",
    options: ["Sidecar", "Strangler Fig", "Event Sourcing"],
    explanation: "The Sidecar pattern deploys a proxy (like Envoy) alongside the legacy container. It handles all the networking, mTLS, and observability without touching the legacy code."
  },
  {
    id: "sc-4",
    icon: <Activity size={24} className="text-purple-500" />,
    title: "The Distributed Transaction",
    problem: "A user books a flight, a hotel, and a rental car. If the car booking fails, you need to rollback the flight and hotel across three different databases.",
    solution: "Saga Pattern",
    options: ["Two-Phase Commit", "Saga Pattern", "CQRS"],
    explanation: "The Saga Pattern manages distributed transactions via a sequence of local transactions. If one fails, it triggers compensating transactions to undo the previous steps."
  }
];

const CloudPatternsModule = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "result" | "finished">("playing");
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const currentScenario = SCENARIOS[step];

  const handlePlayCard = (choice: string) => {
    setSelectedCard(choice);
    const isCorrect = choice === currentScenario.solution;
    
    setTimeout(() => {
      setLastAnswerCorrect(isCorrect);
      if (isCorrect) setScore(s => s + 1);
      setGameState("result");
    }, 600); // Slight delay for the card flip animation feel
  };

  const nextTurn = () => {
    setSelectedCard(null);
    if (step < SCENARIOS.length - 1) {
      setStep(s => s + 1);
      setGameState("playing");
    } else {
      setGameState("finished");
    }
  };

  const getRank = () => {
    if (score === SCENARIOS.length) return "Principal Cloud Architect 🏆";
    if (score >= SCENARIOS.length - 1) return "Senior Cloud Engineer 🚀";
    return "Cloud Practitioner ☁️";
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8" style={{ background: "#F8FAFC" }}>
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-mono text-xs font-bold tracking-widest uppercase"
        >
          <ArrowLeft size={14} /> Leave Table
        </button>

        {/* Game Header */}
        <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Architect's Crucible</h2>
            <p className="font-mono text-xs text-slate-500">Deploy patterns to survive production outages.</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1">Score</p>
            <p className="font-display text-xl font-bold text-blue-600">{score} / {SCENARIOS.length}</p>
          </div>
        </div>

        {/* Game Board */}
        <AnimatePresence mode="wait">
          {gameState === "finished" ? (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-10 text-center shadow-lg"
            >
              <Trophy size={48} className="mx-auto text-yellow-500 mb-6" />
              <h3 className="font-display text-3xl font-bold text-slate-900 mb-2">Session Complete</h3>
              <p className="text-slate-500 mb-8 font-mono">Final Assessment Rank:</p>
              <div className="inline-block bg-slate-900 text-white font-bold px-6 py-3 rounded-full text-lg shadow-md mb-8">
                {getRank()}
              </div>
              <button 
                onClick={onBack}
                className="block w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Return to Knowledge Hub
              </button>
            </motion.div>

          ) : (
            <motion.div 
              key={`turn-${step}-${gameState}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative"
            >
              {/* The Scenario Card */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {currentScenario.icon}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Incident {step + 1}
                    </p>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {currentScenario.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {currentScenario.problem}
                </p>
              </div>

              {/* Action Area */}
              {gameState === "playing" ? (
                <div className="space-y-4">
                  <p className="font-mono text-xs font-bold text-slate-500 text-center uppercase tracking-widest mb-6">
                    Play a pattern card from your hand
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {currentScenario.options.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => handlePlayCard(option)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 text-left font-display font-bold text-lg flex justify-between items-center transition-all ${
                          selectedCard === option 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        {option}
                        <Zap size={20} className={selectedCard === option ? 'text-blue-300' : 'text-slate-300'} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border-2 ${
                    lastAnswerCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <h4 className={`font-display text-xl font-bold mb-3 ${
                    lastAnswerCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {lastAnswerCorrect ? "System Stabilized!" : "Critical Outage!"}
                  </h4>
                  <p className={`mb-6 leading-relaxed ${
                    lastAnswerCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {currentScenario.explanation}
                  </p>
                  <button 
                    onClick={nextTurn}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors"
                  >
                    {step < SCENARIOS.length - 1 ? "Acknowledge Alert & Continue" : "View Final Report"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CloudPatternsModule;
