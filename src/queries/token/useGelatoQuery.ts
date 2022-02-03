import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

export interface Balance {
    totalInUSD: number;
    apr: string;
}

type Rates = { ethereum: { usd: number }; thales: { usd: number } };

const getRates = async (): Promise<Rates> => {
    const priceL2ThalesURL =
        'https://api.1inch.exchange/v3.0/10/quote?fromTokenAddress=0x217D47011b23BB961eB6D93cA9945B7501a5BB11&toTokenAddress=0x7f5c764cbc14f9669b88837ca1490cca17c31607&amount=1000000000000000000';

    const [res1, res2] = await Promise.all([
        fetch(priceL2ThalesURL),
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'),
    ]);
    const data1 = await res1.json();
    const data2 = await res2.json();
    const toAmount = Number(ethers.utils.formatUnits(data1.toTokenAmount, data1.toToken.decimals)).toFixed(2);

    return {
        ...data2,
        thales: { usd: Number(toAmount) },
    };
};

const useGelatoQuery = (options?: UseQueryOptions<Balance>) => {
    return useQuery<Balance>(
        QUERY_KEYS.Token.Gelato(),
        async () => {
            try {
                const [balance, ratesResults] = await Promise.all([
                    snxJSConnector?.gelatoContract?.getUnderlyingBalances(),
                    getRates(),
                ]);

                const thales = Number(toNumber(balance[0]).toFixed(2));
                const weth = Number(toNumber(balance[1]).toFixed(2));

                const totalInUSD = Number(
                    (weth * ratesResults.ethereum.usd + thales * ratesResults.thales.usd).toFixed(2)
                );
                const apr = ((100 * (35000 * ratesResults.thales.usd * 52)) / totalInUSD).toFixed(0) + '%';
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
