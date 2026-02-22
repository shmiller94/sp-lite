import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Body1, H3 } from '@/components/ui/typography';

const faqs: {
  question: string;
  answer: string;
}[] = [
  {
    question: 'When do I get my reward?',
    answer:
      'You will receive your credit rewards via email once a friend successfully signs up to Superpower using your link or invite.',
  },
  {
    question: 'How do I use the credit?',
    answer:
      'You will receive a gift card code by email for the Superpower Supplement Marketplace.',
  },
  {
    question: 'Who’s eligible?',
    answer: 'New members only. One discount per new member.',
  },
];

export const FAQSection = () => {
  return (
    <section>
      <H3>FAQ&apos;s</H3>
      <div className="mt-4">
        <Accordion type="multiple">
          {faqs.map((faq) => {
            return (
              <AccordionItem
                value={faq.question}
                key={faq.question}
                className="last:border-b-0"
              >
                <AccordionTrigger className="group text-zinc-900 transition-colors hover:text-zinc-500">
                  <Body1 className="m-0 transition-colors group-hover:text-zinc-500">
                    {faq.question}
                  </Body1>
                </AccordionTrigger>
                <AccordionContent>
                  <Body1 className="text-zinc-500">{faq.answer}</Body1>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};
