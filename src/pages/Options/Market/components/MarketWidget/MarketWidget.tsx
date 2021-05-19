import React from 'react';
import styled from 'styled-components';

type MarketWidgetProps = {
    children: React.ReactNode;
};

export const MarketWidget: React.FC<MarketWidgetProps> = ({ children }) => {
    return <Container>{children}</Container>;
};

const Container = styled.section`
    padding-bottom: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #04045a;
    border-radius: 23px;
    overflow: hidden;
`;

export default MarketWidget;
