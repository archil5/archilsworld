import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chapterImages } from "@/data/brandLogos";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const AMBER = "#D97706";
const BLUE = "#2563EB";

const links = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/archil5/",
    icon: "↗",
    detail: "Connect professionally",
    color: BLUE,
  },
  {
    label: "Email",
    url: "mailto:archil620@gmail.com",
    icon: "✉",
    detail: "archil620@gmail.com",
    color: COPPER,
  },
  {
    label: "GitHub",
    url: "https://github.com/archil5",
    icon: "⌥",
    detail: "See my public work",
    color: INK,
  },
];

const currentFocus = [
  { label: "Agentic AI", icon: "🤖", detail: "Multi-step reasoning & tool-calling pipelines" },
  { label: "LLMOps", icon: "⚙️", detail: "Model versioning, A/B testing, prompt governance" },
  { label: "GraphRAG", icon: "🕸️", detail: "Knowledge graph + vector hybrid retrieval at scale" },
  { label: "Zero-Trust AI", icon: "🔐", detail: "Private endpoints, CMK encryption, no public exposure" },
];

const expertise = [
  { area: "Cloud Architecture", years: "7+", detail: "AWS & Azure enterprise platforms" },
  { area: "AI / ML Systems", years: "3+", detail: "Agentic AI, RAG, LLMOps" },
  { area: "DevOps & Platform", years: "6+", detail: "CI/CD, IaC, container orchestration" },
  { area: "Cybersecurity", years: "2+", detail: "Automation, SIEM, compliance" },
];

const ContactWorld = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText("archil620@gmail.com").then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 md:px-8 py-8" style={{ background: "#F8FAFC" }}>
      <div className="max-w-2xl mx-auto">

        {/* Profile header */}
        <motion.div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.div className="relative shrink-0"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <img src={chapterImages.archil} alt="Archil Patel"
              className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-2xl"
              style={{ border: `2px solid ${COPPER}30` }} />
            {/* Available badge */}
            <motion.div
              className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "#fff", border: `1.5px solid ${COPPER}30`, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <motion.span className="w-2 h-2 rounded-full" style={{ background: COPPER }}
                animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
              <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: COPPER }}>Open to talk</span>
            </motion.div>
          </motion.div>

          <div className="text-center sm:text-left">
            <motion.h2 className="font-display text-2xl md:text-3xl font-bold mb-1"
              style={{ color: INK }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Archil Patel
            </motion.h2>
            <motion.p className="font-mono text-xs mb-2" style={{ color: COPPER }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Principal Cloud Engineer · AI Platform Architect
            </motion.p>
            <motion.div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: `${INK}06`, color: INK_MUTED }}>📍 Toronto, Canada</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: `${INK}06`, color: INK_MUTED }}>🏦 BMO Financial Group</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div className="mb-7 p-4 rounded-xl"
          style={{ background: `${INK}03`, borderLeft: `2px solid ${COPPER}30` }}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <p className="font-display text-sm leading-relaxed italic" style={{ color: INK_MUTED }}>
            "I'm always open to connecting — whether it's about cloud architecture, enterprise AI, engineering leadership, or the next big thing. If you're building something interesting, let's talk."
          </p>
        </motion.div>

        {/* Current focus */}
        <motion.div className="mb-7"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: COPPER }}>
            Currently Building
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentFocus.map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: `${COPPER}06`, border: `1px solid ${COPPER}10` }}>
                <span className="text-lg shrink-0">{item.icon}</span>
                <div>
                  <p className="font-display text-sm font-semibold" style={{ color: INK }}>{item.label}</p>
                  <p className="font-mono text-[10px]" style={{ color: INK_MUTED }}>{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expertise snapshot */}
        <motion.div className="mb-7"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
            Experience Snapshot
          </p>
          <div className="grid grid-cols-2 gap-2">
            {expertise.map((item, i) => (
              <motion.div key={item.area}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="p-3 rounded-xl"
                style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <p className="font-display text-sm font-bold" style={{ color: INK }}>{item.area}</p>
                  <span className="font-mono text-[10px]" style={{ color: COPPER }}>{item.years} yrs</span>
                </div>
                <p className="font-mono text-[10px]" style={{ color: INK_MUTED }}>{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact links */}
        <motion.div className="mb-6"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INK_MUTED }}>
            Get in Touch
          </p>
          <div className="space-y-2">
            {links.map((link, i) => {
              const isEmail = link.label === "Email";
              return (
                <motion.div key={link.label}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.06 }}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group">
                  {isEmail ? (
                    <button onClick={handleEmailClick}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-left"
                      style={{
                        background: hoveredLink === link.label ? `${link.color}08` : `${INK}03`,
                        border: `1px solid ${hoveredLink === link.label ? `${link.color}20` : `${INK}08`}`,
                      }}>
                      <span className="w-8 h-8 flex items-center justify-center text-base rounded-lg shrink-0"
                        style={{ background: `${link.color}10`, color: link.color }}>{link.icon}</span>
                      <div className="flex-1">
                        <p className="font-display text-sm font-semibold" style={{ color: INK }}>{link.label}</p>
                        <p className="font-mono text-[10px]" style={{ color: INK_MUTED }}>{link.detail}</p>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span key={copiedEmail ? "copied" : "copy"}
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="font-mono text-[10px]"
                          style={{ color: copiedEmail ? COPPER : INK_MUTED }}>
                          {copiedEmail ? "✓ Copied!" : "Copy →"}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  ) : (
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
                      style={{
                        background: hoveredLink === link.label ? `${link.color}08` : `${INK}03`,
                        border: `1px solid ${hoveredLink === link.label ? `${link.color}20` : `${INK}08`}`,
                      }}>
                      <span className="w-8 h-8 flex items-center justify-center text-base rounded-lg shrink-0"
                        style={{ background: `${link.color}10`, color: link.color }}>{link.icon}</span>
                      <div className="flex-1">
                        <p className="font-display text-sm font-semibold" style={{ color: INK }}>{link.label}</p>
                        <p className="font-mono text-[10px]" style={{ color: INK_MUTED }}>{link.detail}</p>
                      </div>
                      <motion.span className="font-mono text-[10px]" style={{ color: INK_MUTED }}
                        animate={{ x: hoveredLink === link.label ? 3 : 0 }}>↗</motion.span>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Response note */}
        <motion.div className="p-4 rounded-xl text-center"
          style={{ background: `${AMBER}06`, border: `1px solid ${AMBER}12` }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: AMBER }}>Response Time</p>
          <p className="font-display text-sm" style={{ color: INK_MUTED }}>
            I read every message. Usually respond within 24–48 hours.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default ContactWorld;
