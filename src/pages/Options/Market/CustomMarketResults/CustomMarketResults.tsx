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

export const CustomMarketEventMap: Record<string, any> = {
    'Olympics Gold Medals Ranking': <MedalsCountResults />,
    'Olympics Basketball Rankings (m)': <BasketballResults />,
    'Olympics Volleyball Rankings (m)': <VolleyballResults />,
};

const CustomMarketResults: React.FC = () => {
    const optionsMarket = useMarketContext();

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.CUSTOM_MARKET_RESULTS}></MarketWidgetHeader>
            <MarketWidgetContent>
                <Container
                    background={optionsMarket.eventName === 'Olympics Gold Medals Ranking' ? '#ffffff' : '#04045a'}
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
    overflow: hidden;
`;

export default CustomMarketResults;
