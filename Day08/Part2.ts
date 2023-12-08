import "../utils/index.ts"

const text = await Deno.readTextFile("./Day08/input.txt")

const parts = text.splitDlb()

const instructions = [...parts[0].splitLb()[0]]

const nodes = parts[1]
    .splitLb()
    .map(line => {
        const [key, rest] = line.split(" = ")
        const [left, right] = rest
            .replaceAll("(", "")
            .replaceAll(")", "")
            .split(", ")
        return {
            key: key,
            left: left,
            right: right
        }
    })

const startNodes = nodes.filter(node => node.key.endsWith("A"))!

const idxMap = new Map<string, number>()

startNodes.forEach(node => {
    let start = node
    idxMap.set(start.key, 0)

    while (true) {
        const index = idxMap.get(node.key)!
        idxMap.set(node.key, index + 1)
        const instruction = instructions[index % instructions.length]
        if (instruction === "L") start = nodes.find(node => node.key === start.left)!
        if (instruction === "R") start = nodes.find(node => node.key === start.right)!
        if (start.key.endsWith("Z")) break;
    }
})

console.log(lcmOfArray([...idxMap.values()]))

// Calculate GCD using Euclidean algorithm
function gcd(a: number, b: number): number {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Calculate LCM of two numbers
function lcm(a: number, b: number): number {
    const gcdAB = gcd(a, b);
    return (a * b) / gcdAB;
}

// Calculate LCM of an array of numbers
function lcmOfArray(numbers: number[]): number {
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }
    return result;
}
