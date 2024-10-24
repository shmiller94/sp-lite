import { Spinner } from '@/components/ui/spinner';
import { Body2, H1, H4 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/biomarkers/api';
import { calculateDNAmAge } from '@/features/biomarkers/utils/calculate-dnam-age';
import { useCurrentPatient } from '@/features/rdns/hooks/use-current-patient';
import { useUser } from '@/lib/auth';
import { yearsSinceDate } from '@/utils/format';

export const BiologicalAgeCard = (): JSX.Element => {
  const biomarkersQuery = useBiomarkers();
  const { data: user } = useUser();
  const { selectedPatient } = useCurrentPatient();

  if (biomarkersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" />
      </div>
    );
  }

  if (!biomarkersQuery.data) return <></>;
  if (!user) return <></>;

  const dateOfBirth = selectedPatient
    ? selectedPatient.dateOfBirth
    : user.dateOfBirth;

  const biologicalAge = calculateDNAmAge(
    biomarkersQuery.data.biomarkers,
    dateOfBirth,
  );

  const ageDifference = biologicalAge
    ? Math.round((yearsSinceDate(dateOfBirth) - biologicalAge) * 10) / 10.0
    : null;

  return (
    <div
      className="flex h-[276px] w-full flex-col items-center justify-between rounded-3xl p-6"
      style={{
        backgroundImage: 'url("/cards/age-card.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <H4 className="text-white">Biological Age</H4>

      <div className="flex flex-col items-center">
        <H1 className="text-6xl text-white">{biologicalAge || '--'}</H1>
        <Body2 className="text-white">years old</Body2>
      </div>

      <Body2 className="text-white">
        {ageDifference !== null ? Math.abs(ageDifference) : '--'} years{' '}
        {ageDifference && ageDifference > 0 ? 'younger' : 'older'} than your
        actual age
      </Body2>
    </div>
  );
};
