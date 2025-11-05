import { useEffect, useState } from 'react';
import { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const useGLTFModel = (url: string) => {
  const [scene, setScene] = useState<Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      setScene(gltf.scene);
    });
  }, [url]);

  return scene;
};
