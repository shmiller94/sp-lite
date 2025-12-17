// This component is used to define positions of floating elements throughout the application.
// In particular, it is used to position the assistant modal (Ask Superpower AI and on the AIAP the checkout modal).
// We use it to reduce the amount of context providers solely to position things. Instead, this component flexes the layout natively.

import { useLocation } from 'react-router-dom';

import { AssistantModal } from '@/features/messages/components/assistant/assistant-modal';
import { cn } from '@/lib/utils';

const HIDE_WRAPPER_PATHNAMES = [
  '/concierge',
  '/onboarding',
  '/questionnaire',
  '/protocol/reveal/get-started',
  '/protocol/reveal/biological-age',
  '/protocol/reveal/score',
];

export const FloatingWrapper = () => {
  const { pathname } = useLocation();

  return (
    <div
      className={cn(
        'fixed bottom-24 right-4 w-52 pointer-events-none z-[51] flex flex-col items-end gap-3 lg:bottom-4',
        HIDE_WRAPPER_PATHNAMES.some((segment) => pathname.includes(segment)) &&
          'opacity-0 pointer-events-none',
      )}
    >
      <AssistantModal />
    </div>
  );
};
