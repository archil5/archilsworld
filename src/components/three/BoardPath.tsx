import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { ChapterData } from "@/data/chapters";

const BoardPath = ({ chapters }: { chapters: ChapterData[] }) => {
  const points = useMemo(() => {
    const pts = chapters.map((c) => new THREE.Vector3(...c.position));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    return curve.getPoints(100).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [chapters]);

  return (
    <Line
      points={points}
      color="#c9a96e"
      lineWidth={1.5}
      transparent
      opacity={0.3}
    />
  );
};

export default BoardPath;
