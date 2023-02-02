import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HotMarket, OptionsMarkets } from 'types/options';
import opToken from 'assets/currencies/crypto/OP.svg';

import HotMarketCard from '../MarketsCard/HotMarketCard';
import HotMarketCardSceleton from 'components/HotMarketSceleton/HotMarketCardSceleton';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getSynthName } from 'utils/currency';
import Hammer, { DIRECTION_HORIZONTAL } from 'hammerjs';
import { PHASE } from 'constants/options';
import { USD_SIGN } from 'constants/currency';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { DiscountMap, fetchDiscounts } from 'queries/options/useDiscountMarkets';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import Tooltip from 'components/Tooltip';
import { getIsOVM } from 'utils/network';
import { getIsAppReady } from 'redux/modules/app';

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
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [lastValidDiscountMap, setLastValidDiscountMap] = useState<DiscountMap>(undefined);

    const showOPBanner = getIsOVM(networkId);

    const { trackEvent } = useMatomo();

    const discountQuery = fetchDiscounts(networkId, { enabled: isAppReady });

    useEffect(() => {
        if (discountQuery.isSuccess && discountQuery.data) {
            setLastValidDiscountMap(discountQuery.data);
        }
    }, [discountQuery.isSuccess, discountQuery.data]);

    const discountMap: DiscountMap = useMemo(() => {
        if (discountQuery.isSuccess && discountQuery.data) {
            return discountQuery.data;
        }
        return lastValidDiscountMap;
    }, [discountQuery.isSuccess, discountQuery.data, lastValidDiscountMap]);

    const currentMarkets = useMemo(() => {
        const markets: HotMarket[] = [];

        optionsMarkets
            ?.filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
            .sort((a, b) => a.timeRemaining - b.timeRemaining)
            .forEach((market) => {
                const discount = discountMap ? discountMap[market.address.toLowerCase()] : undefined;
                if (discount) {
                    if (discount.longPriceImpact < 0 && market.longPrice !== 0) {
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

                    if (discount.shortPriceImpact < 0 && market.shortPrice !== 0) {
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
    }, [optionsMarkets, discountMap]);

    const moveLeft = () => {
        if (firstHotIndex === 0) return;
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
        setFirstHotIndex(firstHotIndex + CARDS_TO_SHOW < currentMarkets.length ? firstHotIndex + 1 : 0);
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
            firstHotIndex + CARDS_TO_SHOW > currentMarkets.length
                ? currentMarkets.length
                : firstHotIndex + CARDS_TO_SHOW
        );
    }, [currentMarkets, firstHotIndex]);

    return (
        <>
            <DiscountBanner>
                <DiscountTitle> {t('options.home.hot-markets.discounted-positions')}</DiscountTitle>
                {showOPBanner && (
                    <>
                        <DiscountSubTitle> + {t('options.home.hot-markets.eligible-for')} </DiscountSubTitle>
                        <img src={opToken} width="46" height="46" style={{ margin: '0 8px' }} />
                        <DiscountSubTitle> {t('options.home.hot-markets.token-rewards')} </DiscountSubTitle>
                    </>
                )}

                <Tooltip
                    message={t('options.home.hot-markets.tooltip-text-discount')}
                    type={'info'}
                    iconColor={'var(--table-header-text-color)'}
                    placement={'right'}
                />
            </DiscountBanner>

            <Wrapper id="wrapper-cards">
                {currentMarkets.length > 0 ? (
                    <>
                        <Arrow onClick={moveLeft} disabled={firstHotIndex == 0} className={'icon icon--left'} />
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
                        <Arrow
                            onClick={moveRight}
                            disabled={
                                CARDS_TO_SHOW >= currentMarkets?.length
                                    ? true
                                    : firstHotIndex + CARDS_TO_SHOW == currentMarkets?.length
                            }
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

const DiscountBanner = styled.div`
    background: linear-gradient(106.37deg, #7900d9 23.8%, #219fc7 80.11%);
    border-radius: 10px;
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -20px;
    @media (max-width: 768px) {
        display: none;
    }
`;

const DiscountTitle = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #ffffff;
    margin-right: 6px;
`;

const DiscountSubTitle = styled.span`
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 30px;
    color: #ffffff;
`;

const Arrow = styled.i<{ disabled?: boolean }>`
    cursor: pointer;
    font-size: 60px;
    color: ${(_props) => (_props?.disabled ? 'var(--hotmarket-arrow-disable)' : 'var(--hotmarket-arrow-enabled)')};
    pointer-events: ${(_props) => (_props?.disabled ? 'none' : 'auto')};
`;

export default HotMarkets;
