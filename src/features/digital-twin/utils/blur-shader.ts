import { Vector2 } from 'three';

const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
export const horizontalBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new Vector2(1024, 1024) },
    blurAmount: { value: 1.0 }, // default blur multiplier
  },
  vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float blurAmount;
    varying vec2 vUv;

    void main() {
      float texelSize = 1.0 / resolution.x;
      float h = texelSize * blurAmount;

      // Precomputed Gaussian weights for radius = 6, sigma = 4.0
      float weights[13];
      weights[0] = 0.0044299121055113265;
      weights[1] = 0.017917231833464464;
      weights[2] = 0.04436833387182493;
      weights[3] = 0.08462628102525693;
      weights[4] = 0.12162147620340391;
      weights[5] = 0.15386991360858354;
      weights[6] = 0.1635724595829788;
      weights[7] = 0.15386991360858354;
      weights[8] = 0.12162147620340391;
      weights[9] = 0.08462628102525693;
      weights[10] = 0.04436833387182493;
      weights[11] = 0.017917231833464464;
      weights[12] = 0.0044299121055113265;

      vec4 sum = vec4(0.0);

      for (int i = -6; i <= 6; i++) {
        float weight = weights[i + 6];
        vec2 offset = vec2(float(i) * h, 0.0);
        sum += texture2D(tDiffuse, vUv + offset) * weight;
      }

      gl_FragColor = sum;
    }
  `,
};

export const verticalBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new Vector2(1024, 1024) },
    blurAmount: { value: 1.0 }, // default blur multiplier
  },
  vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float blurAmount;
    varying vec2 vUv;

    void main() {
      float texelSize = 1.0 / resolution.x;
      float v = texelSize * blurAmount;

      // Precomputed Gaussian weights for radius = 6, sigma = 4.0
      float weights[13];
      weights[0] = 0.0044299121055113265;
      weights[1] = 0.017917231833464464;
      weights[2] = 0.04436833387182493;
      weights[3] = 0.08462628102525693;
      weights[4] = 0.12162147620340391;
      weights[5] = 0.15386991360858354;
      weights[6] = 0.1635724595829788;
      weights[7] = 0.15386991360858354;
      weights[8] = 0.12162147620340391;
      weights[9] = 0.08462628102525693;
      weights[10] = 0.04436833387182493;
      weights[11] = 0.017917231833464464;
      weights[12] = 0.0044299121055113265;

      vec4 sum = vec4(0.0);

      for (int i = -6; i <= 6; i++) {
        float weight = weights[i + 6];
        vec2 offset = vec2(0.0, float(i) * v);
        sum += texture2D(tDiffuse, vUv + offset) * weight;
      }

      gl_FragColor = sum;
    }
  `,
};

export const useHorizontalBlurShader = () => {
  return horizontalBlurShader;
};

export const useVerticalBlurShader = () => {
  return verticalBlurShader;
};
