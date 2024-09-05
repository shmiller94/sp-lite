import { CreatePlanInput } from '@/features/action-plan/api/create-action-plan';

export const generateDummyPlan = (orderId: string) => {
  const dummyPlan: CreatePlanInput = {
    orderId: orderId,
    title: '',
    description: '',
    published: false,
    goals: [],
  };

  return dummyPlan;
};
