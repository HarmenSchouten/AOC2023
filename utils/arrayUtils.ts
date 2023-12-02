declare global {
    interface Array<T> {
        /** Gets the sum of all integers in an array */
        sum(): number
        /** Gets the product of all integers in an array */
        product(): number
    }
}

Array.prototype.sum = function () {
    if (this.every((value) => typeof value === 'number')) {
        return this.reduce((acc, state) => acc += state, 0)
    }
    throw new Error("This array does not contain only numbers")
}

Array.prototype.product = function () {
    if (this.every((value) => typeof value === 'number')) {
        return this.reduce((acc, state) => acc *= state, 1)
    }
    throw new Error("This array does not contain only numbers")
}