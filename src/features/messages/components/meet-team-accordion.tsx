import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Body1, H4 } from '@/components/ui/typography';
import { getConciergeData } from '@/features/messages/const/concierge-data';

export const MeetTeamAccordion = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-y border-y-zinc-200"
    >
      {getConciergeData().map((data) => (
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
