import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { UserClosedPositions } from 'types/options';
import useUserResolvedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserResolvedSpeedMarketsDataQuery';
import ClosedPosition from '../ClosedPosition';

const ClosedPositions: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const userResolvedSpeedMarketsDataQuery = useUserResolvedSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const userResolvedPositions = useMemo(
        () =>
            userResolvedSpeedMarketsDataQuery.isSuccess && userResolvedSpeedMarketsDataQuery.data
                ? userResolvedSpeedMarketsDataQuery.data
                : [],
        [userResolvedSpeedMarketsDataQuery]
    );

    const noPositions = userResolvedPositions.length === 0;
    const positions = noPositions ? dummyPositions : userResolvedPositions;

    return (
        <Wrapper>
            <Title>{t('markets.user-positions.your-closed-positions')}</Title>
            {userResolvedSpeedMarketsDataQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <>
                    <PositionsWrapper noPositions={noPositions}>
                        {positions.map((position, index) => (
                            <ClosedPosition position={position} key={`closedPosition${index}`} />
                        ))}
                    </PositionsWrapper>
                    {noPositions && (
                        <NoPositionsText>{t('speed-markets.user-positions.no-closed-positions')}</NoPositionsText>
                    )}
                </>
            )}
        </Wrapper>
    );
};

const dummyPositions: UserClosedPositions[] = [
    {
        market: '0x1',
        currencyKey: 'BTC',
        amount: 15,
        amountBigNumber: BigNumber.from('15'),
        paid: 100,
        maturityDate: 1684483200000,
        strikePrice: '$ 25,000.00',
        side: Positions.UP,
        value: 0,
        finalPrice: 30000,
        isUserWinner: true,
    },
    {
        market: '0x2',
        currencyKey: 'BTC',
        amount: 10,
        amountBigNumber: BigNumber.from('10'),
        paid: 200,
        maturityDate: 1684483200000,
        strikePrice: '$ 35,000.00',
        side: Positions.DOWN,
        value: 0,
        finalPrice: 30000,
        isUserWinner: true,
    },
];

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

export default ClosedPositions;
