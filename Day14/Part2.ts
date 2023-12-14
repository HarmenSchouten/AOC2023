import "../utils/index.ts"

const text = await Deno.readTextFile("./Day14/input.txt")

const lines = text.splitLb()

const grid = lines
    .flatMap((line, y) => [...line].map((c, x) => ({ x, y, c })))

const transposeGrid = (theGrid: typeof grid) => {
    const centerX = Math.max(...theGrid.map(c => c.x)) / 2
    const centerY = Math.max(...theGrid.map(c => c.y)) / 2
    return theGrid.map(({ x, y, c }) => {
        const newX: number = centerX - (y - centerY);
        const newY: number = centerY + (x - centerX);
        return { x: newX, y: newY, c };
        });
}

const tiltGrid = (theGrid: typeof grid) => {
    
    const currentGrid = theGrid;
    const rocks = currentGrid.filter(c => c.c === "O")
    
    rocks.sort((a, b) => a.y - b.y).forEach(rock => {
        if (rock.y === 0) return;
    
        const block = currentGrid
            .filter(c => c.x === rock.x && c.y < rock.y && c.c !== ".")
            .sort((a, b) => b.y - a.y)
            .shift()
        
        if (!block) {
            const aboveIdx = currentGrid.findIndex(c => c.x === rock.x && c.y === 0 )
            currentGrid.splice(aboveIdx, 1, {...currentGrid[aboveIdx], c: "O"})
            const idx = currentGrid.findIndex(c => c.x === rock.x && c.y === rock.y)
            currentGrid.splice(idx, 1, {...rock, c: "."})
            return
        }
        
        if (block.y === rock.y - 1) return;

        const above = currentGrid.findIndex(c => c.x === rock.x && c.y === block.y + 1)
        currentGrid.splice(above, 1, {...currentGrid[above], c: "O"})
        const idx = currentGrid.findIndex(c => c.x === rock.x && c.y === rock.y)
        currentGrid.splice(idx, 1, {...rock, c: "."})

    })

    return currentGrid
}

const runCycle = (theGrid: typeof grid) => {
    let currentGrid = theGrid;
    for (let j = 0; j < 4; j++) {
        const grid = tiltGrid(currentGrid)
        currentGrid = transposeGrid(grid)
    }    
    return currentGrid
}

const gridToString = (theGrid: typeof grid) => theGrid.map(c => `${c.x},${c.y},${c.c}`).join("|")

let currentGrid = grid

const history = new Map<string, number>()

for (let i = 0; i < 1000000000; i++) {
    currentGrid = runCycle(currentGrid)
    const gridString = gridToString(currentGrid)
    if (history.has(gridString)) {
        i = 1000000000 - (1000000000 - i) % (i - history.get(gridString)!);
    }
    history.set(gridString, i)
    console.log(i)
}

const answer = currentGrid.filter(c => c.c === "O")
    .map(c => lines.length - c.y)
    .sum()

console.log(answer)