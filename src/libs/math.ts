export function turnStrToNum (n: string): number {
    return +n;
}

export function posVal (n: number): number {
    return Math.abs(n);
}

export function findMinimum (n: number, min: number, max: number): number {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}
