import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';

type LoadingState = {
  text: string;
};

const defaultStates: LoadingState[] = [
  { text: 'Just a moment...' },
  { text: 'Did you take a deep breath today?' },
  { text: 'A smile a day keeps the stress away.' },
  { text: 'Appreciate the little things.' },
];
export const OneLineLoader = ({
  loadingStates = defaultStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates?: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1),
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[100] flex size-full items-center justify-center bg-white/80 backdrop-blur-2xl"
        >
          <div className="relative flex gap-3">
            <Spinner variant="primary" />
            <div>
              <span className="w-full text-zinc-500">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`words_${currentState}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.08 }}
                    className="inline-block"
                  >
                    {loadingStates[currentState].text}
                  </motion.h1>
                </AnimatePresence>
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 h-full bg-white bg-gradient-to-t [mask-image:radial-gradient(900px_at_center,transparent_50%,white)] dark:bg-black" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
