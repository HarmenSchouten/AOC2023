import "../utils/index.ts"

const text = await Deno.readTextFile("./Day04/input.txt")

const input = text
    .splitLb()
    .map(line => {
        const [id, rest] = line.split(": ")
        return {
            id: id.ints()[0],
            winning: rest.split(" | ")[0].split(" ").filter(item => item !== "").map(Number),
            values: rest.split(" | ")[1].split(" ").filter(item => item !== "").map(Number),
        }
    })
    .map(item => {
        return item.winning.reduce((acc, state) => {
            if (item.values.includes(state)) {
                return acc === 0 ? 1 : acc + acc
            }
            return acc
        }, 0)
    }).sum()

console.log(input)