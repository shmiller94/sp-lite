import { PhlebotomyLocation } from '@/types/api';
import { formatAddress } from '@/utils/format';

export const openInMaps = (
  location: PhlebotomyLocation,
  mapType: 'google' | 'apple',
): void => {
  const address = formatAddress(location.address);
  const provider = location.name.toLowerCase().includes('labcorp')
    ? 'Labcorp'
    : 'BioReference Patient Service Center';

  const encodedQuery = encodeURIComponent(`${provider} ${address}`);

  const urls = {
    google: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
    apple: `https://maps.apple.com/?q=${encodedQuery}`,
  };

  window.open(urls[mapType], '_blank');
};
