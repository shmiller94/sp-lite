import { PdfViewer } from '@/components/shared/pdf-viewer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export const UpsellSampleReportDialog = ({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) => {
  const { width } = useWindowDimensions();

  if (width <= 768) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px]">
          <PdfViewer name="Sample Report" url={url} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-full max-h-[80%] max-w-2xl">
        <PdfViewer name="Sample Report" url={url} />
      </DialogContent>
    </Dialog>
  );
};
