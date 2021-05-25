import React from 'react';
import styled from 'styled-components';

type MarketWidgetProps = {
    children: React.ReactNode;
    background?: string;
};

export const MarketWidget: React.FC<MarketWidgetProps> = ({ children, background }) => {
    return <Container background={background}>{children}</Container>;
};

const Container = styled.section<{ background?: string }>`
    padding-bottom: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: ${(props) => props.background || '#04045a'};
    border-radius: 23px;
    overflow: hidden;
`;

export default MarketWidget;
