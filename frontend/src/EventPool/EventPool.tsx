import React from "react";
import { StarknetIdNavigator } from "starknetid.js";
// import { useBlock } from "@starknet-react/core";
import { Card, Grid, Stack, Typography } from "@mui/joy";
import { Event } from "../types";
import { ERC20_ABI, SEPOLIA_TOKENS, LOADING_EVENT } from "../consts";
import { constants } from "starknet";
import strk_icon from "../assets/STRK.svg"
import eth_icon from "../assets/ETH.png"
import { stringFromByteArray } from "../utils";
import { EVENT_POOL_CLASS } from "../starknet_assets/classes/eventPool";
import { EventPoolPopup } from "./EventPoolPopup";
import { useContractRead, useNetwork, useProvider } from "@starknet-react/core";


// The pools props is an event
interface PoolProps {
    contractAddress: string;
    isActive: boolean;
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


// An eventpool is a collection of liquidity which can permissionlessly be added to.
// The event pool has an event attached to it and a list of addresses to which
// the pool will be distributed. The pool is distributed to the addresses when the event attached occurs.
// The pool has a value which can be made of any number of tokens.
// Users can add to the pool by clicking the "believe" button.
// The believe button pops up a modal which gives a short discription
function EventCard({ event, contractAddress, isActive }: { event: Event, contractAddress: string, isActive: boolean }) {
    return (
        <Card sx={{ height: '300px'}}>
            <Stack spacing={2} sx={{overflow: "hidden", height: '100%', justifyContent: 'space-between'}}>
                <Stack spacing={2} sx={{overflow: "hidden", textOverflow: "ellipsis"}}>
                <Typography level="h4">{event.title}</Typography>
                <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{event.description}</Typography>
                </Stack>
                <Stack spacing={2}>
                <Grid container spacing={2} sx={{ justifyContent: 'space-between', flexGrow: 1 }}>
                    <Grid xs={5} sx={{backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <Stack direction="row" spacing={1}>
                        <img src={eth_icon} alt="ETH" style={{ width: '20px', height: '30px' }} />
                        <Typography sx={{ fontWeight: 'bold' }}>
                            {(parseFloat(event.poolBalances[SEPOLIA_TOKENS.ETH]?.toString() || '0') / 10 ** 18).toLocaleString(undefined, { maximumFractionDigits: 18 })}
                        </Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={5} sx={{backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <Stack direction="row" spacing={1}>
                        <img src={strk_icon} alt="STRK" style={{ width: '30px', height: '30px' }} />
                        <Typography sx={{ fontWeight: 'bold' }}>
                            {(parseFloat(event.poolBalances[SEPOLIA_TOKENS.STRK]?.toString() || '0') / 10 ** 18).toLocaleString(undefined, { maximumFractionDigits: 18 })}
                        </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <EventPoolPopup event={event} contractAddress={contractAddress} buttonTitle={"Make it happen"} isActive={isActive}/>
                </Stack>
            </Stack>
        </Card>
    );
}


function EventPool({ contractAddress, isActive}: PoolProps) {
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

    return <EventCard event={event} contractAddress={contractAddress} isActive={isActive}/>;
}

export default EventPool;
