export const estimateDNAmAge = (phenoAge: number): number => {
  // =D17/(1+1.28047*EXP(0.0344329*(-182.344+D17)))
  return phenoAge / (1 + 1.28047 * Math.exp(0.0344329 * (-182.344 + phenoAge)));
};
