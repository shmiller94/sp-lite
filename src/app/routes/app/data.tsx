import { ContentLayout } from '@/components/layouts';
import { BiologicalAgeCard } from '@/features/biomarkers/components/biological-age-card';
import { BiomarkersDataTable } from '@/features/biomarkers/components/biomarkers-data-table/biomarker-data-table';
import { BiomarkersSummaryCard } from '@/features/biomarkers/components/biomarkers-summary-card';

export const DataRoute = () => {
  return (
    <ContentLayout title="Data" bgColor="zinc">
      <section
        id="summary"
        className="flex flex-col gap-5 pt-6 lg:flex-row lg:pb-16"
      >
        <BiologicalAgeCard />
        <BiomarkersSummaryCard />
      </section>
      <section id="data">
        <BiomarkersDataTable />
      </section>
    </ContentLayout>
  );
};
