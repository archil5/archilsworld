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

  const tileSize = 140;

  return (
    <group position={position}>
      {/* Glow underneath */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      {/* Spinning hex ring for active */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
        <ringGeometry args={[0.85, 0.95, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Hex tile mesh */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[hexShape, extrudeSettings]} />
        <meshStandardMaterial
          color={isActive ? "#ffffff" : isVisited ? "#ede8df" : "#f5f0e8"}
          roughness={isActive ? 0.2 : 0.6}
          metalness={isActive ? 0.15 : 0.05}
          emissive={isActive ? color : "#000000"}
          emissiveIntensity={isActive ? 0.15 : 0}
        />
      </mesh>

      {/* HTML overlay covering full tile */}
      <Html
        position={[0, isActive ? 0.6 : 0.22, 0]}
        center
        distanceFactor={5.5}
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
            <div style={{
              width: tileSize,
              height: tileSize,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                src={imageSrc}
                alt={label}
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                  filter: isActive ? "drop-shadow(0 0 8px rgba(0,0,0,0.15))" : "none",
                }}
              />
            </div>
          ) : isCareer ? (
            <div style={{
              width: tileSize,
              height: tileSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}>
              <img src={careerLogos.RBC} alt="RBC" style={{ height: 65, objectFit: "contain" }} />
              <img src={careerLogos.BMO} alt="BMO" style={{ height: 65, objectFit: "contain" }} />
            </div>
          ) : logoSrc ? (
            <div style={{
              width: tileSize,
              height: tileSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              background: isActive
                ? `radial-gradient(circle, ${color}22, transparent)`
                : "none",
              borderRadius: "50%",
              border: isActive ? `2px solid ${color}40` : "none",
              boxShadow: isActive ? `0 0 16px ${color}30` : "none",
            }}>
              <img
                src={logoSrc}
                alt={brandLogo}
                style={{
                  height: 80,
                  maxWidth: 110,
                  objectFit: "contain",
                }}
              />
              <span style={{
                fontSize: 8,
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                color: "#2d2a26",
                letterSpacing: "0.08em",
                textShadow: "0 1px 2px rgba(255,255,255,0.9)",
              }}>
                {label}
              </span>
            </div>
          ) : (
            <div style={{
              width: tileSize,
              height: tileSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              borderRadius: "50%",
            }}>
              <span style={{
                fontSize: 48,
                lineHeight: 1,
              }}>
                {icon}
              </span>
              <span style={{
                fontSize: 9,
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                color: "#2d2a26",
                letterSpacing: "0.08em",
                textShadow: "0 1px 2px rgba(255,255,255,0.9)",
              }}>
                {label}
              </span>
            </div>
          )}
        </div>
      </Html>

      {/* Active highlight light */}
      {isActive && (
        <pointLight color={color} intensity={3} distance={5} position={[0, 1.8, 0]} />
      )}
    </group>
  );
};

export default HexTile;
