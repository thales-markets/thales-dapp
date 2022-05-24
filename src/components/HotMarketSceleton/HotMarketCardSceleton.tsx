import React from 'react';
import styled from 'styled-components';
import { MarketCardContainer } from 'theme/common';

const HotMarketCardSceleton: React.FC<{ height?: string }> = ({ height }) => {
    return (
        <Card height={height}>
            <AssetInfo>
                <Container>
                    <CurrencyIcon></CurrencyIcon>
                    <SectionContainer>
                        <HeaderCard></HeaderCard>
                        <SubHeaderCard></SubHeaderCard>
                    </SectionContainer>
                </Container>
            </AssetInfo>
            <SectionContainer>
                <Header></Header>
                <SubHeader></SubHeader>
            </SectionContainer>
            <SectionContainer>
                <Header></Header>
                <SubHeader></SubHeader>
            </SectionContainer>
            <SectionContainer>
                <Header style={{ color: '#50ce99' }}></Header>
                <Percentage></Percentage>
            </SectionContainer>
        </Card>
    );
};

const Card = styled(MarketCardContainer)<{ height?: string }>`
    padding: 20px;
    width: 195px;
    height: ${(props) => props.height ?? '320px'};
    display: flex;
    border-radius: 15px;
    margin: 7.5px;
    background-color: var(--background);
    flex-direction: column;
    &:hover {
        box-shadow: var(--shadow);
    }
`;

const Container = styled.div`
    display: flex;
`;

const SectionContainer = styled.div`
    display: block;
`;

const AssetInfo = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    margin-right: -5px;
    margin-left: -5px;
`;

const CardText = styled.span`
    display: block;
    font-family: Roboto !important;
    color: var(--primary-color);
`;

const Header = styled(CardText)`
    display: block;
    font-size: 20px;
    font-weight: 300;
    text-transform: capitalize;
    width: 120px;
    height: 20px;
    border-radius: 3px;
    background: rgb(100, 217, 254, 0.5);
`;

const SubHeader = styled(CardText)`
    display: block;
    font-size: 25px;
    font-weight: 400;
    width: 80px;
    height: 25px;
    background: rgb(100, 217, 254, 0.5);
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 3px;
`;

const HeaderCard = styled(CardText)`
    display: block;
    font-size: 20px;
    font-weight: 300;
    text-transform: capitalize;
    width: 80px;
    height: 20px;
    border-radius: 3px;
    background: rgb(100, 217, 254, 0.5);
`;

const SubHeaderCard = styled(CardText)`
    display: block;
    font-size: 25px;
    font-weight: 400;
    width: 60px;
    height: 25px;
    background: rgb(100, 217, 254, 0.5);
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 3px;
`;

const Percentage = styled(CardText)`
    font-size: 25px;
    font-weight: 700;
    background: rgb(100, 217, 254, 0.5);
    width: 150px;
    height: 24px;
    margin-top: 10px;
    border-radius: 3px;
`;

const CurrencyIcon = styled.div`
    background: rgb(100, 217, 254, 0.5);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 20px;
`;

export default HotMarketCardSceleton;
