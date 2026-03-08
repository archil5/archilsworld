import { useMemo } from "react";
import * as THREE from "three";

const BoardSurface = () => {
  const hexPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const size = 1.0;
    const h = size * Math.sqrt(3);
    for (let row = -5; row <= 5; row++) {
      for (let col = -8; col <= 15; col++) {
        const x = col * size * 1.5;
        const z = row * h + (col % 2 !== 0 ? h / 2 : 0);
        positions.push([x, -0.12, z]);
      }
    }
    return positions;
  }, []);

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const size = 0.48;
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

  return (
    <group>
      {/* Light warm ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.2, -1.5]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#f0ebe3" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Subtle hex grid pattern */}
      {hexPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <shapeGeometry args={[hexShape]} />
          <meshStandardMaterial
            color="#e8e0d4"
            roughness={0.9}
            metalness={0.0}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
};

export default BoardSurface;
