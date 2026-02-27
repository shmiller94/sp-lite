import { useNavigate } from '@tanstack/react-router';
import { m } from 'framer-motion';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { Button } from '@/components/ui/button';
import { Body2, H3, H4 } from '@/components/ui/typography';

const RX_SCREEN_OUT_TEXT = [
  {
    title:
      'Thank you for taking the time to share your health information with us.',
    heading: 'Our clinical decision',
    body: [
      'After reviewing your responses, our clinical team is not able to safely prescribe the medication you requested at this time. This decision is based on medical guidelines and safety considerations designed to protect your long-term health.',
    ],
  },
  {
    heading: 'Why we made this decision',
    body: [
      'We know this may feel disappointing, especially if you were hoping this medication could support your goals. Your health and well-being are important to us, and we appreciate the time you took to share your information.',
    ],
  },
  {
    heading: 'Have questions or concerns?',
    body: [
      'If you have questions about this decision, or believe something may have been misunderstood, please reach out to your concierge at concierge@superpower.com so we can review it with you and help you understand possible next steps.',
    ],
  },
];

export const RxScreenOut = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-100 px-8">
      <div className="mx-auto max-w-[570px] py-24 md:py-36">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <SuperpowerLogo className="w-32" />
        </m.div>
        <RxScreenOutInformation text={RX_SCREEN_OUT_TEXT} />
        <Button
          className="mt-10 w-full"
          onClick={() => {
            void navigate({ to: '/' });
          }}
        >
          I Understand
        </Button>
      </div>

      <div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-16 w-full items-end justify-between bg-gradient-to-t from-white/25 to-transparent">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0V25H25C11.1934 25 0 13.8071 0 0Z"
              fill="white"
            />
          </svg>
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 0V25H0C13.8066 25 25 13.8071 25 0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

function RxScreenOutInformation({ text }: { text: typeof RX_SCREEN_OUT_TEXT }) {
  return (
    <m.section
      id="main"
      className="space-y-8 pt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {text.map((item: any, idx: number) => (
        <m.div
          key={item.heading || idx}
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.2 + idx * 0.1,
          }}
        >
          <H3>{item.title}</H3>
          <H4>{item.heading}</H4>
          <div className="space-y-4">
            {item.body.map((body: string) => (
              <Body2 key={body} className="text-secondary">
                {body
                  .split(/(concierge@superpower\.com)/g)
                  .map((part: string) =>
                    part.match(/concierge@superpower\.com/) ? (
                      <a
                        key={part}
                        href={`mailto:concierge@superpower.com`}
                        className="text-vermillion-900 underline-offset-1 hover:underline"
                      >
                        concierge@superpower.com
                      </a>
                    ) : (
                      part
                    ),
                  )}
              </Body2>
            ))}
          </div>
        </m.div>
      ))}
    </m.section>
  );
}
