import Tooltip from 'components/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { millisecondsToSeconds } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import usePythPriceQueries from 'queries/prices/usePythPriceQueries';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled, { useTheme } from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivSpaceBetween } from 'styles/common';
import {
    formatCurrencyWithSign,
    formatHoursAndMinutesFromTimestamp,
    formatShortDate,
    formatShortDateWithTime,
} from 'thales-utils';
import { ChainedSpeedMarket } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { getPriceId } from 'utils/pyth';
import { AssetIcon, Icon, PositionSymbolDown, PositionSymbolUp } from '../SelectPosition/styled-components';
import { formatNumberShort } from 'utils/formatters/number';
import ChainedPositionAction from '../ChainedPositionAction';
import { refetchPythPrice } from 'utils/queryConnector';
import { getIsMobile } from 'redux/modules/ui';
import { getColorPerPosition } from 'utils/options';
import { ShareIcon } from 'pages/Trade/components/OpenPosition/OpenPosition';
import SharePositionModal from 'pages/Trade/components/AmmTrading/components/SharePositionModal';

type ChainedPositionProps = {
    position: ChainedSpeedMarket;
    maxPriceDelayForResolvingSec?: number;
    isOverview?: boolean;
    isAdmin?: boolean;
    isSubmittingBatch?: boolean;
    isMultipleMarkets?: boolean;
    setIsClaimable?: (isClaimable: boolean) => void;
};

const ChainedPosition: React.FC<ChainedPositionProps> = ({
    position,
    maxPriceDelayForResolvingSec,
    isOverview,
    isAdmin,
    isSubmittingBatch,
    isMultipleMarkets,
    setIsClaimable,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [fetchLastFinalPriceIndex, setFetchLastFinalPriceIndex] = useState(0);
    const [openTwitterShareModal, setOpenTwitterShareModal] = useState(false);

    const isMissingPrices = position.finalPrices.some((finalPrice) => !finalPrice);
    const maturedStrikeTimes = isMissingPrices
        ? position.strikeTimes.slice(0, fetchLastFinalPriceIndex + 1).filter((strikeTime) => strikeTime < Date.now())
        : position.strikeTimes;

    const pythPriceId = position.isOpen ? getPriceId(networkId, position.currencyKey) : '';
    const priceRequests = position.isOpen
        ? maturedStrikeTimes.map((strikeTime) => ({
              priceId: pythPriceId,
              publishTime: millisecondsToSeconds(strikeTime),
          }))
        : [];

    const pythPricesQueries = usePythPriceQueries(networkId, priceRequests, { enabled: position.isOpen });

    const finalPrices =
        isMissingPrices && position.isOpen
            ? position.finalPrices.map((_, i) => {
                  if (!pythPricesQueries[i]?.data) {
                      refetchPythPrice(pythPriceId, millisecondsToSeconds(maturedStrikeTimes[i]));
                  }
                  return pythPricesQueries[i]?.data || 0;
              })
            : position.finalPrices;
    const strikePrices =
        isMissingPrices && position.isOpen
            ? position.strikePrices.map((strikePrice, i) =>
                  i > 0 && i <= fetchLastFinalPriceIndex ? finalPrices[i - 1] : strikePrice
              )
            : position.strikePrices;
    const userWonStatuses = position.sides.map((side, i) =>
        finalPrices[i] > 0 && strikePrices[i] > 0
            ? (side === Positions.UP && finalPrices[i] > strikePrices[i]) ||
              (side === Positions.DOWN && finalPrices[i] < strikePrices[i])
            : undefined
    );
    const canResolve = position.isOpen
        ? userWonStatuses.some((status) => status === false) || userWonStatuses.every((status) => status !== undefined)
        : position.canResolve;

    const claimable = useMemo(
        () => (position.isOpen ? userWonStatuses.every((status) => status) : position.claimable),
        [position.isOpen, position.claimable, userWonStatuses]
    );

    const positionWithPrices = {
        ...position,
        strikePrices,
        finalPrices,
        canResolve,
        claimable,
    };

    const size = useMemo(() => position.sides.length, [position.sides]);
    const userFirstLostIndex = userWonStatuses.findIndex((wonStatus) => !wonStatus);
    const userFirstLostOrWonIndex = userFirstLostIndex > -1 ? userFirstLostIndex : size - 1;

    const statusDecisionIndex = positionWithPrices.claimable
        ? size - 1
        : position.isOpen
        ? fetchLastFinalPriceIndex
        : userFirstLostOrWonIndex;

    useEffect(() => {
        if (
            position.isOpen &&
            !canResolve &&
            finalPrices[fetchLastFinalPriceIndex] &&
            fetchLastFinalPriceIndex < size
        ) {
            setFetchLastFinalPriceIndex(fetchLastFinalPriceIndex + 1);
        }
    }, [canResolve, finalPrices, size, position.isOpen, fetchLastFinalPriceIndex]);

    useEffect(() => {
        setIsClaimable && setIsClaimable(claimable);
    }, [setIsClaimable, claimable]);

    const displayShare = !isOverview && (positionWithPrices.canResolve || positionWithPrices.isMatured);

    return (
        <Container>
            {isMobile ? (
                <AlignedFlex>
                    {isOverview && (
                        <FlexContainer>
                            <Text>{t('speed-markets.overview.user')}</Text>
                            <Text isActiveColor>{positionWithPrices.user}</Text>
                        </FlexContainer>
                    )}
                    <AssetIcon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
                    <FlexContainer>
                        <Text>{positionWithPrices.currencyKey}</Text>
                        <Text isActiveColor>
                            {formatCurrencyWithSign(USD_SIGN, positionWithPrices.strikePrices[statusDecisionIndex])}
                        </Text>
                    </FlexContainer>
                    <FlexContainer>
                        <Text>{t('profile.final-price')}</Text>
                        <Text isActiveColor>
                            {positionWithPrices.finalPrices[statusDecisionIndex] ? (
                                formatCurrencyWithSign(USD_SIGN, positionWithPrices.finalPrices[statusDecisionIndex])
                            ) : (
                                <>
                                    {'. . .'}
                                    {positionWithPrices.canResolve && (
                                        <Tooltip overlay={t('speed-markets.tooltips.final-price-missing')} />
                                    )}
                                </>
                            )}
                        </Text>
                    </FlexContainer>
                    <FlexContainer>
                        <Text>{t('speed-markets.user-positions.end-time')}</Text>
                        <Text isActiveColor>
                            {formatShortDateWithTime(
                                positionWithPrices.canResolve
                                    ? positionWithPrices.strikeTimes[statusDecisionIndex]
                                    : positionWithPrices.maturityDate
                            )}
                        </Text>
                    </FlexContainer>
                    <FlexContainer>
                        <Text>{t('common.direction')}</Text>
                        {positionWithPrices.sides.map((side, i) => (
                            <Text key={i} color={getColorPerPosition(side, theme)}>
                                {side + (i !== positionWithPrices.sides.length - 1 ? ',' : '')}
                            </Text>
                        ))}
                    </FlexContainer>
                    <FlexContainer>
                        <Text>{t('markets.user-positions.size')}</Text>
                        <Text isActiveColor>{formatNumberShort(positionWithPrices.amount)}</Text>
                    </FlexContainer>
                    <FlexContainer>
                        <Text>{t('markets.user-positions.paid')}</Text>
                        <Text isActiveColor>{formatCurrencyWithSign(USD_SIGN, positionWithPrices.paid, 2)}</Text>
                    </FlexContainer>
                    <ChainedPositionAction
                        position={positionWithPrices}
                        maxPriceDelayForResolvingSec={maxPriceDelayForResolvingSec}
                        isOverview={isOverview}
                        isAdmin={isAdmin}
                        isSubmittingBatch={isSubmittingBatch}
                    />
                    {!isOverview && (
                        <ShareDiv>
                            {displayShare && (
                                <ShareIcon
                                    className="icon-home icon-home--twitter-x"
                                    disabled={false}
                                    onClick={() => setOpenTwitterShareModal(true)}
                                />
                            )}
                        </ShareDiv>
                    )}
                </AlignedFlex>
            ) : (
                <>
                    <AssetInfo>
                        <FlexDivCentered>
                            <Icon
                                size={30}
                                color={theme.textColor.primary}
                                className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`}
                            />
                        </FlexDivCentered>
                        <Text lineHeight="30px">{t('speed-markets.user-positions.end-time')}</Text>
                        <Text>{t('common.strike-price')}</Text>
                        <Text>{t('profile.final-price')}</Text>
                        <Text>{t('common.status-label')}</Text>
                    </AssetInfo>
                    <Separator />
                    <PositionDetails>
                        {positionWithPrices.sides.map((side, index) => {
                            return (
                                <Postion isDisabled={!position.isOpen && index > userFirstLostOrWonIndex} key={index}>
                                    {index !== 0 && (
                                        <Chain>
                                            <Icon className="icon icon--chain" />
                                        </Chain>
                                    )}
                                    {side === Positions.UP ? (
                                        <PositionSymbolUp size={30} isSelected>
                                            <Icon size={16} className="icon icon--caret-up" />
                                        </PositionSymbolUp>
                                    ) : (
                                        <PositionSymbolDown size={30} isSelected>
                                            <Icon size={16} className="icon icon--caret-down" />
                                        </PositionSymbolDown>
                                    )}
                                    <Text fontWeight={400} lineHeight="14px" padding="1px 0 0 0">
                                        {formatShortDate(positionWithPrices.strikeTimes[index])}
                                    </Text>
                                    <Text lineHeight="14px" padding="0 0 1px 0">
                                        {formatHoursAndMinutesFromTimestamp(positionWithPrices.strikeTimes[index])}
                                    </Text>
                                    {positionWithPrices.strikePrices[index] ? (
                                        <Text isActiveColor={!maturedStrikeTimes[index]}>
                                            {formatCurrencyWithSign(USD_SIGN, positionWithPrices.strikePrices[index])}
                                        </Text>
                                    ) : (
                                        <Dash />
                                    )}
                                    {positionWithPrices.finalPrices[index] ? (
                                        <Text>
                                            {formatCurrencyWithSign(USD_SIGN, positionWithPrices.finalPrices[index])}
                                        </Text>
                                    ) : position.isOpen && maturedStrikeTimes[index] ? (
                                        <Text fontSize={16}>
                                            <Tooltip
                                                marginLeft={0}
                                                iconFontSize={16}
                                                overlay={t('speed-markets.tooltips.final-price-missing')}
                                            />
                                        </Text>
                                    ) : (
                                        <Dash />
                                    )}
                                    {userWonStatuses[index] !== undefined ? (
                                        <Text lineHeight="100%">
                                            <Icon
                                                size={userWonStatuses[index] ? 20 : 18}
                                                padding={userWonStatuses[index] ? undefined : '1px 0'}
                                                color={
                                                    userWonStatuses[index]
                                                        ? theme.textColor.quaternary
                                                        : theme.error.textColor.primary
                                                }
                                                className={
                                                    userWonStatuses[index] ? 'icon icon--correct' : 'icon icon--wrong'
                                                }
                                            />
                                        </Text>
                                    ) : (
                                        <Dash />
                                    )}
                                </Postion>
                            );
                        })}
                    </PositionDetails>
                    <Separator />
                    <Summary>
                        <BuyInfo>
                            <Text>
                                {t('markets.user-positions.size')}
                                <Text isActiveColor>{` ${formatNumberShort(positionWithPrices.amount)}`}</Text>
                            </Text>
                            <Text padding="0 0 0 30px">
                                {t('markets.user-positions.paid')}
                                <Text isActiveColor>{` ${formatCurrencyWithSign(
                                    USD_SIGN,
                                    positionWithPrices.paid
                                )}`}</Text>
                            </Text>
                        </BuyInfo>
                        <Result isSmaller={isOverview || displayShare}>
                            <ChainedPositionAction
                                position={positionWithPrices}
                                maxPriceDelayForResolvingSec={maxPriceDelayForResolvingSec}
                                isOverview={isOverview}
                                isAdmin={isAdmin}
                                isSubmittingBatch={isSubmittingBatch}
                                isMultipleContainerRows={isMultipleMarkets}
                            />
                        </Result>
                        {isOverview && (
                            <FlexDivCentered>
                                <Text>
                                    {t('speed-markets.overview.user')}
                                    <Text isActiveColor>{` ${position.user}`}</Text>
                                </Text>
                            </FlexDivCentered>
                        )}
                        {displayShare && (
                            <FlexDivCentered>
                                <ShareIcon
                                    className="icon-home icon-home--twitter-x"
                                    disabled={false}
                                    onClick={() => setOpenTwitterShareModal(true)}
                                />
                            </FlexDivCentered>
                        )}
                    </Summary>
                </>
            )}
            {openTwitterShareModal && (
                <SharePositionModal
                    type={
                        positionWithPrices.claimable || positionWithPrices.isUserWinner
                            ? 'chained-speed-won'
                            : 'chained-speed-lost'
                    }
                    positions={positionWithPrices.sides}
                    currencyKey={positionWithPrices.currencyKey}
                    strikeDate={positionWithPrices.maturityDate}
                    strikePrices={positionWithPrices.strikePrices}
                    finalPrices={positionWithPrices.finalPrices}
                    buyIn={positionWithPrices.paid}
                    payout={positionWithPrices.amount}
                    payoutMultiplier={positionWithPrices.payoutMultiplier}
                    onClose={() => setOpenTwitterShareModal(false)}
                />
            )}
        </Container>
    );
};

const Container = styled(FlexDivSpaceBetween)`
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    min-height: 144px;
    width: 100%;
    padding: 10px;
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

const AssetInfo = styled(FlexDivColumn)`
    max-width: 70px;
`;

const Text = styled.span<{
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: string;
    isActiveColor?: boolean;
    color?: string;
    padding?: string;
}>`
    font-size: ${(props) => (props.fontSize ? props.fontSize : '13')}px;
    font-weight: ${(props) => (props.fontWeight ? props.fontWeight : '600')};
    line-height: ${(props) => (props.lineHeight ? props.lineHeight : '20px')};
    color: ${(props) =>
        props.color
            ? props.color
            : props.isActiveColor
            ? props.theme.textColor.primary
            : props.theme.textColor.secondary};
    white-space: nowrap;
    ${(props) => (props.padding ? `padding: ${props.padding};` : '')}
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        line-height: 100%;
    }
`;

const PositionDetails = styled(FlexDivCentered)`
    width: 710px;
    gap: 10px;
`;

const Chain = styled(FlexDivCentered)`
    position: absolute;
    width: 16px;
    left: -13px;
    color: ${(props) => props.theme.textColor.secondary};
`;

const Dash = styled.div`
    width: 14px;
    height: 3px;
    background: ${(props) => props.theme.background.tertiary};
    border-radius: 3px;
    margin: 9px 0 8px 0;
`;

const Postion = styled(FlexDivColumnCentered)<{ isDisabled: boolean }>`
    position: relative;
    max-width: 110px;
    align-items: center;

    span,
    div {
        ${(props) => (props.isDisabled ? `color: ${props.theme.background.secondary};` : '')}
        ${(props) => (props.isDisabled ? `border-color: ${props.theme.background.secondary};` : '')}
    }

    ${Dash} {
        ${(props) => (props.isDisabled ? `background: ${props.theme.background.secondary};` : '')}
    }
`;

const Summary = styled(FlexDivColumn)`
    min-width: 235px;
`;

const BuyInfo = styled(FlexDivCentered)`
    height: 30px;
`;

const Result = styled(FlexDivCentered)<{ isSmaller?: boolean }>`
    height: ${(props) => (props.isSmaller ? '70' : '90')}px;
`;

const Separator = styled.div`
    min-width: 2px;
    width: 2px;
    height: 90px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    margin: 30px 10px 0 10px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
    width: 100%;
    flex-direction: column;
`;

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    flex-direction: row;
    justify-content: center;
`;

const ShareDiv = styled(FlexDivCentered)`
    width: 20px;
    height: 20px;
`;

export default ChainedPosition;
