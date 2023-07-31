import React from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import UnresolvedPositions from './components/UnresolvedPositions';
import UnsupportedNetwork from 'components/UnsupportedNetwork';
import { SPEED_MARKETS_SUPPORTED_NETWORKS } from 'constants/network';
import { ScreenSizeBreakpoint } from 'enums/ui';

const SpeedMarketsAdmin: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <>
            {SPEED_MARKETS_SUPPORTED_NETWORKS.includes(networkId) ? (
                <Container>
                    <UnresolvedPositions />
                </Container>
            ) : (
                <UnsupportedNetworkWrapper>
                    <UnsupportedNetwork supportedNetworks={SPEED_MARKETS_SUPPORTED_NETWORKS} />
                </UnsupportedNetworkWrapper>
            )}
        </>
    );
};

const Container = styled.div`
    width: 100%;
`;

const UnsupportedNetworkWrapper = styled.div`
    margin: 90px 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 0;
    }
`;

export default SpeedMarketsAdmin;
