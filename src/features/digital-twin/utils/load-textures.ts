import {
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';

import type { Model } from '../types';

// Small idle helper to yield to the main thread between batches
const requestIdle = (cb: () => void) => {
  const anyWindow: any = globalThis as any;
  if (typeof anyWindow.requestIdleCallback === 'function') {
    anyWindow.requestIdleCallback(cb, { timeout: 300 });
  } else {
    setTimeout(cb, 0);
  }
};

// Load only the base texture quickly so we can render something fast
export const loadBaseTexture = async ({
  model,
  gl,
  onLoadingStateChange,
}: {
  model: Model;
  gl?: WebGLRenderer;
  onLoadingStateChange?: (loaded: number) => void;
}) => {
  // Files in Vite's public folder are served from the root
  const pathFromPublic = (file: string) => `/models/${model}/textures/${file}`;
  const loader = sharedTextureLoader;
  const texture = await loader.loadAsync(pathFromPublic('base.jpg'));
  texture.flipY = false;
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  // Pre-upload only the base texture for a quick first paint
  gl?.initTexture?.(texture);
  onLoadingStateChange?.(1);
  return { base: texture } as const;
};

// Load the remaining textures in small batches to avoid long main-thread stalls
export const loadRemainingTextures = async ({
  model,
  alreadyLoaded = 1,
  onLoadingStateChange,
}: {
  model: Model;
  alreadyLoaded?: number; // for consistent progress reporting
  onLoadingStateChange?: (loaded: number) => void;
}) => {
  let loaded = alreadyLoaded;

  const pathFromPublic = (file: string) => `/models/${model}/textures/${file}`;
  const loader = sharedTextureLoader;

  const loadTexture = async (file: string) => {
    const texture = await loader.loadAsync(pathFromPublic(file));
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    // Avoid pre-uploading every texture to the GPU up-front
    // to reduce first-load jank. They will upload on first use.
    // gl?.initTexture?.(texture);
    loaded++;
    onLoadingStateChange?.(loaded);
    return texture;
  };

  // The list of remaining textures (base is loaded separately)
  const files = [
    'liver_good.jpg',
    'liver_neutral.jpg',
    'liver_bad.jpg',
    'kidney_good.jpg',
    'kidney_neutral.jpg',
    'kidney_bad.jpg',
    'metabolic_good.jpg',
    'metabolic_neutral.jpg',
    'metabolic_bad.jpg',
    'heart_good.jpg',
    'heart_neutral.jpg',
    'heart_bad.jpg',
    'brain_good.jpg',
    'brain_neutral.jpg',
    'brain_bad.jpg',
    'inflammation_good.jpg',
    'inflammation_neutral.jpg',
    'inflammation_bad.jpg',
    'gut_good.jpg',
    'gut_neutral.jpg',
    'gut_bad.jpg',
    'nutrients_good.jpg',
    'nutrients_neutral.jpg',
    'nutrients_bad.jpg',
    'body_good.jpg',
    'body_neutral.jpg',
    'body_bad.jpg',
    'skin_good.jpg',
    'skin_neutral.jpg',
    'skin_bad.jpg',
    'dna_good.jpg',
    'dna_neutral.jpg',
    'dna_bad.jpg',
    'immune_good.jpg',
    'immune_neutral.jpg',
    'immune_bad.jpg',
    'thyroid_good.jpg',
    'thyroid_neutral.jpg',
    'thyroid_bad.jpg',
    'sex_good.jpg',
    'sex_neutral.jpg',
    'sex_bad.jpg',
  ];

  // Load in batches to give the main thread breathers
  const batchSize = 4;
  const results: Record<string, any> = {};

  for (let i = 0; i < files.length; i += batchSize) {
    // Yield before each batch to let the browser process input/layout
    await new Promise<void>((resolve) => requestIdle(() => resolve()));
    const batch = files.slice(i, i + batchSize);
    const textures = await Promise.all(batch.map(loadTexture));
    batch.forEach((file, idx) => {
      results[file] = textures[idx];
    });
  }

  // Map the flat results to the structured object
  return {
    liver: {
      good: results['liver_good.jpg'],
      neutral: results['liver_neutral.jpg'],
      bad: results['liver_bad.jpg'],
    },
    kidney: {
      good: results['kidney_good.jpg'],
      neutral: results['kidney_neutral.jpg'],
      bad: results['kidney_bad.jpg'],
    },
    metabolic: {
      good: results['metabolic_good.jpg'],
      neutral: results['metabolic_neutral.jpg'],
      bad: results['metabolic_bad.jpg'],
    },
    heart: {
      good: results['heart_good.jpg'],
      neutral: results['heart_neutral.jpg'],
      bad: results['heart_bad.jpg'],
    },
    brain: {
      good: results['brain_good.jpg'],
      neutral: results['brain_neutral.jpg'],
      bad: results['brain_bad.jpg'],
    },
    inflammation: {
      good: results['inflammation_good.jpg'],
      neutral: results['inflammation_neutral.jpg'],
      bad: results['inflammation_bad.jpg'],
    },
    gut: {
      good: results['gut_good.jpg'],
      neutral: results['gut_neutral.jpg'],
      bad: results['gut_bad.jpg'],
    },
    nutrients: {
      good: results['nutrients_good.jpg'],
      neutral: results['nutrients_neutral.jpg'],
      bad: results['nutrients_bad.jpg'],
    },
    body: {
      good: results['body_good.jpg'],
      neutral: results['body_neutral.jpg'],
      bad: results['body_bad.jpg'],
    },
    skin: {
      good: results['skin_good.jpg'],
      neutral: results['skin_neutral.jpg'],
      bad: results['skin_bad.jpg'],
    },
    dna: {
      good: results['dna_good.jpg'],
      neutral: results['dna_neutral.jpg'],
      bad: results['dna_bad.jpg'],
    },
    immune: {
      good: results['immune_good.jpg'],
      neutral: results['immune_neutral.jpg'],
      bad: results['immune_bad.jpg'],
    },
    thyroid: {
      good: results['thyroid_good.jpg'],
      neutral: results['thyroid_neutral.jpg'],
      bad: results['thyroid_bad.jpg'],
    },
    sex: {
      good: results['sex_good.jpg'],
      neutral: results['sex_neutral.jpg'],
      bad: results['sex_bad.jpg'],
    },
  };
};

// Backward-compatible full loader (kept in case of future uses)
export const loadTextures = async (args: {
  model: Model;
  gl?: WebGLRenderer;
  onLoadingStateChange?: (loaded: number) => void;
}) => {
  const base = await loadBaseTexture(args);
  const rest = await loadRemainingTextures({
    ...args,
    alreadyLoaded: 1,
  });
  return { ...base, ...rest } as any;
};

// module-scoped shared loader to benefit from caching and avoid re-instantiation
const sharedTextureLoader = new TextureLoader();
