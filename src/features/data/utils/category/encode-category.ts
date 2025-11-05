// Function to make the category url friendly - used in more than one place.
export const encodeCategory = (category: string) => {
  return encodeURIComponent(category.toLowerCase());
};
