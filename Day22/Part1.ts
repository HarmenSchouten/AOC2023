import "../utils/index.ts"

type Coord = {
    x: number,
    y: number,
    z: number
}

type Brick = {
    id: number
    start: Coord,
    end: Coord
}

const text = await Deno.readTextFile("./Day22/input.txt")

const bricks = text
    .splitLb()
    .map((line, idx) => {
        const [coord1, coord2] = line.split("~").map(coord => coord.split(",").map(Number))
        return {
            id: idx,
            start: { x: coord1[0], y: coord1[1], z: coord1[2] },
            end: { x: coord2[0], y: coord2[1], z: coord2[2] }
        } as Brick
    })
    .sort((a, b) => Math.min(a.start.z, a.end.z) - Math.min(b.start.z, b.end.z))

// Fill our 3d grid
const occupation = new Map();
bricks.forEach(b => {
    for (let x = b.start.x; x <= b.end.x; x++) {
        for (let y = b.start.y; y <= b.end.y; y++) {
            for (let z = b.start.z; z <= b.end.z; z++) {
                const key = `${x},${y},${z}`;
                if (occupation.has(key)) {
                    console.error("overlap");
                } else {
                    occupation.set(key, b);
                }
            }
        }
    }
});

// Let the bricks rain down
let step = true;
while (step) {
    step = false;
    bricks.forEach(brick => {
        let fall = true;
        for (let x = brick.start.x; x <= brick.end.x; x++) {
            for (let y = brick.start.y; y <= brick.end.y; y++) {
                for (let z = brick.start.z; z <= brick.end.z; z++) {
                    if (z - 1 <= 0) {
                        fall = false;
                    } else {
                        const key = `${x},${y},${z - 1}`;
                        if (occupation.has(key) && occupation.get(key) != brick) {
                            fall = false;
                        }
                    }
                }
            }
        }
        if (fall) {
            step = true;
            for (let x = brick.start.x; x <= brick.end.x; x++) {
                for (let y = brick.start.y; y <= brick.end.y; y++) {
                    for (let z = brick.start.z; z <= brick.end.z; z++) {
                        const key = `${x},${y},${z}`;
                        occupation.delete(key);
                    }
                }
            }
            brick.start.z--;
            brick.end.z--;
            for (let x = brick.start.x; x <= brick.end.x; x++) {
                for (let y = brick.start.y; y <= brick.end.y; y++) {
                    for (let z = brick.start.z; z <= brick.end.z; z++) {
                        const key = `${x},${y},${z}`;
                        occupation.set(key, brick);
                    }
                }
            }
        }
    })
}

// Find who is supporting who
const above = new Map();
const below = new Map();
bricks.forEach(brick => {
    above.set(brick, new Set());
    below.set(brick, new Set());
})

bricks.forEach(brick => {
    for (let x = brick.start.x; x <= brick.end.x; x++) {
        for (let y = brick.start.y; y <= brick.end.y; y++) {
            for (let z = brick.start.z; z <= brick.end.z; z++) {
                const key = `${x},${y},${z + 1}`;
                if (occupation.has(key)) {
                    const other = occupation.get(key);
                    if (other != brick) {
                        above.get(brick).add(other);
                        below.get(other).add(brick);
                    }
                }
            }
        }
    }
})

const answer = bricks.reduce((acc, brick) => {
    let save = true;
    for (const brickAbove of above.get(brick)) {
        if (below.get(brickAbove).size == 1) {
            save = false;
        }
    }
    return save 
        ? acc + 1
        : acc;
}, 0)

console.log(answer)