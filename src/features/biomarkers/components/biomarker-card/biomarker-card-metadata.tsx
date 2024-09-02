import React from 'react';

import { Body1 } from '@/components/ui/typography';
import { pluralizeIs } from '@/features/biomarkers/utils/pluralize';
import { MetadataContent } from '@/types/api';

export interface BiomarkerCardMetadata {
  name: string;
  description: string;
  importance: string;
  content: MetadataContent[];
  className?: string;
}

export function BiomarkerCardMetadata({
  name,
  description,
  importance,
  content,
  className,
}: BiomarkerCardMetadata): JSX.Element {
  const metadata = [...content];

  importance.length > 0 &&
    metadata.unshift({
      title: `Why ${pluralizeIs(name)} ${name} important?`,
      text: importance,
      status: 'UNKNOWN',
    } as MetadataContent);
  metadata.unshift({
    title: `What ${pluralizeIs(name)} ${name}?`,
    text: description,
    status: 'UNKNOWN',
  } as MetadataContent);

  return (
    <div className={className}>
      {metadata.map((content: MetadataContent, idx: number) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-4xl">{content.title}</h3>
          <Body1 className="whitespace-pre-wrap text-zinc-500">
            {content.text}
          </Body1>
        </div>
      ))}
    </div>
  );
}
