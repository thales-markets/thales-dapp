import React from 'react';
import ETHBTCFlippeningChartHeader from './ETHBTCFlippeningChartHeader';
import ETHBTCFlippeningChartContent from './ETHBTCFlippeningChartContent';
import styled from 'styled-components';

const OptionsPriceChart: React.FC = () => {
    return (
        <>
            <ETHBTCFlippeningChartHeader />
            <ChartContainer>
                <ETHBTCFlippeningChartContent />
            </ChartContainer>
        </>
    );
};

const ChartContainer = styled.div`
    width: 100%;
    height: calc(100% - 52px);
    margin-top: 0;
`;
export default OptionsPriceChart;
