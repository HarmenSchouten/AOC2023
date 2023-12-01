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
    .reduce((sum, line) => {
        const nums = [];
        for (let i = 0; i < line.length; i++) {
            Object.keys(numbers).forEach(num => {
                if (line.slice(i).startsWith(num)) {
                    nums.push(numbers[num]);
                }
            });
            if (!isNaN(Number(line[i]))) {
                nums.push(parseInt(line[i]));
            }
        }
        return sum + nums[0] * 10 + nums[nums.length - 1];
    }, 0);

console.log(answer);