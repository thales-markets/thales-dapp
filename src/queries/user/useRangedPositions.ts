import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import snxJSConnector from 'utils/snxJSConnector';
import { getIsPolygon, NetworkId } from 'utils/network';
import { ethers } from 'ethers';

type RangedPositionData = {
    claimable: number;
    claimableAmount: number;
    matured: any[];
    live: any[];
};

const useRangedPositions = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<RangedPositionData>
) => {
    return useQuery<RangedPositionData>(
        QUERY_KEYS.User.RangedPositions(walletAddress, networkId),
        async () => {
            const matured: any[] = [];
            const live: any[] = [];

            let claimable = 0;
            let claimableAmount = 0;

            const rangedPositionBalances: any = await thalesData.binaryOptions.rangedPositionBalances({
                max: Infinity,
                network: networkId,
                account: walletAddress.toLowerCase(),
            });

            console.log(rangedPositionBalances);

            const livePosition = rangedPositionBalances.filter(
                (balance: any) => Number(balance.amount) !== 0 && balance.position.market.result === null
            );

            await Promise.all(
                livePosition.map(async (balance: any) => {
                    let positionValue = '0';
                    try {
                        positionValue = ethers.utils.formatUnits(
                            await (snxJSConnector as any).rangedMarketAMMContract.sellToAmmQuote(
                                balance.position.market.id,
                                balance.position.side === 'in' ? 0 : 1,
                                balance.amount
                            ),
                            getIsPolygon(networkId) ? 6 : 18
                        );
                    } catch {}

                    live.push({
                        market: {
                            ...balance.position.market,
                            currencyKey: hexToAscii(balance.position.market.currencyKey),
                            maturityDate: Number(balance.position.market.maturityDate) * 1000,
                            expiryDate: Number(balance.position.market.expiryDate) * 1000,
                            leftPrice: balance.position.market.leftPrice / 1e18,
                            rightPrice: balance.position.market.rightPrice / 1e18,
                        },
                        balances: {
                            amount: Number(ethers.utils.formatEther(balance.amount)),
                            value: Number(positionValue),
                            type: balance.position.side === 'in' ? 'IN' : 'OUT',
                        },
                    });
                })
            );

            const claimablePosition = rangedPositionBalances.filter((balance: any) => {
                if (Number(balance.amount) !== 0 && balance.position.market.result !== null) {
                    if (balance.position.side === 'in' && balance.position.market.result === 0) {
                        return true;
                    }
                    if (balance.position.side === 'out' && balance.position.market.result === 1) {
                        return true;
                    }
                }
                return false;
            });

            claimablePosition.map((balance: any) => {
                claimable++;
                claimableAmount += Number(ethers.utils.formatEther(balance.amount));
                matured.push({
                    market: {
                        ...balance.position.market,
                        currencyKey: hexToAscii(balance.position.market.currencyKey),
                        maturityDate: Number(balance.position.market.maturityDate) * 1000,
                        expiryDate: Number(balance.position.market.expiryDate) * 1000,
                        finalPrice: balance.position.market.finalPrice / 1e18,
                        leftPrice: balance.position.market.leftPrice / 1e18,
                        rightPrice: balance.position.market.rightPrice / 1e18,
                    },
                    balances: {
                        amount: Number(ethers.utils.formatEther(balance.amount)),
                        type: balance.position.side === 'in' ? 'IN' : 'OUT',
                    },
                    claimed: false,
                    claimable: true,
                });
            });

            const result = {
                claimable,
                claimableAmount,
                matured,
                live,
            };

            return result;
        },
        options
    );
};

const hexToAscii = (str: any) => {
    const hex = str.toString();
    let out = '';
    for (let n = 2; n < hex.length; n += 2) {
        const nextPair = hex.substr(n, 2);
        if (nextPair !== '00') {
            out += String.fromCharCode(parseInt(nextPair, 16));
        }
    }
    return out;
};

export default useRangedPositions;
