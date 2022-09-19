import React from 'react';
import styled from 'styled-components';

import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';

import onboardConnector from 'utils/onboardConnector';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { buildHref, navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { getDefaultCurrencyIconClassByNetworkId } from 'utils/currency';

const UserWallet: React.FC = () => {
    const truncateAddressNumberOfCharacters = 5;

    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { trackEvent } = useMatomo();

    return (
        <Wrapper>
            <WalletContainer
                connected={isWalletConnected}
                onClick={() => {
                    if (isWalletConnected) {
                        trackEvent({
                            category: 'dAppHeader',
                            action: 'click-on-wallet-when-connected',
                        });
                    }
                    isWalletConnected
                        ? navigateTo(buildHref(ROUTES.Options.Profile))
                        : onboardConnector.connectWallet();
                }}
            >
                <WalletIcon className={` ${getDefaultCurrencyIconClassByNetworkId(networkId)}`} />
                <WalletAddress>
                    {walletAddress
                        ? truncateAddress(
                              walletAddress,
                              truncateAddressNumberOfCharacters,
                              truncateAddressNumberOfCharacters
                          )
                        : t('common.wallet.connect-your-wallet')}
                </WalletAddress>
            </WalletContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: block;
    position: absolute;
    top: 40px;
    right: 90px;
    width: 130px;
    @media (max-width: 1024px) {
        right: 70px;
        top: 20px;
    }

    @media (max-width: 400px) {
        right: 55px;
        top: 20px;
    }
`;

const WalletContainer = styled.div<{ connected: boolean }>`
    border: 1px solid rgba(100, 217, 254, 0.5);
    border-radius: 15px;
    width: 100%;
    cursor: ${(_props) => (_props.connected ? 'text' : 'pointer')};
    padding: 5px 6px;
    display: flex;
    max-width: 150px;
    cursor: pointer;
`;

const WalletIcon = styled.i`
    color: var(--icon-color);
    font-size: 20px;
    display: inline;
`;

const WalletAddress = styled.p`
    color: var(--icon-color);
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12.5px;
    line-height: 14px;
    display: inline;
    text-align: center;
    margin: auto;
`;

export default UserWallet;
