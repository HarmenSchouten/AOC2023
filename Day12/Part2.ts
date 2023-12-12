import "../utils/index.ts"

const text = await Deno.readTextFile("./Day12/input.txt")
const rows = text
    .splitLb()
    .map(line => {
        const [row, conditions] = line.split(" ");
        return {
            row: row,
            conditions: conditions.split(",").map(Number)
        }
    })


const findCombinations = (row: string, conditions: number[]) => {
    const results = new Set<string>()

    const find = (index: number, currentCombination: string) => {
        if (index === row.length) {
            const groups = currentCombination.split(".").filter(item => item && item?.length > 0)
            if (groups.length === conditions.length && conditions.every((condition, idx) => groups[idx] && groups[idx].length === condition)) {
                results.add(currentCombination)
            }
            return
        }

        const currentChar = row[index]

        if (currentChar === "#") {
            find(index + 1, currentCombination + currentChar)
        } else if (currentChar === ".") {
            find(index + 1, currentCombination + currentChar)
        } else {
            find(index + 1, currentCombination + ".")
            find(index + 1, currentCombination + "#")
        }
    }
    find(0, "")
    // console.log(row, results.size, results)
    return [...results.values()]
}

const answer = rows
    .map(item => {
        const conditions = item.conditions
        for (let i = 0; i < 5; i++) {
            item.conditions.forEach(i => conditions.push(i))
        }
        return findCombinations(item.row.repeat(5), item.conditions).length
    })
    .sum()


console.log(answer)