export const getNumberOrUndefined = (str: string): number | undefined => {
  return isNaN(Number(str)) ? undefined : Number(str);
};
