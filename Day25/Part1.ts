import "../utils/index.ts"
import { mincut } from "npm:@graph-algorithm/minimum-cut"

const text = await Deno.readTextFile("./Day25/input.txt")

const cutConnection = (connections: Map<string, string[]>, componentA: string, componentB: string) => {
    const nodesA = connections.get(componentA) ?? []
    const nodesB = connections.get(componentB) ?? []

    connections.set(componentA, nodesA.filter(node => node !== componentB) ?? [])
    connections.set(componentB, nodesB.filter(node => node !== componentA) ?? [])

    return connections
}

const getGroups = (connections: Map<string, string[]>) => {
    const groups = [] as string[][]
    const visited = new Set<string>()

    for (const component of connections.keys()) {
        if (visited.has(component)) continue

        const group = [] as string[]
        const queue = [component]

        while (queue.length > 0) {
            const node = queue.pop()!
            if (visited.has(node)) continue

            group.push(node)
            visited.add(node)

            queue.push(...connections.get(node) ?? [])
        }

        groups.push(group)
    }

    return groups
}

const connections = [] as [string, string][]
const connectionsMap = new Map<string ,string[]>()

text
    .splitLb()
    .forEach(line => {
        const [component, connectionsString] = line.split(": ")
        const connectedComponents = connectionsString.split(" ")

        if (!connectionsMap.has(component)) {
            connectionsMap.set(component, connectedComponents)
        } else {
            connectionsMap.get(component)!.push(...connectedComponents)
        }

        for (const connection of connectedComponents) {
            connections.push([component, connection])

            if (!connectionsMap.has(connection)) connectionsMap.set(connection, [])

            const alreadyConnectedComponents = connectionsMap.get(connection)!
            alreadyConnectedComponents.push(component)
        }
    })

for (const [componentA, componentB] of mincut(connections)) {
    cutConnection(connectionsMap, componentA, componentB)
}

const groups = getGroups(connectionsMap)

const answer = groups[0].length * groups[1].length

console.log(answer)