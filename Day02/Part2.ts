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
    .map(item => item.reduce((acc, {key, value}) => {
        if (!(key in limitMap)) return acc
        if (acc[key] === undefined) {
            acc[key] = value
            return acc
        }
        if (acc[key] <= value) {
            acc[key] = value
        }
        return acc
    }, {} as Record<string, number>))
    .map(item => Object
        .keys(item)
        .reduce((acc, state) => acc === 0
            ? item[state]
            : acc * item[state], 0))
    .reduce((acc, state) => acc += state, 0)

console.log(answer)