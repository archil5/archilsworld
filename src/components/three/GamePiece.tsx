import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GamePiece = ({ targetPosition }: { targetPosition: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...targetPosition));
  const targetVec = new THREE.Vector3();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    targetVec.set(...targetPosition);
    currentPos.current.lerp(targetVec, 0.04);

    groupRef.current.position.copy(currentPos.current);
    groupRef.current.position.y = currentPos.current.y + 0.6 + Math.sin(t * 2) * 0.1;
    groupRef.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#d4883a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4883a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Point light on piece */}
      <pointLight color="#e8c460" intensity={2} distance={3} position={[0, 0.5, 0]} />
    </group>
  );
};

export default GamePiece;
