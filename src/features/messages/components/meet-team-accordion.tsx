import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, H4 } from '@/components/ui/typography';
import { ADVISORY_CALL } from '@/const';
import { getConciergeData } from '@/features/messages/const/concierge-data';
import { useServices } from '@/features/services/api';

export const MeetTeamAccordion = () => {
  const servicesQuery = useServices();

  const advisoryCall = servicesQuery.data?.services.find(
    (s) => s.name === ADVISORY_CALL,
  );
  const CONCIERGE_DATA = advisoryCall ? getConciergeData(advisoryCall) : [];

  if (servicesQuery.isLoading) {
    return (
      <div className="flex flex-col">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border-y border-y-zinc-200 px-14 py-8">
              <Skeleton className="h-[28px] w-full" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-y border-y-zinc-200"
    >
      {CONCIERGE_DATA.map((data) => (
        <AccordionItem
          value={data.value}
          className="space-y-4 px-14 py-8"
          key={data.value}
        >
          <AccordionTrigger className="p-0">
            <H4>{data.title}</H4>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Body1 className="text-zinc-500">{data.description}</Body1>
            {data.action ? data.action : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
