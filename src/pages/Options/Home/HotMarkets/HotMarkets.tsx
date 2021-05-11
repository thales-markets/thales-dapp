import React, { useMemo, useState } from 'react';
import { OptionsMarkets } from 'types/options';
import { useTranslation } from 'react-i18next';
import { FlexDivCentered, Text } from 'theme/common';
import MarketCard from '../MarketCard';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import useInterval from 'hooks/useInterval';

const Wrapper = styled(FlexDivColumn)`
    padding: 50px 110px;
    position: relative;
    @media (max-width: 1200px) {
        padding: 30px 50px;
    }
`;

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    const [currentMarket, setCurrentMarket] = useState(0);

    const currentMarkets = useMemo(() => {
        const markets = [];
        markets.push(optionsMarkets[currentMarket]);
        if (currentMarket === optionsMarkets.length - 1) {
            markets.push(optionsMarkets[0], optionsMarkets[1]);
        } else if (currentMarket === optionsMarkets.length - 2) {
            markets.push(optionsMarkets[currentMarket + 1], optionsMarkets[0]);
        } else {
            markets.push(optionsMarkets[currentMarket + 1], optionsMarkets[currentMarket + 2]);
        }
        return markets;
    }, [currentMarket]);

    useInterval(() => {
        setCurrentMarket(() => {
            return currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1;
        });
    }, 5000);

    return (
        <Wrapper>
            <DiscoverText className="text-xxl dark">{t('options.home.explore-markets.discover')}</DiscoverText>
            <FlexDivCentered>
                {currentMarkets.map((optionsMarket, index) => {
                    return <MarketCard key={index} optionMarket={optionsMarket} />;
                })}
            </FlexDivCentered>
        </Wrapper>
    );
};

const DiscoverText = styled(Text)`
    @media (max-width: 1200px) {
        font-size: 41px;
        margin-left: 20px;
    }
`;

export default HotMarkets;
