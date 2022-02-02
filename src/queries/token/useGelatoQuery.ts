import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

export interface Balance {
    sLong: number;
    weth: number;
    totalInUSD: number;
}

// const ONE_YEAR_SECONDS = 365 * 24 * 3600;

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
                const [balance, gUNITotalSupply, rewardForDuration, duration] = await Promise.all([
                    snxJSConnector?.gelatoContract?.getUnderlyingBalances(),
                    snxJSConnector?.gelatoContract?.totalSupply(),
                    snxJSConnector?.lpStakingRewardsContract?.getRewardForDuration(),
                    snxJSConnector?.lpStakingRewardsContract?.rewardsDuration(),
                ]);

                console.log(gUNITotalSupply, rewardForDuration, duration);

                const sLong = Number(Number(ethers.utils.formatEther(balance[0])).toFixed(2));
                const weth = Number(Number(ethers.utils.formatEther(balance[1])).toFixed(2));
                const ratesResults = await getCoinGeckoThalesRates();
                const {
                    thales: { usd: thalesRate },
                    ethereum: { usd: ethRate },
                } = ratesResults;

                const totalInUSD = Number((weth * ethRate * 2).toFixed(2));
                console.log(thalesRate, ethRate, totalInUSD);

                // const amount0CurrentWei = wei(amount0Current);
                // const amount1CurrentWei = wei(amount1Current);
                // const totalValueInPool = amount0CurrentWei
                //     .mul(ethRate)
                //     .add(amount1CurrentWei.mul(snxRate));
                // const gUNIPrice = wei(totalValueInPool).div(wei(gUNITotalSupply));
                // const yearProRata = ONE_YEAR_SECONDS / duration.toNumber();
                // const gUNIValueInContract = wei(contractBalance).mul(gUNIPrice);
                // const rewardsValuePerYear = wei(rewardForDuration).mul(yearProRata).mul(snxRate);

                return { sLong, weth, totalInUSD };
            } catch (e) {
                console.log(e);
            }
            return { sLong: 0, weth: 0, totalInUSD: 0 };
        },
        options
    );
};

export default useGelatoQuery;
