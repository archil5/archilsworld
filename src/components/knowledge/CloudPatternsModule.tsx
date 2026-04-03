import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Anchor, Leaf, ShieldAlert, Smartphone, Plane, Utensils, Zap } from "lucide-react";

const PATTERNS = [
  {
    id: "saga",
    name: "Saga",
    icon: <Plane size={20} />,
    tagline: "Clean up your own mess.",
    description: "You try to book a flight, then a hotel, then a car. But car company says 'No cars!'. You cannot just freeze the internet. Saga means you have to manually go back and say 'Cancel hotel, cancel flight'. You walk backward and fix what you broke.",
    color: "blue"
  },
  {
    id: "cqrs",
    name: "CQRS",
    icon: <Utensils size={20} />,
    tagline: "Don't make the cook take orders.",
    description: "Imagine a burger shop. If the guy making the burger also has to take the money and answer questions about the menu, line gets very slow. So, we make one database only for taking orders (writes), and another database only for reading the menu (reads).",
    color: "emerald"
  },
  {
    id: "event-sourcing",
    name: "Event Sourcing",
    icon: <BookOpen size={20} />,
    tagline: "Keep the receipts.",
    description: "Normally a database just says 'You have $50'. But how did you get it? Event sourcing saves every single action like a receipt: 'Added $100', 'Bought coffee for $50'. If the system breaks, we just read the receipt from top to bottom to get the money back.",
    color: "amber"
  },
  {
    id: "bulkhead",
    name: "Bulkhead",
    icon: <Anchor size={20} />,
    tagline: "Don't let the whole ship sink.",
    description: "Like a big ship with walls inside. If the ship hits a rock, water fills only one room. The walls stop the water, so the ship doesn't sink. In code, if one API is very slow, we lock it in a room so it doesn't crash the rest of the server.",
    color: "red"
  },
  {
    id: "strangler",
    name: "Strangler Fig",
    icon: <Leaf size={20} />,
    tagline: "Move out slowly.",
    description: "You have a very old, ugly app. You want to make a new one, but you cannot just delete the old one today. So you build the new app piece by piece around the old one. Send a little traffic to new one, a little to old one. One day, old app is empty and you delete it.",
    color: "green"
  },
  {
    id: "acl",
    name: "Anti-Corruption",
    icon: <ShieldAlert size={20} />,
    tagline: "Talk to the translator.",
    description: "You build beautiful new app. But it has to talk to a 20-year-old dinosaur database that speaks crazy spaghetti language. You put a 'translator' in the middle. Translator talks crazy to the dinosaur, and talks nice clean JSON to your new app.",
    color: "purple"
  },
  {
    id: "bff",
    name: "BFF",
    icon: <Smartphone size={20} />,
    tagline: "Personal shopper.",
    description: "Mobile phone has bad internet. Desktop computer has big screen. Why send the same giant data to both? BFF (Backend For Frontend) is like a personal shopper. Mobile shopper only brings back small, important data. Desktop shopper brings back everything.",
    color: "pink"
  },
  {
    id: "sidecar",
    name: "Sidecar",
    icon: <Zap size={20} />,
    tagline: "Bring a buddy to do the boring stuff.",
    description: "You just want to write code to do business stuff. But boss says 'Add security! Add logs!'. Sidecar pattern is like driving a motorcycle. You just focus on driving. Your buddy sits in the sidecar and shoots the bad guys and takes the photos.",
    color: "orange"
  }
];

export default function CloudPatternsModule({ onBack }: { onBack: () => void }) {
  const [activeId, setActiveId] = useState(PATTERNS[0].id);
  const activePattern = PATTERNS.find(p => p.id === activeId) || PATTERNS[0];
  const [isPlaying, setIsPlaying] = useState(false);

  const triggerAnimation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 4000);
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-10 py-8 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-mono text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Cloud Patterns (No Jargon)</h2>
          <p className="font-mono text-sm text-slate-500">How I actually explain this stuff over a coffee.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Menu */}
          <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => { setActiveId(pattern.id); setIsPlaying(false); }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  activeId === pattern.id 
                    ? `bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10` 
                    : 'bg-white/50 border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeId === pattern.id ? `bg-slate-900 text-white` : 'bg-slate-100 text-slate-400'}`}>
                  {pattern.icon}
                </div>
                <div>
                  <h3 className={`font-bold font-display ${activeId === pattern.id ? 'text-slate-900' : 'text-slate-700'}`}>
                    {pattern.name}
                  </h3>
                  <p className="font-mono text-[9px] mt-0.5 opacity-70 uppercase tracking-wider">{pattern.tagline}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Viewer */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm">
               <div className="flex items-start gap-4 mb-6">
                 <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
                   {activePattern.icon}
                 </div>
                 <div>
                   <h3 className="font-display text-2xl font-bold text-slate-900">{activePattern.name}</h3>
                   <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">{activePattern.tagline}</p>
                 </div>
               </div>
               <p className="text-slate-700 leading-relaxed font-medium text-lg">
                 "{activePattern.description}"
               </p>
            </div>

            {/* Animation Stage */}
            <div className="bg-slate-900 border-4 border-slate-800 rounded-3xl p-8 h-[300px] relative overflow-hidden shadow-inner flex flex-col justify-center items-center">
              
              <button 
                onClick={triggerAnimation}
                disabled={isPlaying}
                className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-4 py-2 rounded-full transition-colors disabled:opacity-50"
              >
                {isPlaying ? "Showing..." : "Show Me"}
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePattern.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full flex justify-center items-center font-display"
                >
                  
                  {/* SAGA */}
                  {activePattern.id === "saga" && (
                    <div className="flex items-center gap-8 text-4xl">
                       <div className="text-center"><div className="mb-2">✈️</div><span className="text-[10px] text-white font-mono uppercase">Flight</span></div>
                       <motion.div animate={isPlaying ? { x: [0, 30, 0], color: ["#fff", "#4ade80", "#fff"] } : {}} transition={{ duration: 1 }}>→</motion.div>
                       
                       <div className="text-center"><div className="mb-2">🏨</div><span className="text-[10px] text-white font-mono uppercase">Hotel</span></div>
                       <motion.div animate={isPlaying ? { x: [0, 30, 0], color: ["#fff", "#4ade80", "#fff"] } : {}} transition={{ duration: 1, delay: 1 }}>→</motion.div>
                       
                       <div className="text-center relative">
                         <div className="mb-2">🚗</div><span className="text-[10px] text-white font-mono uppercase">Car</span>
                         {isPlaying && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -inset-2 bg-red-500/50 rounded-full flex items-center justify-center text-sm font-bold">FAIL</motion.div>}
                       </div>

                       {/* The Undo Animation */}
                       {isPlaying && (
                         <motion.div 
                           initial={{ x: 150, opacity: 0 }} 
                           animate={{ x: -150, opacity: 1 }} 
                           transition={{ duration: 1.5, delay: 2.5 }}
                           className="absolute text-red-500 font-bold text-xl drop-shadow-lg"
                         >
                           ⏪ CANCEL EVERYTHING
                         </motion.div>
                       )}
                    </div>
                  )}

                  {/* CQRS */}
                  {activePattern.id === "cqrs" && (
                    <div className="flex flex-col gap-8 w-full max-w-md">
                      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl relative">
                        <span className="text-3xl">🍔</span>
                        {isPlaying && <motion.div animate={{ left: ["10%", "80%"] }} className="absolute text-xl">📝</motion.div>}
                        <div className="text-center"><div className="text-3xl">👨‍🍳</div><span className="text-[10px] text-amber-400 font-mono uppercase">Write DB (Cook)</span></div>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl relative">
                        <span className="text-3xl">👀</span>
                        {isPlaying && <motion.div animate={{ left: ["10%", "80%"] }} className="absolute text-xl">📖</motion.div>}
                        <div className="text-center"><div className="text-3xl">📋</div><span className="text-[10px] text-emerald-400 font-mono uppercase">Read DB (Menu)</span></div>
                      </div>
                    </div>
                  )}

                  {/* EVENT SOURCING */}
                  {activePattern.id === "event-sourcing" && (
                    <div className="flex flex-col items-center">
                       <div className="text-3xl text-emerald-400 font-bold mb-4 flex items-center gap-4">
                         Total: <motion.span animate={isPlaying ? { opacity: [1,0,1] } : {}} transition={{ delay: 3 }}>$150</motion.span>
                       </div>
                       <div className="flex gap-2">
                         <motion.div animate={isPlaying ? { y: [20, 0], opacity: [0, 1] } : { opacity: 0 }} className="bg-slate-800 p-3 rounded text-sm text-white font-mono">+ $100</motion.div>
                         <motion.div animate={isPlaying ? { y: [20, 0], opacity: [0, 1] } : { opacity: 0 }} transition={{ delay: 1 }} className="bg-slate-800 p-3 rounded text-sm text-red-400 font-mono">- $50</motion.div>
                         <motion.div animate={isPlaying ? { y: [20, 0], opacity: [0, 1] } : { opacity: 0 }} transition={{ delay: 2 }} className="bg-slate-800 p-3 rounded text-sm text-white font-mono">+ $100</motion.div>
                       </div>
                    </div>
                  )}

                  {/* BULKHEAD */}
                  {activePattern.id === "bulkhead" && (
                    <div className="flex gap-4">
                      <div className={`w-20 h-32 rounded-xl flex items-end justify-center pb-4 text-2xl transition-all duration-1000 border-4 border-slate-700 ${isPlaying ? 'bg-red-900/50' : 'bg-slate-800'}`}>
                        {isPlaying ? '🔥' : '⚙️'}
                      </div>
                      <div className="w-2 h-32 bg-slate-600 rounded-full" /> {/* The Wall */}
                      <div className="w-20 h-32 bg-slate-800 rounded-xl flex items-end justify-center pb-4 text-2xl border-4 border-slate-700">⚙️</div>
                      <div className="w-2 h-32 bg-slate-600 rounded-full" /> {/* The Wall */}
                      <div className="w-20 h-32 bg-slate-800 rounded-xl flex items-end justify-center pb-4 text-2xl border-4 border-slate-700">⚙️</div>
                    </div>
                  )}

                  {/* STRANGLER */}
                  {activePattern.id === "strangler" && (
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <motion.div 
                        animate={isPlaying ? { scale: 0.2, opacity: 0.5 } : { scale: 1 }} 
                        transition={{ duration: 3 }}
                        className="absolute inset-0 bg-slate-700 rounded-3xl flex items-center justify-center text-4xl"
                      >
                        🦖
                      </motion.div>
                      <motion.div 
                        animate={isPlaying ? { scale: 1, opacity: 1 } : { scale: 0.2, opacity: 0 }} 
                        transition={{ duration: 3 }}
                        className="absolute inset-4 bg-emerald-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl"
                      >
                        🚀
                      </motion.div>
                    </div>
                  )}

                  {/* ACL */}
                  {activePattern.id === "acl" && (
                    <div className="flex items-center gap-6">
                      <div className="bg-slate-800 p-6 rounded-2xl text-4xl">🦖</div>
                      
                      <div className="relative w-32 h-16 bg-slate-700 rounded flex items-center justify-center overflow-hidden">
                        <span className="text-[10px] text-slate-400 font-mono absolute top-1">Translator</span>
                        {isPlaying && (
                          <motion.div 
                            animate={{ x: [-50, 50] }} 
                            transition={{ duration: 2, repeat: 1 }}
                            className="text-xl"
                          >
                            🍝 ➡️ 🍣
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-blue-900/50 border border-blue-500 p-6 rounded-2xl text-4xl">💻</div>
                    </div>
                  )}

                  {/* BFF */}
                  {activePattern.id === "bff" && (
                    <div className="flex items-center justify-between w-full max-w-lg px-8">
                      <div className="text-4xl">📱</div>
                      <div className="flex-1 px-8 relative h-10 flex items-center justify-center">
                        {isPlaying && <motion.div animate={{ x: [-50, 50] }} className="absolute text-sm">📦 (Small)</motion.div>}
                      </div>
                      <div className="bg-pink-900/40 p-4 rounded-2xl text-2xl border border-pink-500">🛍️ BFF</div>
                      <div className="flex-1 px-8 relative h-10 flex items-center justify-center">
                        {isPlaying && <motion.div animate={{ x: [-50, 50] }} className="absolute text-2xl">📦📦📦📦</motion.div>}
                      </div>
                      <div className="text-4xl">🗄️</div>
                    </div>
                  )}

                  {/* SIDECAR */}
                  {activePattern.id === "sidecar" && (
                    <div className="flex items-center gap-2">
                       <motion.div 
                         animate={isPlaying ? { y: [-2, 2, -2] } : {}} 
                         transition={{ repeat: Infinity, duration: 0.5 }}
                         className="bg-blue-600 w-32 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative"
                       >
                         🚗
                         <span className="absolute -bottom-6 text-[10px] font-mono text-slate-400 uppercase">App (You)</span>
                       </motion.div>
                       
                       <motion.div 
                         animate={isPlaying ? { y: [-2, 2, -2] } : {}} 
                         transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                         className="bg-orange-500 w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-lg relative ml-2"
                       >
                         🔫
                         <span className="absolute -bottom-6 text-[10px] font-mono text-slate-400 uppercase">Sidecar</span>
                       </motion.div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {!isPlaying && <div className="absolute bottom-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Awaiting Simulation</div>}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
