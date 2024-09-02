export const mortalityScore = (summedCoefficients: number): number => {
  // =1-EXP(-EXP(B17)*(EXP(B14*D13)-1)/B14)

  // Cell b14
  const g = 0.0076927;

  // Cell d13
  const months = 120;
  return (
    1 -
    Math.exp(-(Math.exp(summedCoefficients) * (Math.exp(g * months) - 1)) / g)
  );
};
