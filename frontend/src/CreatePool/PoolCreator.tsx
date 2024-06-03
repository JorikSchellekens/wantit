import React, { useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import { Dialog } from "../components/ui/Dialog";
import { CircularProgress, Button, Typography, Input, Textarea, Stack, Checkbox } from "@mui/joy";
import { CATEGORIES, EMPTY_BYTE_ARRAY } from "../consts";
import { CallData, Contract } from "starknet";
import { ByteArray, byteArrayFromString, stringFromByteArray } from "../utils";
import { LinkType, VoyagerLink } from "../VoyagerLink";
import { EVENT_POOL_CLASS } from "../starknet_assets/classes/eventPool";
import { CONTRACT_FACTORY } from "../starknet_assets/contracts/contractFactory";
import { MultiSelector } from "../components/ui/MultiSelector";

// This type holds all the arguments for the constructor of the EventPool contract.
type EventPoolConstructorArgs = {
    title: ByteArray;
    wish: ByteArray;
    "success_criteria": ByteArray;
    recipients: string[];
    "recipient_shares": bigint[];
    oracle: string;
    payFee: boolean;
    categories: string[];
};

const calldataCompiler = new CallData(EVENT_POOL_CLASS.abi);

const PoolCreator = () => {
    const { account } = useAccount();
    const { provider } = useProvider();
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployedContractAddress, setDeployedContractAddress] = useState("");

    const handleDeploy = async (constructor_args: EventPoolConstructorArgs) => {
        if (!account) {
            alert("Please connect your wallet.");
            return;
        }

        setIsDeploying(true);

        try {
            console.log(constructor_args)
            const constructorCalldata = calldataCompiler.compile('constructor', constructor_args);

            const factoryContract = new Contract(CONTRACT_FACTORY.class.abi, CONTRACT_FACTORY.address, provider)
            factoryContract.connect(account);
            const deployResponse = await factoryContract.deploy(constructorCalldata);
            await provider.waitForTransaction(deployResponse.transaction_hash);

            setDeployedContractAddress(deployResponse.contract_address);
        } catch (error) {
            console.error("Deployment error:", error);
            alert("Failed to deploy contract.");
        } finally {
            setIsDeploying(false);
        }
    };

    const [formData, setFormData] = useState<EventPoolConstructorArgs>({
        title: EMPTY_BYTE_ARRAY,
        wish: EMPTY_BYTE_ARRAY,
        success_criteria: EMPTY_BYTE_ARRAY,
        recipients: [""],
        recipient_shares: [1n],
        oracle: '',
        payFee: true,
        categories: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof EventPoolConstructorArgs) => {
        let val: string | ByteArray = e.target.value;
        if (field === 'title' || field === 'wish' || field === 'success_criteria') {
            // Convert string to bytes with encoding javascript style
            val = byteArrayFromString(val);
        }

        setFormData({ ...formData, [field]: val });
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof EventPoolConstructorArgs, index: number) => {
        const array: string[] = [...formData[field] as string[]];
        array[index] = e.target.value;
        setFormData({ ...formData, [field]: array });
    };

    const addRecipient = () => {
        setFormData({ ...formData, recipients: [...formData.recipients, ''], "recipient_shares": [...formData["recipient_shares"], 1n] });
    };

    const removeRecipient = (index: number) => {
        if (index == 0) return;
        const filteredRecipients = formData.recipients.filter((_, i) => i !== index);
        const filteredShares = formData["recipient_shares"].filter((_, i) => i !== index);
        setFormData({ ...formData, recipients: filteredRecipients, recipient_shares: filteredShares });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleDeploy(formData);
    };

    const togglePayFee = () => {
        setFormData({ ...formData, payFee: !formData.payFee });
    };

    return (
        <Dialog title="What do you want?" buttonTitle="Create Pool">
            {isDeploying ? (
                <Stack flex="column" alignItems="center">
                    <CircularProgress />
                    <Typography>Deploying Contract...</Typography>
                </Stack>
            ) : deployedContractAddress ? (
                <>
                    <Typography>Contract <VoyagerLink identity={{address: deployedContractAddress}} type={LinkType.Identity}/>Deployed Successfully!</Typography>
                    <Typography>Address: {deployedContractAddress}</Typography>
                </>
            ) :
                <>
                    <Typography level="h4">
                        Title
                    </Typography>
                    <Input
                        type="text"
                        value={stringFromByteArray(formData.title)}
                        onChange={(e) => handleChange(e, 'title')}
                        placeholder="The bolder the statement, the better."
                    />
                    <Typography level="h4">
                        Description
                    </Typography>
                    <Typography>
                        What do you wish the world had, experienced or achieved? Why should someone else ape in with you?
                        You control the narrative. You set the demand curve. You are the oracle of the future.
                    </Typography>
                    <Textarea
                        value={stringFromByteArray(formData.wish)}
                        onChange={(e) => handleChange(e, 'wish')}
                        placeholder="You know what you want - we all want it. We all need it. We all deserve it. If we had it the world would be different. You can help me. We can make it happen."
                        minRows={4}
                    />
                    <Typography level="h4">
                        Success Criteria
                    </Typography>
                    <Typography>
                        What makes your event a success?
                        This needs to be indisputable - water tight. Think it through, make sure it can&apos;t be misinterpreted. Succinct and measurable is better.
                        <br />
                        <br />
                        This is what the resolver will use to decide on whether the event has happened.
                    </Typography>
                    <Textarea
                        value={stringFromByteArray(formData["success_criteria"])}
                        onChange={(e) => handleChange(e, 'success_criteria')}
                        placeholder="Linda punches a bear in the face before midnight, while balancing baclava on her head.    Pics or it didn't happen."
                        style={{ margin: "10px 0" }}
                        minRows={3}
                    />
                    <Typography level="h3">
                        Tags
                    </Typography>
                    <Typography>
                        Add tags to help people find your event.
                    </Typography>
                    <MultiSelector
                        options={CATEGORIES}
                        selectedOptions={formData.categories}
                        onChange={(values) => {
                            setFormData({ ...formData, categories: values });
                        }}
                    />
                    <Typography level="h3">
                        Targets
                    </Typography>
                    <Typography>
                        Who are the targets of the bribe? Who needs to be convinced to make this happen? Who should be fairly rewarded for the event happening?
                        <br />
                        <br />
                        Each recipient gets a &apos;share&apos; of the total bribe. The shares are added up and the total bribe is split between the recipients according to their shares.
                    </Typography>
                    {formData.recipients.map((recipient, index) => (
                        <Stack direction="column" gap={1} key={index}>
                            <Typography>
                                Recipient {index + 1}
                            </Typography>
                            <Stack direction="row" gap={1} alignItems="left">
                                <Stack direction="column" gap={1} justifyContent="center" alignItems="left" style={{ width: "100%" }}>
                                    <Input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => handleArrayChange(e, 'recipients', index)}
                                        placeholder="Recipient Address"
                                    />
                                    <Typography>
                                        Recipient Share
                                    </Typography>
                                    <Input
                                        type="text"
                                        value={formData["recipient_shares"][index].toString()}
                                        onChange={(e) => handleArrayChange(e, 'recipient_shares', index)}
                                        placeholder="Recipient Share"
                                    />
                                </Stack>
                                {index === 0 ? null :
                                    <Button type="button" onClick={() => removeRecipient(index)} style={{ margin: "10px 0" }}>
                                        Remove
                                    </Button>
                                }
                            </Stack>
                        </Stack>
                    ))}
                    <Button type="button" onClick={addRecipient} style={{ margin: "10px 0" }}>
                        Add Recipient
                    </Button>
                    <Typography level="h3" style={{ marginTop: "10px" }}>
                        Resolver
                    </Typography>
                    <Typography>
                        Provide the address of the person or contract that will provide proof and trigger the payout.
                    </Typography>
                    <Input
                        type="text"
                        value={formData.oracle}
                        onChange={(e) => handleChange(e, 'oracle')}
                        placeholder="Oracle Address"
                    />
                    <br />
                    <Checkbox
                        label="Donate 1% of the raised amount to the protocol devs"
                        checked={formData.payFee}
                        onChange={togglePayFee}
                    />
                    <Button onClick={handleSubmit} color="primary" style={{ margin: "20px 0" }}>
                        Deploy Event Pool Contract
                    </Button>
                </>
            }
        </Dialog>
    );
};

export default PoolCreator;
