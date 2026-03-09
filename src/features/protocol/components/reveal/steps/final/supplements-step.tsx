import { m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import NumberFlow from '@/components/shared/number-flow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Body1, H2 } from '@/components/ui/typography';
import type { Protocol, ProtocolAction } from '@/features/protocol/api';
import { useSupplementCatalog } from '@/features/protocol/api/supplement-catalog';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { useShippingFee } from '@/features/protocol/hooks/use-shipping-fee';
import { useSupplementProductLookup } from '@/features/protocol/hooks/use-supplement-product-lookup';
import { useAnalytics } from '@/hooks/use-analytics';
import { api } from '@/lib/api-client';
import type { Product } from '@/types/api';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

type SupplementDisplayItem = {
  actionId: string;
  product: Product;
  amazonPrice: number | null;
  amazonUrl: string | null;
};

type SupplementCardProps = {
  item: SupplementDisplayItem;
  isAdded: boolean;
  onToggle: (id: string) => void;
  index: number;
};

const SupplementCard = ({
  item,
  isAdded,
  onToggle,
  index,
}: SupplementCardProps) => {
  const { track } = useAnalytics();

  const productMeta = useMemo(
    () => ({
      product_id: item.product.id,
      product_name: item.product.name,
      product_price: item.product.price,
      discounted_price: item.product.price * (1 - item.product.discount / 100),
      product_url: item.product.url,
      action_id: item.actionId,
    }),
    [item.product, item.actionId],
  );

  const handleToggle = useCallback(() => {
    track(
      isAdded
        ? 'protocol_reveal_supplement_removed_from_cart'
        : 'protocol_reveal_supplement_added_to_cart',
      productMeta,
    );
    onToggle(item.actionId);
  }, [onToggle, item.actionId, isAdded, track, productMeta]);

  const handlePdpClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      track('protocol_reveal_supplement_pdp_clicked', productMeta);
      window.open(item.product.url, '_blank', 'noopener');
    },
    [track, productMeta, item.product.url],
  );

  const handleAmazonClick = useCallback(() => {
    track('protocol_reveal_supplement_amazon_viewed', {
      ...productMeta,
      amazon_price: item.amazonPrice,
      amazon_url: item.amazonUrl,
    });
    window.open(item.amazonUrl!, '_blank', 'noopener');
  }, [track, productMeta, item.amazonPrice, item.amazonUrl]);

  const { product } = item;
  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="rounded-2xl border border-zinc-200 bg-white p-2 shadow shadow-black/[.03]"
    >
      <div className="flex items-center gap-4">
        <img
          src={product.image ?? '/protocol/decision/empty.webp'}
          alt={product.name}
          className="size-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 block font-medium text-zinc-900 hover:underline"
            onClick={handlePdpClick}
          >
            {product.name}
          </a>

          <div className="space-y-1.5">
            {item.amazonPrice != null && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Amazon</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      ${item.amazonPrice.toFixed(0)}
                    </span>
                    {item.amazonUrl != null && (
                      <Button
                        variant="outline"
                        size="small"
                        className="h-8 w-[72px] text-xs"
                        onClick={handleAmazonClick}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>

                <hr className="border-zinc-200" />
              </>
            )}

            <div className="flex items-center justify-between">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-zinc-900 hover:underline"
                onClick={handlePdpClick}
              >
                Superpower
              </a>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-vermillion-900">
                    ${discountedPrice.toFixed(0)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-zinc-400 line-through">
                      ${product.price.toFixed(0)}
                    </span>
                  )}
                </div>
                <Button
                  variant={isAdded ? 'outline' : 'default'}
                  size="small"
                  className="h-8 w-[72px] px-4 text-xs"
                  onClick={handleToggle}
                >
                  {isAdded ? 'Remove' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

/**
 * Extract all supplement-type actions from a protocol's goals.
 */
const extractSupplementActions = (
  protocol: Protocol,
): { action: ProtocolAction; productId: string | undefined }[] => {
  const results: { action: ProtocolAction; productId: string | undefined }[] =
    [];
  for (const goal of protocol.goals) {
    if (
      goal.primaryAction.content.type === 'supplement' &&
      goal.primaryAction.accepted === true
    ) {
      results.push({
        action: goal.primaryAction,
        productId: goal.primaryAction.content.productId,
      });
    }
    for (const action of goal.additionalActions ?? []) {
      if (action.content.type === 'supplement' && action.accepted === true) {
        results.push({
          action,
          productId: action.content.productId,
        });
      }
    }
  }
  return results;
};

export const SupplementsStep = () => {
  const { next, protocol, saveShopifyOrder } = useProtocolStepperContext();
  const { track } = useAnalytics();
  const getSupplementProduct = useSupplementProductLookup();
  const { data: catalog, isLoading: isCatalogLoading } = useSupplementCatalog();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Track which supplement action IDs are in the cart — pre-select all on load
  const [addedIds, setAddedIds] = useState<Set<string> | null>(null);

  // Extract supplement actions from the protocol
  const protocolSupplements = useMemo(() => {
    if (!protocol) return [];
    return extractSupplementActions(protocol);
  }, [protocol]);

  // Build Amazon pricing lookup from catalog (by variant ID)
  const amazonLookup = useMemo(() => {
    const byId = new Map<string, { amazonPrice: number; amazonUrl: string }>();
    for (const item of catalog ?? []) {
      byId.set(item.shopifyVariantId, {
        amazonPrice: item.amazonPrice,
        amazonUrl: item.amazonUrl,
      });
    }
    return byId;
  }, [catalog]);

  // Match protocol supplements → cheapest marketplace variant → Amazon pricing
  const { supplements, outOfStockSupplements } = useMemo(() => {
    const items: SupplementDisplayItem[] = [];
    const outOfStock: {
      actionId: string;
      productId: string;
      productName: string;
    }[] = [];

    for (const { action, productId } of protocolSupplements) {
      const product = getSupplementProduct(productId);
      if (product === null) continue;

      // Skip out-of-stock products
      if (
        product.inventoryQuantity !== undefined &&
        product.inventoryQuantity <= 0
      ) {
        outOfStock.push({
          actionId: action.id,
          productId: product.id,
          productName: product.name,
        });
        continue;
      }

      const amazon = amazonLookup.get(product.id);

      items.push({
        actionId: action.id,
        product,
        amazonPrice: amazon?.amazonPrice ?? null,
        amazonUrl: amazon?.amazonUrl ?? null,
      });
    }

    return { supplements: items, outOfStockSupplements: outOfStock };
  }, [protocolSupplements, getSupplementProduct, amazonLookup]);

  const hasTrackedOutOfStock = useRef(false);
  useEffect(() => {
    if (outOfStockSupplements.length === 0 || hasTrackedOutOfStock.current)
      return;
    hasTrackedOutOfStock.current = true;
    for (const item of outOfStockSupplements) {
      track('protocol_reveal_supplement_out_of_stock', {
        action_id: item.actionId,
        product_id: item.productId,
        product_name: item.productName,
      });
    }
  }, [outOfStockSupplements, track]);

  const allIds = useMemo(
    () => new Set(supplements.map((s) => s.actionId)),
    [supplements],
  );

  const selectedIds = useMemo(() => {
    if (addedIds !== null) return addedIds;
    return allIds;
  }, [addedIds, allIds]);

  const toggleSupplement = useCallback(
    (id: string) => {
      setAddedIds((prev) => {
        const current = new Set(prev ?? allIds);
        if (current.has(id)) {
          current.delete(id);
        } else {
          current.add(id);
        }
        return current;
      });
    },
    [allIds],
  );

  const { totalOriginal, totalDiscounted, selectedCount } = useMemo(() => {
    let original = 0;
    let discounted = 0;
    let count = 0;

    for (const item of supplements) {
      if (selectedIds.has(item.actionId)) {
        original += item.product.price;
        discounted += item.product.price * (1 - item.product.discount / 100);
        count++;
      }
    }

    return {
      totalOriginal: Math.round(original * 100), // cents for NumberFlow
      totalDiscounted: Math.round(discounted * 100),
      selectedCount: count,
    };
  }, [selectedIds, supplements]);

  const { shippingCents, totalWithShipping, isFree } =
    useShippingFee(totalDiscounted);

  const handlePurchase = useCallback(async () => {
    const selected = supplements.filter((s) => selectedIds.has(s.actionId));
    if (selected.length === 0) return;

    const productNames: string[] = [];
    const productIds: string[] = [];
    for (const s of selected) {
      productNames.push(s.product.name);
      productIds.push(s.product.id);
    }

    track('protocol_reveal_supplement_checkout_started', {
      selected_count: selected.length,
      product_ids: productIds,
      product_names: productNames,
      total_discounted_cents: totalDiscounted,
      total_original_cents: totalOriginal,
      total_with_shipping_cents: totalWithShipping,
    });

    setIsCheckingOut(true);

    try {
      // Build products array matching POST /shop/checkout schema
      const products = selected.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        url: item.product.url,
        discount: item.product.discount,
        type: 'Supplements',
        inventoryQuantity: item.product.inventoryQuantity ?? 100,
      }));

      const response = (await api.post('/shop/checkout', {
        products,
      })) as { checkoutUrl: string; orderId: string };

      const checkoutUrl = response.checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank', 'noopener');
        saveShopifyOrder(response.orderId, checkoutUrl).catch(() => {});
      }

      setIsCheckingOut(false);
      next();
    } catch (error) {
      console.error('Failed to create checkout:', error);
      setIsCheckingOut(false);
      // Still advance — don't block the reveal flow on checkout failure
      next();
    }
  }, [
    supplements,
    selectedIds,
    next,
    track,
    totalDiscounted,
    totalOriginal,
    totalWithShipping,
    saveShopifyOrder,
  ]);

  const handleNoThanks = useCallback(() => {
    track('protocol_reveal_supplement_no_thanks_clicked', {
      total_supplements_available: supplements.length,
      selected_count: selectedCount,
    });
    next();
  }, [next, track, supplements.length, selectedCount]);

  if (isCatalogLoading) {
    return (
      <ProtocolStepLayout>
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      </ProtocolStepLayout>
    );
  }

  const hasSelectedSupplements = selectedCount > 0;

  return (
    <ProtocolStepLayout>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="mb-8">
          <H2 className="mb-2">
            Let&apos;s help you source the right supplements
          </H2>
          <Body1 className="text-secondary">
            These specific supplements have been curated and verified by
            Superpower. You can source different brands with your own research.
          </Body1>
        </div>

        <div className="space-y-4">
          {supplements.map((item, index) => (
            <SupplementCard
              key={item.actionId}
              item={item}
              isAdded={selectedIds.has(item.actionId)}
              onToggle={toggleSupplement}
              index={index}
            />
          ))}
        </div>

        <hr className="mt-8 border-zinc-200" />

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">Shipping</span>
            <span className="font-medium text-vermillion-900">
              {isFree ? (
                'FREE'
              ) : (
                <NumberFlow prefix="$" value={shippingCents / 100} />
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap justify-between gap-2">
              <span className="text-sm text-secondary">Total</span>
              {hasSelectedSupplements && (
                <Badge
                  variant="vermillion"
                  className="rounded-sm bg-vermillion-900/10 text-xs"
                >
                  20% member discount
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {totalOriginal !== totalDiscounted && hasSelectedSupplements && (
                <span className="text-sm text-zinc-400 line-through">
                  <NumberFlow
                    value={totalOriginal / 100}
                    prefix="$"
                    format={{
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                  />
                </span>
              )}
              <span className="text-base font-bold text-vermillion-900">
                <NumberFlow
                  value={totalWithShipping / 100}
                  prefix="$"
                  format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      </m.div>

      <div className="flex flex-col gap-3">
        <Button
          className="w-full gap-2"
          onClick={handlePurchase}
          disabled={!hasSelectedSupplements || isCheckingOut}
        >
          {isCheckingOut ? 'Creating checkout...' : 'Purchase now'}
          {!isCheckingOut && (
            <span className="text-zinc-500">
              <NumberFlow
                value={totalWithShipping / 100}
                prefix="$"
                format={{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }}
              />
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleNoThanks}
          disabled={isCheckingOut}
        >
          No thank you
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
