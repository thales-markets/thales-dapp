import React, { useMemo, useState } from 'react';
import { OptionsMarkets } from 'types/options';
import { useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivCentered, Image, Text } from 'theme/common';
import MarketCard from '../MarketCard';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import useInterval from 'hooks/useInterval';
import previous from 'assets/images/previous-page.svg';
import next from 'assets/images/next-page.svg';
import { Rates } from '../../../../queries/rates/useExchangeRatesQuery';
import './media.scss';

type HotMarketsProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
};

let shouldUseInterval = true;
let isAnimationActive = false;

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets, exchangeRates }) => {
    const { t } = useTranslation();
    const [currentMarket, setCurrentMarket] = useState(0);

    const currentMarkets = useMemo(() => {
        const markets = [];
        markets.push(
            currentMarket - 1 < 0 ? optionsMarkets[optionsMarkets.length - 1] : optionsMarkets[currentMarket - 1]
        );
        if (optionsMarkets.length === 1) return markets;
        markets.push(optionsMarkets[currentMarket]);
        if (optionsMarkets.length === 2) return markets;
        if (optionsMarkets.length === 3) {
            markets.push(optionsMarkets[currentMarket + 1]);
            return markets;
        }
        for (let index = 1; index < 4; index++) {
            markets.push(
                currentMarket + index > optionsMarkets.length - 1
                    ? optionsMarkets[currentMarket + index - optionsMarkets.length]
                    : optionsMarkets[currentMarket + index]
            );
        }

        return markets;
    }, [currentMarket]);

    useInterval(() => {
        if (optionsMarkets.length <= 3) return;
        if (shouldUseInterval) {
            document.getElementById('market-cards-wrapper')?.classList.add('next');
            setTimeout(() => {
                document.getElementById('market-cards-wrapper')?.classList.remove('next');
                setCurrentMarket(() => {
                    return currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1;
                });
            }, 1000);
        }
    }, 10000);

    return (
        <Wrapper id="hot-markets" className="hot-markets">
            <Text className="text-xxl pale-grey hot-markets__title">{t('options.home.explore-markets.trending')}</Text>
            <FlexDivCentered className="hot-markets__desktop">
                {optionsMarkets.length > 3 && (
                    <Arrow
                        onClick={() => {
                            shouldUseInterval = false;
                            if (!isAnimationActive) {
                                isAnimationActive = true;
                                document.getElementById('market-cards-wrapper')?.classList.add('previous');
                                setTimeout(() => {
                                    isAnimationActive = false;
                                    document.getElementById('market-cards-wrapper')?.classList.remove('previous');
                                    setCurrentMarket(
                                        currentMarket === 0 ? optionsMarkets.length - 1 : currentMarket - 1
                                    );
                                }, 1000);
                            }
                        }}
                        src={previous}
                        className="hot-markets__arrow"
                    />
                )}

                <div style={{ width: 1128, overflow: 'hidden' }}>
                    <Cards
                        className={(optionsMarkets.length <= 3 ? 'default' : 'animate') + ' hot-markets__cards'}
                        id="market-cards-wrapper"
                    >
                        {currentMarkets.map((optionsMarket, index) => {
                            return (
                                <MarketCard key={index} optionMarket={optionsMarket} exchangeRates={exchangeRates} />
                            );
                        })}
                    </Cards>
                </div>
                {optionsMarkets.length > 3 && (
                    <Arrow
                        onClick={() => {
                            shouldUseInterval = false;
                            if (!isAnimationActive) {
                                isAnimationActive = true;
                                document.getElementById('market-cards-wrapper')?.classList.add('next');
                                setTimeout(() => {
                                    isAnimationActive = false;
                                    document.getElementById('market-cards-wrapper')?.classList.remove('next');
                                    setCurrentMarket(
                                        currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1
                                    );
                                }, 1000);
                            }
                        }}
                        src={next}
                        className="hot-markets__arrow"
                    />
                )}
            </FlexDivCentered>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumn)`
    padding: 50px 110px;
    position: relative;
    max-height: 490px;
    padding-left: 198px;
`;

const Arrow = styled(Image)`
    width: 24px;
    height: 40px;
    margin: 0 10px;
    cursor: pointer;
`;

const Cards = styled(FlexDiv)`
    position: relative;
`;

export default HotMarkets;
