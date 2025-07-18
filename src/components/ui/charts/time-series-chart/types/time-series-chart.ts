export interface DataPoint {
  x: number;
  y: number;
  value: number;
  timestamp: string;
  status: string;
  id: string;
}

export interface TimeScale {
  type: 'years' | 'months' | 'weeks' | 'days';
  interval: number;
  format: (date: Date) => string;
}

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  key: string;
  strokeDasharray?: string;
}

export interface YAxisLabel {
  value: number;
  label: string;
  x: number;
  y: number;
  key: string;
}

export interface XAxisLabel {
  label: string;
  x: number;
  y: number;
  key: string;
}
