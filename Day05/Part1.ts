import "../utils/index.ts"

const text = await Deno.readTextFile("./Day05/input.txt")

const seeds = [] as number[]

const parts = text
    .splitDlb()
    .map((item, idx) => {
        const rows = item.splitLb();
        if (idx === 0) {
            const [_, values] = rows[0].split(":")
            values.split(" ").map(item => Number(item)).forEach(item => {
                seeds.push(item)
            })
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
        if (!part) return acc
        const newSeeds = [] as number[]

        acc.forEach(seed => {
            const sourceMap = part?.map.find(map => map.source <= seed && (map.source + map.range) >= seed)
            if (!sourceMap) {
                newSeeds.push(seed)
            } else {
                const diff = sourceMap.destination - sourceMap.source
                newSeeds.push(seed + diff)
            }
        })
        return newSeeds
    }, seeds as number[])
    .sort((a, b) => a - b)
    .shift()

console.log(answer)