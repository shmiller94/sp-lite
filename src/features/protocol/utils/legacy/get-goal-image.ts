export const getGoalImage = (index: number) => {
  switch (index) {
    case 0:
      return '/action-plan/goals/dune.webp';
    case 1:
      return '/action-plan/goals/particle.webp';
    case 2:
      return '/action-plan/goals/scan.webp';
    case 3:
      return '/action-plan/goals/fire.webp';
    case 4:
      return '/action-plan/goals/sun.webp';
    default:
      return '/action-plan/goals/dune.webp';
  }
};
