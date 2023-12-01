declare global {
    interface String {
        /** Get all numbers in a given string */
        ints(): number[];
        /** Split on line break */
        splitLb(): string[];
        /** Split on double line break */
        splitDlb(): string[];
    }
}

String.prototype.ints = function () {
    return this.match(/\d+/g)?.map(Number) ?? [];
};

String.prototype.splitLb = function () {
    return this.split("\r\n");
};

String.prototype.splitDlb = function () {
    return this.split("\r\n\r\n");
}