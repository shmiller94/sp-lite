import { Database } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Body1 } from '@/components/ui/typography';
import { BiomarkersDataTable } from '@/features/biomarkers/components/biomarkers-data-table/biomarker-data-table';
import { DataCards } from '@/features/biomarkers/components/data-cards';
import { useAnalytics } from '@/hooks/use-analytics';

export const DataRoute = () => {
  const navigate = useNavigate();
  const { track } = useAnalytics();

  useEffect(() => {
    track('viewed_data');
  }, [track]);

  return (
    <ContentLayout title="Data">
      <Header
        title="Data"
        className="-mt-1.5" // update title pushed a bit down due to centered flexbox, push up 1.5rem to align with other pages heights
        callToAction={
          <Button
            variant="outline"
            className="gap-2.5 bg-white"
            onClick={() => navigate('/vault')}
          >
            <Database className="size-[14px] text-zinc-400" />
            <Body1 className="text-zinc-500">Health Records</Body1>
          </Button>
        }
      />
      <DataCards />
      <section id="data">
        <BiomarkersDataTable />
      </section>
    </ContentLayout>
  );
};
