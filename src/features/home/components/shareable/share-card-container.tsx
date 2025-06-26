import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ShareCardContainerProps {
  children: ReactNode;
  cardKey: string;
}

export const ShareCardContainer = ({
  children,
  cardKey,
}: ShareCardContainerProps) => {
  return (
    <motion.div
      id="share-card-container"
      className="mx-auto w-full max-w-sm"
      style={{ perspective: '800px' }}
      key={cardKey}
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0.1, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export const LoadingShareCardContent = ({
  title,
  message,
}: {
  title: string;
  message?: string;
}) => {
  return (
    <div className="text-center">
      <h2 className="mb-6 text-center text-3xl font-bold">{title}</h2>
      <p className="mb-8 text-xl">Awaiting lab results</p>
      {message && <p>{message}</p>}
    </div>
  );
};
