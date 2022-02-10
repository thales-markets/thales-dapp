import React from 'react';
import styled from 'styled-components';

import { CardContainer } from 'theme/common';
import AssetInfo from '../AssetInfo/AssetInfo';
import PriceChart from 'components/Charts/PriceChart';

const RowCard: React.FC = () => {
    return (
        <Container>
            <AssetInfo currencyKey="BTC" logoSize="50px" />
            <ChartContainer>
                <PriceChart currencyKey="BTC" footerFontSize={'10px'} />
            </ChartContainer>
            <ValueContainer>
                <Header>Current Asset Price</Header>
                <Value>$72,254.70</Value>
            </ValueContainer>
            <Divider />
            <ValueContainer>
                <Header>Strike Price</Header>
                <Value>$88,254.70</Value>
            </ValueContainer>
            <Divider />
            <ValueContainer>
                <Header>Maturity Date</Header>
                <Value>@ Oct 22, 2021</Value>
            </ValueContainer>
            <Divider />
            <ValueContainer>
                <Header>Maturity Date</Header>
                <Value>
                    <Liquidity shortLiqFlag={true}>1157500</Liquidity>
                    {' / '}
                    <Liquidity>450900</Liquidity>
                </Value>
            </ValueContainer>
        </Container>
    );
};

const Container = styled(CardContainer)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 20px 25px;
    width: 100%;
`;

const ChartContainer = styled.div`
    width: 130px;
    margin-left: 22px;
`;

const ValueContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin: 0px 25px;
`;

const Divider = styled.div`
    border-left: 2px solid var(--input-border-color);
    border-radius: 30px;
    height: 51px;
`;

const Header = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    color: var(--primary-color);
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 8px;
`;

const Value = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: 700;
    font-size: 25px;
    color: var(--primary-color);
`;

const Liquidity = styled.span<{ shortLiqFlag?: boolean }>`
    color: ${(_props) => (_props?.shortLiqFlag ? '#C3244A' : '#50CE99')};
`;

export default RowCard;
