import React from "react";
// import { useBlock } from "@starknet-react/core";
import { Sheet, Stack } from "@mui/joy";
import EventPool from "./EventPool";
import Header from "./components/Header";
import { FILTER_POOLS } from "./consts";
import PoolCreator from "./PoolCreator";
import { useContractRead } from "@starknet-react/core";
import { CONTRACT_FACTORY } from "./starknet_assets/contracts/contractFactory";



function App() {
  // Store the result of the fetch in a state variable
  const { data } = useContractRead({
    functionName: "get_all_contracts",
    abi: CONTRACT_FACTORY.class.abi,
    address: CONTRACT_FACTORY.address,
    watch: true,
  });

  let contractList: string[] = [];
  if (Array.isArray(data) && data.every(item => typeof item === 'bigint')) {
    contractList = (data as bigint[]).map((item: bigint) => "0x" + item.toString(16));
  }


  const eventPools = contractList.reverse().filter((address) => !FILTER_POOLS.includes(address)).map((contractAddress, index) => {
    
    return <EventPool key={index} contractAddress={contractAddress} />
  });


  return (
    <>
      <Header />
      <Sheet sx={{ width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }} variant="solid">
        {/* <Header /> */}
        <Stack sx={{ width: '100%', maxWidth: '1300px' }}>
          {eventPools}
          <PoolCreator />
        </Stack>
      </Sheet>
    </>
  );
}

export default App;
