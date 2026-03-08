import { motion } from "framer-motion";
import HexGrid from "../HexGrid";

const roles = [
  {
    company: "RBC",
    title: "DevOps Engineer — Cyber Security",
    period: "Sep 2018 — Dec 2018",
    narrative: "My first move on the board. I walked into one of the largest banks in the country and built automation for cybersecurity compliance. Ansible, Python, Jenkins — the tools of a builder learning how real systems defend themselves.",
  },
  {
    company: "BMO",
    title: "Cloud Infrastructure Engineer",
    period: "Mar 2019 — May 2020",
    narrative: "The foundation year. High-pressure cloud migrations, wiring up network connectivity, establishing Infrastructure as Code as the standard. I learned that the best architecture is the one nobody notices — because it just works.",
  },
  {
    company: "BMO",
    title: "Senior Cloud Engineer",
    period: "Jun 2020 — Apr 2021",
    narrative: "I stopped building and started designing. The shift from implementation to strategy — translating infrastructure complexity into decisions that leadership could act on. Reactive firefighting became proactive optimization.",
  },
  {
    company: "BMO",
    title: "Team Lead",
    period: "May 2021 — Jul 2022",
    narrative: "Leading the squad. We turned container deployments from days into hours. We built CI/CD pipelines that sailed through audits with zero critical findings. The move from 'I can build this' to 'I can help everyone build this.'",
  },
  {
    company: "BMO",
    title: "Principal Cloud Engineer — Serverless & Containers",
    period: "Jul 2022 — Aug 2025",
    narrative: "Owning the platform. Multi-region architectures supporting thousands of developers. I led the shift from a 'servers' mindset to a 'services' mindset — reducing complexity across hundreds of teams while keeping the pace fast.",
  },
];

const CareerChapter = () => {
  return (
    <section className="chapter-section !items-start py-20" id="career">
      <div className="chapter-overlay" style={{
        background: "linear-gradient(145deg, hsl(28 40% 12% / 0.88), hsl(25 30% 18% / 0.75))"
      }} />
      <HexGrid opacity={0.04} color="hsl(38, 70%, 55%)" />

      <div className="chapter-content py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="chapter-subtitle text-gold/70 mb-4">Chapter III</p>
          <h2 className="chapter-title text-primary-foreground text-3xl md:text-5xl lg:text-6xl mb-6">
            The Journey
          </h2>
          <p className="chapter-body text-primary-foreground/70 max-w-xl mb-12">
            Every role was a new tile placed on the board. Each one earned, each one building toward something bigger.
          </p>
        </motion.div>

        <div className="space-y-0">
          {roles.map((role, i) => (
            <motion.div
              key={i}
              className="timeline-node"
              style={{ borderColor: "hsl(var(--gold) / 0.2)" }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="role-card bg-ink/40 border-gold/10">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="font-display text-gold text-sm tracking-widest uppercase">
                    {role.company}
                  </span>
                  <span className="text-primary-foreground/40 text-xs">·</span>
                  <span className="text-primary-foreground/50 text-xs font-mono">
                    {role.period}
                  </span>
                </div>
                <h3 className="font-display text-primary-foreground/90 text-lg md:text-xl mb-3">
                  {role.title}
                </h3>
                <p className="chapter-body text-primary-foreground/70 text-base">
                  {role.narrative}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerChapter;
