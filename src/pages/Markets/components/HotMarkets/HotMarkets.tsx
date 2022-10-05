import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HotMarket, OptionsMarkets } from 'types/options';

import HotMarketCard from '../MarketsCard/HotMarketCard';
import HotMarketCardSceleton from 'components/HotMarketSceleton/HotMarketCardSceleton';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getSynthName } from 'utils/currency';
import Hammer, { DIRECTION_HORIZONTAL } from 'hammerjs';
import Tooltip from 'components/Tooltip';
import { PHASE } from 'constants/options';
import { USD_SIGN } from 'constants/currency';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { fetchDiscounts } from 'queries/options/useDiscountMarkets';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

enum MarketType {
    short = 'DOWN',
    long = 'UP',
}

const CARDS_TO_SHOW = 10;

const calculatePotentialProfit = (price: number) => {
    return ((1 - price) / price) * 100;
};

const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    const [firstHotIndex, setFirstHotIndex] = useState(0);
    const [hammerManager, setHammerManager] = useState<any>();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const { trackEvent } = useMatomo();

    const discountQuery = fetchDiscounts(networkId, { enabled: true });
    const discountsMap = discountQuery.isSuccess ? discountQuery.data : new Map();

    const currentMarkets = useMemo(() => {
        const markets: HotMarket[] = [];

        optionsMarkets
            ?.filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
            .sort((a, b) => a.timeRemaining - b.timeRemaining)
            .forEach((market) => {
                if (market.longPrice == 0 || market.shortPrice == 0) return;
                const discount = (discountsMap as any).get(market.address.toLowerCase());

                if (discount) {
                    if (discount.longPriceImpact < 0) {
                        markets.push({
                            fullAssetName: getSynthName(market.currencyKey),
                            currencyKey: market.currencyKey,
                            assetName: `${market.asset} ${MarketType.long}`,
                            pricePerOption: market.longPrice,
                            strikePrice: formatCurrencyWithSign(USD_SIGN, market.strikePrice, 2),
                            timeRemaining: market.timeRemaining,
                            potentialProfit: calculatePotentialProfit(market.longPrice).toFixed(2) + '%',
                            discount: Math.ceil(Math.abs(discount.longPriceImpact)),
                            address: market.address,
                        });
                    }

                    if (discount.shortPriceImpact < 0) {
                        markets.push({
                            fullAssetName: getSynthName(market.currencyKey),
                            currencyKey: market.currencyKey,
                            assetName: `${market.asset} ${MarketType.short}`,
                            pricePerOption: market.shortPrice,
                            strikePrice: formatCurrencyWithSign(USD_SIGN, market.strikePrice, 2),
                            timeRemaining: market.timeRemaining,
                            potentialProfit: calculatePotentialProfit(market.shortPrice).toFixed(2) + '%',
                            discount: Math.ceil(Math.abs(discount.shortPriceImpact)),
                            address: market.address,
                        });
                    }
                }
            });

        return markets.sort((a: HotMarket, b: HotMarket) => b.discount - a.discount);
    }, [optionsMarkets]);

    const moveLeft = () => {
        if (firstHotIndex === 0) setFirstHotIndex(currentMarkets.length - 1 - CARDS_TO_SHOW);
        if (firstHotIndex > 0) setFirstHotIndex(firstHotIndex - 1);
        trackEvent({
            category: 'Markets',
            action: 'move-left-hot-markets',
        });
    };
    const moveRight = () => {
        trackEvent({
            category: 'Markets',
            action: 'move-right-hot-markets',
        });
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
                    const swipe = new Hammer.Swipe({ direction: DIRECTION_HORIZONTAL });
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
                {t('options.home.hot-markets.discounted-positions')}
                <Tooltip
                    message={t('options.home.hot-markets.tooltip-text-discount')}
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
                                discount={market.discount}
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
