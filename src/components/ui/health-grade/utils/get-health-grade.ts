export const getHealthGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A':
      return 'bg-green-100';
    case 'B':
      return 'bg-yellow-300';
    case 'C':
      return 'bg-pink-300';
    default:
      return 'bg-zinc-100';
  }
};
