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

export function memoize<Args extends unknown[], Result>(
    func: (...args: Args) => Result,
): (...args: Args) => Result {
    const stored = new Map<string, Result>();

    return (...args) => {
        const k = JSON.stringify(args);
        if (stored.has(k)) {
            return stored.get(k)!;
        }
        const result = func(...args);
        stored.set(k, result);
        return result;
    };
}