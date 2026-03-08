import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HexTile = ({
  position,
  color,
  isActive,
  isVisited,
  onClick,
  index,
}: {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  isVisited: boolean;
  onClick: () => void;
  index: number;
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

    // Floating animation
    const floatY = baseY + Math.sin(t * 0.8 + index * 0.5) * 0.05;
    meshRef.current.position.y = isActive ? baseY + 0.4 : floatY;

    // Scale pulse when active
    const s = isActive ? 1.15 + Math.sin(t * 3) * 0.03 : 1;
    meshRef.current.scale.setScalar(s);

    // Glow
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive ? 0.4 + Math.sin(t * 4) * 0.15 : isVisited ? 0.1 : 0.0;
    }

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = isActive ? 0.6 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Glow disc underneath */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      {/* Active ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <ringGeometry args={[0.85, 0.95, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Main hex tile */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[hexShape, extrudeSettings]} />
        <meshStandardMaterial
          color={isActive ? color : isVisited ? "#1e3a5f" : "#152238"}
          roughness={isActive ? 0.2 : 0.5}
          metalness={isActive ? 0.5 : 0.1}
          emissive={isActive ? color : "#000000"}
          emissiveIntensity={isActive ? 0.4 : 0}
        />
      </mesh>

      {/* Point light when active */}
      {isActive && (
        <pointLight color={color} intensity={3} distance={4} position={[0, 1.5, 0]} />
      )}
    </group>
  );
};

export default HexTile;
