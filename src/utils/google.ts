import { FormAddressInput, GoogleAddressComponent } from '@/types/address';

export const getCity = (
  address_components: GoogleAddressComponent[],
): string => {
  // In order of priority
  const types = [
    'locality',
    'sublocality',
    'neighborhood',
    'administrative_area_level_2',
  ];
  for (const t of types) {
    const comp = address_components.find((c) => c.types.includes(t));
    if (comp) return comp.long_name;
  }
  console.error('No city found in address components', address_components);
  return '';
};

export const addressFromGoogleComponents = (
  address_components: GoogleAddressComponent[],
): FormAddressInput => {
  const aptNumber = address_components.find((a) =>
    a.types.includes('subpremise'),
  )?.long_name;
  const streetNumber = address_components.find((a) =>
    a.types.includes('street_number'),
  )?.long_name;
  const route = address_components.find((a) =>
    a.types.includes('route'),
  )?.long_name;
  const city = getCity(address_components);
  const state =
    address_components.find((a) =>
      a.types.includes('administrative_area_level_1'),
    )?.short_name ?? '';
  const postalCode =
    address_components.find((a) => a.types.includes('postal_code'))
      ?.long_name ?? '';

  const line1 = `${streetNumber || ''} ${route || ''}`;
  const line2 = aptNumber ? `${aptNumber}` : undefined;

  return {
    line1,
    line2,
    city,
    state,
    postalCode,
  };
};
