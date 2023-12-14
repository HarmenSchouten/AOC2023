import { GridCell } from "./types.ts";

export class Grid<T> {

    width = 0
    height = 0
    cells: GridCell<T>[] = []

    constructor(input: string, mapper?: (value: string) => T) {
        const items = [] as GridCell<T>[]
        const lines = input.splitLb();
        this.height = lines.length;
        this.width = lines[0].length;
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y]
            for (let x = 0; x < line.length; x++) {
                items.push({ 
                    x: x, 
                    y: y, 
                    value: mapper 
                        ? mapper(line[x]) 
                        : line[x] as T,
                    getAdjacentNeighbours: (includeSelf = false, filterfn) => getAdjacentNeighbours(this.cells, x, y, includeSelf, filterfn),
                    getDiagonalNeighbours: (includeSelf = false, filterfn) => getDiagonalNeighbours(this.cells, x, y, includeSelf, filterfn),
                    getAllNeighbours: (includeSelf = false, filterfn) => [
                        ...getAdjacentNeighbours(this.cells, x, y, includeSelf, filterfn), 
                        ...getDiagonalNeighbours(this.cells, x, y, false, filterfn)
                    ],
                })
            }
        }
        this.cells = items
    }

    /** Transpose the grid by rotating it to the right */
    transposeRight() {
        const centerX = this.width / 2
        const centerY = this.height / 2

        const items = [] as GridCell<T>[]
        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            const newX: number = centerX - (cell.y - centerY);
            const newY: number = centerY + (cell.x - centerX);
            items.push({ ...cell, x: newX, y: newY })
        }
        
        this.cells = items;
        const width = this.width;
        const height = this.height;
        this.width = height;
        this.height = width;
    }

    transposeLeft() {
        const centerX = Math.floor(this.width / 2)
        const centerY = Math.floor(this.height / 2)
        this.cells = this.cells.map(cell => {
            const newX = centerX - (centerY - cell.y)
            const newY = centerY - (cell.x - centerX)
            return { ...cell, x: newX, y: newY }
        })
        return this;
    }

    updateCell(x: number, y: number, value: T) {
        const cellIndex = this.cells.findIndex(c => c.x === x && c.y === y)
        if (cellIndex === -1) return;
        this.cells.splice(cellIndex, 1, { ...this.cells[cellIndex], value })
    }

    /** Convert the grid back to a string representation */
    toString() {
        let output = "";
        for (let y = 0; y < this.height; y++) {
            const row = this.cells.filter(c => c.y === y).sort((a, b) => a.x - b.x)
            output += row.map(c => c.value).join("")
            output += "\n"
        }
        return output;
    } 
}

function getAdjacentNeighbours<T>(
    grid: GridCell<T>[], 
    x: number, 
    y: number, 
    includeSelf: boolean,
    filterFn?: (cell: GridCell<T> | undefined) => boolean
) {
    const items = [
        grid.find(item => item.x === x && item.y === y - 1), // top
        grid.find(item => item.x === x - 1 && item.y === y), // left
        grid.find(item => item.x === x && item.y === y + 1), // bottom
        grid.find(item => item.x === x + 1 && item.y === y), // right
    ]
    if (includeSelf) items.push(grid.find(item => item.x === x && item.y === y))
    const assertedItems = items.filter(item => item !== undefined) as GridCell<T>[]
    if (filterFn) return assertedItems.filter(item => filterFn(item))
    return assertedItems
}

function getDiagonalNeighbours<T>(
    grid: GridCell<T>[], 
    x: number, 
    y: number, 
    includeSelf: boolean,
    filterFn?: (cell: GridCell<T> | undefined) => boolean
) {
    const items = [
        grid.find(item => item.x === x - 1 && item.y === y - 1), // top left
        grid.find(item => item.x === x + 1 && item.y === y - 1), // top right
        grid.find(item => item.x === x - 1 && item.y === y + 1), // bottom left
        grid.find(item => item.x === x + 1 && item.y === y + 1), // bottom right
    ]
    if (includeSelf) items.push(grid.find(item => item.x === x && item.y === y))
    const assertedItems = items.filter(item => item !== undefined) as GridCell<T>[]
    if (filterFn) return assertedItems.filter(item => filterFn(item))
    return assertedItems
}