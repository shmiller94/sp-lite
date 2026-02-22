import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import {
  AnimationMixer,
  Camera,
  PerspectiveCamera,
  WebGLRenderTarget,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import type { Area } from '../types';

import { useBlurShader } from './use-blur-shader';

export const useRenderSetup = ({
  area,
  mixer,
}: {
  area?: Area;
  mixer: AnimationMixer;
}) => {
  const { gl, scene, camera, size } = useThree();
  const sizeRef = useRef({ width: size.width, height: size.height });

  const composer = useRef<EffectComposer | null>(null);
  const cameraShadows = useRef<Camera | null>(null);
  const cameraBackground = useRef<Camera | null>(null);
  const cameraForeground = useRef<Camera | null>(null);

  const blurShader = useBlurShader({ area });

  useEffect(() => {
    sizeRef.current.width = size.width;
    sizeRef.current.height = size.height;
  }, [size.width, size.height]);

  useEffect(() => {
    const { width, height } = sizeRef.current;
    const aspect = width / height;

    // camera for ground shadows (rendered separately from the blurred background scene)
    cameraShadows.current = camera;
    cameraShadows.current.layers.set(0);

    // camera for the model
    const foregroundCamera = camera.clone();
    foregroundCamera.layers.set(2);
    cameraForeground.current = foregroundCamera;

    // camera for blurred background scene
    const backgroundCamera = camera.clone();
    backgroundCamera.layers.set(1);
    cameraBackground.current = backgroundCamera;

    const rtWidth = Math.max(1, Math.floor(width / 1.5));
    const rtHeight = Math.max(1, Math.floor(height / 1.5));
    const nextComposer = new EffectComposer(
      gl,
      new WebGLRenderTarget(rtWidth, rtHeight),
    );
    // Blur is background-only: avoid HiDPI render targets.
    nextComposer.setPixelRatio(1);
    nextComposer.addPass(new RenderPass(scene, backgroundCamera));
    composer.current = nextComposer;

    const blurAmount = width * 0.0022;
    [blurShader.horizontal, blurShader.vertical].forEach((shader, i) => {
      shader.uniforms.resolution.value.set(width, height);
      shader.uniforms.blurAmount.value = !i ? blurAmount : blurAmount / aspect;
      nextComposer.addPass(shader);
    });

    return () => {
      if (composer.current === nextComposer) {
        composer.current = null;
      }
      nextComposer.dispose?.();
    };
  }, [blurShader.horizontal, blurShader.vertical, camera, gl, scene]);

  // Respond to resizes once, avoid work in the frame loop
  useEffect(() => {
    const { width, height } = size;
    const aspect = width / height;
    const blurAmount = size.width * 0.0022;

    [blurShader.horizontal, blurShader.vertical].forEach((shader, i) => {
      shader.uniforms.resolution.value.set(width, height);
      shader.uniforms.blurAmount.value = !i ? blurAmount : blurAmount / aspect;
    });
    const rtWidth = Math.max(1, Math.floor(size.width / 1.5));
    const rtHeight = Math.max(1, Math.floor(size.height / 1.5));
    composer.current?.setSize(rtWidth, rtHeight);

    // Keep cloned cameras in sync with the main camera's projection on resize
    const main = camera as PerspectiveCamera;
    [cameraBackground.current, cameraForeground.current].forEach((cam) => {
      if (!cam) return;
      const c = cam as PerspectiveCamera;
      c.fov = main.fov;
      c.aspect = main.aspect;
      c.near = main.near;
      c.far = main.far;
      c.updateProjectionMatrix();
    });
  }, [
    blurShader.horizontal,
    blurShader.vertical,
    camera,
    size.width,
    size.height,
  ]);

  useFrame((_, delta) => {
    // advancing animation every frame
    mixer.update(delta);

    // updating cloned camera positions
    [cameraBackground, cameraForeground].forEach((cam) => {
      cam.current?.position.copy(camera.position);
      cam.current?.quaternion.copy(camera.quaternion);
      cam.current?.updateMatrixWorld();
    });

    // render background scene
    composer.current?.render();

    // manually clearing depth for correct layer rendering
    gl.autoClear = false;
    gl.clearDepth();

    // render ground shadow and foreground scene
    [cameraShadows, cameraForeground].forEach((cam) => {
      cam.current && gl.render(scene, cam.current);
    });

    gl.autoClear = true;
  }, 1);

  return {
    composer,
    cameraShadows,
    cameraBackground,
    cameraForeground,
    blurShader,
  };
};
