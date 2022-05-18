import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { formatPricePercentageGrowth } from 'utils/formatters/number';
import { getSynthName } from 'utils/currency';
import Hammer from 'hammerjs';
import Tooltip from 'components/Tooltip';
import HotMarketCardSceleton from 'components/HotMarketSceleton/HotMarketCardSceleton';
import HotMarketRanged from './HotMarketRanged';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { RangedMarket } from 'types/options';

type RangedMarketUI = RangedMarket & {
    asset: string;
    availableIn: number;
    availableOut: number;
    inPrice: number;
    outPrice: number;
    ammLiquidity: string;
    range: string;
    phaseNum: number;
    timeRemaining: number;
};

type HotMarketsRangedProps = {
    optionsMarkets: RangedMarketUI[];
    exchangeRates: Rates | null;
};

enum MarketType {
    in = 'IN',
    out = 'OUT',
}

const CARDS_TO_SHOW = 5;

const calculatePotentialProfit = (price: number) => {
    return ((1 - price) / price) * 100;
};

const HotMarketsRanged: React.FC<HotMarketsRangedProps> = ({ optionsMarkets, exchangeRates }) => {
    const { t } = useTranslation();
    const [firstHotIndex, setFirstHotIndex] = useState(0);
    const [hammerManager, setHammerManager] = useState<any>();
    const currentMarkets = useMemo(() => {
        const markets: any[] = [];

        optionsMarkets?.forEach((market: any) => {
            if (market.outPrice == 0 || market.inPrice == 0) return;
            if (!market?.outPrice && !market?.inPrice) return;
            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.in}`,
                leftPrice: market.leftPrice,
                rightPrice: market.rightPrice,
                pricePerOption: market.inPrice,
                strikePrice: market.range,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePotentialProfit(market.inPrice)),
                address: market.address,
            });

            markets.push({
                fullAssetName: getSynthName(market.currencyKey),
                currencyKey: market.currencyKey,
                assetName: `${market.asset} ${MarketType.out}`,
                pricePerOption: market.outPrice,
                leftPrice: market.leftPrice,
                rightPrice: market.rightPrice,
                strikePrice: market.range,
                timeRemaining: market.timeRemaining,
                potentialProfit: formatPricePercentageGrowth(calculatePotentialProfit(market.outPrice)),
                address: market.address,
            });
        });

        return markets.sort((a: any, b: any) => a.pricePerOption - b.pricePerOption);
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
                            <HotMarketRanged
                                key={index}
                                fullAssetName={market.fullAssetName}
                                currencyKey={market.currencyKey}
                                assetName={market.assetName}
                                strikePrice={market.strikePrice}
                                pricePerOption={market.pricePerOption}
                                timeRemaining={market.timeRemaining}
                                potentialProfit={market.potentialProfit}
                                address={market.address}
                                leftPrice={market.leftPrice}
                                rightPrice={market.rightPrice}
                                currentAssetPrice={exchangeRates?.[market.currencyKey] || 0}
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
    color: #64d9fe;
    border-bottom: 4px solid rgba(100, 217, 254, 0.5);
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

export default HotMarketsRanged;
