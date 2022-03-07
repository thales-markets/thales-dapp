import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

// import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { OptionsMarkets } from 'types/options';

import HotMarketCard, { HotMarket } from '../MarketsCard/HotMarketCard';
import HotMarketCardSceleton from '../MarketsCard/HotMarketCardSceleton';
import { formatPricePercentageGrowth } from 'utils/formatters/number';
import { getSynthName } from 'utils/currency';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

enum MarketType {
    short = 'DOWN',
    long = 'UP',
}

const calculatePotentialProfit = (price: number) => {
    return ((1 - price) / price) * 100;
};

const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const [firstHotIndex, setFirstHotIndex] = useState(0);
    const currentMarkets = useMemo(() => {
        const markets: HotMarket[] = [];

        optionsMarkets?.forEach((market) => {
            if (market.longPrice == 0 || market.shortPrice == 0) return;
            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.long}`,
                pricePerOption: market.longPrice,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePotentialProfit(market.longPrice)),
                address: market.address,
            });

            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.short}`,
                pricePerOption: market.shortPrice,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePotentialProfit(market.shortPrice)),
                address: market.address,
            });
        });

        return markets;
    }, [optionsMarkets]);

    const slicedMarkets = useMemo(() => {
        return currentMarkets.slice(firstHotIndex, firstHotIndex + 5);
    }, [currentMarkets, firstHotIndex]);

    return (
        <>
            {currentMarkets.length > 0 ? (
                <Wrapper>
                    <Icon
                        onClick={() => setFirstHotIndex(firstHotIndex > 0 ? firstHotIndex - 1 : firstHotIndex)}
                        disabled={firstHotIndex == 0}
                        className={'icon icon--left'}
                    />
                    {slicedMarkets.map((market, index) => (
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
                    <Icon
                        onClick={() =>
                            setFirstHotIndex(
                                firstHotIndex + 5 < currentMarkets.length - 1 ? firstHotIndex + 1 : firstHotIndex
                            )
                        }
                        disabled={firstHotIndex + 5 == currentMarkets?.length - 1}
                        className={'icon icon--right'}
                    />
                </Wrapper>
            ) : (
                <Wrapper>
                    <HotMarketCardSceleton></HotMarketCardSceleton>
                    <HotMarketCardSceleton></HotMarketCardSceleton>
                    <HotMarketCardSceleton></HotMarketCardSceleton>
                    <HotMarketCardSceleton></HotMarketCardSceleton>
                    <HotMarketCardSceleton></HotMarketCardSceleton>
                </Wrapper>
            )}
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 55px;
    align-items: center;
    @media (max-width: 1250px) {
        & > div:nth-of-type(4),
        & > div:last-of-type {
            display: none;
        }
    }

    @media (max-width: 768px) {
        & > div:nth-of-type(3) {
            display: none;
        }
    }

    @media (max-width: 568px) {
        & > div:nth-of-type(2) {
            display: none;
        }
    }
`;

const Icon = styled.i<{ disabled?: boolean }>`
    cursor: pointer;
    font-size: 60px;
    color: ${(_props) => (_props?.disabled ? 'var(--hotmarket-arrow-disable)' : 'var(--hotmarket-arrow-enabled)')};
`;

export default HotMarkets;
