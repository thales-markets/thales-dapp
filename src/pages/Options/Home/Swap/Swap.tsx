import ROUTES from 'constants/routes';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Background, Wrapper } from 'theme/common';
import MarketHeader from '../MarketHeader';
import useAllTokensQuery from './useAllTokensQuery';

const Swap: React.FC = () => {
    // const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const tokensQuery = useAllTokensQuery(networkId, {
        enabled: isAppReady,
    });

    const tokens = useMemo(() => {
        if (tokensQuery.isSuccess) {
            return tokensQuery.data;
        }
        return [];
    }, [tokensQuery]);

    console.log(tokens);

    tokens.map((token) => {
        if (token.symbol === 'sUSD') {
            console.log(token);
        }
    });

    return (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.Swap} />
            </Wrapper>
        </Background>
    );
};

export default Swap;
