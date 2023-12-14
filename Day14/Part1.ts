import "../utils/index.ts"

const text = await Deno.readTextFile("./Day14/input.txt")

const grid = text
    .splitLb()
    .flatMap((line, y) => [...line].map((c, x) => ({ x, y, c })))


const rocks = grid.filter(c => c.c === "O")

let currentGrid = grid;

rocks.forEach(rock => {
    if (rock.y === 0) return;

    const gridCopy = [...currentGrid]
    const block = gridCopy.findLast(c => c.x === rock.x && c.y < rock.y && c.c !== ".")
    
    if (!block) {
        const aboveIdx = gridCopy.findIndex(c => c.x === rock.x && c.y === 0 )
        gridCopy.splice(aboveIdx, 1, {...gridCopy[aboveIdx], c: "O"})
        const idx = gridCopy.findIndex(c => c.x === rock.x && c.y === rock.y)
        gridCopy.splice(idx, 1, {...rock, c: "."})
        currentGrid = gridCopy
        return
    }
    
    if (block.y === rock.y - 1) return;
    const above = gridCopy.findIndex(c => c.x === rock.x && c.y === block.y + 1)
    gridCopy.splice(above, 1, {...gridCopy[above], c: "O"})
    const idx = gridCopy.findIndex(c => c.x === rock.x && c.y === rock.y)
    gridCopy.splice(idx, 1, {...rock, c: "."})

    currentGrid = gridCopy
})

const maxY = Math.max(...currentGrid.map(c => c.y))
const answer = currentGrid.filter(c => c.c === "O")
    .map(c => maxY + 1 - c.y)
    .sum()

console.log(answer)