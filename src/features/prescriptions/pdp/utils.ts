import type { Rx } from '@/types/api';

export function getDefaultBillingCode(prescription: Rx): string {
  const prices = [...(prescription.prices ?? [])].sort(
    (a, b) => a.interval_count - b.interval_count,
  );
  const monthlyPrice = prices.find((p) => p.interval_count <= 30);
  return monthlyPrice?.billing_code ?? prices[0]?.billing_code ?? '';
}

export function buildGetStartedUrl(
  baseUrl: string | null | undefined,
  billingCode: string,
): string | undefined {
  if (!baseUrl) return undefined;
  if (!billingCode) return undefined;
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}billingCode=${encodeURIComponent(billingCode)}`;
}
