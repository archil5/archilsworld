import { useRef, useCallback, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS } from "@/data/chapters";

interface CameraControllerProps {
  scrollProgress: number;
  activeIndex: number;
}

const CameraController = ({ scrollProgress, activeIndex }: CameraControllerProps) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 8, 8));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const cameraPath = useMemo(() => {
    const pts = CHAPTERS.map((c) => {
      return new THREE.Vector3(c.position[0], 5.5, c.position[2] + 6);
    });
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  }, []);

  const lookAtPath = useMemo(() => {
    const pts = CHAPTERS.map((c) => new THREE.Vector3(...c.position));
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  }, []);

  useFrame(() => {
    const t = Math.max(0, Math.min(1, scrollProgress));

    const targetPos = cameraPath.getPoint(t);
    const targetLookAt = lookAtPath.getPoint(t);

    currentPos.current.lerp(targetPos, 0.06);
    currentLookAt.current.lerp(targetLookAt, 0.06);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CameraController;
