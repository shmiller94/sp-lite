import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { Button } from '@/components/ui/button';
import { Body2, H3, H4 } from '@/components/ui/typography';

const RX_SCREEN_OUT_TEXT = [
  {
    title:
      'Thank you for taking the time to share your health information with us.',
    body: [
      'After careful review of your responses, we are unable to prescribe the medication you requested at this time.',
      'Our decision is based on various factors, including medical guidelines, safety considerations, and our commitment to providing you with the right treatment.',
    ],
  },
  {
    heading: 'Why do we do this?',
    body: [
      'Your health and well-being are our top priorities, and we appreciate your time and effort in providing us with the necessary information.',
      'If you have any questions or feel you received this message in error, reach out to your concierge or seek further medical advice if you have any immediate health or treatment concerns.',
    ],
  },
];

function RxScreenOutInformation() {
  return (
    <motion.section
      id="main"
      className="space-y-8 pt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {RX_SCREEN_OUT_TEXT.map((text, idx) => (
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

export const RxScreenOut = ({ onContinue }: { onContinue?: () => void }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      return;
    }

    navigate('/');
  };

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
        <RxScreenOutInformation />
        <Button className="mt-10 w-full" onClick={handleContinue}>
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
