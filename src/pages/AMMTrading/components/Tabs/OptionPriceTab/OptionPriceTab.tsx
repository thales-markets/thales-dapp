import React from 'react';
import styled from 'styled-components';

import XAxisContainer from './styled-components/XAxisContainer';

import OptionPriceChart from '../../OptionPriceChart';

const OptionPriceTab: React.FC = () => {
    return (
        <Container>
            <XAxisContainer>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
                <XAxisContainer.Tick>
                    <XAxisContainer.Tick.Day>Mon</XAxisContainer.Tick.Day>
                    <XAxisContainer.Tick.DayNumerical>26</XAxisContainer.Tick.DayNumerical>
                    <XAxisContainer.Tick.Divider />
                </XAxisContainer.Tick>
            </XAxisContainer>
            <ChartContainer>
                <OptionPriceChart />
            </ChartContainer>
        </Container>
    );
};

const ChartContainer = styled.div`
    display: block;
    height: 230px;
    margin-top: 5px;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export default OptionPriceTab;
