/* eslint-disable @typescript-eslint/no-namespace */
import type { Object3DNode, ThreeElements } from '@react-three/fiber';
import type { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
    }
  }
}

export {};
