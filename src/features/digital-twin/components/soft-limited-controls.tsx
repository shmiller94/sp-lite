import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { MathUtils } from 'three';
import { OrbitControls } from 'three-stdlib';

export const SoftLimitedOrbitControls = ({
  target,
}: {
  target: [number, number, number];
}) => {
  const controlsRef = useRef<OrbitControls | null>(null);

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const radiusRef = useRef(5);

  const maxAzimuth = MathUtils.degToRad(15);
  const recenterSpeed = 0.05;

  useEffect(() => {
    const controls: any = controlsRef.current;
    if (!controls) return;

    radiusRef.current = controls.getDistance();
  }, []);

  useFrame(() => {
    const controls: any = controlsRef.current;
    if (!controls) return;

    const radius = radiusRef.current;
    const polar = controls.getPolarAngle();
    const currentAzimuth = controls.getAzimuthalAngle();

    let targetAzimuth = currentAzimuth;

    if (!isUserInteracting) {
      targetAzimuth = MathUtils.lerp(currentAzimuth, 0, recenterSpeed);
    } else {
      if (currentAzimuth > maxAzimuth) {
        targetAzimuth = MathUtils.lerp(currentAzimuth, maxAzimuth, 0.2);
      } else if (currentAzimuth < -maxAzimuth) {
        targetAzimuth = MathUtils.lerp(currentAzimuth, -maxAzimuth, 0.2);
      }
    }

    const x = radius * Math.sin(polar) * Math.sin(targetAzimuth);
    const y = radius * Math.cos(polar);
    const z = radius * Math.sin(polar) * Math.cos(targetAzimuth);

    controls.object.position.set(x, y, z);
    controls.object.lookAt(controls.target);

    controls.update();
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      enablePan={false}
      enableZoom={false}
      target={target}
      dampingFactor={0.2}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      onStart={() => setIsUserInteracting(true)}
      onEnd={() => setIsUserInteracting(false)}
    />
  );
};
