import { motion } from 'framer-motion';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { Body2, H3, H4 } from '@/components/ui/typography';

const NEW_USER_TEXT = [
  {
    title:
      'Thank you for taking the time to share your health information with us.',
    body: [
      'Based on your responses, it appears you may need more specialized or intensive care than our program can safely provide right now.',
      'We understand this can feel discouraging, and we want you to know that your health and well-being are our top priorities. Our approach is designed for those without certain advanced or unstable conditions, and we’d never want to offer you a solution that isn’t in your best interest.',
    ],
  },
  {
    heading: 'You will be issued a full refund in 5-7 days',
    body: [
      'Since our program isn’t the right fit for you at this stage, we will issue a full refund for any fees you have already paid. If you have any questions about your refund or do not see it reflected in your account within 5–7 business days, please contact our concierge support team.',
    ],
  },
  {
    heading: 'What you can do next',
    body: [
      'If you haven’t already, please consider reaching out to a healthcare specialist or your primary care doctor to discuss the best options for your specific needs.',
      'We appreciate your understanding and hope you find the care that meets your needs. You are not alone in this journey, and we wish you the very best as you take your next steps toward better health.',
    ],
  },
];

const LEGACY_USER_TEXT = [
  {
    title:
      'Thank you for taking the time to share your health information with us.',
    body: [
      'Based on your responses, it looks like you may need more specialized or intensive care than our program can safely support at this time.',
      'We know this may be disappointing to hear, and we want you to know that your health and safety are always our top priorities. Our care model is built for individuals without certain advanced or unstable conditions, and we’d never want to recommend a program that isn’t aligned with your needs.',
    ],
  },
  {
    heading: 'What this means for your membership',
    body: [
      'Since our program isn’t the right fit for you right now, we’ll be pausing your Superpower journey going forward. You have not been billed again for your membership, and you won’t be in the future. We hope you understand this decision comes from our commitment to providing safe, responsible care.',
      'If you have any questions or need support, our concierge team is here to help.',
    ],
  },
  {
    heading: 'What you can do next',
    body: [
      'If you haven’t already, we encourage you to connect with a primary care provider or specialist who can help guide you toward the best care for your needs.',
      'We truly appreciate your trust in us and hope you find a care path that feels right for you. You’re not alone in this, and we’re wishing you the very best on your journey toward better health.',
    ],
  },
];

function Information({ legacy }: { legacy: boolean }) {
  const text = legacy ? LEGACY_USER_TEXT : NEW_USER_TEXT;

  return (
    <motion.section
      id="main"
      className="space-y-8 pt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {text.map((text, idx) => (
        <motion.div
          key={text.heading || idx}
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.2 + idx * 0.1,
          }}
        >
          <H3>{text.title}</H3>
          <H4>{text.heading}</H4>
          <div className="space-y-4">
            {text.body.map((body, index) => (
              <Body2 key={index} className="text-secondary">
                {body.split(/(superpower@superpower\.com)/g).map((part, i) =>
                  part.match(/superpower@superpower\.com/) ? (
                    <a
                      key={i}
                      href={`mailto:${part}`}
                      className="text-white underline-offset-1 hover:underline"
                    >
                      {part}
                    </a>
                  ) : (
                    part
                  ),
                )}
              </Body2>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}

export const ScreenOut = ({ legacy }: { legacy: boolean }) => {
  return (
    <div className="min-h-screen bg-zinc-100 px-8">
      <div className="mx-auto max-w-[570px] py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <SuperpowerLogo className="w-32" />
        </motion.div>
        <Information legacy={legacy} />
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
        <div className="flex w-screen items-center justify-center bg-white px-10 py-4 text-center md:h-14">
          <Body2 className="text-primary">
            Sorry, you’re not eligible for Superpower services at this time.
          </Body2>
        </div>
      </div>
    </div>
  );
};
