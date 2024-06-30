"use client";
import { Connector, useConnect } from "@starknet-react/core";
import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button, Stack, Typography } from "@mui/joy";

export default function ConnectModal() {
  const { connect, connectors } = useConnect();

  return (

    <Dialog title="Connect Wallet" buttonTitle="ConnectWallet">
      <Stack justifyContent="center" alignItems="center" spacing={1} sx={{height: "auto", width: "300px"}}>
        {connectors.map((connector: Connector) => {
          return (
            <Button
              key={connector.id}
              onClick={async () =>
                connector.available() ? connect({ connector }) : null
              }
              disabled={!connector.available()}
              sx={{
                width: "100%",
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
              {connector.icon.light && (
                <img src={connector.icon.dark} style={{width: "20px", height: "20px"}}/>
              )}
              <Typography sx={{color: "white"}}>{connector.name}</Typography>
              </Stack>
            </Button>
          );
        })}
      </Stack>
    </Dialog>
  );
}
