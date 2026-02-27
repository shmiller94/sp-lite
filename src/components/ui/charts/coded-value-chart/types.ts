// Geometry types for the coded-value detail chart (biomarker dialog).
// Coded-value biomarkers have discrete text values (e.g. "clear", "cloudy")
// rather than numeric quantities, so they use horizontal bands instead of a Y-axis.

export interface CodedDataPoint {
  x: number;
  y: number;
  codedValue: string;
  timestamp: string;
  status: 'optimal' | 'abnormal';
  id: string;
}

export interface CodedLineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  key: string;
  strokeDasharray?: string;
}

export interface CodedYAxisBand {
  code: string;
  y: number;
  bandTop: number;
  bandBottom: number;
  isOptimal: boolean;
}

export interface CodedXAxisLabel {
  label: string;
  x: number;
  y: number;
  key: string;
}
