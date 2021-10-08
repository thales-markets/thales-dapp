import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'theme/common';

const ETHBurnedCount: React.FC = () => {
    return (
        <FlexDivCentered>
            <CountContainer>
                <StakingRewardsAmountContainer gradient="#00D1FF">
                    <Title> </Title>
                    <Amount> </Amount>
                </StakingRewardsAmountContainer>
            </CountContainer>
        </FlexDivCentered>
    );
};

const CountContainer = styled(FlexDivColumn)`
    margin-left: 30px;
    align-self: center;
    @media (max-width: 1024px) {
        margin-left: 10px;
    }
    @media (max-width: 767px) {
        flex-basis: 45%;
        order: 2;
        margin: 2%;
        margin-top: 20px;
        max-width: 45%;
    }
`;

const StakingRewardsAmountContainer = styled.div<{ gradient: string; marginRight?: number; marginLeft?: number }>`
    position: relative;
    background: ${(props) => props.gradient};
    border-radius: 15px;
    margin-bottom: 20px;
    margin-right: ${(props) => props.marginRight ?? '0'}px;
    margin-left: ${(props) => props.marginLeft ?? '0'}px;
    @media (max-width: 767px) {
        margin-right: 0;
        margin-left: 0;
    }
`;

const Title = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 10px;
    @media (max-width: 767px) {
        font-size: 13px;
        padding-bottom: 3px;
    }
`;

const Amount = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 10px;
    @media (max-width: 767px) {
        font-size: 13px;
        padding-bottom: 3px;
    }
`;

export default ETHBurnedCount;
