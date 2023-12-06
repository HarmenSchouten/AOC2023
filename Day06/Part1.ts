import "../utils/index.ts"

const text = await Deno.readTextFile("./Day06/input.txt")

const lines = text
    .splitLb()
    .map(line => line.split(": ")[1].split(" ").filter(item => item !== "").map(Number))

type Race = {
    time: number
    distance: number
}
const races = [] as Race[]
for (let i = 0; i < lines[0].length; i++) {
    races.push({
        time: lines[0][i],
        distance: lines[1][i]
    })
}

let answer = 1;
races.forEach(race => {
    const speeds = new Set<number>()
    for (let i = 0; i < race.time; i++) {
        if (((race.time - i) * i) > race.distance) {
            speeds.add(i)
        }
    }
    answer *= speeds.size
})

console.log(answer)