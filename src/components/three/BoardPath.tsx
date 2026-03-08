import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ChapterData } from "@/data/chapters";

const BoardPath = ({ chapters }: { chapters: ChapterData[] }) => {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const pts = chapters.map((c) => new THREE.Vector3(...c.position));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    return curve.getPoints(100);
  }, [chapters]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial color="#c9a96e" transparent opacity={0.3} linewidth={1} />
    </line>
  );
};

export default BoardPath;
