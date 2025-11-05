import type { Area, Level, Model } from '../types/model';

export const MODELS: Model[] = ['female', 'male'];

export const LEVELS: Level[] = ['good', 'neutral', 'bad'];

export const AREAS: Area[] = [
  'liver',
  'kidney',
  'metabolic',
  'heart',
  'brain',
  'inflammation',
  'gut',
  'nutrients',
  'body',
  'toxic',
  'skin',
  'sleep',
  'energy',
  'dna',
  'immune',
  'thyroid',
  'sex',
];

export const SCENES = {
  body: {
    glow: true,
  },
  toxic: {
    blurAmount: 0.0019,
  },
  sleep: {
    blurAmount: 0.00075,
  },
  energy: {
    glow: true,
  },
  dna: {
    glow: true,
  },
};

export const COLORS = {
  good: '#baf0c5',
  neutral: '#d7db0e',
  bad: '#ff68de',
};
