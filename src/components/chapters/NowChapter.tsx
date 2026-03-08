import { motion } from "framer-motion";
import HexGrid from "../HexGrid";

const pillars = [
  {
    label: "Strategic Architecture",
    desc: "Multi-year, multi-region cloud systems built for scale, security, and cost — in one of the most regulated environments on the planet.",
  },
  {
    label: "Enterprise AI Integration",
    desc: "Bridging AI platforms with the realities of production-grade financial systems. Making sure the future is as resilient as the present.",
  },
  {
    label: "Engineering Excellence",
    desc: "Mentoring engineers to reason about security, compliance, and long-term maintainability — not just how to use the latest tool.",
  },
];

const NowChapter = () => {
  return (
    <section className="chapter-section" id="now">
      <div className="chapter-overlay" style={{
        background: "linear-gradient(135deg, hsl(220 30% 10% / 0.9), hsl(28 20% 15% / 0.8))"
      }} />
      <HexGrid opacity={0.03} color="hsl(210, 40%, 60%)" />

      <div className="chapter-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <p className="chapter-subtitle text-gold/60 mb-4">Chapter IV</p>
          <h2 className="chapter-title text-primary-foreground text-3xl md:text-5xl lg:text-6xl mb-8">
            The Frontier
          </h2>
        </motion.div>

        <motion.div
          className="chapter-body text-primary-foreground/80 max-w-2xl mx-auto space-y-5 mb-14 text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>
            Today, I'm a <em>Principal Cloud Engineer — AI</em> at BMO. My job is to architect the secure backbone for enterprise AI — making sure the most powerful technology of our generation runs on foundations that don't crack under pressure.
          </p>
          <p>
            I design Azure-based AI platforms that integrate enterprise data services while meeting strict model governance and audit requirements. I build so that AI workflows are as resilient and observable as core banking systems.
          </p>
          <p>
            The board keeps expanding. The questions keep getting better. And I'm still that kid who needs to know <em>how it works</em> — I just get to answer it at a much bigger scale now.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              className="role-card bg-ink/40 border-gold/10 text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, borderColor: "hsl(43, 80%, 50%, 0.4)" }}
            >
              <h4 className="font-display text-gold text-sm tracking-wider mb-3">{p.label}</h4>
              <p className="text-primary-foreground/60 text-sm leading-relaxed font-body">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          viewport={{ once: true }}
        >
          <div className="hex-divider">
            <span className="hex-dot" />
            <span className="hex-dot" />
            <span className="hex-dot" />
          </div>
          <p className="text-primary-foreground/50 font-display text-sm tracking-widest">
            The game continues.
          </p>
          <a
            href="https://www.linkedin.com/in/archil5"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm tracking-wider uppercase transition-all duration-300 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/60 hover:shadow-[0_0_20px_hsl(43_80%_50%_/_0.2)]"
          >
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default NowChapter;
