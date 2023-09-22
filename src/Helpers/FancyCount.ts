export function FancyCount(str: string): number {
  return Array.from(str.split(/[\ufe00-\ufe0f]/).join('')).length;
}
