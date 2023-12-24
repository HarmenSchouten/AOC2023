import "../utils/index.ts"

const text = await Deno.readTextFile("./Day24/input.txt")

type Line = {
    positionA: { x: number, y: number },
    positionB: { x: number, y: number }
}

const intersect = (line1: Line, line2: Line) => {
    const { x: x1, y: y1 } = line1.positionA
    const { x: x2, y: y2 } = line1.positionB
    const { x: x3, y: y3 } = line2.positionA
    const { x: x4, y: y4 } = line2.positionB
    let ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}

const minLimit = 200000000000000
const maxLimit = 400000000000000

const lines = text
    .splitLb()
    .map(item => {
        const [[positionX, positionY, positionZ], [velocityX, velocityY, velocityZ]] = item.split(" @ ").map(item => item.split(", ").map(Number))
        return {
            position: { x: positionX, y: positionY, z: positionZ },
            velocity: { x: velocityX, y: velocityY, z: velocityZ }
        }
    })
    .map(({position, velocity}) => ({
        positionA: position,
        positionB: {
            x: velocity.x + position.x,
            y: velocity.y + position.y,
            z: velocity.z + position.z
        }
    }))
   
let answer = 0
for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
        const lineA = lines[i]
        const lineB = lines[j]

        const intersection = intersect(lineA, lineB)

        if (intersection) {
            const isInFuture = intersection.x > lineA.positionA.x == lineA.positionB.x - lineA.positionA.x > 0 
                && intersection.y > lineA.positionA.y == lineA.positionB.y - lineA.positionA.y > 0 
                && intersection.x > lineB.positionA.x == lineB.positionB.x - lineB.positionA.x > 0 
                && intersection.y > lineB.positionA.y == lineB.positionB.y - lineB.positionA.y > 0
            
            const isInBound = intersection.x >= minLimit && intersection.x <= maxLimit && intersection.y >= minLimit && intersection.y <= maxLimit
            
            if (isInBound && isInFuture) answer++
        }
    }
}

console.log(answer)