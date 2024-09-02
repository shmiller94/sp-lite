import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useState } from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { MetadataSource } from '@/types/api';

export interface BiomarkerCardFooterProps {
  source: MetadataSource[];
  className?: string;
  containerClassName?: string;
}

export function BiomarkerCardFooter({
  source,
  className,
  containerClassName,
}: BiomarkerCardFooterProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (): void => {
    setIsOpen(!isOpen);
  };

  if (source.length === 0) return <></>;
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className={containerClassName}
    >
      <CollapsibleTrigger asChild className={className}>
        <div
          className={cn(
            `px-6 py-3 bg-white border-t ${isOpen ? '' : 'rounded-b-lg'}`,
            className ?? '',
          )}
        >
          <div className="flex cursor-pointer items-center space-x-1">
            <span className="text-xl">Sources</span>
            {!isOpen && <ArrowUpRight size={20} />}
            {isOpen && <ArrowDownRight size={20} />}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="max-h-64 space-y-2 overflow-y-scroll break-all rounded-b-lg border-t border-dashed border-gray-600 bg-white px-6 py-3">
        {source.map((source: MetadataSource, idx: number) => (
          <div key={idx}>
            <a
              href={source.url}
              rel="noreferrer"
              target="_blank"
              className="font-mono text-sm hover:underline"
            >
              {source.text}
            </a>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
