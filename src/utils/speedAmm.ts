import { ZERO_ADDRESS } from 'constants/network';
import { BigNumber, ethers } from 'ethers';
import { secondsToMinutes } from 'date-fns';
import { ChainedSpeedMarket } from 'types/options';
import { Positions } from 'enums/options';
import { executeBiconomyTransaction } from './biconomy';

export const getTransactionForSpeedAMM = async (
    speedMarketsAMMContractWithSigner: any, // speed or chained
    isNonDefaultCollateral: boolean,
    asset: string,
    deltaTimeSec: number,
    strikeTimeSec: number,
    sides: number[],
    buyInAmount: BigNumber,
    pythPriceUpdateData: string[],
    pythUpdateFee: any,
    collateralAddress: string,
    referral: string | null,
    skewImpact?: BigNumber,
    isAA?: boolean
) => {
    let tx: any;
    const isEth = collateralAddress === ZERO_ADDRESS;
    const isChained = sides.length > 1;

    if (isNonDefaultCollateral) {
        if (isChained) {
            if (isAA) {
                tx = (await executeBiconomyTransaction(
                    collateralAddress,
                    speedMarketsAMMContractWithSigner,
                    'createNewMarketWithDifferentCollateral',
                    [
                        asset,
                        deltaTimeSec,
                        sides,
                        pythPriceUpdateData,
                        collateralAddress,
                        buyInAmount,
                        isEth,
                        referral ? referral : ZERO_ADDRESS,
                        { value: isEth ? buyInAmount.add(pythUpdateFee) : pythUpdateFee },
                    ]
                )) as ethers.providers.TransactionReceipt;
            } else {
                tx = await speedMarketsAMMContractWithSigner.createNewMarketWithDifferentCollateral(
                    asset,
                    deltaTimeSec,
                    sides,
                    pythPriceUpdateData,
                    collateralAddress,
                    buyInAmount,
                    isEth,
                    referral ? referral : ZERO_ADDRESS,
                    { value: isEth ? buyInAmount.add(pythUpdateFee) : pythUpdateFee }
                );
            }
        } else {
            if (isAA) {
                tx = (await executeBiconomyTransaction(
                    collateralAddress,
                    speedMarketsAMMContractWithSigner,
                    'createNewMarketWithDifferentCollateral',
                    [
                        asset,
                        strikeTimeSec,
                        deltaTimeSec,
                        sides[0],
                        pythPriceUpdateData,
                        collateralAddress,
                        buyInAmount,
                        isEth,
                        referral ? referral : ZERO_ADDRESS,
                        skewImpact,
                        { value: isEth ? buyInAmount.add(pythUpdateFee) : pythUpdateFee },
                    ]
                )) as ethers.providers.TransactionReceipt;
            } else {
                tx = await speedMarketsAMMContractWithSigner.createNewMarketWithDifferentCollateral(
                    asset,
                    strikeTimeSec,
                    deltaTimeSec,
                    sides[0],
                    pythPriceUpdateData,
                    collateralAddress,
                    buyInAmount,
                    isEth,
                    referral ? referral : ZERO_ADDRESS,
                    skewImpact,
                    { value: isEth ? buyInAmount.add(pythUpdateFee) : pythUpdateFee }
                );
            }
        }
    } else {
        if (isChained) {
            if (isAA) {
                tx = (await executeBiconomyTransaction(
                    collateralAddress,
                    speedMarketsAMMContractWithSigner,
                    'createNewMarket',
                    [
                        asset,
                        deltaTimeSec,
                        sides,
                        buyInAmount,
                        pythPriceUpdateData,
                        referral ? referral : ZERO_ADDRESS,
                        { value: pythUpdateFee },
                    ]
                )) as ethers.providers.TransactionReceipt;
            } else {
                tx = await speedMarketsAMMContractWithSigner.createNewMarket(
                    asset,
                    deltaTimeSec,
                    sides,
                    buyInAmount,
                    pythPriceUpdateData,
                    referral ? referral : ZERO_ADDRESS,
                    { value: pythUpdateFee }
                );
            }
        } else {
            if (isAA) {
                tx = (await executeBiconomyTransaction(
                    collateralAddress,
                    speedMarketsAMMContractWithSigner,
                    'createNewMarket',
                    [
                        asset,
                        strikeTimeSec,
                        deltaTimeSec,
                        sides[0],
                        buyInAmount,
                        pythPriceUpdateData,
                        referral ? referral : ZERO_ADDRESS,
                        skewImpact,
                        { value: pythUpdateFee },
                    ]
                )) as ethers.providers.TransactionReceipt;
            } else {
                tx = await speedMarketsAMMContractWithSigner.createNewMarket(
                    asset,
                    strikeTimeSec,
                    deltaTimeSec,
                    sides[0],
                    buyInAmount,
                    pythPriceUpdateData,
                    referral ? referral : ZERO_ADDRESS,
                    skewImpact,
                    { value: pythUpdateFee }
                );
            }
        }
    }

    return isAA ? tx : await (tx as ethers.ContractTransaction).wait();
};

// get dynamic LP fee based on time threshold and delta time to maturity
export const getFeeByTimeThreshold = (
    deltaTimeSec: number,
    timeThresholds: number[], // in minutes - ascending order
    fees: number[],
    defaultFee: number
): number => {
    let index = -1;
    // iterate backwards and find index
    for (let i = timeThresholds.length - 1; i >= 0; i--) {
        if (secondsToMinutes(deltaTimeSec) >= timeThresholds[i]) {
            index = i;
            break;
        }
    }
    return index !== -1 ? fees[index] : defaultFee;
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

export const getUserLostAtSideIndex = (position: ChainedSpeedMarket) => {
    const userLostIndex = position.finalPrices.findIndex(
        (finalPrice, i) =>
            finalPrice > 0 &&
            position.strikePrices[i] > 0 &&
            ((position.sides[i] === Positions.UP && finalPrice <= position.strikePrices[i]) ||
                (position.sides[i] === Positions.DOWN && finalPrice >= position.strikePrices[i]))
    );
    return userLostIndex > -1 ? userLostIndex : position.sides.length - 1;
};
