import { Product } from '@/types/api';

export type SupplementsCategory = Array<{
  title: string;
  subtitle?: string;
  products: Product[];
}>;

// given Shopify's inconsistencies -- better to check for duplicate ids just to be sure
const dedupeById = (items: Product[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
};

const DEFAULT_CATEGORY = 'Other supplements';

export const groupSupplementsByCategory = (
  products: Product[],
  defaultCategory: string = DEFAULT_CATEGORY,
): SupplementsCategory => {
  if (!products.length) {
    return [];
  }

  const grouped = new Map<string, Product[]>();

  products.forEach((product) => {
    const rawCategories =
      product.additionalClassification &&
      product.additionalClassification.length > 0
        ? product.additionalClassification
        : [defaultCategory];

    const categories = Array.from(
      new Set(
        rawCategories.map((category) => {
          const normalized = category?.trim();
          return normalized && normalized.length > 0
            ? normalized
            : defaultCategory;
        }),
      ),
    );

    categories.forEach((category) => {
      const bucket = grouped.get(category);

      if (bucket) {
        bucket.push(product);
      } else {
        grouped.set(category, [product]);
      }
    });
  });

  return Array.from(grouped.entries())
    .map(([title, items]) => ({
      title,
      products: dedupeById(items),
    }))
    .sort((a, b) => {
      if (a.title === defaultCategory) return 1;
      if (b.title === defaultCategory) return -1;
      return a.title.localeCompare(b.title);
    });
};
