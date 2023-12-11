import { BATCH_NUMBER_OF_SPEED_MARKETS, SPEED_MARKETS_QUOTE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { hoursToMilliseconds, secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import { UserProfileData } from 'types/profile';
import { bigNumberFormatter, coinFormatter, roundNumberToDecimals } from 'thales-utils';
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

            const [userMarketTransactions, userTrades, speedAmmParams, chainedAmmParams] = await Promise.all([
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

            if (speedMarketsAMMContract && speedMarketsDataContract && chainedSpeedMarketsAMMContract) {
                const [
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

                const promises = [
                    speedMarketsDataContract.getMarketsData(activeSpeedMarkets),
                    speedMarketsDataContract.getChainedMarketsData(activeChainedSpeedMarkets),
                ];
                // Speed markets
                for (let i = 0; i < Math.ceil(maturedSpeedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = maturedSpeedMarkets.slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS);
                    promises.push(speedMarketsDataContract.getMarketsData(batchMarkets));
                }
                // Chained speed markets
                for (let i = 0; i < Math.ceil(maturedChainedSpeedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = maturedChainedSpeedMarkets
                        .slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS)
                        .map((market: string) =>
                            // Hot fix for one market when resolved with final price 0 and fetching data for that market is failing
                            networkId === Network.OptimismMainnet &&
                            walletAddress === '0x5ef88d0a93e5773DB543bd421864504618A18de4' &&
                            market === '0x79F6f48410fC659a274c0A236e19e581373bf2f9'
                                ? '0x6A01283c0F4579B55FB7214CaF619CFe72044b68' // some other market address of this user identical with required data
                                : market
                        );
                    promises.push(speedMarketsDataContract.getChainedMarketsData(batchMarkets));
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
                    const payout =
                        buyinAmount *
                        (isChained
                            ? roundNumberToDecimals(
                                  bigNumberFormatter(marketData.payoutMultiplier) ** marketData.directions.length,
                                  8
                              )
                            : SPEED_MARKETS_QUOTE);

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
                    Number(chainedAmmParams.numActiveMarketsPerUser) +
                    Number(chainedAmmParams.numMaturedMarketsPerUser);
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
