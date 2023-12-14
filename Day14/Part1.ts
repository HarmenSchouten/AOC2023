import { Grid } from "../utils/grid.ts"
import "../utils/index.ts"

const text = await Deno.readTextFile("./Day14/input.txt")

const grid = new Grid<string>(text)

const rocks = grid.cells.filter(c => c.value === "O")

rocks.forEach(rock => {
    if (rock.y === 0) return;

    const block = grid.cells.findLast(c => c.x === rock.x && c.y < rock.y && c.value !== ".")
    
    if (!block) {
        grid.updateCell(rock.x, 0, "O")
        grid.updateCell(rock.x, rock.y, ".")
        return
    }
    
    if (block.y === rock.y - 1) return;
    
    grid.updateCell(rock.x, block.y + 1, "O")
    grid.updateCell(rock.x, rock.y, ".")
})

const answer = grid.cells.filter(c => c.value === "O")
    .map(c => grid.height - c.y)
    .sum()

console.log(answer)