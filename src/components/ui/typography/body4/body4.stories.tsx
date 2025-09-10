import { Meta, StoryObj } from '@storybook/react';

import { Body4 } from './body4';

const meta: Meta<typeof Body4> = {
  component: Body4,
};

export default meta;

type Story = StoryObj<typeof Body4>;

export const Default: Story = {
  args: {
    children: 'A new era of personal health',
  },
};
