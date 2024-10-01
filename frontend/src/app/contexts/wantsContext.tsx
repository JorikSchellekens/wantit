import { baseSepolia } from 'viem/chains'
import { WantsSchema } from '../../../pages/api/updateWants';
import { init } from '@instantdb/react'
import { createContext, useContext } from "react";

const APP_ID = '9eae0cad-26b2-41dc-9b8a-a2c8d2e10c7b'

const WantsContext = createContext<{isLoading: boolean, wantPools2: WantPool} | undefined>(undefined);

export type WantPool = Omit<WantsSchema['wants'][number], 'salt'>

export function WantsContextProvider({children}: {children: React.ReactNode}) {
    const db = init({
        appId: APP_ID,
    })
    const {isLoading, data} = db.useQuery({wantit: {}});
    const wantPools2 = data?.wantit?.[0]?.[baseSepolia.id] as WantPool

    if (!isLoading && 'salt' in wantPools2) {
      // TODO: fix instantdb query
      delete wantPools2.salt
    }

    return <WantsContext.Provider value={{isLoading, wantPools2}}>{children}</WantsContext.Provider>
}

export function useWantsContext() {
    const context = useContext(WantsContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
    return context;
}

