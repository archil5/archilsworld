import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { brandLogos, chapterImages, careerLogos } from "@/data/brandLogos";

const HexTile = ({
  position,
  color,
  isActive,
  isVisited,
  onClick,
  index,
  icon,
  label,
  brandLogo,
  image,
  showExplore,
  onExplore,
  exploreHint,
}: {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  isVisited: boolean;
  onClick: () => void;
  index: number;
  icon: string;
  label: string;
  brandLogo?: string;
  image?: string;
  showExplore?: boolean;
  onExplore?: () => void;
  exploreHint?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const size = 0.7;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = size * Math.cos(angle);
      const y = size * Math.sin(angle);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({ depth: 0.15, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const floatY = baseY + Math.sin(t * 0.8 + index * 0.5) * 0.05;
    meshRef.current.position.y = isActive ? baseY + 0.35 : floatY;
    const s = isActive ? 1.12 + Math.sin(t * 3) * 0.02 : 1;
    meshRef.current.scale.setScalar(s);

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive ? 0.35 + Math.sin(t * 4) * 0.12 : isVisited ? 0.06 : 0.0;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = isActive ? 0.7 : 0;
      ringRef.current.scale.setScalar(isActive ? 1 + Math.sin(t * 2) * 0.05 : 1);
    }
  });

  const logoSrc = brandLogo && brandLogo !== "Career" ? brandLogos[brandLogo] : null;
  const imageSrc = image ? chapterImages[image] : null;
  const isCareer = brandLogo === "Career";

  const tileSize = 170;

  const engravedFilter = [
    "contrast(1.2)", "saturate(0.5)", "brightness(0.9)",
    "drop-shadow(1px 2px 2px rgba(0,0,0,0.4))",
  ].join(" ");

  const engravedFilterActive = [
    "contrast(1.3)", "saturate(0.6)", "brightness(0.95)",
    "drop-shadow(2px 3px 3px rgba(0,0,0,0.5))",
  ].join(" ");

  const containerStyle: React.CSSProperties = {
    width: tileSize, height: tileSize,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  };

  const imgFilter = isActive ? engravedFilterActive : engravedFilter;

  return (
    <group position={position}>
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} raycast={() => null}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]} raycast={() => null}>
        <ringGeometry args={[0.85, 0.95, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); if (isActive && onExplore) { onExplore(); } else { onClick(); } }}
        castShadow receiveShadow
      >
        <extrudeGeometry args={[hexShape, extrudeSettings]} />
        <meshStandardMaterial
          color={isActive ? "#faf5ee" : isVisited ? "#ede8df" : "#f0ebe3"}
          roughness={isActive ? 0.35 : 0.7}
          metalness={isActive ? 0.08 : 0.02}
          emissive={isActive ? color : "#000000"}
          emissiveIntensity={isActive ? 0.1 : 0}
        />
      </mesh>


      <Html
        position={[0, isActive ? 0.6 : 0.22, 0]}
        center
        distanceFactor={5.5}
        style={{ pointerEvents: "auto", userSelect: "none", cursor: "pointer" }}
        transform
        occlude={false}
        sprite={false}
      >
        <div
          onClick={(e) => { e.stopPropagation(); if (isActive && onExplore) { onExplore(); } else { onClick(); } }}
          style={{ ...containerStyle, clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}
        >
          {isCareer ? (
            <div style={{ width: tileSize, height: tileSize, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid rgba(160,130,100,0.2)" }}>
                <img src={careerLogos.RBC} alt="RBC" style={{ height: "55%", objectFit: "contain", filter: imgFilter, mixBlendMode: "multiply", opacity: 0.85 }} />
              </div>
              <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={careerLogos.BMO} alt="BMO" style={{ height: "55%", objectFit: "contain", filter: imgFilter, mixBlendMode: "multiply", opacity: 0.85 }} />
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 3, height: "40%", background: "linear-gradient(to bottom, transparent, rgba(140,120,90,0.3), transparent)", borderRadius: 2 }} />
            </div>
          ) : imageSrc ? (
            <div style={{ width: tileSize, height: tileSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={imageSrc} alt={label} style={{ width: "88%", height: "88%", objectFit: "contain", filter: imgFilter, mixBlendMode: "multiply", opacity: 0.8 }} />
            </div>
          ) : logoSrc ? (
            <div style={{ width: tileSize, height: tileSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={logoSrc} alt={brandLogo} style={{ height: "60%", maxWidth: "80%", objectFit: "contain", filter: imgFilter, mixBlendMode: "multiply", opacity: 0.8 }} />
            </div>
          ) : (
            <div style={{ width: tileSize, height: tileSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 42, lineHeight: 1, filter: "grayscale(0.4) drop-shadow(1px 2px 1px rgba(0,0,0,0.3))", opacity: 0.7 }}>{icon}</span>
            </div>
          )}
        </div>
      </Html>

      {/* Techy explore popup floating above the tile */}
      {showExplore && onExplore && (
        <Html
          position={[0, 2.2, 0]}
          center
          distanceFactor={5.5}
          style={{ pointerEvents: "auto", userSelect: "none" }}
          sprite
        >
          <div
            onClick={(e) => { e.stopPropagation(); onExplore(); }}
            style={{
              background: "linear-gradient(135deg, rgba(15,15,20,0.92), rgba(25,25,35,0.95))",
              border: `1px solid ${color}50`,
              borderRadius: 8,
              padding: "10px 16px",
              cursor: "pointer",
              boxShadow: `0 0 20px ${color}25, 0 0 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              maxWidth: 280,
              position: "relative" as const,
              overflow: "hidden" as const,
            }}
          >
            {/* Scan line effect */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, transparent 0%, ${color}08 50%, transparent 100%)`,
              animation: "float-piece 3s ease-in-out infinite",
              pointerEvents: "none",
            }} />
            {/* Terminal bracket */}
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: `${color}90`, fontWeight: 500 }}>
              {"["}
            </span>
            {/* Blinking cursor */}
            <span style={{
              width: 6, height: 6, borderRadius: 1,
              background: color,
              boxShadow: `0 0 8px ${color}80`,
              animation: "pulse-glow 1.5s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: "#e0e0e0",
              letterSpacing: 0.6,
            }}>
              {exploreHint || `Inside ${label}`}
            </span>
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color }}>
              →
            </span>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: `${color}90`, fontWeight: 500 }}>
              {"]"}
            </span>
          </div>
          {/* Pointer triangle */}
          <div style={{
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `5px solid rgba(25,25,35,0.95)`,
            margin: "0 auto",
          }} />
        </Html>
      )}

      {isActive && <pointLight color={color} intensity={3} distance={5} position={[0, 1.8, 0]} />}
    </group>
  );
};

export default HexTile;
