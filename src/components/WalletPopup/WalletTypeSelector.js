import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { connectToWallet } from 'utils/snxJSConnector';
import { hasEthereumInjected, SUPPORTED_WALLETS, SUPPORTED_WALLETS_MAP } from 'utils/network';
import { ReactComponent as MetamaskWallet } from 'assets/images/wallets/metamask.svg';
import { Header, Button } from 'semantic-ui-react';
import { resetWallet, updateWallet } from 'redux/modules/wallet';
import { toggleWalletPopup } from 'redux/modules/ui';
import { mountMetamaskAccountChangeEvent, mountMetamaskNetworkChange } from 'utils/walletEvents';

const { METAMASK } = SUPPORTED_WALLETS_MAP;

const walletTypeToIconMap = {
    [METAMASK]: MetamaskWallet,
};

const WalletTypeSelector = ({ selectAddressScreen }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onWalletClick = async ({ wallet }) => {
        dispatch(resetWallet());
        const walletStatus = await connectToWallet({ wallet });
        dispatch(updateWallet({ ...walletStatus, availableWallets: [] }));
        if (walletStatus && walletStatus.unlocked && walletStatus.walletAddress) {
            if (walletStatus.walletType === METAMASK) {
                mountMetamaskAccountChangeEvent(walletStatus.networkId, (walletAddress) =>
                    dispatch(updateWallet({ walletAddress }))
                );
                mountMetamaskNetworkChange();
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
                        <Button key={wallet} disabled={noMetamask} onClick={() => onWalletClick({ wallet })}>
                            <Icon width="80px" height="80px" />
                            <Header as="h3">{wallet}</Header>
                        </Button>
                    </div>
                );
            })}
        </>
    );
};

export default WalletTypeSelector;
