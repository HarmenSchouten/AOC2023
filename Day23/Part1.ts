import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

const text = await Deno.readTextFile("./Day23/input.txt")

const grid = new Grid<string>(text)

const start = grid.cells.find(item => item.value === "." && item.y === 0)!
const end = grid.cells.find(item => item.value === "." && item.y === grid.height - 1)!

const cellToKey = (cell: GridCell<string>) => `${cell.x},${cell.y}`

let answer = 0;

const dfs = (distance: number, visited: Set<string>, current: GridCell<string>)  => {
    if (current.x === end.x && current.y === end.y) {
        if (distance > answer) {
            answer = distance
            return;
        }
    }

    current.getAdjacentNeighbours(false, item => item && item.value !== "#")
        .filter(item => {            
            if (current.value === ">") return item.x > current.x
            if (current.value === "<") return item.x < current.x
            if (current.value === "^") return item.y < current.y
            if (current.value === "v") return item.y > current.y
            return true;
        })
        ?.forEach(item => {
            const key = cellToKey(item)
            if (visited.has(key)) return;
            visited.add(key)
            dfs(distance + 1, visited, item)
            visited.delete(key)
        })
}

dfs(0, new Set(), start)

console.log(answer)