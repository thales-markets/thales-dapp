import ChainedLostBackground from 'assets/images/flex-cards/chained-lost.png';
import ChainedWonBackground from 'assets/images/flex-cards/chained-won.png';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { Icon } from 'pages/SpeedMarkets/components/SelectPosition/styled-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'types/ui';
import styled, { useTheme } from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivEnd, FlexDivRow } from 'styles/common';
import { formatCurrency, formatCurrencyWithSign, roundNumberToDecimals } from 'thales-utils';
import { SharePositionData } from 'types/flexCards';
import { ThemeInterface } from 'types/ui';
import { getSynthName } from 'utils/currency';

const ChainedSpeedMarketFlexCard: React.FC<SharePositionData> = ({
    type,
    currencyKey,
    positions,
    strikePrices,
    finalPrices,
    buyIn,
    payout,
    payoutMultiplier,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const isUserWinner = type === 'chained-speed-won';

    const userStatusByDirection = positions.map((position, i) =>
        finalPrices && strikePrices && Number(finalPrices[i]) > 0 && Number(strikePrices[i]) > 0
            ? (position === Positions.UP && Number(finalPrices[i]) > Number(strikePrices[i])) ||
              (position === Positions.DOWN && Number(finalPrices[i]) < Number(strikePrices[i]))
            : undefined
    );

    const roi = payoutMultiplier ? roundNumberToDecimals(payoutMultiplier ** positions.length) : 0;

    return (
        <Container isWon={isUserWinner}>
            <ContentWrapper isWon={isUserWinner}>
                <HeaderWrapper isWon={isUserWinner}>
                    {isUserWinner && <Won>{t('common.flex-card.won')}</Won>}
                    {isUserWinner && <Payout>{formatCurrencyWithSign(USD_SIGN, payout ?? 0)}</Payout>}
                    <HeaderLabel>{t('speed-markets.chained.name')}</HeaderLabel>
                </HeaderWrapper>
                <AssetDiv isWon={isUserWinner}>
                    <CurrencyIcon className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`} />
                    <AssetLabel>{getSynthName(currencyKey)}</AssetLabel>
                    <AssetLabel isBold>{currencyKey}</AssetLabel>
                </AssetDiv>
                <FlexDivEnd>
                    <DirectionsHeaderLabel width={isMobile ? 88 : 94}>{t('common.direction')}</DirectionsHeaderLabel>
                    <DirectionsHeaderLabel width={isMobile ? 94 : 100}>
                        {t('common.strike-price')}
                    </DirectionsHeaderLabel>
                    <DirectionsHeaderLabel width={isMobile ? 78 : 84}>{t('profile.final-price')}</DirectionsHeaderLabel>
                    <DirectionsHeaderLabel width={38}>{t('common.result')}</DirectionsHeaderLabel>
                </FlexDivEnd>
                {positions.map((position, index) => {
                    return (
                        <DirectionRow key={index} isLast={index === positions.length - 1}>
                            <Text width={8} isBold>
                                {index + 1}
                            </Text>
                            <FlexDivCentered>
                                {position === Positions.UP ? (
                                    <Icon size={20} color={theme.positionColor.up} className="icon icon--caret-up" />
                                ) : (
                                    <Icon
                                        size={20}
                                        color={theme.positionColor.down}
                                        className="icon icon--caret-down"
                                    />
                                )}
                                <Text width={50} isBold padding="0 0 0 5px">
                                    {position}
                                </Text>
                            </FlexDivCentered>
                            <Text width={90} isCenter={!(strikePrices && strikePrices[index])}>
                                {strikePrices && strikePrices[index]
                                    ? `${currencyKey} ${formatCurrencyWithSign(USD_SIGN, strikePrices[index])}`
                                    : '-'}
                            </Text>
                            <Text width={90} isCenter={!(finalPrices && finalPrices[index])}>
                                {finalPrices && finalPrices[index]
                                    ? `${currencyKey} ${formatCurrencyWithSign(USD_SIGN, finalPrices[index])}`
                                    : '-'}
                            </Text>
                            <Text width={20} isCenter={userStatusByDirection[index] === undefined}>
                                {userStatusByDirection[index] === undefined ? (
                                    '-'
                                ) : userStatusByDirection[index] ? (
                                    <Icon size={20} color={theme.flexCard.up} className="icon icon--correct" />
                                ) : (
                                    <Icon size={20} color={theme.flexCard.down} className="icon icon--wrong" />
                                )}
                            </Text>
                        </DirectionRow>
                    );
                })}
                <FlexDivRow>
                    <Text isUppercase>{`${t('common.flex-card.buy-in')}: ${formatCurrency(buyIn)} ${
                        FIAT_CURRENCY_MAP.USD
                    }`}</Text>
                    <Text>{`${t('speed-markets.chained.roi', {
                        value: roi,
                    })}x`}</Text>
                </FlexDivRow>
            </ContentWrapper>
            {!isUserWinner && <LossWatermark>{t('common.loss')}</LossWatermark>}
        </Container>
    );
};

const Container = styled(FlexDivCentered)<{ isWon: boolean }>`
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    width: 383px;
    height: 510px;
    padding: 10px 20px;
    background: ${(props) => `url(${props.isWon ? ChainedWonBackground : ChainedLostBackground})`};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 357px;
        height: 476px;
        background-size: cover;
    }
`;

const HeaderWrapper = styled(FlexDivColumn)<{ isWon: boolean }>`
    width: 100%;
    margin-top: ${(props) => (props.isWon ? '3' : '13')}px;
`;

const ContentWrapper = styled(FlexDivColumn)<{ isWon: boolean }>`
    width: 100%;
    justify-content: end;
    opacity: ${(props) => (props.isWon ? '1' : '0.5')};
`;

const Won = styled.span`
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

const Payout = styled.span`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
    color: ${(props) => props.theme.flexCard.up};
`;

const HeaderLabel = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 21px;
    font-weight: 400;
    text-align: center;
    text-transform: uppercase;
`;

const AssetDiv = styled(FlexDiv)<{ isWon: boolean }>`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20px;
    opacity: ${(props) => (props.isWon ? '1' : '0.4')};
`;

const CurrencyIcon = styled.i`
    font-size: 40px;
    margin-right: 11px;
`;

const AssetLabel = styled.span<{ isBold?: boolean }>`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 22px;
    font-weight: ${(props) => (props.isBold ? 700 : 300)};
    text-transform: uppercase;
    :nth-child(2) {
        margin-right: 5px;
    }
`;

const DirectionsHeaderLabel = styled.span<{ width?: number }>`
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => props.theme.flexCard.text};
    text-transform: capitalize;
    width: ${(props) => (props.width ? `${props.width}px` : 'initial')};
`;

const DirectionRow = styled(FlexDivRow)<{ isLast?: boolean }>`
    border-bottom: ${(props) => (props.isLast ? 'solid' : 'dashed')} 1.5px;
    border-color: ${(props) => props.theme.borderColor.primary};
    padding: 0 10px;
`;

const Text = styled.span<{
    width?: number;
    isBold?: boolean;
    isUppercase?: boolean;
    padding?: string;
    isCenter?: boolean;
}>`
    font-size: 13px;
    font-weight: ${(props) => (props.isBold ? 700 : 400)};
    line-height: 230%;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: ${(props) => (props.isUppercase ? 'uppercase' : 'capitalize')};
    width: ${(props) => (props.width ? `${props.width}px` : 'initial')};
    text-align: ${(props) => (props.isCenter ? 'center' : 'left')};
    padding: ${(props) => (props.padding ? props.padding : '0')};
`;

const LossWatermark = styled(FlexDivCentered)`
    position: absolute;
    width: 295px;
    height: 110px;
    transform: rotate(-45deg);
    border: 10px solid ${(props) => props.theme.flexCard.down};
    border-radius: 20px;
    font-size: 55px;
    font-weight: 700;
    letter-spacing: 16px;
    text-transform: uppercase;
    color: ${(props) => props.theme.flexCard.down};
`;

export default ChainedSpeedMarketFlexCard;
