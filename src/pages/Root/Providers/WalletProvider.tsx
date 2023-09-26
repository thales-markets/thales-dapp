import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';
import { SUPPORTED_NETWORKS_NAMES } from 'constants/network';
import { Network } from 'enums/network';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAppReady } from 'redux/modules/app';
import { updateWallet, updateNetworkSettings, switchToNetworkId, getSwitchToNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { isNetworkSupported } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { useAccount, useProvider, useSigner, useDisconnect, useNetwork } from 'wagmi';

type WalletProviderProps = {
    children: React.ReactNode;
};

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
    const switchedToNetworkId = useSelector((state: RootState) => getSwitchToNetworkId(state));

    const isLedgerLive = isLedgerDappBrowserProvider();

    const { address } = useAccount();
    const provider = useProvider(!address ? { chainId: switchedToNetworkId } : undefined); // when wallet not connected force chain
    const { data: signer } = useSigner();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();

    useEffect(() => {
        const init = async () => {
            let ledgerProvider = null;
            if (isLedgerLive) {
                ledgerProvider = new IFrameEthereumProvider();
                const accounts = await ledgerProvider.enable();
                const account = accounts[0];
                dispatch(updateWallet({ walletAddress: account }));
                ledgerProvider.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        dispatch(updateWallet({ walletAddress: accounts[0] }));
                    }
                });
            }

            try {
                const chainIdFromProvider = (await provider.getNetwork()).chainId;
                const providerNetworkId = isLedgerLive
                    ? ledgerProvider
                    : !!address
                    ? chainIdFromProvider
                    : switchedToNetworkId;

                snxJSConnector.setContractSettings({
                    networkId: providerNetworkId,
                    provider,
                    signer: isLedgerLive ? (ledgerProvider as any)?.getSigner() : signer,
                });

                dispatch(
                    updateNetworkSettings({
                        networkId: providerNetworkId as Network,
                        networkName: SUPPORTED_NETWORKS_NAMES[providerNetworkId as Network]?.toLowerCase(),
                    })
                );
                dispatch(setAppReady());
            } catch (e) {
                if (!e?.toString().includes('Error: underlying network changed')) {
                    dispatch(setAppReady());
                    console.log(e);
                }
            }
        };
        init();
    }, [dispatch, provider, signer, switchedToNetworkId, address, isLedgerLive]);

    useEffect(() => {
        dispatch(updateWallet({ walletAddress: address }));
    }, [address, dispatch]);

    useEffect(() => {
        if (window.ethereum) {
            (window as any).ethereum.on('chainChanged', (chainIdParam: any) => {
                const chainId = Number.isInteger(chainIdParam) ? chainIdParam : parseInt(chainIdParam, 16);

                if (!address && isNetworkSupported(chainId)) {
                    // when wallet disconnected reflect network change from browser wallet to dApp
                    dispatch(switchToNetworkId({ networkId: chainId }));
                }
            });
        }
    }, [dispatch, address]);

    useEffect(() => {
        if (chain?.unsupported) {
            disconnect();
        }
    }, [disconnect, chain]);

    return <>{children}</>;
};

export default WalletProvider;
