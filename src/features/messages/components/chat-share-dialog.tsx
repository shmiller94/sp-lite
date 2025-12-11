import { motion } from 'framer-motion';
import { Copy, Share, X } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import type React from 'react';

import { AIIcon } from '@/components/icons/ai-icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Body1, H2 } from '@/components/ui/typography';
import { env } from '@/config/env';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { cn } from '@/lib/utils';
import { Visibility } from '@/types/api';

import { useHistory } from '../api/get-history';
import { useMessages } from '../api/get-messages';
import { useUpdateChat } from '../api/update-chat';
import {
  getLastAiMessage,
  getLastUserMessage,
} from '../utils/get-last-messages';

import { Markdown } from './ai/markdown';

export function ChatShareDialog({
  chatId,
  open: openProp,
  onOpenChange,
}: {
  chatId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? (openProp as boolean) : internalOpen;
  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (!isControlled) setInternalOpen(v);
  };
  const [visibility, setVisibility] = useState<Visibility>('private');
  const enabled = useMemo(() => open && !!chatId, [open, chatId]);

  const messagesQuery = useMessages({
    chatId,
    queryConfig: {
      enabled,
      staleTime: 0,
    },
  });
  const historyQuery = useHistory({
    queryConfig: {
      enabled,
      staleTime: 0,
    },
  });

  const selectedChat = useMemo(
    () => historyQuery.data?.find((c) => c.id === chatId),
    [historyQuery.data, chatId],
  );

  const lastUserMessage = getLastUserMessage(messagesQuery.data);
  const lastAiMessage = getLastAiMessage(messagesQuery.data);

  // Sync local state only when the server value changes.
  useEffect(() => {
    const serverVisibility = selectedChat?.visibility;
    if (serverVisibility) {
      setVisibility(serverVisibility);
    }
  }, [selectedChat?.visibility]);

  const updateChatMutation = useUpdateChat({});

  const handleToggleVisibility = (checked: boolean) => {
    if (isBusy) return;

    const prev = visibility;
    const next: Visibility = checked ? 'private' : 'public';

    setVisibility(next);

    updateChatMutation.mutate(
      { chatId, data: { visibility: next } },
      {
        onSuccess: () => {
          toast.success(`Visibility set to ${next}`);
        },
        onError: () => {
          setVisibility(prev);
          toast.error('Failed to update visibility');
        },
      },
    );
  };

  const handleCopy = async () => {
    try {
      const url = `${env.WEBSITE_URL}/share/chat/${chatId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Copied link to clipboard');
    } catch (e) {
      toast.error('Failed to copy link');
    }
  };

  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  // Only block toggling while an update is in flight.
  const isBusy = updateChatMutation.isPending;

  const content = () => (
    <>
      <div className='w-full overflow-hidden bg-[url("/chat/share-chat.webp")] bg-cover px-8 pt-14'>
        <motion.div
          className="pointer-events-none space-y-6"
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: { staggerChildren: 0.15, delayChildren: 0.05 },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
              show: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.35, delay: 0.2, ease: 'easeOut' },
              },
            }}
            className="ml-auto w-fit max-w-xs rounded-xl border border-white/10 bg-black/15 p-2 backdrop-blur"
          >
            <Body1 className="text-white">{lastUserMessage}</Body1>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
              show: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.35, delay: 0.5, ease: 'easeOut' },
              },
            }}
            className="max-h-32 [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
          >
            <div className="mr-auto w-fit max-w-xs text-white/75">
              <Markdown>{lastAiMessage ?? ''}</Markdown>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="space-y-6 p-6 pt-10">
        <div className="space-y-2">
          <H2 className="text-center">Share this chat</H2>
          <Body1 className="text-balance text-center text-secondary">
            Share this chat with your doctor, family or friends.
          </Body1>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          {historyQuery.isLoading || messagesQuery.isLoading ? (
            <Skeleton className="h-7 w-12 rounded-full" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="m-0 h-6">
                  <Switch
                    checked={visibility === 'private'}
                    onCheckedChange={handleToggleVisibility}
                    disabled={isBusy}
                    aria-label="Toggle chat visibility"
                  />
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>
                    Setting the visibilty to public makes your chat visible to
                    the whole world.
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
          )}
          <Body1 className="text-secondary">Keep this chat private</Body1>
        </div>
        <div className="flex w-full flex-col space-y-1 pt-4">
          <Button
            variant="default"
            className="gap-2 rounded-full text-center"
            onClick={handleCopy}
            disabled={!chatId || visibility !== 'public'}
          >
            <Copy className="size-4" />
            Copy
          </Button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Trigger />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-0 overflow-hidden rounded-t-2xl p-0">
          <SheetHeader className="sr-only px-6 pb-4 pt-12">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <AIIcon className="-mt-0.5" />
              Chat Settings
            </SheetTitle>
            <SheetClose asChild className="-mt-4">
              <div className="flex h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full">
                <X className="h-4 min-w-4" />
              </div>
            </SheetClose>
          </SheetHeader>
          {content()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trigger />
      </DialogTrigger>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="sr-only px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AIIcon className="-mt-0.5" />
            Chat Settings
          </DialogTitle>
        </DialogHeader>
        <DialogClose>
          <Button
            variant="glass"
            className="absolute right-4 top-4 flex aspect-square size-8 items-center justify-center bg-transparent p-0 transition-all hover:bg-white/10 hover:backdrop-blur-[2px]"
          >
            <X className="size-4" />
          </Button>
        </DialogClose>
        {content()}
      </DialogContent>
    </Dialog>
  );
}

const Trigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="medium"
    className={cn('hover:bg-zinc-100 hover:text-primary py-2', className)}
    {...props}
  >
    <Share size={16} className="mr-2" />
    Share
  </Button>
));

Trigger.displayName = 'Trigger';
