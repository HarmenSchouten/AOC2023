import "../utils/index.ts"

const text = await Deno.readTextFile("./Day03/input.txt")

const grid = text.toGrid<string>()

const identifiers = grid.filter(item => item.value !== "." && item.value.ints().length === 0)

const manhattan = (x0: number, x1: number, y0: number, y1: number) => Math.abs(x1-x0) + Math.abs(y1-y0);

const answer = identifiers
    .flatMap(item => item.getAllNeighbours(false, item => item !== undefined && item.value.ints().length > 0))
    .filter((item, idx, array) => array.findIndex(aItem => aItem.x === item.x && aItem.y === item.y) === idx)
    .reduce((acc, state) => {
        const has0Distance = acc.find(item => manhattan(item.x, state.x, item.y, state.y) <= 1)
        if (has0Distance) return acc
        return [...acc, state]
    }, [] as {x: number, y: number, value: string}[])
    .map(item => {
        const line = grid.filter(gridItem => gridItem.y === item.y).map(item => item.value).join("")
        const before = [...line.slice(0, item.x)].findLastIndex(item => !item.isDigit())
        const beforeIdx = before === -1 ? 0 : before + 1
        const after = [...line.slice(item.x)].findIndex(item => !item.isDigit())
        const afterIdx = after === -1 ? line.length : item.x + after

        return Number(line.slice(beforeIdx, afterIdx))
    })
    .sum()

console.log(answer)