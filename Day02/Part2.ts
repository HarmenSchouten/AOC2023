import "../utils/index.ts";

const text = await Deno.readTextFile("./Day02/input.txt")

const limitMap = {
    "red": 12,
    "green": 13,
    "blue": 14
} as Record<string, number>

const answer = text
    .splitLb()
    .map(line => 
        line.split(": ")[1]
        .split("; ")
        .flatMap(item => 
            item.split(", ").map(item => item.split(" ")).map(([value, key]) => ({key: key, value: Number(value)}))))
    .map((item, index) => ({
        id: index + 1,
        limits: item.reduce((acc, {key, value}) => {
            if (!(key in limitMap)) return acc
            if (acc[key] === undefined) {
                acc[key] = value
                return acc
            }
            if (acc[key] <= value) {
                acc[key] = value
            }
            return acc
        }, {} as Record<string, number>)
    }))
    .map(item => ({
        id: item.id,
        power: Object.keys(item.limits).reduce((acc, state) => acc === 0
            ? item.limits[state]
            : acc * item.limits[state], 0)   
    }))
    .reduce((acc, state) => acc += state.power, 0)

console.log(answer)