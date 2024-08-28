import { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const DefaultButton = () => {
  return <Button>Superpower</Button>;
};

export const Default: Story = {
  render: () => <DefaultButton />,
};

const OutlineButton = () => {
  return <Button variant="outline">Superpower</Button>;
};

export const Outline: Story = {
  render: () => <OutlineButton />,
};

const GhostButton = () => {
  return <Button variant="ghost">Superpower</Button>;
};

export const Ghost: Story = {
  render: () => <GhostButton />,
};
