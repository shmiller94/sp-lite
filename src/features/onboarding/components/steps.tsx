import {
  ActivateBookingEntryStep,
  AdditionalServicesStep,
  BookingStep,
  BookingSuccessStep,
  CommitmentStep,
  ConfiguratorStep,
  ConfigureMembershipEntryStep,
  ConfirmOrderStep,
  DigitalTwinEntryStep,
  IdentityStep,
  MissionStep,
  PickDateStep,
  PrimaryAddressStep,
  ScheduleStep,
  // TwoFAStep,
  TypeformEntryStep,
  TypeformIntegrationStep,
  WearablesEntryStep,
} from '@/features/onboarding/components/step-content';
import { AdditionalBookingSuccessStep } from '@/features/onboarding/components/step-content/additional-booking-success';
import { StepItem } from '@/lib/stepper';

export const steps: StepItem[] = [
  {
    id: 'primary-address',
    content: <PrimaryAddressStep />,
  },
  // {
  //   id: 'two-fa',
  //   content: <TwoFAStep />,
  // },
  {
    id: 'mission',
    content: <MissionStep />,
  },
  {
    id: 'commitment',
    content: <CommitmentStep />,
  },
  {
    id: 'configure-membership',
    content: <ConfigureMembershipEntryStep />,
  },
  {
    id: 'configurator',
    content: <ConfiguratorStep />,
  },
  {
    id: 'confirm-order',
    content: <ConfirmOrderStep />,
  },
  {
    id: 'activate-booking',
    content: <ActivateBookingEntryStep />,
  },
  {
    id: 'identity',
    content: <IdentityStep />,
  },
  {
    id: 'schedule',
    content: <ScheduleStep />,
  },
  {
    id: 'booking',
    content: <BookingStep />,
  },
  { id: 'pick-date', content: <PickDateStep /> },
  {
    id: 'booking-success',
    content: <BookingSuccessStep />,
  },
  {
    id: 'additional-services',
    content: <AdditionalServicesStep />,
  },
  {
    id: 'additional-booking-success',
    content: <AdditionalBookingSuccessStep />,
  },
  {
    id: 'digital-twin',
    content: <DigitalTwinEntryStep />,
  },
  {
    id: 'wearables',
    content: <WearablesEntryStep />,
  },
  {
    id: 'typeform',
    content: <TypeformEntryStep />,
  },
  {
    id: 'typeform-integration',
    content: <TypeformIntegrationStep />,
  },
];
