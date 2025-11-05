import { useRiveFile } from '@rive-app/react-canvas-lite';

export function useAnimations() {
  const { riveFile, status } = useRiveFile({
    src: '/animations/superpower_animations.riv',
  });

  return { riveFile, status };
}
