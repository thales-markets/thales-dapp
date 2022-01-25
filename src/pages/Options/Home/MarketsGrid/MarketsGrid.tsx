import React from 'react';
import styled from 'styled-components';

import { OptionsMarkets } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import { FlexDiv } from 'theme/common';
import MarketCard from '../MarketCard/v2/MarketCard';

type MarketsGridProps = {
    optionsMarkets: OptionsMarkets;
    exchangeRates: Rates | null;
    watchlistedMarkets?: string[];
};

const MarketsGrid: React.FC<MarketsGridProps> = ({ optionsMarkets, exchangeRates }) => {
    // let data = useMemo(() => {

    // }, [optionsMarket]);

    return (
        <Wrapper>
            {optionsMarkets &&
                optionsMarkets.map((optionMarket, index) => {
                    return <MarketCard key={index} optionMarket={optionMarket} exchangeRates={exchangeRates} />;
                })}
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-wrap: wrap;
    max-width: 1200px;
    justify-content: center;
`;

export default MarketsGrid;
