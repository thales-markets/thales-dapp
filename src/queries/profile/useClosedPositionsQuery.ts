import axios from 'axios';
import { generalConfig } from 'config/general';
import { MAX_MATURITY, MIN_MATURITY, POSITION_BALANCE_THRESHOLD } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { HistoricalOptionsMarketInfo, OptionsTransaction, RangedMarket } from 'types/options';
import { UserPosition } from 'types/profile';
import { isOptionClaimable } from 'utils/options';

const useClosedPositionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserPosition[]>
) => {
    return useQuery<UserPosition[]>(
        QUERY_KEYS.Profile.ClosedPositions(walletAddress, networkId),
        async () => {
            const [
                positionBalancesResponse,
                rangedPositionBalancesResponse,
                userMarketTransactionsResponse,
            ] = await Promise.all([
                axios.get(
                    `${generalConfig.API_URL}/${
                        API_ROUTES.PositionBalance
                    }/${networkId}?account=${walletAddress.toLowerCase()}`
                ),
                axios.get(
                    `${generalConfig.API_URL}/${
                        API_ROUTES.RangedPositionBalance
                    }/${networkId}?account=${walletAddress.toLowerCase()}`
                ),
                axios.get(
                    `${generalConfig.API_URL}/${
                        API_ROUTES.OptionTransactions
                    }/${networkId}?account=${walletAddress.toLowerCase()}`
                ),
            ]);

            const positionBalances = positionBalancesResponse?.data ? positionBalancesResponse.data : [];
            const rangedPositionBalances = rangedPositionBalancesResponse?.data
                ? rangedPositionBalancesResponse?.data
                : [];
            const userMarketTransactions = userMarketTransactionsResponse?.data
                ? userMarketTransactionsResponse?.data
                : [];

            const ripPositions: UserPosition[] = [];
            const rangedRipPositions: UserPosition[] = [];

            positionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    !isOptionClaimable(positionBalance)
                ) {
                    ripPositions.push(positionBalance);
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    !isOptionClaimable(positionBalance)
                ) {
                    rangedRipPositions.push(positionBalance);
                }
            });

            const modifiedRipPositions: UserPosition[] = [
                ...ripPositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: bigNumberFormatter(positionBalance.position.market.strikePrice),
                        leftPrice: 0,
                        rightPrice: 0,
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: 0,
                        claimable: false,
                        claimed: false,
                        isRanged: false,
                    };
                }),
                ...rangedRipPositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: 0,
                        leftPrice: bigNumberFormatter(positionBalance.position.market.leftPrice),
                        rightPrice: bigNumberFormatter(positionBalance.position.market.rightPrice),
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: 0,
                        claimable: false,
                        claimed: false,
                        isRanged: true,
                    };
                }),
            ];

            const filteredUserMarketTransactions = userMarketTransactions.filter(
                (tx: any) => tx.type !== 'mint' && tx.amount !== 0
            );

            const claimTransactionsMap = new Map();

            filteredUserMarketTransactions.map((tx: any) => {
                claimTransactionsMap.set(tx.market, tx);
            });
            const rangedMarketIds = filteredUserMarketTransactions.map((tx: any) => tx.market);

            const [optionsMarketsResponse, rangedMarketsResponse] = await Promise.all([
                axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.MarketsList}/${networkId}?min-maturity=${MIN_MATURITY}&max-maturity=${MAX_MATURITY}`
                ),
                rangedMarketIds.length > 0
                    ? axios.get(
                          `${generalConfig.API_URL}/${
                              API_ROUTES.RangeMarketsList
                          }/${networkId}?min-maturity=${MIN_MATURITY}&max-maturity=${MAX_MATURITY}&market-ids=${rangedMarketIds.join(
                              ','
                          )}`
                      )
                    : undefined,
            ]);

            const optionsMarkets = optionsMarketsResponse?.data ? optionsMarketsResponse?.data : [];
            const rangedMarkets =
                rangedMarketsResponse && rangedMarketsResponse?.data ? rangedMarketsResponse?.data : [];

            const claimedPositions = optionsMarkets
                .filter((market: HistoricalOptionsMarketInfo) => claimTransactionsMap.has(market.address))
                .map((market: HistoricalOptionsMarketInfo) => {
                    const claimTransaction: OptionsTransaction = claimTransactionsMap.get(market.address);
                    return {
                        positionAddress: '',
                        market: market.address,
                        currencyKey: market.currencyKey,
                        amount: Number(claimTransaction.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: 0,
                        maturityDate: market.maturityDate,
                        expiryDate: market.expiryDate,
                        strikePrice: market.strikePrice,
                        leftPrice: 0,
                        rightPrice: 0,
                        finalPrice: Number(market.finalPrice),
                        side: claimTransaction.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: 0,
                        claimable: false,
                        claimed: true,
                        isRanged: false,
                    };
                });

            const claimedRangedPositions = rangedMarkets
                .filter((market: RangedMarket) => claimTransactionsMap.has(market.address))
                .map((market: RangedMarket) => {
                    const claimTransaction: OptionsTransaction = claimTransactionsMap.get(market.address);
                    return {
                        positionAddress: '',
                        market: market.address,
                        currencyKey: market.currencyKey,
                        amount: Number(claimTransaction.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: 0,
                        maturityDate: market.maturityDate,
                        expiryDate: market.expiryDate,
                        strikePrice: 0,
                        leftPrice: market.leftPrice,
                        rightPrice: market.rightPrice,
                        finalPrice: market.finalPrice,
                        side: claimTransaction.side === 'in' ? Positions.IN : Positions.OUT,
                        value: 0,
                        claimable: false,
                        claimed: true,
                        isRanged: true,
                    };
                });

            const modifiedClaimedPositions: UserPosition[] = [...claimedPositions, ...claimedRangedPositions];

            return [...modifiedClaimedPositions, ...modifiedRipPositions];
        },
        options
    );
};

export default useClosedPositionsQuery;
