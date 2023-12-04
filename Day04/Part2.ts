import "../utils/index.ts"

const text = await Deno.readTextFile("./Day04/input.txt")

const mapValues = text
    .splitLb()
    .map(line => {
        const [id, rest] = line.split(": ")
        return {
            id: id.ints()[0],
            winning: rest.split(" | ")[0].split(" ").filter(item => item !== "").map(Number),
            values: rest.split(" | ")[1].split(" ").filter(item => item !== "").map(Number),
        }
    })
    .reduce((acc, state) => {
        const winningNumbersLength = state.winning.filter(item => state.values.includes(item)).length
        acc.set(state.id, (acc.get(state.id) ?? 0) + 1)
        for (let i = 1; i <= winningNumbersLength; i++) {
            acc.set(state.id + i, (acc.get(state.id + i) ?? 0) + 1 * (acc.get(state.id) ?? 1))
        }
        return acc
    }, new Map<number, number>())
    .values();

console.log([...mapValues].sum())