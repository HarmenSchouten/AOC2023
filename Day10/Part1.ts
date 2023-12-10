import "../utils/index.ts"

type Point = {
    x: number
    y: number
}

const pointToKey = (point: Point) => `${point.x},${point.y}`

const text = await Deno.readTextFile("./Day10/input.txt")

const grid = text.splitLb()
const height = grid.length
const width = grid[0].length

const connections = {} as Record<string, Point[]>
let start: Point | undefined    
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const cell = grid[y][x]
        if (cell === "L") connections[pointToKey({ x, y })] = [{ x: x, y: y - 1 }, {x: x + 1, y: y}]
        else if (cell === "J") connections[pointToKey({ x, y })] = [{ x: x, y: y - 1 }, {x: x - 1, y: y}]
        else if (cell === "7") connections[pointToKey({ x, y })] = [{ x: x, y: y + 1 }, {x: x - 1, y: y}]
        else if (cell === "F") connections[pointToKey({ x, y })] = [{ x: x, y: y + 1 }, {x: x + 1, y: y}]
        else if (cell === "|") connections[pointToKey({ x, y })] = [{ x: x, y: y - 1 }, {x: x, y: y + 1}]
        else if (cell === "-") connections[pointToKey({ x, y })] = [{ x: x - 1, y: y }, {x: x + 1, y: y}]
        else if (cell === "S") start = { x, y }
    }
}

connections[pointToKey(start!)] = [
    { x: start!.x, y: start!.y - 1 }, 
    { x: start!.x, y: start!.y + 1 }, 
    { x: start!.x - 1, y: start!.y }, 
    { x: start!.x + 1, y: start!.y }
]
const loop = []
let x = start!.x
let y = start!.y
let last:Point|undefined = undefined

while (true) {
    const currentConnections = connections[pointToKey({ x, y })]
    for (const connection of currentConnections) {
        if (last && connection.x === last?.x && connection.y === last?.y) continue;

        last = { x, y }
        x = connection.x
        y = connection.y
        loop.push({ x, y })
        break;
    }
    if (x === start?.x && y === start?.y) break;
}

const length = loop.length / 2

console.log(length)