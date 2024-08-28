export const formatMoney = (
  amount: number,
  decimalPlaces: number = 0,
): string => {
  return (
    '$' +
    (amount / 100)
      .toFixed(decimalPlaces)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
};
