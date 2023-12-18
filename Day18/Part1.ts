import "../utils/index.ts"

type Point = {
    x: number,
    y: number
}

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
const area = GetAreaForLoop(items) - items.length 
const answer = (items.length) + Math.floor((area / 2) + 1)
console.log(answer) 