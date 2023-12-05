import "../utils/index.ts"

const text = await Deno.readTextFile("./Day05/input.txt")
type Seed = {
    start: number
    end: number
}
const seeds = [] as Seed[]

const parts = text
    .splitDlb()
    .map((item, idx) => {
        const rows = item.splitLb();
        if (idx === 0) {
            const [_, values] = rows[0].split(": ")
            const numbers = values.split(" ").map(item => Number(item))
            for (let i = 0; i < numbers.length; i+=2) {
                const curr  = numbers[i]
                const next = numbers[i + 1]
                seeds.push({
                    start: curr,
                    end: curr + next
                })
            }
            return undefined
        } else {
            return {
                identifier: rows[0].replace(":", "").replace(" map", ""),
                map: rows.slice(1).map(row => {
                    const items = row.split(" ").map(Number)
                    return {
                        destination: items[0],
                        source: items[1],
                        range: items[2]
                    }
                })
            }
        }
    })
    .filter(item => !!item)

const answer = parts
    .reduce((acc, part) => {
        if (!part) return acc;
        const newSeeds = [] as Seed[]
        acc.forEach(seed => {
            part.map.forEach(map => {
                const max = Math.max(map.source, seed.start)
                const min = Math.min(map.source + map.range, seed.end)
                if (max < min) {
                    newSeeds.push({
                        start: max + map.destination - map.source,
                        end: min + map.destination - map.source
                    })
                }
            })
        })
        return newSeeds
    }, seeds)
    .sort((a, b) => a.start - b.start)
    .shift()

console.log(answer?.start)