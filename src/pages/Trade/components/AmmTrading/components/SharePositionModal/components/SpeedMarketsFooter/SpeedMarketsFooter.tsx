import React from 'react';
import styled from 'styled-components';
import SpeedMarketsLogo from 'assets/images/flex-cards/speed_markets_logo.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'types/ui';
import useGetReffererIdQuery from 'queries/referral/useGetReffererIdQuery';
import { getWalletAddress } from 'redux/modules/wallet';
import { buildReferrerLink } from 'utils/routes';
import QRCode from 'react-qr-code';
import ROUTES from 'constants/routes';

const SpeedMarketsFooter: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const reffererIDQuery = useGetReffererIdQuery(walletAddress || '', { enabled: !!walletAddress });
    const reffererID = reffererIDQuery.isSuccess && reffererIDQuery.data ? reffererIDQuery.data : '';

    return (
        <Container>
            <Logo src={SpeedMarketsLogo} />
            {reffererID && (
                <ReferralWrapper>
                    <QRCode size={70} value={buildReferrerLink(ROUTES.Home, reffererID)} />
                </ReferralWrapper>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
    margin: 10px 0px;
`;

const Logo = styled.img`
    width: 70%;
`;

const ReferralWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    background-color: white;
    padding: 5px;
`;

export default SpeedMarketsFooter;
