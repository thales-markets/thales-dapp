import { USD_SIGN } from 'constants/currency';
import {
    BATCH_NUMBER_OF_SPEED_MARKETS,
    MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH,
    MIN_MATURITY,
    OPTIONS_POSITIONS_MAP,
    SIDE,
    SPEED_MARKETS_QUOTE,
} from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { hoursToMilliseconds, secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionSide, UserClosedPositions } from 'types/options';
import { bigNumberFormatter, parseBytes32String, coinFormatter, formatCurrencyWithSign } from 'thales-utils';
import snxJSConnector from 'utils/snxJSConnector';
import { getFeesFromHistory } from 'utils/speedAmm';

const useUserResolvedSpeedMarketsDataQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserClosedPositions[]>
) => {
    return useQuery<UserClosedPositions[]>(
        QUERY_KEYS.BinaryOptions.UserResolvedSpeedMarkets(networkId, walletAddress),
        async () => {
            const userClosedSpeedMarketsData: UserClosedPositions[] = [];
            const { speedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            if (speedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getSpeedMarketsAMMParameters(walletAddress);

                const pageSize = Math.min(ammParams.numMaturedMarketsPerUser, MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH);
                const index = Number(ammParams.numMaturedMarketsPerUser) - pageSize;
                const maturedMarkets: [] = await speedMarketsAMMContract.maturedMarketsPerUser(
                    index,
                    pageSize,
                    walletAddress
                );

                const promises = [];
                for (let i = 0; i < Math.ceil(maturedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = maturedMarkets.slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS);
                    promises.push(speedMarketsDataContract.getMarketsData(batchMarkets));
                }
                const marketsDataArray = await Promise.all(promises);

                const userResolvedMarkets = marketsDataArray
                    .flat()
                    .map((marketData: any, index: number) => ({
                        ...marketData,
                        market: maturedMarkets[index],
                    }))
                    .filter((marketData: any) => Number(marketData.strikeTime) > MIN_MATURITY);

                for (let i = 0; i < userResolvedMarkets.length; i++) {
                    const marketData = userResolvedMarkets[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketData.direction] as OptionSide] as Positions;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;
                    const maturityDate = secondsToMilliseconds(Number(marketData.strikeTime));

                    const createdAt = !marketData.createdAt.isZero()
                        ? secondsToMilliseconds(Number(marketData.createdAt))
                        : maturityDate - hoursToMilliseconds(1);
                    const lpFee = !marketData.lpFee.isZero()
                        ? bigNumberFormatter(marketData.lpFee)
                        : getFeesFromHistory(createdAt).lpFee;
                    const safeBoxImpact = !marketData.safeBoxImpact.isZero()
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : getFeesFromHistory(createdAt).safeBoxImpact;
                    const fees = lpFee + safeBoxImpact;

                    const userData: UserClosedPositions = {
                        currencyKey: parseBytes32String(marketData.asset),
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS)
                        ),
                        strikePriceNum: bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS),
                        amount: payout,
                        amountBigNumber: marketData.buyinAmount,
                        maturityDate,
                        market: marketData.market,
                        side: side,
                        paid: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        finalPrice: bigNumberFormatter(marketData.finalPrice, PYTH_CURRENCY_DECIMALS),
                        isUserWinner: marketData.isUserWinner,
                    };

                    userClosedSpeedMarketsData.push(userData);
                }
            }

            return userClosedSpeedMarketsData;
        },
        {
            ...options,
        }
    );
};

export default useUserResolvedSpeedMarketsDataQuery;
