import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { UserPosition } from 'types/profile';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from 'utils/network';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import { POSITION_BALANCE_THRESHOLD, RANGE_SIDE, SIDE } from 'constants/options';
import { Positions } from 'enums/options';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { ethers } from 'ethers';
import { rangedPositionContract } from 'utils/contracts/rangedPositionContract';
import { binaryOptionPositionContract } from 'utils/contracts/binaryOptionsPositionContract';
import { orderBy } from 'lodash';

const useOpenPositionsQuery = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<UserPosition[]>
) => {
    return useQuery<UserPosition[]>(
        QUERY_KEYS.Profile.OpenPositions(walletAddress, networkId),
        async () => {
            const [positionBalances, rangedPositionBalances] = await Promise.all([
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
            ]);

            const openPositions: UserPosition[] = [];
            const openRangedPositions: UserPosition[] = [];

            positionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result === null
                ) {
                    openPositions.push(positionBalance);
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result === null
                ) {
                    openRangedPositions.push(positionBalance);
                }
            });

            const [openPositionsWithValue, openRangedPositionsWithValue] = await Promise.all([
                Promise.all([
                    ...openPositions.map(async (positionBalance: any) => {
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
                    ...openRangedPositions.map(async (positionBalance: any) => {
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

            const modifiedOpenPositions: UserPosition[] = [
                ...openPositionsWithValue.map((positionBalance: any) => {
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
                ...openRangedPositionsWithValue.map((positionBalance: any) => {
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

            return orderBy(modifiedOpenPositions, ['maturityDate', 'value'], ['asc', 'desc']);
        },
        options
    );
};

export default useOpenPositionsQuery;
