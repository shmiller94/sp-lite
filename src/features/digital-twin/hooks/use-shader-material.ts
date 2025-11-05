import { useEffect, useMemo } from 'react';

import type { Area, Level } from '../types/model';
import { createShaderMaterial } from '../utils/multi-texture-material/create-shader-material';
import { createShaderMaterialFader } from '../utils/multi-texture-material/create-shader-material-fader';

export const useShaderMaterial = ({
  textures,
  level,
  area,
}: {
  textures: any;
  area?: Area;
  level?: Level;
}) => {
  const shaderMaterial = useMemo(() => {
    if (!textures?.base) return null;
    return createShaderMaterial(textures.base);
  }, [textures]);

  const materialFader =
    shaderMaterial &&
    createShaderMaterialFader(shaderMaterial, {
      duration: 0.2,
    });

  // responding to area and level prop changes (without reloading model or mixer)
  useEffect(() => {
    if (materialFader && textures) {
      if (!!level && !!area && textures?.[area]?.[level]) {
        materialFader.setTexture(textures?.[area]?.[level]);
      } else if (textures.base) {
        materialFader.setTexture(textures.base);
      }
    }
  }, [area, level, textures, materialFader]);

  return shaderMaterial;
};
