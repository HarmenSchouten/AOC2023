import { Grid } from "../utils/grid.ts";
import "../utils/index.ts"

const text = await Deno.readTextFile("./Day14/input.txt")

const grid = new Grid<string>(text)

const tiltGrid = (grid: Grid<string>) => {

    const rocks = grid.cells
        .filter(c => c.value === "O")
        .sort((a, b) => a.y - b.y)

    for (let i = 0; i < rocks.length; i++) {
        const rock = rocks[i]
        if (rock.y === 0) continue;
        
        const blockingCells = grid.cells.filter(c => c.x === rock.x && c.y < rock.y && c.value !== ".")
        
        if (blockingCells.length === 0) {
            grid.updateCell(rock.x, 0, "O")
            grid.updateCell(rock.x, rock.y, ".")
            continue;
        }
        
        const sortedBlockingCells = blockingCells.sort((a, b) => b.y - a.y)
        const block = sortedBlockingCells[0]
        
        if (block.y === rock.y - 1) continue;
        
        grid.updateCell(rock.x, block.y + 1, "O")
        grid.updateCell(rock.x, rock.y, ".")
    }
}

const runCycle = () => {
    for (let j = 0; j < 4; j++) {
        tiltGrid(grid)
        grid.transposeRight()
    }    
}

const gridToString = (grid: Grid<string>) => grid.cells.map(c => `${c.x},${c.y},${c.value}`).join("|")

const history = new Map<string, number>()

for (let i = 0; i < 1000000000; i++) {
    runCycle()
    const gridString = gridToString(grid)
    if (history.has(gridString)) {
        i = 1000000000 - (1000000000 - i) % (i - history.get(gridString)!);
    }
    history.set(gridString, i)
    await Deno.stdout.write(new TextEncoder().encode(`\rCurrent row: ${i}`))
}

const answer = grid.cells
    .filter(c => c.value === "O")
    .map(c => grid.height - c.y)
    .sum()

console.log("\n", answer)