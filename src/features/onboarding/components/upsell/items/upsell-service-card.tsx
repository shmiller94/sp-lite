import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useMemo } from 'react';

import { StyledMarkdown } from '@/components/shared/styled-markdown';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { H4 } from '@/components/ui/typography';
import {
  ENVIRONMENTAL_TOXIN_TEST_ID,
  HEAVY_METALS_TEST_ID,
  MYCOTOXINS_TEST_ID,
  TOTAL_TOXIN_TEST_ID,
} from '@/const/services';
import { ServiceWithMetadata } from '@/features/onboarding/hooks/use-upsell-services';
import { HealthcareServiceDialog } from '@/features/orders/components/healthcare-service-dialog';
import { StepID } from '@/features/orders/types/step-id';
import { formatMoney } from '@/utils/format-money';

const INDIVIDUAL_TOXIN_TEST_IDS = [
  MYCOTOXINS_TEST_ID,
  HEAVY_METALS_TEST_ID,
  ENVIRONMENTAL_TOXIN_TEST_ID,
];

export const UpsellServiceCard = ({
  service,
  services,
  selectedServices,
  toggleService,
}: {
  service: ServiceWithMetadata;
  services: ServiceWithMetadata[];
  selectedServices: ServiceWithMetadata[];
  toggleService: (item: ServiceWithMetadata) => void;
}) => {
  const isSelected = selectedServices.some(
    (selectedService) => selectedService.id === service.id,
  );

  // Determine if this card should be disabled
  const isDisabled = useMemo(() => {
    // If the service was already ordered, disable it
    if (service.order) {
      return true;
    }

    // If this is an individual toxin test, it's disabled when Total Toxins is selected or ordered
    if (INDIVIDUAL_TOXIN_TEST_IDS.includes(service.id)) {
      return (
        selectedServices.some((s) => s.id === TOTAL_TOXIN_TEST_ID) ||
        services.some((s) => s.id === TOTAL_TOXIN_TEST_ID && s.order)
      );
    }

    return false;
  }, [service.id, service.order, selectedServices, services]);

  const handleSelectService = () => {
    if (!isDisabled) {
      toggleService(service);
    }
  };

  return (
    <HealthcareServiceDialog
      healthcareService={service}
      isBookingModal={false}
      excludeSteps={[
        StepID.PHLEBOTOMY,
        StepID.SCHEDULER,
        StepID.SUMMARY,
        StepID.SUCCESS,
        StepID.INFORMED_CONSENT,
        StepID.CONFIRM_ADDRESS,
        StepID.CONCIERGE,
        StepID.EARLY_ACCESS,
        StepID.TOXIN_SELECT,
        StepID.REFERRAL,
      ]}
    >
      <motion.div
        whileHover={!isDisabled ? { scale: 1.01 } : {}}
        whileTap={!isDisabled ? { scale: 0.99 } : {}}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <Card
          className={`w-full rounded-[20px] border border-zinc-200 bg-white shadow-[0_2px_2px_0_rgba(0,0,0,0.02)] transition-all duration-200 ${
            isDisabled
              ? service.order
                ? 'cursor-not-allowed border-gray-300 bg-gray-50 opacity-60'
                : 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:shadow-md'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {/* Checkbox */}
              <motion.div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={handleSelectService}
                    disabled={isDisabled}
                    className="size-5 border-zinc-200"
                  />
                </motion.div>
              </motion.div>

              {/* Thumbnail */}
              <motion.div
                className="shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="h-14 w-[50px]">
                  <motion.img
                    src={service.image_transparent}
                    alt={service.name}
                    className="size-full object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    whileHover={{ scale: 1.05 }}
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1">
                      <H4 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </H4>
                    </div>

                    {/* Pricing Mobile */}
                    <div className="md:hidden">
                      <div className="flex items-center justify-start gap-2 pb-2">
                        {service.order ? (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Badge className="rounded-md" variant="secondary">
                              Ordered
                            </Badge>
                          </motion.div>
                        ) : (
                          <>
                            <AnimatePresence>
                              {service.savings && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: 'easeOut',
                                  }}
                                >
                                  <Badge
                                    className="rounded-md"
                                    variant="vermillion"
                                  >
                                    Save {formatMoney(service.savings)}
                                  </Badge>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <motion.div
                              className="text-lg font-semibold text-gray-900"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              {formatMoney(service.price)}
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <StyledMarkdown className="text-xs text-gray-600">
                        {service.description}
                      </StyledMarkdown>
                    </div>

                    <div className="flex cursor-pointer items-center gap-2">
                      <span className="text-sm text-gray-500 hover:text-gray-700">
                        Learn more
                      </span>
                      <div>
                        <Info className="size-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Web */}
              <motion.div
                className="hidden shrink-0 text-right md:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-end gap-2">
                  {service.order ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Badge className="rounded-md" variant="secondary">
                        Ordered
                      </Badge>
                    </motion.div>
                  ) : (
                    <>
                      <AnimatePresence>
                        {service.savings && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          >
                            <Badge className="rounded-md" variant="vermillion">
                              Save {formatMoney(service.savings)}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div
                        className="text-lg font-semibold text-gray-900"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {formatMoney(service.price)}
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </HealthcareServiceDialog>
  );
};
