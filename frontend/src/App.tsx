import React from "react";
import { Grid, Stack, Tab, TabList, TabPanel, Tabs, ThemeProvider } from "@mui/joy";
import EventPool from "./EventPool/EventPool";
import Header from "./components/Header";
import { CATEGORIES, FILTER_POOLS } from "./consts";
import { useContractRead } from "@starknet-react/core";
import { CONTRACT_FACTORY } from "./starknet_assets/contracts/contractFactory";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import Footer from "./components/Footer";
import { CreatePoolCard } from "./CreatePool/CreatePoolCard";
import { dieselpunkTheme } from "./dieselpunktheme";
import { useMediaQuery } from "usehooks-ts";
import { About } from "./About";

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

  const EventPoolRouter = () => {
    const { category: categoryTemp } = useParams<{ category: string }>();
    const [category, setCategory] = React.useState<string | undefined>(categoryTemp);
    const { contractAddress } = useParams<{ contractAddress: string }>();
    // First, move the active address to the top of the list if it exists
    const sortedContractList = contractList.filter(address => !FILTER_POOLS.includes(address));
    if (contractAddress) {
      const activeIndex = sortedContractList.indexOf(contractAddress);
      if (activeIndex > -1) {
        const [activeAddress] = sortedContractList.splice(activeIndex, 1);
        sortedContractList.unshift(activeAddress);
      }
    }


    const isDesktop = useMediaQuery('(min-width:1000px)');
    const isTablet = useMediaQuery('(min-width:600px)');
    const gridWidth = isDesktop ? 4 : isTablet ? 6 : 12;

    // Now map the sorted list to React components
    const eventPools = sortedContractList.reverse().map((address, index) => {
      const isActive = address === contractAddress;
      return (
        <Grid key={index} xs={gridWidth}>
          <EventPool contractAddress={address} isActive={isActive} />
        </Grid>
      );
    });

    const poolGrid = <Grid container spacing={2} sx={{ width: '100%', margin: 'auto' }}>
      <Grid xs={gridWidth}>
        <CreatePoolCard />
      </Grid>
      {eventPools}
    </Grid>

    // Tab for each category
    const tabs = [
      <Tab key={0} value={0}>All</Tab>,
      ...CATEGORIES.map((category, index) => {
      return (
        <Tab key={index+1} value={index+1}>{category}</Tab>
      );
    }),
    ];

    const tabPanels = [
      <TabPanel key={0} value={0}>
        {poolGrid}
      </TabPanel>,
      ...CATEGORIES.map((category, index) => {
      return (
        <TabPanel key={index+1} value={index+1}>
          {poolGrid}
        </TabPanel>
      );
    }),
    ];
    
    // Set the route to the selected category
    const onChange = (value: string | number | null) => {
      if (typeof value === 'string') {
        return;
      }
      if (value === null) {
        return;
      }
      if (value === -1) {
        return;
      }
      if (value === 0) {
        window.history.pushState(null, '', '/wantit/');
        setCategory(undefined);
        return;
      }
      const category = CATEGORIES[value-1];
      if (category) {
        // Set route using react-router-dom but don't let the window reload
        window.history.pushState(null, '', `/wantit/category/${category}`);
        setCategory(category);
      }
    }


    const tablist = <Tabs aria-label="Basic tabs" onChange={(event, value) => onChange(value)} value={category ? CATEGORIES.indexOf(category) + 1 : 0} sx={{ overflowX: 'scroll' }}>
      <TabList >
        {tabs}
      </TabList>
      {tabPanels}
    </Tabs>

    return (
      <Stack direction="column" spacing={2} sx={{ width: '100%', margin: 'auto', height: '100%', justifyContent: 'space-between' }}>
        <Stack direction="column" spacing={2}>
          <Header />
          {tablist  }
        </Stack>
        <Stack direction="column" spacing={2}>
          <Footer />
        </Stack>
      </Stack>
    );
  };


  // Add a path for category selection
  return (
    <ThemeProvider theme={dieselpunkTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<EventPoolRouter />} />
          <Route path="/category/:category" element={<EventPoolRouter />} />
          <Route path="/pool/:contractAddress" element={<EventPoolRouter />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
