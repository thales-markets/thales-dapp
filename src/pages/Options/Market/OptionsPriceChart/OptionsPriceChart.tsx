import React from 'react';
import OptionsPriceChartHeader from './OptionsPriceChartHeader';
import OptionsPriceChartContent from './OptionsPriceChartContent';
import { useMarketContext } from '../contexts/MarketContext';
import { FlexDivColumn } from 'theme/common';
import styled from 'styled-components';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';

const OptionsPriceChart: React.FC = () => {
    const optionsMarket = useMarketContext();

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.CHART_OPTIONS_PRICE}></MarketWidgetHeader>
            <MarketWidgetContent>
                <Container>
                    {optionsMarket.phase === 'trading' && <OptionsPriceChartHeader optionsMarket={optionsMarket} />}
                    <ChartContainer phase={optionsMarket.phase}>
                        <OptionsPriceChartContent optionsMarket={optionsMarket} />
                    </ChartContainer>
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivColumn)`
    background: #04045a;
    border-radius: 20px;
    width: 100%;
    height: 100%;
`;

const ChartContainer = styled.div<{ phase: string }>`
    width: 100%;
    height: calc(100% - 52px);
    margin-top: ${(props) => (props.phase === 'trading' ? '0' : '52px')};
`;
export default OptionsPriceChart;
