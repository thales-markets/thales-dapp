import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UserLivePositions } from 'types/options';
import { formatShortDateWithTime, formatCurrencyWithPrecision, formatCurrencyWithSign } from 'thales-utils';
import useInterval from 'hooks/useInterval';
import { formatNumberShort } from 'utils/formatters/number';
import MyPositionAction from 'pages/Profile/components/MyPositionAction/MyPositionAction';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { Positions } from 'enums/options';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import { useSelector } from 'react-redux';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import { getColorPerPosition } from 'utils/options';
import Tooltip from 'components/Tooltip';
import { secondsToMilliseconds } from 'date-fns';
import { refetchUserSpeedMarkets } from 'utils/queryConnector';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import SharePositionModal from '../AmmTrading/components/SharePositionModal';

type OpenPositionProps = {
    position: UserLivePositions;
    maxPriceDelayForResolvingSec?: number;
    currentPrices?: { [key: string]: number };
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position, maxPriceDelayForResolvingSec, currentPrices }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [openTwitterShareModal, setOpenTwitterShareModal] = useState(false);
    const [isSpeedMarketMatured, setIsSpeedMarketMatured] = useState(
        position.isSpeedMarket && Date.now() > position.maturityDate
    );

    const isRanged = [Positions.IN, Positions.OUT].includes(position.side);

    useInterval(() => {
        if (position.isSpeedMarket && Date.now() > position.maturityDate) {
            if (!isSpeedMarketMatured) {
                setIsSpeedMarketMatured(true);
            }
            if (!position.finalPrice) {
                refetchUserSpeedMarkets(networkId, walletAddress);
            }
        }
    }, secondsToMilliseconds(5));

    return (
        <Position>
            <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
            <AlignedFlex>
                <FlexContainer firstChildWidth={position.isSpeedMarket ? '130px' : undefined}>
                    <Label>{position.currencyKey}</Label>
                    <Value>{position.strikePrice}</Value>
                </FlexContainer>
                {position.isSpeedMarket && (
                    <>
                        <Separator />
                        <FlexContainer secondChildWidth="140px">
                            <Label>
                                {isSpeedMarketMatured ? t('profile.final-price') : t('profile.current-price')}
                            </Label>
                            <Value>
                                {isSpeedMarketMatured ? (
                                    position.finalPrice ? (
                                        formatCurrencyWithPrecision(position.finalPrice)
                                    ) : (
                                        <>
                                            {'. . .'}
                                            <Tooltip overlay={t('speed-markets.tooltips.final-price-missing')} />
                                        </>
                                    )
                                ) : (
                                    formatCurrencyWithPrecision(currentPrices ? currentPrices[position.currencyKey] : 0)
                                )}
                            </Value>
                        </FlexContainer>
                    </>
                )}
                <Separator />
                <FlexContainer>
                    <Label>
                        {position.isSpeedMarket
                            ? t('speed-markets.user-positions.end-time')
                            : t('markets.user-positions.end-date')}
                    </Label>
                    <Value>{formatShortDateWithTime(position.maturityDate)}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('markets.user-positions.size')}</Label>
                    <Value>
                        {formatNumberShort(position.amount)}{' '}
                        <Value color={getColorPerPosition(position.side, theme)}>{position.side}</Value>
                    </Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('markets.user-positions.paid')}</Label>
                    <Value>{formatCurrencyWithSign(USD_SIGN, position.paid, 2)}</Value>
                </FlexContainer>
            </AlignedFlex>
            <MyPositionAction position={position} maxPriceDelayForResolvingSec={maxPriceDelayForResolvingSec} />
            <ShareIcon
                className="icon-home icon-home--twitter-x"
                disabled={false}
                onClick={() => setOpenTwitterShareModal(true)}
            />
            {!position.isSpeedMarket && (
                <SPAAnchor
                    href={
                        isRanged
                            ? buildRangeMarketLink(position.market, position.side)
                            : buildOptionsMarketLink(position.market, position.side)
                    }
                >
                    {isMobile ? (
                        <TextLink>
                            {t('profile.go-to-market')}{' '}
                            <IconLink
                                className="icon icon--right"
                                fontSize="10px"
                                marginTop="-2px"
                                color={theme.link.textColor.primary}
                            />
                        </TextLink>
                    ) : (
                        <Tooltip overlay={t('common.tooltip.open-market')}>
                            <IconLink className="icon icon--right" />
                        </Tooltip>
                    )}
                </SPAAnchor>
            )}
            {openTwitterShareModal && (
                <SharePositionModal
                    type={
                        position.claimable
                            ? position.isSpeedMarket
                                ? 'resolved-speed'
                                : 'resolved'
                            : position.isSpeedMarket
                            ? 'potential-speed'
                            : 'potential'
                    }
                    position={position.side}
                    currencyKey={position.currencyKey}
                    strikeDate={position.maturityDate}
                    strikePrice={position.strikePrice}
                    leftPrice={undefined}
                    rightPrice={undefined}
                    buyIn={position.paid}
                    payout={position.amount}
                    onClose={() => setOpenTwitterShareModal(false)}
                />
            )}
        </Position>
    );
};

const Position = styled.div`
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    min-height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 13px;
    gap: 4px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 172px;
        padding: 10px 10px;
        margin-bottom: 10px;
        gap: 6px;
    }
`;

const Icon = styled.i`
    font-size: 28px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 6px;
    }
`;

const FlexContainer = styled(AlignedFlex)<{ firstChildWidth?: string; secondChildWidth?: string }>`
    gap: 4px;
    flex: 1;
    justify-content: center;
    &:first-child {
        min-width: ${(props) => (props.firstChildWidth ? props.firstChildWidth : '195px')};
        max-width: ${(props) => (props.firstChildWidth ? props.firstChildWidth : '195px')};
    }
    &:nth-child(3) {
        ${(props) => (props.secondChildWidth ? `min-width: ${props.secondChildWidth};` : '')};
    }

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        gap: 4px;
    }
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

const Value = styled(Label)<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    white-space: nowrap;
`;

const Separator = styled.div`
    min-width: 2px;
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const TextLink = styled.span`
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

const IconLink = styled.i<{ color?: string; fontSize?: string; marginTop?: string }>`
    font-size: ${(props) => props.fontSize || '20px'};
    color: ${(props) => props.color || props.theme.textColor.secondary};
    text-transform: none;
    margin-top: ${(props) => props.marginTop || '0px'};
`;

export const ShareIcon = styled.i<{ disabled: boolean }>`
    color: ${(props) => props.theme.textColor.secondary};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.5' : '1')};
    font-size: 20px;
    text-transform: none;
`;

export default OpenPosition;
