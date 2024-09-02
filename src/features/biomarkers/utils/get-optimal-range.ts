export const getOptimalRange = (row: any): string => {
  const range = row.original.range;
  const optimalRange = range.find((r: any) => r.status === 'OPTIMAL');

  if (!optimalRange) {
    console.error(`No optimal range found for ${row.original.name}`);
  }

  return optimalRange.low && optimalRange.high
    ? `${optimalRange.low.value} - ${optimalRange.high.value}`
    : !optimalRange.low && optimalRange.high
      ? `< ${optimalRange.high.value}`
      : optimalRange.low && !optimalRange.high
        ? `> ${optimalRange.low.value}`
        : '';
};
