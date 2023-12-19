import "../utils/index.ts"

type Range = Record<string, [number, number]>;

const text = await Deno.readTextFile("./Day19/input.txt")

const [r, _] = text.splitDlb();

const rules = r
    .splitLb()
    .map(line => {
        const [key, rest] = line.replace("}", "").split("{")
        return {
            key: key,
            value: rest.split(",").map(item => item.split(":"))
        }
    })

const start = rules.find(r => r.key === "in")!

const range = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
} as Range

const copyRange = (range: Range) => JSON.parse(JSON.stringify(range))

const findRange = (key: string, range: Range):Range[] => {
    if (key === "R") return []
    if (key === "A") return [copyRange(range)]

    const ranges = []

    const rule = rules.find(r => r.key === key)!

    for (const rulePart of rule.value) {

        if (rulePart.length === 1) {
            ranges.push(...findRange(rulePart[0], copyRange(range)))
        } else {
            const [condition, value] = rulePart
            const operatorIndex = condition.indexOf(">") !== -1 ? condition.indexOf(">") : condition.indexOf("<")
            const operator = condition[operatorIndex]
            const identifier = condition[0]
            const numberValue = Number(condition.slice(operatorIndex + 1))
            
            if (operator === "<") {
                const newRange = copyRange(range)
                newRange[identifier][1] = numberValue - 1

                ranges.push(...findRange(value, newRange))

                range[identifier][0] = numberValue
            }

            if (operator === ">") {
                const newRange = copyRange(range)
                newRange[identifier][0] = numberValue + 1

                ranges.push(...findRange(value, newRange))

                range[identifier][1] = numberValue
            }
        }
    }
    return ranges;
}

const answer = findRange(start.key, range)
    .map(range => Object.values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1))
    .sum()

console.log(answer)