import { Stack } from '@mui/joy';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';


export const MainLayout = ({children}: {children: React.ReactNode}) =>
      <Stack direction="column" spacing={2} sx={{ width: '100%', margin: 'auto', height: '100%', justifyContent: 'space-between' }}>
        <Stack direction="column" spacing={2}>
          <Header />
          {children}
        </Stack>
        <Stack direction="column" spacing={2}>
          <Footer />
        </Stack>
      </Stack>
