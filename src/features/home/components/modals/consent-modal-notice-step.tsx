import { DialogTitle } from '@/components/ui/dialog';
import { Body1, H2 } from '@/components/ui/typography';
import { ConsentModalFooter } from '@/features/home/components/modals/consent-modal-footer';

export const ConsentNoticeStep = () => {
  return (
    <div className="flex h-full flex-col">
      <DialogTitle className="mb-6 flex items-start justify-between">
        <H2 className="text-center">We&rsquo;ve updated our Legal Documents</H2>
      </DialogTitle>
      <div>
        <Body1 className="text-left text-zinc-500">
          This includes our Terms of Service, Privacy Policy, Informed Consent
          and Membership Agreement. These changes clarify things like membership
          terms, telehealth consent, and how we keep your data safe.
        </Body1>
        <Body1 className="pt-4 text-left text-zinc-500">
          You can read the updated versions here:
        </Body1>
        <ul className="space-y-2 py-4 pl-4">
          <li>
            <a
              href="https://superpower-health.webflow.io/terms"
              className="flex items-center gap-2 text-vermillion-900"
            >
              <span className="size-1.5 rounded-full bg-zinc-300" />
              <span>Terms of Service</span>
            </a>
          </li>
          <li>
            <a
              href="https://superpower-health.webflow.io/privacy"
              className="flex items-center gap-2 text-vermillion-900"
            >
              <span className="size-1.5 rounded-full bg-zinc-300" />
              <span>Privacy Policy</span>
            </a>
          </li>
          <li>
            <a
              href="https://superpower-health.webflow.io/membership-agreement"
              className="flex items-center gap-2 text-vermillion-900"
            >
              <span className="size-1.5 rounded-full bg-zinc-300" />
              <span>Membership Agreement</span>
            </a>
          </li>
        </ul>

        <Body1 className="text-left text-zinc-500">
          The updated Informed Consent document will be provided on the next
          page for you to read through.
        </Body1>
        <Body1 className="text-left text-zinc-500">
          Thanks for being part of Superpower!
        </Body1>
      </div>

      <ConsentModalFooter className="pt-10" />
    </div>
  );
};
