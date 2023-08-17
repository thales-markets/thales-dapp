import { USD_SIGN } from 'constants/currency';
import { OPTIONS_POSITIONS_MAP, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionSide, UserClosedPositions } from 'types/options';
import { bigNumberFormatter, parseBytes32String, coinFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';

const useUserResolvedSpeedMarketsDataQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserClosedPositions[]>
) => {
    return useQuery<UserClosedPositions[]>(
        QUERY_KEYS.BinaryOptions.UserResolvedSpeedMarkets(networkId, walletAddress),
        async () => {
            const userSpeedMarketsData: UserClosedPositions[] = [];
            const { speedMarketsAMMContract } = snxJSConnector;

            if (speedMarketsAMMContract) {
                const [lpFee, safeBoxImpact, numMaturedMarkets] = await Promise.all([
                    speedMarketsAMMContract.lpFee(),
                    speedMarketsAMMContract.safeBoxImpact(),
                    speedMarketsAMMContract.numMaturedMarketsPerUser(walletAddress),
                ]);
                const fees = bigNumberFormatter(lpFee) + bigNumberFormatter(safeBoxImpact);
                const maturedMarkets = await speedMarketsAMMContract.maturedMarketsPerUser(
                    0,
                    numMaturedMarkets,
                    walletAddress
                );
                const marketsDataArray = await speedMarketsAMMContract.getMarketsData(maturedMarkets);
                const userResolvedMarkets = marketsDataArray.map((marketData: any, index: number) => ({
                    ...marketData,
                    market: maturedMarkets[index],
                }));

                const lastTenMaturedMarkets = [...userResolvedMarkets]
                    .sort((a: any, b: any) => Number(a.strikeTime) - Number(b.strikeTime))
                    .slice(-10);

                for (let i = 0; i < lastTenMaturedMarkets.length; i++) {
                    const marketData = lastTenMaturedMarkets[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketData.direction] as OptionSide] as Positions;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const userData: UserClosedPositions = {
                        currencyKey: parseBytes32String(marketData.asset),
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS)
                        ),
                        amount: payout,
                        amountBigNumber: marketData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketData.strikeTime)),
                        market: marketData.market,
                        side: side,
                        paid: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        finalPrice: bigNumberFormatter(marketData.finalPrice, PYTH_CURRENCY_DECIMALS),
                        isUserWinner: marketData.isUserWinner,
                    };

                    userSpeedMarketsData.push(userData);
                }
            }

            return userSpeedMarketsData;
        },
        {
            ...options,
        }
    );
};

export default useUserResolvedSpeedMarketsDataQuery;
