interface SearchParamOptions {
  [key: string]: unknown;
}

export const FormatUrlParams = (params: Partial<SearchParamOptions>): string => {
  return Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .map(([k, v], idx) => `${idx === 0 ? '?' : '&'}${k}=${v}`)
    .join('');
};
