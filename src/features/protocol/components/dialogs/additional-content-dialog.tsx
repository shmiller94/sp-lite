import { X } from 'lucide-react';
import { ReactNode, useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { H3, H4 } from '@/components/ui/typography';
import { AiSuggestions } from '@/features/messages/components/ai-suggestions';
import { useAnalytics } from '@/hooks/use-analytics';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import type { Product } from '@/types/api';

import { ProtocolMarkdown } from '../protocol-markdown';
import { SupplementPreview } from '../supplement-preview';

type AdditionalContentDialogProps = {
  children: ReactNode;
  actionTitle?: string;
  additionalContent: string;
  supplementProduct?: Product | null;
};

export function AdditionalContentDialog({
  children,
  actionTitle,
  additionalContent,
  supplementProduct,
}: AdditionalContentDialogProps) {
  const [open, setOpen] = useState(false);
  const { track } = useAnalytics();
  const { width } = useWindowDimensions();
  const openedAtRef = useRef<string | null>(null);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        openedAtRef.current = new Date().toISOString();
        track('protocol_reveal_additional_content_dialog_opened', {
          action_title: actionTitle,
        });
      } else if (openedAtRef.current) {
        track('protocol_reveal_additional_content_dialog_closed', {
          action_title: actionTitle,
          opened_at: openedAtRef.current,
        });
        openedAtRef.current = null;
      }
      setOpen(newOpen);
    },
    [actionTitle, track],
  );

  const content = (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <H3 className="text-2xl">More details</H3>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-secondary"
          >
            <X className="size-4" />
          </Button>
        </DialogClose>
      </div>

      <div className="space-y-4">
        <ProtocolMarkdown
          content={additionalContent}
          className="[&>div]:text-secondary"
        />
      </div>

      {supplementProduct && (
        <div className="space-y-2">
          <H4>Recommended product</H4>
          <SupplementPreview product={supplementProduct} />
        </div>
      )}

      <div className="space-y-3">
        <H4>Ask Superpower AI</H4>
        <AiSuggestions
          context={`I'm reviewing additional details${actionTitle ? ` for: ${actionTitle}` : ''}.${additionalContent ? ` Key info: ${additionalContent.slice(0, 200)}...` : ''} Suggest helpful questions.`}
          limit={3}
          eventName="clicked_additional_content_ai_suggestion"
        />
      </div>
    </div>
  );

  if (width <= 1024) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex h-[calc(100vh-6rem)] flex-col rounded-t-3xl p-0 md:p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-3xl p-0">
        {content}
      </DialogContent>
    </Dialog>
  );
}
