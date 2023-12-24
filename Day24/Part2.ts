/** Due to a bug in Deno with using Z3, run this file with node */

const { init } = require('z3-solver')
const { readFileSync } = require('fs')

const main =  async () => {
    const text = readFileSync("./Day24/input.txt", 'utf8')

    const lines = text
        .split("\r\n")
        .map(item => {
            const [[positionX, positionY, positionZ], [velocityX, velocityY, velocityZ]] = item.split(" @ ").map(item => item.split(", ").map(Number))
            return {
                position: { x: positionX, y: positionY, z: positionZ },
                velocity: { x: velocityX, y: velocityY, z: velocityZ }
            }
        })
    
    const { Context } = await init();
    const { Solver, Int} = new Context('Default');
    const solver = new Solver();
    const x = Int.const('x');
    const y = Int.const('y');
    const z = Int.const('z');
    const vx = Int.const('vx');
    const vy = Int.const('vy');
    const vz = Int.const('vz');
    const t = lines.map((_, i) => Int.const(`t${i}`))
    
    lines.forEach((line, i) => {
        solver.add(t[i].mul(line.velocity.x).add(line.position.x).sub(x).sub(t[i].mul(vx)).eq(0))
        solver.add(t[i].mul(line.velocity.y).add(line.position.y).sub(y).sub(t[i].mul(vy)).eq(0))
        solver.add(t[i].mul(line.velocity.z).add(line.position.z).sub(z).sub(t[i].mul(vz)).eq(0))
    })
    
    await solver.check()
    console.log(Number(solver.model().eval(x.add(y).add(z)).value()))
}

main()