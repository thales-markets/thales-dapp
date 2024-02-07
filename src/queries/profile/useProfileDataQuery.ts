import { BATCH_NUMBER_OF_SPEED_MARKETS, SPEED_MARKETS_QUOTE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { hoursToMilliseconds, secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import thalesData from 'thales-data';
import { bigNumberFormatter, coinFormatter, roundNumberToDecimals } from 'thales-utils';
import { UserProfileData } from 'types/profile';
import { isOnlySpeedMarketsSupported } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { getFeesFromHistory } from 'utils/speedAmm';

const useProfileDataQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<UserProfileData>) => {
    return useQuery<UserProfileData>(
        QUERY_KEYS.Profile.Data(walletAddress, networkId),
        async () => {
            let [profit, volume, numberOfTrades, gain, investment] = [0, 0, 0, 0, 0];
            const {
                speedMarketsAMMContract,
                speedMarketsDataContract,
                chainedSpeedMarketsAMMContract,
            } = snxJSConnector;

            let userMarketTransactions = [],
                userTrades = [],
                speedAmmParams = [],
                chainedAmmParams = [];

            if (isOnlySpeedMarketsSupported(networkId)) {
                speedAmmParams = await speedMarketsDataContract?.getSpeedMarketsAMMParameters(walletAddress);
            } else {
                [userMarketTransactions, userTrades, speedAmmParams, chainedAmmParams] = await Promise.all([
                    thalesData.binaryOptions.optionTransactions({
                        account: walletAddress,
                        network: networkId,
                    }),
                    thalesData.binaryOptions.trades({
                        taker: walletAddress,
                        network: networkId,
                    }),
                    speedMarketsDataContract?.getSpeedMarketsAMMParameters(walletAddress),
                    speedMarketsDataContract?.getChainedSpeedMarketsAMMParameters(walletAddress),
                ]);
            }

            userMarketTransactions.map((tx: any) => {
                if (tx.type === 'mint') {
                    volume += tx.amount / 2;
                    profit -= tx.amount / 2;
                    investment += tx.amount / 2;
                } else {
                    profit += tx.amount;
                }
            });

            userTrades.map((tx: any) => {
                numberOfTrades += 1;

                if (tx.orderSide === 'sell') {
                    profit += tx.makerAmount;
                    volume += tx.makerAmount;
                } else {
                    profit -= tx.takerAmount;
                    investment += tx.takerAmount;
                    volume += tx.takerAmount;
                }
            });

            if (speedMarketsAMMContract && speedMarketsDataContract) {
                let activeSpeedMarkets = [],
                    maturedSpeedMarkets = [],
                    activeChainedSpeedMarkets = [],
                    maturedChainedSpeedMarkets = [];

                if (isOnlySpeedMarketsSupported(networkId)) {
                    [activeSpeedMarkets, maturedSpeedMarkets] = await Promise.all([
                        speedMarketsAMMContract.activeMarketsPerUser(
                            0,
                            speedAmmParams.numActiveMarketsPerUser,
                            walletAddress
                        ),
                        speedMarketsAMMContract.maturedMarketsPerUser(
                            0,
                            speedAmmParams.numMaturedMarketsPerUser,
                            walletAddress
                        ),
                    ]);
                } else if (chainedSpeedMarketsAMMContract) {
                    [
                        activeSpeedMarkets,
                        maturedSpeedMarkets,
                        activeChainedSpeedMarkets,
                        maturedChainedSpeedMarkets,
                    ] = await Promise.all([
                        speedMarketsAMMContract.activeMarketsPerUser(
                            0,
                            speedAmmParams.numActiveMarketsPerUser,
                            walletAddress
                        ),
                        speedMarketsAMMContract.maturedMarketsPerUser(
                            0,
                            speedAmmParams.numMaturedMarketsPerUser,
                            walletAddress
                        ),
                        chainedSpeedMarketsAMMContract.activeMarketsPerUser(
                            0,
                            chainedAmmParams.numActiveMarketsPerUser,
                            walletAddress
                        ),
                        chainedSpeedMarketsAMMContract.maturedMarketsPerUser(
                            0,
                            chainedAmmParams.numMaturedMarketsPerUser,
                            walletAddress
                        ),
                    ]);
                }

                const promises = [];
                if (activeSpeedMarkets.length) {
                    promises.push(speedMarketsDataContract.getMarketsData(activeSpeedMarkets));
                }
                if (!isOnlySpeedMarketsSupported(networkId)) {
                    // Chained speed markets active
                    promises.push(speedMarketsDataContract.getChainedMarketsData(activeChainedSpeedMarkets));

                    // Chained speed markets matured
                    for (
                        let i = 0;
                        i < Math.ceil(maturedChainedSpeedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS);
                        i++
                    ) {
                        const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                        const batchMarkets = maturedChainedSpeedMarkets
                            .slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS)
                            .map((market: string) => {
                                let marketAddresss;
                                // Hot fix for 2 markets when resolved with final price 0 and fetching data for that market is failing
                                if (
                                    networkId === Network.OptimismMainnet &&
                                    walletAddress === '0x5ef88d0a93e5773DB543bd421864504618A18de4' &&
                                    market === '0x79F6f48410fC659a274c0A236e19e581373bf2f9'
                                ) {
                                    // some other market address of this user
                                    marketAddresss = '0x6A01283c0F4579B55FB7214CaF619CFe72044b68';
                                } else if (
                                    networkId === Network.PolygonMainnet &&
                                    walletAddress === '0x8AAcec3D7077D04F19aC924d2743fc0DE1456941' &&
                                    market === '0x1e195Ea2ABf23C1A793F01c934692A230bb5Fc40'
                                ) {
                                    // some other market address of this user
                                    marketAddresss = '0x9c5e5c979dbcab721336ad3ed6eac76650f7eb2c';
                                } else {
                                    marketAddresss = market;
                                }

                                return marketAddresss;
                            });
                        promises.push(speedMarketsDataContract.getChainedMarketsData(batchMarkets));
                    }
                }

                // Speed markets matured
                for (let i = 0; i < Math.ceil(maturedSpeedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = maturedSpeedMarkets.slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS);
                    promises.push(speedMarketsDataContract.getMarketsData(batchMarkets));
                }

                const allSpeedMarkets = await Promise.all(promises);

                allSpeedMarkets.flat().forEach((marketData: any) => {
                    const isChained = !!marketData.directions;

                    const createdAt = !marketData.createdAt.isZero()
                        ? secondsToMilliseconds(Number(marketData.createdAt))
                        : secondsToMilliseconds(Number(marketData.strikeTime)) - hoursToMilliseconds(1);
                    const lpFee = isChained
                        ? 0
                        : !marketData.lpFee.isZero()
                        ? bigNumberFormatter(marketData.lpFee)
                        : getFeesFromHistory(createdAt).lpFee;
                    const safeBoxImpact = isChained
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : !marketData.safeBoxImpact.isZero()
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : getFeesFromHistory(createdAt).safeBoxImpact;
                    const fees = lpFee + safeBoxImpact;
                    const buyinAmount = coinFormatter(marketData.buyinAmount, networkId);
                    const paid = buyinAmount * (1 + fees);
                    const payout = isChained
                        ? roundNumberToDecimals(
                              buyinAmount *
                                  bigNumberFormatter(marketData.payoutMultiplier) ** marketData.directions.length,
                              8
                          )
                        : buyinAmount * SPEED_MARKETS_QUOTE;

                    if (marketData.isUserWinner) {
                        profit += payout - paid;
                    } else {
                        profit -= paid;
                    }
                    investment += paid;
                    volume += paid;
                });

                const numSpeedMarkets =
                    Number(speedAmmParams.numActiveMarketsPerUser) +
                    Number(speedAmmParams.numMaturedMarketsPerUser) +
                    (isOnlySpeedMarketsSupported(networkId)
                        ? 0
                        : Number(chainedAmmParams.numActiveMarketsPerUser) +
                          Number(chainedAmmParams.numMaturedMarketsPerUser));
                numberOfTrades += numSpeedMarkets;
            }

            gain = investment !== 0 ? profit / investment : 0;

            const result = {
                profit,
                volume,
                numberOfTrades,
                gain,
                investment,
            };

            return result;
        },
        options
    );
};

export default useProfileDataQuery;
