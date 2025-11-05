import gsap from 'gsap';
import { ShaderMaterial, Texture } from 'three';

type MultiTextureFaderOptions = {
  duration?: number;
  easing?: string;
};

type MultiTextureFader = {
  setTexture: (texture: Texture | null) => void;
  dispose: () => void;
};

export function createShaderMaterialFader(
  material: ShaderMaterial,
  options: MultiTextureFaderOptions = {},
): MultiTextureFader {
  const { duration = 1, easing = 'power2.out' } = options;

  const baseTexture = material.uniforms.baseMap.value;
  let currentTexture: Texture | null = material.uniforms.baseMap.value ?? null;
  let isFading = false;
  const queue: (Texture | null)[] = [];

  const setTexture = (texture: Texture | null) => {
    if (!baseTexture) texture = baseTexture;
    if (texture === currentTexture || queue.at(-1) === texture) return;
    queue.push(texture);
    if (!isFading) runNextFade();
  };

  const runNextFade = () => {
    const next = queue.shift();
    if (!next) return;

    isFading = true;

    material.uniforms.overlayFrom.value = currentTexture;
    material.uniforms.overlayTo.value = next;
    material.uniforms.alpha.value = 0;

    gsap.to(material.uniforms.alpha, {
      value: 1,
      duration,
      ease: easing,
      onUpdate: () => {
        material.needsUpdate = true;
      },
      onComplete: () => {
        currentTexture = next;
        material.uniforms.baseMap.value = next;
        material.uniforms.overlayFrom.value = null;
        material.uniforms.overlayTo.value = null;
        material.uniforms.alpha.value = 0;
        material.needsUpdate = true;

        isFading = false;
        if (queue.length > 0) runNextFade();
      },
    });
  };

  return {
    setTexture,
    dispose: () => {
      queue.length = 0;
      gsap.killTweensOf(material.uniforms.alpha);
    },
  };
}
