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

const startNode = nodes.find(node => node.key === "AAA")!
const endNode = nodes.find(node => node.key === "ZZZ")!

let idx = 0;
let currentNode = startNode
while (true) {
    const instruction = instructions[idx % instructions.length]
    idx++
    if (instruction === "L") currentNode = nodes.find(node => node.key === currentNode.left)!
    if (instruction === "R") currentNode = nodes.find(node => node.key === currentNode.right)!
    if (currentNode.key === endNode.key) break;
}

console.log(idx)