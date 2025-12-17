import { useNavigate } from 'react-router-dom';

import { SelectableCard } from '@/components/shared/selectable-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/features/services/api';
import { BiomarkerRecommendedTests } from '@/types/api';
import { getServiceImage } from '@/utils/service';

export const BiomarkerServiceSuggestions = ({
  recommendedTests,
}: {
  recommendedTests: BiomarkerRecommendedTests;
}) => {
  const recommendedServiceIds = new Set(
    recommendedTests.services.map((s) => s.id),
  );

  return (
    <div className="space-y-2">
      <SuggestedServices serviceIds={recommendedServiceIds} />
    </div>
  );
};

const SuggestedServices = ({ serviceIds }: { serviceIds: Set<string> }) => {
  const navigate = useNavigate();
  const getServicesQuery = useServices({ group: 'phlebotomy' });

  if (getServicesQuery.isLoading) {
    return <Skeleton className="h-[106px] w-full rounded-[20px]" />;
  }

  const services = getServicesQuery.data?.services;

  if (!services) {
    return null;
  }

  const filteredServices = services.filter((s) => serviceIds.has(s.id));

  if (filteredServices.length === 0) return null;

  return filteredServices.map((s) => (
    <SelectableCard
      key={s.id}
      title={s.name}
      imageSrc={getServiceImage(s.name)}
      description={s.description}
      onToggle={() => {
        navigate(`/services/${s.id}`);
      }}
      trigger={<Button size="small">Test now</Button>}
    />
  ));
};
