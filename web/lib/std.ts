const sum = (arr: number[]) => arr.reduce((p, c) => p + c);
const sum2 = (arr: number[]) => arr.reduce((p, c) => p + c * c);
const variance = (arr: number[]) =>
  sum2(arr) / arr.length - (sum(arr) / arr.length) ** 2;
const std = (arr: number[]) => Math.sqrt(variance(arr));
export { sum, sum2, variance, std };
