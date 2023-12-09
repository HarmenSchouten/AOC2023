import "../utils/index.ts"

const text = await Deno.readTextFile("./Day09/input.txt")

const getNewSequence = (sequence: number[]) => 
    sequence.reduce((acc, item, idx, arr) => {
        if (idx + 1 > arr.length - 1) return acc
        acc.push(arr[idx + 1] - item)
        return acc
}, [] as number[])

const getValueForSequence = (sequence: number[]) => {
    const sequences = [sequence]
 
    while (true) {
        const newSequence = getNewSequence(sequences[sequences.length - 1])
        sequences.push(newSequence)
        if (newSequence.every(item => item === 0)) break
    }

    return sequences
        .reverse()
        .reduce((acc, item) => item[item.length - 1] + acc, 0)
}

const answer = text
    .splitLb()
    .map(item => getValueForSequence(item.split(" ").map(Number)))
    .sum()

console.log(answer)