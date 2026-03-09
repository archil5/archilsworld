import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 200 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 6 + 0.5,
      z: (Math.random() - 0.5) * 15,
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.03 + 0.01,
    }))
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.current.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.5,
        p.y + Math.sin(t * p.speed * 0.7 + p.offset) * 0.8,
        p.z + Math.cos(t * p.speed + p.offset) * 0.3
      );
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + p.offset) * 0.3));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} raycast={() => null}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#c8956c" transparent opacity={0.35} />
    </instancedMesh>
  );
};

export default Particles;
