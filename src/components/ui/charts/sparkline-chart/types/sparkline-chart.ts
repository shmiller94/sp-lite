export interface LineSegment {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'inherit' | 'butt' | 'round' | 'square';
  opacity?: number;
}

export interface Circle {
  key: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export interface Pill {
  key: string;
  x: number;
  yTop: number;
  height: number;
  width: number;
  color: string;
  pointIndex: number;
}

export interface RangeBackgroundBounds {
  top: number;
  bottom: number;
}
