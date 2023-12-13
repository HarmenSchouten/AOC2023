import "../utils/index.ts"

const text = await Deno.readTextFile("./Day13/input.txt")

const patterns = text
    .splitDlb()
    .map(item => item.splitLb())

const compareRows = (arr: string[], y1: number, y2: number) => {
    return [...arr[y1]].reduce((count, _, i) => count + (arr[y1][i] !== arr[y2][i] ? 1 : 0), 0);
}
    
const compareCols = (arr: string[], x1: number, x2: number) => {
    return [...arr].reduce((count, _, i) => count + (arr[i][x1] !== arr[i][x2] ? 1 : 0), 0);
}

let answer = 0;
for (const pattern of patterns) {
    const height = pattern.length
    const width = pattern[0].length

    for (let x = 1; x < width; x++) {
        const equalizer = Array
            .from(
                { length: Math.min(x, width - x) }, 
                (_, i) => compareCols(pattern, x - i - 1, x + i))
            .reduce((sum, value) => sum + value, 0);
    
        if (equalizer === 0) answer += x;
      }
    
      for (let y = 1; y < height; y++) {
        const equalizer = Array
            .from(
                { length: Math.min(y, height - y) }, 
                (_, i) => compareRows(pattern, y - i - 1, y + i))
            .reduce((sum, value) => sum + value, 0);
    
        if (equalizer === 0) answer += 100 * y;
      }
}

console.log(answer)