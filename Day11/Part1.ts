import "../utils/index.ts"

const text = await Deno.readTextFile("./Day11/input.txt")

const lines = text.splitLb();

const galaxies = [];
for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
        if (lines[y][x] === "#") {
            galaxies.push({ x, y });
        }
    }
}

const offset = 2

// Handle rows
for (let y = lines.length - 1; y >= 0 ; y--) {
    const line = lines[y];
    if ([...line].every(x => x === ".")) {
        for (const galaxy of galaxies) {
            if (galaxy.y > y) galaxy.y += offset - 1
        }
    }
}

// Handle columns
for (let x = lines[0].length - 1; x >= 0; x--) {
    const column = lines.map(line => line[x]);
    if (column.every(x => x === ".")) {
        for (const galaxy of galaxies) {
            if (galaxy.x > x) galaxy.x += offset - 1
        }
    }
}

const pairs = [] as {first: { x: number, y: number}, second: { x: number, y: number}}[]
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        pairs.push({first: galaxies[i], second: galaxies[j]})
    }
}

const manhattan = (x0: number, y0: number, x1: number, y1: number) => Math.abs(x0 - x1) + Math.abs(y0 - y1)

const answer = pairs
    .map(item => manhattan(item.first.x, item.first.y, item.second.x, item.second.y))
    .sum()

console.log(answer);