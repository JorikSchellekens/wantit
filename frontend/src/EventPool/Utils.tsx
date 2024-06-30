import { StarknetIdNavigator } from "starknetid.js";
// import { useBlock } from "@starknet-react/core";
import { Event } from "../types";
import { ERC20_ABI, SEPOLIA_TOKENS, LOADING_EVENT } from "../consts";
import { constants, shortString } from "starknet";
import { stringFromByteArray } from "../utils";
import { EVENT_POOL_CLASS } from "../starknet_assets/classes/eventPool";
import { useContractRead, useNetwork, useProvider } from "@starknet-react/core";


// The pools props is an event
interface PoolProps {
    contractAddress: string;
}


function dec2hex(str: bigint) { // .toString(16) only works up to 2^53
    const dec = str.toString().split(''), sum = [], hex = [];
    let i, s
    while (dec.length) {
        // @ts-expect-error we know we won't overshoot
        s = 1 * dec.shift()
        for (i = 0; s || i < sum.length; i++) {
            s += (sum[i] || 0) * 10
            sum[i] = s % 16
            s = (s - sum[i]) / 16
        }
    }
    while (sum.length) {
        // @ts-expect-error we know we won't overshoot
        hex.push(sum.pop().toString(16))
    }
    return hex.join('')
}


export function getEventData({ contractAddress }: PoolProps): Event {
    // Get the title, description and payouts from the contract
    const event: Event = LOADING_EVENT;

    const { provider } = useProvider();
    const { chain } = useNetwork();
    const starknetIdNavigator = new StarknetIdNavigator(
        provider,
        `0x${dec2hex(chain.id)}` as unknown as constants.StarknetChainId
    );

    const { data: titleData } = useContractRead({
        functionName: "title",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (titleData !== undefined) {
        // @ts-expect-error we know the data format
        event.title = stringFromByteArray(titleData);
    }

    // Get the description
    const { data: descriptionData } = useContractRead({
        functionName: "wish",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (descriptionData !== undefined) {
        // @ts-expect-error we know the data format
        event.description = stringFromByteArray(descriptionData);
    }

    // Get the payouts
    // First we fetch the list of recipients
    const { data: recipientsData } = useContractRead({
        functionName: "recipients",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (recipientsData !== undefined) {
        // @ts-expect-error we know the data format
        event.payouts = recipientsData.map((recipient: bigint) => {
            return { identity: { address: `0x${recipient.toString(16)}` }, proportion: 1 }
        });
    }

    // Then the list of recipient_shares
    const { data: sharesData } = useContractRead({
        functionName: "recipient_shares",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (sharesData !== undefined) {
        event.payouts = event.payouts.map((payout, index) => {
            // @ts-expect-error we know the data format
            return { identity: payout.identity, proportion: Number(sharesData[index]) }
        });
    }

    // Get the resolver address (note we only suport the CoordinatorResolutionStrategy for now)
    const { data: resolverData } = useContractRead({
        functionName: "oracle",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (resolverData !== undefined) {
        event.resolutionStrategy = { type: "coordinator", coordinator: { address: `0x${resolverData.toString(16)}` } };
    }

    // Get the starknet id of the coordinators and the recipients if thay have one
    for (const payout of event.payouts) {
        starknetIdNavigator.getStarkName(payout.identity.address).then((snid) => payout.identity.snid = snid).catch(console.log);
    }

    // Get the event pool token balance in ETH and STRK
    const { data: ethBalance } = useContractRead({
        functionName: "balance_of",
        address: SEPOLIA_TOKENS.ETH,
        abi: ERC20_ABI,
        args: [contractAddress],
        watch: true,
    })
    if (ethBalance !== undefined) {
        console.log({ ethBalance })
        // @ts-expect-error we know the data format
        event.poolBalances[SEPOLIA_TOKENS.ETH] = ethBalance;
    }

    // Get the event pool token balance in STRK
    const { data: strkBalance } = useContractRead({
        functionName: "balance_of",
        address: SEPOLIA_TOKENS.STRK,
        abi: ERC20_ABI,
        args: [contractAddress],
        watch: true,
    })
    if (strkBalance !== undefined) {
        // @ts-expect-error we know the data format
        event.poolBalances[SEPOLIA_TOKENS.STRK] = strkBalance;
    }

    // Get the event pool success criteria
    const { data: successCriteriaData } = useContractRead({
        functionName: "success_criteria",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (successCriteriaData !== undefined) {
        // @ts-expect-error we know the data format
        event.successCriteria = stringFromByteArray(successCriteriaData);
    }

    // Get the event pool categories
    const { data: categoriesData } = useContractRead({
        functionName: "categories",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (categoriesData !== undefined) {
        // @ts-expect-error we know the data format
        event.categories = categoriesData.map((category: bigint) => shortString.decodeShortString(`0x${category.toString(16)}`));
    }

    // Get the event pool fee address
    const { data: feeAddressData } = useContractRead({
        functionName: "fee_address",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (feeAddressData !== undefined) {
        event.feeAddress = `0x${feeAddressData.toString(16)}`;
    }

    // Get the event pool pay fee
    const { data: payFeeData } = useContractRead({
        functionName: "pay_fee",
        address: contractAddress,
        abi: EVENT_POOL_CLASS.abi,
        watch: true,
    })
    if (payFeeData !== undefined) {
        // @ts-expect-error we know the data format
        event.payFee = payFeeData;
    }
    return event;
}


