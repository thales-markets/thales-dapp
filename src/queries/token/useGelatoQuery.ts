import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

export interface Balance {
    totalInUSD: number;
    apr: string;
}

type CoinGeckoThalesRates = { thales: { usd: number }; ethereum: { usd: number } };
const getCoinGeckoThalesRates = async (): Promise<CoinGeckoThalesRates> => {
    const resp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=thales%2Cethereum&vs_currencies=usd');
    return resp.json();
};

const useGelatoQuery = (options?: UseQueryOptions<Balance>) => {
    return useQuery<Balance>(
        QUERY_KEYS.Token.Gelato(),
        async () => {
            try {
                const [balance] = await Promise.all([snxJSConnector?.gelatoContract?.getUnderlyingBalances()]);

                const thales = Number(toNumber(balance[0]).toFixed(2));
                const weth = Number(toNumber(balance[1]).toFixed(2));

                const ratesResults = await getCoinGeckoThalesRates();
                const {
                    thales: { usd: thalesRate },
                    ethereum: { usd: ethRate },
                } = ratesResults;

                const totalInUSD = Number((weth * ethRate + thales * thalesRate).toFixed(2));
                const apr = ((100 * (35000 * thalesRate * 52)) / totalInUSD).toFixed(0) + '%';
                return { totalInUSD, apr };
            } catch (e) {
                console.log(e);
            }
            return { totalInUSD: 0, apr: '' };
        },
        options
    );
};

export default useGelatoQuery;

const toNumber = (number: number) => {
    return Number(ethers.utils.formatEther(number));
};
