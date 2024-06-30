import { Button, Divider, Stack } from '@mui/joy';
import React from 'react';
import examplePools from './assets/example_pools.json';
import { CONTRACT_FACTORY } from './starknet_assets/contracts/contractFactory';
import { AccountInterface, CallData, Contract, ProviderInterface } from 'starknet';
import { useAccount, useProvider } from '@starknet-react/core';
import { EVENT_POOL_CLASS } from './starknet_assets/classes/eventPool';
import { MainLayout } from './MainLayout';
import { byteArrayFromString } from './utils';
type ExamplePool = {
    title: string;
    wish: string;
    success_criteria: string;
    recipients: string[];
    recipient_shares: number[];
    oracle: string;
    fee_address: string;
    collect_fee: boolean;
    categories: string[];
};

async function deployPool(pool: ExamplePool, provider: ProviderInterface, account: AccountInterface) {
    const calldataCompiler = new CallData(EVENT_POOL_CLASS.abi);


    const constructor_args = {
        title: byteArrayFromString(pool.title),
        wish: byteArrayFromString(pool.wish),
        success_criteria: byteArrayFromString(pool.success_criteria),
        recipients: pool.recipients,
        recipient_shares: pool.recipient_shares.map((share) => BigInt(share)),
        oracle: pool.oracle,
        fee_address: pool.fee_address,
        collect_fee: pool.collect_fee,
        categories: pool.categories,
    };

    try {
        const constructorCalldata = calldataCompiler.compile('constructor', constructor_args);
        const factoryContract = new Contract(CONTRACT_FACTORY.class.abi, CONTRACT_FACTORY.address, provider);
        factoryContract.connect(account);
        const deployResponse = await factoryContract.deploy(constructorCalldata);
        await provider.waitForTransaction(deployResponse.transaction_hash);
        console.log(`Deployed contract at address: ${deployResponse.contract_address}`);
    } catch (error) {
        console.error("Deployment error:", error);
        alert("Failed to deploy contract.");
    }
}

export function DeployExamples() {

    const { provider } = useProvider();
    const { account } = useAccount();

    if (!account) {
        return <MainLayout><h1>Please connect your wallet</h1></MainLayout>;
    }
    const handleDeployExamples = async (index: number | undefined) => {
        if (index === undefined) {
            for (const pool of examplePools) {
                await deployPool(pool, provider, account);
            }
        } else {
            await deployPool(examplePools[index], provider, account);
        }
    };


    // Deploy a specific example pool

    return (
        <MainLayout>
            <Stack direction="column" spacing={2}>
                {examplePools.map((pool, index) => (
                    <Button key={index} onClick={() => handleDeployExamples(index)}>
                        {pool.title}
                    </Button>
                ))}
                <Divider />
                <Button onClick={() => handleDeployExamples(undefined)}>Deploy All</Button>
            </Stack>
        </MainLayout>
    );
}

