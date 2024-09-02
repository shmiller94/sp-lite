import { Meta, StoryObj } from '@storybook/react';

import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { cn } from '@/lib/utils';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

const DemoSidebar = () => {
  return (
    <div
      className={cn(
        'rounded-md flex flex-col-reversemd:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen', // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar />
      <Dashboard />
    </div>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex size-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-zinc-400 p-2 md:p-10">
        <div className="flex gap-2">
          {[...new Array(4)].map((i) => (
            <div
              key={'first' + i}
              className="h-20 w-full animate-pulse  rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i) => (
            <div
              key={'second' + i}
              className="size-full animate-pulse rounded-lg  bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <DemoSidebar />,
};
