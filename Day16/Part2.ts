import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

type QueueItem = {
    cell: GridCell<string>
    direction: string
}

const text = await Deno.readTextFile("./Day16/input.txt")

const grid = new Grid<string>(text)

const cellToKey = (cell: GridCell<string>, direction: string) => `${cell.x},${cell.y}.${direction}`

const getNextCell = (item: QueueItem) => {
    if (item.direction === "U") return item.cell.up()
    if (item.direction === "D") return item.cell.down()
    if (item.direction === "L") return item.cell.left()
    if (item.direction === "R") return item.cell.right()
}

const cache = new Map<string, QueueItem[]>()

const processCell = (key: string, cell: GridCell<string>, direction: string) => {
    if (cache.has(key)) {
        return cache.get(key)!
    }

    const nextCell = getNextCell({ cell: cell, direction: direction })
    if (!nextCell) {
        cache.set(key, [])
        return []
    }

    const values = [] as QueueItem[]
    switch (nextCell.value) {
        case "/": {
            values.push({ cell: nextCell, direction: direction === "U" ? "R" : direction === "R" ? "U" : direction === "D" ? "L" : "D"})
            break;
        }
        case "\\": {
            values.push({ cell: nextCell, direction: direction === "U" ? "L" : direction === "L" ? "U" : direction === "D" ? "R" : "D"})
            break;
        }
        case "-": {
            if (direction === "U" || direction === "D") {
                values.push({ cell: nextCell, direction: "R" })
                values.push({ cell: nextCell, direction: "L" })
            } else {
                values.push({ cell: nextCell, direction: direction })
            }
            break;
        }
        case "|": {
            if (direction === "L" || direction === "R") {
                values.push({ cell: nextCell, direction: "U" })
                values.push({ cell: nextCell, direction: "D" })
            } else {
                values.push({ cell: nextCell, direction: direction })
            }
            break;
        }
        case ".": {
            values.push({ cell: nextCell, direction: direction })
            break;
        }
    }
    cache.set(key, values)
    return values
}

const doRunForStartCoord = (x: number, y: number, direction: string) => {
    const queue = [{
        cell: grid.cells.find(item => item.x === x && item.y === y)!,
        direction: direction
    }] as QueueItem[]
    
    const visited = new Set<string>()

    while (queue.length > 0) {
        const cell = queue.shift()!
    
        const key = cellToKey(cell.cell, cell.direction)
    
        if (visited.has(key)) continue;
    
        visited.add(key)

        const values = processCell(key, cell.cell, cell.direction)
        queue.push(...values)
    }

    const items = [...visited.keys()].map(item => item.split(".")[0])
    return new Set(items).size
}

let answer = 0;
for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {

        const directions = [] as string[]

        if (y === 0) directions.push("D")
        if (y === grid.height - 1) directions.push("U")
        if (x === 0) directions.push("R")
        if (x === grid.width - 1) directions.push("L")

        if (directions.length === 0) continue;

        for (const direction of directions) {
            const result = doRunForStartCoord(x, y, direction)
            if (result > answer) answer = result
        }
    }
}

console.log(answer)