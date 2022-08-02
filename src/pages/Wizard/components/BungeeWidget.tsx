import React from 'react';
import { Bridge } from '@socket.tech/widget';
import { ethers } from 'ethers';
import { Network } from 'utils/network';

const BungeeWidget: React.FC = () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum); // should this be from: import snxJSConnector from 'utils/snxJSConnector';

    // const apiKey = process.env.REACT_APP_BUNGEE_API_KEY || '';
    const apiKey = '9f78e5db-e4f6-474b-a863-f87b454d04d1';
    if (!apiKey) {
        console.error('Bungee API_KEY not found!');
    }

    // Support for Optimism & Polygon
    const sourceNetworks = [Network['Mainnet-Ovm'], Network['POLYGON-MAINNET']];
    const destinationNetworks = [Network['Mainnet-Ovm'], Network['POLYGON-MAINNET']];
    const defaultSourceNetwork = Network['POLYGON-MAINNET'];
    const defaultDestNetwork = Network['Mainnet-Ovm'];

    // type CustomizationProps = {
    //     width: number;
    //     responsiveWidth: boolean;
    //     borderRadius: number;
    //     accent: string;
    //     onAccent: string;
    //     primary: string;
    //     secondary: string;
    //     text: string;
    //     secondaryTextColor: string;
    //     interactive: string;
    //     onInteractive: string;
    //     outline: string;
    // };

    // const customize: CustomizationProps = {
    //     width: 380,
    //     responsiveWidth: false,
    //     borderRadius: 0.8,
    //     accent: 'rgb(131,249,151)',
    //     onAccent: 'rgb(0,0,0)',
    //     primary: 'rgb(9,4,31)',
    //     secondary: 'rgb(26,27,52)',
    //     text: 'rgb(255,255,255)',
    //     secondaryTextColor: 'rgb(200,200,200)',
    //     interactive: 'rgb(15, 20, 66)',
    //     onInteractive: 'rgb(240,240,240)',
    //     outline: 'rgb(18,26,91)',
    // };

    return (
        <Bridge
            provider={provider}
            API_KEY={apiKey}
            sourceNetworks={sourceNetworks}
            destNetworks={destinationNetworks}
            defaultSourceNetwork={defaultSourceNetwork}
            defaultDestNetwork={defaultDestNetwork}
            /*customize={customize}*/
        />
    );
};

export default BungeeWidget;
