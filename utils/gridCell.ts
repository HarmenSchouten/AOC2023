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

    getAdjacentNeighbours(includeSelf = false, filterfn?: (cell: GridCell<T>) => boolean) {
        return getAdjacentNeighbours(this.parent.cells, this.x, this.y, includeSelf, filterfn)
    }

    getDiagonalNeighbours(includeSelf = false, filterfn?: (cell: GridCell<T>) => boolean) {
        return getDiagonalNeighbours(this.parent.cells, this.x, this.y, includeSelf, filterfn)
    }

    getAllNeighbours(includeSelf = false, filterfn?: (cell: GridCell<T>) => boolean) {
        return [
            ...getAdjacentNeighbours(this.parent.cells, this.x, this.y, includeSelf, filterfn), 
            ...getDiagonalNeighbours(this.parent.cells, this.x, this.y, false, filterfn)
        ]
    }

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