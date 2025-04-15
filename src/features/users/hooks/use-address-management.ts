import { useState } from 'react';

import { useEditAddress } from '@/features/users/api';
import { useUser } from '@/lib/auth';
import { ActiveAddress } from '@/types/api';

export function useAddressManagement() {
  const { data: user } = useUser();
  const editUserAddressMutation = useEditAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >(user?.primaryAddress?.id);

  const setDefaultAddress = async (address: ActiveAddress) => {
    setSelectedAddressId(address.id);
    await editUserAddressMutation.mutateAsync({
      data: {
        primaryAddressId: address.id,
      },
    });
  };

  return {
    selectedAddressId,
    setDefaultAddress,
    addresses: user?.activeAddresses || [],
    primaryAddressId: user?.primaryAddress?.id,
  };
}
