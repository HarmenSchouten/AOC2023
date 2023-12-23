import { Grid } from "../utils/grid.ts";
import { GridCell } from "../utils/gridCell.ts";
import "../utils/index.ts"

const text = await Deno.readTextFile("./Day23/input.txt")

const grid = new Grid<string>(text)

const start = grid.cells.find(item => item.value === "." && item.y === 0)!
const end = grid.cells.find(item => item.value === "." && item.y === grid.height - 1)

const cellToKey = (cell: GridCell<string>) => `${cell.x},${cell.y}`

const nodes = [cellToKey(start), cellToKey(end!)]
const nodeDistances = [] as Record<string, number>[]
for (let i = 0; i < nodes.length; i++) {
    nodeDistances[i] = {} as Record<string, number>

    const node = nodes[i].split(",").map(Number)

    const dfs = (distance: number, lastIdx: number, x: number, y: number) => {
        const cell = grid.cells.find(item => item.x === x && item.y === y && item.value !== "#")

        if (!cell) return

        const valids = cell.getAdjacentNeighbours(false, item => item && item.value !== "#").length

        if (distance > 0 && (valids > 2 || y < 1 || y >= grid.height - 1)) {
            const key = cellToKey(cell)
            if (!nodes.includes(key)) nodes.push(key)
            nodeDistances[i][nodes.indexOf(key)] = distance
            return
        }

        if (lastIdx !== 2 && y > 0) dfs(distance + 1, 0, x, y - 1)
        if (lastIdx !== 0 && y < grid.height - 1) dfs(distance + 1, 2, x, y + 1)
        if (lastIdx !== 3) dfs(distance + 1, 1, x - 1, y)
        if (lastIdx !== 1) dfs(distance + 1, 3, x + 1, y)
    }

    dfs(0, -1, node[0], node[1])
}

let distanceCount = 0;
const doRun = (steps: number, node: number, prev: number[]) => {
    if (node === 1) {
        if (steps > distanceCount) {
            distanceCount = steps;
        }
        return;
    }

    prev.push(node);

    for (const target in nodeDistances[node]) {
        if (prev.includes(Number(target))) continue;
        
        const newPrev = [...prev];
        
        doRun(steps + nodeDistances[node][target], Number(target), newPrev)
    }
}
doRun(0, 0, []);

console.log(distanceCount);