import React, { useEffect, useMemo } from 'react';
import MarketCreation from './components/MarketCreation';
import { useSelector } from 'react-redux';
import { sortOptionsMarkets } from '../../../utils/options';
import { RootState } from 'redux/rootReducer';
import { getAvailableSynthsMap } from 'redux/modules/synths';
import HotMarkets from './components/HotMarkets';
import MarketsTable from './components/MarketsTable';
import binaryOptionMarketContract from '../../../utils/contracts/binaryOptionsMarketContract';
import useBinaryOptionsMarkets from 'queries/options/useBinaryOptionsMarkets';
import Web3 from 'web3';

const MAX_HOT_MARKETS = 4;

declare const window: any;

function connectWallet() {
    console.log('connecting wallet');
    const ethEnabled = () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            return true;
        }
        return false;
    };

    if (!ethEnabled()) {
        alert('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!');
    }
}

export const Home: React.FC = () => {
    const marketsQuery = useBinaryOptionsMarkets();

    connectWallet();

    const synthsMap = useSelector((state: RootState) => getAvailableSynthsMap(state));
    const optionsMarkets = useMemo(
        () =>
            marketsQuery.isSuccess && Array.isArray(marketsQuery.data)
                ? sortOptionsMarkets(marketsQuery.data, synthsMap)
                : [],
        [marketsQuery, synthsMap]
    );

    useEffect(() => {
        const init = async () => {
            console.log('init called');
            for (const o of optionsMarkets) {
                o.openOrders = 1;
                o.longAddress = '';
                o.shortAddress = '';
                const contract = new window.web3.eth.Contract(binaryOptionMarketContract.abi, o.address);
                if (o.address == '0x80a54822111c86d4c139e8637ac39114784f881f') {
                    const options = await contract.methods
                        .options()
                        .call({ from: window.web3.currentProvider.selectedAddress });
                    o.longAddress = options.long;
                    o.shortAddress = options.short;
                    console.log(options);
                    console.log('changed: ');
                    console.log(optionsMarkets);
                }
            }
        };

        init();
        console.log(optionsMarkets);
    }, [optionsMarkets]);

    const hotMarkets = useMemo(() => optionsMarkets.slice(0, MAX_HOT_MARKETS), [optionsMarkets]);
    return (
        <>
            <h1>Options</h1>
            <HotMarkets optionsMarkets={hotMarkets} />
            <MarketCreation />
            <MarketsTable optionsMarkets={optionsMarkets} />
        </>
    );
};

export default Home;
