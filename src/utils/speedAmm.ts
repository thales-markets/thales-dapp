import { ZERO_ADDRESS } from 'constants/network';
import { BigNumber, ethers } from 'ethers';

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
