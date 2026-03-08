import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

/**
 * Renders a logo/image as a texture mapped onto a circular disc
 * that sits flush on top of the hex tile — looks physically carved/engraved.
 */
const TileSurface = ({
  textureUrl,
  isActive,
  size = 0.55,
}: {
  textureUrl: string;
  isActive: boolean;
  size?: number;
}) => {
  const texture = useTexture(textureUrl);

  useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.165, 0]}>
      <circleGeometry args={[size, 48]} />
      <meshStandardMaterial
        map={texture}
        transparent
        roughness={isActive ? 0.45 : 0.85}
        metalness={isActive ? 0.1 : 0.03}
        color={isActive ? "#e8e0d4" : "#d5cfc5"}
        toneMapped
      />
    </mesh>
  );
};

/**
 * Career tile: two half-disc textures side by side (RBC | BMO).
 */
export const CareerSplitSurface = ({
  leftUrl,
  rightUrl,
  isActive,
}: {
  leftUrl: string;
  rightUrl: string;
  isActive: boolean;
}) => {
  const leftTex = useTexture(leftUrl);
  const rightTex = useTexture(rightUrl);

  useMemo(() => {
    [leftTex, rightTex].forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [leftTex, rightTex]);

  // Two circles side by side, slightly offset
  return (
    <group position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Left logo - RBC */}
      <mesh position={[-0.28, 0, 0]}>
        <circleGeometry args={[0.32, 48]} />
        <meshStandardMaterial
          map={leftTex}
          transparent
          roughness={isActive ? 0.45 : 0.85}
          metalness={isActive ? 0.1 : 0.03}
          color={isActive ? "#e8e0d4" : "#d5cfc5"}
          toneMapped
        />
      </mesh>
      {/* Divider groove */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[0.02, 0.8]} />
        <meshStandardMaterial color="#b0a898" roughness={1} metalness={0} transparent opacity={0.3} />
      </mesh>
      {/* Right logo - BMO */}
      <mesh position={[0.28, 0, 0]}>
        <circleGeometry args={[0.32, 48]} />
        <meshStandardMaterial
          map={rightTex}
          transparent
          roughness={isActive ? 0.45 : 0.85}
          metalness={isActive ? 0.1 : 0.03}
          color={isActive ? "#e8e0d4" : "#d5cfc5"}
          toneMapped
        />
      </mesh>
    </group>
  );
};

export default TileSurface;
