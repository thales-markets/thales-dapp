import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import snxJSConnector, { connectToWallet } from 'utils/snxJSConnector';
import { hasEthereumInjected, SUPPORTED_WALLETS, SUPPORTED_WALLETS_MAP, onMetamaskAccountChange } from 'utils/network';
import { ReactComponent as MetamaskWallet } from 'assets/images/wallets/metamask.svg';
import { Header, Segment } from 'semantic-ui-react';
import { getWalletInfo, resetWalletReducer, updateWalletReducer } from 'redux/modules/wallet/walletDetails';
import { toggleWalletPopup } from 'redux/modules/ui';

const { METAMASK } = SUPPORTED_WALLETS_MAP;

const walletTypeToIconMap = {
    [METAMASK]: MetamaskWallet,
};

const WalletTypeSelector = ({ selectAddressScreen }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { derivationPath } = useSelector((state) => getWalletInfo(state));

    const onWalletClick = async ({ wallet, derivationPath }) => {
        dispatch(resetWalletReducer());
        const walletStatus = await connectToWallet({ wallet, derivationPath });
        dispatch(updateWalletReducer({ ...walletStatus, availableWallets: [] }));
        if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
            if (walletStatus.walletType === METAMASK) {
                onMetamaskAccountChange(async (accounts) => {
                    if (accounts && accounts.length > 0) {
                        const signer = new snxJSConnector.signers[METAMASK]({});
                        snxJSConnector.setContractSettings({
                            networkId: walletStatus.networkId,
                            signer,
                        });
                        dispatch(updateWalletReducer({ currentWallet: accounts[0] }));
                    }
                });
            }
            dispatch(toggleWalletPopup(false));
        } else selectAddressScreen();
    };

    return (
        <>
            <Header textAlign="center">{t('modals.wallet.connect-your-wallet')}</Header>
            {SUPPORTED_WALLETS.map((wallet) => {
                const noMetamask = wallet === METAMASK && !hasEthereumInjected();
                const Icon = walletTypeToIconMap[wallet];

                // unsupported wallet
                if (Icon == null) {
                    return null;
                }

                return (
                    <div key={wallet} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Segment
                            key={wallet}
                            disabled={noMetamask}
                            onClick={() => onWalletClick({ wallet, derivationPath })}
                            style={{ cursor: 'pointer', width: 115 }}
                        >
                            <Icon width="80px" height="80px" />
                            <Header as="h3">{wallet}</Header>
                        </Segment>
                    </div>
                );
            })}
        </>
    );
};

export default WalletTypeSelector;
