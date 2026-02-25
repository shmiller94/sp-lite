import { ExternalLink } from 'lucide-react';

import type { Product } from '@/types/api';

type SupplementPreviewProps = {
  product: Product;
};

export function SupplementPreview({ product }: SupplementPreviewProps) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100"
    >
      <img
        src={product.image ?? '/protocol/decision/empty.webp'}
        alt={product.name}
        className="size-10 rounded-lg object-cover"
      />
      <span className="flex-1 text-sm font-medium text-zinc-900">
        {product.name}
      </span>
      <ExternalLink className="size-4 shrink-0 text-zinc-400" />
    </a>
  );
}
