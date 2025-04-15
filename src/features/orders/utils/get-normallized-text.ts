export const getNormalizedText = (text: string) => {
  // keep state codes as uppercase
  if (text.length === 2 && text === text.toUpperCase()) {
    return text;
  }

  // convert all caps to title case
  if (text === text.toUpperCase()) {
    const lowercase = text.toLowerCase();
    return lowercase
      .split(' ')
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  }

  return text;
};
