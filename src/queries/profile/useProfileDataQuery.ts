import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import thalesData from 'thales-data';
import { UserProfileData } from 'types/profile';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter, coinFormatter } from 'utils/formatters/ethers';
import { SPEED_MARKETS_QUOTE } from 'constants/options';

const useProfileDataQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<UserProfileData>) => {
    return useQuery<UserProfileData>(
        QUERY_KEYS.Profile.Data(walletAddress, networkId),
        async () => {
            let [profit, volume, numberOfTrades, gain, investment] = [0, 0, 0, 0, 0];

            const { speedMarketsAMMContract } = snxJSConnector;

            const [
                userMarketTransactions,
                userTrades,
                lpFee,
                safeBoxImpact,
                numActiveSpeedMarkets,
                numMaturedSpeedMarkets,
            ] = await Promise.all([
                thalesData.binaryOptions.optionTransactions({
                    account: walletAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    taker: walletAddress,
                    network: networkId,
                }),
                speedMarketsAMMContract?.lpFee(),
                speedMarketsAMMContract?.safeBoxImpact(),
                speedMarketsAMMContract?.numActiveMarketsPerUser(walletAddress) || Promise.resolve(0),
                speedMarketsAMMContract?.numMaturedMarketsPerUser(walletAddress) || Promise.resolve(0),
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

            if (speedMarketsAMMContract) {
                const [activeSpeedMarkets, maturedSpeedMarkets] = await Promise.all([
                    speedMarketsAMMContract.activeMarketsPerUser(0, numActiveSpeedMarkets, walletAddress),
                    speedMarketsAMMContract.maturedMarketsPerUser(0, numMaturedSpeedMarkets, walletAddress),
                ]);
                const [activeSpeedMarketsData, maturedSpeedMarketsData] = await Promise.all([
                    speedMarketsAMMContract.getMarketsData(activeSpeedMarkets),
                    speedMarketsAMMContract.getMarketsData(maturedSpeedMarkets),
                ]);

                const fees = bigNumberFormatter(lpFee) + bigNumberFormatter(safeBoxImpact);

                activeSpeedMarketsData.concat(maturedSpeedMarketsData).forEach((marketData: any) => {
                    const paid = coinFormatter(marketData.buyinAmount, networkId) * (1 + fees);
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;
                    if (marketData.isUserWinner) {
                        profit += payout;
                    } else {
                        profit -= paid;
                    }
                    investment += paid;
                    volume += paid;
                });

                const numSpeedMarkets = Number(numActiveSpeedMarkets) + Number(numMaturedSpeedMarkets);
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
