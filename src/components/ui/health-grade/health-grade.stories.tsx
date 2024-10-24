import { Meta, StoryObj } from '@storybook/react';

import { HealthGradeComponent } from './health-grade';

const meta: Meta<typeof HealthGradeComponent> = {
  component: HealthGradeComponent,
};

export default meta;

type Story = StoryObj<typeof HealthGradeComponent>;

const DemoGradeA = () => {
  return <HealthGradeComponent grade="A" />;
};
const DemoGradeB = () => {
  return <HealthGradeComponent grade="B" />;
};
const DemoGradeC = () => {
  return <HealthGradeComponent grade="C" />;
};
const DemoGradeOther = () => {
  return <HealthGradeComponent grade="" />;
};

export const A: Story = {
  render: () => <DemoGradeA />,
};

export const B: Story = {
  render: () => <DemoGradeB />,
};

export const C: Story = {
  render: () => <DemoGradeC />,
};

export const Other: Story = {
  render: () => <DemoGradeOther />,
};
