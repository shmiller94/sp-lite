export type BioAgeParams = {
  [name: string]: {
    unit: string;
    databaseUnit: string;
    calculateCoefficient: (number: number) => number;
  };
};
