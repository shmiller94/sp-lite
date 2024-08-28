import { Meta, StoryObj } from '@storybook/react';

import { Body2 } from './body2';

const meta: Meta<typeof Body2> = {
  component: Body2,
};

export default meta;

type Story = StoryObj<typeof Body2>;

export const Default: Story = {
  args: {
    children: 'A new era of personal health',
  },
};
