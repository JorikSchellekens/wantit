import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Card, Divider, Stack, Typography } from "@mui/joy";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React from "react";

export const About = () => {
    return (
        <Stack direction="column" spacing={2} sx={{ width: '100%', margin: 'auto', height: '100%', justifyContent: 'space-between' }}>
            <Stack direction="column" spacing={2}>
                <Header />
                <Stack direction="column" spacing={2} sx={{ padding: '30px' }}>
                    <Typography level="h1">About</Typography>
                    <Divider />
                    <Typography level="h2">BribeWith.eth is <b><i>not</i></b> a crowd funding platform</Typography>
                    <Typography level="h2" sx={{ padding: '30px 0 0 30px' }}>BribeWith.eth lets the Degens <b><i>change the world</i></b></Typography>
                    <Typography level="h2" sx={{ padding: '30px 0 0 60px' }}>Target <b><i>specific people</i></b> with a <b><i>specific request</i></b> and let <b><i>The Degens</i></b> back you up.</Typography>

                    <Typography level="h2" sx={{ padding: '30px 0 0 40%' }}>Together we Bribe</Typography>
                    <Divider />
                    <br />
                    <br />
                    <br />
                    <Card>
                        <Typography level="h2">FAQ</Typography>
                        <AccordionGroup>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">What is BribeWith.Eth?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>BribeWith.eth is a decentralised platform that lets you target specific people with a specific request and let everyone back up your request.</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">Why would someone accept the bribe?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>Bribes in BribeWith.eth are not explicitely bribes. They are payments to a set of people on completion of some task. The bribe does not represent a contract, the target of the bribe can decide - at their whim whether they accept or enact the content of the bribe.</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">How are bribes resolved?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>Bribes are resolved by a &apos;resolver&apos;. This might be a single third party&apos;s account, it might be a DAO, it might be a smart contract, or it may be an optimistic oracle. The resolver is chosen by the briber at the time of bribe creation and cannot be changed. <b><i>It is very important to check the resolver and the target addresses before joining a bribe. The resolver can rug the pool to the target addresses at any moment.</i></b></Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">Who funds the bribe?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>Everyone does, noone in particular does. We all do! Bribes are permissionlessly crowdfunded. The bribes are things we wish the world had.</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">What is the fee?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>The fee is 0.1% of the total collected amount. The fee goes to the protocol&apos;s DAO?</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">Can bribes be stopped?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>No, once a bribe is in motion there is not way to stop it.</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">What are the NFTs for?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>
                                    NFTs are automatically created for each bribe. Twenty NFTs will be minted - ten for ETH contributors and ten for STRK contributors.
                                    The NFTs are minted randomly proportionally to the amount each contributor has contributed. These are badges of honour for supporting the initiative.
                                    They can also be sold on the secondary market. They are NFTs afterall :.
                                </Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">Do supports get rewarded?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>Not explicitely, some lucky few get a commemorative NFT.</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">How is this different to crowdfunding?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>We cut out the middleman. Individuals are not asking for help. We are directly telling people what we would be willing to pay for.</Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">What are other pretentious ways to refer to BribeWith.eth?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>
                                        Demand curve discovery platform
                                        <br />
                                        The People have spoken
                                        <br />
                                        Unrequited Crowd Funding
                                        <br />
                                        The most equitable and public bribery solution
                                        <br />
                                        The bite behind degen memery
                                </Typography></AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary><Typography level="h4">Can I get my tokens back?</Typography></AccordionSummary>
                                <AccordionDetails><Typography>No. Unless you&apos;re listed in the target and can make the event happen the tokens are locked in the contract forever.</Typography></AccordionDetails>
                            </Accordion>
                        </AccordionGroup>
                    </Card>
                    <br />
                    <br />
                    <br />
                </Stack>
            </Stack>
            <Footer />
        </Stack>
    );
};
