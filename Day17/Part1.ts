import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

const text = await Deno.readTextFile("./Day17/input.txt")

const grid = new Grid<number>(text, value => Number(value))

const start = grid.cells.find(item => item.x === 0 && item.y === 0)!
const end = grid.cells.find(item => item.x === grid.width - 1 && item.y === grid.height - 1)!

const cellToKey = (cell: GridCell<number>, direction: string, directionCount: number) => 
    `${cell.x}.${cell.y}.${direction}.${directionCount}`

const queue = {} as Record<string, number>
queue[cellToKey(start, "R", 0)] = 0;

const steamMap = {} as Record<string, number>
steamMap[cellToKey(start, "R", 0)] = 0;

const getLowest = () => {
    const arr = Object.keys(queue);
    if (arr.length > 0) {
        const lowestItem = arr.reduce((acc, item) => queue[item] < queue[acc] ? item : acc)
    
        delete queue[lowestItem]
        
        return lowestItem    
    }
    return undefined
}

const getNewDirection = (isInSameDirection: boolean, direction: string, cell:GridCell<number>, adjacent: GridCell<number>) => {
    if (isInSameDirection) return direction
    if (adjacent.x > cell.x) return "R"
    if (adjacent.x < cell.x) return "L"
    if (adjacent.y > cell.y) return "D"
    if (adjacent.y < cell.y) return "U"
}

let answer = 0;

while (true) {
    const cellString = getLowest()

    if (!cellString) break;

    const [x, y, direction, directionCount] = cellString.split(".")

    if (x === String(end.x) && y === String(end.y)) {
        answer = steamMap[cellString]
        break;
    }

    const cell = grid.cells.find(item => item.x === Number(x) && item.y === Number(y))!

    const adjacents = cell.getAdjacentNeighbours()
    for (const adjacent of adjacents) {
        const isInSameDirection = adjacent.x > cell.x && direction === "R"
            || adjacent.x < cell.x && direction === "L"
            || adjacent.y > cell.y && direction === "D"
            || adjacent.y < cell.y && direction === "U"

        if (isInSameDirection && Number(directionCount) >= 3) continue;

        const isReverse = adjacent.x > cell.x && direction === "L"
            || adjacent.x < cell.x && direction === "R"
            || adjacent.y > cell.y && direction === "U"
            || adjacent.y < cell.y && direction === "D"

        if (isReverse) continue;

        const newDirection = getNewDirection(isInSameDirection, direction, cell, adjacent)!
        
        const newDirectionCount = isInSameDirection ? Number(directionCount) + 1 : 1

        const totalSteamLoss = steamMap[cellToKey(cell, direction, Number(directionCount))] + adjacent.value
        if (totalSteamLoss < (steamMap[cellToKey(adjacent, newDirection, newDirectionCount)] || Number.MAX_SAFE_INTEGER)) {
            const key = cellToKey(adjacent, newDirection, newDirectionCount)
            steamMap[key] = totalSteamLoss
            queue[key] = totalSteamLoss
        }
    }
}

console.log(answer)