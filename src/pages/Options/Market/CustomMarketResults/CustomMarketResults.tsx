import React from 'react';
import { FlexDivColumn } from 'theme/common';
import styled from 'styled-components';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';
import { useMarketContext } from '../contexts/MarketContext';
import MedalsCountResults from './MedalsCountResults';
import BasketballResults from './BasketballResults';
import VolleyballResults from './VolleyballResults';
import { useTranslation } from 'react-i18next';
import USOpenResults from './USOpenResults';
import ETHBurnedCount from './ETHBurnedCount';
import ETHBTCFlippeningChart from './ETHBTCFlippeningChart';

enum CustomMarketEvent {
    OLYMPICS_GOLD_MEDALS_RANKING = 'Olympics Gold Medals Ranking',
    OLYMPICS_MEN_BASKETBALL_RANKING = 'Olympics Basketball Rankings (m)',
    OLYMPICS_MEN_VOLLEYBALL_RANKING = 'Olympics Volleyball Rankings (m)',
    US_OPEN_MEN_WINNER = 'US Open 2021 winner',
    ETH_BURNED_COUNT = 'ETH burned count',
    FLIPPENING_MARKETS = 'Flippening Markets',
    ETH_BTC_MARKET_CAP_RATIO = 'ETH/BTC market cap ratio',
}

const CustomMarketEventMap: Record<string, any> = {
    [CustomMarketEvent.OLYMPICS_GOLD_MEDALS_RANKING]: <MedalsCountResults />,
    [CustomMarketEvent.OLYMPICS_MEN_BASKETBALL_RANKING]: <BasketballResults />,
    [CustomMarketEvent.OLYMPICS_MEN_VOLLEYBALL_RANKING]: <VolleyballResults />,
    [CustomMarketEvent.US_OPEN_MEN_WINNER]: <USOpenResults />,
    [CustomMarketEvent.ETH_BURNED_COUNT]: <ETHBurnedCount />,
    [CustomMarketEvent.FLIPPENING_MARKETS]: <ETHBTCFlippeningChart />,
    [CustomMarketEvent.ETH_BTC_MARKET_CAP_RATIO]: <ETHBTCFlippeningChart />,
};

const CustomMarketResults: React.FC = () => {
    const optionsMarket = useMarketContext();
    const { t } = useTranslation();

    return (
        <>
            <MarketWidgetHeader
                widgetKey={MarketWidgetKey.CUSTOM_MARKET_RESULTS}
                title={
                    optionsMarket.eventName == CustomMarketEvent.FLIPPENING_MARKETS ||
                    optionsMarket.eventName == CustomMarketEvent.ETH_BTC_MARKET_CAP_RATIO
                        ? 'ETH/BTC market cap ratio chart'
                        : optionsMarket.eventName == CustomMarketEvent.ETH_BURNED_COUNT
                        ? 'ETH burned count stats'
                        : optionsMarket.eventName == CustomMarketEvent.OLYMPICS_MEN_VOLLEYBALL_RANKING ||
                          optionsMarket.eventName == CustomMarketEvent.US_OPEN_MEN_WINNER
                        ? t(`options.market.widgets.custom-market-results-odds-widget`)
                        : undefined
                }
            ></MarketWidgetHeader>
            <MarketWidgetContent>
                <Container
                    background={
                        optionsMarket.eventName === CustomMarketEvent.OLYMPICS_GOLD_MEDALS_RANKING
                            ? '#ffffff'
                            : '#04045a'
                    }
                >
                    {CustomMarketEventMap[optionsMarket.eventName || '']}
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivColumn)<{ background: string }>`
    background: ${(props) => props.background};
    width: 100%;
    height: 100%;
`;

export default CustomMarketResults;
