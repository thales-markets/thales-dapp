import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { RANGE_SIDE } from 'constants/options';
import { ethers } from 'ethers';

export type RangeAmmMaxLimits = {
    in: {
        maxBuy: number;
        maxSell: number;
        buyPrice: number;
        sellPrice: number;
    };
    out: {
        maxBuy: number;
        maxSell: number;
        buyPrice: number;
        sellPrice: number;
    };
};

const useRangedAMMMaxLimitsQuery = (
    marketAddress: string,
    networkId: number,
    options?: UseQueryOptions<RangeAmmMaxLimits>
) => {
    return useQuery<RangeAmmMaxLimits>(
        QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress),
        async () => {
            const ammMaxLimits: RangeAmmMaxLimits = {
                in: {
                    maxBuy: 0,
                    maxSell: 0,
                    buyPrice: 0,
                    sellPrice: 0,
                },
                out: {
                    maxBuy: 0,
                    maxSell: 0,
                    buyPrice: 0,
                    sellPrice: 0,
                },
            };

            const ammContract = snxJSConnector.rangedMarketAMMContract;
            if (ammContract) {
                const parsedAmount = ethers.utils.parseEther('1');
                const [
                    maxBuyIn,
                    maxSellIn,
                    maxBuyOut,
                    maxSellOut,
                    buyInPrice,
                    buyOutPrice,
                    sellInPrice,
                    sellOutPrice,
                ] = await Promise.all([
                    ammContract.availableToBuyFromAMM(marketAddress, RANGE_SIDE['in']),
                    ammContract.availableToSellToAMM(marketAddress, RANGE_SIDE['in']),
                    ammContract.availableToBuyFromAMM(marketAddress, RANGE_SIDE['out']),
                    ammContract.availableToSellToAMM(marketAddress, RANGE_SIDE['out']),
                    ammContract.buyFromAmmQuote(marketAddress, RANGE_SIDE['in'], parsedAmount),
                    ammContract.buyFromAmmQuote(marketAddress, RANGE_SIDE['out'], parsedAmount),
                    ammContract.sellToAmmQuote(marketAddress, RANGE_SIDE['in'], parsedAmount),
                    ammContract.sellToAmmQuote(marketAddress, RANGE_SIDE['out'], parsedAmount),
                ]);

                ammMaxLimits.in.maxBuy =
                    stableCoinFormatter(buyInPrice, networkId) !== 0 ? bigNumberFormatter(maxBuyIn) : 0;
                ammMaxLimits.in.maxSell =
                    stableCoinFormatter(sellInPrice, networkId) !== 0 ? bigNumberFormatter(maxSellIn) : 0;
                ammMaxLimits.out.maxBuy =
                    stableCoinFormatter(buyOutPrice, networkId) !== 0 ? bigNumberFormatter(maxBuyOut) : 0;
                ammMaxLimits.out.maxSell =
                    stableCoinFormatter(sellOutPrice, networkId) !== 0 ? bigNumberFormatter(maxSellOut) : 0;
                ammMaxLimits.in.buyPrice = stableCoinFormatter(buyInPrice, networkId);
                ammMaxLimits.out.buyPrice = stableCoinFormatter(buyOutPrice, networkId);
                ammMaxLimits.in.sellPrice = stableCoinFormatter(sellInPrice, networkId);
                ammMaxLimits.out.sellPrice = stableCoinFormatter(sellOutPrice, networkId);
            }

            return ammMaxLimits;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useRangedAMMMaxLimitsQuery;
