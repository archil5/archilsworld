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
    meshRef.current.position.y = isActive ? baseY + 0.4 : floatY;

    const s = isActive ? 1.15 + Math.sin(t * 3) * 0.03 : 1;
    meshRef.current.scale.setScalar(s);

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive ? 0.25 + Math.sin(t * 4) * 0.1 : isVisited ? 0.08 : 0.0;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = isActive ? 0.5 : 0;
    }
  });

  const logoSrc = brandLogo && brandLogo !== "Career" ? brandLogos[brandLogo] : null;
  const imageSrc = image ? chapterImages[image] : null;
  const isCareer = brandLogo === "Career";

  // Tile content style - fills the hex face
  const tileSize = 100;
  const activeFilter = "none";
  const inactiveFilter = "grayscale(0.15) opacity(0.8)";

  return (
    <group position={position}>
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <ringGeometry args={[0.85, 0.95, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[hexShape, extrudeSettings]} />
        <meshStandardMaterial
          color={isActive ? color : isVisited ? "#e8ddd0" : "#f5f0e8"}
          roughness={isActive ? 0.25 : 0.6}
          metalness={isActive ? 0.3 : 0.05}
          emissive={isActive ? color : "#000000"}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </mesh>

      {/* Full-tile HTML overlay */}
      <Html
        position={[0, isActive ? 0.65 : 0.25, 0]}
        center
        distanceFactor={6}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: tileSize,
            height: tileSize,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {imageSrc ? (
            /* Contact tile - full photo */
            <div style={{ width: tileSize, height: tileSize, position: "relative" }}>
              <img
                src={imageSrc}
                alt={label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: `3px solid ${isActive ? color : "rgba(180,140,100,0.4)"}`,
                  filter: isActive ? activeFilter : inactiveFilter,
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "4px 0 2px",
                background: "linear-gradient(transparent, rgba(45,42,38,0.8))",
                borderRadius: "0 0 50px 50px",
                textAlign: "center",
              }}>
                <span style={{
                  fontSize: 8,
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  color: "#f5f0e8",
                  letterSpacing: "0.08em",
                }}>
                  {label}
                </span>
              </div>
            </div>
          ) : isCareer ? (
            /* Career tile - RBC + BMO stacked */
            <div style={{
              width: tileSize,
              height: tileSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background: isActive
                ? `radial-gradient(circle, ${color}18, transparent)`
                : "none",
              borderRadius: "50%",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <img src={careerLogos.RBC} alt="RBC" style={{
                  height: 30,
                  objectFit: "contain",
                  filter: isActive ? activeFilter : inactiveFilter,
                }} />
                <img src={careerLogos.BMO} alt="BMO" style={{
                  height: 30,
                  objectFit: "contain",
                  filter: isActive ? activeFilter : inactiveFilter,
                }} />
              </div>
              <span style={{
                fontSize: 7,
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                color: isActive ? "#2d2a26" : "#6b6560",
                letterSpacing: "0.06em",
                textShadow: "0 1px 2px rgba(255,255,255,0.9)",
              }}>
                {label}
              </span>
            </div>
          ) : logoSrc ? (
            /* Brand logo tile - fill the hex */
            <div style={{
              width: tileSize,
              height: tileSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              background: isActive
                ? `radial-gradient(circle, ${color}18, transparent)`
                : "none",
              borderRadius: "50%",
            }}>
              <img
                src={logoSrc}
                alt={brandLogo}
                style={{
                  height: 55,
                  maxWidth: 85,
                  objectFit: "contain",
                  filter: isActive ? activeFilter : inactiveFilter,
                }}
              />
              <span style={{
                fontSize: 7,
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                color: isActive ? "#2d2a26" : "#6b6560",
                letterSpacing: "0.06em",
                textShadow: "0 1px 2px rgba(255,255,255,0.9)",
              }}>
                {label}
              </span>
            </div>
          ) : (
            /* Emoji icon tile - large icon */
            <div style={{
              width: tileSize,
              height: tileSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              borderRadius: "50%",
            }}>
              <span style={{
                fontSize: 42,
                lineHeight: 1,
                filter: isActive ? activeFilter : inactiveFilter,
              }}>
                {icon}
              </span>
              <span style={{
                fontSize: 8,
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                color: isActive ? "#2d2a26" : "#6b6560",
                letterSpacing: "0.06em",
                textShadow: "0 1px 2px rgba(255,255,255,0.9)",
              }}>
                {label}
              </span>
            </div>
          )}
        </div>
      </Html>

      {isActive && (
        <pointLight color={color} intensity={2} distance={4} position={[0, 1.5, 0]} />
      )}
    </group>
  );
};

export default HexTile;
