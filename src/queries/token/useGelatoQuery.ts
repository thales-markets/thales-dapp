import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { formatCurrency } from 'utils/formatters/number';

const LP_STAKING_WEEKLY_REWARDS = 45000;
const LP_STAKING_WEEKLY_SECOND_REWARDS = 15750;

export interface Balance {
    totalInUSD: number;
    apr: string;
    secondApr: string;
    totalApr: string;
}

const priceL2ThalesURL =
    'https://api.1inch.exchange/v3.0/10/quote?fromTokenAddress=0x217D47011b23BB961eB6D93cA9945B7501a5BB11&toTokenAddress=0x7f5c764cbc14f9669b88837ca1490cca17c31607&amount=100000000000000000000';

type Rates = {
    ethereum: { usd: number };
    optimism: { usd: number };
    thales: { usd: number };
};

const getRates = async (): Promise<Rates> => {
    const [resThales, resRewardTokens] = await Promise.all([
        fetch(priceL2ThalesURL),
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,optimism&vs_currencies=usd'),
    ]);
    const dataThales = await resThales.json();
    const dataRewardTokens = await resRewardTokens.json();
    const toAmount = (
        Number(ethers.utils.formatUnits(dataThales.toTokenAmount, dataThales.toToken.decimals)) / 100
    ).toFixed(4);

    return {
        ...dataRewardTokens,
        thales: { usd: Number(toAmount) },
    };
};

const useGelatoQuery = (totalGelatoLocked: number, options?: UseQueryOptions<Balance>) => {
    return useQuery<Balance>(
        QUERY_KEYS.Token.Gelato(totalGelatoLocked),
        async () => {
            try {
                const [balance, totalSupply, ratesResults] = await Promise.all([
                    snxJSConnector?.gelatoContract?.getUnderlyingBalances(),
                    snxJSConnector?.gelatoContract?.totalSupply(),
                    getRates(),
                ]);

                const thales = Number(toNumber(balance[0]).toFixed(2));
                const weth = Number(toNumber(balance[1]).toFixed(2));

                const totalInUSD =
                    (totalGelatoLocked *
                        Number((weth * ratesResults.ethereum.usd + thales * ratesResults.thales.usd).toFixed(2))) /
                    toNumber(totalSupply);

                const apr = (100 * (LP_STAKING_WEEKLY_REWARDS * ratesResults.thales.usd * 52)) / totalInUSD;
                const secondApr =
                    (100 * (LP_STAKING_WEEKLY_SECOND_REWARDS * ratesResults.optimism.usd * 52)) / totalInUSD;
                const totalApr = apr + secondApr;

                return {
                    totalInUSD,
                    apr: formatCurrency(apr) + '%',
                    secondApr: formatCurrency(secondApr) + '%',
                    totalApr: formatCurrency(totalApr) + '%',
                };
            } catch (e) {
                console.log(e);
            }
            return { totalInUSD: 0, apr: '', secondApr: '', totalApr: '' };
        },
        options
    );
};

export default useGelatoQuery;

const toNumber = (number: number) => {
    return Number(ethers.utils.formatEther(number));
};
