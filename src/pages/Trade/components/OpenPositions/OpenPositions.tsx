import Button from 'components/Button';
import CollateralSelector from 'components/CollateralSelector';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { USD_SIGN } from 'constants/currency';
import { ZERO_ADDRESS } from 'constants/network';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber } from 'ethers';
import { CollateralSelectorContainer, InLabel } from 'pages/Profile/components/MyPositionAction/MyPositionAction';
import ChainedPosition from 'pages/SpeedMarkets/components/ChainedPosition';
import useUserActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveChainedSpeedMarketsDataQuery';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import useUserLivePositionsQuery from 'queries/user/useUserLivePositionsQuery';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled, { useTheme } from 'styled-components';
import { FlexDivCentered, FlexDivRow, FlexDivRowCentered } from 'styles/common';
import { formatCurrencyWithSign } from 'thales-utils';
import { ChainedSpeedMarket, UserLivePositions } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { getDefaultCollateral } from 'utils/currency';
import { getIsMultiCollateralSupported } from 'utils/network';
import { resolveAllChainedMarkets, resolveAllSpeedPositions } from 'utils/speedAmm';
import OpenPosition from '../OpenPosition';

type OpenPositionsProps = {
    isSpeedMarkets?: boolean;
    isChainedSpeedMarkets?: boolean;
    maxPriceDelayForResolvingSec?: number;
    currentPrices?: { [key: string]: number };
};

const OpenPositions: React.FC<OpenPositionsProps> = ({
    isSpeedMarkets,
    isChainedSpeedMarkets,
    maxPriceDelayForResolvingSec,
    currentPrices,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId, true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    // For sorting purpose as claimable status is unknown until all chained positions is rendered
    const [chainedClaimableStatuses, setChainedClaimableStatuses] = useState<
        { address: string; isClaimable: boolean }[]
    >([]);
    const [chainedWithClaimableStatus, setChainedWithClaimableStatus] = useState<ChainedSpeedMarket[]>([]);

    const positionsQuery = useUserLivePositionsQuery(networkId, walletAddress ?? '', {
        enabled: isAppReady && isWalletConnected && !isSpeedMarkets,
    });

    const livePositions = useMemo(() => (positionsQuery.isSuccess && positionsQuery.data ? positionsQuery.data : []), [
        positionsQuery,
    ]);

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!isSpeedMarkets && !isChainedSpeedMarkets,
    });

    const userOpenSpeedMarketsData = useMemo(
        () =>
            userActiveSpeedMarketsDataQuery.isSuccess && userActiveSpeedMarketsDataQuery.data
                ? userActiveSpeedMarketsDataQuery.data
                : [],
        [userActiveSpeedMarketsDataQuery]
    );

    const userChainedSpeedMarketsDataQuery = useUserActiveChainedSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!isChainedSpeedMarkets,
    });

    const userOpenChainedSpeedMarketsData = useMemo(
        () =>
            userChainedSpeedMarketsDataQuery.isSuccess && userChainedSpeedMarketsDataQuery.data
                ? userChainedSpeedMarketsDataQuery.data
                : [],
        [userChainedSpeedMarketsDataQuery]
    );

    // For chained sorting purpose
    const updateChainedClaimable = (address: string, isClaimable: boolean) => {
        const status = chainedClaimableStatuses.find((s) => s.address === address);
        if (status === undefined) {
            setChainedClaimableStatuses([...chainedClaimableStatuses, { address, isClaimable }]);
        } else if (status.isClaimable !== isClaimable) {
            setChainedClaimableStatuses(
                chainedClaimableStatuses.map((s) => (s.address === address ? { ...s, isClaimable } : s))
            );
        }
    };

    // For chained sorting purpose update claimable status when it is known
    useEffect(() => {
        if (userOpenChainedSpeedMarketsData.length === chainedClaimableStatuses.length) {
            let isStatusChanged = false;
            const chainedPositionsWithStatusUpdated: ChainedSpeedMarket[] = userOpenChainedSpeedMarketsData.map(
                (position) => {
                    const claimable = chainedClaimableStatuses.find((p) => p.address === position.address)?.isClaimable;
                    const claimableUpdated = chainedWithClaimableStatus.find((p) => p.address === position.address)
                        ?.claimable;

                    isStatusChanged =
                        isStatusChanged || (position.claimable !== claimable && claimableUpdated !== claimable);

                    return {
                        ...position,
                        claimable,
                    } as ChainedSpeedMarket;
                }
            );
            if (isStatusChanged) {
                setChainedWithClaimableStatus(chainedPositionsWithStatusUpdated);
            }
        }
    }, [userOpenChainedSpeedMarketsData, chainedWithClaimableStatus, chainedClaimableStatuses]);

    const sortSpeedMarkets = (markets: (UserLivePositions | ChainedSpeedMarket)[]) =>
        markets
            // 1. sort open by maturity asc
            .filter((position) => position.maturityDate > Date.now())
            .sort((a, b) => a.maturityDate - b.maturityDate)
            .concat(
                // 2. sort claimable by maturity desc
                markets.filter((position) => position.claimable).sort((a, b) => b.maturityDate - a.maturityDate)
            )
            .concat(
                markets
                    // 3. sort lost by maturity desc
                    .filter((position) => position.maturityDate < Date.now() && !position.claimable)
                    .sort((a, b) => b.maturityDate - a.maturityDate)
            );

    const sortedUserOpenSpeedMarketsData = sortSpeedMarkets(userOpenSpeedMarketsData) as UserLivePositions[];

    const sortedUserOpenChainedSpeedMarketsData = sortSpeedMarkets(
        chainedWithClaimableStatus.length ? chainedWithClaimableStatus : userOpenChainedSpeedMarketsData
    ) as ChainedSpeedMarket[];

    const noPositions = isSpeedMarkets
        ? isChainedSpeedMarkets
            ? userOpenChainedSpeedMarketsData.length === 0
            : userOpenSpeedMarketsData.length === 0
        : livePositions.length === 0;

    const positions = noPositions
        ? dummyPositions
        : isSpeedMarkets
        ? sortedUserOpenSpeedMarketsData
        : livePositions.sort((a, b) => a.maturityDate - b.maturityDate);

    const isLoading =
        positionsQuery.isLoading ||
        userActiveSpeedMarketsDataQuery.isLoading ||
        userChainedSpeedMarketsDataQuery.isLoading;

    const claimableSpeedPositions = userOpenSpeedMarketsData.filter((p) => p.claimable);
    const claimableSpeedPositionsSum = claimableSpeedPositions.reduce((acc, pos) => acc + pos.value, 0);

    const claimableChainedPositions = chainedWithClaimableStatus.filter((p) => p.claimable);
    const claimableChainedPositionsSum = claimableChainedPositions.reduce((acc, pos) => acc + pos.amount, 0);

    const hasClaimableSpeedPositions = isChainedSpeedMarkets
        ? !!claimableChainedPositions.length
        : !!claimableSpeedPositions.length;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (isChainedSpeedMarkets) {
            await resolveAllChainedMarkets(claimableChainedPositions, false, networkId);
        } else {
            await resolveAllSpeedPositions(claimableSpeedPositions, false, networkId);
        }
        setIsSubmitting(false);
    };

    const getClaimAllButton = () => (
        <Button
            {...getDefaultButtonProps(isMobile)}
            disabled={isSubmitting}
            additionalStyles={additionalButtonStyle}
            backgroundColor={theme.button.textColor.quaternary}
            onClick={handleSubmit}
        >
            {`${
                isSubmitting
                    ? t('speed-markets.user-positions.claim-all-progress')
                    : t('speed-markets.user-positions.claim-all')
            } ${formatCurrencyWithSign(
                USD_SIGN,
                isChainedSpeedMarkets ? claimableChainedPositionsSum : claimableSpeedPositionsSum,
                2
            )}`}
        </Button>
    );

    const showClaimAll = isSpeedMarkets && hasClaimableSpeedPositions;

    return (
        <Wrapper>
            <Header>
                <Title>{t('markets.user-positions.your-positions')}</Title>
                {showClaimAll && (
                    <ButtonWrapper>
                        {getClaimAllButton()}
                        {isMultiCollateralSupported && (
                            <CollateralSelectorContainer>
                                <InLabel color={theme.button.textColor.quaternary}>{t('common.in')}</InLabel>
                                <CollateralSelector
                                    collateralArray={[getDefaultCollateral(networkId)]}
                                    selectedItem={0}
                                    onChangeCollateral={() => {}}
                                    disabled
                                    additionalStyles={{
                                        color: theme.button.textColor.quaternary,
                                    }}
                                />
                            </CollateralSelectorContainer>
                        )}
                    </ButtonWrapper>
                )}
            </Header>
            {isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <>
                    <PositionsWrapper noPositions={noPositions} isChained={isChainedSpeedMarkets}>
                        {isChainedSpeedMarkets && !noPositions
                            ? sortedUserOpenChainedSpeedMarketsData.map((position, index) => (
                                  <ChainedPosition
                                      position={position}
                                      maxPriceDelayForResolvingSec={maxPriceDelayForResolvingSec}
                                      isMultipleMarkets={userOpenChainedSpeedMarketsData.length > 1}
                                      setIsClaimable={(isClaimable) =>
                                          updateChainedClaimable(position.address, isClaimable)
                                      }
                                      key={`position${position.address}${index}`}
                                  />
                              ))
                            : positions.map((position, index) => (
                                  <OpenPosition
                                      position={position}
                                      maxPriceDelayForResolvingSec={maxPriceDelayForResolvingSec}
                                      currentPrices={currentPrices}
                                      isMultipleMarkets={positions.length > 3}
                                      key={`position${position.market}${position.positionAddress}${index}`}
                                  />
                              ))}
                    </PositionsWrapper>
                    {noPositions && <NoPositionsText>{t('markets.user-positions.no-positions')}</NoPositionsText>}
                </>
            )}
        </Wrapper>
    );
};

const dummyPositions: UserLivePositions[] = [
    {
        positionAddress: ZERO_ADDRESS,
        market: '0x1',
        currencyKey: 'BTC',
        amount: 15,
        amountBigNumber: BigNumber.from('15'),
        paid: 100,
        maturityDate: 1684483200000,
        strikePrice: '$ 25,000.00',
        side: Positions.UP,
        value: 0,
        isSpeedMarket: false,
    },
    {
        positionAddress: ZERO_ADDRESS,
        market: '0x2',
        currencyKey: 'BTC',
        amount: 10,
        amountBigNumber: BigNumber.from('10'),
        paid: 200,
        maturityDate: 1684483200000,
        strikePrice: '$ 35,000.00',
        side: Positions.DOWN,
        value: 0,
        isSpeedMarket: false,
    },
];

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

const PositionsWrapper = styled.div<{ noPositions?: boolean; isChained?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => (props.isChained ? '16' : '6')}px;
    overflow-y: auto;
    max-height: ${(props) => (props.isChained ? '624' : '560')}px;
    ${(props) => (props.noPositions ? 'filter: blur(10px);' : '')}
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        overflow: auto;
    }
`;

const Header = styled(FlexDivRowCentered)`
    min-height: 37px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex: 1;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-left: 5px;
    }
`;

const ButtonWrapper = styled(FlexDivRow)`
    height: 27px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 34px;
        margin-left: 5px;
        padding: 5px 0;
    }
`;

const getDefaultButtonProps = (isMobile: boolean) => ({
    width: isMobile ? '175px' : '220px',
    height: isMobile ? '24px' : '27px',
    fontSize: isMobile ? '12px' : '13px',
    padding: '0px 5px',
});

const additionalButtonStyle: CSSProperties = {
    lineHeight: '100%',
    border: 'none',
};

const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 200px;
    width: 100%;
`;

const NoPositionsText = styled.span`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-weight: 600;
    font-size: 15px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    min-width: max-content;
`;

export default OpenPositions;
