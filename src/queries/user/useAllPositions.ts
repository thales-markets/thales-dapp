import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { HistoricalOptionsMarketInfo, OptionsTransaction, RangedMarket } from 'types/options';
import { UserPosition, UserPositionsData } from 'types/profile';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from 'utils/network';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import { POSITION_BALANCE_THRESHOLD, RANGE_SIDE, SIDE } from 'constants/options';
import { Positions } from 'enums/options';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { BigNumber, ethers } from 'ethers';
import { rangedPositionContract } from 'utils/contracts/rangedPositionContract';
import { binaryOptionPositionContract } from 'utils/contracts/binaryOptionsPositionContract';

const useAllPositions = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<UserPositionsData>) => {
    return useQuery<UserPositionsData>(
        QUERY_KEYS.User.AllPositions(walletAddress, networkId),
        async () => {
            const today = new Date();
            let claimableCount = 0;
            let claimableAmount = 0;

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

            const livePositions: UserPosition[] = [];
            const liveRangedPositions: UserPosition[] = [];
            const claimablePositions: UserPosition[] = [];
            const rangedClaimablePositions: UserPosition[] = [];
            const ripPositions: UserPosition[] = [];
            const rangedRipPositions: UserPosition[] = [];

            positionBalances.map((positionBalance: any) => {
                if (bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD) {
                    if (positionBalance.position.market.result === null) {
                        livePositions.push(positionBalance);
                    } else {
                        if (isOptionClaimable(positionBalance)) {
                            claimablePositions.push(positionBalance);
                        } else {
                            ripPositions.push(positionBalance);
                        }
                    }
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD) {
                    if (positionBalance.position.market.result === null) {
                        liveRangedPositions.push(positionBalance);
                    } else {
                        if (isOptionClaimable(positionBalance)) {
                            rangedClaimablePositions.push(positionBalance);
                        } else {
                            rangedRipPositions.push(positionBalance);
                        }
                    }
                }
            });

            const [livePositionsWithValue, liveRangedPositionsWithValue] = await Promise.all([
                Promise.all([
                    ...livePositions.map(async (positionBalance: any) => {
                        const positionContract = new ethers.Contract(
                            positionBalance.position.id,
                            binaryOptionPositionContract.abi,
                            snxJSConnector.provider
                        );
                        const contractPositionBalance = await positionContract.balanceOf(walletAddress);

                        const { ammContract } = snxJSConnector as any;
                        const ammQuote = await ammContract.sellToAmmQuote(
                            positionBalance.position.market.id,
                            SIDE[positionBalance.position.side],
                            positionBalance.amount
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: stableCoinFormatter(ammQuote, networkId),
                        };
                    }),
                ]),
                Promise.all([
                    ...liveRangedPositions.map(async (positionBalance: any) => {
                        const positionContract = new ethers.Contract(
                            positionBalance.position.id,
                            rangedPositionContract.abi,
                            snxJSConnector.provider
                        );
                        const contractPositionBalance = await positionContract.balanceOf(walletAddress);

                        const { rangedMarketAMMContract } = snxJSConnector as any;
                        const ammQuote = await rangedMarketAMMContract.sellToAmmQuote(
                            positionBalance.position.market.id,
                            RANGE_SIDE[positionBalance.position.side],
                            positionBalance.amount
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: stableCoinFormatter(ammQuote, networkId),
                        };
                    }),
                ]),
            ]);

            const modifiedLivePositions: UserPosition[] = [
                ...livePositionsWithValue.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: bigNumberFormatter(positionBalance.position.market.strikePrice),
                        leftPrice: 0,
                        rightPrice: 0,
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: positionBalance.value,
                        claimable: false,
                        claimed: false,
                        isRanged: false,
                    };
                }),
                ...liveRangedPositionsWithValue.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: 0,
                        leftPrice: bigNumberFormatter(positionBalance.position.market.leftPrice),
                        rightPrice: bigNumberFormatter(positionBalance.position.market.rightPrice),
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: positionBalance.value,
                        claimable: false,
                        claimed: false,
                        isRanged: true,
                    };
                }),
            ];

            const modifiedClaimablePositions: UserPosition[] = [
                ...claimablePositions.map((positionBalance: any) => {
                    claimableCount += 1;
                    claimableAmount += bigNumberFormatter(positionBalance.amount);
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: bigNumberFormatter(positionBalance.position.market.strikePrice),
                        leftPrice: 0,
                        rightPrice: 0,
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                        claimed: false,
                        isRanged: false,
                    };
                }),
                ...rangedClaimablePositions.map((positionBalance: any) => {
                    claimableCount += 1;
                    claimableAmount += bigNumberFormatter(positionBalance.amount);
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: 0,
                        leftPrice: bigNumberFormatter(positionBalance.position.market.leftPrice),
                        rightPrice: bigNumberFormatter(positionBalance.position.market.rightPrice),
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                        claimed: false,
                        isRanged: true,
                    };
                }),
            ];

            const modifiedRipPositions: UserPosition[] = [
                ...ripPositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
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
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
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

            const maxMaturity = Math.round(Number(today.getTime() / 1000));

            const [optionsMarkets, rangedMarkets] = await Promise.all([
                thalesData.binaryOptions.markets({
                    max: Infinity,
                    network: networkId,
                    maxMaturity,
                }),
                rangedMarketIds.length > 0
                    ? thalesData.binaryOptions.rangedMarkets({
                          max: Infinity,
                          network: networkId,
                          marketIds: rangedMarketIds,
                          maxMaturity,
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

            const result = {
                live: modifiedLivePositions,
                claimable: modifiedClaimablePositions,
                claimed: modifiedClaimedPositions,
                rip: modifiedRipPositions,
                claimableCount,
                claimableAmount,
            };

            return result;
        },
        options
    );
};

const isOptionClaimable = (balance: any) =>
    (balance.position.side === 'long' && balance.position.market.result === 0) ||
    (balance.position.side === 'short' && balance.position.market.result === 1) ||
    (balance.position.side === 'in' && balance.position.market.result === 0) ||
    (balance.position.side === 'out' && balance.position.market.result === 1);

export default useAllPositions;
