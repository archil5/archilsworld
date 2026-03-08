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
 * Standalone textured plane rendered as a SIBLING of the hex mesh (not a child).
 * Positioned in world space just above the hex tile top face.
 * rotation={[-Math.PI/2, 0, 0]} makes it face upward toward the camera.
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
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.17, 0]}
      renderOrder={10}
    >
      <planeGeometry args={[size * 2, size * 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={isActive ? 1 : 0.82}
        toneMapped={false}
        depthWrite={false}
        side={THREE.DoubleSide}
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

  const opacity = isActive ? 1 : 0.82;

  return (
    <group position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[-0.26, 0, 0]} renderOrder={10}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={leftTex} transparent opacity={opacity} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.26, 0, 0]} renderOrder={10}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={rightTex} transparent opacity={opacity} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.001]} renderOrder={11}>
        <planeGeometry args={[0.02, 0.7]} />
        <meshBasicMaterial color="#b0a898" transparent opacity={0.4} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default TileSurface;
