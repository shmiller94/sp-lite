import { Meta, StoryObj } from '@storybook/react';

import { H4 } from './h4';

const meta: Meta<typeof H4> = {
  component: H4,
};

export default meta;

type Story = StoryObj<typeof H4>;

export const Default: Story = {
  args: {
    children: 'A new era of personal health',
  },
};
