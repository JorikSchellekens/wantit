import { Button, Stack, Typography } from "@mui/joy";
import { useAccount, useDisconnect } from "@starknet-react/core";
import React from "react";
import ConnectModal from "./starknet/ConnectModal";
import { Link } from "react-router-dom";

export default function Header() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: '10px', width: '100%' }}>
      {/* <img src={logo} alt="dareto.meme" style={{ height: '60px' }}/> */}
      <Link to="/"><Typography level="h2">BribeWith.eth</Typography></Link>
      <Link to="/about"><Typography level="h2">About</Typography></Link>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {address ? (
          <Button 
            onClick={() => disconnect()}
          >
            <Stack direction="column" justifyContent="center" alignItems="center">
            <Typography sx={{ color: "yellow"}}>{`${address.slice(
              0,
              6,
            )}...${address.slice(-4)}`}</Typography>
            <Typography sx={{ color: "yellow"}}>
              Disconnect
            </Typography>
            </Stack>
          </Button>
        ) : (
          <ConnectModal />
        )}
      </Stack>
    </Stack>
  );
}

