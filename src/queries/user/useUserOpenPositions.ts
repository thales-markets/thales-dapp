import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';
import { Positions, RANGE_SIDE, SIDE } from 'constants/options';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { stableCoinFormatter } from 'utils/formatters/ethers';
import { orderBy } from 'lodash';
import { rangedPositionContract } from 'utils/contracts/rangedPositionContract';
import { binaryOptionPositionContract } from 'utils/contracts/binaryOptionsPositionContract';

export type UserLivePositions = {
    currencyKey: string;
    strikePrice: string;
    amount: number;
    maturityDate: number;
    market: string;
    side: Positions;
    paid: number;
    value: number;
};

const useUserOpenPositions = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<UserLivePositions[]>
) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.User.UserOpenPositions(walletAddress, networkId),
        async () => {
            const today = new Date();

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
                    // maturityDate: tomorrow,
                }),
            ]);

            const livePositions = positionBalances.filter((positionBalance: any) => {
                return (
                    Number(positionBalance.position.market.maturityDate) > today.getTime() / 1000 &&
                    Number(ethers.utils.formatEther(positionBalance.amount)) > 0
                );
            });

            const liveRangedPositions = rangedPositionBalances.filter((positionBalance: any) => {
                return (
                    Number(positionBalance.position.market.maturityDate) > today.getTime() / 1000 &&
                    Number(ethers.utils.formatEther(positionBalance.amount)) > 0
                );
            });

            const [result, resultsRanged] = await Promise.all([
                Promise.all([
                    ...livePositions.map(async (positionBalance: any) => {
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

                        const { ammContract } = snxJSConnector as any;
                        const ammQuote = await ammContract.sellToAmmQuote(
                            positionBalance.position.market.id,
                            SIDE[positionBalance.position.side],
                            contractPositionBalance
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
                            contractPositionBalance
                        );

                        return {
                            ...positionBalance,
                            amount: contractPositionBalance,
                            value: stableCoinFormatter(ammQuote, networkId),
                        };
                    }),
                ]),
            ]);

            const modifiedLivePositions: UserLivePositions[] = [
                ...result.map((positionBalance: any) => {
                    return {
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: Number(ethers.utils.formatEther(positionBalance.amount)),
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            Number(ethers.utils.formatEther(positionBalance.position.market.strikePrice))
                        ),
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: positionBalance.value,
                    };
                }),
                ...resultsRanged.map((positionBalance: any) => {
                    return {
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: Number(ethers.utils.formatEther(positionBalance.amount)),
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice:
                            formatCurrencyWithSign(
                                USD_SIGN,
                                Number(ethers.utils.formatEther(positionBalance.position.market.leftPrice))
                            ) +
                            ' - ' +
                            formatCurrencyWithSign(
                                USD_SIGN,
                                Number(ethers.utils.formatEther(positionBalance.position.market.rightPrice))
                            ),
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: positionBalance.value,
                    };
                }),
            ];
            return orderBy(modifiedLivePositions, ['maturityDate', 'currencyKey'], ['asc', 'asc']);
        },
        options
    );
};

export default useUserOpenPositions;
