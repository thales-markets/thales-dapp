import {
    BATCH_NUMBER_OF_SPEED_MARKETS,
    MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH,
    OPTIONS_POSITIONS_MAP,
    SIDE,
} from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { ChainedSpeedMarket, OptionSide } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';

const useUserActiveChainedSpeedMarketsDataQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<ChainedSpeedMarket[]>
) => {
    return useQuery<ChainedSpeedMarket[]>(
        QUERY_KEYS.BinaryOptions.UserResolvedChainedSpeedMarkets(networkId, walletAddress),
        async () => {
            const userChainedSpeedMarketsData: ChainedSpeedMarket[] = [];
            // TODO: remove after contarct deploy on all chains
            if ([Network.Arbitrum, Network.OptimismMainnet, Network.PolygonMainnet].includes(networkId)) {
                return userChainedSpeedMarketsData;
            }
            const { chainedSpeedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            if (chainedSpeedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getChainedSpeedMarketsAMMParameters(walletAddress);

                const pageSize = Math.min(ammParams.numMaturedMarketsPerUser, MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH);
                const index = Number(ammParams.numMaturedMarketsPerUser) - pageSize;
                const maturedMarkets = await chainedSpeedMarketsAMMContract.maturedMarketsPerUser(
                    index,
                    pageSize,
                    walletAddress
                );

                const promises = [];
                for (let i = 0; i < Math.ceil(maturedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = maturedMarkets.slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS);
                    promises.push(speedMarketsDataContract.getChainedMarketsData(batchMarkets));
                }
                const marketsDataArray = await Promise.all(promises);

                const userResolvedMarkets = marketsDataArray.flat().map((marketData: any, index: number) => ({
                    ...marketData,
                    market: maturedMarkets[index],
                }));

                for (let i = 0; i < userResolvedMarkets.length; i++) {
                    const marketData = userResolvedMarkets[i];

                    const sides = marketData.directions.map(
                        (direction: number) => OPTIONS_POSITIONS_MAP[SIDE[direction] as OptionSide] as Positions
                    );
                    const maturityDate = secondsToMilliseconds(Number(marketData.strikeTime));
                    const strikeTimes = Array(sides.length)
                        .fill(0)
                        .map((_, i) =>
                            secondsToMilliseconds(
                                Number(marketData.initialStrikeTime) + i * Number(marketData.timeFrame)
                            )
                        );
                    const strikePrices = strikeTimes.map((_, i) =>
                        marketData.strikePrices[i]
                            ? bigNumberFormatter(marketData.strikePrices[i], PYTH_CURRENCY_DECIMALS)
                            : 0
                    );
                    const finalPrices = strikeTimes.map((_, i) =>
                        marketData.finalPrices[i]
                            ? bigNumberFormatter(marketData.finalPrices[i], PYTH_CURRENCY_DECIMALS)
                            : 0
                    );
                    const buyinAmount = coinFormatter(marketData.buyinAmount, networkId);
                    const fee = bigNumberFormatter(marketData.safeBoxImpact);
                    const payout = buyinAmount * bigNumberFormatter(marketData.payoutMultiplier) ** sides.length;

                    const userData: ChainedSpeedMarket = {
                        address: marketData.market,
                        timestamp: secondsToMilliseconds(Number(marketData.createdAt)),
                        currencyKey: parseBytes32String(marketData.asset),
                        sides,
                        strikePrices,
                        strikeTimes,
                        maturityDate,
                        amount: payout,
                        paid: buyinAmount * (1 + fee),
                        finalPrices,
                        isOpen: false,
                        isMatured: true,
                        canResolve: false,
                        claimable: false,
                        isUserWinner: marketData.isUserWinner,
                        user: marketData.user,
                    };

                    userChainedSpeedMarketsData.push(userData);
                }
            }

            return userChainedSpeedMarketsData;
        },
        {
            ...options,
        }
    );
};

export default useUserActiveChainedSpeedMarketsDataQuery;
