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

const doRunForStartCoord = (x: number, y: number, direction: string) => {
    const queue = [{
        cell: grid.cells.find(item => item.x === x && item.y === y)!,
        direction: direction
    }] as QueueItem[]
    
    const visited = new Set<string>()

    while (queue.length > 0) {
        const cell = queue.shift()!
    
        const nextCell = getNextCell(cell)

        const key = cellToKey(cell.cell, cell.direction)
    
        if (visited.has(key)) continue;
    
        visited.add(key)

        if (!nextCell) continue;
    
        switch (nextCell.value) {
            case "/": {
                queue.push({ cell: nextCell, direction: cell.direction === "U" ? "R" : cell.direction === "R" ? "U" : cell.direction === "D" ? "L" : "D"})
                break;
            }
            case "\\": {
                queue.push({ cell: nextCell, direction: cell.direction === "U" ? "L" : cell.direction === "L" ? "U" : cell.direction === "D" ? "R" : "D"})
                break;
            }
            case "-": {
                if (cell.direction === "U" || cell.direction === "D") {
                    queue.push({ cell: nextCell, direction: "R" })
                    queue.push({ cell: nextCell, direction: "L" })
                } else {
                    queue.push({ cell: nextCell, direction: cell.direction })
                }
                break;
            }
            case "|": {
                if (cell.direction === "L" || cell.direction === "R") {
                    queue.push({ cell: nextCell, direction: "U" })
                    queue.push({ cell: nextCell, direction: "D" })
                } else {
                    queue.push({ cell: nextCell, direction: cell.direction })
                }
                break;
            }
            case ".": {
                visited.add(cellToKey(cell.cell, cell.direction))
                queue.push({ cell: nextCell, direction: cell.direction })
                break;
            }
        }
    }

    return [...visited.values()]
        .map(item => {
            const [x, y] = item.split(".")[0].split(",").map(Number)
            return { x: x, y: y }
        })
        .filter((item, idx, arr) => arr.findIndex(i => i.x === item.x && i.y === item.y) === idx)
        .length
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