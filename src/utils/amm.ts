import { BigNumber, ethers } from 'ethers';
import { OptionSide, RangedMarketPositionType } from 'types/options';
import { ZERO_ADDRESS } from '../constants/network';
import { Network } from 'enums/network';

export const getQuoteFromAMM = (
    isBuyWithNonDefaultCollateral: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    parsedAmount: BigNumber,
    marketAddress: string,
    side: number | OptionSide,
    collateral?: string
) => {
    const promises = [];

    if (isBuyWithNonDefaultCollateral) {
        promises.push(
            ammContractWithSigner.buyFromAmmQuoteWithDifferentCollateral(marketAddress, side, parsedAmount, collateral)
        );
        promises.push(ammContractWithSigner.buyPriceImpact(marketAddress, side, parsedAmount));
    } else {
        promises.push(
            isBuy
                ? ammContractWithSigner.buyFromAmmQuote(marketAddress, side, parsedAmount)
                : ammContractWithSigner.sellToAmmQuote(marketAddress, side, parsedAmount)
        );
        promises.push(
            isBuy
                ? ammContractWithSigner.buyPriceImpact(marketAddress, side, parsedAmount)
                : ammContractWithSigner.sellPriceImpact(marketAddress, side, parsedAmount)
        );
    }

    return promises;
};

export const getQuoteFromRangedAMM = (
    isBuyWithNonDefaultCollateral: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    parsedAmount: BigNumber,
    marketAddress: string,
    side: number | RangedMarketPositionType,
    collateral?: string
) => {
    const promises = [];

    if (isBuyWithNonDefaultCollateral) {
        promises.push(
            ammContractWithSigner.buyFromAmmQuoteWithDifferentCollateral(marketAddress, side, parsedAmount, collateral)
        );
        promises.push(ammContractWithSigner.getPriceImpact(marketAddress, side));
    } else {
        promises.push(
            isBuy
                ? ammContractWithSigner.buyFromAmmQuote(marketAddress, side, parsedAmount)
                : ammContractWithSigner.sellToAmmQuote(marketAddress, side, parsedAmount)
        );
        promises.push(ammContractWithSigner.getPriceImpact(marketAddress, side));
    }

    return promises;
};

const GAS_ESTIMATION_BUFFER = 1.2; // Adding 20% on gas estimation as a buffer. Used only on Optimism

export const prepareTransactionForAMM = async (
    isBuyWithNonDefaultCollateral: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    marketAddress: string,
    side: number | OptionSide | RangedMarketPositionType,
    parsedAmount: BigNumber,
    parsedTotal: BigNumber,
    parsedSlippage: BigNumber,
    collateral: string | undefined,
    referral: string | null,
    networkId: Network
): Promise<ethers.ContractTransaction> => {
    let tx: ethers.ContractTransaction;
    let finalEstimation = null;

    if (isBuyWithNonDefaultCollateral) {
        if (networkId === Network.OptimismMainnet || Network.Base) {
            const estimation = await ammContractWithSigner.estimateGas.buyFromAMMWithDifferentCollateralAndReferrer(
                marketAddress,
                side,
                parsedAmount,
                parsedTotal,
                parsedSlippage,
                collateral,
                referral ? referral : ZERO_ADDRESS
            );
            finalEstimation = Math.ceil(Number(estimation) * GAS_ESTIMATION_BUFFER); // using Math.celi as gasLimit is accepting only integer.
        }

        tx = (await ammContractWithSigner.buyFromAMMWithDifferentCollateralAndReferrer(
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            collateral,
            referral ? referral : ZERO_ADDRESS,
            { gasLimit: finalEstimation }
        )) as ethers.ContractTransaction;
    } else {
        if (networkId === Network.OptimismMainnet || Network.Base) {
            const estimation = isBuy
                ? !referral
                    ? await ammContractWithSigner.estimateGas.buyFromAMM(
                          marketAddress,
                          side,
                          parsedAmount,
                          parsedTotal,
                          parsedSlippage
                      )
                    : await ammContractWithSigner.estimateGas.buyFromAMMWithReferrer(
                          marketAddress,
                          side,
                          parsedAmount,
                          parsedTotal,
                          parsedSlippage,
                          referral
                      )
                : await ammContractWithSigner.estimateGas.sellToAMM(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage
                  );

            finalEstimation = Math.ceil(Number(estimation) * GAS_ESTIMATION_BUFFER);
        }

        tx = (isBuy
            ? !referral
                ? await ammContractWithSigner.buyFromAMM(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      { gasLimit: finalEstimation }
                  )
                : await ammContractWithSigner.buyFromAMMWithReferrer(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      referral,
                      { gasLimit: finalEstimation }
                  )
            : await ammContractWithSigner.sellToAMM(marketAddress, side, parsedAmount, parsedTotal, parsedSlippage, {
                  gasLimit: finalEstimation,
              })) as ethers.ContractTransaction;
    }

    return tx;
};
