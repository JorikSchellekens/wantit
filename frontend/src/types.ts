// An Identity is an onchain identifier and a potential ens name.
export type Identity = { address: string; snid?: string };

// A resolution strategy is one of "coordinator", "UMA", or "DAO"
// A Coordinator is an elected contract which can trigger the event completion at any time. They are a trusted entity in this case. Users should exercise due diligence and
// check the legitimacy of these entities.
// UMA is an optimistic offchain oracle with a dispute oracle system. Disputes are resolved by the vote of the UMA DAO and protected by the UMA treasury.
// A DAO resolution strategy is simply a contract controlled by an elected dau vote.
// This is made with a discriminated union
export type ResolutionStrategy = CoordinatorResolutionStrategy | UMAResolutionStrategy | DAOResolutionStrategy;

// A CoordinatorResolutionStrategy is simply a coordinator address
export type CoordinatorResolutionStrategy = { type: "coordinator"; coordinator: Identity };

// A UMAResolutionStrategy is an empty type
export type UMAResolutionStrategy = { type: "UMA" };

// A DAOResolutionStrategy is a DAO address
export type DAOResolutionStrategy = { type: "DAO"; DAO: Identity };

// An event is a title, a description, an optional expiery block, a list of addresses and proportions, a PoolSize, and a ResolutionStrategy
export interface Event {
    title: string;
    description: string;
    successCriteria: string;
    expiery?: number;
    payouts: { identity: Identity, proportion: number }[];
    poolBalances: ERC20Balances;
    resolutionStrategy: ResolutionStrategy;
}

// An ERC20Balance is a token address, a balance, and a name
export type ERC20Balances = { [key: string]: bigint };



// The ContractList types is the type returned by Voyager's class/contract fetch.
// Here is an example
// "items": [
//    {
//        "address": "0x06a443b413c0c9ec04a502976a77b7defc0e2949a0a5f6e2632212ce013e37b4",
//        "creationTimestamp": 1709061225,
//        "txnCount": "0",
//        "starknetId": null,
//        "contractAlias": null
//    },
//]
export type ContractList = {
    items: Contract[];
}

export type Contract = {
    address: string;
    creationTimestamp: number;
    txnCount: string;
    starknetId: string;
    contractAlias: string;
}