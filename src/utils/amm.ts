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

const OP_GAS_LIMIT = 4000000; // Gas Limit set to 4M for amm txs on Optimism

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

    const gasLimit = networkId === Network.OptimismMainnet ? OP_GAS_LIMIT : null;

    if (isBuyWithNonDefaultCollateral) {
        tx = (await ammContractWithSigner.buyFromAMMWithDifferentCollateralAndReferrer(
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            collateral,
            referral ? referral : ZERO_ADDRESS,
            { gasLimit: gasLimit }
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
                      { gasLimit: gasLimit }
                  )
                : await ammContractWithSigner.buyFromAMMWithReferrer(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      referral,
                      { gasLimit: gasLimit }
                  )
            : await ammContractWithSigner.sellToAMM(marketAddress, side, parsedAmount, parsedTotal, parsedSlippage, {
                  gasLimit: gasLimit,
              })) as ethers.ContractTransaction;
    }

    return tx;
};
