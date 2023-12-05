import {
    BATCH_NUMBER_OF_SPEED_MARKETS,
    MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH,
    MIN_MATURITY,
    SIDE,
    SPEED_MARKETS_QUOTE,
} from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { hoursToMilliseconds, secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { OptionSide } from 'types/options';
import { TradeWithMarket } from 'types/profile';
import { bigNumberFormatter, coinFormatter, parseBytes32String } from 'thales-utils';
import snxJSConnector from 'utils/snxJSConnector';
import { getFeesFromHistory } from 'utils/speedAmm';

const useUserSpeedMarketsTransactionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<TradeWithMarket[]>
) => {
    return useQuery<TradeWithMarket[]>(
        QUERY_KEYS.BinaryOptions.UserSpeedMarketsTransactions(networkId, walletAddress),
        async () => {
            const userTransactions: TradeWithMarket[] = [];

            const { speedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            if (speedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getSpeedMarketsAMMParameters(walletAddress);

                const pageSize = Math.min(ammParams.numMaturedMarketsPerUser, MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH);
                const index = Number(ammParams.numMaturedMarketsPerUser) - pageSize;
                const [activeMarkets, maturedMarkets] = await Promise.all([
                    speedMarketsAMMContract.activeMarketsPerUser(0, ammParams.numActiveMarketsPerUser, walletAddress),
                    speedMarketsAMMContract.maturedMarketsPerUser(index, pageSize, walletAddress),
                ]);
                const allMarkets: any[] = activeMarkets.concat(maturedMarkets);

                const promises = [];
                for (let i = 0; i < Math.ceil(allMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = allMarkets.slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS);
                    promises.push(speedMarketsDataContract.getMarketsData(batchMarkets));
                }
                const allMarketsDataArray = await Promise.all(promises);

                const filteredMarketsData = allMarketsDataArray
                    .flat()
                    .map((marketData: any, index: number) => ({
                        ...marketData,
                        market: allMarkets[index],
                    }))
                    .filter((marketData: any) => Number(marketData.strikeTime) > MIN_MATURITY);

                for (let i = 0; i < filteredMarketsData.length; i++) {
                    const marketData = filteredMarketsData[i];
                    const side = SIDE[marketData.direction] as OptionSide;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const createdAt = !marketData.createdAt.isZero()
                        ? secondsToMilliseconds(Number(marketData.createdAt))
                        : secondsToMilliseconds(Number(marketData.strikeTime)) - hoursToMilliseconds(1);
                    const lpFee = !marketData.lpFee.isZero()
                        ? bigNumberFormatter(marketData.lpFee)
                        : getFeesFromHistory(createdAt).lpFee;
                    const safeBoxImpact = !marketData.safeBoxImpact.isZero()
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : getFeesFromHistory(createdAt).safeBoxImpact;
                    const fees = lpFee + safeBoxImpact;

                    const txHash = ''; // not used
                    const txBlockNumber = 0; // not used

                    const userData: TradeWithMarket = {
                        id: txHash,
                        transactionHash: txHash,
                        timestamp: createdAt,
                        orderHash: txHash,
                        maker: '', // not used
                        taker: walletAddress,
                        makerToken: '', // not used
                        takerToken: '', // not used
                        makerAmount: payout,
                        takerAmount: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                        blockNumber: txBlockNumber,
                        market: marketData.market,
                        orderSide: 'buy',
                        optionSide: side,
                        marketItem: {
                            address: marketData.market,
                            timestamp: createdAt,
                            currencyKey: parseBytes32String(marketData.asset),
                            strikePrice: bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS),
                            maturityDate: secondsToMilliseconds(Number(marketData.strikeTime)),
                            isOpen: !marketData.resolved,
                            result: marketData.resolved ? side : null,
                            finalPrice: bigNumberFormatter(marketData.finalPrice, PYTH_CURRENCY_DECIMALS),
                            isSpeedMarket: true,
                        },
                    };

                    userTransactions.push(userData);
                }
            }

            return userTransactions;
        },
        {
            ...options,
        }
    );
};

export default useUserSpeedMarketsTransactionsQuery;
