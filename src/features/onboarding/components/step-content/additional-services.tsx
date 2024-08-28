import React, { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Scheduler } from '@/components/ui/scheduler';
import { useStepper } from '@/components/ui/stepper';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import {
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  GUT_MICROBIOME_ANALYSIS,
  TOTAL_TOXIN_TEST,
} from '@/const';
import { AddAddressForm } from '@/features/onboarding/components/add-address-form';
import { AdditionalServiceCard } from '@/features/onboarding/components/additional-service-card';
import { AddressSelect } from '@/features/onboarding/components/address-select';
import { CurrentAddressCard } from '@/features/onboarding/components/current-address-card';
import { EditAddressForm } from '@/features/onboarding/components/edit-address-form';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { AddressInput } from '@/shared/api';
import { HealthcareService, Slot } from '@/types/api';

const ServiceCard = ({ service }: { service: HealthcareService }) => {
  return (
    <div className="flex gap-4 rounded-xl border border-zinc-200 p-4">
      <img
        className="size-[56px] rounded-lg object-cover"
        src={service.image}
        alt="service"
      />
      <div className="flex flex-col justify-center gap-1">
        <Body1 className="text-zinc-900">{service.name}</Body1>
        <Body2 className="line-clamp-1 text-zinc-500">
          {service.description}
        </Body2>
      </div>
    </div>
  );
};

const SchedulerCase = ({
  service,
  setIndex,
}: {
  service: HealthcareService;
  setIndex: Dispatch<SetStateAction<number>>;
}) => {
  const { updateCancerSlot } = useOnboarding();
  const [slot, setSlot] = useState<Slot | null>();
  const { prevStep } = useStepper((s) => s);

  const onCreate = (slot: Slot | null) => {
    if (service.name === GRAIL_GALLERI_MULTI_CANCER_TEST) {
      setSlot(slot);
      updateCancerSlot(slot);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <H2 className="text-zinc-900">Schedule additional services</H2>
          <Body2 className="text-zinc-500">
            Schedule your upcoming bookings. <br /> We’ll send you a reminder
            when your booking is coming up.
          </Body2>
        </div>
        <ServiceCard service={service} />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="p-0 text-zinc-500"
            onClick={() => setIndex((prev) => prev + 1)}
          >
            Skip this for now
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <H2 className="text-zinc-900">Pick a time for at-home visit</H2>
        <Body1 className="text-zinc-500">
          An appointment takes 15 minutes, your nurse will arrive during the
          selected time slot. We recommend booking with 2 hours of waking up to
          ensure the most accurate measurement of blood hormone levels
        </Body1>
      </div>
      <Scheduler
        // todo: rewrite this with mock response
        slots={[
          {
            start: new Date().toISOString(),
            end: new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(), // 15 minutes later
          },
        ]}
        // updateStart={(date) => setStart(date)}
        updateStart={(date) => console.log(date)}
        onSlotUpdate={onCreate}
        displayCancellationNote
        showCreateBtn={false}
        className="max-w-none py-6"
      />
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() =>
            setIndex((prev) => {
              if (prev !== 0) {
                return prev - 1;
              }
              // If prev is 0, get back to previous step
              prevStep();
              return prev;
            })
          }
        >
          Back
        </Button>
        <Button
          disabled={!slot}
          onClick={() => slot && setIndex((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

const ConfirmAddressCase = ({
  service,
  setIndex,
}: {
  service: HealthcareService;
  setIndex: Dispatch<SetStateAction<number>>;
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const { updateMicrobiomeAddress, updateToxinAddress } = useOnboarding();
  const { prevStep } = useStepper((s) => s);

  const callback = (address: AddressInput) => {
    if (service.name === TOTAL_TOXIN_TEST) {
      updateToxinAddress(address);
    }

    if (service.name === GUT_MICROBIOME_ANALYSIS) {
      updateMicrobiomeAddress(address);
    }
  };

  if (isEditingAddress) {
    return (
      <div className="space-y-8">
        <H2 className="text-zinc-900">Edit your address</H2>
        <CurrentAddressCard />
        <EditAddressForm
          setIsEditing={() => setIsEditingAddress((prev) => !prev)}
        />
      </div>
    );
  }

  if (isAddingAddress) {
    return (
      <div className="space-y-8">
        <H2 className="text-zinc-900">Add your address</H2>
        <AddAddressForm
          setIsAdding={() => setIsAddingAddress((prev) => !prev)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <H2 className="text-zinc-900">Your items are on their way</H2>
          <Body2 className="text-zinc-500">
            Your additional tests should arrive in 2-3 business days.
          </Body2>
        </div>
        <ServiceCard service={service} />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="p-0 text-zinc-500"
            onClick={() => setIndex((prev) => prev + 1)}
          >
            Skip this for now
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <H2 className="text-zinc-900">Place of service</H2>
        <div className="space-y-2">
          <Body2 className="text-zinc-500">Confirm your shipping address</Body2>
          <AddressSelect
            setIsAddingAddress={() => setIsAddingAddress((prev) => !prev)}
            setIsEditingAddress={() => setIsEditingAddress((prev) => !prev)}
            callback={callback}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() =>
            setIndex((prev) => {
              if (prev !== 0) {
                return prev - 1;
              }

              // If prev is 0, get back to previous step
              prevStep();
              return prev;
            })
          }
        >
          Back
        </Button>
        <Button onClick={() => setIndex((prev) => prev + 1)}>Next</Button>
      </div>
    </>
  );
};

const OrderSummaryCase = ({
  setIndex,
}: {
  setIndex: Dispatch<SetStateAction<number>>;
}) => {
  const { nextStep } = useStepper((s) => s);
  const { additionalServices } = useOnboarding();
  return (
    <>
      <div className="space-y-4">
        <H2 className="text-zinc-900">Order summary</H2>
        <Body1 className="text-zinc-500">
          Review your additional order details below. Make changes or select
          confirm to complete your bookings.
        </Body1>
        {additionalServices.map((service, index) => (
          <AdditionalServiceCard
            service={service}
            onEdit={() => setIndex((prev) => prev - 1)}
            key={index}
          />
        ))}
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setIndex((prev) => prev - 1)}>
          Back
        </Button>
        {/*Add logic for scheduling order on backend here*/}
        <Button onClick={nextStep}>Confirm</Button>
      </div>
    </>
  );
};

export const AdditionalServices = () => {
  const { additionalServices } = useOnboarding();
  const { nextStep } = useStepper((s) => s);

  const [curIndex, setCurIndex] = useState(0);

  if (additionalServices.length === 0) {
    // skip this step if no services were purchased
    nextStep();
  }

  const renderStep = (service: HealthcareService) => {
    switch (service.name) {
      case GRAIL_GALLERI_MULTI_CANCER_TEST:
        return <SchedulerCase service={service} setIndex={setCurIndex} />;
      case TOTAL_TOXIN_TEST:
      case GUT_MICROBIOME_ANALYSIS:
        return <ConfirmAddressCase service={service} setIndex={setCurIndex} />;
      default:
        return null;
    }
  };

  return (
    <section id="main" className="space-y-12">
      {additionalServices.map(
        (service, index) => index === curIndex && renderStep(service),
      )}
      {curIndex === additionalServices.length ? (
        <OrderSummaryCase setIndex={setCurIndex} />
      ) : null}
    </section>
  );
};

export const AdditionalServicesStep = () => (
  <ImageContentLayout title="Additional Services" className="bg-hand-pillow">
    <AdditionalServices />
  </ImageContentLayout>
);
