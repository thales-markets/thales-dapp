import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { ZERO_ADDRESS } from 'constants/network';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber } from 'ethers';
import useUserLivePositionsQuery from 'queries/user/useUserLivePositionsQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRowCentered } from 'styles/common';
import { UserLivePositions } from 'types/options';
import OpenPosition from '../OpenPosition';

const OpenPositions: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector(getIsAppReady);
    const networkId = useSelector(getNetworkId);
    const isWalletConnected = useSelector(getIsWalletConnected);
    const walletAddress = useSelector(getWalletAddress) || '';

    const positionsQuery = useUserLivePositionsQuery(networkId, walletAddress ?? '', {
        enabled: isAppReady && isWalletConnected,
    });

    const livePositions = useMemo(() => (positionsQuery.isSuccess && positionsQuery.data ? positionsQuery.data : []), [
        positionsQuery,
    ]);

    const noPositions = livePositions.length === 0;

    const positions = noPositions ? dummyPositions : livePositions.sort((a, b) => a.maturityDate - b.maturityDate);

    return (
        <Wrapper className="step-5">
            <Header>
                <Title>{t('markets.user-positions.your-positions')}</Title>
            </Header>
            {positionsQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <>
                    <PositionsWrapper noPositions={noPositions}>
                        {!noPositions &&
                            positions.map((position, index) => (
                                <OpenPosition
                                    position={position}
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
        isDeprecatedCurrency: false,
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
        isDeprecatedCurrency: false,
    },
];

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
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
