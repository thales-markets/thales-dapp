import React from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import UnresolvedPositions from './components/UnresolvedPositions';
import UnsupportedNetwork from 'components/UnsupportedNetwork';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { RouteComponentProps } from 'react-router-dom';
import { getSupportedNetworksByRoute } from 'utils/network';

const SpeedMarketsAdmin: React.FC<RouteComponentProps> = (props) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const supportedNetworks = getSupportedNetworksByRoute(props.location?.pathname);

    return (
        <>
            {supportedNetworks.includes(networkId) ? (
                <Container>
                    <UnresolvedPositions />
                </Container>
            ) : (
                <UnsupportedNetworkWrapper>
                    <UnsupportedNetwork supportedNetworks={supportedNetworks} />
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
