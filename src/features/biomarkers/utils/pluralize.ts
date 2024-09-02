export const pluralizeIs = (word: string): string => {
  // Strip out any parentheses and whitespace
  word = word.replace(/\(.*\)/, '');
  word = word.replace(/\s/g, '');

  if (word.endsWith('s')) {
    return 'are';
  }
  return 'is';
};
