import { BigNumber, ethers } from 'ethers';
import { OptionSide, RangedMarketPositionType } from 'types/options';
import { ZERO_ADDRESS } from '../constants/network';

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
    providerOptions:
        | {
              gasLimit: number | null;
              gasPrice: BigNumber;
          }
        | {
              gasLimit: number | null;
              gasPrice?: undefined;
          }
): Promise<ethers.ContractTransaction> => {
    let tx: ethers.ContractTransaction;

    if (isBuyWithNonDefaultCollateral) {
        tx = (await ammContractWithSigner.buyFromAMMWithDifferentCollateralAndReferrer(
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            collateral,
            referral ? referral : ZERO_ADDRESS,
            providerOptions
        )) as ethers.ContractTransaction;
    } else {
        tx = (isBuy
            ? !referral
                ? await ammContractWithSigner.buyFromAMM(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      providerOptions
                  )
                : await ammContractWithSigner.buyFromAMMWithReferrer(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      referral,
                      providerOptions
                  )
            : await ammContractWithSigner.sellToAMM(
                  marketAddress,
                  side,
                  parsedAmount,
                  parsedTotal,
                  parsedSlippage,
                  providerOptions
              )) as ethers.ContractTransaction;
    }

    return tx;
};
