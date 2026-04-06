import { Body1, Body2 } from '@/components/ui/typography';
import { useAnalytics } from '@/hooks/use-analytics';
import { usePosthogFeatureFlagEnabled } from '@/hooks/use-posthog-feature-flag-enabled';

const CONSULT_URL = 'https://cal.com/team/superpower/member-consult';

type RxClinicianCallCtaProps = {
  source:
    | 'reveal_fix'
    | 'reveal_recommendations'
    | 'additional_content_dialog'
    | 'todo_dialog'
    | 'rx_pdp';
};

export const RxClinicianCallCta = ({ source }: RxClinicianCallCtaProps) => {
  const enabled = usePosthogFeatureFlagEnabled(
    'protocol-inapp-rx-clinician-call',
  );
  const { track } = useAnalytics();

  if (!enabled) return null;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-zinc-100 p-3">
      <div className="flex w-full flex-col gap-1">
        <img
          src="/services/doctors/doctors.webp"
          alt="Superpower care team"
          className="mb-1 h-6 w-auto self-start"
        />
        <Body1>Have questions about this medication?</Body1>
        <Body2 className="text-secondary">
          Talk to your care team about treatment options.
        </Body2>
      </div>
      <a
        href={CONSULT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track('protocol_rx_clinician_call_cta_clicked', { source });
        }}
        className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-[0px_2px_2px_0px_rgba(0,0,0,0.02)] transition-colors hover:bg-zinc-50"
      >
        Schedule a 1:1 consult
      </a>
    </div>
  );
};
