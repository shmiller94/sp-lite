import { Answer } from '@/types/api';

export const getTypeformAnswerText = (answer: Answer) => {
  let answerText = 'N/A';
  switch (answer.type) {
    case 'text':
    case 'long_text':
    case 'short_text':
      answerText = answer.text || 'N/A';
      break;
    case 'choice':
      answerText = answer.choice?.label || 'N/A';
      break;
    case 'choices':
      if (answer.choices && Array.isArray(answer.choices.labels)) {
        answerText = answer.choices.labels.join(', ');
      } else {
        answerText = 'N/A';
      }
      break;
    case 'number':
      answerText = answer.number?.toString() || 'N/A';
      break;
    case 'boolean':
      answerText =
        'boolean' in answer && typeof (answer as any).boolean === 'boolean'
          ? (answer as any).boolean
            ? 'Yes'
            : 'No'
          : 'N/A';
      break;
    default:
      answerText = 'N/A';
  }

  return answerText;
};
