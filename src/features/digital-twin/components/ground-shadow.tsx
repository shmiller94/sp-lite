import { ContactShadows } from '@react-three/drei';

// simple mesh to cast the shadow

export const GroundShadow = () => (
  <group>
    <mesh position={[0, 1, 0]} layers={0} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.1, 24]} />
      <meshStandardMaterial transparent={true} opacity={0} />
    </mesh>

    <ContactShadows
      opacity={0.12}
      scale={1.5}
      blur={2}
      resolution={128}
      frames={1}
      color="#000000"
    />
  </group>
);
