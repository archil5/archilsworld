import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  {
    number: 7, name: "Application", color: "#E44D26", icon: "🌐",
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "SSH"],
    dataUnit: "Data",
    realWorld: "The browser, the API call, the email client — where humans interact with the network.",
    whatHappens: "User-facing services generate or consume data. This is where REST APIs live, where web pages render.",
    mySkill: "Built REST APIs, web apps, and automated SSH-based deployments across enterprise infrastructure.",
  },
  {
    number: 6, name: "Presentation", color: "#F0A830", icon: "🔐",
    protocols: ["SSL/TLS", "JPEG", "ASCII", "MIME", "JSON"],
    dataUnit: "Data",
    realWorld: "Encryption, compression, data formatting — translating between app-speak and network-speak.",
    whatHappens: "Data gets encrypted (TLS handshake), compressed, or formatted. Ensures both sides understand each other.",
    mySkill: "Implemented TLS termination, certificate management, and data serialization patterns at scale.",
  },
  {
    number: 5, name: "Session", color: "#2a7d4f", icon: "🤝",
    protocols: ["NetBIOS", "RPC", "PPTP", "SCP"],
    dataUnit: "Data",
    realWorld: "Managing connections — who's talking to whom, keeping conversations alive.",
    whatHappens: "Establishes, maintains, and tears down sessions. Handles authentication tokens and session state.",
    mySkill: "Designed session management for distributed microservices using OAuth2 and service mesh (Istio).",
  },
  {
    number: 4, name: "Transport", color: "#3d7aaf", icon: "📦",
    protocols: ["TCP", "UDP", "TLS", "QUIC"],
    dataUnit: "Segment",
    realWorld: "Reliable delivery vs. speed — TCP guarantees order, UDP trades it for performance.",
    whatHappens: "Data is segmented, sequenced, and flow-controlled. Port numbers identify services (80, 443, 22).",
    mySkill: "Configured load balancers, health checks, and connection pooling for high-throughput banking services.",
  },
  {
    number: 3, name: "Network", color: "#6B4C9A", icon: "🗺️",
    protocols: ["IP", "ICMP", "OSPF", "BGP", "ARP"],
    dataUnit: "Packet",
    realWorld: "Routing — finding the best path across networks. IP addresses live here.",
    whatHappens: "Logical addressing (IP) and routing decisions. Routers read destination IPs and forward packets.",
    mySkill: "Designed VPC architectures, subnet strategies, and Transit Gateway topologies for multi-account AWS/Azure.",
  },
  {
    number: 2, name: "Data Link", color: "#b5653a", icon: "🔗",
    protocols: ["Ethernet", "Wi-Fi (802.11)", "PPP", "VLAN"],
    dataUnit: "Frame",
    realWorld: "Local delivery — MAC addresses, switches, VLANs. The neighborhood post office.",
    whatHappens: "Frames are created with source/destination MAC addresses. Error detection via CRC. Switches operate here.",
    mySkill: "Configured VLANs, switch port security, and 802.1X authentication in enterprise networks.",
  },
  {
    number: 1, name: "Physical", color: "#555555", icon: "⚡",
    protocols: ["Ethernet cables", "Fiber optic", "Wi-Fi radio", "USB"],
    dataUnit: "Bits",
    realWorld: "Raw electricity, light pulses, radio waves — the actual physics of moving data.",
    whatHappens: "Binary data becomes electrical signals, light, or radio. Cables, NICs, and hubs operate at this level.",
    mySkill: "Hands-on with rack & stack, cabling, and physical network audits during early career networking labs.",
  },
];

const NetworkWorld = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const selected = activeLayer !== null ? layers.find(l => l.number === activeLayer) : null;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl w-full items-start">
        {/* OSI Stack */}
        <div className="flex-1 flex flex-col items-center">
          <p className="text-xs font-mono mb-3" style={{ color: "rgba(80,70,60,0.55)" }}>
            OSI MODEL · Click any layer to explore
          </p>
          <div className="w-full max-w-md flex flex-col gap-1">
            {layers.map((layer, i) => {
              const isActive = activeLayer === layer.number;
              const isHovered = hoveredLayer === layer.number;
              return (
                <motion.button
                  key={layer.number}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-left"
                  onClick={() => setActiveLayer(isActive ? null : layer.number)}
                  onMouseEnter={() => setHoveredLayer(layer.number)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: isActive ? `${layer.color}12` : isHovered ? `${layer.color}08` : "#fefcf9",
                    border: `2px solid ${isActive ? layer.color : isHovered ? `${layer.color}40` : "rgba(180,140,100,0.1)"}`,
                    boxShadow: isActive ? `0 4px 20px ${layer.color}20` : "none",
                  }}
                >
                  <span className="text-lg w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ background: `${layer.color}15` }}>
                    {layer.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ background: layer.color, color: "#fff" }}>
                        L{layer.number}
                      </span>
                      <span className="text-sm font-display font-bold" style={{ color: isActive ? layer.color : "#2d2a26" }}>
                        {layer.name}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono truncate" style={{ color: "rgba(80,70,60,0.5)" }}>
                      {layer.protocols.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.35)" }}>
                    {layer.dataUnit}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Packet flow indicator */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.35)" }}>↑ SENDER</span>
            <div className="h-px flex-1" style={{ background: "rgba(180,140,100,0.15)" }} />
            <span className="text-[9px] font-mono" style={{ color: "rgba(80,70,60,0.35)" }}>RECEIVER ↓</span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:w-96 w-full">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.number}
                className="rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={{ border: `1px solid ${selected.color}25` }}
              >
                {/* Header */}
                <div className="px-5 py-4" style={{ background: `${selected.color}10` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selected.icon}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ color: selected.color }}>
                        Layer {selected.number} — {selected.name}
                      </h3>
                      <p className="text-[10px] font-mono" style={{ color: "rgba(80,70,60,0.5)" }}>
                        Data Unit: {selected.dataUnit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4" style={{ background: "#fefcf9" }}>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: selected.color }}>
                      What Happens Here
                    </p>
                    <p className="text-sm font-body leading-relaxed" style={{ color: "rgba(45,42,38,0.8)" }}>
                      {selected.whatHappens}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: selected.color }}>
                      Real-World Analogy
                    </p>
                    <p className="text-sm font-body italic" style={{ color: "rgba(45,42,38,0.7)" }}>
                      {selected.realWorld}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: selected.color }}>
                      Protocols
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.protocols.map(p => (
                        <span key={p} className="text-[11px] font-mono px-2 py-1 rounded"
                          style={{ background: `${selected.color}08`, border: `1px solid ${selected.color}15`, color: selected.color }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg p-3" style={{ background: "rgba(42,125,79,0.05)", border: "1px solid rgba(42,125,79,0.15)" }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "#2a7d4f" }}>
                      🎯 My Experience
                    </p>
                    <p className="text-xs font-body" style={{ color: "rgba(45,42,38,0.75)" }}>
                      {selected.mySkill}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="rounded-xl p-8 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: "#fefcf9", border: "1px solid rgba(180,140,100,0.1)" }}>
                <span className="text-4xl mb-3 block">🔌</span>
                <p className="font-display text-lg mb-2" style={{ color: "#2d2a26" }}>The OSI Model</p>
                <p className="text-sm font-body italic" style={{ color: "rgba(80,70,60,0.55)" }}>
                  7 layers that make the internet work. Click any layer to explore what happens at each level — and how I've worked with it.
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
