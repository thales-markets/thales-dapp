import {
    BATCH_NUMBER_OF_SPEED_MARKETS,
    MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH,
    MIN_MATURITY,
    SIDE,
} from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter, parseBytes32String, roundNumberToDecimals } from 'thales-utils';
import { OptionSide, SpeedMarket } from 'types/options';
import { TradeWithMarket } from 'types/profile';
import snxJSConnector from 'utils/snxJSConnector';

const useUserChainedSpeedMarketsTransactionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<TradeWithMarket[]>
) => {
    return useQuery<TradeWithMarket[]>(
        QUERY_KEYS.BinaryOptions.UserChainedSpeedMarketsTransactions(networkId, walletAddress),
        async () => {
            const userTransactions: TradeWithMarket[] = [];

            const { chainedSpeedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            if (chainedSpeedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getChainedSpeedMarketsAMMParameters(walletAddress);

                const pageSize = Math.min(ammParams.numMaturedMarketsPerUser, MAX_NUMBER_OF_SPEED_MARKETS_TO_FETCH);
                const index = Number(ammParams.numMaturedMarketsPerUser) - pageSize;
                const [activeMarkets, maturedMarkets] = await Promise.all([
                    chainedSpeedMarketsAMMContract.activeMarketsPerUser(
                        0,
                        ammParams.numActiveMarketsPerUser,
                        walletAddress
                    ),
                    chainedSpeedMarketsAMMContract.maturedMarketsPerUser(index, pageSize, walletAddress),
                ]);
                const allMarkets: any[] = activeMarkets.concat(maturedMarkets);

                const promises = [];
                for (let i = 0; i < Math.ceil(allMarkets.length / BATCH_NUMBER_OF_SPEED_MARKETS); i++) {
                    const start = i * BATCH_NUMBER_OF_SPEED_MARKETS;
                    const batchMarkets = allMarkets
                        .slice(start, start + BATCH_NUMBER_OF_SPEED_MARKETS)
                        .map((market: string) =>
                            // Hot fix for one market when resolved with final price 0 and fetching data for that market is failing
                            networkId === Network.OptimismMainnet &&
                            walletAddress === '0x5ef88d0a93e5773DB543bd421864504618A18de4' &&
                            market === '0x79F6f48410fC659a274c0A236e19e581373bf2f9'
                                ? '0x6A01283c0F4579B55FB7214CaF619CFe72044b68' // some other market address of this user
                                : market
                        );
                    promises.push(speedMarketsDataContract.getChainedMarketsData(batchMarkets));
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

                    const maturityDate = secondsToMilliseconds(Number(marketData.strikeTime));
                    const sides = marketData.directions.map((direction: number) => SIDE[direction] as OptionSide);
                    const side = marketData.resolved ? sides[sides.length - 1] : sides[0];
                    const buyinAmount = coinFormatter(marketData.buyinAmount, networkId);
                    const payout =
                        buyinAmount *
                        roundNumberToDecimals(bigNumberFormatter(marketData.payoutMultiplier) ** sides.length, 8);
                    const createdAt = secondsToMilliseconds(Number(marketData.createdAt));
                    const safeBoxImpact = bigNumberFormatter(marketData.safeBoxImpact);

                    const strikePrice = marketData.resolved
                        ? bigNumberFormatter(
                              marketData.strikePrices[marketData.strikePrices.length - 1],
                              PYTH_CURRENCY_DECIMALS
                          )
                        : bigNumberFormatter(marketData.initialStrikePrice, PYTH_CURRENCY_DECIMALS);
                    const finalPrice = marketData.resolved
                        ? bigNumberFormatter(
                              marketData.finalPrices[marketData.finalPrices.length - 1],
                              PYTH_CURRENCY_DECIMALS
                          )
                        : 0;

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
                        takerAmount: buyinAmount * (1 + safeBoxImpact),
                        blockNumber: txBlockNumber,
                        market: marketData.market,
                        orderSide: 'buy',
                        optionSide: side,
                        marketItem: {
                            address: marketData.market,
                            timestamp: createdAt,
                            currencyKey: parseBytes32String(marketData.asset),
                            strikePrice,
                            maturityDate,
                            isOpen: !marketData.resolved,
                            result: marketData.resolved ? side : null,
                            finalPrice,
                            isSpeedMarket: true,
                            isChainedSpeedMarket: true,
                        } as SpeedMarket,
                    };

                    // Hot fix for one market when resolved with final price 0 and fetching data for that market is failing
                    if (
                        networkId === Network.OptimismMainnet &&
                        userData.marketItem.address === '0x79F6f48410fC659a274c0A236e19e581373bf2f9'
                    ) {
                        userData.timestamp = 1702229901000;
                        userData.makerAmount = 5 * roundNumberToDecimals(1.9 ** 6, 8);
                        userData.takerAmount = 5.1;
                        userData.optionSide = SIDE[0] as OptionSide;

                        userData.marketItem = {
                            address: userData.market,
                            timestamp: 1702229901000,
                            currencyKey: 'BTC',
                            strikePrice: 43890.09284569,
                            maturityDate: 1702233501000,
                            isOpen: false,
                            result: SIDE[0] as OptionSide,
                            finalPrice: 43869.69322549,
                            isSpeedMarket: true,
                            isChainedSpeedMarket: true,
                        } as SpeedMarket;
                    }

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

export default useUserChainedSpeedMarketsTransactionsQuery;
