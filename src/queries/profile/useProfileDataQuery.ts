import { BATCH_NUMBER_OF_SPEED_MARKETS, SPEED_MARKETS_QUOTE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import { UserProfileData } from 'types/profile';
import { bigNumberFormatter, coinFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { getFeesFromHistory } from 'utils/speedAmm';

const useProfileDataQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<UserProfileData>) => {
    return useQuery<UserProfileData>(
        QUERY_KEYS.Profile.Data(walletAddress, networkId),
        async () => {
            let [profit, volume, numberOfTrades, gain, investment] = [0, 0, 0, 0, 0];

            const { speedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            const [userMarketTransactions, userTrades, ammParams] = await Promise.all([
                thalesData.binaryOptions.optionTransactions({
                    account: walletAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    taker: walletAddress,
                    network: networkId,
                }),
                speedMarketsDataContract?.getSpeedMarketsAMMParameters(walletAddress),
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

            if (speedMarketsAMMContract && speedMarketsDataContract) {
                const [activeSpeedMarkets, maturedSpeedMarkets] = await Promise.all([
                    speedMarketsAMMContract.activeMarketsPerUser(0, ammParams.numActiveMarketsPerUser, walletAddress),
                    speedMarketsAMMContract.maturedMarketsPerUser(0, ammParams.numMaturedMarketsPerUser, walletAddress),
                ]);

                const promises = [speedMarketsDataContract.getMarketsData(activeSpeedMarkets)];
                for (let i = 0; i < Math.ceil(maturedSpeedMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = maturedSpeedMarkets.slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS);
                    promises.push(speedMarketsDataContract.getMarketsData(batchMarkets));
                }
                const allSpeedMarkets = await Promise.all(promises);

                allSpeedMarkets.flat().forEach((marketData: any) => {
                    const createdAt = !marketData.createdAt.isZero()
                        ? secondsToMilliseconds(Number(marketData.createdAt))
                        : secondsToMilliseconds(Number(marketData.strikeTime));
                    const lpFee = !marketData.lpFee.isZero()
                        ? bigNumberFormatter(marketData.lpFee)
                        : getFeesFromHistory(createdAt).lpFee;
                    const safeBoxImpact = !marketData.safeBoxImpact.isZero()
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : getFeesFromHistory(createdAt).safeBoxImpact;
                    const fees = lpFee + safeBoxImpact;
                    const paid = coinFormatter(marketData.buyinAmount, networkId) * (1 + fees);
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;
                    if (marketData.isUserWinner) {
                        profit += payout - paid;
                    } else {
                        profit -= paid;
                    }
                    investment += paid;
                    volume += paid;
                });

                const numSpeedMarkets =
                    Number(ammParams.numActiveMarketsPerUser) + Number(ammParams.numMaturedMarketsPerUser);
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
