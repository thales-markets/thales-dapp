import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { OptionsMarkets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from 'utils/network';
import { ethers } from 'ethers';
import { buildOptionsMarketLink } from 'utils/routes';
import { stableCoinFormatter } from 'utils/formatters/ethers';

type PositionsData = {
    claimed: any[];
    claimable: number;
    claimableAmount: number;
    matured: any[];
    live: any[];
};

const useAllPositions = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<PositionsData>) => {
    return useQuery<PositionsData>(
        QUERY_KEYS.User.AllPositions(walletAddress, networkId),
        async () => {
            const matured: any[] = [];
            const live: any[] = [];

            let claimable = 0;
            let claimableAmount = 0;

            const positionBalances: any = await thalesData.binaryOptions.positionBalances({
                max: Infinity,
                network: networkId,
                account: walletAddress.toLowerCase(),
            });

            const livePosition = positionBalances.filter(
                (balance: any) => Number(balance.amount) > 0 && balance.position.market.result === null
            );

            await Promise.all(
                livePosition.map(async (balance: any) => {
                    try {
                        const positionValue = stableCoinFormatter(
                            await (snxJSConnector as any).ammContract.sellToAmmQuote(
                                balance.position.market.id,
                                balance.position.side === 'long' ? 0 : 1,
                                balance.amount
                            ),
                            networkId
                        );
                        live.push({
                            link: buildOptionsMarketLink(balance.position.market.id),
                            market: {
                                ...balance.position.market,
                                currencyKey: hexToAscii(balance.position.market.currencyKey),
                                maturityDate: Number(balance.position.market.maturityDate) * 1000,
                                expiryDate: Number(balance.position.market.expiryDate) * 1000,
                                strikePrice: balance.position.market.strikePrice / 1e18,
                            },
                            balances: {
                                amount: Number(ethers.utils.formatEther(balance.amount)),
                                value: Number(positionValue),
                                type: balance.position.side === 'long' ? 'UP' : 'DOWN',
                            },
                        });
                    } catch {}
                })
            );

            const maturedPositions = positionBalances.filter(
                (balance: any) => Number(balance.amount) > 0 && balance.position.market.result !== null
            );

            maturedPositions.map((balance: any) => {
                claimable = isOptionClaimable(balance) ? claimable + 1 : claimable;
                claimableAmount += isOptionClaimable(balance) ? Number(ethers.utils.formatEther(balance.amount)) : 0;
                matured.push({
                    link: buildOptionsMarketLink(balance.position.market.id),
                    market: {
                        ...balance.position.market,
                        currencyKey: hexToAscii(balance.position.market.currencyKey),
                        maturityDate: Number(balance.position.market.maturityDate) * 1000,
                        expiryDate: Number(balance.position.market.expiryDate) * 1000,
                        strikePrice: balance.position.market.strikePrice / 1e18,
                        finalPrice: balance.position.market.finalPrice / 1e18,
                    },
                    balances: {
                        amount: Number(ethers.utils.formatEther(balance.amount)),
                        type: balance.position.side === 'long' ? 'UP' : 'DOWN',
                    },
                    claimed: false,
                    claimable: isOptionClaimable(balance),
                });
            });

            const marketTx = await thalesData.binaryOptions.optionTransactions({
                account: walletAddress,
                network: networkId,
            });

            const txMap = new Map();

            marketTx.map((tx: any) => {
                if (tx.type !== 'mint' && tx.amount !== 0) {
                    txMap.set(tx.market, tx);
                }
            });

            const claimedMap = new Map();

            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });

            optionsMarkets
                .filter((market) => market.maturityDate <= +Date.now())
                .map((market) => {
                    if (txMap.has(market.address)) {
                        claimedMap.set(market.address, { market, tx: txMap.get(market.address) });
                    }
                });

            const result = {
                claimable,
                claimableAmount,
                claimed: Array.from(claimedMap.values()),
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

const isOptionClaimable = (balance: any) => {
    if (balance.position.side === 'long' && balance.position.market.result === 0) {
        return true;
    }
    if (balance.position.side === 'short' && balance.position.market.result === 1) {
        return true;
    }

    return false;
};

export default useAllPositions;
