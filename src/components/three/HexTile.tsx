import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { brandLogos, chapterImages, careerLogos } from "@/data/brandLogos";
import TileSurface, { CareerSplitSurface } from "./TileSurface";

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
          color={isActive ? "#faf5ee" : isVisited ? "#ede8df" : "#f0ebe3"}
          roughness={isActive ? 0.35 : 0.7}
          metalness={isActive ? 0.08 : 0.02}
          emissive={isActive ? color : "#000000"}
          emissiveIntensity={isActive ? 0.1 : 0}
        />

        {/* 3D texture surfaces — rendered as children of the hex mesh so they move/scale together */}
        <Suspense fallback={null}>
          {isCareer ? (
            <CareerSplitSurface
              leftUrl={careerLogos.RBC}
              rightUrl={careerLogos.BMO}
              isActive={isActive}
            />
          ) : imageSrc ? (
            <TileSurface textureUrl={imageSrc} isActive={isActive} size={0.55} />
          ) : logoSrc ? (
            <TileSurface textureUrl={logoSrc} isActive={isActive} size={0.45} />
          ) : null}
        </Suspense>
      </mesh>

      {/* Active highlight light */}
      {isActive && (
        <pointLight color={color} intensity={3} distance={5} position={[0, 1.8, 0]} />
      )}
    </group>
  );
};

export default HexTile;
