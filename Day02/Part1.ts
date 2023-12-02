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
            item.split(", ")
                .map(item => 
                    item.split(" "))
                        .map(([value, key]) => ({key: key, value: Number(value)}))))
    .map((item, index) => ({
        id: index + 1,
        isValid: item.every(({key, value}) => key in limitMap ? value <= limitMap[key] : true)
    }))
    .filter(item => item.isValid)
    .reduce((acc, state) => acc += state.id, 0)

console.log(answer)