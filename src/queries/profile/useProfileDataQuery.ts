import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import thalesData from 'thales-data';
import { UserProfileData } from 'types/profile';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter, coinFormatter } from 'utils/formatters/ethers';
import { RANGE_SIDE, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';

const useProfileDataQuery = (
    networkId: Network,
    walletAddress: string,
    claimableSpeedMarkets: string[],
    options?: UseQueryOptions<UserProfileData>
) => {
    return useQuery<UserProfileData>(
        QUERY_KEYS.Profile.Data(walletAddress, networkId),
        async () => {
            let [profit, volume, numberOfTrades, gain, investment] = [0, 0, 0, 0, 0];

            const { speedMarketsAMMContract } = snxJSConnector;

            const [
                positionBalances,
                rangedPositionBalances,
                userTrades,
                lpFee,
                safeBoxImpact,
                numActiveSpeedMarkets,
                numMaturedSpeedMarkets,
            ] = await Promise.all([
                thalesData.binaryOptions.positionBalances({
                    max: Infinity,
                    network: networkId,
                    account: walletAddress.toLowerCase(),
                }),
                thalesData.binaryOptions.rangedPositionBalances({
                    max: Infinity,
                    network: networkId,
                    account: walletAddress.toLowerCase(),
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

            const resolvedUserDirectionalMarkets = positionBalances
                .filter((positionBalance: any) => positionBalance.position.market.result !== null)
                .map((positionBalance: any) => {
                    const isUserWinner = positionBalance.position.side === SIDE[positionBalance.position.market.result];
                    return { market: positionBalance.position.market.id, isUserWinner };
                });
            const resolvedUserRangedMarkets = rangedPositionBalances
                .filter((positionBalance: any) => positionBalance.position.market.result !== null)
                .map((positionBalance: any) => {
                    const isUserWinner =
                        positionBalance.position.side === RANGE_SIDE[positionBalance.position.market.result];
                    return { market: positionBalance.position.market.id, isUserWinner };
                });
            const resolvedUserMarkets: {
                market: string;
                isUserWinner: boolean;
            }[] = resolvedUserDirectionalMarkets.concat(resolvedUserRangedMarkets);

            userTrades.map((tx: any) => {
                numberOfTrades += 1;

                const resolvedMarket = resolvedUserMarkets.find(
                    (resolvedMarket) => resolvedMarket.market === tx.market
                );

                // Calculate only resolved markets for profit
                if (resolvedMarket) {
                    if (tx.orderSide === 'sell') {
                        // if user is winner buy will take whole amount which needs to be decreased by sold amount
                        profit = resolvedMarket.isUserWinner ? profit - tx.takerAmount : profit + tx.makerAmount;
                    } else {
                        // buy
                        profit = profit - tx.takerAmount + (resolvedMarket.isUserWinner ? tx.makerAmount : 0);
                        investment += tx.takerAmount;
                    }
                }
                volume += tx.takerAmount;
            });

            // When there are sells and markets are unresolved calculate: profit = totalSell - totalBuyForSoldAmount
            const uniqueUnresolvedMarketsWithSell: any[] = userTrades
                .filter((tx: any) => {
                    const resolvedMarket = resolvedUserMarkets.find(
                        (resolvedMarket) => resolvedMarket.market === tx.market
                    );

                    return !resolvedMarket && tx.orderSide === 'sell';
                })
                .map((tx: any) => tx.market)
                .filter((item: string, index: number, self: string[]) => self.indexOf(item) === index);

            uniqueUnresolvedMarketsWithSell.forEach((market: string) => {
                // calculate spent on buy for sold amount
                const { totalBuyAmount, totalBuySpent, totalSellAmount, totalSellSpent } = userTrades
                    .filter((trade: any) => trade.market === market)
                    .reduce(
                        (acc: any, obj: any) => {
                            if (obj.orderSide === 'buy') {
                                acc.totalBuyAmount += obj.makerAmount;
                                acc.totalBuySpent += obj.takerAmount;
                            } else {
                                acc.totalSellAmount += obj.takerAmount;
                                acc.totalSellSpent += obj.makerAmount;
                            }
                            return acc;
                        },
                        { totalBuyAmount: 0, totalBuySpent: 0, totalSellAmount: 0, totalSellSpent: 0 }
                    );
                const buySpentForSoldAmount = (totalBuySpent / totalBuyAmount) * totalSellAmount;

                profit += totalSellSpent - buySpentForSoldAmount;
            });

            // Speed Markets
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

                activeSpeedMarketsData.forEach((marketData: any, index: number) => {
                    const paid = coinFormatter(marketData.buyinAmount, networkId) * (1 + fees);
                    // can be matured but still not resolved
                    if (Number(marketData.strikeTime) < Date.now()) {
                        if (claimableSpeedMarkets.includes(activeSpeedMarkets[index])) {
                            const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;
                            profit += payout - paid;
                        } else {
                            profit -= paid;
                        }
                        investment += paid;
                    }
                    volume += paid;
                });
                maturedSpeedMarketsData.forEach((marketData: any) => {
                    const paid = coinFormatter(marketData.buyinAmount, networkId) * (1 + fees);
                    if (marketData.resolved) {
                        if (marketData.isUserWinner) {
                            const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;
                            profit += payout - paid;
                        } else {
                            profit -= paid;
                        }
                        investment += paid;
                    }
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
