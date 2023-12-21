import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

const text = await Deno.readTextFile("./Day21/input.txt")

const grid = new Grid<string>(text)

const start = grid.cells.find(item => item.value === "S")

const cellToKey = (cell: GridCell<string>) => `${cell.x},${cell.y}`

const keyToCell = (key: string) => {
    const [x, y] = key.split(",").map(item => parseInt(item))
    const formattedX = x % grid.width
    const formattedY = y % grid.height
    return grid.cells.find(item => item.x == formattedX && item.y == formattedY)
}

const set = new Set<string>()
set.add(cellToKey(start!))

for (let i = 0; i < 64; i++) {
    const entries = [...set.keys()]
    set.clear()

    for (const entry of entries) {
        const current = entry

        const cell = keyToCell(current)
        cell?.getAdjacentNeighbours(false, item => item.value === ".")
            .forEach(item => set.add(cellToKey(item)))
    }
}

console.log(set.size + 1)