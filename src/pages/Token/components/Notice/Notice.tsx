import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'theme/common';

const Notice: React.FC = ({ children }) => {
    return (
        <Wrapper>
            <Container>
                <Text>{children}</Text>
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 10px;
    padding: 1px;
    margin-bottom: 15px;
`;

const Container = styled(FlexDivCentered)`
    background: #04045a;
    border-radius: 10px;
    padding: 18px 20px;
    @media (max-width: 767px) {
        padding: 20px 20px;
    }
`;

const Text = styled(FlexDiv)`
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: #ffffff;
    align-items: center;
    @media (max-width: 767px) {
        margin-bottom: 20px;
        margin-right: 0;
        text-align: center;
        flex-direction: column;
    }
`;

export default Notice;
