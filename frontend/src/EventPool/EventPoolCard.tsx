import { Button, Card, Grid, Stack, Typography } from '@mui/joy';
import React from 'react';
import strk_icon from "../assets/STRK.svg"
import eth_icon from "../assets/ETH.png"
import { SEPOLIA_TOKENS } from '../consts';
import { getEventData } from './Utils';
import { Link } from 'react-router-dom';

// An eventpool is a collection of liquidity which can permissionlessly be added to.
// The event pool has an event attached to it and a list of addresses to which
// the pool will be distributed. The pool is distributed to the addresses when the event attached occurs.
// The pool has a value which can be made of any number of tokens.
// Users can add to the pool by clicking the "believe" button.
// The believe button pops up a modal which gives a short discription
export function EventCard({ contractAddress }: { contractAddress: string }) {
    const event = getEventData({ contractAddress });
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
                </Stack>
                <Link to={`/pool/${contractAddress}`}>
                    <Button>
                        Make it happen
                    </Button>
                </Link>
            </Stack>
        </Card>
    );
}