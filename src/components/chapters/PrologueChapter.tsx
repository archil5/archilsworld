import { motion } from "framer-motion";
import heroMap from "@/assets/hero-map.jpg";
import HexGrid from "../HexGrid";

const PrologueChapter = () => {
  return (
    <section className="chapter-section" id="prologue">
      <div className="chapter-overlay bg-gradient-to-b from-ink/40 via-ink/20 to-transparent" />
      <HexGrid opacity={0.05} />
      
      <div className="chapter-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="chapter-subtitle mb-6">Chapter 0</p>
          <h1 className="chapter-title mb-8">Archil Patel</h1>
          <div className="hex-divider">
            <span className="hex-dot" />
            <span className="hex-dot" style={{ animationDelay: "0.2s" }} />
            <span className="hex-dot" />
          </div>
        </motion.div>

        <motion.p
          className="chapter-body text-center max-w-2xl mx-auto mt-6 text-xl md:text-2xl italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Every great journey starts with a question you can't stop asking.
          <br />
          Mine was always the same: <em>"How does this work?"</em>
        </motion.p>

        <motion.div
          className="mt-12 relative rounded-xl overflow-hidden shadow-2xl max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          viewport={{ once: true }}
          style={{ border: "3px solid hsl(var(--wood-light) / 0.4)" }}
        >
          <img
            src={heroMap}
            alt="An illustrated board game map showing a journey from village to university to city"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm font-display tracking-widest uppercase">
            Scroll to begin
          </p>
          <motion.div
            className="w-5 h-8 border-2 rounded-full flex items-start justify-center p-1"
            style={{ borderColor: "hsl(var(--wood-light))" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrologueChapter;
