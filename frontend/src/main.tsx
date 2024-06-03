import { devnet, sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
} from "@starknet-react/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";
import { jsonRpcProvider } from "@starknet-react/core";
import { Chain } from "@starknet-react/chains";

function rpc(chain: Chain) {
  return {
    nodeUrl: `https://starknet-${chain.network}.public.blastapi.io`
  }
}

function Root({ children }: { children: React.ReactNode }) {
  const chains = [sepolia, mainnet, devnet];
  const provider = jsonRpcProvider({ rpc });
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Randomize the order of the connectors.
    order: "random",
  });

  return (
    <StarknetConfig
      autoConnect
      chains={chains}
      provider={provider}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>,
);
