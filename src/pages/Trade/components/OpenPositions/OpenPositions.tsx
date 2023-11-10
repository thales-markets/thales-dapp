import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { ZERO_ADDRESS } from 'constants/network';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber } from 'ethers';
import ChainedOpenPosition from 'pages/SpeedMarkets/components/ChainedOpenPosition';
import useUserActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveChainedSpeedMarketsDataQuery';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import useUserLivePositionsQuery from 'queries/user/useUserLivePositionsQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { ChainedSpeedMarket, UserLivePositions } from 'types/options';
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

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const positionsQuery = useUserLivePositionsQuery(networkId, walletAddress ?? '', {
        enabled: isAppReady && isWalletConnected && !isSpeedMarkets,
    });

    const livePositions = useMemo(() => (positionsQuery.isSuccess && positionsQuery.data ? positionsQuery.data : []), [
        positionsQuery,
    ]);

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!isSpeedMarkets && !isChainedSpeedMarkets,
    });
    const userActiveChainedSpeedMarketsDataQuery = useUserActiveChainedSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!isChainedSpeedMarkets,
    });

    const userOpenSpeedMarketsData = useMemo(
        () =>
            userActiveSpeedMarketsDataQuery.isSuccess && userActiveSpeedMarketsDataQuery.data
                ? userActiveSpeedMarketsDataQuery.data
                : [],
        [userActiveSpeedMarketsDataQuery]
    );
    const userOpenChainedSpeedMarketsData = useMemo(
        () =>
            userActiveChainedSpeedMarketsDataQuery.isSuccess && userActiveChainedSpeedMarketsDataQuery.data
                ? userActiveChainedSpeedMarketsDataQuery.data
                : [],
        [userActiveChainedSpeedMarketsDataQuery]
    );

    const noPositions = isSpeedMarkets
        ? isChainedSpeedMarkets
            ? userOpenChainedSpeedMarketsData.length === 0
            : userOpenSpeedMarketsData.length === 0
        : livePositions.length === 0;

    const positions = noPositions ? dummyPositions : isSpeedMarkets ? userOpenSpeedMarketsData : livePositions;
    const chainedPositions = noPositions ? dummyChainedPositions : userOpenChainedSpeedMarketsData;

    const isLoading =
        positionsQuery.isLoading ||
        userActiveSpeedMarketsDataQuery.isLoading ||
        userActiveChainedSpeedMarketsDataQuery.isLoading;

    return (
        <Wrapper>
            <Title>{t('markets.user-positions.your-positions')}</Title>
            {isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <>
                    <PositionsWrapper noPositions={noPositions}>
                        {isChainedSpeedMarkets
                            ? chainedPositions
                                  .sort((a, b) => a.maturityDate - b.maturityDate)
                                  .map((position, index) => (
                                      <ChainedOpenPosition
                                          position={position}
                                          key={`position${position.address}${index}`}
                                      />
                                  ))
                            : positions
                                  .sort((a, b) => a.maturityDate - b.maturityDate)
                                  .map((position, index) => (
                                      <OpenPosition
                                          position={position}
                                          key={`position${position.market}${position.positionAddress}${index}`}
                                          maxPriceDelayForResolvingSec={maxPriceDelayForResolvingSec}
                                          currentPrices={currentPrices}
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
const dummyChainedPositions: ChainedSpeedMarket[] = Array(2).fill({
    address: ZERO_ADDRESS,
    timestamp: 0,
    currencyKey: 'BTC',
    sides: [Positions.UP, Positions.DOWN],
    strikePrices: [35000, 35010],
    strikeTimes: [1684482600000, 1684483200000],
    maturityDate: 1684483200000,
    amount: 10,
    paid: 10.2,
    finalPrices: [35002, 35015],
    isOpen: true,
    canResolve: false,
    claimable: false,
} as ChainedSpeedMarket);

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding-bottom: 20px;
`;

const PositionsWrapper = styled.div<{ noPositions?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    max-height: 560px;
    ${(props) => (props.noPositions ? 'filter: blur(10px);' : '')}
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        overflow: auto;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    margin-bottom: 10px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
`;

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
