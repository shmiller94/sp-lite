import { Body1, Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ServiceWithMetadata } from '../../hooks/use-upsell-services';

import { ItemPreview } from './item-preview';

export const ItemPreviews = ({
  services,
}: {
  services?: ServiceWithMetadata[];
}) => {
  return (
    <div
      className={
        'relative top-8 order-first mx-auto hidden size-full max-h-[calc(100dvh-4.5rem)] min-h-96 max-w-[calc(100dvw-2rem)] grid-cols-2 place-items-center content-center items-center gap-4 overflow-hidden rounded-3xl bg-white p-4 py-16 transition-all md:grid lg:sticky lg:order-last lg:h-auto'
      }
    >
      {services?.length ? (
        services.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'rounded-3xl bg-white relative',
              services.length === 1 && 'col-span-2',
              services.length > 2 && index % 2 === 0 && 'md:-top-16 -top-8', // Left column: split offset up by half total offset
              services.length > 2 && index % 2 !== 0 && 'md:top-16 top-8', // Right column: split offset down by half total offset
            )}
          >
            <ItemPreview image={item.image_shadow ?? ''} />
          </div>
        ))
      ) : (
        <div className="absolute left-1/2 top-1/2 mx-auto flex size-full max-w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
          <img
            className="size-40 object-contain lg:size-80"
            src="/onboarding/upsell/empty_box.webp"
            alt="No additional tests selected"
          />
          <Body1 className="mb-2.5 text-center">
            No additional tests selected
          </Body1>
          <Body2 className="text-center text-zinc-500">
            Select a test from the{' '}
            <span className="hidden md:inline-block">left</span>{' '}
            <span className="inline-block md:hidden">bottom</span> to gain
            additional insights about your health.
          </Body2>
        </div>
      )}
    </div>
  );
};
