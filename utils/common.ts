// Calculate GCD using Euclidean algorithm
export const gcd = (a: number, b: number): number => {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Calculate LCM of two numbers
export const lcm = (a: number, b: number): number => {
    const gcdAB = gcd(a, b);
    return (a * b) / gcdAB;
}