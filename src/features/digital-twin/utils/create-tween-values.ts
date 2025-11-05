import gsap from 'gsap';
import { Color } from 'three';

export const createTweenValue = (
  initial = 0,
  options?: {
    duration?: number;
    ease?: string;
    onUpdate?: (v: number) => void;
    onStart?: () => void;
    onComplete?: () => void;
  },
) => {
  const ref = { value: initial };
  let tween: gsap.core.Tween | null = null;
  let lastTarget = initial;

  const set = (target: number) => {
    if (target === lastTarget) return;
    lastTarget = target;

    if (tween) tween.kill();

    tween = gsap.to(ref, {
      value: target,
      duration: options?.duration ?? 1.5,
      ease: options?.ease ?? 'power2.out',
      onStart: () => options?.onStart?.(),
      onUpdate: () => options?.onUpdate?.(ref.value),
      onComplete: () => options?.onComplete?.(),
    });
  };

  const get = () => ref.value;

  return { get, set };
};

export const createColorTween = (
  initial: Color | string,
  onUpdate: (color: Color) => void,
) => {
  const current = new Color(initial);
  const target = { r: current.r, g: current.g, b: current.b };
  let tween: gsap.core.Tween | null = null;

  const setTarget = (
    newColor: Color | string,
    options: {
      duration?: number;
      ease?: string;
      onComplete?: () => void;
    } = {},
  ) => {
    const next = new Color(newColor);

    if (current.equals(next)) return;

    tween?.kill();

    tween = gsap.to(target, {
      r: next.r,
      g: next.g,
      b: next.b,
      duration: options.duration ?? 1.5,
      ease: options.ease ?? 'power2.out',
      onUpdate: () => {
        current.setRGB(target.r, target.g, target.b);
        onUpdate(current);
      },
      onComplete: options.onComplete,
    });
  };

  return {
    current,
    setTarget,
  };
};
