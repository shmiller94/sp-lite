import { useMemo } from 'react';

import { useCarePlan } from '../context/care-plan-context';

export interface SectionInfo {
  id: SectionId;
  title: string;
  order: number;
  total: number;
}

export type SectionId =
  | 'overview'
  | 'health-report'
  | 'monitored-issues'
  | 'protocol'
  | 'next-steps';

// Hook that returns section info for a specific section ID
export function useSection(sectionId: SectionId): SectionInfo {
  const { isAnnualReport } = useCarePlan();

  const sectionInfo = useMemo(() => {
    const baseSections: {
      id: SectionId;
      title: string;
    }[] = [
      { id: 'overview', title: 'Overview' },
      { id: 'monitored-issues', title: 'Monitored Issues' },
      { id: 'protocol', title: 'Protocol' },
      { id: 'next-steps', title: 'Next Steps' },
    ];

    // insert health-report section conditionally for annual reports
    if (isAnnualReport) {
      baseSections.splice(1, 0, {
        id: 'health-report',
        title: 'Health Report',
      });
    }

    const sections = baseSections.map((section, index) => ({
      ...section,
      order: index + 1,
      total: baseSections.length,
    }));

    const section = sections.find((section) => section.id === sectionId);
    if (!section) {
      throw new Error(`Section with id '${sectionId}' not found`);
    }
    return section;
  }, [sectionId, isAnnualReport]);

  return sectionInfo;
}
