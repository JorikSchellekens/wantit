
import { Box, Button, CircularProgress, Divider, Input, Option, Select, Stack, Typography } from '@mui/joy';
import { useAccount, useContract, useContractWrite } from '@starknet-react/core';
import React, { useMemo, useState } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { LinkType, VoyagerLink } from '../VoyagerLink';
import eth_icon from "../assets/ETH.png";
import strk_icon from "../assets/STRK.svg";
import { Dialog } from "../components/ui/Dialog";
import { ERC20_ABI, SEPOLIA_TOKENS } from '../consts';
import { EVENT_POOL_CLASS } from '../starknet_assets/classes/eventPool';
import { Event } from "../types";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
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
export function EventPoolPopup({ event, contractAddress, buttonTitle, isActive }: { event: Event, contractAddress: string, buttonTitle: string, isActive: boolean }) {
    const [selectedSymbol, setSelectedSymbol] = useState('ETH');
    const [value, setValue] = useState('0.5');
    const { address } = useAccount();

    const { contract: ethContract } = useContract({ abi: ERC20_ABI, address: SEPOLIA_TOKENS.ETH });
    const { contract: strkContract } = useContract({ abi: ERC20_ABI, address: SEPOLIA_TOKENS.STRK });
    const { contract: poolContract } = useContract({ abi: EVENT_POOL_CLASS.abi, address: contractAddress });

    const calls = useMemo(() => {
        if (ethContract === undefined || strkContract === undefined) return [];
        const bigVal = BigInt(parseFloat(value || "0") * 10 ** 18);
        let ret;
        switch (selectedSymbol) {
            case 'ETH':
                ret = ethContract.populateTransaction["transfer"]!(contractAddress, { low: bigVal % 2n ** 251n, high: bigVal / 2n ** 251n });
                break;
            case 'STRK':
                ret = strkContract.populateTransaction["transfer"]!(contractAddress, { low: bigVal % 2n ** 251n, high: bigVal / 2n ** 251n });
                break;
        }
        return ret;
    }, [value, contractAddress, selectedSymbol, ethContract, strkContract]);

    const {
        writeAsync,
        data,
        isPending,
    } = useContractWrite({
        calls,
    });

    const payoutCall = useMemo(() => {
        if (!poolContract) return [];
        return poolContract.populateTransaction["payout"]!([SEPOLIA_TOKENS.ETH, SEPOLIA_TOKENS.STRK]);
    }, [poolContract]);

    const {
        writeAsync: writeAsyncPayout,
    } = useContractWrite({
        calls: payoutCall,
    });

    const totalProportions = event.payouts.reduce((acc, payout) => acc + payout.proportion, 0);
    let resolutionStrategy;
    switch (event.resolutionStrategy.type) {
        case 'coordinator':
            resolutionStrategy = (
                <Box>
                    <Typography>
                        This event is managed by a coordinator address. Please carefully check the legitimacy and powers of the address (e.g. is this a trusted person in your community, is it a DAO with a vote? is it some other smart contract triggered by an oracle?).
                    </Typography>
                    <Typography>
                        Coordinator Address: <VoyagerLink identity={event.resolutionStrategy.coordinator} type={LinkType.Identity} />
                    </Typography>
                    {address === event.resolutionStrategy.coordinator.address && (
                        <Stack direction="column" spacing={2}>
                            <br />
                            <Divider />
                            <Typography level="h4">You are the coordinator for this pool</Typography>
                            <Typography>As the coordinator, you have the ability to resolve this event and distribute the pool to the recipients.</Typography>
                            <Button onClick={async () => await writeAsyncPayout()}>
                                Resolve Event
                            </Button>
                        </Stack>
                    )}
                </Box>
            );
            break;
        case 'UMA':
            resolutionStrategy = (
                <Box>
                    <Typography>
                        This event is managed by the UMA Optimistic Oracle with a dispute resolution system. Disputes are resolved by UMA tokenholders and protected by the UMA treasury.
                    </Typography>
                    <Typography>
                        Please note, there is no specific address for UMA resolution as it is a decentralized process.
                    </Typography>
                </Box>
            );
            break;
        case 'DAO':
            resolutionStrategy = (
                <Box>
                    <Typography>
                        This event is managed by a DAO. The DAO controls the resolution via a vote.
                    </Typography>
                    <Typography>
                        DAO Contract: <VoyagerLink identity={event.resolutionStrategy.DAO} type={LinkType.Identity} />
                    </Typography>
                </Box>
            );
            break;
    }

    return (
        <Dialog title={event.title} buttonTitle={buttonTitle} isActive={isActive}>
            <Stack direction="column" spacing={2} alignItems="stretch" >
                <Typography>{event.description}</Typography>
                <Typography>
                    Pool Contract: <VoyagerLink identity={{ address: contractAddress }} type={LinkType.Identity} />
                </Typography>
                <Divider />
                <Typography level="h4">Total Pool</Typography>
                <Stack direction="row" spacing={3}>
                    <Stack direction="row" spacing={1}>
                        <img src={eth_icon} alt="ETH" style={{ width: '20px', height: '30px' }} />
                        <Typography sx={{ fontWeight: 'bold' }}>
                            {(parseFloat(event.poolBalances[SEPOLIA_TOKENS.ETH]?.toString() || '0') / 10 ** 18).toLocaleString(undefined, { maximumFractionDigits: 18 })}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <img src={strk_icon} alt="STRK" style={{ width: '30px', height: '30px' }} />
                        <Typography sx={{ fontWeight: 'bold' }}>
                            {(parseFloat(event.poolBalances[SEPOLIA_TOKENS.STRK]?.toString() || '0') / 10 ** 18).toLocaleString(undefined, { maximumFractionDigits: 18 })}
                        </Typography>
                    </Stack>
                </Stack>
                <Typography level="h4">Will you make it happen?</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Amount"
                        slotProps={{
                            input: {
                                component: NumericFormatAdapter,
                            },
                        }}
                    />
                    <Select
                        defaultValue="ETH"
                        onChange={(_, newValue) => setSelectedSymbol(newValue as string)}
                    >
                        <Option value="ETH">ETH</Option>
                        <Option value="STRK">STRK</Option>
                    </Select>
                    {isPending ? (
                        <CircularProgress size="sm" />
                    ) : data ? (
                        <VoyagerLink identity={{ address: data.transaction_hash }} type={LinkType.Transaction} />
                    ) : (
                        <Button disabled={!value} onClick={() => writeAsync()}>
                            Send
                        </Button>
                    )}
                </Stack>
                <Divider />
                <Typography level="h4">Rewards</Typography>
                <Stack spacing={2}>
                    {event.payouts.map((payout, index) => (
                        <>
                        <Divider />
                        <Stack key={index} direction="row" spacing={2} alignItems="center">
                            <Stack direction="column" spacing={1}>
                            <Stack direction="row" spacing={1}>
                                <div style={{ width: '30px', height: '30px', alignContent: 'center' }}>
                                <img src={eth_icon} alt="ETH" style={{ width: '20px', height: '30px' }} />
                                </div>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    {(event.poolBalances[SEPOLIA_TOKENS.ETH] ? event.poolBalances[SEPOLIA_TOKENS.ETH] * BigInt(payout.proportion) / 100n : 0).toLocaleString()}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <img src={strk_icon} alt="STRK" style={{ width: '30px', height: '30px' }} />
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    {(event.poolBalances[SEPOLIA_TOKENS.STRK] ? event.poolBalances[SEPOLIA_TOKENS.STRK] * BigInt(payout.proportion) / 100n : 0).toLocaleString()}
                                </Typography>
                            </Stack>
                            </Stack>
                            <Typography>to</Typography>
                            <VoyagerLink identity={payout.identity} type={LinkType.Identity} />
                            <Typography>
                                {(payout.proportion / totalProportions * 100).toFixed(0) + "%"}
                            </Typography>
                        </Stack>
                        </>
                    ))}
                </Stack>
                <Divider />
                <Typography level="h4">Success Criteria</Typography>
                <Typography>
                    {event.successCriteria || 'The precise definition of what the oracle must verify will be written here. It is currently missing because there is some bug in the contract creation :/'}
                </Typography>
                <Typography level="h4">Pool Resolution Strategy</Typography>
                {resolutionStrategy}
            </Stack>
        </Dialog>
    );
}