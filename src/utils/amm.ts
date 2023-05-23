import { ZERO_ADDRESS } from '@1inch/limit-order-protocol';
import { COLLATERALS, COLLATERALS_INDEX, STABLE_DECIMALS } from 'constants/options';
import { BigNumber, ethers } from 'ethers';
import { OptionSide, RangedMarketPositionType, StableCoins } from 'types/options';
import { stableCoinParser } from './formatters/ethers';
import { getIsArbitrum, getIsPolygon, Network, NetworkId } from './network';

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
    sellToken?: string
) => {
    if (isNonDefaultStable) {
        return ammContractWithSigner.buyFromAmmQuoteWithDifferentCollateral(
            marketAddress,
            side,
            parsedAmount,
            sellToken
        );
    } else {
        return isBuy
            ? ammContractWithSigner.buyFromAmmQuote(marketAddress, side, parsedAmount)
            : ammContractWithSigner.sellToAmmQuote(marketAddress, side, parsedAmount);
    }
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
    referral: string,
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

export const preparePopulateTransactionForAMM = async (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    marketAddress: string,
    side: number | OptionSide | RangedMarketPositionType,
    parsedAmount: BigNumber,
    parsedTotal: BigNumber,
    parsedSlippage: BigNumber,
    sellToken: string | undefined,
    referral: string
): Promise<ethers.ContractTransaction> => {
    let txRequest: any;

    if (isNonDefaultStable) {
        txRequest = await ammContractWithSigner.populateTransaction.buyFromAMMWithDifferentCollateralAndReferrer(
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            sellToken,
            referral ? referral : ZERO_ADDRESS
        );
    } else {
        txRequest = isBuy
            ? !referral
                ? await ammContractWithSigner.populateTransaction.buyFromAMM(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage
                  )
                : await ammContractWithSigner.populateTransaction.buyFromAMMWithReferrer(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      referral
                  )
            : await ammContractWithSigner.populateTransaction.sellToAMM(
                  marketAddress,
                  side,
                  parsedAmount,
                  parsedTotal,
                  parsedSlippage
              );
    }

    return txRequest;
};

export const getAmountToApprove = (
    approveAmount: BigNumber,
    isNonDefaultStable: boolean,
    isBuy: boolean,
    selectedStableIndex: number,
    networkId: NetworkId
): BigNumber => {
    if (approveAmount === ethers.constants.MaxUint256) {
        return ethers.constants.MaxUint256;
    }

    if ((getIsPolygon(networkId) || getIsArbitrum(networkId)) && isBuy) {
        return ethers.utils.parseUnits(ethers.utils.formatEther(approveAmount), 6);
    } else if (networkId == Network.BSC) {
        return ethers.utils.parseUnits(ethers.utils.formatEther(approveAmount), STABLE_DECIMALS['BUSD']);
    } else if (isNonDefaultStable) {
        return ethers.utils.parseUnits(
            ethers.utils.formatEther(approveAmount),
            STABLE_DECIMALS[COLLATERALS[selectedStableIndex] as StableCoins]
        );
    } else {
        return approveAmount;
    }
};

export const getAmountForApproval = (stableIndex: number, amountToApprove: string, networkId: NetworkId) => {
    let collateralDecimals = 18;
    if (networkId === Network.Arbitrum) {
        collateralDecimals = 6;
    } else {
        const stable = COLLATERALS_INDEX[stableIndex];

        if ((STABLE_DECIMALS as any)[stable]) {
            collateralDecimals = (STABLE_DECIMALS as any)[stable];
        }
    }
    return ethers.utils.parseUnits(amountToApprove, collateralDecimals);
};

export const parseSellAmount = (
    sellAmount: number | string,
    // isNonDefaultStable: boolean,
    // isBuy: boolean,
    // isPolygon: boolean,
    selectedStableIndex: number,
    networkId: NetworkId
) => {
    return stableCoinParser(Number(sellAmount)?.toString(), networkId, COLLATERALS[selectedStableIndex]);
};

export const getEstimatedGasFees = async (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    ammContractWithSigner: any,
    marketAddress: string,
    side: number | OptionSide | RangedMarketPositionType,
    parsedAmount: BigNumber,
    parsedTotal: BigNumber,
    parsedSlippage: BigNumber,
    sellToken: string | undefined,
    referral: string
) => {
    let txRequest: any;

    if (isNonDefaultStable) {
        txRequest = await ammContractWithSigner.estimateGas.buyFromAMMWithDifferentCollateralAndReferrer(
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            sellToken,
            referral ? referral : ZERO_ADDRESS
        );
    } else {
        txRequest = isBuy
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
    }

    return txRequest;
};
