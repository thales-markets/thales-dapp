import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { formatCurrency } from 'utils/formatters/number';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const LP_STAKING_WEEKLY_REWARDS = 24000;
const LP_STAKING_WEEKLY_SECOND_REWARDS = 2500;

interface Balance {
    priceInUSD: number;
    totalInUSD: number;
    apr: string;
    secondApr: string;
    totalApr: string;
}

type Rates = {
    ethereum: { usd: number };
    optimism: { usd: number };
    thales: { usd: number };
};

const getRates = async (): Promise<Rates> => {
    const resRates = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,optimism,thales&vs_currencies=usd'
    );
    const dataRates = await resRates.json();

    return dataRates;
};

const useGelatoQuery = (options?: UseQueryOptions<Balance>) => {
    return useQuery<Balance>(
        QUERY_KEYS.Token.Gelato(),
        async () => {
            try {
                const [balance, totalSupply, totalGelatoLocked, ratesResults] = await Promise.all([
                    snxJSConnector?.gelatoContract?.getUnderlyingBalances(),
                    snxJSConnector?.gelatoContract?.totalSupply(),
                    snxJSConnector?.lpStakingRewardsContract?.totalSupply(),
                    getRates(),
                ]);

                const thales = bigNumberFormatter(balance[0]);
                const weth = bigNumberFormatter(balance[1]);

                const priceInUSD =
                    (weth * ratesResults.ethereum.usd + thales * ratesResults.thales.usd) /
                    bigNumberFormatter(totalSupply);
                const totalInUSD = bigNumberFormatter(totalGelatoLocked) * priceInUSD;

                const apr = (100 * (LP_STAKING_WEEKLY_REWARDS * ratesResults.thales.usd * 52)) / totalInUSD;
                const secondApr =
                    (100 * (LP_STAKING_WEEKLY_SECOND_REWARDS * ratesResults.optimism.usd * 52)) / totalInUSD;
                const totalApr = apr + secondApr;

                return {
                    priceInUSD,
                    totalInUSD,
                    apr: formatCurrency(apr) + '%',
                    secondApr: formatCurrency(secondApr) + '%',
                    totalApr: formatCurrency(totalApr) + '%',
                };
            } catch (e) {
                console.log(e);
            }
            return { priceInUSD: 0, totalInUSD: 0, apr: '', secondApr: '', totalApr: '' };
        },
        options
    );
};

export default useGelatoQuery;
