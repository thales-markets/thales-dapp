import React from 'react';
import styled from 'styled-components';

const OptionPriceTab: React.FC = () => {
    return (
        <>
            <XAxisContainer>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
                <Tick>
                    <Day>Mon</Day>
                    <DayNumberical>26</DayNumberical>
                    <Divider />
                </Tick>
            </XAxisContainer>
        </>
    );
};

const XAxisContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
`;

const Tick = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Day = styled.div`
    color: var(--primary-color);
    font-size: 16px;
`;

const DayNumberical = styled.div`
    color: var(--input-border-color);
    font-size: 15px;
    margin: 10px 0px;
`;

const Divider = styled.div`
    background-color: var(--primary-color);
    width: 6px;
    height: 80px;
    border-radius: 5px;
`;

export default OptionPriceTab;
