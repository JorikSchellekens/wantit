"use client";
import { Connector, useConnect } from "@starknet-react/core";
import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button, Stack, Typography } from "@mui/joy";

export default function ConnectModal() {
  const { connect, connectors } = useConnect();

  return (

    <Dialog title="Connect Wallet" buttonTitle="ConnectWallet">
      <Stack justifyContent="center" alignItems="center" spacing={1}>
        {connectors.map((connector: Connector) => {
          return (
            <Button
              key={connector.id}
              onClick={async () =>
                connector.available() ? connect({ connector }) : null
              }
              disabled={!connector.available()}
            >
              {connector.icon.light && (
                <img src={connector.icon.dark} />
              )}
              <Typography sx={{color: "white"}}>Connect{connector.name}</Typography>
            </Button>
          );
        })}
      </Stack>
    </Dialog>
  );
}
