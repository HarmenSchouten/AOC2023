const text = await Deno.readTextFile("./Day01/input.txt")
const numbers:Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
};

const answer = text
    .split("\r\n")
    .reduce((acc, state) => {
        const nums = [];
        for (let i = 0; i < state.length; i++) {
            Object
                .keys(numbers)
                .filter(number => state.slice(i).startsWith(number))
                .forEach(number => nums.push(numbers[number]))

            if (!isNaN(Number(state[i]))) {
                nums.push(Number(state[i]));
            }
        }
        return acc + nums[0] * 10 + nums[nums.length - 1];
    }, 0);

console.log(answer);