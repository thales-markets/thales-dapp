import axios from 'axios';
import { generalConfig } from 'config/general';
import { POSITION_BALANCE_THRESHOLD, RANGE_SIDE, SIDE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { ethers } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { UserPosition } from 'types/profile';
import { binaryOptionPositionContract } from 'utils/contracts/binaryOptionsPositionContract';
import { rangedPositionContract } from 'utils/contracts/rangedPositionContract';
import snxJSConnector from 'utils/snxJSConnector';
import { getContractForInteraction, getIsDeprecatedCurrency } from '../../utils/options';

const useOpenPositionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserPosition[]>
) => {
    return useQuery<UserPosition[]>(
        QUERY_KEYS.Profile.OpenPositions(walletAddress, networkId),
        async () => {
            const [positionBalancesResponse, rangedPositionBalancesResponse] = await Promise.all([
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
            ]);

            const positionBalances = positionBalancesResponse?.data ? positionBalancesResponse.data : [];
            const rangedPositionBalances = rangedPositionBalancesResponse?.data
                ? rangedPositionBalancesResponse.data
                : [];

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
                        const isDeprecatedCurrency = getIsDeprecatedCurrency(
                            networkId,
                            positionBalance.position.market.managerAddress
                        );

                        const positionContract = new ethers.Contract(
                            positionBalance.position.id,
                            binaryOptionPositionContract.abi,
                            snxJSConnector.provider
                        );
                        const contractPositionBalance = await positionContract.balanceOf(walletAddress);

                        const { ammContract, ammUSDCContract } = snxJSConnector;
                        const ammContractForInteraction = getContractForInteraction(
                            networkId,
                            isDeprecatedCurrency,
                            ammContract,
                            ammUSDCContract
                        );
                        const ammQuote = await ammContractForInteraction?.sellToAmmQuote(
                            positionBalance.position.market.id,
                            SIDE[positionBalance.position.side],
                            positionBalance.amount
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: coinFormatter(ammQuote, networkId, undefined, isDeprecatedCurrency),
                        };
                    }),
                ]),
                Promise.all([
                    ...openRangedPositions.map(async (positionBalance: any) => {
                        const isDeprecatedCurrency = getIsDeprecatedCurrency(
                            networkId,
                            positionBalance.position.market.managerAddress
                        );

                        const positionContract = new ethers.Contract(
                            positionBalance.position.id,
                            rangedPositionContract.abi,
                            snxJSConnector.provider
                        );
                        const contractPositionBalance = await positionContract.balanceOf(walletAddress);

                        const { rangedMarketAMMContract, rangedMarketsAMMUSDCContract } = snxJSConnector;
                        const rangedMarketAMMContractForInteraction = getContractForInteraction(
                            networkId,
                            isDeprecatedCurrency,
                            rangedMarketAMMContract,
                            rangedMarketsAMMUSDCContract
                        );
                        const ammQuote = await rangedMarketAMMContractForInteraction?.sellToAmmQuote(
                            positionBalance.position.market.id,
                            RANGE_SIDE[positionBalance.position.side],
                            positionBalance.amount
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: coinFormatter(ammQuote, networkId, undefined, isDeprecatedCurrency),
                        };
                    }),
                ]),
            ]);

            const modifiedOpenPositions: UserPosition[] = [
                ...openPositionsWithValue.map((positionBalance: any) => {
                    const isDeprecatedCurrency = getIsDeprecatedCurrency(
                        networkId,
                        positionBalance.position.market.managerAddress
                    );
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: coinFormatter(positionBalance.paid, networkId, undefined, isDeprecatedCurrency),
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
                        isDeprecatedCurrency,
                    };
                }),
                ...openRangedPositionsWithValue.map((positionBalance: any) => {
                    const isDeprecatedCurrency = getIsDeprecatedCurrency(
                        networkId,
                        positionBalance.position.market.managerAddress
                    );
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: coinFormatter(positionBalance.paid, networkId, undefined, isDeprecatedCurrency),
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
                        isDeprecatedCurrency,
                    };
                }),
            ];

            return modifiedOpenPositions;
        },
        options
    );
};

export default useOpenPositionsQuery;
