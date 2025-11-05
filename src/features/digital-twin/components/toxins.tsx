import { useRef, useEffect, useMemo, memo } from 'react';
import { Group, Vector3, MeshBasicMaterial } from 'three';

import { COLORS } from '../const/constants';
import type { Area, Level } from '../types';
import {
  createTweenValue,
  createColorTween,
} from '../utils/create-tween-values';

export const Toxins = memo(
  ({
    area,
    level = 'good',
    position,
    layers,
  }: {
    area?: Area;
    level?: Level;
    position: Vector3 | [number, number, number];
    layers: number;
  }) => {
    const toxinsRef = useRef<Group>(null);

    const toxinsLevel = !!level && area === 'toxic' ? 1 : 0;
    const toxinsScale = 0.97 + toxinsLevel * 0.03;

    const material = useMemo(
      () =>
        new MeshBasicMaterial({
          // Render the front faces so spheres appear solid
          transparent: true,
          opacity: toxinsLevel,
          color: level && COLORS[level],
          depthWrite: true,
        }),
      [],
    );

    const { setTarget } = useMemo(
      () =>
        createColorTween((level && COLORS[level]) || '#ffffff', (color) => {
          material?.color.set(color);
        }),
      [],
    );

    const toxinsTween = useMemo(
      () =>
        createTweenValue(toxinsLevel, {
          duration: 1,
          onStart: () => {
            toxinsRef.current && (toxinsRef.current.visible = true);
          },
          onUpdate: (value) => {
            const scale = 0.97 + value * 0.03;
            toxinsRef.current?.scale.set(scale, scale, scale);
            !!material && (material.opacity = value);
          },
          onComplete: () => {
            if (!material.opacity && toxinsRef.current) {
              toxinsRef.current.visible = false;
            }
          },
        }),
      [],
    );

    useEffect(() => {
      if (level && Object.keys(COLORS).includes(level)) {
        setTarget(COLORS[level]);
      }
      toxinsTween.set(!!level && area === 'toxic' ? 1 : 0);
    }, [area, level]);

    const SPHERES: {
      pos: [number, number, number]; // tuple of 3 numbers
      r: number;
    }[] = [
      { pos: [0.215, 0.48, 0.05], r: 0.007 },
      { pos: [0.175, 0.64, -0.05], r: 0.007 },
      { pos: [-0.1, 0.72, -0.05], r: 0.007 },
      { pos: [-0.215, 0.5735, 0.05], r: 0.007 },
      { pos: [-0.158, 0.445, -0.05], r: 0.007 },
      { pos: [0.181, 0.35, -0.05], r: 0.004 },
      { pos: [0.15, 0.55, 0], r: 0.004 },
      { pos: [0.115, 0.72, 0.05], r: 0.004 },
      { pos: [-0.1, 0.66, 0], r: 0.004 },
      { pos: [-0.198, 0.645, -0.05], r: 0.004 },
      { pos: [-0.205, 0.5025, -0.025], r: 0.004 },
      { pos: [-0.135, 0.535, 0.025], r: 0.004 },
      { pos: [-0.21, 0.35, 0], r: 0.004 },
    ];
    return (
      <group
        ref={toxinsRef}
        visible={!!toxinsLevel}
        scale={[toxinsScale, toxinsScale, toxinsScale]}
        position={position}
      >
        {SPHERES.map(({ pos, r }, i) => (
          <mesh
            key={i}
            visible
            layers={layers}
            position={pos}
            material={material}
          >
            <sphereGeometry args={[r, 16, 16]} />
          </mesh>
        ))}
      </group>
    );
  },
);

Toxins.displayName = 'Toxins';
