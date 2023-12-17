import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

type QueueItem = {
    key: number
    stepsTaken: number
    heatLoss: number
    cell: GridCell<number>
    direction: "R" | "L" | "D" | "U"
    sameDirectionCount: number
}

const text = await Deno.readTextFile("./Day17/input.txt")

const minCount = 4;
const maxCount = 10;
const grid = new Grid<number>(text, value => Number(value))

const cellToKey = (cell: GridCell<number>, direction: string, directionCount: number) => `${cell.x},${cell.y}.${direction}.${directionCount}`

const queue = [] as QueueItem[]
const start = grid.cells.find(item => item.x === 0 && item.y === 0)!
const end = grid.cells.find(item => item.x === grid.width - 1 && item.y === grid.height - 1)!
queue.push({key: 0, stepsTaken: 0, heatLoss: 0, cell: start, direction: "R", sameDirectionCount: 1})

const reached = new Set<string>()

const getLowest = () => {
    queue.sort((a, b) => a.key - b.key)
    const lowest = queue.shift()
    return lowest
}

let i = 0;
let answer = 0;
while (true) {
    i++
    const lowest = getLowest()

    if (!lowest) break;
    
    if (reached.has(cellToKey(lowest.cell, lowest.direction, lowest.sameDirectionCount))) continue
    
    reached.add(cellToKey(lowest.cell, lowest.direction, lowest.sameDirectionCount))
    
    const cell = lowest.cell;

    if (cell.x === end.x && cell.y === end.y) {
        answer = lowest.heatLoss
        break;
    }

    const neighbours = cell.getAdjacentNeighbours()

    for (const neighbour of neighbours) {
        if (!neighbour) continue;

        const isInSameDirection = neighbour.x > cell.x && lowest.direction === "R"
            || neighbour.x < cell.x && lowest.direction === "L"
            || neighbour.y > cell.y && lowest.direction === "D"
            || neighbour.y < cell.y && lowest.direction === "U"

        if (!isInSameDirection && lowest.sameDirectionCount < minCount) continue;

        if (isInSameDirection && lowest.sameDirectionCount >= maxCount) continue;

        const isReverse = neighbour.x > cell.x && lowest.direction === "L"
            || neighbour.x < cell.x && lowest.direction === "R"
            || neighbour.y > cell.y && lowest.direction === "U"
            || neighbour.y < cell.y && lowest.direction === "D"

        if (isReverse) continue;
        
        const newHeatLoss = lowest.heatLoss + neighbour.value;

        const newDirection = neighbour.x > cell.x 
            ? "R" 
            : neighbour.x < cell.x 
                ? "L" 
                : neighbour.y > cell.y 
                    ? "D" 
                    : "U"

        queue.push({
            key: newHeatLoss,
            cell: neighbour, 
            stepsTaken: lowest.stepsTaken + 1, 
            heatLoss: newHeatLoss, 
            direction: newDirection, 
            sameDirectionCount: isInSameDirection 
                ? lowest.sameDirectionCount + 1 
                : 1
        })
    }
}

console.log(answer)