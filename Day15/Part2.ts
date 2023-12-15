import "../utils/index.ts"

const text = await Deno.readTextFile("./Day15/input.txt")

const steps = text.split(",")

const getHash = (step: string) => 
    [...step].reduce((acc, char) => {
        const code = char.charCodeAt(0)
        acc += code;
        acc *= 17
        acc %= 256
        return acc;
}, 0)

const baseBox = {} as Record<number, {label: string, value?: number}[]>
for (let i = 0; i < 256; i++) {
    baseBox[i] = []
}

const boxes = steps
    .reduce((acc, step) => {
        if (step.includes("-")) {
            const label = step.slice(0, step.indexOf("-"))
            const values = [...acc[getHash(label)]]
            const idx = values.findIndex(item => item.label === label)
            if (idx !== -1) {
                values.splice(idx, 1)
                acc[getHash(label)] = values
            }
        } else {
            const [label, value] = step.split("=")
            const values = [...acc[getHash(label)]]
            const idx = values.findIndex(item => item.label === label)
            if (idx === -1) {
                values.push({label, value: Number(value)})
            } else {
                values.splice(idx, 1, {label, value: Number(value)})
            }
            acc[getHash(label)] = values
        }
        return acc
    }, baseBox)

const answer = Object
    .keys(boxes)
    .map((item, bIdx) => boxes[Number(item)].map((lens, idx) => (bIdx + 1) * (idx + 1) * lens.value!).sum())
    .sum()

console.log(answer)