import { ContentLayout } from '@/components/layouts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { H1 } from '@/components/ui/typography';
import { FinishScheduleList } from '@/features/services/components/finish-schedule-list';
import { OrdersList } from '@/features/services/components/orders-list';
import { ServicesList } from '@/features/services/components/services-list';

export const ServicesRoute = () => {
  return (
    <ContentLayout title="Services">
      <H1>Services</H1>
      <section id="orders" className="space-y-6">
        <Tabs defaultValue="all" className="overflow-auto">
          <TabsList className="flex w-fit items-center justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="schedule">To be scheduled</TabsTrigger>
            <TabsTrigger value="orders">Your orders</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="py-6 md:py-[72px]">
            <ServicesList />
          </TabsContent>
          <TabsContent value="schedule" className="py-6 md:py-[72px]">
            <FinishScheduleList />
          </TabsContent>
          <TabsContent value="orders" className="py-6 md:py-[72px]">
            <OrdersList />
          </TabsContent>
        </Tabs>
      </section>
    </ContentLayout>
  );
};
