import React, { useMemo, useState } from 'react';
import { OptionsMarkets } from 'types/options';
import { useTranslation } from 'react-i18next';
import { FlexDivCentered, Image, Text } from 'theme/common';
import MarketCard from '../MarketCard';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import useInterval from 'hooks/useInterval';
import previous from 'assets/images/previous-page.svg';
import next from 'assets/images/next-page.svg';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    const [currentMarket, setCurrentMarket] = useState(0);
    const [shouldUseInterval, setShoudUseInterval] = useState(true);

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
        if (shouldUseInterval)
            setCurrentMarket(() => {
                return currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1;
            });
    }, 3000);

    return (
        <Wrapper>
            <DiscoverText className="text-xxl dark">{t('options.home.explore-markets.discover')}</DiscoverText>
            <FlexDivCentered>
                <Arrow
                    onClick={() => {
                        setShoudUseInterval(false);
                        setCurrentMarket(currentMarket === 0 ? optionsMarkets.length - 1 : currentMarket - 1);
                    }}
                    src={previous}
                ></Arrow>
                {currentMarkets.map((optionsMarket, index) => {
                    return <MarketCard key={index} optionMarket={optionsMarket} />;
                })}
                <Arrow
                    onClick={() => {
                        setShoudUseInterval(false);
                        setCurrentMarket(currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1);
                    }}
                    src={next}
                ></Arrow>
            </FlexDivCentered>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumn)`
    padding: 50px 110px;
    position: relative;
    height: calc((100vh - 100px) / 2);
    max-height: 490px;
    @media (max-width: 1200px) {
        padding: 30px 50px;
    }
`;

const DiscoverText = styled(Text)`
    @media (max-width: 1200px) {
        font-size: 41px;
        margin-left: 20px;
    }
`;

const Arrow = styled(Image)`
    width: 24px;
    height: 40px;
    margin: 0 10px;
    cursor: pointer;
`;

export default HotMarkets;
