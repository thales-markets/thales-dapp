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

const useUserResolvedChainedSpeedMarketsDataQuery = (
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
                    const payout = roundNumberToDecimals(
                        buyinAmount * bigNumberFormatter(marketData.payoutMultiplier) ** sides.length,
                        8
                    );

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
                        payoutMultiplier: bigNumberFormatter(marketData.payoutMultiplier),
                        finalPrices,
                        isOpen: false,
                        isMatured: true,
                        canResolve: false,
                        claimable: false,
                        isUserWinner: marketData.isUserWinner,
                        user: marketData.user,
                    };

                    // Hot fix for 3 markets when resolved with final price 0 and fetching data for that market is failing
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
                        userData.amount = roundNumberToDecimals(5 * 1.9 ** 6, 8);
                        userData.paid = 5.1;
                        userData.isUserWinner = false;
                    } else if (
                        networkId === Network.PolygonMainnet &&
                        userData.address === '0x9C5e5C979DbCaB721336AD3eD6eac76650F7eB2C'
                    ) {
                        userData.finalPrices = [38830.08275709];
                    } else if (
                        networkId === Network.PolygonMainnet &&
                        userData.address === '0x1e195Ea2ABf23C1A793F01c934692A230bb5Fc40'
                    ) {
                        userData.timestamp = 1701461351000;
                        userData.currencyKey = 'BTC';
                        userData.sides = [
                            Positions.UP,
                            Positions.DOWN,
                            Positions.DOWN,
                            Positions.DOWN,
                            Positions.DOWN,
                            Positions.DOWN,
                        ];
                        userData.strikePrices = [38744.38018425, 38770.95500499];
                        userData.finalPrices = [38770.95500499, 38797.0925];
                        userData.strikeTimes = [
                            1701461951000,
                            1701462551000,
                            1701463151000,
                            1701463751000,
                            1701464351000,
                            1701464951000,
                        ];
                        userData.maturityDate = 1701464951000;
                        userData.amount = roundNumberToDecimals(5 * 1.9 ** 6, 8);
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

export default useUserResolvedChainedSpeedMarketsDataQuery;
