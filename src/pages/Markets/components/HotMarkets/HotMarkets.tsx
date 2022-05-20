import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HotMarket, OptionsMarkets } from 'types/options';

import HotMarketCard from '../MarketsCard/HotMarketCard';
import HotMarketCardSceleton from 'components/HotMarketSceleton/HotMarketCardSceleton';
import { formatPricePercentageGrowth } from 'utils/formatters/number';
import { getSynthName } from 'utils/currency';
import Hammer from 'hammerjs';
import Tooltip from 'components/Tooltip';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

enum MarketType {
    short = 'DOWN',
    long = 'UP',
}

const CARDS_TO_SHOW = 5;

const calculatePotentialProfit = (price: number) => {
    return ((1 - price) / price) * 100;
};

const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    const [firstHotIndex, setFirstHotIndex] = useState(0);
    const [hammerManager, setHammerManager] = useState<any>();
    const currentMarkets = useMemo(() => {
        const markets: HotMarket[] = [];

        optionsMarkets?.forEach((market) => {
            if (market.longPrice == 0 || market.shortPrice == 0) return;
            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.long}`,
                pricePerOption: market.longPrice,
                strikePrice: '$ ' + market.strikePrice,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePotentialProfit(market.longPrice)),
                address: market.address,
            });

            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.short}`,
                pricePerOption: market.shortPrice,
                strikePrice: '$ ' + market.strikePrice,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePotentialProfit(market.shortPrice)),
                address: market.address,
            });
        });

        return markets.sort((a: HotMarket, b: HotMarket) => a.pricePerOption - b.pricePerOption);
    }, [optionsMarkets]);

    const moveLeft = () => {
        if (firstHotIndex === 0) setFirstHotIndex(currentMarkets.length - 1 - CARDS_TO_SHOW);
        if (firstHotIndex > 0) setFirstHotIndex(firstHotIndex - 1);
    };
    const moveRight = () => {
        setFirstHotIndex(firstHotIndex + CARDS_TO_SHOW < currentMarkets.length - 1 ? firstHotIndex + 1 : 0);
    };

    const slicedMarkets = useMemo(() => {
        if (currentMarkets.length) {
            const wrapper = document.getElementById('wrapper-cards');
            if (wrapper) {
                const hammer = new Hammer.Manager(wrapper);
                if (!hammerManager) {
                    setHammerManager(hammer);
                } else {
                    hammerManager.destroy();
                    setHammerManager(hammer);
                }

                if (window.innerWidth <= 1250) {
                    const swipe = new Hammer.Swipe();
                    hammer.add(swipe);
                    hammer.on('swipeleft', moveRight);
                    hammer.on('swiperight', moveLeft);
                }
            }
        }

        return currentMarkets.slice(
            firstHotIndex,
            firstHotIndex + CARDS_TO_SHOW > currentMarkets.length - 1
                ? firstHotIndex + CARDS_TO_SHOW - currentMarkets.length + 1
                : firstHotIndex + CARDS_TO_SHOW
        );
    }, [currentMarkets, firstHotIndex]);

    return (
        <>
            <Title>
                {t('options.home.hot-markets.most-profitable-markets')}
                <Tooltip
                    message={t('options.home.hot-markets.tooltip-text')}
                    type={'info'}
                    iconColor={'var(--table-header-text-color)'}
                    placement={'right'}
                />
            </Title>
            <Wrapper id="wrapper-cards">
                {currentMarkets.length > 0 ? (
                    <>
                        <Icon onClick={moveLeft} disabled={firstHotIndex == 0} className={'icon icon--left'} />
                        {slicedMarkets.map((market, index) => (
                            <HotMarketCard
                                key={index}
                                fullAssetName={market.fullAssetName}
                                currencyKey={market.currencyKey}
                                assetName={market.assetName}
                                strikePrice={market.strikePrice}
                                pricePerOption={market.pricePerOption}
                                timeRemaining={market.timeRemaining}
                                potentialProfit={market.potentialProfit}
                                address={market.address}
                            />
                        ))}
                        <Icon
                            onClick={moveRight}
                            disabled={firstHotIndex + 5 == currentMarkets?.length - 1}
                            className={'icon icon--right'}
                        />
                    </>
                ) : (
                    <>
                        <HotMarketCardSceleton></HotMarketCardSceleton>
                        <HotMarketCardSceleton></HotMarketCardSceleton>
                        <HotMarketCardSceleton></HotMarketCardSceleton>
                        <HotMarketCardSceleton></HotMarketCardSceleton>
                        <HotMarketCardSceleton></HotMarketCardSceleton>
                    </>
                )}
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 55px;
    align-items: center;
    @media (max-width: 1250px) and (min-width: 769px) {
        & > div:nth-of-type(4),
        & > div:last-of-type {
            display: none;
        }
    }

    @media (max-width: 768px) {
        & > div {
            box-shadow: var(--shadow);
        }
        & > div:first-of-type,
        & > div:last-of-type {
            opacity: 0.5;
            box-shadow: none;
        }
    }

    @media (max-width: 568px) {
        & > div {
            opacity: 0.5;
        }

        & > div:nth-of-type(3) {
            opacity: 1;
            box-shadow: var(--shadow);
        }
    }
`;

const Title = styled.p`
    display: flex;
    flex-direction: row;
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 600;
    font-size: 25px;
    line-height: 38px;
    color: var(--notice-text);
    border-bottom: 4px solid var(--card-border-color);
    padding: 4px 20px;
    text-transform: capitalize;
    position: relative;
    top: -20px;
`;

const Icon = styled.i<{ disabled?: boolean }>`
    cursor: pointer;
    font-size: 60px;
    color: ${(_props) => (_props?.disabled ? 'var(--hotmarket-arrow-disable)' : 'var(--hotmarket-arrow-enabled)')};
    pointer-events: ${(_props) => (_props?.disabled ? 'none' : 'auto')};
`;

export default HotMarkets;
