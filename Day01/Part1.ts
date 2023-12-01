const text = await Deno.readTextFile("./Day01/input.txt")

const answer = text
    .split("\r\n")
    .map(item => [...item].filter(char => !isNaN(Number(char))))
    .filter(numbers => numbers.length >= 1)
    .map(numbers => Number(`${numbers[0]}${numbers[numbers.length - 1]}`))
    .reduce((acc, state) => acc += state, 0)

console.log(answer)