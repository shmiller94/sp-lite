import moment from 'moment';

import { Body1, H1 } from '@/components/ui/typography';
import { useUser } from '@/lib/auth';

import { useCarePlan } from '../context/care-plan-context';

import { HealthReportSection } from './sections/health-report-section';
import { MonitoredIssues } from './sections/monitored-issues';
import { NextStepsSection } from './sections/next-steps';
import { Overview } from './sections/overview';
import { ProtocolSection } from './sections/protocol';

export const CarePlanContent = () => {
  const { data } = useUser();
  const { plan, isAnnualReport } = useCarePlan();

  return (
    <div className="flex w-full flex-col gap-10 pb-24">
      <div>
        <H1 className="m-0 mb-4 !text-[40px] leading-none md:mb-0">
          {data?.firstName}&apos;s Action Plan
        </H1>
        <Body1 className="m-0 leading-none text-secondary">
          {moment(plan.created).format('MMM Do, YYYY')}
        </Body1>
      </div>
      <Overview />
      {isAnnualReport && <HealthReportSection />}
      <MonitoredIssues />
      <ProtocolSection />
      <NextStepsSection />
    </div>
  );
};
