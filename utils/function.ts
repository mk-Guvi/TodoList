export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const suspendApi = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const searchValue = (value: string, compareValue: string) => {
  return compareValue?.toLowerCase()?.includes(value?.toLowerCase());
};

type makeIdPropsType = {
  prefixText?: string;
  onlyNumber?: boolean;
  length?: number;
};

export function makeId(props: makeIdPropsType) {
  const { prefixText, onlyNumber, length = 10 } = props;
  var text = prefixText ? `${prefixText}_` : '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (onlyNumber) possible = '1234567890';
  for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}