import React, { FC, createContext, useContext } from 'react';
import { RangedMarketData } from 'types/options';

const RangedMarketContext = createContext<RangedMarketData | null>(null);

type RangedMarketContextProps = {
    children: React.ReactNode;
    rangedMarket: RangedMarketData | null;
};

export const RangedMarketProvider: FC<RangedMarketContextProps> = ({ children, rangedMarket }) => (
    <RangedMarketContext.Provider value={rangedMarket}>{children}</RangedMarketContext.Provider>
);

export const useRangedMarketContext = () => useContext(RangedMarketContext) as RangedMarketData;
