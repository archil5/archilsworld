import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { TileData } from "@/data/tiles";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/tiles";

interface TileDetailProps {
  tile: TileData | null;
  onClose: () => void;
}

const TileDetail = ({ tile, onClose }: TileDetailProps) => {
  return (
    <AnimatePresence>
      {tile && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="detail-card inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="detail-card-inner w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar"
              initial={{ rotateY: -90, scale: 0.8, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: 90, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 150, duration: 0.6 }}
              style={{ transformOrigin: "center center" }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "hsl(var(--ink) / 0.1)",
                  color: "hsl(var(--ink) / 0.6)",
                }}
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="detail-header">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{tile.icon}</span>
                  <div
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      background: CATEGORY_COLORS[tile.category] + "20",
                      color: CATEGORY_COLORS[tile.category],
                      border: `1px solid ${CATEGORY_COLORS[tile.category]}40`,
                    }}
                  >
                    {CATEGORY_LABELS[tile.category]}
                  </div>
                </div>
                <h2 className="detail-title">{tile.title}</h2>
                <p className="detail-subtitle">{tile.subtitle}</p>
                <p
                  className="text-xs mt-2 font-mono"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {tile.year}
                </p>
              </div>

              {/* Body */}
              <div className="detail-body">
                <p className="detail-text mb-5">{tile.narrative}</p>

                {tile.skills && tile.skills.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-display uppercase tracking-widest mb-3"
                      style={{ color: "hsl(var(--gold-dim))" }}
                    >
                      Skills Unlocked
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tile.skills.map((skill) => (
                        <span key={skill} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TileDetail;
