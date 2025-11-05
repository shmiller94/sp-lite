export type Model = 'male' | 'female';

export type Area =
  | 'liver'
  | 'kidney'
  | 'metabolic'
  | 'heart'
  | 'brain'
  | 'inflammation'
  | 'gut'
  | 'nutrients'
  | 'body'
  | 'toxic'
  | 'skin'
  | 'sleep'
  | 'energy'
  | 'dna'
  | 'immune'
  | 'thyroid'
  | 'sex';

export type Level = 'good' | 'neutral' | 'bad';

export type DigitalTwinProps = {
  model: Model;
  area?: Area;
  level?: Level;
  onLoadingStateChange?: (loaded: number) => void;
};
