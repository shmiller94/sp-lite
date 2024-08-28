import { Meta, StoryObj } from '@storybook/react';

import { Body3 } from './body3';

const meta: Meta<typeof Body3> = {
  component: Body3,
};

export default meta;

type Story = StoryObj<typeof Body3>;

export const Default: Story = {
  args: {
    children: 'A new era of personal health',
  },
};
