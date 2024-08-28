import { Dot, MoreVertical, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Body1, Body2, Body3 } from '@/components/ui/typography';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { AddressInput } from '@/shared/api/update-profile';

/*
 * I could have made it reusable for entire app but
 * design requirment was that it doesn't open modal
 * so we are going to have two versions of this
 *
 * P.S. I don't want to have 5 function handlers passed in just to make this reusable
 *
 * callback: () => void: used to set additional fields in onboarding context
 * */
const AddressSelect = ({
  setIsEditingAddress,
  setIsAddingAddress,
  callback,
}: {
  setIsEditingAddress: () => void;
  setIsAddingAddress: () => void;
  callback?: (address: AddressInput) => void;
}) => {
  // TODO: change for user addresses call
  const { address, updateAddress } = useOnboarding();

  return (
    <div className="rounded-xl border border-zinc-200">
      <RadioGroup className="p-2">
        <div className="flex w-full items-center gap-4 rounded-lg bg-[#F7F7F7] px-4 py-3">
          <RadioGroupItem
            value="changeme"
            className="min-h-5 min-w-5 border-zinc-200"
            onClick={() => {
              // TODO: change this for specific value
              updateAddress(address as AddressInput);
              callback && callback(address as AddressInput);
            }}
          />
          <div className="w-full">
            <div className="flex items-center gap-1">
              <Body1 className="text-zinc-600">
                {`${address?.line1} ${address?.line2}`}
              </Body1>
              <div className="hidden items-center gap-1 xl:flex">
                <Dot className="text-zinc-500" />
                <Body3 className="text-zinc-500">Default address</Body3>
              </div>
            </div>
            <div className="space-y-1">
              <Body3 className="line-clamp-1 text-zinc-400">
                {`${address?.city}, ${address?.state}, ${address?.postalCode}, United States`}
              </Body3>
              <Body3 className="text-zinc-500 xl:hidden">Default address</Body3>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="size-4 cursor-pointer text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-2">
              <DropdownMenuItem
                className="cursor-pointer rounded-lg p-4 text-base font-normal text-zinc-500"
                onClick={setIsEditingAddress}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg p-4 text-base  font-normal text-zinc-500">
                Set default
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg p-4  text-base font-normal text-[#B90090] focus:bg-[#FFF6FD] focus:text-[#B90090]">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </RadioGroup>
      <div className="group flex cursor-pointer items-center gap-1.5 px-6 pb-3">
        <Plus className="size-[14px] text-zinc-400 transition-colors group-hover:text-zinc-500" />
        <Body2
          className="text-zinc-400 transition-colors group-hover:text-zinc-500"
          onClick={setIsAddingAddress}
        >
          Add address
        </Body2>
      </div>
    </div>
  );
};

export { AddressSelect };
