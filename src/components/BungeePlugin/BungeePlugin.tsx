import { Bridge, Customize } from '@socket.tech/plugin';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Network, NetworkId, getDefaultCollateral } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import useAllSourceTokensQuery, { SOURCE_NETWORK_IDS } from './queries/useAllSourceTokensQuery';
import { getTheme } from 'redux/modules/ui';
import { ThemeMap } from 'constants/ui';
import { hexToRGB } from 'utils/style';
import { getNetworkId } from 'redux/modules/wallet';

const SUPPORTED_DESTINATION_NETWORKS = [
    Network['Mainnet-Ovm'],
    Network.Arbitrum,
    Network['POLYGON-MAINNET'],
    Network.BSC,
];

const BungeePlugin: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const theme = useSelector((state: RootState) => getTheme(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const apiKey = process.env.REACT_APP_BUNGEE_API_KEY || '';
    if (!apiKey) {
        console.error('Bungee API_KEY not found!');
    }

    const defaultSourceNetwork = Network.Mainnet;
    const destinationNetworks = SUPPORTED_DESTINATION_NETWORKS.includes(networkId)
        ? SUPPORTED_DESTINATION_NETWORKS.filter((id: number) => id === networkId)
        : SUPPORTED_DESTINATION_NETWORKS;
    const defaultDestNetwork = destinationNetworks[0];
    const allSourceTokensQuery = useAllSourceTokensQuery(apiKey, defaultDestNetwork, { enabled: isAppReady });
    const allTokens = allSourceTokensQuery.isSuccess && allSourceTokensQuery.data ? allSourceTokensQuery.data : [];

    const defaultSrcToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'; // native token
    const defaultDestinationToken = allTokens.filter(
        (token) =>
            token.chainId === defaultDestNetwork &&
            token.symbol === getDefaultCollateral(defaultDestNetwork as NetworkId).toUpperCase() // SUSD is symbol on Bungee instead of sUSD
    )[0]?.address;

    // All colors should stricktly be in RGB format
    const customize: Customize = {
        width: 386,
        responsiveWidth: false,
        accent: hexToRGB(ThemeMap[theme].button.background.primary), // button
        onAccent: hexToRGB(ThemeMap[theme].button.textColor.primary), // button text
        primary: hexToRGB(ThemeMap[theme].background.primary), // background
        secondary: hexToRGB(ThemeMap[theme].background.secondary), // main button wrapper
        text: hexToRGB(ThemeMap[theme].textColor.primary),
        secondaryText: hexToRGB(ThemeMap[theme].textColor.primary),
        interactive: hexToRGB(ThemeMap[theme].button.background.secondary), // dropdown
        onInteractive: hexToRGB(ThemeMap[theme].textColor.primary), // dropdown text
        outline: hexToRGB(ThemeMap[theme].button.background.tertiary),
        fontFamily: ThemeMap[theme].fontFamily.primary,
    };

    return (
        <BungeeWrapper>
            <Bridge
                provider={snxJSConnector.signer?.provider}
                API_KEY={apiKey}
                sourceNetworks={SOURCE_NETWORK_IDS}
                defaultSourceNetwork={defaultSourceNetwork}
                destNetworks={destinationNetworks}
                defaultDestNetwork={defaultDestNetwork}
                tokenList={allTokens}
                defaultSourceToken={defaultSrcToken}
                defaultDestToken={defaultDestinationToken}
                customize={customize}
            />
        </BungeeWrapper>
    );
};

const BungeeWrapper = styled.div`
    box-sizing: border-box;
    width: 390px;
    height: 469px;
    margin: auto;
    position: relative;
`;

export default BungeePlugin;
