import "../utils/index.ts"

const text = await Deno.readTextFile("./Day07/input.txt")

const getStrength = (hand: string[]) => {
    const handSet = new Set(hand)
    // 5 of a kind
    if (handSet.size === 1) return 6;
    else if (handSet.size === 2) {
        // 4 of a kind
        if ([4,1].includes(hand.filter(item => item === hand[0]).length)) return 5;
        // Full house
        else return 4
    }
    else if (handSet.size === 3) {
        if (hand.some(h => hand.filter(item => item === h).length === 3)) return 3;
        else return 2
    }
    else if (handSet.size === 4) return 1;
    else return 0
}

const getCardStrength = (card: string): number => {
    const cardOrder = [..."AKQJT98765432"];
    return cardOrder.indexOf(card);
};

const answer = text
    .splitLb()
    .map(item => {
        const [hand, bid] = item.split(" ")
        return {
            hand: hand.split(""),
            bid: Number(bid),
            strength: getStrength(hand.split(""))
        }
    })
    .sort((a, b) => {
        if (a.strength > b.strength) return -1
        if (a.strength < b.strength) return 1
        for (let i = 0; i < a.hand.length; i++) {
            if (getCardStrength(a.hand[i]) < getCardStrength(b.hand[i])) return -1
            if (getCardStrength(a.hand[i]) > getCardStrength(b.hand[i])) return 1
        }
        return 0
    })
    .map((item, idx, arr) => ({ ...item, rank: arr.length - idx }))
    .reduce((acc, item) => acc + item.rank * item.bid, 0)

console.log(answer)