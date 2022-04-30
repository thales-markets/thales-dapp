import React, { FC, createContext, useContext } from 'react';
import { RangedMarketData } from 'types/options';

const MarketContext = createContext<RangedMarketData | null>(null);

type RangedMarketContextProps = {
    children: React.ReactNode;
    rangedMarket: RangedMarketData | null;
};

export const RangedMarketProvider: FC<RangedMarketContextProps> = ({ children, rangedMarket }) => (
    <MarketContext.Provider value={rangedMarket}>{children}</MarketContext.Provider>
);

export const useMarketContext = () => useContext(MarketContext) as RangedMarketData;
