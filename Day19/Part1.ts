import "../utils/index.ts"

const text = await Deno.readTextFile("./Day19/input.txt")

const [r, i] = text.splitDlb();

const rules = r
    .splitLb()
    .map(line => {
        const [key, rest] = line.replace("}", "").split("{")
        return {
            key: key,
            value: rest.split(",").map(item => item.split(":"))
        }
    })

const inputItems = i.splitLb()
    .map(line => {
        const [x, m, a, s] = line.replace("{", "").replace("}", "").split(",")
        return {
            x: Number(x.slice(2, x.length)),
            m: Number(m.slice(2, m.length)),
            a: Number(a.slice(2, a.length)),
            s: Number(s.slice(2, s.length))
        }
    })

const start = rules.find(r => r.key === "in")!

const processInput = (input: typeof inputItems[0], rule: typeof rules[0]):boolean => {
    const copy = [...rule.value]
    const end = copy.pop()!
    
    const match = copy.find(item => {
        const newValue = item[0]
            .replace("x", input.x.toString())
            .replace("m", input.m.toString())
            .replace("a", input.a.toString())
            .replace("s", input.s.toString())
        return eval(newValue)
    })

    if (!match) {
        if (end[0] === "R") return false;
        if (end[0] === "A") return true
        return processInput(input, rules.find(r => r.key === end[0])!)
    }

    if (match[1] === "R") return false;
    if (match[1] === "A") return true
    return processInput(input, rules.find(r => r.key === match[1])!)
}

const answer = inputItems
    .filter(item => processInput(item, start))
    .map(item => [item.x, item.m, item.a, item.s].sum())
    .sum()

console.log(answer)