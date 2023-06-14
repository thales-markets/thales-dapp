import { BigNumber, ethers } from 'ethers';
import { OptionSide, RangedMarketPositionType } from 'types/options';
import { ZERO_ADDRESS } from '../constants/network';

export const getQuoteFromAMM = (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    parsedAmount: BigNumber,
    marketAddress: string,
    side: number | OptionSide,
    sellToken?: string,
    excludeImpact?: boolean
) => {
    const promises = [];

    if (isNonDefaultStable) {
        promises.push(
            ammContractWithSigner.buyFromAmmQuoteWithDifferentCollateral(marketAddress, side, parsedAmount, sellToken)
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

    if (excludeImpact) {
        return promises[0];
    }

    return promises;
};

export const getQuoteFromRangedAMM = (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    parsedAmount: BigNumber,
    marketAddress: string,
    side: number | RangedMarketPositionType,
    sellToken?: string,
    excludeImpact?: boolean
) => {
    const promises = [];

    if (isNonDefaultStable) {
        promises.push(
            ammContractWithSigner.buyFromAmmQuoteWithDifferentCollateral(marketAddress, side, parsedAmount, sellToken)
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

    if (excludeImpact) {
        return promises[0];
    }

    return promises;
};

export const prepareTransactionForAMM = async (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    marketAddress: string,
    side: number | OptionSide | RangedMarketPositionType,
    parsedAmount: BigNumber,
    parsedTotal: BigNumber,
    parsedSlippage: BigNumber,
    sellToken: string | undefined,
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

    if (isNonDefaultStable) {
        tx = (await ammContractWithSigner.buyFromAMMWithDifferentCollateralAndReferrer(
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            sellToken,
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
