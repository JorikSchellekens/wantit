import React, { useMemo } from "react";
import { StarknetIdNavigator } from "starknetid.js";
// import { useBlock } from "@starknet-react/core";
import { Box, Button, CircularProgress, Divider, Input, Option, Select, Stack, Typography } from "@mui/joy";
import { Event } from "./types";
import Dialog from "./components/ui/Dialog";
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { LinkType, VoyagerLink } from "./VoyagerLink";
import { useAccount, useContract, useContractRead, useContractWrite, useNetwork, useProvider } from "@starknet-react/core";
import { ERC20_ABI, SEPOLIA_TOKENS, LOADING_EVENT } from "./consts";
import { constants } from "starknet";
import strk_icon from "./assets/STRK.svg"
import eth_icon from "./assets/ETH.png"
import { stringFromByteArray } from "./utils";
import { EVENT_POOL_CLASS } from "./starknet_assets/classes/eventPool";


interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

// The pools props is an event
interface PoolProps {
    contractAddress: string;
}

const NumericFormatAdapter = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatAdapter(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix=""
            />
        );
    },
);

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
function EventPool({ contractAddress }: PoolProps) {
    // Get the title, description and payouts from the contract
    const event: Event = LOADING_EVENT;
    const [selectedSymbol, setSelectedSymbol] = React.useState('ETH');

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
        console.log({ethBalance})
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

    const { contract: ethContract } = useContract({abi: ERC20_ABI, address: SEPOLIA_TOKENS.ETH});
    const { contract: strkContract } = useContract({abi: ERC20_ABI, address: SEPOLIA_TOKENS.STRK});

    const [value, setValue] = React.useState('0.5');

    const calls = useMemo(() => {
        if (ethContract === undefined || strkContract === undefined) return [];
        const bigVal = BigInt(parseFloat(value || "0") * 10**18);
        console.log({bigVal})
        let ret;
        switch(selectedSymbol) {
            case 'ETH':
                ret = ethContract.populateTransaction["transfer"]!(contractAddress, {low: bigVal % 2n**251n, high: bigVal / 2n**251n});
                break;
            case 'STRK':
                ret = strkContract.populateTransaction["transfer"]!(contractAddress, {low: bigVal % 2n**251n, high: bigVal / 2n**251n});
                break;
        }
        console.log(ret)
        return ret;
    }, [value, contractAddress, selectedSymbol, ethContract, strkContract]);
    console.log(selectedSymbol)

    console.log("calls", calls)
	const {
		writeAsync,
		data,
		isPending,
	} = useContractWrite({
		calls,
	});

    const totalProportions = event.payouts.reduce((acc, payout) => acc + payout.proportion, 0);
    let resolutionStrategy;
    const { address } = useAccount();

    const { contract: poolContract } = useContract({abi: EVENT_POOL_CLASS.abi, address: contractAddress});

    const payoutCall = useMemo(() => {
        if (!poolContract) return [];
        return poolContract.populateTransaction["payout"]!([SEPOLIA_TOKENS.ETH, SEPOLIA_TOKENS.STRK]);
    }, [poolContract]);

    const {
        writeAsync: writeAsyncPayout,
    } = useContractWrite({
        calls: payoutCall,
    });

    switch (event.resolutionStrategy.type) {
        case 'coordinator':
            resolutionStrategy =
                <Box>
                    <Typography>This event is managed by an unkown address. Please carefully check the legitimacy and powers of the address (e.g. is this a trusted person in your community, is it a dao with a vote? is it some other smart contract triggered by an oracle?).</Typography>
                    <Typography>Address: <VoyagerLink identity={event.resolutionStrategy.coordinator} type={LinkType.Identity}/></Typography>
                    {address === event.resolutionStrategy.coordinator.address && (
                            <Stack direction="column" spacing={2}>
                                <br />
                                <Typography level="h4">You are the resolver for the pool</Typography>
                                <Typography>As the coordinator, you have the ability to resolve this event and distribute the pool to the recipients.</Typography>
                                <Button onClick={async () => {
                                    await writeAsyncPayout();
                                }}>Resolve Event</Button>
                            </Stack>
                    )}
                </Box>;
            break;
        case 'UMA':
            resolutionStrategy = <Box>
                <Typography>This event is managed by the UMA optimistic offchain oracle with a dispute resolution system. Disputes are resolved by the vote of the UMA DAO and protected by the UMA treasury.</Typography>
                <Typography>Please note, there is no specific address or SNID for UMA resolution as it is a decentralized process.</Typography>
            </Box>;
            break;
        case 'DAO':
            resolutionStrategy = <Box>
                <Typography>This event is managed by a DAO. The DAO is a contract controlled by a DAO vote.</Typography>
                <Typography>DAO Contract: <VoyagerLink identity={event.resolutionStrategy.DAO} type={LinkType.Identity} /></Typography>
            </Box>;
            break;
    }

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="px-4 py-2" sx={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px', backgroundColor: '#f9f9f9' }}>
            <Stack spacing={2}>
                <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{event.title}</Box>
                <Box sx={{ fontSize: '16px', color: '#666' }}>{event.description}</Box>
                <Stack direction="row" spacing={3} alignItems="left">
                    <Stack direction="row" spacing={1} sx={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        <img src={eth_icon} alt="ETH" style={{ verticalAlign: 'middle', width: '20px', height: '30px' }} />
                        <p>{(parseFloat(event.poolBalances[SEPOLIA_TOKENS.ETH]?.toString()) / 10**18 ).toLocaleString(undefined, {maximumFractionDigits: 18})}</p>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        <img src={strk_icon} alt="STRK" style={{ verticalAlign: 'middle', width: '30px', height: '30px' }} />
                        <p>{(parseFloat(event.poolBalances[SEPOLIA_TOKENS.STRK]?.toString()) / 10**18 ).toLocaleString(undefined, {maximumFractionDigits: 18})}</p>
                    </Stack>
                </Stack>
            </Stack>
            <Dialog title={event.title} buttonTitle="Believe">
                <Stack direction="column" spacing={2} justifyContent="space-between" alignItems="left" className="px-4 py-2">
                    <Box sx={{ fontSize: '16px', color: '#666' }}>{event.description}</Box>
                    <Typography>Pool Contract: <VoyagerLink identity={{address: contractAddress}} type={LinkType.Identity}/></Typography>
                    <Divider />
                    <Typography level="h4">Total Pool</Typography>
                    <Stack direction="row" spacing={3} alignItems="left">
                        <Stack direction="row" spacing={1} sx={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                            <img src={eth_icon} alt="ETH" style={{ verticalAlign: 'middle', width: '20px', height: '30px' }} />
                            <p>{(parseFloat(event.poolBalances[SEPOLIA_TOKENS.ETH]?.toString()) / 10**18 ).toLocaleString(undefined, {maximumFractionDigits: 18})}</p>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                            <img src={strk_icon} alt="STRK" style={{ verticalAlign: 'middle', width: '30px', height: '30px' }} />
                            <p>{(parseFloat(event.poolBalances[SEPOLIA_TOKENS.STRK]?.toString()) / 10**18 ).toLocaleString(undefined, {maximumFractionDigits: 18})}</p>
                        </Stack>
                    </Stack>
                    <Typography level="h4">Will you make it happen??</Typography>
                    <Stack direction="row" spacing={3} alignItems="left">
                        <Input
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            placeholder="Placeholder"
                            slotProps={{
                                input: {
                                    component: NumericFormatAdapter,
                                },
                            }}
                        />
                        <Select
                            defaultValue={'ETH'}
                            // @ts-expect-error fuck you
                            onChange={(_, newValue) => setSelectedSymbol(newValue)}
                        >
                            <Option value={'ETH'}>
                                ETH
                            </Option>
                            <Option value={'STRK'}>
                                STRK
                            </Option>
                        </Select>
                        {isPending ? <CircularProgress /> : data == undefined ? 
                        <Button disabled={!value} onClick={() => writeAsync()}>Send it</Button> :
                        <VoyagerLink identity={{address: data.transaction_hash}} type={LinkType.Transaction}/>
                        }
                    </Stack>
                    <Divider />
                    <Typography level="h4">Rewards</Typography>
                    <Stack direction="row" spacing={3} alignItems="left">
                        {event.payouts.map((payout, index) => <Stack direction="row" key={index} spacing={3} alignItems="left">
                            <Stack direction="row" spacing={1} alignItems="left">
                                    <Stack direction="row" spacing={1} sx={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                                        <img src={eth_icon} alt="ETH" style={{ verticalAlign: 'middle', width: '20px', height: '30px' }} />
                                        <p>{(event.poolBalances[SEPOLIA_TOKENS.ETH] ? event.poolBalances[SEPOLIA_TOKENS.ETH] * BigInt(payout.proportion) / 100n : 0).toLocaleString()}</p>
                                    </Stack>
                                    <Stack direction="row" spacing={1} sx={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                                        <img src={strk_icon} alt="STRK" style={{ verticalAlign: 'middle', width: '30px', height: '30px' }} />
                                        <p>{(event.poolBalances[SEPOLIA_TOKENS.STRK] ? event.poolBalances[SEPOLIA_TOKENS.STRK] * BigInt(payout.proportion) / 100n : 0).toLocaleString()}</p>
                                    </Stack>
                                    <p>to</p>
                                <VoyagerLink identity={payout.identity} type={LinkType.Identity}/>
                                <Typography>{(payout.proportion / totalProportions * 100).toFixed(0) + "/100"}</Typography>
                            </Stack>
                        </Stack>
                        )}
                    </Stack>
                    <Divider />
                    <Typography level="h4">Success Criteria</Typography>
                    <Box sx={{ fontSize: '16px', color: '#666' }}>The precise definition of what the oracle must verify will be written here. It is currently missing because there is some bug in the contract creation :/{event.successCriteria}</Box>
                    <Typography level="h4">Pool Resolution Strategy</Typography>
                    <Stack direction="column" spacing={2} alignItems="left">
                        {resolutionStrategy}
                    </Stack>
                </Stack>
            </Dialog>
        </Stack>
    );
}


export default EventPool;

