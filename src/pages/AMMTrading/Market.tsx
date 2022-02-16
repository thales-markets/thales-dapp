import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';

import { getIsAppReady } from 'redux/modules/app';

import RowCard from './components/RowCard';
import TabContainer from './components/TabContainer';
import { MarketProvider } from './contexts/MarketContext';

import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';

import { OptionsMarketInfo } from 'types/options';

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [optionMarket, setOptionMarket] = useState<OptionsMarketInfo | null>(null);

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            setOptionMarket(marketQuery.data);
        }
    }, [marketQuery.data]);

    return (
        <MarketProvider optionsMarket={optionMarket}>
            <RowCard />
            <MainContainer>
                <TabContainer />
            </MainContainer>
        </MarketProvider>
    );
};

const MainContainer = styled.div`
    margin-top: 17px;
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export default Market;
