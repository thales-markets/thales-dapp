import { ZERO_ADDRESS } from 'constants/network';
import { BigNumber, ethers } from 'ethers';
import { secondsToMinutes } from 'date-fns';

export const getTransactionForSpeedAMM = async (
    speedMarketsAMMContractWithSigner: any,
    isNonDefaultCollateral: boolean,
    asset: string,
    deltaTimeSec: number,
    strikeTimeSec: number,
    side: number,
    buyInAmount: BigNumber,
    pythPriceUpdateData: string[],
    pythUpdateFee: any,
    collateralAddress: string,
    referral: string | null
) => {
    let tx: ethers.ContractTransaction;
    const isEth = collateralAddress === ZERO_ADDRESS;

    if (isNonDefaultCollateral) {
        tx = deltaTimeSec
            ? await speedMarketsAMMContractWithSigner.createNewMarketWithDifferentCollateralAndDelta(
                  asset,
                  deltaTimeSec,
                  side,
                  pythPriceUpdateData,
                  collateralAddress,
                  buyInAmount,
                  isEth,
                  referral ? referral : ZERO_ADDRESS,
                  { value: isEth ? buyInAmount.add(pythUpdateFee) : pythUpdateFee }
              )
            : await speedMarketsAMMContractWithSigner.createNewMarketWithDifferentCollateral(
                  asset,
                  strikeTimeSec,
                  side,
                  pythPriceUpdateData,
                  collateralAddress,
                  buyInAmount,
                  isEth,
                  referral ? referral : ZERO_ADDRESS,
                  { value: isEth ? buyInAmount.add(pythUpdateFee) : pythUpdateFee }
              );
    } else {
        tx = deltaTimeSec
            ? await speedMarketsAMMContractWithSigner.createNewMarketWithDelta(
                  asset,
                  deltaTimeSec,
                  side,
                  buyInAmount,
                  pythPriceUpdateData,
                  referral ? referral : ZERO_ADDRESS,
                  { value: pythUpdateFee }
              )
            : await speedMarketsAMMContractWithSigner.createNewMarket(
                  asset,
                  strikeTimeSec,
                  side,
                  buyInAmount,
                  pythPriceUpdateData,
                  referral ? referral : ZERO_ADDRESS,
                  { value: pythUpdateFee }
              );
    }

    return tx;
};

// get dynamic LP fee based on time threshold and delta time to maturity
export const getFeeByTimeThreshold = (
    deltaTimeSec: number,
    timeThresholds: number[], // in minutes - ascending order
    fees: number[]
): number => {
    let index = -1;
    // iterate backwards and find index
    for (let i = timeThresholds.length - 1; i >= 0; i--) {
        if (secondsToMinutes(deltaTimeSec) >= timeThresholds[i]) {
            index = i;
            break;
        }
    }
    return index !== -1 ? fees[index] : 0;
};

// when fees are missing from contract (for old markets) get hardcoded history fees
export const getFeesFromHistory = (txTimestampMilis: number) => {
    let safeBoxImpact;
    let lpFee;

    if (txTimestampMilis < 1693039265000) {
        // Until Aug-26-2023 08:41:05 PM +UTC
        safeBoxImpact = 0.01;
        lpFee = 0.04;
    } else if (txTimestampMilis < 1696157435000) {
        // Until Oct-01-2023 10:50:35 AM +UTC
        safeBoxImpact = 0.02;
        lpFee = 0.04;
    } else {
        // latest before added to contract
        safeBoxImpact = 0.02;
        lpFee = 0.05;
    }
    return { safeBoxImpact, lpFee };
};
