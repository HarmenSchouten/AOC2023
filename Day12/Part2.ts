import "../utils/index.ts"
import { memoize } from "../utils/index.ts";

const text = await Deno.readTextFile("./Day12/input.txt")
const rows = text
    .splitLb()
    .map(line => {
        const [row, conditions] = line.split(" ");
        return {
            row: row,
            conditions: conditions.split(",").map(Number)
        }
    })


const findCombinations = memoize((row: string, conditions: number[]):number => {
    if (row.length === 0) {
        if (conditions.length === 0) {
            return 1
        }
        return 0
    }

    if (conditions.length === 0) {
        if ([...row].some(item => item === "#")) return 0
        return 1
    }

    if (row.length < conditions.sum() + conditions.length - 1) {
        return 0
    }

    if (row[0] === ".") {
        return findCombinations(row.slice(1), conditions)
    }
    if (row[0] === "#") {
        const [run, ...rest] = conditions
        for (let i = 0; i < run; i++) {
            if (row[i] === ".") {
                return 0
            }
        }
        if (row[run] === "#") {
            return 0
        }
        return findCombinations(row.slice(run + 1), rest)
    }
    return (findCombinations("#" + row.slice(1), conditions) + findCombinations("." + row.slice(1), conditions))
});

const answer = rows
    .map(item => {
        const string = [item.row, item.row, item.row, item.row, item.row].join("?")
        const conditions = [...item.conditions, ...item.conditions, ...item.conditions, ...item.conditions, ...item.conditions]
        return findCombinations(string, conditions)
    })
    .sum()

console.log(answer)