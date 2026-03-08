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
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#b5653a" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#b5653a" roughness={0.3} metalness={0.5} />
      </mesh>
      <pointLight color="#d4a574" intensity={1.5} distance={3} position={[0, 0.5, 0]} />
    </group>
  );
};

export default GamePiece;
