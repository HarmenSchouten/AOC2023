import "../utils/index.ts"

const text = await Deno.readTextFile("./Day21/input.txt")

const grid = text
    .splitLb()
    .map((l) => l.split(""));

const startY = grid.findIndex((l) => l.includes("S"));
const startX = grid[startY].findIndex((c) => c === "S");
grid[startY][startX] = ".";
const size = grid.length;

const encode = (y:number, x:number) => `${y},${x}`;
const decode = (p:string) => p.split(",").map(Number);

const neighbors = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];

const fill = (grid:string[][], y:number, x:number, n:number) => {
    let set = new Set<string>();

    set.add(encode(y, x));
    
    for (let i = 0; i < n - 1; i++) {
        
        const nSet = new Set<string>();
        
        for (const p of set.values()) {
            
            const [muhY, muhX] = decode(p);
            
            for (const [y, x] of neighbors) {
                const newY = muhY + y;
                const newX = muhX + x;
                if (newY < 0 || newY >= size || newX < 0 || newX >= size) continue;
                if (grid[newY][newX] === ".") nSet.add(encode(newY, newX));
            }
        }
        set = nSet;
    }
    return set.size;
}

const total = 26501365;
const n = total % size;

const smallDiamondEdges = [
    [size - 1, size - 1, n],
    [size - 1, 0, n],
    [0, size - 1, n],
    [0, 0, n],
].map(([y, x, n]) => fill(grid, y, x, n));

const largeDiamondEdges = [
    [size - 1, size - 1, n + size],
    [size - 1, 0, n + size],
    [0, size - 1, n + size],
    [0, 0, n + size],
].map(([y, x, n]) => fill(grid, y, x, n));

const center = [
    [0, startX, size],
    [size - 1, startX, size],
    [startY, 0, size],
    [startY, size - 1, size],
].map(([y, x, n]) => fill(grid, y, x, n));

const filled = [fill(grid, startY, startX, size - 1), fill(grid, startY, startX, size)];

const remainder = (total - n) / size;
let answer = 0;
answer += smallDiamondEdges.sum() * remainder;
answer += largeDiamondEdges.sum() * (remainder - 1);
answer += center.sum();
answer += filled[0] * (remainder - 1) ** 2;
answer += filled[1] * remainder ** 2;

console.log(answer)