import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';
import { Positions } from 'constants/options';
import { ethers } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';

type UserLivePositions = {
    currencyKey: string;
    strikePrice: string;
    amount: number;
    maturityDate: number;
    market: string;
    side: Positions;
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
                return Number(positionBalance.position.market.maturityDate) > today.getTime() / 1000;
            });

            const liveRangedPositions = rangedPositionBalances.filter((positionBalance: any) => {
                return Number(positionBalance.position.market.maturityDate) > today.getTime() / 1000;
            });

            const modifiedLivePositions: UserLivePositions[] = [
                ...livePositions.map((positionBalance: any) => {
                    return {
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: Number(ethers.utils.formatEther(positionBalance.amount)),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            Number(ethers.utils.formatEther(positionBalance.position.market.strikePrice))
                        ),
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                    };
                }),
                ...liveRangedPositions.map((positionBalance: any) => {
                    return {
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: Number(ethers.utils.formatEther(positionBalance.amount)),
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
                    };
                }),
            ];
            return modifiedLivePositions;
        },
        options
    );
};

// const hexToAscii = (str: any) => {
//     const hex = str.toString();
//     let out = '';
//     for (let n = 2; n < hex.length; n += 2) {
//         const nextPair = hex.substr(n, 2);
//         if (nextPair !== '00') {
//             out += String.fromCharCode(parseInt(nextPair, 16));
//         }
//     }
//     return out;
// };

// const isOptionClaimable = (balance: any) => {
//     if (balance.position.side === 'long' && balance.position.market.result === 0) {
//         return true;
//     }
//     if (balance.position.side === 'short' && balance.position.market.result === 1) {
//         return true;
//     }

//     return false;
// };

export default useUserOpenPositions;
