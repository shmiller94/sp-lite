import { Body1, H2 } from '@/components/ui/typography';

import { useSection } from '../../hooks/use-section';
import { PlanHealthScore } from '../annual-report/plan-health-score';
import { SectionTitle } from '../section-title';

export const HealthReportSection = () => {
  const { title, order, total } = useSection('health-report');
  return (
    <section id="health-report" className="space-y-4">
      <SectionTitle
        style={{
          backgroundImage: 'url(/action-plan/sections/detailed-leaf.webp)',
        }}
      >
        <Body1 className="text-white">
          {order} of {total}
        </Body1>
        <H2 className="text-white" id="section-title">
          {title}
        </H2>
      </SectionTitle>
      <PlanHealthScore />
    </section>
  );
};
