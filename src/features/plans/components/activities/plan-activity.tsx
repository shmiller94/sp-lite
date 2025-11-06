import {
  CarePlanActivity,
  CarePlanActivityDetail,
  Coding,
} from '@medplum/fhirtypes';

import { Button } from '@/components/ui/button';
import { Body2, H4 } from '@/components/ui/typography';
import { useMarketplace } from '@/features/marketplace/api/get-marketplace';
import { useServices } from '@/features/services/api';
import { useProducts } from '@/features/supplements/api';
import { HealthcareService, Product } from '@/types/api';
import { getPrescriptionImage } from '@/utils/prescription';

import { CARE_PLAN_ACTIVITY_TYPE_EXTENSION } from '../../const/extension-types';
import { extractCitations } from '../../utils/extract-citations';
import { normalizeRxCode } from '../../utils/normalize-rx-code';
import { PlanMarkdown } from '../plan-markdown';

import { ActivityCard } from './activity-card';
import { ProductCard } from './product-card';
import { ServiceCard } from './service-card';

interface PlanActivityProps {
  activity: CarePlanActivity;
  className?: string;
}

export const ServiceActivity = ({
  service,
  serviceCoding,
  detail,
  className,
}: {
  service: HealthcareService;
  serviceCoding?: Coding;
  detail?: CarePlanActivityDetail;
  className?: string;
}) => {
  const serviceName =
    service.name || serviceCoding?.display || 'Unnamed Service';
  const serviceDesc =
    detail?.description || service.description || 'Book your appointment';
  const citations = extractCitations(detail);

  return (
    <div className="mt-8 space-y-2">
      <H4>{serviceName}</H4>
      <PlanMarkdown
        content={serviceDesc}
        citations={citations}
        boldVermillion
      />
      <ServiceCard
        service={service}
        serviceCoding={serviceCoding}
        className={className}
      />
    </div>
  );
};

const ProductActivity = ({
  productCoding,
  detail,
  product,
  className,
}: {
  productCoding: Coding;
  detail?: CarePlanActivityDetail;
  product?: Product;
  className?: string;
}) => {
  const productName = productCoding.display || 'Unnamed Product';
  const productDesc = detail?.description || 'Recommended supplement';
  const citations = extractCitations(detail);

  return (
    <div className="mt-8 space-y-2">
      <H4 className="text-lg">{productName}</H4>
      <PlanMarkdown
        content={productDesc}
        citations={citations}
        boldVermillion
      />
      <ProductCard
        productName={productName}
        product={product}
        className={className}
      />
    </div>
  );
};

const PrescriptionActivity = ({
  productCoding,
  detail,
  className,
}: {
  productCoding: Coding;
  detail?: CarePlanActivityDetail;
  className?: string;
}) => {
  const rxDesc = detail?.description || 'Recommended prescription';
  const rxCode = productCoding.code;

  // todo: hack because the AIAP doesn't have the rx- prefix
  const formattedRxCode = normalizeRxCode(rxCode);

  const { data: marketplaceData, isError, isLoading } = useMarketplace();
  const prescription = marketplaceData?.prescriptions?.find(
    (item) => item.id === formattedRxCode,
  );
  const citations = extractCitations(detail);

  // I will replace this with a Zod schema in the real AIAP
  if (
    isLoading ||
    isError ||
    !prescription ||
    !prescription.url ||
    !prescription.price
  ) {
    // todo: add loader
    // This is getting changed within ~3 days so using at temp hack for now
    return null;
  }

  const rxImage = getPrescriptionImage(prescription?.name);
  const rxPdpUrl = `/prescriptions/${formattedRxCode}`;

  return (
    <div className="mt-8 space-y-2">
      <H4 className="text-lg">{prescription.name}</H4>
      <PlanMarkdown content={rxDesc} citations={citations} boldVermillion />
      <ActivityCard
        name={prescription.name}
        image={rxImage}
        link={rxPdpUrl}
        description={
          <Body2 className="italic text-zinc-500">
            Starting at ${prescription.price}
          </Body2>
        }
        className={className}
        actionBtn={
          <Button size="medium" asChild className="w-full flex-1 lg:w-auto">
            <a
              href={prescription.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Started
            </a>
          </Button>
        }
      />
    </div>
  );
};

export function PlanActivity({ activity, className }: PlanActivityProps) {
  const { detail } = activity;
  const { data: productsData } = useProducts({});
  const { data: servicesData } = useServices();
  const { data: addOnServicesData } = useServices({
    group: 'blood-panel-addon',
  });

  const productCoding = detail?.productCodeableConcept?.coding?.[0];
  const serviceCoding = detail?.code?.coding?.[0];

  // Check if this is a prescription activity
  const activityTypeExtension = detail?.extension?.find(
    (ext) => ext.url === CARE_PLAN_ACTIVITY_TYPE_EXTENSION,
  );
  const activityType = activityTypeExtension?.valueString;
  const isPrescription = activityType === 'rx-experimental';

  const product = productsData?.products?.find(
    (p) => p.id === productCoding?.code,
  );
  const allServices = [
    ...(servicesData?.services ?? []),
    ...(addOnServicesData?.services ?? []),
  ];

  const service =
    allServices.find((s) => s.id === serviceCoding?.code) ||
    (serviceCoding?.display
      ? allServices.find(
          (s) => s.name.toLowerCase() === serviceCoding.display?.toLowerCase(),
        )
      : undefined);

  // Handle prescription activities
  if (productCoding && isPrescription) {
    return (
      <PrescriptionActivity
        productCoding={productCoding}
        detail={detail}
        className={className}
      />
    );
  }

  // Handle regular product activities
  if (productCoding) {
    return (
      <ProductActivity
        productCoding={productCoding}
        detail={detail}
        product={product}
        className={className}
      />
    );
  }

  if (service) {
    return (
      <ServiceActivity
        service={service}
        serviceCoding={serviceCoding}
        detail={detail}
        className={className}
      />
    );
  }

  const citations = extractCitations(detail);

  return (
    <PlanMarkdown
      content={detail?.description || ''}
      citations={citations}
      boldVermillion
    />
  );
}
