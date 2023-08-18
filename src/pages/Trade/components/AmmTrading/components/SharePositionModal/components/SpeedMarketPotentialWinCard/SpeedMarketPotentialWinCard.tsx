import React from 'react';
import styled from 'styled-components';
import UpBackground from 'assets/images/flex-cards/speed-markets-up-background.png';
import DownBackground from 'assets/images/flex-cards/speed-markets-down-background.png';
import { FlexDiv } from 'styles/common';
import { useTranslation } from 'react-i18next';
import { getSynthName } from 'utils/currency';
import { SharePositionData } from '../../SharePositionModal';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { Positions } from 'enums/options';
import SpeedMarketsFooter from '../SpeedMarketsFooter/SpeedMarketsFooter';
import { formatShortDateWithTime } from 'utils/formatters/date';

const DOWN_BORDER_COLOR = '#DE496D';
const UP_BORDER_COLOR = '#03DAC5';

const SpeedMarketPotentialWinCard: React.FC<SharePositionData> = ({
    position,
    currencyKey,
    strikePrice,
    strikeDate,
    payout,
}) => {
    const { t } = useTranslation();

    const price =
        typeof strikePrice == 'string' && strikePrice
            ? strikePrice
            : strikePrice
            ? formatCurrencyWithSign(USD_SIGN, strikePrice ?? 0)
            : 0;

    return (
        <Container position={position}>
            <PositionInfo>
                <CurrencyIcon className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`} />
                <AssetName>{getSynthName(currencyKey)}</AssetName>
                <Position>{`${currencyKey.toUpperCase()} ${position}`}</Position>
            </PositionInfo>
            <PotentialWinContainer>
                <PotentialWinHeading>{t('common.flex-card.potential-win')}</PotentialWinHeading>
                <PotentialWin position={position}>{formatCurrencyWithSign(USD_SIGN, payout ?? 0)}</PotentialWin>
            </PotentialWinContainer>
            <MarketDetailsContainer>
                <MarketDetailsItemContainer>
                    <ItemName>{t('common.flex-card.entry-price')}</ItemName>
                    <Value>{price}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer>
                    <ItemName>{t('common.flex-card.strike-date')}</ItemName>
                    <Value>{formatShortDateWithTime(strikeDate)}</Value>
                </MarketDetailsItemContainer>
            </MarketDetailsContainer>
            <SpeedMarketsFooter />
        </Container>
    );
};

const Container = styled.div<{ position: Positions }>`
    border: ${(props) => `10px solid ${props.position == 'UP' ? UP_BORDER_COLOR : DOWN_BORDER_COLOR}`};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: ${(props) =>
        `url(${props.position == 'UP' ? UpBackground : DownBackground}), lightgray 50% / cover no-repeat`};
`;

const MarketDetailsContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin-bottom: 10px;
`;

const MarketDetailsItemContainer = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
`;

const ItemName = styled.span`
    text-transform: capitalize;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    font-weight: 700;
`;

const Value = styled.span`
    font-weight: 700;
    text-transform: capitalize;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
`;

const PotentialWinContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin: 10px 0px 150px 0px;
`;

const PotentialWinHeading = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 35px;
    font-weight: 300;
    text-transform: uppercase;
    text-align: center;
    ::before {
        width: 13px;
        height: 13px;
        margin: 0px 5px;
        transform: rotate(45deg);
        content: '';
        display: inline-block;
        background-color: ${(props) => props.theme.textColor.primary};
    }
    ::after {
        width: 13px;
        margin: 0px 5px;
        height: 13px;
        transform: rotate(45deg);
        content: '';
        display: inline-block;
        background-color: ${(props) => props.theme.textColor.primary};
    }
`;

const PotentialWin = styled.span<{ position: Positions }>`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
    color: ${(props) => `${props.position == 'UP' ? UP_BORDER_COLOR : DOWN_BORDER_COLOR}`};
`;

const PositionInfo = styled(FlexDiv)`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 10px;
`;

const CurrencyIcon = styled.i`
    font-size: 40px;
    margin-right: 11px;
`;

const AssetName = styled.span`
    color: ${(props) => props.theme.textColor.primary};
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

export default SpeedMarketPotentialWinCard;
