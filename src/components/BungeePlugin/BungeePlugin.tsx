import { Bridge, Customize } from '@socket.tech/plugin';
import { Network } from 'enums/network';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import styled, { useTheme } from 'styled-components';
import { hexToRGB } from 'thales-utils';
import { SupportedNetwork } from 'types/network';
import { RootState, ThemeInterface } from 'types/ui';
import { getDefaultCollateral } from 'utils/currency';
import snxJSConnector from 'utils/snxJSConnector';
import useAllSourceTokensQuery, { SOURCE_NETWORK_IDS } from './queries/useAllSourceTokensQuery';

const SUPPORTED_DESTINATION_NETWORKS: SupportedNetwork[] = [
    Network.OptimismMainnet,
    Network.Arbitrum,
    Network.PolygonMainnet,
    Network.Base,
];

const BungeePlugin: React.FC = () => {
    const theme: ThemeInterface = useTheme();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
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
            token.symbol === getDefaultCollateral(defaultDestNetwork).toUpperCase() // SUSD is symbol on Bungee instead of sUSD
    )[0]?.address;

    // All colors should stricktly be in RGB format
    const customize: Customize = {
        width: 386,
        responsiveWidth: false,
        accent: hexToRGB(theme.button.background.primary), // button
        onAccent: hexToRGB(theme.button.textColor.primary), // button text
        primary: hexToRGB(theme.background.primary), // background
        secondary: hexToRGB(theme.background.secondary), // main button wrapper
        text: hexToRGB(theme.textColor.primary),
        secondaryText: hexToRGB(theme.textColor.primary),
        interactive: hexToRGB(theme.button.background.secondary), // dropdown
        onInteractive: hexToRGB(theme.textColor.primary), // dropdown text
        outline: hexToRGB(theme.button.background.tertiary),
        fontFamily: theme.fontFamily.primary,
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
