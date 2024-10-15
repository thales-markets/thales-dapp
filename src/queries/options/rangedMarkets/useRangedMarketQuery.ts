import { RANGE_SIDE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter, parseBytes32String } from 'thales-utils';
import { RangedMarketData } from 'types/options';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { getSynthAsset } from 'utils/currency';
import { getContractForInteraction, getPhaseAndEndDate } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

const useRangedMarketQuery = (
    marketAddress: string,
    networkId: number,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<RangedMarketData | null>
) => {
    return useQuery<RangedMarketData | null>(
        QUERY_KEYS.BinaryOptions.RangedMarket(marketAddress, isDeprecatedCurrency),
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

                const { binaryOptionsMarketDataContract, binaryOptionsMarketDataUSDCContract } = snxJSConnector;
                const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                    networkId,
                    isDeprecatedCurrency,
                    binaryOptionsMarketDataContract,
                    binaryOptionsMarketDataUSDCContract
                );

                const [
                    marketDataLeftMarket,
                    marketParametersLeftMarket,
                    marketParametersRightMarket,
                ] = await Promise.all([
                    binaryOptionsMarketDataContractForInteraction?.getMarketData(leftMarketAddress),
                    binaryOptionsMarketDataContractForInteraction?.getMarketParameters(leftMarketAddress),
                    binaryOptionsMarketDataContractForInteraction?.getMarketParameters(rightMarketAddress),
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
