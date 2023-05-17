import { Bridge } from '@socket.tech/plugin';
import { SYNTHS_MAP } from 'constants/currency';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Network } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import useAllSourceTokensQuery, { SOURCE_NETWORK_IDS } from './queries/useAllSourceTokensQuery';
import { destinationTokens } from './tokens';

type CustomizationProps = {
    width?: number;
    responsiveWidth?: boolean;
    borderRadius?: number;
    accent?: string;
    onAccent?: string;
    primary?: string;
    secondary?: string;
    text?: string;
    secondaryText?: string;
    interactive?: string;
    onInteractive?: string;
    outline?: string;
};

const BungeePlugin: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const apiKey = process.env.REACT_APP_BUNGEE_API_KEY || '';
    if (!apiKey) {
        console.error('Bungee API_KEY not found!');
    }

    const defaultSourceNetwork = Network.Mainnet;
    const destinationNetworks = [Network['Mainnet-Ovm']];
    const defaultDestNetwork = Network['Mainnet-Ovm'];

    const allSourceTokensQuery = useAllSourceTokensQuery(apiKey, defaultDestNetwork, { enabled: isAppReady });
    const sourceTokens = allSourceTokensQuery.isSuccess && allSourceTokensQuery.data ? allSourceTokensQuery.data : [];

    const tokenList = [...sourceTokens, ...destinationTokens];

    const defaultDestinationToken = destinationTokens.filter(
        (token) => token.chainId === Network['Mainnet-Ovm'] && token.symbol === SYNTHS_MAP.sUSD
    )[0].address;

    const customize: CustomizationProps = {
        width: 386,
        responsiveWidth: false,
        accent: 'rgb(100,217,254)', // button
        onAccent: 'rgb(15,28,109)', // button text
        primary: 'rgb(4,4,90)',
        secondary: 'rgb(71,152,204)',
        text: 'rgb(255,255,255)',
        secondaryText: 'rgb(255,255,255)',
        interactive: 'rgb(4,4,90)', // dropdown
        onInteractive: 'rgb(255,255,255)', // dropdown text
        outline: 'rgb(100,217,254)',
    };

    return (
        <BungeeWrapper>
            <Bridge
                provider={snxJSConnector.provider}
                API_KEY={apiKey}
                sourceNetworks={SOURCE_NETWORK_IDS}
                defaultSourceNetwork={defaultSourceNetwork}
                destNetworks={destinationNetworks}
                defaultDestNetwork={defaultDestNetwork}
                tokenList={tokenList}
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
    top: 100px;
    background: var(--color-primary);
    border: 2px solid var(--color-highlight);
    box-shadow: 0px 0px 90px 10px var(--color-highlight);
    border-radius: 15px;
    outline: none;
`;

export default BungeePlugin;
