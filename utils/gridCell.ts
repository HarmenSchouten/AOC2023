import { Grid } from "./grid.ts";

export class GridCell<T> {

    private parent: Grid<T>;
    public x: number
    public y: number
    public value: T

    constructor(parent: Grid<T>, x: number, y: number, value: T) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.value = value;
    }

    /**
     * Get all adjacent neighbours of this cell
     * @param includeSelf Include the current cell in the result
     * @param filterfn Filter the result
     * @returns A list of adjacent neighbours
     */
    getAdjacentNeighbours(includeSelf = false, filterfn?: (cell: GridCell<T>) => boolean) {
        return getAdjacentNeighbours(this.parent.cells, this.x, this.y, includeSelf, filterfn)
    }

    /**
     * Get all diagonal neighbours of this cell
     * @param includeSelf Include the current cell in the result
     * @param filterfn Filter the result
     * @returns A list of diagonal neighbours
     */
    getDiagonalNeighbours(includeSelf = false, filterfn?: (cell: GridCell<T>) => boolean) {
        return getDiagonalNeighbours(this.parent.cells, this.x, this.y, includeSelf, filterfn)
    }

    /**
     * Get all adjacent and diagonal neighbours of this cell
     * @param includeSelf Include the current cell in the result
     * @param filterfn Filter the result
     * @returns A list of adjacent and diagonal neighbours
     */
    getAllNeighbours(includeSelf = false, filterfn?: (cell: GridCell<T>) => boolean) {
        return [
            ...getAdjacentNeighbours(this.parent.cells, this.x, this.y, includeSelf, filterfn), 
            ...getDiagonalNeighbours(this.parent.cells, this.x, this.y, false, filterfn)
        ]
    }

    /**
     * Check if this cell is on the edge of the grid
     * @returns True if this cell is on the edge of the grid
     */
    isEdge() {
        return this.x === 0 && this.y === 0
            || this.x === 0 && this.y === this.parent.height - 1
            || this.x === this.parent.width - 1 && this.y === 0
            || this.x === this.parent.width - 1 && this.y === this.parent.height - 1
    }

    /**
     * Get the cell above this cell
     * @returns The cell above this cell
     */
    up() {
        return this.parent.cells.find(cell => cell.x === this.x && cell.y === this.y - 1)
    }

    /**
     * Get the cell below this cell
     * @returns The cell below this cell
     */
    down() {
        return this.parent.cells.find(cell => cell.x === this.x && cell.y === this.y + 1)
    }

    /**
     * Get the cell to the left of this cell
     * @returns The cell to the left of this cell
     */
    left() {
        return this.parent.cells.find(cell => cell.x === this.x - 1 && cell.y === this.y)
    }

    /**
     * Get the cell to the right of this cell
     * @returns The cell to the right of this cell
     */
    right() {
        return this.parent.cells.find(cell => cell.x === this.x + 1 && cell.y === this.y)
    }

    /**
     * Get a string representation of this cell
     * @returns A string representation of this cell
     */
    toString() {
        return `${this.x}, ${this.y}, [${this.value}]`
    }
}

function getAdjacentNeighbours<T>(
    grid: GridCell<T>[], 
    x: number, 
    y: number, 
    includeSelf: boolean,
    filterFn?: (cell: GridCell<T>) => boolean
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
    filterFn?: (cell: GridCell<T>) => boolean
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