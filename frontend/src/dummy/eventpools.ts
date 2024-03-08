import { Event } from "../types";

const eventpools : Event[] = [
    {
        title: "Mark vs Elon boxing match",
        description: "Are you mad you didn't get to see this? Let's see if we can get their attention.",
        successCriteria: "Are you mad you didn't get to see this? Let's see if we can get their attention.",
        expiery: 12345678,
        payouts: [
            { identity: { address: "0x123", snid: "mark.strk" }, proportion: 50 },
            { identity: { address: "0x456", snid: "elon.strk" }, proportion: 50 }
        ],
        poolBalances: {
            "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d": 345245223452n,
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": 23423425n
        },
        resolutionStrategy: { type: "coordinator", coordinator: {address: "0x789"} }
    },
    {
        title: "Rolling Stones, London 2024!",
        description: "We will get them back togstrker!",
        successCriteria: "Are you mad you didn't get to see this? Let's see if we can get their attention.",
        expiery: 23456789,
        payouts: [
            { identity: { address: "0x789", snid: "mickjagger.strk" }, proportion: 25 },
            { identity: { address: "0xabc", snid: "keithrichards.strk" }, proportion: 25 },
            { identity: { address: "0xdef", snid: "ronwood.strk" }, proportion: 25 },
            { identity: { address: "0xghi", snid: "charliewatts.strk" }, proportion: 25 }
        ],
        poolBalances: {
            "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d": 345245223452n,
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": 23423425n
        },
        resolutionStrategy: { type: "coordinator", coordinator: {address: "0x789", snid: "resolutions.strk" }}
    },
]

export default eventpools;