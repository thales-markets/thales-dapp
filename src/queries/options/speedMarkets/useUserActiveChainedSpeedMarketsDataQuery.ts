import { OPTIONS_POSITIONS_MAP, SIDE } from 'constants/options';
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
        QUERY_KEYS.BinaryOptions.UserChainedSpeedMarkets(networkId, walletAddress),
        async () => {
            const userChainedSpeedMarketsData: ChainedSpeedMarket[] = [];
            // TODO: remove after contarct deploy on all chains
            if ([Network.Arbitrum, Network.OptimismMainnet, Network.PolygonMainnet].includes(networkId)) {
                return userChainedSpeedMarketsData;
            }
            const { chainedSpeedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            if (chainedSpeedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getChainedSpeedMarketsAMMParameters(walletAddress);

                const activeMarkets = await chainedSpeedMarketsAMMContract.activeMarketsPerUser(
                    0,
                    ammParams.numActiveMarketsPerUser,
                    walletAddress
                );
                const marketsDataArray = await speedMarketsDataContract.getChainedMarketsData(activeMarkets);
                const userActiveMarkets = marketsDataArray.map((marketData: any, index: number) => ({
                    ...marketData,
                    market: activeMarkets[index],
                }));

                for (let i = 0; i < userActiveMarkets.length; i++) {
                    const marketData = userActiveMarkets[i];

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
                    const strikePrices = Array(sides.length).fill(0);
                    strikePrices[0] = bigNumberFormatter(marketData.initialStrikePrice, PYTH_CURRENCY_DECIMALS);
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
                        finalPrices: Array(sides.length).fill(0),
                        isOpen: true,
                        isMatured: maturityDate < Date.now(),
                        canResolve: false,
                        claimable: false,
                        isUserWinner: false,
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
