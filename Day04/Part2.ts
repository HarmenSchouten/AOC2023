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
    });


let remainingCards = input;
let answer = input.length;
while (true) {
    const result = remainingCards.map(item => {
        return item.winning.reduce((acc, state) => {
            if (item.values.includes(state)) {
                return acc.points === 0
                    ? {points: 1, total: 1, id: item.id}
                    : {...acc, points: acc.points + acc.points, total: acc.total + 1}
            }
            return acc
        }, {points: 0, total: 0, id: -1} as {points: number, total: number, id: number})
    })

    remainingCards = result.flatMap(item => {
        const start = item.id
        const end = item.total + start
        return input.filter(item => item.id > start && item.id <= end)
    })

    answer += result.map(item => item.total).sum()

    if (remainingCards.length === 0) {
        break
    }
}

console.log(answer)