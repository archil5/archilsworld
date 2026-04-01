import { motion } from "framer-motion";
import { chapterImages } from "@/data/brandLogos";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

const links = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/archil5/", icon: "↗" },
  { label: "Email", url: "mailto:archil620@gmail.com", icon: "✉" },
];

const ContactWorld = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-12">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={chapterImages.archil}
            alt="Archil Patel"
            className="w-36 h-36 md:w-44 md:h-44 object-cover"
            style={{
              border: `1px solid ${COPPER}40`,
            }}
          />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-display-lg font-bold mb-2" style={{ color: INK }}>
            Archil Patel
          </h2>
          <p className="font-mono text-mono-sm" style={{ color: INK_MUTED }}>
            Principal Cloud Engineer · AI Platform Architect
          </p>
        </motion.div>

        <motion.p
          className="font-display text-base italic text-center max-w-sm leading-relaxed"
          style={{ color: `${INK_MUTED}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          "I'm always open to connecting — whether it's about cloud architecture, AI, leadership, or the next big thing."
        </motion.p>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 transition-all font-mono text-mono-sm tracking-wider ink-underline"
              style={{
                background: `${INK}06`,
                border: `1px solid ${INK}12`,
                color: INK,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${INK}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${INK}06`;
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 p-5 text-center max-w-sm"
          style={{
            background: `${INK}03`,
            borderLeft: `2px solid ${COPPER}30`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-mono text-mono-xs uppercase tracking-[0.2em] mb-2" style={{ color: COPPER }}>
            Current Focus
          </p>
          <p className="font-display text-sm" style={{ color: INK_MUTED }}>
            Enterprise AI Platforms · Azure OpenAI · RAG at Scale · Model Governance
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactWorld;