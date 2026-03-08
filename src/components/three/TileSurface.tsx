import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

const usePreparedTexture = (url: string) => {
  const texture = useTexture(url);
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);
  return texture;
};

/**
 * Simple textured circle placed just above the hex extrusion top face.
 * Parent mesh is rotated -PI/2 around X, so local Z = world Y (up).
 * Extrude depth is 0.15, so z=0.16 sits flush on top.
 */
const TileSurface = ({
  textureUrl,
  isActive,
  size = 0.5,
}: {
  textureUrl: string;
  isActive: boolean;
  size?: number;
}) => {
  const texture = usePreparedTexture(textureUrl);

  return (
    <mesh position={[0, 0, 0.16]} renderOrder={10}>
      <planeGeometry args={[size * 2, size * 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={isActive ? 1 : 0.85}
        toneMapped={false}
        depthWrite={false}
        side={THREE.FrontSide}
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
  const leftTex = usePreparedTexture(leftUrl);
  const rightTex = usePreparedTexture(rightUrl);

  return (
    <group position={[0, 0, 0.16]}>
      <mesh position={[-0.26, 0, 0]} renderOrder={10}>
        <planeGeometry args={[0.52, 0.52]} />
        <meshBasicMaterial map={leftTex} transparent opacity={isActive ? 1 : 0.85} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0.26, 0, 0]} renderOrder={10}>
        <planeGeometry args={[0.52, 0.52]} />
        <meshBasicMaterial map={rightTex} transparent opacity={isActive ? 1 : 0.85} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.001]} renderOrder={11}>
        <planeGeometry args={[0.02, 0.7]} />
        <meshBasicMaterial color="#b0a898" transparent opacity={0.4} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default TileSurface;
