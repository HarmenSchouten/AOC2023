import "../utils/index.ts"

type Point = {
    x: number,
    y: number
}

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

const GetAreaForLoop = (array: Point[]) => {
    const copy = [...array.slice(1), array[0]]
    let count = 0
    for (let i = 0; i < array.length; i++) {
        const x0 = array[i].x
        const y0 = array[i].y
        const x1 = copy[i].x
        const y1 = copy[i].y

        count += ((x0 * y1) - (x1 * y0))
    }
    return Math.abs(count)
}

const answer = Math.floor((GetAreaForLoop(items) - total) / 2) + 1 + total

console.log(answer)