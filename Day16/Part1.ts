import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

type QueueItem = {
    cell: GridCell<string>
    direction: string
}

const text = await Deno.readTextFile("./Day16/input.txt")

const grid = new Grid<string>(text)

const start = grid.cells.find(item => item.x === 0 && item.y === 0)!

const queue = [{
    cell: start,
    direction: (start.value === "\\" || start.value === "|") ? "D" : "R"
}] as QueueItem[]

const visited = new Set<string>()

const cellToKey = (cell: GridCell<string>, direction: string) => `${cell.x},${cell.y}.${direction}`

const getNextCell = (item: QueueItem) => {
    if (item.direction === "U") return item.cell.up()
    if (item.direction === "D") return item.cell.down()
    if (item.direction === "L") return item.cell.left()
    if (item.direction === "R") return item.cell.right()
}

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
            queue.push({ cell: nextCell, direction: cell.direction })
            break;
        }
    }
}

const answer = [...visited.values()]
    .map(item => {
        const [x, y] = item.split(".")[0].split(",").map(Number)
        return { x, y }
    })
    .filter((item, idx, arr) => arr.findIndex(i => i.x === item.x && i.y === item.y) === idx)
    .length

console.log(answer)