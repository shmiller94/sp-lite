import { CopyIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Body1 } from '@/components/ui/typography';
import { useAffiliateLinks } from '@/features/affiliate/api';
import { cn } from '@/lib/utils';

export function AffiliateLink(): JSX.Element {
  const { data, isLoading } = useAffiliateLinks();

  const onClick = async (copyText: string | undefined): Promise<void> => {
    if (!copyText) return;

    await navigator.clipboard.writeText(copyText);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const { links } = data || { links: [] };

  return (
    <Card>
      <div className="flex flex-col gap-4 p-12 md:flex-row md:items-center">
        <h3 className="text-base text-primary lg:text-xl">
          Share referral link
        </h3>
        <Separator orientation="vertical" className="hidden h-10 md:block" />
        <div
          className={cn(
            'flex flex-row items-center gap-2 lg:text-xl',
            links.length > 0 ? '' : 'cursor-auto',
          )}
          role="presentation"
          onClick={() => onClick(links[0])}
        >
          <Body1 className="line-clamp-1 text-vermillion-900">
            {links[0] || 'On request'}
          </Body1>
          {links.length > 0 && <CopyIcon className="text-vermillion-900" />}
        </div>
      </div>
    </Card>
  );
}
