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
import { bigNumberFormatter, coinFormatter, roundNumberToDecimals } from 'thales-utils';
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
                    const batchMarkets = maturedMarkets
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
                    const payout =
                        buyinAmount *
                        roundNumberToDecimals(bigNumberFormatter(marketData.payoutMultiplier) ** sides.length, 8);

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

                    // Hot fix for one market when resolved with final price 0 and fetching data for that market is failing
                    if (
                        networkId === Network.OptimismMainnet &&
                        userData.address === '0x79F6f48410fC659a274c0A236e19e581373bf2f9'
                    ) {
                        userData.timestamp = 1702229901000;
                        userData.currencyKey = 'BTC';
                        userData.sides = [
                            Positions.UP,
                            Positions.UP,
                            Positions.UP,
                            Positions.UP,
                            Positions.UP,
                            Positions.UP,
                        ];
                        userData.strikePrices = [
                            43777.60099999,
                            43792.1044865,
                            43810.50455609,
                            43826.28766057,
                            43845.30362687,
                            43890.09284569,
                        ];
                        userData.finalPrices = [
                            43792.1044865,
                            43810.50455609,
                            43826.28766057,
                            43845.30362687,
                            43890.09284569,
                            43869.69322549,
                        ];
                        userData.strikeTimes = [
                            1702230501000,
                            1702231101000,
                            1702231701000,
                            1702232301000,
                            1702232901000,
                            1702233501000,
                        ];
                        userData.maturityDate = 1702233501000;
                        userData.amount = 5 * roundNumberToDecimals(1.9 ** 6, 8);
                        userData.paid = 5.1;
                        userData.isUserWinner = false;
                    }

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
