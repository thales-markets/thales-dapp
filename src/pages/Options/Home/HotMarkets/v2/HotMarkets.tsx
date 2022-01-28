import React, { useMemo } from 'react';
import styled from 'styled-components';

// import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { OptionsMarkets } from 'types/options';

import HotMarketCard, { HotMarket } from '../../MarketCard/v2/HotMarketCard';

import { formatPricePercentageGrowth, calculatePercentageChange } from 'utils/formatters/number';
import { getSynthName } from 'utils/currency';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

enum MarketType {
    short = 'DOWN',
    long = 'UP',
}

const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    // const [currentHotIndex, setCurrentHotIndex] = useState(0);
    const currentMarkets = useMemo(() => {
        const markets: HotMarket[] = [];

        optionsMarkets?.forEach((market) => {
            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.long}`,
                pricePerOption: market.longPrice,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePercentageChange(1, market.longPrice)),
                address: market.address,
            });

            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.short}`,
                pricePerOption: market.shortPrice,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePercentageChange(1, market.shortPrice)),
                address: market.address,
            });
        });

        return markets;
    }, [optionsMarkets]);

    return (
        <>
            {currentMarkets.length && (
                <Wrapper>
                    {currentMarkets.slice(5, 10).map((market, index) => (
                        <HotMarketCard
                            key={index}
                            fullAssetName={market.fullAssetName}
                            currencyKey={market.currencyKey}
                            assetName={market.assetName}
                            pricePerOption={market.pricePerOption}
                            timeRemaining={market.timeRemaining}
                            potentialProfit={market.potentialProfit}
                            address={market.address}
                        />
                    ))}
                </Wrapper>
            )}
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 55px;
`;

export default HotMarkets;
