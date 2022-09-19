import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { formatGwei, getIsArbitrum, getIsBSC, getIsOVM, getIsPolygon, NetworkId } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';

const ETHERSCAN_GAS_TRACKER_API_URL =
    'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=6C4GRA8EBI2FCFDEMFASF1MTRW1SNBJTM5';
const POLYGONSCAN_GAS_TRACKER_API_URL =
    'https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=9GFTKKJ6U41Q5QJZ35E48DP7ISWPCQA2KR';

type EtherscanGasTrackerResponse = {
    status: string;
    message: string;
    result: {
        LastBlock: string;
        SafeGasPrice: string;
        ProposeGasPrice: string;
        FastGasPrice: string;
        suggestBaseFee: string;
    };
};

export type GasPricesEip1559 = {
    baseFee: number;
    safeGasPrice: number;
    proposeGasPrice: number;
    fastGasPrice: number;
};

const useEthGasPriceEip1559Query = (networkId: NetworkId, options?: UseQueryOptions<GasPricesEip1559>) => {
    return useQuery<GasPricesEip1559>(
        QUERY_KEYS.Network.EthGasPriceEip1559(networkId),
        async () => {
            const isL2 = getIsOVM(networkId);
            const isBSC = getIsBSC(networkId);
            const isPolygon = getIsPolygon(networkId);
            const isArbitrum = getIsArbitrum(networkId);

            if (isL2 || isBSC || isArbitrum) {
                try {
                    const gasPrice = formatGwei((await (snxJSConnector as any).provider.getGasPrice()).toNumber());
                    return {
                        baseFee: gasPrice,
                        safeGasPrice: gasPrice,
                        proposeGasPrice: gasPrice,
                        fastGasPrice: gasPrice,
                    };
                } catch (e) {
                    console.log('Cannot retrieve optimistic gas price from provider. ' + e);
                }
            } else {
                try {
                    const response = await axios.get<EtherscanGasTrackerResponse>(
                        isPolygon ? POLYGONSCAN_GAS_TRACKER_API_URL : ETHERSCAN_GAS_TRACKER_API_URL
                    );
                    const { result } = response.data;

                    return {
                        baseFee: Number(result.suggestBaseFee) < 5 ? 0.0000001 : Number(result.suggestBaseFee),
                        safeGasPrice: Number(result.SafeGasPrice) < 5 ? 30 : Number(result.SafeGasPrice),
                        proposeGasPrice: Number(result.ProposeGasPrice) < 5 ? 40 : Number(result.ProposeGasPrice),
                        fastGasPrice: Number(result.FastGasPrice) < 5 ? 50 : Number(result.FastGasPrice),
                    };
                } catch (e) {}
            }

            return {
                baseFee: 0,
                safeGasPrice: 0,
                proposeGasPrice: 0,
                fastGasPrice: 0,
            };
        },
        {
            refetchInterval: 2500,
            ...options,
        }
    );
};

export default useEthGasPriceEip1559Query;
