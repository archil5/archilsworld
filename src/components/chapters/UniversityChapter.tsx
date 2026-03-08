import { motion } from "framer-motion";
import HexGrid from "../HexGrid";

const skills = [
  { name: "Systems Thinking", icon: "🧩" },
  { name: "Automation", icon: "⚙️" },
  { name: "Security", icon: "🛡️" },
  { name: "Ethical Hacking", icon: "🔓" },
];

const UniversityChapter = () => {
  return (
    <section className="chapter-section" id="university">
      <div className="chapter-overlay" style={{
        background: "linear-gradient(160deg, hsl(145 25% 15% / 0.8), hsl(150 20% 20% / 0.6))"
      }} />
      <HexGrid opacity={0.06} color="hsl(145, 30%, 50%)" />

      <div className="chapter-content">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="chapter-subtitle text-forest-light/80 mb-4">Chapter II</p>
          <h2 className="chapter-title text-primary-foreground text-3xl md:text-5xl lg:text-6xl mb-8">
            The Academy
          </h2>
        </motion.div>

        <motion.div
          className="chapter-body text-primary-foreground/90 max-w-2xl space-y-5 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>
            Dalhousie University wasn't just a degree — it was where curiosity became <em>craft</em>. Where I stopped tinkering and started thinking in systems.
          </p>
          <p>
            The Master's programme in Applied Computer Science taught me to think three moves ahead. Not just "how does this work?" but "what breaks when it scales? What fails under pressure? Where does the attacker look first?"
          </p>
          <p>
            I learned to see the board — the whole board — not just the piece in front of me.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="role-card bg-forest/30 border-forest-light/20 flex items-center gap-3 cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-2xl">{skill.icon}</span>
              <span className="font-display text-sm text-primary-foreground/80 tracking-wider">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="role-card bg-forest/20 border-forest-light/20 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-display text-sm text-forest-light/60 tracking-widest uppercase mb-2">
            Dalhousie University
          </p>
          <p className="text-primary-foreground/80 font-body text-lg">
            Master of Applied Computer Science
          </p>
          <p className="text-primary-foreground/50 text-sm mt-1">2017 — 2018 · Halifax, Nova Scotia</p>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityChapter;
