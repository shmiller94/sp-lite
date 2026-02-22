import { StyledMarkdown } from '@/components/shared/styled-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Body2, H4 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ServiceFaq } from '@/types/service';
import { getDetailsForService } from '@/utils/service';

export const ServiceFaqs = ({
  serviceName,
  filter,
  className,
  size = 'default',
}: {
  serviceName: string;
  filter?: (faq: ServiceFaq) => boolean;
  className?: string;
  size?: 'default' | 'small';
}) => {
  const serviceDetails = getDetailsForService(serviceName);
  const isCompact = size === 'small';

  const defaultValue = filter
    ? serviceDetails?.faqs?.find((faq) => filter(faq))?.question
    : serviceDetails?.faqs?.[0]?.question;

  return (
    <Accordion
      type="multiple"
      className={cn('w-full', className)}
      defaultValue={defaultValue ? [defaultValue] : undefined}
    >
      {serviceDetails?.faqs
        ? serviceDetails.faqs.filter(filter ?? (() => true)).map((faq) => {
            return (
              <AccordionItem
                value={faq.question}
                key={faq.question}
                className="border-b-0"
              >
                <AccordionTrigger
                  className={cn(
                    'group text-zinc-900 transition-colors hover:text-zinc-500',
                    isCompact ? 'py-1' : 'py-2',
                  )}
                >
                  {isCompact ? (
                    <Body2 className="m-0 transition-colors group-hover:text-zinc-500">
                      {faq.question}
                    </Body2>
                  ) : (
                    <H4 className="m-0 transition-colors group-hover:text-zinc-500">
                      {faq.question}
                    </H4>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <StyledMarkdown
                    variant={isCompact ? 'small' : 'default'}
                    className="space-y-4 text-zinc-500"
                  >
                    {faq.answer}
                  </StyledMarkdown>
                </AccordionContent>
              </AccordionItem>
            );
          })
        : null}
    </Accordion>
  );
};
