export const phenotypicalAge = (mortScore: number): number => {
  // =141.50225+LN(-0.00553*LN(1-C17))/0.090165
  return 141.50225 + Math.log(-0.00553 * Math.log(1 - mortScore)) / 0.090165;
};
