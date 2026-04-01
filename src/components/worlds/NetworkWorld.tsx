import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";

interface OSILayer {
  number: number;
  name: string;
  color: string;
  icon: string;
  protocols: string[];
  dataUnit: string;
  realWorld: string;
  whatHappens: string;
  mySkill: string;
}

const layers: OSILayer[] = [
  { number: 7, name: "Application", color: "#8B6350", icon: "🌐", protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "SSH"], dataUnit: "Data", realWorld: "The browser, the API call, the email client — where humans interact with the network.", whatHappens: "User-facing services generate or consume data. This is where REST APIs live, where web pages render.", mySkill: "Built REST APIs, web apps, and automated SSH-based deployments across enterprise infrastructure." },
  { number: 6, name: "Presentation", color: "#9B8B60", icon: "🔐", protocols: ["SSL/TLS", "JPEG", "ASCII", "MIME", "JSON"], dataUnit: "Data", realWorld: "Encryption, compression, data formatting — translating between app-speak and network-speak.", whatHappens: "Data gets encrypted (TLS handshake), compressed, or formatted. Ensures both sides understand each other.", mySkill: "Implemented TLS termination, certificate management, and data serialization patterns at scale." },
  { number: 5, name: "Session", color: "#6B8B6A", icon: "🤝", protocols: ["NetBIOS", "RPC", "PPTP", "SCP"], dataUnit: "Data", realWorld: "Managing connections — who's talking to whom, keeping conversations alive.", whatHappens: "Establishes, maintains, and tears down sessions. Handles authentication tokens and session state.", mySkill: "Designed session management for distributed microservices using OAuth2 and service mesh (Istio)." },
  { number: 4, name: "Transport", color: "#5A7A8B", icon: "📦", protocols: ["TCP", "UDP", "TLS", "QUIC"], dataUnit: "Segment", realWorld: "Reliable delivery vs. speed — TCP guarantees order, UDP trades it for performance.", whatHappens: "Data is segmented, sequenced, and flow-controlled. Port numbers identify services (80, 443, 22).", mySkill: "Configured load balancers, health checks, and connection pooling for high-throughput banking services." },
  { number: 3, name: "Network", color: "#6B5A7A", icon: "🗺️", protocols: ["IP", "ICMP", "OSPF", "BGP", "ARP"], dataUnit: "Packet", realWorld: "Routing — finding the best path across networks. IP addresses live here.", whatHappens: "Logical addressing (IP) and routing decisions. Routers read destination IPs and forward packets.", mySkill: "Designed VPC architectures, subnet strategies, and Transit Gateway topologies for multi-account AWS/Azure." },
  { number: 2, name: "Data Link", color: "#8B6A50", icon: "🔗", protocols: ["Ethernet", "Wi-Fi (802.11)", "PPP", "VLAN"], dataUnit: "Frame", realWorld: "Local delivery — MAC addresses, switches, VLANs. The neighborhood post office.", whatHappens: "Frames are created with source/destination MAC addresses. Error detection via CRC. Switches operate here.", mySkill: "Configured VLANs, switch port security, and 802.1X authentication in enterprise networks." },
  { number: 1, name: "Physical", color: "#6B6560", icon: "⚡", protocols: ["Ethernet cables", "Fiber optic", "Wi-Fi radio", "USB"], dataUnit: "Bits", realWorld: "Raw electricity, light pulses, radio waves — the actual physics of moving data.", whatHappens: "Binary data becomes electrical signals, light, or radio. Cables, NICs, and hubs operate at this level.", mySkill: "Hands-on with rack & stack, cabling, and physical network audits during early career networking labs." },
];

const NetworkWorld = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const selected = activeLayer !== null ? layers.find(l => l.number === activeLayer) : null;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl w-full items-start">
        {/* OSI Stack */}
        <div className="flex-1 flex flex-col items-center">
          <p className="font-mono text-mono-xs mb-4 tracking-[0.15em] uppercase" style={{ color: INK_MUTED }}>
            OSI Model · Click any layer
          </p>
          <div className="w-full max-w-md flex flex-col gap-1.5">
            {layers.map((layer, i) => {
              const isActive = activeLayer === layer.number;
              const isHovered = hoveredLayer === layer.number;
              return (
                <motion.button
                  key={layer.number}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                  onClick={() => setActiveLayer(isActive ? null : layer.number)}
                  onMouseEnter={() => setHoveredLayer(layer.number)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: isActive ? `${layer.color}10` : isHovered ? `${layer.color}06` : `${INK}02`,
                    borderLeft: isActive ? `2px solid ${layer.color}` : `2px solid transparent`,
                    border: `1px solid ${isActive ? `${layer.color}30` : isHovered ? `${layer.color}15` : `${INK}06`}`,
                  }}
                >
                  <span className="text-lg">{layer.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-mono-xs font-bold px-1.5 py-0.5"
                        style={{ background: layer.color, color: "#fff" }}>
                        L{layer.number}
                      </span>
                      <span className="font-display text-base font-bold" style={{ color: isActive ? layer.color : INK }}>
                        {layer.name}
                      </span>
                    </div>
                    <p className="font-mono text-mono-xs truncate" style={{ color: INK_MUTED }}>
                      {layer.protocols.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                  <span className="font-mono text-mono-xs" style={{ color: `${INK_MUTED}60` }}>
                    {layer.dataUnit}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="font-mono text-mono-xs" style={{ color: `${INK_MUTED}40` }}>↑ SENDER</span>
            <div className="h-px flex-1" style={{ background: `${INK}08` }} />
            <span className="font-mono text-mono-xs" style={{ color: `${INK_MUTED}40` }}>RECEIVER ↓</span>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:w-96 w-full">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.number}
                className="overflow-hidden"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ border: `1px solid ${selected.color}20` }}
              >
                <div className="px-5 py-4" style={{ background: `${selected.color}08` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selected.icon}</span>
                    <div>
                      <h3 className="font-display text-display-sm font-bold" style={{ color: selected.color }}>
                        Layer {selected.number} — {selected.name}
                      </h3>
                      <p className="font-mono text-mono-xs" style={{ color: INK_MUTED }}>
                        Data Unit: {selected.dataUnit}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-5" style={{ background: `${INK}02` }}>
                  <div>
                    <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: selected.color }}>What Happens Here</p>
                    <p className="font-display text-sm leading-relaxed" style={{ color: INK_MUTED }}>{selected.whatHappens}</p>
                  </div>
                  <div>
                    <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: selected.color }}>Real-World Analogy</p>
                    <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>{selected.realWorld}</p>
                  </div>
                  <div>
                    <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-2" style={{ color: selected.color }}>Protocols</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.protocols.map(p => (
                        <span key={p} className="font-mono text-mono-xs px-2 py-0.5"
                          style={{ background: `${selected.color}08`, borderBottom: `1px solid ${selected.color}15`, color: selected.color }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3" style={{ background: `${COPPER}06`, borderLeft: `2px solid ${COPPER}30` }}>
                    <p className="font-mono text-mono-xs uppercase tracking-[0.15em] mb-1" style={{ color: COPPER }}>My Experience</p>
                    <p className="font-display text-sm" style={{ color: INK_MUTED }}>{selected.mySkill}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="p-8 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: `${INK}02`, border: `1px solid ${INK}06` }}>
                <span className="text-4xl mb-3 block">🔌</span>
                <p className="font-display text-display-sm mb-2" style={{ color: INK }}>The OSI Model</p>
                <p className="font-display text-sm italic" style={{ color: INK_MUTED }}>
                  7 layers that make the internet work. Click any layer to explore.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NetworkWorld;