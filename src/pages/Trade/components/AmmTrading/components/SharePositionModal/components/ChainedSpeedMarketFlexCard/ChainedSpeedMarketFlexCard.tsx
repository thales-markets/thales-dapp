import React from 'react';
import styled from 'styled-components';
import UpBackground from 'assets/images/flex-cards/up-background.png';
import DownBackground from 'assets/images/flex-cards/down-background.png';
import { FlexDiv } from 'styles/common';
import { useTranslation } from 'react-i18next';
import { getSynthName } from 'utils/currency';
import { SharePositionData } from 'types/flexCards';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign, formatShortDateWithTime } from 'thales-utils';
import { Positions } from 'enums/options';
import SpeedMarketsFooter from '../SpeedMarketsFooter/SpeedMarketsFooter';
import ZeusResolvedWinBackground from 'assets/images/flex-cards/resolved.png';

const ChainedSpeedMarketFlexCard: React.FC<SharePositionData> = ({
    type,
    positions,
    currencyKey,
    strikePrice,
    strikeDate,
    buyIn,
    payout,
}) => {
    const { t } = useTranslation();

    const isResolved = type === 'resolved-chained-speed';
    const position = positions[0];

    const price =
        typeof strikePrice == 'string' && strikePrice
            ? strikePrice
            : strikePrice
            ? formatCurrencyWithSign(USD_SIGN, strikePrice ?? 0)
            : 0;

    return (
        <Container position={position} isResolved={isResolved}>
            {!isResolved && <SpeedMarketsFooter />}
            <PositionInfo isResolved={isResolved}>
                <CurrencyIcon className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`} />
                <AssetName>{getSynthName(currencyKey)}</AssetName>
                <Position>{`${currencyKey.toUpperCase()} ${position}`}</Position>
            </PositionInfo>
            <PotentialWinContainer isResolved={isResolved}>
                <PotentialWinHeading>
                    {isResolved ? t('common.flex-card.won') : t('common.flex-card.potential-win')}
                </PotentialWinHeading>
                <PotentialWin position={position} isResolved={isResolved}>
                    {formatCurrencyWithSign(USD_SIGN, payout ?? 0)}
                </PotentialWin>
            </PotentialWinContainer>
            <MarketDetailsContainer isResolved={isResolved}>
                <MarketDetailsItemContainer isResolved={isResolved}>
                    <ItemName isResolved={isResolved}>
                        {isResolved ? t('common.flex-card.strike-price') : t('common.flex-card.entry-price')}
                    </ItemName>
                    <Value isResolved={isResolved}>{price}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer isResolved={isResolved}>
                    <ItemName isResolved={isResolved}>{t('common.flex-card.strike-date')}</ItemName>
                    <Value isResolved={isResolved}>{formatShortDateWithTime(strikeDate)}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer isResolved={isResolved}>
                    <ItemName isResolved={isResolved}>{t('common.flex-card.buy-in')}</ItemName>
                    <Value isResolved={isResolved}>{formatCurrencyWithSign(USD_SIGN, buyIn ?? 0)}</Value>
                </MarketDetailsItemContainer>
            </MarketDetailsContainer>
            {!isResolved && <SpeedMarketsFooter />}
        </Container>
    );
};

const Container = styled.div<{ position: Positions; isResolved: boolean }>`
    border: ${(props) =>
        `10px solid ${
            props.isResolved
                ? props.theme.flexCard.resolved
                : props.position === Positions.UP
                ? props.theme.flexCard.up
                : props.theme.flexCard.down
        }`};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 386px;
    height: 510px;
    padding: 10px 10px;
    background: ${(props) =>
        `url(${
            props.isResolved
                ? ZeusResolvedWinBackground
                : props.position === Positions.DOWN
                ? DownBackground
                : UpBackground
        }), lightgray 50% / cover no-repeat`};
`;

const MarketDetailsContainer = styled(FlexDiv)<{ isResolved: boolean }>`
    width: 100%;
    flex-direction: ${(props) => (props.isResolved ? 'row' : 'column')};
    margin-bottom: ${(props) => (props.isResolved ? '0px' : '10px')};
    margin-top: ${(props) => (props.isResolved ? '' : '140px')};
`;

const MarketDetailsItemContainer = styled(FlexDiv)<{ isResolved: boolean }>`
    justify-content: space-between;
    flex-direction: ${(props) => (props.isResolved ? 'column' : '')};
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
`;

const ItemName = styled.span<{ isResolved: boolean }>`
    text-transform: capitalize;
    color: ${(props) => (props.isResolved ? props.theme.flexCard.text : props.theme.textColor.primary)};
    font-size: ${(props) => (props.isResolved ? '13px' : '18px')};
    font-weight: ${(props) => (props.isResolved ? '400' : '700')};
`;

const Value = styled.span<{ isResolved: boolean }>`
    font-weight: 700;
    text-transform: capitalize;
    text-align: ${(props) => (props.isResolved ? 'center' : '')};
    font-size: ${(props) => (props.isResolved ? '13px' : '18px')};
    color: ${(props) => props.theme.textColor.primary};
`;

const PotentialWinContainer = styled(FlexDiv)<{ isResolved: boolean }>`
    width: 100%;
    flex-direction: column;
    margin-top: 50px;
    margin: ${(props) => (props.isResolved ? '10px 0px 0px 0px' : '20px 0px')};
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

const PotentialWin = styled.span<{ position: Positions; isResolved: boolean }>`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
    color: ${(props) =>
        `${
            props.isResolved
                ? props.theme.textColor.primary
                : props.position === Positions.UP
                ? props.theme.flexCard.up
                : props.theme.flexCard.down
        }`};
`;

const PositionInfo = styled(FlexDiv)<{ isResolved: boolean }>`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: ${(props) => (props.isResolved ? '200px' : '10px')};
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

export default ChainedSpeedMarketFlexCard;
