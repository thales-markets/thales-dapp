import React from 'react';
import styled from 'styled-components';
import ZeusPotentialWinBackground from 'assets/images/zeus-potential-win.png';
import Footer from '../Footer/Footer';
import { FlexDiv } from 'styles/common';
import { useTranslation } from 'react-i18next';
import { getSynthName } from 'utils/currency';

const PotentialWinCard: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <PositionInfo>
                <CurrencyIcon className="currency-icon currency-icon--eth" />
                <AssetName>{getSynthName('sETH')}</AssetName>
                <Position>{'ETH UP'}</Position>
            </PositionInfo>
            <PotentialWinContainer>
                <PotentialWinHeading>{t('common.flex-card.potential-win')}</PotentialWinHeading>
                <PotentialWin>{'$520.00'}</PotentialWin>
            </PotentialWinContainer>
            <MarketDetailsItemContainer>
                <ItemName>{t('common.flex-card.strike-price')}</ItemName>
                <Value>{'$ 24.400'}</Value>
            </MarketDetailsItemContainer>
            <MarketDetailsItemContainer>
                <ItemName>{t('common.flex-card.strike-date')}</ItemName>
                <Value>{'$ 24.400'}</Value>
            </MarketDetailsItemContainer>
            <MarketDetailsItemContainer>
                <ItemName>{t('common.flex-card.buy-in')}</ItemName>
                <Value>{'$ 24.400'}</Value>
            </MarketDetailsItemContainer>
            <Footer />
        </Container>
    );
};

const Container = styled.div`
    border: 10px solid #03dac5;
    border-radius: 15px;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: url(${ZeusPotentialWinBackground}), lightgray 50% / cover no-repeat;
`;

const MarketDetailsItemContainer = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const ItemName = styled.span`
    text-transform: capitalize;
    color: #808997;
    font-size: 18px;
    font-weight: 700;
`;

const Value = styled.span<{ green?: boolean }>`
    font-weight: 700;
    text-transform: capitalize;
    font-size: 18px;
    color: ${(props) => (props.green ? '#03DAC6' : props.theme.textColor.primary)};
`;

const PotentialWinContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin: 20px 0px;
`;

const PotentialWinHeading = styled.span`
    color: #03dac6;
    font-size: 35px;
    font-weight: 300;
    text-transform: uppercase;
    text-align: center;
`;

const PotentialWin = styled(PotentialWinHeading)`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
`;

const PositionInfo = styled(FlexDiv)`
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

const CurrencyIcon = styled.i`
    font-size: 40px;
    margin-right: 11px;
`;

const AssetName = styled.span`
    color: #808997;
    font-size: 22px;
    margin-right: 5px;
    font-weight: 400;
    text-transform: capitalize;
`;

const Position = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 22px;
    font-weight: 700;
`;

export default PotentialWinCard;
