import { motion } from 'framer-motion';
import React, { Dispatch, RefObject, SetStateAction } from 'react';

import { ExpandableCard } from '@/features/onboarding/components/configurator/expandable-card';
import { Summary } from '@/features/onboarding/components/configurator/summary';

type StepContent = {
  component: JSX.Element;
  image: JSX.Element;
};

type Props = {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  activeCard: number;
  parentRef: RefObject<HTMLDivElement>;
  content: StepContent[];
};

const ConfiguratorForm = ({
  isExpanded,
  setIsExpanded,
  parentRef,
  content,
  activeCard,
}: Props) => {
  return (
    <>
      <div className="relative flex w-full max-w-[716px] items-start justify-center px-8 md:px-16">
        <ExpandableCard
          parentRef={parentRef}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        <div className="max-w-2xl">
          {content.map((item, index) => {
            return (
              <motion.div
                initial={{
                  opacity: isExpanded ? 1 : 0,
                }}
                animate={{
                  opacity: isExpanded ? 1 : activeCard === index ? 1 : 0.3,
                }}
                key={index}
                className="my-[100px] flex flex-col justify-center"
              >
                {item.component}
              </motion.div>
            );
          })}
          <Summary />
          <div className="h-40" />
        </div>
      </div>
    </>
  );
};

export { ConfiguratorForm };
