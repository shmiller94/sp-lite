/**
 * Hardcoded pricing for prescription medications
 * Format: { code: { price: number, slug: string } }
 */

// TODO: Change this to be Dynamic
// I'm doing a hack right now to get this out
// Given IDFK what the RX/Core-App pod has planned
// -Kingsley 10-10-2025

// Pricing pulled from clinic.superpower.com
export const RX_PRICING: Record<string, { price: number; slug: string }> = {
  semaglutide: {
    price: 299,
    slug: 'semaglutide',
  },
  enclomiphene: {
    price: 139,
    slug: 'enclomiphene',
  },
  'nad-injectable': {
    price: 299,
    slug: 'nad-injectable',
  },
  'nad-intranasal': {
    price: 159,
    slug: 'nad-intranasal',
  },
  tretinoin: {
    price: 119,
    slug: 'tretinoin',
  },
  'ghk-cu-cream': {
    price: 149,
    slug: 'ghk-cu-cream',
  },
  sermorelin: {
    price: 199,
    slug: 'sermorelin',
  },
};

/**
 * Get pricing info for an RX by code
 */
export function getRxPricing(code?: string) {
  if (!code) return null;
  return RX_PRICING[code.toLowerCase()] || null;
}
