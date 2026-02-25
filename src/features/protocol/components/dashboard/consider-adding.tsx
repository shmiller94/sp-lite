import { Plus } from 'lucide-react';

import {
  Carousel,
  CarouselMainContainer,
  SliderMainItem,
} from '@/components/ui/carousel/carousel';
import { toast } from '@/components/ui/sonner';
import { Body1, Body2, H4 } from '@/components/ui/typography';
import { useAnalytics } from '@/hooks/use-analytics';

import type { ProtocolAction } from '../../api';
import { useUpdateActionAcceptance } from '../../api';
import { getActionTypeImage } from '../../const/protocol-constants';

type ConsiderAddingProps = {
  protocolId: string;
  actions: ProtocolAction[];
};

export const ConsiderAdding = ({
  protocolId,
  actions,
}: ConsiderAddingProps) => {
  const { mutate: updateAcceptance, isPending } = useUpdateActionAcceptance();
  const { track } = useAnalytics();

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-full">
        <H4>Consider adding</H4>
      </div>
      <div
        className="relative w-screen max-w-[calc(768px)]"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
        }}
      >
        <Carousel
          carouselOptions={{
            align: 'start',
            dragFree: true,
          }}
        >
          <CarouselMainContainer className="-mx-2 mr-6 px-6 md:mr-10 md:px-12">
            {actions.map((action) => (
              <SliderMainItem
                key={action.id}
                className="basis-auto select-none p-2"
              >
                <div className="group flex h-full w-64 cursor-grab flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow shadow-black/[.03] transition-all hover:shadow-md active:cursor-grabbing">
                  <div className="mb-3 flex items-start justify-between">
                    <Body2 className="text-xs text-secondary">
                      {action.content.type.slice(0, 1).toUpperCase() +
                        action.content.type.slice(1)}
                    </Body2>
                  </div>

                  <Body1 className="mb-4 flex-1 font-medium leading-tight">
                    {action.title}
                  </Body1>

                  <div className="relative">
                    <div className="aspect-[4/2] overflow-hidden rounded-xl">
                      <img
                        src={getActionTypeImage(action.content)}
                        alt={action.title}
                        className="size-full object-contain"
                      />
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <button
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          track('protocol_dashboard_action_added', {
                            action_id: action.id,
                            action_type: action.content.type,
                            action_title: action.title,
                          });
                          updateAcceptance(
                            {
                              protocolId,
                              actionId: action.id,
                              accepted: true,
                            },
                            {
                              onSuccess: () => {
                                toast.success('Added to your protocol');
                              },
                            },
                          );
                        }}
                        className="flex size-8 items-center justify-center rounded-full bg-vermillion-900 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </SliderMainItem>
            ))}
          </CarouselMainContainer>
        </Carousel>
      </div>
    </div>
  );
};
