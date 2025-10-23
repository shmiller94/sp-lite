import { AnimationProps, motion } from 'framer-motion';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { cn } from '@/lib/utils';

export const OnboardingCard = () => {
  const shimmerAnimation = {
    opacity: [0.7, 1, 0.7],
    filter: ['brightness(1)', 'brightness(0.7)', 'brightness(1)'],
  } satisfies AnimationProps['animate'];

  return (
    <motion.div
      className={cn(
        'relative aspect-[16/9] h-56 w-96 overflow-hidden rounded-2xl bg-cover bg-center outline outline-1 -outline-offset-1 outline-white/10 bg-[url("/onboarding/card-organic-bg.webp")]',
      )}
      initial={{ rotate: 0, scale: 0.7, opacity: 0, filter: 'blur(5px)' }}
      animate={{
        rotate: -4,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 10,
      }}
      transition={{
        type: 'spring',
        damping: 11,
        stiffness: 50,
        duration: 3,
      }}
    >
      <motion.div
        className="absolute left-6 top-5 z-20 inline-block"
        initial={{ opacity: 0.8, filter: 'brightness(1)' }}
        animate={shimmerAnimation}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        <SuperpowerLogo fill="white" className="block w-32" />
      </motion.div>
      <motion.p
        className="absolute bottom-4 right-4 z-20 text-right text-white/80"
        animate={shimmerAnimation}
        transition={{
          duration: 2.5,
          repeat: 2,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <span className="select-none text-2xl font-medium">Membership</span>
      </motion.p>
    </motion.div>
  );
};
