export function sentenceCase(str: string) {
  if (str === null || str === '') return undefined;
  else str = str?.toString();

  return str?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
