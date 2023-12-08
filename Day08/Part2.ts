import "../utils/index.ts"

const text = await Deno.readTextFile("./Day08/input.txt")

const parts = text.splitDlb()

const instructions = [...parts[0].splitLb()[0]]

const nodes = parts[1]
    .splitLb()
    .map(line => {
        const [key, rest] = line.split(" = ")
        const [left, right] = rest
            .replaceAll("(", "")
            .replaceAll(")", "")
            .split(", ")
        return {
            key: key,
            left: left,
            right: right
        }
    })

const startNodes = nodes.filter(node => node.key.endsWith("A"))!

const idxMap = new Map<string, number>()

startNodes.forEach(node => {
    let start = node
    idxMap.set(start.key, 0)

    while (true) {
        const index = idxMap.get(node.key)!
        idxMap.set(node.key, index + 1)
        const instruction = instructions[index % instructions.length]
        if (instruction === "L") start = nodes.find(node => node.key === start.left)!
        if (instruction === "R") start = nodes.find(node => node.key === start.right)!
        if (start.key.endsWith("Z")) break;
    }
})

console.log([...idxMap.values()].lcm())