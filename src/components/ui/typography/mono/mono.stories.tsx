import { Meta, StoryObj } from '@storybook/react';

import { Mono } from './mono';

const meta: Meta<typeof Mono> = {
  component: Mono,
};

export default meta;

type Story = StoryObj<typeof Mono>;

export const Default: Story = {
  args: {
    children: 'A new era of personal health',
  },
};
