import NumberFlow from '@number-flow/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Body1, H3, H4 } from '@/components/ui/typography';
import {
  ENVIRONMENTAL_TOXIN_TEST_ID,
  HEAVY_METALS_TEST_ID,
  MYCOTOXINS_TEST_ID,
  TOTAL_TOXIN_TEST_ID,
} from '@/const/services';
import { ServiceWithMetadata } from '@/features/onboarding/hooks/use-upsell-services';
import { useAnalytics } from '@/hooks/use-analytics';

import { ItemPreviews } from '../item-previews';

import { UpsellServiceCard } from './upsell-service-card';

export const UpsellDetailToxins = ({
  services,
  selectedServices,
  toggleService,
  goToNext,
}: {
  services: ServiceWithMetadata[];
  selectedServices: ServiceWithMetadata[];
  toggleService: (item: ServiceWithMetadata) => void;
  goToNext: () => void;
}) => {
  const { track } = useAnalytics();

  const onAddToCart = () => {
    // Add all selected services to cart
    selectedServices.forEach((service) => {
      track('added_service', {
        service_name: service.name,
        value: service.price,
      });
    });
    toast.success(
      `${selectedServices.length} ${selectedServices.length === 1 ? 'service' : 'services'} added`,
    );
    goToNext();
  };

  const selectedToxServices = useMemo(() => {
    return selectedServices.filter((service) =>
      [
        TOTAL_TOXIN_TEST_ID,
        MYCOTOXINS_TEST_ID,
        HEAVY_METALS_TEST_ID,
        ENVIRONMENTAL_TOXIN_TEST_ID,
      ].includes(service.id),
    );
  }, [selectedServices]);

  return (
    <>
      <div className="mx-auto mb-16 flex size-full flex-col items-start space-y-6 px-6 md:mt-0 lg:max-w-[700px] lg:pt-16">
        <div>
          <H3>Toxin Tests</H3>
        </div>
        <div>
          <Body1 className="text-zinc-500">
            Know how heavy metals, mycotoxins, and other environmental toxins
            may be harming your health.
          </Body1>
        </div>

        {/* Services */}
        <div className="space-y-2">
          {services.map((service, index) => (
            <div key={service.id}>
              <UpsellServiceCard
                service={service}
                services={services}
                selectedServices={selectedServices}
                toggleService={toggleService}
              />
              {index === 0 && <div className="my-4 h-px bg-zinc-200" />}
            </div>
          ))}
        </div>

        {/* Bottom sections container */}
        <motion.div
          layout
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full space-y-4"
        >
          {/* Total */}
          <AnimatePresence>
            {selectedToxServices.length && (
              <motion.div
                initial={{
                  opacity: 0,
                  scaleY: 0,
                }}
                animate={{
                  opacity: 1,
                  scaleY: 1,
                }}
                exit={{
                  opacity: 0,
                  scaleY: 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
                className="flex justify-between gap-4 py-8"
              >
                <H4>Total</H4>
                <NumberFlow
                  format={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }}
                  value={Math.floor(
                    selectedToxServices.reduce(
                      (acc, service) => acc + service.price,
                      0,
                    ) / 100,
                  )}
                  className="text-base"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add to cart */}
          <AnimatePresence>
            {selectedToxServices.length && (
              <motion.div
                initial={{
                  opacity: 0,
                  scaleY: 0,
                }}
                animate={{
                  opacity: 1,
                  scaleY: 1,
                }}
                exit={{
                  opacity: 0,
                  scaleY: 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
              >
                <Button
                  onClick={onAddToCart}
                  className="sticky top-[calc(100dvh-4.5rem)] z-30 order-first w-full hover:bg-zinc-800 disabled:bg-zinc-700 disabled:opacity-100 lg:static lg:order-none"
                >
                  {`Add ${selectedToxServices.length === 1 ? 'test' : 'tests'} to cart`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: selectedToxServices.length ? 0.1 : 0.3,
              ease: 'easeOut',
            }}
          >
            <Button
              onClick={goToNext}
              variant="ghost"
              className="group h-12 w-full flex-1 border border-zinc-100 bg-white text-base text-zinc-500 shadow-sm hover:text-zinc-600 disabled:bg-white/75 disabled:text-zinc-300 disabled:opacity-100 disabled:backdrop-blur-md md:border-transparent md:bg-transparent md:shadow-none"
            >
              Skip
              <div>
                <ChevronRight size={18} className="ml-0.5 size-4" />
              </div>
            </Button>
          </motion.div>
        </motion.div>
        <div className="h-24 md:hidden" />
      </div>

      <ItemPreviews services={services} />
    </>
  );
};
