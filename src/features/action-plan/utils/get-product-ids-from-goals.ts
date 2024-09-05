// Helper function to extract product IDs from goalItems
export const getProductIdsFromGoals = (
  goalItems: { itemType: string; itemId: string }[],
) => {
  return goalItems
    .filter((item) => item.itemType === 'PRODUCT')
    .map((item) => item.itemId);
};
