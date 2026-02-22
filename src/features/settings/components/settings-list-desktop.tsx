import {
  TabsContent,
  TabsList,
  TabsTrigger,
  URLTabs,
} from '@/components/ui/tabs';
import { Billing } from '@/features/settings/components/billing/billing';
import { Membership } from '@/features/settings/components/membership/membership';
import { Profile } from '@/features/settings/components/profile/profile';
import { OrdersList } from '@/features/settings/components/purchases/orders-list';
import { WearablesTable } from '@/features/settings/components/wearables/wearables-table';
import { capitalize } from '@/utils/format';

export const SettingsListDesktop = () => {
  const settings = [
    { component: <Profile />, value: 'profile' },
    { component: <Billing />, value: 'billing' },
    { component: <Membership />, value: 'membership' },
    { component: <OrdersList />, value: 'history' },
    { component: <WearablesTable />, value: 'integrations' },
  ];

  return (
    <>
      <URLTabs paramName="tab" defaultTab="profile" className="hidden md:block">
        <TabsList className="flex h-auto flex-wrap items-center justify-start">
          {settings.map((s) => (
            <TabsTrigger
              value={s.value}
              className="text-base lg:text-xl"
              key={s.value}
            >
              {capitalize(s.value)}
            </TabsTrigger>
          ))}
        </TabsList>
        {settings.map((s) => (
          <TabsContent value={s.value} className="mt-10" key={s.value}>
            {s.component}
          </TabsContent>
        ))}
      </URLTabs>
    </>
  );
};
