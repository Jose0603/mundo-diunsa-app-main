export const ToSentenceCase = (str: string): string => {
  if (str.trim().length === 0) return '';
  const words = str.toLowerCase().split(' ');
  return words
    .map((word, index) => {
      words[index] = word[0].toUpperCase() + word.slice(1);
    })
    .join(' ');
};
