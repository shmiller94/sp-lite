import { Biomarker, BiomarkerStatus } from '@/types/api';

export interface MergedSegment {
  status: BiomarkerStatus;
  color: string;
  startIndex: number;
  endIndex: number;
  count: number;
}

export interface SegmentData {
  biomarker: Biomarker;
  index: number;
  startAngle: number;
  endAngle: number;
  normalPath: string;
  expandedPath: string;
  touchAreaPath: string;
  color: string;
  status: BiomarkerStatus;
}

export interface SegmentPath {
  key: string;
  path: string;
  fill: string;
  stroke: string;
}
