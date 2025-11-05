import { useMemo, useEffect } from 'react';
import {
  MeshBasicMaterial,
  BackSide,
  Mesh,
  type Group,
  type Object3DEventMap,
} from 'three';

import { SCENES, COLORS } from '../../const/constants';
import type { Area, Level } from '../../types';
import {
  createTweenValue,
  createColorTween,
} from '../../utils/create-tween-values';

export const AvatarClone = ({
  area,
  level = 'good',
  object,
  layers,
}: {
  area?: Area;
  level?: Level;
  object: Group<Object3DEventMap>;
  layers: number;
}) => {
  const maxGlow = 0.9;
  const opacity =
    maxGlow * (!!level && !!area && (SCENES as any)?.[area]?.glow ? 1 : 0);

  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        side: BackSide,
        transparent: true,
        opacity: opacity,
        color: level && COLORS[level],
        depthWrite: false,
      }),
    [],
  );

  object.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      mesh.layers.set(layers);
      mesh.material = material;
    }
  });

  const { setTarget } = useMemo(
    () =>
      createColorTween((level && COLORS[level]) || '#ffffff', (color) => {
        material?.color.set(color);
      }),
    [],
  );

  const materalTween = createTweenValue(material.opacity, {
    duration: 1.5,
    onStart: () => {},
    onUpdate: (value) => {
      !!material && (material.opacity = maxGlow * value);
    },
    onComplete: () => {},
  });

  useEffect(() => {
    if (level && Object.keys(COLORS).includes(level)) {
      setTarget(COLORS[level]);
    }

    materalTween.set(
      !!level && !!area && (SCENES as any)?.[area]?.glow ? 1 : 0,
    );
  }, [area, level]);

  return <primitive object={object} scale={[1, 1, 1]} />;
};
