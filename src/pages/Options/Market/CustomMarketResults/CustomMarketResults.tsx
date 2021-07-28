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

enum CustomMarketEvent {
    OLYMPICS_GOLD_MEDALS_RANKING = 'Olympics Gold Medals Ranking',
    OLYMPICS_MEN_BASKETBALL_RANKING = 'Olympics Basketball Rankings (m)',
    OLYMPICS_MEN_VOLLEYBALL_RANKING = 'Olympics Volleyball Rankings (m)',
}

const CustomMarketEventMap: Record<string, any> = {
    [CustomMarketEvent.OLYMPICS_GOLD_MEDALS_RANKING]: <MedalsCountResults />,
    [CustomMarketEvent.OLYMPICS_MEN_BASKETBALL_RANKING]: <BasketballResults />,
    [CustomMarketEvent.OLYMPICS_MEN_VOLLEYBALL_RANKING]: <VolleyballResults />,
};

const CustomMarketResults: React.FC = () => {
    const optionsMarket = useMarketContext();
    const { t } = useTranslation();

    return (
        <>
            <MarketWidgetHeader
                widgetKey={MarketWidgetKey.CUSTOM_MARKET_RESULTS}
                title={
                    optionsMarket.eventName == CustomMarketEvent.OLYMPICS_MEN_VOLLEYBALL_RANKING
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
