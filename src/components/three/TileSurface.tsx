import { Decal, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

const usePreparedTexture = (textureUrl: string) => {
  const texture = useTexture(textureUrl);

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
 * Reliable logo surface: projects as decal + visible top inlay plane fallback.
 * Render this INSIDE the hex mesh (local Z is tile depth).
 */
const TileSurface = ({
  textureUrl,
  isActive,
  size = 0.72,
}: {
  textureUrl: string;
  isActive: boolean;
  size?: number;
}) => {
  const texture = usePreparedTexture(textureUrl);

  return (
    <group>
      <Decal position={[0, 0, 0.145]} scale={[size, size, size]}>
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={isActive ? 0.35 : 0.75}
          metalness={isActive ? 0.08 : 0.02}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </Decal>

      {/* Inlay plate fallback (guarantees visibility) */}
      <mesh position={[0, 0, 0.158]} renderOrder={10}>
        <circleGeometry args={[size * 0.47, 64]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.96}
          toneMapped={false}
          depthTest
          depthWrite={false}
        />
      </mesh>
    </group>
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
    <group>
      <Decal position={[0, 0, 0.145]} scale={[0.88, 0.88, 0.88]}>
        <meshStandardMaterial
          color="#dfd7cb"
          roughness={isActive ? 0.35 : 0.75}
          metalness={isActive ? 0.08 : 0.02}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </Decal>

      {/* Left half (RBC) */}
      <mesh position={[-0.26, 0, 0.158]} renderOrder={11}>
        <circleGeometry args={[0.29, 64]} />
        <meshBasicMaterial map={leftTex} transparent opacity={0.96} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* Right half (BMO) */}
      <mesh position={[0.26, 0, 0.158]} renderOrder={11}>
        <circleGeometry args={[0.29, 64]} />
        <meshBasicMaterial map={rightTex} transparent opacity={0.96} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, 0.159]} renderOrder={12}>
        <planeGeometry args={[0.02, 0.72]} />
        <meshBasicMaterial color="#b0a898" transparent opacity={0.45} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default TileSurface;
