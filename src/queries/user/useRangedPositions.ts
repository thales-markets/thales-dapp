import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from 'utils/network';
import { ethers } from 'ethers';
import { buildRangeMarketLink } from 'utils/routes';
import { RangedMarket } from 'types/options';
import { stableCoinFormatter } from 'utils/formatters/ethers';

type RangedPositionData = {
    claimable: number;
    claimableAmount: number;
    matured: any[];
    claimed: any[];
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

            const livePosition = rangedPositionBalances.filter(
                (balance: any) => Number(balance.amount) > 0 && balance.position.market.result === null
            );

            await Promise.all(
                livePosition.map(async (balance: any) => {
                    try {
                        const positionValue = stableCoinFormatter(
                            await (snxJSConnector as any).rangedMarketAMMContract.sellToAmmQuote(
                                balance.position.market.id,
                                balance.position.side === 'in' ? 0 : 1,
                                balance.amount
                            ),
                            networkId
                        );

                        live.push({
                            link: buildRangeMarketLink(balance.position.market.id),
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
                    } catch {}
                })
            );

            const maturedPositions = rangedPositionBalances.filter(
                (balance: any) => Number(balance.amount) > 0 && balance.position.market.result !== null
            );

            maturedPositions.map((balance: any) => {
                claimable = isOptionClaimable(balance) ? claimable + 1 : claimable;
                claimableAmount += isOptionClaimable(balance) ? Number(ethers.utils.formatEther(balance.amount)) : 0;
                matured.push({
                    link: buildRangeMarketLink(balance.position.market.id),
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
                    claimable: isOptionClaimable(balance),
                });
            });

            const marketTx = await thalesData.binaryOptions.optionTransactions({
                account: walletAddress,
                network: networkId,
            });
            const marketTxFiltered = marketTx.filter((tx: any) => tx.type !== 'mint' && tx.amount !== 0);

            const rangedMarketIds = marketTxFiltered.map((tx: any) => tx.market);
            const rangedMarkets: RangedMarket[] = await thalesData.binaryOptions.rangedMarkets({
                max: Infinity,
                network: networkId,
                marketIds: rangedMarketIds,
            });

            const claimed = rangedMarkets.map((rangedMarket) => {
                return {
                    market: rangedMarket,
                    tx: marketTxFiltered.find((tx: any) => tx.market === rangedMarket.address),
                };
            });

            return {
                claimable,
                claimableAmount,
                claimed,
                matured,
                live,
            };
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

const isOptionClaimable = (balance: any) => {
    if (balance.position.side === 'in' && balance.position.market.result === 0) {
        return true;
    }
    if (balance.position.side === 'out' && balance.position.market.result === 1) {
        return true;
    }

    return false;
};

export default useRangedPositions;
