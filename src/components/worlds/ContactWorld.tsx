import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";
import { chapterImages } from "@/data/brandLogos";

const links = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/archil5/", Icon: Linkedin },
  { label: "Email", url: "mailto:archil620@gmail.com", Icon: Mail },
];

const ContactWorld = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="max-w-lg w-full flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <img
            src={chapterImages.archil}
            alt="Archil Patel"
            className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover"
            style={{
              border: "3px solid rgba(181,101,58,0.3)",
              boxShadow: "0 8px 30px rgba(181,101,58,0.15)",
            }}
          />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-1" style={{ color: "#2d2a26" }}>
            Archil Patel
          </h2>
          <p className="font-body text-sm" style={{ color: "#6b6560" }}>
            Principal Cloud Engineer · AI Platform Architect
          </p>
        </motion.div>

        <motion.p
          className="font-body text-sm italic text-center max-w-sm leading-relaxed"
          style={{ color: "rgba(45,42,38,0.75)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          "I'm always open to connecting — whether it's about cloud architecture, AI, leadership, or the next big thing. Let's build something together."
        </motion.p>

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-display text-sm tracking-wider"
              style={{
                background: "rgba(181,101,58,0.06)",
                border: "1px solid rgba(181,101,58,0.2)",
                color: "#b5653a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(181,101,58,0.15)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(181,101,58,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(181,101,58,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <link.Icon size={16} />
              {link.label}
            </a>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 p-4 rounded-xl text-center max-w-sm"
          style={{
            background: "rgba(181,101,58,0.04)",
            border: "1px solid rgba(181,101,58,0.1)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "#b5653a" }}>
            Current Focus
          </p>
          <p className="text-xs font-body" style={{ color: "#6b6560" }}>
            Enterprise AI Platforms · Azure OpenAI · RAG at Scale · Model Governance
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactWorld;
