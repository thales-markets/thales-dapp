import React from 'react';

import XAxisContainer from './styled-components/XAxisContainer';

import OptionPriceChart from '../../OptionPriceChart';
import ChartContainer from './styled-components/ChartContainer';
import Container from './styled-components/Container';

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

export default OptionPriceTab;
