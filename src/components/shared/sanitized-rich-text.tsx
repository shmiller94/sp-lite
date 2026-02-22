import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import { Body1, Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const sanitizeSchema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), 'tel', 'sms', 'mailto'],
  },
};

interface SanitizedRichTextProps {
  content: string | null | undefined;
  className?: string;
  textClassName?: string;
  linkClassName?: string;
  variant?: 'body1' | 'body2';
}

export function SanitizedRichText({
  content,
  className,
  textClassName,
  linkClassName,
  variant = 'body1',
}: SanitizedRichTextProps) {
  const trimmed = content?.trim();
  if (trimmed === undefined || trimmed === '') return null;

  const Paragraph = variant === 'body2' ? Body2 : Body1;
  const paragraphAs = variant === 'body1' ? ('div' as const) : undefined;

  return (
    <div className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          p: ({ children }) => (
            <Paragraph
              {...(paragraphAs ? { as: paragraphAs } : {})}
              className={textClassName}
            >
              {children}
            </Paragraph>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className={cn(
                'underline-offset-4 hover:underline',
                linkClassName,
              )}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
