import React, { FC, createContext, useContext } from 'react';
import { OptionsMarketInfo } from 'types/options';

const MarketContext = createContext<OptionsMarketInfo | null>(null);

type MarketContextProps = {
    children: React.ReactNode;
    optionsMarket: OptionsMarketInfo | null;
};

export const MarketProvider: FC<MarketContextProps> = ({ children, optionsMarket }) => (
    <MarketContext.Provider value={optionsMarket}>{children}</MarketContext.Provider>
);

export const useMarketContext = () => useContext(MarketContext) as OptionsMarketInfo;
