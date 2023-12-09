import "../utils/index.ts"

const text = await Deno.readTextFile("./Day09/input.txt")

const getNewSequence = (sequence: number[]) => 
    sequence.reduce((acc, item, idx, arr) => {
        if (idx + 1 > arr.length - 1) return acc
        const next = arr[idx + 1]
        acc.push(next - item)
        return acc
}, [] as number[])

const getValueForSequence = (sequence: number[]) => {

    const sequences = [sequence]
 
    while (true) {
        const newSequence = getNewSequence(sequences[sequences.length - 1])
        sequences.push(newSequence)
        if (newSequence.every(item => item === 0)) break
    }

    const extrapolated = sequences
        .reverse()
        .reduce((acc, item) => {
            const newItem = item[item.length - 1] + acc
            return newItem
        }, 0)

    return extrapolated
}

const answer = text
    .splitLb()
    .map(item => item.split(" ").map(Number))
    .map(item => ({
        sequence: item,
        value: getValueForSequence(item.reverse())
    }))
    .map(item => item.value)
    .sum()

console.log(answer)