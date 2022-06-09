/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';

import Input from './components/Input';
import Button from 'components/Button';
import RangeSlider from 'components/RangeSlider';
import Switch from 'components/SwitchInput/SwitchInputNew';
import Slippage from './components/Slippage';
import Divider from './styled-components/Divider';
import NetworkFees from './components/NetworkFees';
import ApprovalModal from 'components/ApprovalModal';

import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { setBuyState } from 'redux/modules/marketWidgets';
import styled from 'styled-components';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';

import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { getCurrencyKeyBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { bigNumberFormatter, stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { refetchAmmData, refetchTrades, refetchUserBalance, refetchUserTrades } from 'utils/queryConnector';
import {
    formatCurrency,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    formatPercentage,
    truncToDecimals,
} from 'utils/formatters/number';
import onboardConnector from 'utils/onboardConnector';

import { AccountMarketInfo, OrderSide, OptionSide, StableCoins } from 'types/options';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import {
    COLLATERALS,
    COLLATERALS_INDEX,
    MAX_L2_GAS_LIMIT,
    MINIMUM_AMM_LIQUIDITY,
    MIN_SCEW_IMPACT,
    SIDE,
    SLIPPAGE_PERCENTAGE,
} from 'constants/options';
import { checkAllowance, formatGasLimit, getIsOVM, getIsPolygon, getL1FeeInWei } from 'utils/network';

import { useTranslation } from 'react-i18next';
import WalletBalance from './components/WalletBalance';
import { getErrorToastOptions, getSuccessToastOptions, getWarningToastOptions, UI_COLORS } from 'constants/ui';
import { toast } from 'react-toastify';
import { checkMultipleStableBalances, getStableCoinForNetwork } from 'utils/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE, ZERO_ADDRESS } from 'constants/network';
import Tooltip from 'components/Tooltip';
import { getReferralWallet } from 'utils/referral';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import Select from 'components/SelectNew';

export type OrderSideOptionType = { value: OrderSide; label: string };

const THREE_PERCENT = 0.03;

const AMM: React.FC = () => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const dispatch = useDispatch();

    const { trackEvent } = useMatomo();

    const orderSideOptions = [
        {
            value: 'buy' as OrderSide,
            label: t('common.buy'),
        },
        {
            value: 'sell' as OrderSide,
            label: t('common.sell'),
        },
    ];
    const [orderSide, setOrderSide] = useState<OrderSideOptionType>(orderSideOptions[0]);
    const [optionSide, setOptionSide] = useState<OptionSide>('long');
    const [amount, setAmount] = useState<number | string>('');
    const [price, setPrice] = useState<number | string>('');
    const [basePrice, setBasePrice] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>('');
    const [priceImpact, setPriceImpact] = useState<number | string>('');
    const [basePriceImpact, setBasePriceImpact] = useState<number | string>('');
    const [potentialReturn, setPotentialReturn] = useState<number | string>('');
    const [potentialBaseReturn, setPotentialBaseReturn] = useState<number | string>('');
    const [isPotentialReturnAvailable, setIsPotentialReturnAvailable] = useState<boolean>(true);
    const [slippage, setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[2]);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isGettingQuote, setIsGettingQuote] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [isPriceChanged, setIsPriceChanged] = useState<boolean>(false);
    const [maxLimitExceeded, setMaxLimitExceeded] = useState<boolean>(false);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isSlippageValid, setIsSlippageValid] = useState<boolean>(true);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [maxLimit, setMaxLimit] = useState<number>(0);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const [selectedStableIndex, setStableIndex] = useState<number>(0);

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase() && !isPolygon
            ? getReferralWallet()
            : null;

    console.log('referral ', referral);

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket?.address, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!optionsMarket?.address,
    });
    let optBalances = {
        long: 0,
        short: 0,
    };
    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }
    const tokenBalance = optionSide === 'long' ? optBalances.long : optBalances.short;

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(optionsMarket?.address, networkId, {
        enabled: isAppReady && !!optionsMarket?.address,
    });
    const ammMaxLimits =
        ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data ? (ammMaxLimitsQuery.data as AmmMaxLimits) : undefined;

    const collateral = snxJSConnector.collateral;
    const multiCollateral = snxJSConnector.multipleCollateral;
    const isBuy = orderSide.value === 'buy';
    const isLong = optionSide === 'long';
    const isAmountEntered = Number(amount) > 0;
    const isPriceEntered = Number(price) > 0;
    const isTotalEntered = Number(total) > 0;
    const isAmmTradingDisabled = ammMaxLimits && !ammMaxLimits.isMarketInAmmTrading;
    const isNonDefaultStable = selectedStableIndex !== 0 && !isPolygon;

    const insufficientBalance = isBuy
        ? sUSDBalance < Number(total) || !sUSDBalance
        : tokenBalance < Number(amount) || !tokenBalance;

    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '',
    });

    const stableListBalances = useMemo(() => {
        if (multipleStableBalances?.isSuccess && multipleStableBalances?.data) {
            const list = [];

            for (const [key, value] of Object.entries(multipleStableBalances?.data)) {
                list.push({
                    index: COLLATERALS_INDEX[key as StableCoins],
                    title: key,
                    subValue: formatCurrencyWithSign(USD_SIGN, Number(value)),
                });
            }

            if (list?.length) {
                return list;
            }
        }

        return [];
    }, [multipleStableBalances?.isLoading]);

    // If sUSD balance is zero, select first stable with nonzero value as default
    useEffect(() => {
        if (multipleStableBalances?.data && multipleStableBalances?.isSuccess) {
            const defaultStableBalance = checkMultipleStableBalances(multipleStableBalances?.data);
            setStableIndex(defaultStableBalance);
        }
    }, [multipleStableBalances?.data]);

    const isButtonDisabled =
        !isTotalEntered ||
        !isPriceEntered ||
        !isAmountEntered ||
        !isSlippageValid ||
        isSubmitting ||
        !isWalletConnected ||
        insufficientBalance ||
        maxLimitExceeded ||
        isGettingQuote ||
        isAmmTradingDisabled ||
        !hasAllowance;

    let sellToken: string | undefined;
    let sellTokenCurrencyKey: string;

    if (isBuy && isNonDefaultStable) {
        sellToken = multiCollateral ? multiCollateral[selectedStableIndex]?.address : undefined;
        sellTokenCurrencyKey = COLLATERALS[selectedStableIndex];
    } else if (isBuy) {
        sellToken = collateral?.address;
        sellTokenCurrencyKey = getStableCoinForNetwork(networkId);
    } else {
        sellTokenCurrencyKey = OPTIONS_CURRENCY_MAP[optionSide];

        if (isLong) {
            sellToken = optionsMarket?.longAddress;
        } else {
            sellToken = optionsMarket?.shortAddress;
        }
    }

    // const sellToken = isBuy ? collateral?.address : isLong ? optionsMarket?.longAddress : optionsMarket?.shortAddress;
    const sellAmount = isBuy ? total : amount;
    // const sellTokenCurrencyKey = isBuy ? getStableCoinForNetwork(networkId) : OPTIONS_CURRENCY_MAP[optionSide];

    const formatBuySellArguments = () => {
        const marketAddress = optionsMarket?.address;
        const side = SIDE[optionSide];
        const parsedAmount = ethers.utils.parseEther(amount.toString());
        const parsedTotal = stableCoinParser(total.toString(), networkId);
        const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
        return { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage };
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(sellToken as any, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';

        const getAllowance = async () => {
            try {
                const parsedSellAmount =
                    isPolygon && isBuy
                        ? ethers.utils.parseUnits(Number(sellAmount).toString(), 6)
                        : ethers.utils.parseEther(Number(sellAmount).toString());
                const allowance = await checkAllowance(
                    parsedSellAmount,
                    erc20Instance,
                    walletAddress,
                    addressToApprove
                );
                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected) {
            getAllowance();
        }
    }, [walletAddress, isWalletConnected, isBuy, optionSide, hasAllowance, sellAmount, isAllowing]);

    useEffect(() => {
        orderSide.value == 'buy' ? dispatch(setBuyState(true)) : dispatch(setBuyState(false));
    }, [orderSide?.value]);

    useEffect(() => {
        setAmount('');
    }, [orderSide?.value, optionSide]);

    const fetchL1Fee = async (
        ammContractWithSigner: any,
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
        let txRequest: any;
        if (isBuy && isNonDefaultStable) {
            txRequest = ammContractWithSigner.populateTransaction.buyFromAMMWithDifferentCollateralAndReferrer(
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

        return getL1FeeInWei(txRequest, snxJSConnector);
    };

    const fetchGasLimit = async (
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
        try {
            const { ammContract } = snxJSConnector as any;
            const ammContractWithSigner = ammContract.connect((snxJSConnector as any).signer);

            if (isL2) {
                const l1FeeInWei = await fetchL1Fee(
                    ammContractWithSigner,
                    marketAddress,
                    side,
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage
                );
                setGasLimit(MAX_L2_GAS_LIMIT);
                setL1Fee(l1FeeInWei ? l1FeeInWei : 0);
                return MAX_L2_GAS_LIMIT;
            } else if (isPolygon) {
                const gasLimit = isBuy
                    ? await ammContractWithSigner.estimateGas.buyFromAMM(
                          marketAddress,
                          side,
                          parsedAmount,
                          parsedTotal,
                          parsedSlippage
                      )
                    : await ammContractWithSigner.estimateGas.sellToAMM(
                          marketAddress,
                          side,
                          parsedAmount,
                          parsedTotal,
                          parsedSlippage
                      );

                const gasLimitNumber = ethers.utils.formatUnits(gasLimit, 0);
                const safeGasLimit = Math.round(+gasLimitNumber + 0.2 * +gasLimitNumber);
                setGasLimit(safeGasLimit);
                return safeGasLimit;
            } else {
                setGasLimit(MAX_L2_GAS_LIMIT);
                return MAX_L2_GAS_LIMIT;
            }
        } catch (e) {
            console.log(e);
            setGasLimit(null);
            return null;
        }
    };

    useEffect(() => {
        if (isButtonDisabled) return;
        const { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage } = formatBuySellArguments();
        fetchGasLimit(marketAddress, side, parsedAmount, parsedTotal, parsedSlippage);
    }, [isWalletConnected, hasAllowance, slippage]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(sellToken as any, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';
        const amountToApprove =
            isPolygon && isBuy
                ? approveAmount === ethers.constants.MaxUint256
                    ? ethers.constants.MaxUint256
                    : ethers.utils.parseUnits(ethers.utils.formatEther(approveAmount), 6)
                : approveAmount;
        const gasPrice = await snxJSConnector.provider?.getGasPrice();
        const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, amountToApprove);
            const providerOptions = isPolygon
                ? {
                      gasLimit: formatGasLimit(gasEstimate, networkId),
                      gasPrice: ethers.utils.parseUnits(
                          Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                          'gwei'
                      ),
                  }
                : {
                      gasLimit: formatGasLimit(gasEstimate, networkId),
                  };

            const tx = (await erc20Instance.approve(
                addressToApprove,
                amountToApprove,
                providerOptions
            )) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            setIsAllowing(false);
            setOpenApprovalModal(false);
        }
    };

    const resetData = () => {
        setPrice('');
        setTotal('');
        setPriceImpact('');
        setPotentialReturn('');
        setGasLimit(null);
        setIsPotentialReturnAvailable(isBuy);
    };

    const fetchAmmPriceData = async (isRefresh: boolean, isSubmit = false) => {
        let priceChanged = false;
        let latestGasLimit = null;
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(true);
        }
        if (isAmountEntered) {
            try {
                const { ammContract } = snxJSConnector as any;
                const ammContractWithSigner = ammContract.connect((snxJSConnector as any).signer);

                const parsedAmount = ethers.utils.parseEther(amount.toString());

                const promises = [];
                if (isBuy && isNonDefaultStable) {
                    promises.push(
                        ammContractWithSigner.buyFromAmmQuoteWithDifferentCollateral(
                            optionsMarket.address,
                            SIDE[optionSide],
                            parsedAmount,
                            sellToken
                        )
                    );
                    promises.push(
                        ammContractWithSigner.buyPriceImpact(optionsMarket.address, SIDE[optionSide], parsedAmount)
                    );
                } else {
                    promises.push(
                        isBuy
                            ? ammContractWithSigner.buyFromAmmQuote(
                                  optionsMarket.address,
                                  SIDE[optionSide],
                                  parsedAmount
                              )
                            : ammContractWithSigner.sellToAmmQuote(
                                  optionsMarket.address,
                                  SIDE[optionSide],
                                  parsedAmount
                              )
                    );
                    promises.push(
                        isBuy
                            ? ammContractWithSigner.buyPriceImpact(
                                  optionsMarket.address,
                                  SIDE[optionSide],
                                  parsedAmount
                              )
                            : ammContractWithSigner.sellPriceImpact(
                                  optionsMarket.address,
                                  SIDE[optionSide],
                                  parsedAmount
                              )
                    );
                }

                // eslint-disable-next-line prefer-const
                let [ammQuote, ammPriceImpact] = await Promise.all(promises);

                if (isBuy && isNonDefaultStable) {
                    ammQuote = ammQuote[0];
                }

                const ammPrice =
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    ) / Number(amount);

                setPrice(ammPrice);
                setTotal(
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    )
                );
                setPriceImpact(ammPrice > 0 ? bigNumberFormatter(ammPriceImpact) - MIN_SCEW_IMPACT : 0);
                setPotentialReturn(ammPrice > 0 && isBuy ? 1 / ammPrice - 1 : 0);
                setIsPotentialReturnAvailable(isBuy);

                const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
                const isQuoteChanged =
                    ammPrice !== price ||
                    total !==
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        );

                if (isSubmit) {
                    latestGasLimit = await fetchGasLimit(
                        optionsMarket.address,
                        SIDE[optionSide],
                        parsedAmount,
                        ammQuote,
                        parsedSlippage
                    );
                } else {
                    if (
                        ammPrice > 0 &&
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        ) > 0 &&
                        isSlippageValid &&
                        isQuoteChanged &&
                        hasAllowance
                    ) {
                        fetchGasLimit(optionsMarket.address, SIDE[optionSide], parsedAmount, ammQuote, parsedSlippage);
                    }
                }
                priceChanged = ammPrice !== price;
            } catch (e) {
                console.log(e);
                resetData();
                priceChanged = true;
            }
        } else {
            resetData();
        }
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(false);
        }
        return { priceChanged, latestGasLimit };
    };

    useDebouncedEffect(() => {
        fetchAmmPriceData(false);
    }, [amount, isBuy, isLong, walletAddress, isAmountEntered]);

    useInterval(async () => {
        fetchAmmPriceData(true);
    }, 5000);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setIsPriceChanged(false);

        const id = toast.loading(t('amm.progress'));

        const { priceChanged, latestGasLimit } = await fetchAmmPriceData(true, true);
        if (priceChanged) {
            setIsPriceChanged(true);
            setIsSubmitting(false);
            return;
        }
        try {
            const { ammContract } = snxJSConnector as any;
            const ammContractWithSigner = ammContract.connect((snxJSConnector as any).signer);

            const { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage } = formatBuySellArguments();
            const gasPrice = await snxJSConnector.provider?.getGasPrice();

            const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

            console.log(
                'latestGasLimit !== null ? latestGasLimit : gasLimit ',
                latestGasLimit !== null ? latestGasLimit : gasLimit
            );

            const providerOptions = isPolygon
                ? {
                      gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                      gasPrice: ethers.utils.parseUnits(
                          Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                          'gwei'
                      ),
                  }
                : {
                      gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                  };

            let tx: ethers.ContractTransaction;

            if (isBuy && isNonDefaultStable) {
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

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(
                            `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.confirmation-message`
                        )
                    )
                );
                refetchAmmData(walletAddress, optionsMarket?.address, networkId);
                refetchTrades(optionsMarket?.address);
                refetchUserTrades(optionsMarket?.address, walletAddress);
                refetchUserBalance(walletAddress, networkId);
                setIsSubmitting(false);
                resetData();
                setAmount('');

                if (isBuy) {
                    trackEvent({
                        category: 'AMM',
                        action: 'buy-from-amm',
                    });
                } else {
                    trackEvent({
                        category: 'AMM',
                        action: 'sell-to-amm',
                    });
                }
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        let max = 0;
        let base = 0;
        let baseImpact = 0;
        if (ammMaxLimits) {
            max = isLong
                ? isBuy
                    ? ammMaxLimits.maxBuyLong
                    : ammMaxLimits.maxSellLong
                : isBuy
                ? ammMaxLimits.maxBuyShort
                : ammMaxLimits.maxSellShort;
            base = isLong
                ? isBuy
                    ? ammMaxLimits.buyLongPrice
                    : ammMaxLimits.sellLongPrice
                : isBuy
                ? ammMaxLimits.buyShortPrice
                : ammMaxLimits.sellShortPrice;
            baseImpact = isLong
                ? isBuy
                    ? ammMaxLimits.buyLongPriceImpact
                    : ammMaxLimits.sellLongPriceImpact
                : isBuy
                ? ammMaxLimits.buyShortPriceImpact
                : ammMaxLimits.sellShortPriceImpact;
        }
        setMaxLimit(max);
        setBasePrice(base);
        setBasePriceImpact(baseImpact);
        setPotentialBaseReturn(base > 0 && isBuy ? 1 / Number(base) - 1 : 0);
        setInsufficientLiquidity(max < MINIMUM_AMM_LIQUIDITY);
    }, [ammMaxLimits, isLong, isBuy]);

    useEffect(() => {
        setIsSlippageValid(Number(slippage) > 0 && Number(slippage) <= 100);
    }, [slippage]);

    useEffect(() => {
        toast(getWarningToastOptions(t('amm.price-changed-warning')));
    }, [isPriceChanged]);

    useEffect(() => {
        setIsAmountValid(
            Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? (Number(total) > 0 && Number(total) <= sUSDBalance) ||
                          (Number(total) === 0 && sUSDBalance > 0)
                        : Number(amount) <= tokenBalance))
        );
    }, [amount, total, isBuy, sUSDBalance, tokenBalance]);

    useEffect(() => {
        setMaxLimitExceeded(Number(amount) > maxLimit);
    }, [amount, maxLimit]);

    const getSubmitButton = () => {
        const defaultButtonProps = {
            padding: '3px 35px',
            active: true,
            margin: '15px auto 0 auto',
            hoverShadow: 'var(--button-shadow)',
            fontSize: '20px',
        };

        if (isAmmTradingDisabled) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('amm.amm-disabled')}
                </Button>
            );
        }
        if (!isWalletConnected) {
            return (
                <Button {...defaultButtonProps} onClickHandler={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (insufficientLiquidity) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }
        if (insufficientBalance) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!isSlippageValid) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.invalid-slippage`)}
                </Button>
            );
        }
        if (maxLimitExceeded) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }
        if (!hasAllowance) {
            return (
                <Button {...defaultButtonProps} disabled={isAllowing} onClickHandler={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: sellTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: sellTokenCurrencyKey,
                          })}
                </Button>
            );
        }
        return (
            <Button {...defaultButtonProps} disabled={isButtonDisabled || !gasLimit} onClickHandler={handleSubmit}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.label`)
                    : t(
                          `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.progress-label`
                      )}
            </Button>
        );
    };

    const getPriceImpactColor = (priceImpactPercentage: number) => {
        if (priceImpactPercentage >= 0.03 || Number(priceImpactPercentage) <= -0.03) {
            return UI_COLORS.GREEN;
        }
        if (priceImpactPercentage >= 0.01 || Number(priceImpactPercentage) <= -0.01) {
            return UI_COLORS.GREEN;
        }
        return UI_COLORS.GREEN;
    };

    const onMaxClick = async (isBuy: boolean) => {
        trackEvent({
            category: 'AMM',
            action: 'click-on-max-button',
        });
        if (isBuy) {
            const { ammContract } = snxJSConnector as any;
            const ammContractWithSigner = ammContract.connect((snxJSConnector as any).signer);

            const calcPrice = !price ? basePrice : price;

            if (calcPrice) {
                let tmpSuggestedAmount = Number(sUSDBalance) / Number(calcPrice);
                const suggestedAmount = ethers.utils.parseEther(tmpSuggestedAmount.toString());

                if (tmpSuggestedAmount > maxLimit) {
                    setAmount(truncToDecimals(maxLimit));
                    return;
                }

                const ammQuote = await ammContractWithSigner.buyFromAmmQuote(
                    optionsMarket.address,
                    SIDE[optionSide],
                    suggestedAmount
                );

                const ammPrice =
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    ) / Number(tmpSuggestedAmount);

                tmpSuggestedAmount = (Number(sUSDBalance) / Number(ammPrice)) * ((100 - Number(slippage)) / 100);

                setAmount(truncToDecimals(tmpSuggestedAmount));
            }
        } else {
            setAmount(truncToDecimals(tokenBalance));
        }
    };

    const formDisabled = isSubmitting || isAmmTradingDisabled;
    return (
        <Wrapper>
            <WalletBalance type={optionSide} />
            <Switch
                active={orderSide.value !== 'buy'}
                width={'94px'}
                height={'32px'}
                dotSize={'22px'}
                label={{
                    firstLabel: orderSideOptions[0].label.toUpperCase(),
                    secondLabel: orderSideOptions[1].label.toUpperCase(),
                    fontSize: '25px',
                }}
                shadow={true}
                dotBackground={'var(--amm-switch-circle)'}
                handleClick={() => {
                    orderSide.value == 'buy' ? setOrderSide(orderSideOptions[1]) : setOrderSide(orderSideOptions[0]);
                }}
            />
            <ButtonWrapper>
                <Button
                    width={'48%'}
                    active={optionSide == 'long'}
                    padding={'5px 0px'}
                    fontSize={'14px'}
                    hoverShadow={'var(--button-shadow)'}
                    onClickHandler={() => setOptionSide('long')}
                >
                    {t('options.common.long')}
                </Button>
                <Button
                    width={'48%'}
                    active={optionSide == 'short'}
                    padding={'5px 0px'}
                    fontSize={'14px'}
                    hoverShadow={'var(--button-shadow)'}
                    onClickHandler={() => setOptionSide('short')}
                >
                    {t('options.common.short')}
                </Button>
            </ButtonWrapper>
            <Input
                title={t('options.market.trade-options.place-order.amount-label', {
                    orderSide: orderSide.value.toUpperCase(),
                })}
                value={amount}
                valueType={'number'}
                subValue={OPTIONS_CURRENCY_MAP[optionSide]}
                valueChange={(value) => setAmount(value)}
                borderColor={!isAmountValid ? '#C3244A' : undefined}
                displayTooltip={!isAmountValid || maxLimitExceeded}
                tooltipText={t(
                    !isAmountValid ? 'common.errors.insufficient-balance-wallet' : 'common.errors.max-limit-exceeded',
                    {
                        currencyKey: isBuy ? getStableCoinForNetwork(networkId) : OPTIONS_CURRENCY_MAP[optionSide],
                    }
                )}
            >
                <MaxButtonContainer>
                    <MaxButton
                        onClick={() => onMaxClick(isBuy)}
                        disabled={formDisabled || insufficientLiquidity || isGettingQuote}
                    >
                        {t('common.max')}
                    </MaxButton>
                    <Tooltip message={t('amm.max-button-tooltip')} type={'info'} />
                </MaxButtonContainer>
            </Input>
            <RangeSlider
                min={1}
                max={maxLimit}
                showFooter={true}
                step={1}
                container={{ margin: '0 0 30px 0' }}
                footerText={t('amm.max-amount', {
                    amount: formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], maxLimit),
                })}
                defaultValue={Number(amount)}
                onChangeEventHandler={(value) => setAmount(value)}
            />
            <Input
                title={t('options.market.trade-options.place-order.price-label', {
                    currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                })}
                value={
                    isGettingQuote
                        ? '...'
                        : Number(price) > 0 || Number(basePrice) > 0
                        ? formatCurrency(Number(price) > 0 ? price : basePrice, 4)
                        : '-'
                }
                subValue={getStableCoinForNetwork(networkId)}
                valueEditDisable={true}
            />
            {isBuy && !isPolygon && (
                <Select
                    title={'Pay with'}
                    optionsArray={stableListBalances}
                    selectedOption={selectedStableIndex}
                    onChangeOption={(index) => setStableIndex(index)}
                />
            )}
            <Input
                title={t(`amm.total-${orderSide.value}-label`)}
                value={isGettingQuote ? '...' : Number(price) > 0 ? formatCurrency(total, 4) : '-'}
                subValue={getStableCoinForNetwork(networkId)}
                valueEditDisable={true}
            />
            <Input
                title={t('amm.return-label')}
                value={
                    isGettingQuote
                        ? '...'
                        : Number(price) > 0
                        ? isPotentialReturnAvailable
                            ? `${formatCurrencyWithKey(
                                  getStableCoinForNetwork(networkId),
                                  Number(potentialReturn) * Number(total)
                              )}`
                            : '-'
                        : '-'
                }
                valueColor={isPotentialReturnAvailable ? getPriceImpactColor(Number(priceImpact)) : undefined}
                subValue={
                    isPotentialReturnAvailable
                        ? `(${formatPercentage(potentialBaseReturn)})`
                        : isBuy && Number(basePrice) > 0 && Number(potentialBaseReturn) > 0
                        ? formatPercentage(potentialReturn)
                        : ''
                }
                subValueColor={isPotentialReturnAvailable ? getPriceImpactColor(Number(priceImpact)) : undefined}
                valueEditDisable={true}
            />
            <Input
                title={t('amm.skew-label')}
                value={
                    isGettingQuote
                        ? '-'
                        : Number(price) > 0 || Number(basePrice) > 0
                        ? formatPercentage(Number(price) > 0 ? priceImpact : basePriceImpact)
                        : '-'
                }
                valueColor={
                    Number(price) > 0 || Number(basePrice) > 0
                        ? getPriceImpactColor(Number(price) > 0 ? Number(priceImpact) : Number(basePriceImpact))
                        : undefined
                }
                valueEditDisable={true}
            />
            <Slippage
                fixed={SLIPPAGE_PERCENTAGE}
                defaultValue={Number(slippage)}
                onChangeHandler={(value) => setSlippage(value)}
            />
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={formDisabled} l1Fee={l1Fee} />
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={+(+sellAmount + THREE_PERCENT * +sellAmount).toFixed(2)}
                    tokenSymbol={sellTokenCurrencyKey}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
            {getSubmitButton()}
        </Wrapper>
    );
};

const MaxButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    /* align-items: center; */
    position: absolute;
    top: 5px;
    right: 2px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid var(--card-border-color);
    border-radius: 15px;
    padding: 30px;
    margin-right: 27px;
    min-width: 300px;
    width: 40%;
    @media (max-width: 1024px) {
        width: 100%;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 28px;
`;

export const MaxButton = styled.button`
    /* position: absolute; */
    /* top: 5px; */
    /* right: 10px; */
    padding: 1px 8px;
    font-weight: 700;
    font-size: 10px;
    color: var(--primary-color);
    background-color: rgba(100, 217, 254, 0.5);
    border-radius: 10px;
    line-height: 15.21px;
    border: none;
    outline: none;
    text-transform: uppercase;
    cursor: pointer;
    &:focus {
        outline: none;
        border: none;
    }
    &:active {
        outline: none;
        border-style: none;
    }
    &:disabled {
        opacity: 0.6;
    }
`;

export default AMM;
