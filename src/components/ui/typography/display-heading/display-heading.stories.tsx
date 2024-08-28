import { Meta, StoryObj } from '@storybook/react';

import { DisplayH } from './display-heading';

const meta: Meta<typeof DisplayH> = {
  component: DisplayH,
};

export default meta;

type Story = StoryObj<typeof DisplayH>;

export const Default: Story = {
  args: {
    children: 'A new era of personal health',
  },
};
