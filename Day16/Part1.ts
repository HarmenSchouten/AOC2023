import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

type QueueItem = {
    cell: GridCell<string>
    direction: string
}

const text = await Deno.readTextFile("./Day16/input.txt")

const grid = new Grid<string>(text)

const queue = [{
    cell: grid.cells.find(item => item.x === 0 && item.y === 0)!,
    direction: "D"
}] as QueueItem[]
const visited = new Set<string>()

const cellToKey = (cell: GridCell<string>, direction: string) => `${cell.x},${cell.y}.${direction}`

const getNextCell = (item: QueueItem) => {
    switch (item.direction) {
        case "U": return grid.cells.find(cell => cell.x === item.cell.x && cell.y === item.cell.y - 1)
        case "D": return grid.cells.find(cell => cell.x === item.cell.x && cell.y === item.cell.y + 1)
        case "L": return grid.cells.find(cell => cell.x === item.cell.x - 1 && cell.y === item.cell.y)
        case "R": return grid.cells.find(cell => cell.x === item.cell.x + 1 && cell.y === item.cell.y)
    }
}

while (queue.length > 0) {
    const cell = queue.shift()!

    const nextCell = getNextCell(cell)

    if (visited.has(cellToKey(cell.cell, cell.direction))) continue;

    if (!nextCell) {
        visited.add(cellToKey(cell.cell, cell.direction))
        continue;
    }

    switch (nextCell.value) {
        case "/": {
            visited.add(cellToKey(cell.cell, cell.direction))
            queue.push({ cell: nextCell, direction: cell.direction === "U" ? "R" : cell.direction === "R" ? "U" : cell.direction === "D" ? "L" : "D"})
            break;
        }
        case "\\": {
            visited.add(cellToKey(cell.cell, cell.direction))
            queue.push({ cell: nextCell, direction: cell.direction === "U" ? "L" : cell.direction === "L" ? "U" : cell.direction === "D" ? "R" : "D"})
            break;
        }
        case "-": {
            visited.add(cellToKey(cell.cell, cell.direction))
            if (cell.direction === "U" || cell.direction === "D") {
                queue.push({ cell: nextCell, direction: "R" })
                queue.push({ cell: nextCell, direction: "L" })
            } else {
                queue.push({ cell: nextCell, direction: cell.direction })
            }
            break;
        }
        case "|": {
            visited.add(cellToKey(cell.cell, cell.direction))
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

const values = [...visited.values()].map(item => {
    const [x, y] = item.split(".")[0].split(",")
    return { x: parseInt(x), y: parseInt(y) }
})
.filter((item, idx, arr) => arr.findIndex(i => i.x === item.x && i.y === item.y) === idx)
// console.log(visited, values)

for (let y = 0; y < grid.height; y++) {
    let line = ""
    for (let x = 0; x < grid.width; x++) {
        if (values.find(item => item.x === x && item.y === y)) {
            line += "#"
        } else {
            line += "."
        }
    }
    console.log(line)
}
console.log(values.length)