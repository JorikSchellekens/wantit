import { useNetwork } from "@starknet-react/core";
import React from "react";
import { Stack, Typography } from "@mui/joy";

const Footer = () => {
  const { chain } = useNetwork();

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ width: '100%', py: 1, px: 2 }}>
      <Typography sx={{ fontSize: '0.875rem' }}>
        {chain ? `Network: ${chain.name}` : 'No Network'}
      </Typography>
    </Stack>
  );
};

export default Footer;
