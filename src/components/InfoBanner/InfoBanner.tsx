import { ScreenSizeBreakpoint } from 'constants/ui';
import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered } from 'theme/common';

const InfoBanner: React.FC = ({ children }) => {
    return (
        <Container>
            <Text>{children}</Text>
        </Container>
    );
};

const Container = styled(FlexDivCentered)`
    background: ${(props) => props.theme.button.background.primary};
    border-radius: 15px;
    padding: 5px 20px;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 5px 20px;
    }
`;

const Text = styled(FlexDiv)`
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: ${(props) => props.theme.button.textColor.primary};
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: inline-block;
        text-align: center;
    }
`;

export default InfoBanner;
