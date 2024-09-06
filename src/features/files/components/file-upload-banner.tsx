import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreateFile } from '@/features/files/components/create-file';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export const FileUploadBanner = () => {
  const { width } = useWindowDimensions();
  return (
    <Card>
      <div className="flex flex-row items-center justify-between gap-4 p-12">
        <div>
          <h3 className="text-base text-primary lg:text-xl">
            Integrate your healthcare data into the Superpower ecosystem
          </h3>
        </div>
        <div className="flex flex-row items-center space-x-6">
          <CreateFile>
            <Button className="space-x-2.5">
              <div>
                <Upload className="size-4" />
              </div>
              <span>{width > 1280 ? 'Upload Document' : 'Upload'}</span>
            </Button>
          </CreateFile>
        </div>
      </div>
    </Card>
  );
};
