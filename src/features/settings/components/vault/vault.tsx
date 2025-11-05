import { H2 } from '@/components/ui/typography';
import { FilesHub } from '@/features/files/components/files-hub';

export const Vault = () => {
  return (
    <div className="md:space-y-8">
      <FilesHub headerSlot={<H2>Health Records</H2>} />
    </div>
  );
};
