import axios from 'axios';
import { generalConfig } from 'config/general';
import { POSITION_BALANCE_THRESHOLD, RANGE_SIDE, SIDE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { ethers } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { orderBy } from 'lodash';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { UserLivePositions } from 'types/options';
import { binaryOptionPositionContract } from 'utils/contracts/binaryOptionsPositionContract';
import { rangedPositionContract } from 'utils/contracts/rangedPositionContract';
import { formatStrikePrice } from 'utils/formatters/number';
import { getContractForInteraction, getMinMaturityDateForClaim, isOptionClaimable } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

const useUserLivePositionsQuery = (
    networkId: Network,
    walletAddress: string,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<UserLivePositions[]>
) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.User.OpenPositions(walletAddress, networkId, isDeprecatedCurrency),
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

            const openPositions: any = [];
            const openRangedPositions: any = [];
            const claimablePositions: any = [];
            const rangedClaimablePositions: any = [];

            const minMaturityDateForClaim = getMinMaturityDateForClaim();

            positionBalances.map((positionBalance: any) => {
                if (bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD) {
                    if (positionBalance.position.market.result === null) {
                        openPositions.push(positionBalance);
                    } else {
                        if (
                            isOptionClaimable(positionBalance) &&
                            positionBalance.position.market.maturityDate >= minMaturityDateForClaim
                        ) {
                            claimablePositions.push(positionBalance);
                        }
                    }
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD) {
                    if (positionBalance.position.market.result === null) {
                        openRangedPositions.push(positionBalance);
                    } else {
                        if (
                            isOptionClaimable(positionBalance) &&
                            positionBalance.position.market.maturityDate >= minMaturityDateForClaim
                        ) {
                            rangedClaimablePositions.push(positionBalance);
                        }
                    }
                }
            });

            const [result, resultsRanged] = await Promise.all([
                Promise.all([
                    ...openPositions.map(async (positionBalance: any) => {
                        /*
                            On subgraph there is an issue with plus function, so when user buy the same position several times, 
                            it sums up to value which is higher than it has on contract. Read position balance from contract!
                            example: 1st buy: 12.288200907691198
                                     2nd buy:  1.2302865754108085
                                sum on graph: 13.518487483102007
                             sum on contract: 13.5184874831020065
                        */
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
                            contractPositionBalance
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: coinFormatter(ammQuote, networkId),
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
                            contractPositionBalance
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: coinFormatter(ammQuote, networkId),
                        };
                    }),
                ]),
            ]);

            const modifiedLivePositions: UserLivePositions[] = [
                ...result.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(positionBalance.position.market.strikePrice),
                            positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN
                        ),
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: positionBalance.value,
                        claimable: false,
                    };
                }),
                ...claimablePositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(positionBalance.position.market.strikePrice),
                            positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN
                        ),
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                    };
                }),
                ...resultsRanged.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(positionBalance.position.market.leftPrice),
                            positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                            bigNumberFormatter(positionBalance.position.market.rightPrice)
                        ),
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: positionBalance.value,
                        claimable: false,
                    };
                }),
                ...rangedClaimablePositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(positionBalance.position.market.leftPrice),
                            positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                            bigNumberFormatter(positionBalance.position.market.rightPrice)
                        ),
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                    };
                }),
            ];
            return orderBy(modifiedLivePositions, ['maturityDate', 'currencyKey'], ['asc', 'asc']);
        },
        options
    );
};

export default useUserLivePositionsQuery;
