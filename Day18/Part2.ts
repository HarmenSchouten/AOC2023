import "../utils/index.ts"
import { Point, picksTheoremInnerBoundaries } from "../utils/index.ts";

const directionMap = { "0": "R", "1": "D", "2": "L", "3": "U" } as Record<string, string>

const text = await Deno.readTextFile("./Day18/input.txt")

const input = text.splitLb().map(line => {
    const [_,__, rest] = line.split(" ")
    const number = rest.slice(2, 7)
    const direction = rest.slice(7,8)
    return {
        amount: parseInt(number, 16),
        direction: directionMap[direction],
    }
})

const start = { x: 0, y: 0 }
const items = [] as Point[]
const currentPositition = {...start}
let total = 0;
input.forEach(line => {
    total += line.amount
    switch (line.direction) {
        case "R": {
            currentPositition.x += line.amount
            break;
        }
        case "L": {
            currentPositition.x -= line.amount
            break;
        }
        case "U": {
            currentPositition.y += line.amount
            break;
        }
        case "D": {
            currentPositition.y -= line.amount
            break;
        }
    }
    items.push({...currentPositition})
})

const answer = picksTheoremInnerBoundaries(items, total) + total

console.log(answer)