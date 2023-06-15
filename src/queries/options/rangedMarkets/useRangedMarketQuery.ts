import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { RangedMarketData } from 'types/options';
import { ethers } from 'ethers';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { bigNumberFormatter, parseBytes32String } from 'utils/formatters/ethers';
import { RANGE_SIDE } from 'constants/options';
import { getPhaseAndEndDate } from 'utils/options';
import { getSynthAsset } from 'utils/currency';

const useRangedMarketQuery = (marketAddress: string, options?: UseQueryOptions<RangedMarketData | null>) => {
    return useQuery<RangedMarketData | null>(
        QUERY_KEYS.BinaryOptions.RangedMarket(marketAddress),
        async () => {
            try {
                const rangedMarket = new ethers.Contract(
                    marketAddress,
                    rangedMarketContract.abi,
                    (snxJSConnector as any).provider
                );

                const [leftMarketAddress, rightMarketAddress, positions, result, resolved] = await Promise.all([
                    rangedMarket.leftMarket(),
                    rangedMarket.rightMarket(),
                    rangedMarket.positions(),
                    rangedMarket.result(),
                    rangedMarket.resolved(),
                ]);

                const [
                    marketDataLeftMarket,
                    marketParametersLeftMarket,
                    marketParametersRightMarket,
                ] = await Promise.all([
                    (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketData(leftMarketAddress),
                    (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketParameters(leftMarketAddress),
                    (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketParameters(rightMarketAddress),
                ]);

                const { times } = marketParametersLeftMarket;
                const { oraclePriceAndTimestamp } = marketDataLeftMarket;

                const maturityDate = Number(times.maturity) * 1000;
                const expiryDate = Number(times.expiry) * 1000;

                const { phase, timeRemaining } = getPhaseAndEndDate(maturityDate, expiryDate);

                const currencyKey = parseBytes32String(marketParametersLeftMarket.oracleDetails.key);
                return {
                    isResolved: resolved,
                    address: marketAddress,
                    currencyKey,
                    asset: getSynthAsset(currencyKey),
                    currentPrice: bigNumberFormatter(oraclePriceAndTimestamp.price),
                    finalPrice: bigNumberFormatter(marketParametersLeftMarket.oracleDetails.finalPrice),
                    leftPrice: bigNumberFormatter(marketParametersLeftMarket.oracleDetails.strikePrice),
                    rightPrice: bigNumberFormatter(marketParametersRightMarket.oracleDetails.strikePrice),
                    maturityDate,
                    expiryDate,
                    phase,
                    result: RANGE_SIDE[result],
                    inAddress: positions.inp,
                    outAddress: positions.outp,
                    timeRemaining,
                    leftMarketAddress,
                    rightMarketAddress,
                } as RangedMarketData;
            } catch (e) {
                console.log('Error ', e);
                return null;
            }
        },
        {
            ...options,
        }
    );
};

export default useRangedMarketQuery;
