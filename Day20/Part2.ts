import "../utils/index.ts"

type HighLow = "high" | "low"

type BroadcasterModule = {
    type: 'broadcaster'
    key: string,
    destinations: string[]
}

type FlipFlopModule = {
    type: 'flipflop'
    key: string,
    prefix: string
    destinations: string[]
    state: HighLow
}

type ConjunctionModule = {
    type: 'conjunction'
    key: string,
    prefix: string
    destinations: string[]
    memory: {key: string, state: HighLow}[]
}

const text = await Deno.readTextFile("./Day20/input.txt")

const modules = text
    .splitLb()
    .map(item => {
        const [key, destinationsStr] = item.split(" -> ")
        if (key === "broadcaster") {
            return {
                type: 'broadcaster',
                key: key,
                destinations: destinationsStr.split(", ")
            } as BroadcasterModule
        }
        
        const prefix = key !== "broadcaster" ? key.slice(0, 1) : undefined
        if (prefix === "%") {
            return {
                type: 'flipflop',
                key: key.slice(1),
                prefix: prefix,
                destinations: destinationsStr.split(", "),
                state: "low"
            } as FlipFlopModule
        }

        return {
            type: 'conjunction',
            key: key.slice(1),
            prefix: prefix,
            destinations: destinationsStr.split(", "),
            memory: []
        } as ConjunctionModule
    })

let i = 0;
let lows = 0;
let highs = 0;  

let rxSources = [] as {key: string, value: number}[]

while(true) {
    i++;

    if (rxSources.length === 0) {
        const rxSource = modules.find(item => item.destinations.includes("rx")) as ConjunctionModule
        if (rxSource.memory.length > 0) {
            rxSources = rxSource.memory.map(item => ({key: item.key, value: 0}))
        }
    }
    
    let actions = [{key: 'broadcaster', source: "button", value: 'low'}] as {key: string, source: string, value: HighLow}[]
    let newActions = [] as typeof actions
    
    while (true) {
    
        const flipflops = []
        for (const action of actions) {

            if (rxSources.length > 0) {
                const rxSource = rxSources.find(item => item.key === action.key)
                if (rxSource && rxSource.value === 0 && action.value === "low") {
                    rxSource.value = i
                }
            }

            const module = modules.find(item => item.key === action.key)
    
            if (action.value === "low") lows++
            if (action.value === "high") highs++
    
            if (module) {
    
                if (module.type === 'broadcaster') {
                    module.destinations.forEach(item => {
                        newActions.push({key: item, source: module.key, value: action.value})
                    })
                }
        
                if (module.type === 'flipflop') {
                    if (action.value === "low") {
                        flipflops.push(module.key)
                        if (module.state === "low") {
                            module.destinations.forEach(item => {
                                newActions.push({key: item, source: module.key, value: "high"})
                            })
                        } else {
                            module.destinations.forEach(item => {
                                newActions.push({key: item,source: module.key, value: "low"})
                            })
                        }
                    }
                }
        
                if (module.type === "conjunction") {
                    const inputModules = modules.filter(item => item.destinations.includes(module.key))
                    if (module.memory.length === 0) {
                        module.memory = inputModules.map(item => ({key: item.key, state: "low"}))
                    }
        
                    const memSource = module.memory.find(item => item.key === action.source)!
                    memSource.state = action.value
        
                    if (module.memory.every(item => item.state === "high")) {
                        module.destinations.forEach(item => {
                            newActions.push({key: item, source: module.key, value: "low"})
                        })
                    } else {
                        module.destinations.forEach(item => {
                            newActions.push({key: item, source: module.key, value: "high"})
                        })
                    }
                }
        
               
            }
        }
        
        actions = newActions
        newActions = []
        
        flipflops.forEach(key => {
            const module = modules.find(item => item.key === key) as FlipFlopModule
            module.state = module.state === "low" ? "high" : "low"
        })
    
        if (actions.length === 0 || rxSources.length > 0 && rxSources.every(item => item.value !== 0)) break
    }    

    if (rxSources.length > 0 && rxSources.every(item => item.value !== 0)) break;
} 

console.log(rxSources)
console.log(rxSources.map(item => item.value).lcm())