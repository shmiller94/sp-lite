import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { SCENES as _scenes } from '../const/constants';
import type { Area } from '../types';
import { horizontalBlurShader, verticalBlurShader } from '../utils/blur-shader';
import { createTweenValue } from '../utils/create-tween-values';

export const useBlurShader = ({ area }: { area?: Area }) => {
  const blurShader = useMemo(() => {
    return {
      horizontal: new ShaderPass(horizontalBlurShader),
      vertical: new ShaderPass(verticalBlurShader),
    };
  }, []);

  const { size } = useThree();

  const scenes: any = _scenes;

  const blurLevel = (!!area && scenes?.[area]?.blurAmount) || 0.0022;
  const blur = useMemo(
    () =>
      createTweenValue(blurLevel, {
        duration: 1,
        onStart: () => {},
        onUpdate: (value) => {
          const blurAmount = size.width * value;
          blurShader.horizontal.uniforms.blurAmount.value =
            blurAmount / (size.width / size.height);
          blurShader.vertical.uniforms.blurAmount.value = blurAmount;
        },
        onComplete: () => {},
      }),
    [],
  );

  useEffect(() => {
    const blurAmount = !!area && scenes?.[area]?.blurAmount;
    blur.set(typeof blurAmount === 'number' ? blurAmount : 0.0022);
  }, [area]);

  return blurShader;
};
