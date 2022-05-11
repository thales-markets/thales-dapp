import React, { useEffect, useState } from 'react';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import MarketCreation from './MarketCreation/MarketCreation';
import Loader from 'components/Loader';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { Background, Wrapper } from 'theme/common';
import MarketHeader from './MarketHeader';
import ROUTES from 'constants/routes';
import { useLocation } from 'react-router-dom';
import RedirectDialog from '../components/RedirectDialog/RedirectDialog';
import WalletNotConnectedDialog from '../components/WalletNotConnectedDialog/WalletNotConnectedDialog';

export const Home: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const location = useLocation();
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);

    const [openRedirectDialog, setOpenRedirectDialog] = useState(false);
    const [openWalletNotConnectedDialog, setOpenWalletNotConnectedDialog] = useState(false);

    useEffect(() => {
        if (location.search === '?anchor=overview') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else if (location.search === '?userFilter2=custom') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else if (location.search === '?userFilter2=competition') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else {
        }
    }, [location]);

    return (
        <>
            {marketsQuery.isSuccess ? (
                <Background style={{ minHeight: '100vh' }}>
                    <Wrapper>
                        <MarketHeader
                            route={
                                location.search === '?anchor=overview'
                                    ? ROUTES.Options.Overview
                                    : location.search === '?userFilter2=custom'
                                    ? ROUTES.Options.CustomMarkets
                                    : location.search === '?userFilter2=competition'
                                    ? ROUTES.Options.CompetitionMarkets
                                    : ROUTES.Options.Overview
                            }
                        />

                        <MarketCreation />
                        <RedirectDialog open={openRedirectDialog} setOpen={setOpenRedirectDialog}></RedirectDialog>
                        <WalletNotConnectedDialog
                            open={openWalletNotConnectedDialog}
                            setOpen={setOpenWalletNotConnectedDialog}
                        ></WalletNotConnectedDialog>
                    </Wrapper>
                </Background>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default Home;
