export function turnStrToNum (n: string): number {
  return +n;
}

export function posVal (n: number): number {
  return Math.abs(n);
}

export function findMinimum (n: number, min: number, max: number): number {
  // if (min === 0 || max === 0) return n;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

// 如果参数为数字返回，否则返回0
export function getNumber (value: any): number {
  if (typeof value === 'number') return value;
  return 0;
}
