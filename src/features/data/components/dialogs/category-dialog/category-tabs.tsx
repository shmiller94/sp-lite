import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { H3 } from '@/components/ui/typography';

export const CategoryTabs = ({ category }: { category: string }) => {
  return (
    <Tabs defaultValue="overview" className="min-h-96">
      <TabsList>
        <TabsTrigger value="overview">
          <span className="text-base">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="insights">
          <span className="text-base">Explanation</span>
        </TabsTrigger>
        <TabsTrigger value="grading">
          <span className="text-base">Grading</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 py-4">
        <div className="flex flex-col gap-2">
          <H3>Your {category} insights</H3>
        </div>
      </TabsContent>
    </Tabs>
  );
};
