import DownBackground from 'assets/images/flex-cards/down-background.png';
import ZeusResolvedWinBackground from 'assets/images/flex-cards/resolved.png';
import UpBackground from 'assets/images/flex-cards/up-background.png';
import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { formatCurrencyWithSign, formatShortDateWithTime } from 'thales-utils';
import { SharePositionData, SharePositionType } from 'types/flexCards';
import { getSynthName } from 'utils/currency';
import SpeedMarketsFooter from '../SpeedMarketsFooter';

const SpeedMarketFlexCard: React.FC<SharePositionData> = ({
    type,
    positions,
    currencyKey,
    strikePrices,
    strikeDate,
    buyIn,
    payout,
}) => {
    const { t } = useTranslation();

    const strikePrice = strikePrices ? strikePrices[0] : 0;
    const price =
        typeof strikePrice == 'string' && strikePrice
            ? strikePrice
            : strikePrice
            ? formatCurrencyWithSign(USD_SIGN, strikePrice ?? 0)
            : 0;

    const position = positions[0];

    return (
        <Container position={position} type={type}>
            {type == 'resolved-speed' && <SpeedMarketsFooter />}
            <PositionInfo type={type}>
                <CurrencyIcon className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`} />
                <AssetName>{getSynthName(currencyKey)}</AssetName>
                <Position>{`${currencyKey.toUpperCase()} ${position}`}</Position>
            </PositionInfo>
            <PotentialWinContainer type={type}>
                <PotentialWinHeading>
                    {type == 'potential-speed' ? t('common.flex-card.potential-win') : t('common.flex-card.won')}
                </PotentialWinHeading>
                <PotentialWin position={position} type={type}>
                    {formatCurrencyWithSign(USD_SIGN, payout ?? 0)}
                </PotentialWin>
            </PotentialWinContainer>
            <MarketDetailsContainer type={type}>
                <MarketDetailsItemContainer type={type}>
                    <ItemName type={type}>
                        {type == 'potential-speed'
                            ? t('common.flex-card.entry-price')
                            : t('common.flex-card.strike-price')}
                    </ItemName>
                    <Value type={type}>{price}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer type={type}>
                    <ItemName type={type}>{t('common.flex-card.strike-date')}</ItemName>
                    <Value type={type}>{formatShortDateWithTime(strikeDate)}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer type={type}>
                    <ItemName type={type}>{t('common.flex-card.buy-in')}</ItemName>
                    <Value type={type}>{formatCurrencyWithSign(USD_SIGN, buyIn ?? 0)}</Value>
                </MarketDetailsItemContainer>
            </MarketDetailsContainer>
            {type == 'potential-speed' && <SpeedMarketsFooter />}
        </Container>
    );
};

const Container = styled.div<{ position: Positions; type: SharePositionType }>`
    border: ${(props) =>
        `10px solid ${
            props.type == 'resolved-speed'
                ? props.theme.flexCard.resolved
                : props.position == 'UP'
                ? props.theme.flexCard.up
                : props.theme.flexCard.down
        }`};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: ${(props) =>
        `url(${
            props.type == 'resolved-speed'
                ? ZeusResolvedWinBackground
                : props.position == 'DOWN'
                ? DownBackground
                : UpBackground
        }), lightgray 50% / cover no-repeat`};

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 357px;
        height: 476px;
        background-size: cover;
    }
`;

const MarketDetailsContainer = styled(FlexDiv)<{ type: SharePositionType }>`
    width: 100%;
    flex-direction: ${(props) => (props.type == 'potential-speed' ? 'column' : 'row')};
    margin-bottom: ${(props) => (props.type == 'potential-speed' ? '10px' : '0px')};
    margin-top: ${(props) => (props.type == 'potential-speed' ? '140px' : '')};
`;

const MarketDetailsItemContainer = styled(FlexDiv)<{ type: SharePositionType }>`
    justify-content: space-between;
    flex-direction: ${(props) => (props.type == 'potential-speed' ? '' : 'column')};
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
`;

const ItemName = styled.span<{ type: SharePositionType }>`
    text-transform: capitalize;
    color: ${(props) => (props.type == 'potential-speed' ? props.theme.textColor.primary : props.theme.flexCard.text)};
    font-size: ${(props) => (props.type == 'potential-speed' ? '18px' : '13px')};
    font-weight: ${(props) => (props.type == 'potential-speed' ? '700' : '400')};
`;

const Value = styled.span<{ type: SharePositionType }>`
    font-weight: 700;
    text-transform: capitalize;
    text-align: ${(props) => (props.type == 'potential-speed' ? '' : 'center')};
    font-size: ${(props) => (props.type == 'potential-speed' ? '18px' : '13px')};
    color: ${(props) => props.theme.textColor.primary};
`;

const PotentialWinContainer = styled(FlexDiv)<{ type: SharePositionType }>`
    width: 100%;
    flex-direction: column;
    margin-top: 50px;
    margin: ${(props) => (props.type.includes('resolve') ? '10px 0px 0px 0px' : '20px 0px')};
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

const PotentialWin = styled.span<{ position: Positions; type: SharePositionType }>`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
    color: ${(props) =>
        `${
            props.type == 'resolved-speed'
                ? props.theme.textColor.primary
                : props.position == 'UP'
                ? props.theme.flexCard.up
                : props.theme.flexCard.down
        }`};
`;

const PositionInfo = styled(FlexDiv)<{ type: SharePositionType }>`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: ${(props) => (props.type == 'resolved-speed' ? '200px' : '10px')};
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

export default SpeedMarketFlexCard;
