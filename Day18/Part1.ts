import "../utils/index.ts"
import { Point, picksTheoremInnerBoundaries } from "../utils/index.ts";

const text = await Deno.readTextFile("./Day18/input.txt")

const input = text.splitLb().map(line => {
    const [direction,amount, _] = line.split(" ")
    return {
        amount: Number(amount),
        direction,
    }
})

const start = { x: 0, y: 0 }
const items = [start] as Point[]
const last = () => items[items.length - 1]

input.forEach(line => {
    switch (line.direction) {
        case "R": {
            for (let i = 0; i < line.amount; i++) {
                items.push({ x: last().x + 1, y: last().y })
            }
            break;
        }
        case "L": {
            for (let i = 0; i < line.amount; i++) {
                items.push({ x: last().x - 1, y: last().y })
            }
            break;
        }
        case "U": {
            for (let i = 0; i < line.amount; i++) {
                items.push({ x: last().x, y: last().y + 1 })
            }
            break;
        }
        case "D": {
            for (let i = 0; i < line.amount; i++) {
                items.push({ x: last().x, y: last().y - 1 })
            }
            break;
        }
    }
})

const answer = picksTheoremInnerBoundaries(items, items.length) + items.length

console.log(answer) 