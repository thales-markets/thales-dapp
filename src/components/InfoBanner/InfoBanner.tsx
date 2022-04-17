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
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    border-radius: 15px;
    padding: 5px 20px;
    width: 100%;
    @media (max-width: 767px) {
        padding: 5px 20px;
    }
`;

const Text = styled(FlexDiv)`
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: #ffffff;
    align-items: center;
    @media (max-width: 767px) {
        display: inline-block;
        text-align: center;
    }
`;

export default InfoBanner;
