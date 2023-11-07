import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { HistoricalOptionsMarketInfo, OptionsTransaction, RangedMarket } from 'types/options';
import { UserPosition } from 'types/profile';
import { Network } from 'enums/network';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { MAX_MATURITY, MIN_MATURITY, POSITION_BALANCE_THRESHOLD } from 'constants/options';
import { Positions } from 'enums/options';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { isOptionClaimable } from 'utils/options';

const useClosedPositionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserPosition[]>
) => {
    return useQuery<UserPosition[]>(
        QUERY_KEYS.Profile.ClosedPositions(walletAddress, networkId),
        async () => {
            const [positionBalances, rangedPositionBalances, userMarketTransactions] = await Promise.all([
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
                thalesData.binaryOptions.optionTransactions({
                    account: walletAddress,
                    network: networkId,
                }),
            ]);

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
                        isSpeedMarket: false,
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
                        isSpeedMarket: false,
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

            const [optionsMarkets, rangedMarkets] = await Promise.all([
                thalesData.binaryOptions.markets({
                    max: Infinity,
                    network: networkId,
                    minMaturity: MIN_MATURITY,
                    maxMaturity: MAX_MATURITY,
                }),
                rangedMarketIds.length > 0
                    ? thalesData.binaryOptions.rangedMarkets({
                          max: Infinity,
                          network: networkId,
                          marketIds: rangedMarketIds,
                          minMaturity: MIN_MATURITY,
                          maxMaturity: MAX_MATURITY,
                      })
                    : [],
            ]);

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
