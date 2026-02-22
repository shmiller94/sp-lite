import type { ThreeElement } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: ThreeElement<typeof TextGeometry>;
  }
}
