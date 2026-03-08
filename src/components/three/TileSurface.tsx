import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

const prepareTexture = (texture: THREE.Texture) => {
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
};

/**
 * Texture medallion placed on top of hex tile.
 * Rendered as sibling mesh in tile group (not child of extruded mesh).
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
    prepareTexture(texture);
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.165, 0]} renderOrder={4}>
      <circleGeometry args={[size, 64]} />
      <meshStandardMaterial
        map={texture}
        color="#ffffff"
        transparent
        roughness={isActive ? 0.35 : 0.7}
        metalness={isActive ? 0.08 : 0.02}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
      />
    </mesh>
  );
};

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
    prepareTexture(leftTex);
    prepareTexture(rightTex);
  }, [leftTex, rightTex]);

  return (
    <group position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4}>
      <mesh position={[-0.28, 0, 0]}>
        <circleGeometry args={[0.32, 64]} />
        <meshStandardMaterial
          map={leftTex}
          color="#ffffff"
          transparent
          roughness={isActive ? 0.35 : 0.7}
          metalness={isActive ? 0.08 : 0.02}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[0.02, 0.8]} />
        <meshStandardMaterial color="#b0a898" roughness={1} metalness={0} transparent opacity={0.35} />
      </mesh>

      <mesh position={[0.28, 0, 0]}>
        <circleGeometry args={[0.32, 64]} />
        <meshStandardMaterial
          map={rightTex}
          color="#ffffff"
          transparent
          roughness={isActive ? 0.35 : 0.7}
          metalness={isActive ? 0.08 : 0.02}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>
    </group>
  );
};

export default TileSurface;
