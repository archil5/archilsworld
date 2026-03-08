import { motion } from "framer-motion";
import HexGrid from "../HexGrid";

const codeSnippets = [
  "<html>",
  "  <body>",
  '    <h1>Hello World</h1>',
  "  </body>",
  "</html>",
];

const OriginChapter = () => {
  return (
    <section className="chapter-section" id="origin">
      <div className="chapter-overlay" style={{
        background: "linear-gradient(135deg, hsl(25 35% 18% / 0.85), hsl(28 25% 22% / 0.7))"
      }} />
      <HexGrid opacity={0.04} color="hsl(43, 80%, 50%)" />

      <div className="chapter-content">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="chapter-subtitle text-gold/80 mb-4">Chapter I</p>
          <h2 className="chapter-title text-primary-foreground text-3xl md:text-5xl lg:text-6xl mb-8">
            The Kid Who Asked Why
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="chapter-body text-primary-foreground/90 space-y-5">
              <p>
                I didn't just play DOS games — I <em>interrogated</em> them. Every pixel, every sound, every menu screen made me ask the same restless question: <em>how did someone make this?</em>
              </p>
              <p>
                That question never went away. It just got bigger. I found HTML and CSS — and suddenly, I wasn't just a consumer anymore. I was building things. Ugly, wonderful things. Websites that looked terrible and worked beautifully.
              </p>
              <p>
                Then I found networking. The whole machine cracked open. I could see how packets moved, how systems talked to each other, how the invisible architecture beneath everything was just… patterns. Elegant, learnable patterns.
              </p>
              <p>
                That was the moment. Not when I learned <em>what</em> to build — but when I realized I could learn <em>anything</em>.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="role-card bg-ink/60 border-gold/20 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-destructive/80" />
                <span className="w-3 h-3 rounded-full bg-gold/60" />
                <span className="w-3 h-3 rounded-full bg-forest-light/60" />
                <span className="ml-2 text-muted-foreground text-xs">first_website.html</span>
              </div>
              {codeSnippets.map((line, i) => (
                <motion.div
                  key={i}
                  className="text-gold/80 font-mono"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <span className="text-muted-foreground mr-3 select-none text-xs">{i + 1}</span>
                  {line}
                </motion.div>
              ))}
              <motion.div
                className="mt-4 text-forest-light text-xs"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                viewport={{ once: true }}
              >
                {">"} It wasn't pretty. But it was <em>mine</em>.
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OriginChapter;
