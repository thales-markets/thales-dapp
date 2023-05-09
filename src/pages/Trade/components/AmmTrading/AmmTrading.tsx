import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/ButtonV2';
import CollateralSelector from 'components/CollateralSelectorV2';
import { USD_SIGN } from 'constants/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import {
    COLLATERALS,
    MINIMUM_AMM_LIQUIDITY,
    POSITIONS_TO_SIDE_MAP,
    Positions,
    RANGE_SIDE,
    SIDE,
    SLIPPAGE_PERCENTAGE,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { getErrorToastOptions, getInfoToastOptions, getSuccessToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';
import useRangedAMMMaxLimitsQuery from 'queries/options/rangedMarkets/useRangedAMMMaxLimitsQuery';
import useAmmMaxLimitsQuery from 'queries/options/useAmmMaxLimitsQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getSelectedCollateral, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow, FlexDivRowCentered } from 'theme/common';
import { MarketInfo, RangedMarketPerPosition, StableCoins } from 'types/options';
import {
    getAmountToApprove,
    getEstimatedGasFees,
    getQuoteFromAMM,
    getQuoteFromRangedAMM,
    prepareTransactionForAMM,
} from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import {
    getDefaultStableIndexByBalance,
    getStableCoinBalance,
    getStableCoinForNetwork,
    getSynthName,
} from 'utils/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import {
    SHORT_CRYPTO_CURRENCY_DECIMALS,
    countDecimals,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    roundNumberToDecimals,
    truncDecimals,
} from 'utils/formatters/number';
import {
    checkAllowance,
    getIsArbitrum,
    getIsBSC,
    getIsMultiCollateralSupported,
    getIsOVM,
    getIsPolygon,
    getProvider,
} from 'utils/network';
import { refetchAmmData, refetchBalances, refetchRangedAmmData } from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';
import Input from '../Input';

type AmmTradingProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition;
};

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

const AmmTrading: React.FC<AmmTradingProps> = ({ currencyKey, maturityDate, market }) => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const { openConnectModal } = useConnectModal();
    const dispatch = useDispatch();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));

    const [positionAmount, setPositionAmount] = useState<number | string>('');
    const [positionPrice, setPositionPrice] = useState<number | string>('');
    const [basePrice, setBasePrice] = useState<number | string>('');
    const [paidAmount, setPaidAmount] = useState<number | string>('');
    const [priceProfit, setPriceProfit] = useState<number | string>('');
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [hasAllowance, setAllowance] = useState(false);
    const [isFetchingQuote, setIsFetchingQuote] = useState(false);
    const [selectedStableIndex, setStableIndex] = useState(userSelectedCollateral);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
    const [isAllowing, setIsAllowing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [liquidity, setLiquidity] = useState(0);
    const [isAmountValid, setIsAmountValid] = useState(true);
    const [errorMessageKey, setErrorMessageKey] = useState('');

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const isRangedAmm = [Positions.IN, Positions.OUT].includes(market.positionType);

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && !isRangedAmm && !!market.address,
    });
    const rangedAmmMaxLimitsQuery = useRangedAMMMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && isRangedAmm && !!market.address,
    });
    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && getIsMultiCollateralSupported(networkId),
    });

    const ammMaxLimits = useMemo(() => {
        return ammMaxLimitsQuery.isSuccess ? ammMaxLimitsQuery.data : undefined;
    }, [ammMaxLimitsQuery]);

    const rangedAmmMaxLimits = useMemo(() => {
        return rangedAmmMaxLimitsQuery.isSuccess ? rangedAmmMaxLimitsQuery.data : undefined;
    }, [rangedAmmMaxLimitsQuery]);

    const walletBalancesMap = useMemo(() => {
        return stableBalanceQuery.isSuccess ? stableBalanceQuery.data : null;
    }, [stableBalanceQuery]);

    const stableBalance = useMemo(() => {
        return multipleStableBalances.isSuccess
            ? isMultiCollateralSupported
                ? getStableCoinBalance(multipleStableBalances?.data, COLLATERALS[selectedStableIndex] as StableCoins)
                : getCurrencyKeyStableBalance(walletBalancesMap, getStableCoinForNetwork(networkId) as StableCoins)
            : null;
    }, [networkId, multipleStableBalances, walletBalancesMap, selectedStableIndex, isMultiCollateralSupported]);

    const isOVM = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);
    const isPositionAmountPositive = Number(positionAmount) > 0;
    const isNonDefaultStable = selectedStableIndex !== 0 && isMultiCollateralSupported;
    const isAmmTradingDisabled = !isRangedAmm && ammMaxLimits && !ammMaxLimits.isMarketInAmmTrading;
    const isRangedAmmTradingDisabled =
        isRangedAmm &&
        rangedAmmMaxLimits &&
        !rangedAmmMaxLimits.in.maxBuy &&
        !rangedAmmMaxLimits.in.maxSell &&
        !rangedAmmMaxLimits.out.maxBuy &&
        !rangedAmmMaxLimits.out.maxSell;
    const isPositionPricePositive = Number(positionPrice) > 0;
    const isPaidAmountEntered = Number(paidAmount) > 0;
    const isLong = POSITIONS_TO_SIDE_MAP[market.positionType] === SIDE.long;
    const isInPosition = POSITIONS_TO_SIDE_MAP[market.positionType] === RANGE_SIDE.in;

    const insufficientBalance = stableBalance < Number(paidAmount) || !stableBalance;

    const isButtonDisabled =
        !isPaidAmountEntered ||
        !isPositionPricePositive ||
        !isPositionAmountPositive ||
        isSubmitting ||
        !isWalletConnected ||
        insufficientBalance ||
        insufficientLiquidity ||
        isFetchingQuote ||
        (isRangedAmm ? isRangedAmmTradingDisabled : isAmmTradingDisabled) ||
        !hasAllowance;

    const isMaxButtonDisabled =
        !market.address ||
        isSubmitting ||
        (isRangedAmm ? isRangedAmmTradingDisabled : isAmmTradingDisabled) ||
        insufficientLiquidity ||
        isFetchingQuote;

    const collateral = useMemo(() => {
        let address = undefined;
        let currencyOrSellPosition = '';
        if (isNonDefaultStable) {
            address =
                snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedStableIndex]?.address;
            currencyOrSellPosition = COLLATERALS[selectedStableIndex];
        } else {
            address = snxJSConnector.collateral?.address;
            currencyOrSellPosition = getStableCoinForNetwork(networkId);
        }

        return { address, currencyOrSellPosition };
    }, [selectedStableIndex, networkId, isNonDefaultStable]);

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase()
            ? getReferralWallet()
            : null;

    const resetData = () => {
        setPositionAmount('');
        setPositionPrice('');
        setPriceProfit('');
        setGasLimit(null);
    };

    const fetchGasLimit = useCallback(
        async (marketAddress: string, side: any, parsedAmount: any, parsedTotal: any, parsedSlippage: any) => {
            try {
                const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
                const ammContractWithSigner = (isRangedAmm ? rangedMarketAMMContract : ammContract).connect(signer);

                if (isOVM) {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                } else if (isBSC || isPolygon || isArbitrum) {
                    const gasLimit = await getEstimatedGasFees(
                        isNonDefaultStable,
                        true,
                        ammContractWithSigner,
                        marketAddress,
                        side,
                        parsedAmount,
                        parsedTotal,
                        parsedSlippage,
                        collateral.address,
                        referral
                    );

                    const safeGasLimit = Math.round(Number(+gasLimit + 0.1 * +gasLimit));
                    setGasLimit(safeGasLimit);

                    return safeGasLimit;
                } else {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
                return null;
            }
        },
        [collateral.address, isArbitrum, isBSC, isNonDefaultStable, isOVM, isPolygon, networkId, referral, isRangedAmm]
    );

    const fetchAmmPriceData = async (totalToPay: number, isRefresh: boolean, isSubmit = false, isMax = false) => {
        let priceChanged = false;
        let latestGasLimit = null;
        if (!isRefresh && !isSubmit) {
            setIsFetchingQuote(true);
        }

        const calcPrice = !positionPrice ? Number(basePrice) : Number(positionPrice);
        if (market.address && totalToPay > 0 && calcPrice > 0) {
            const suggestedAmount = totalToPay / calcPrice;

            try {
                const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
                const ammContractWithSigner = (isRangedAmm ? rangedMarketAMMContract : ammContract).connect(signer);

                const parsedAmount = ethers.utils.parseEther(suggestedAmount.toString());
                const promises = isRangedAmm
                    ? [
                          getQuoteFromRangedAMM(
                              isNonDefaultStable,
                              true,
                              ammContractWithSigner,
                              parsedAmount,
                              market.address,
                              POSITIONS_TO_SIDE_MAP[market.positionType],
                              collateral.address
                          ),
                      ]
                    : getQuoteFromAMM(
                          isNonDefaultStable,
                          true,
                          ammContractWithSigner,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateral.address
                      );

                const [ammQuotes]: Array<BigNumber> = await Promise.all(promises);
                const ammQuote = isNonDefaultStable ? (ammQuotes as any)[0] : ammQuotes;

                const ammPrice =
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    ) / suggestedAmount;

                let calcAmount = totalToPay / ammPrice;
                if (isMax) {
                    if (calcAmount >= liquidity) {
                        calcAmount = Number(truncDecimals(liquidity));
                        setPaidAmount(calcAmount * ammPrice);
                    } else {
                        setPaidAmount(totalToPay);
                    }
                }

                setPositionAmount(calcAmount);
                setPositionPrice(ammPrice);
                setPriceProfit(ammPrice > 0 ? 1 / ammPrice - 1 : 0);

                const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
                const isQuoteChanged =
                    ammPrice !== positionPrice ||
                    totalToPay !==
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        );

                if (isSubmit) {
                    latestGasLimit = await fetchGasLimit(
                        market.address,
                        POSITIONS_TO_SIDE_MAP[market.positionType],
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
                        isQuoteChanged &&
                        hasAllowance
                    ) {
                        fetchGasLimit(
                            market.address,
                            POSITIONS_TO_SIDE_MAP[market.positionType],
                            parsedAmount,
                            ammQuote,
                            parsedSlippage
                        );
                    }
                }
                // Between 2 calls ammPrice will be always different as it is based on position amount which is changed when price is changed
                priceChanged =
                    truncDecimals(ammPrice, SHORT_CRYPTO_CURRENCY_DECIMALS) !==
                    truncDecimals(Number(positionPrice), SHORT_CRYPTO_CURRENCY_DECIMALS);
            } catch (e) {
                console.log(e);
                resetData();
                priceChanged = true;
            }
        } else {
            resetData();
        }
        if (!isRefresh && !isSubmit) {
            setIsFetchingQuote(false);
        }
        return { priceChanged, latestGasLimit };
    };

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(collateral.address as any, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedAmm ? rangedMarketAMMContract?.address : ammContract?.address) || '';
        const amountToApprove = getAmountToApprove(
            approveAmount,
            isNonDefaultStable,
            true,
            selectedStableIndex,
            networkId
        );

        const gasPrice = await snxJSConnector.provider?.getGasPrice();
        const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

        const id = toast.loading(t('amm.progress'), getInfoToastOptions(t('amm.progress')));
        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, amountToApprove);
            const providerOptions = getProvider(gasEstimate, gasInGwei, networkId);

            const tx = (await erc20Instance.approve(
                addressToApprove,
                amountToApprove,
                providerOptions
            )) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`amm.transaction-successful`)));
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsAllowing(false);
            setOpenApprovalModal(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const id = toast.loading(t('amm.progress'), getInfoToastOptions(t('amm.progress')));

        const { priceChanged, latestGasLimit } = await fetchAmmPriceData(Number(paidAmount), true, true);
        if (priceChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setIsSubmitting(false);
            return;
        }
        try {
            const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = (isRangedAmm ? rangedMarketAMMContract : ammContract).connect(signer);

            const parsedAmount = ethers.utils.parseEther(positionAmount.toString());
            const parsedTotal = stableCoinParser(paidAmount.toString(), networkId);
            const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
            const gasPrice = await snxJSConnector.provider?.getGasPrice();

            const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

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

            const tx: ethers.ContractTransaction = await prepareTransactionForAMM(
                isNonDefaultStable,
                true,
                ammContractWithSigner,
                market.address,
                POSITIONS_TO_SIDE_MAP[market.positionType],
                parsedAmount,
                parsedTotal,
                parsedSlippage,
                collateral.address,
                referral,
                providerOptions
            );

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(`options.market.trade-options.place-order.swap-confirm-button.buy.confirmation-message`)
                    )
                );

                refetchBalances(walletAddress, networkId);
                isRangedAmm
                    ? refetchRangedAmmData(walletAddress, market.address, networkId)
                    : refetchAmmData(walletAddress, market.address);

                setIsSubmitting(false);

                resetData();
                setPaidAmount('');

                trackEvent({
                    category: isRangedAmm ? 'RangeAMM' : 'AMM',
                    action: `buy-with-${COLLATERALS[selectedStableIndex]}`,
                    value: Number(paidAmount),
                });
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsSubmitting(false);
        }
    };

    useDebouncedEffect(() => {
        fetchAmmPriceData(Number(paidAmount), false);
    }, [paidAmount, market.address, walletAddress, selectedStableIndex]);

    useInterval(async () => {
        fetchAmmPriceData(Number(paidAmount), true);
    }, 30000);

    useEffect(() => {
        if (!market.address) {
            setPaidAmount('');
        }
    }, [market.address]);

    useEffect(() => {
        refetchBalances(walletAddress, networkId);
    }, [walletAddress, networkId]);

    // If sUSD balance is zero, select first stable with nonzero value as default
    useEffect(() => {
        if (
            multipleStableBalances?.data &&
            multipleStableBalances?.isSuccess &&
            selectedStableIndex == 0 &&
            isMultiCollateralSupported
        ) {
            const defaultStableBalance = getDefaultStableIndexByBalance(multipleStableBalances?.data);
            setStableIndex(defaultStableBalance);
        }
    }, [
        multipleStableBalances?.isSuccess,
        multipleStableBalances?.data,
        selectedStableIndex,
        isMultiCollateralSupported,
    ]);

    useEffect(() => {
        setStableIndex(userSelectedCollateral);
    }, [userSelectedCollateral]);

    useEffect(() => {
        const erc20Instance = new ethers.Contract(collateral.address as any, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedAmm ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const getAllowance = async () => {
            try {
                const parsedAmount: BigNumber = stableCoinParser(
                    Number(paidAmount)?.toString(),
                    networkId,
                    COLLATERALS[selectedStableIndex]
                );

                const allowance = await checkAllowance(parsedAmount, erc20Instance, walletAddress, addressToApprove);

                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected && erc20Instance.signer) {
            getAllowance();
        }
    }, [
        dispatch,
        collateral.address,
        networkId,
        paidAmount,
        selectedStableIndex,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        isRangedAmm,
    ]);

    useEffect(() => {
        if (isButtonDisabled) {
            return;
        }
        const parsedAmount = ethers.utils.parseEther(positionAmount.toString());
        const parsedTotal = stableCoinParser(paidAmount.toString(), networkId);
        const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
        fetchGasLimit(
            market.address,
            POSITIONS_TO_SIDE_MAP[market.positionType],
            parsedAmount,
            parsedTotal,
            parsedSlippage
        );
    }, [
        fetchGasLimit,
        paidAmount,
        market.positionType,
        isButtonDisabled,
        networkId,
        isWalletConnected,
        hasAllowance,
        positionAmount,
        market.address,
    ]);

    useEffect(() => {
        let max = 0;
        let base = 0;
        if (isRangedAmm) {
            if (rangedAmmMaxLimits) {
                if (isInPosition) {
                    max = rangedAmmMaxLimits.in.maxBuy;
                    base = rangedAmmMaxLimits.in.buyPrice;
                } else {
                    max = rangedAmmMaxLimits.out.maxBuy;
                    base = rangedAmmMaxLimits.out.buyPrice;
                }
            }
        } else if (ammMaxLimits) {
            if (isLong) {
                max = ammMaxLimits.maxBuyLong;
                base = ammMaxLimits.buyLongPrice;
            } else {
                max = ammMaxLimits.maxBuyShort;
                base = ammMaxLimits.buyShortPrice;
            }
        }
        setLiquidity(max);
        setBasePrice(base);
        if (market.address && (isRangedAmm ? rangedAmmMaxLimitsQuery.data : ammMaxLimitsQuery.data)) {
            setInsufficientLiquidity(max < MINIMUM_AMM_LIQUIDITY);
        }
    }, [
        ammMaxLimitsQuery.data,
        ammMaxLimits,
        isLong,
        market.address,
        isRangedAmm,
        rangedAmmMaxLimitsQuery.data,
        rangedAmmMaxLimits,
        isInPosition,
    ]);

    useEffect(() => {
        let isValid = true;

        if (insufficientLiquidity) {
            isValid = false;
            setErrorMessageKey('common.errors.max-limit-exceeded');
        } else if (
            isWalletConnected &&
            ((Number(paidAmount) > 0 && Number(paidAmount) > stableBalance) || stableBalance === 0)
        ) {
            isValid = false;
            setErrorMessageKey('common.errors.insufficient-balance-wallet');
        }

        setIsAmountValid(isValid);
    }, [paidAmount, stableBalance, insufficientLiquidity, t, isWalletConnected]);

    useEffect(() => {
        if (market.address) {
            setInsufficientLiquidity(Number(positionAmount) > liquidity);
        }
    }, [positionAmount, liquidity, market.address]);

    const onTotalPriceValueChange = async (value: number | string) => {
        if (countDecimals(Number(value)) > 2 || value === Number(paidAmount)) {
            return;
        }
        setPaidAmount(value);
    };

    const onMaxClick = async () => {
        trackEvent({
            category: isRangedAmm ? 'RangeAMM' : 'AMM',
            action: 'click-on-max-button',
        });

        if (isMaxButtonDisabled) return;

        const maxPaidAmount = roundNumberToDecimals(Number(stableBalance) * (1 - SLIPPAGE_PERCENTAGE[2] / 100));
        fetchAmmPriceData(maxPaidAmount, false, false, true);
    };

    const getSubmitButton = () => {
        if (!market.address) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('options.trade.amm-trading.select-price')}
                </Button>
            );
        }
        if (isRangedAmm ? isRangedAmmTradingDisabled : isAmmTradingDisabled) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('amm.amm-disabled')}
                </Button>
            );
        }
        if (!isWalletConnected) {
            return (
                <Button {...defaultButtonProps} onClickHandler={openConnectModal}>
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
        if (!isPaidAmountEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!hasAllowance) {
            return (
                <Button {...defaultButtonProps} disabled={isAllowing} onClickHandler={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', {
                              currencyKey: collateral.currencyOrSellPosition,
                          })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: collateral.currencyOrSellPosition,
                          })}
                </Button>
            );
        }
        return (
            <Button {...defaultButtonProps} disabled={isButtonDisabled || !gasLimit} onClickHandler={handleSubmit}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.buy.label`)
                    : t(`options.market.trade-options.place-order.swap-confirm-button.buy.progress-label`)}
            </Button>
        );
    };

    const potentialProfitFormatted = isFetchingQuote
        ? '...'
        : `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), Number(priceProfit) * Number(paidAmount))}`;

    const PositionTypeFormatted =
        market.positionType === Positions.UP
            ? t('options.common.above')
            : market.positionType === Positions.DOWN
            ? t('options.common.below')
            : market.positionType === Positions.IN
            ? t('options.common.between')
            : t('options.common.not-between');

    return (
        <Container>
            <TradingDetails>
                <ColumnSpaceBetween>
                    <FlexDivCentered>
                        <Text>
                            <TextLabel>
                                {t('options.trade.amm-trading.asset-price', { asset: getSynthName(currencyKey) })}
                            </TextLabel>
                            {market.address ? (
                                <>
                                    <TextValue uppercase={true}>{PositionTypeFormatted}</TextValue>
                                    {isRangedAmm ? (
                                        <>
                                            <TextValue>
                                                {formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    (market as RangedMarketPerPosition).leftPrice
                                                )}
                                            </TextValue>
                                            <Text>
                                                <TextLabel>{' ' + t('options.common.and')}</TextLabel>
                                            </Text>
                                            <TextValue>
                                                {formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    (market as RangedMarketPerPosition).rightPrice
                                                )}
                                            </TextValue>
                                        </>
                                    ) : (
                                        <TextValue>
                                            {formatCurrencyWithSign(USD_SIGN, (market as MarketInfo).strikePrice)}
                                        </TextValue>
                                    )}
                                </>
                            ) : (
                                <TextValue>{'( ' + t('options.trade.amm-trading.pick-price') + ' )'}</TextValue>
                            )}
                        </Text>
                    </FlexDivCentered>
                    <FlexDivCentered>
                        <Text>
                            <TextLabel>{t('options.common.on')}</TextLabel>
                            <TextValue>{formatShortDateWithTime(maturityDate)}</TextValue>
                        </Text>
                    </FlexDivCentered>
                    <FlexDivCentered>
                        <Text>
                            <TextLabel>{t('options.trade.amm-trading.you-win')}</TextLabel>
                            <TextValue isProfit={true}>
                                {Number(priceProfit) > 0 && Number(paidAmount) > 0
                                    ? potentialProfitFormatted
                                    : '( ' + t('options.trade.amm-trading.based-price') + ' )'}
                            </TextValue>
                        </Text>
                    </FlexDivCentered>
                </ColumnSpaceBetween>
            </TradingDetails>
            <FinalizeTrade>
                <ColumnSpaceBetween>
                    <Input
                        value={paidAmount}
                        valueType={'number'}
                        disabled={!market.address}
                        placeholder={t('options.trade.amm-trading.enter-amount')}
                        valueChange={(value) => onTotalPriceValueChange(value)}
                        container={inputFieldProps}
                        showError={!isAmountValid}
                        errorMessage={t(errorMessageKey, {
                            currencyKey: getStableCoinForNetwork(
                                networkId,
                                isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                            ),
                        })}
                    >
                        <InputActions>
                            <MaxButton onClick={() => onMaxClick()} disabled={isMaxButtonDisabled}>
                                <TextMax>{t('common.max')}</TextMax>
                            </MaxButton>
                            <VerticalLine />
                            <CollateralSelector
                                collateralArray={COLLATERALS}
                                selectedItem={selectedStableIndex}
                                onChangeCollateral={(index) => setStableIndex(index)}
                                disabled={isMaxButtonDisabled}
                            />
                        </InputActions>
                    </Input>
                    {getSubmitButton()}
                </ColumnSpaceBetween>
            </FinalizeTrade>
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(ONE_HUNDRED_AND_THREE_PERCENT * Number(paidAmount))}
                    tokenSymbol={collateral.currencyOrSellPosition}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Container>
    );
};

const inputFieldProps = { width: '350px', height: '40px' };

const defaultButtonProps = {
    width: '100%',
    height: '34px',
    active: true,
};

const Container = styled(FlexDivRow)`
    min-width: 980px;
    height: 85px;
`;

const TradingDetails = styled(FlexDivRowCentered)`
    width: 600px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
`;

const FinalizeTrade = styled(FlexDivCentered)`
    width: 350px;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
`;

const InputActions = styled(FlexDivRow)`
    position: absolute;
    right: 10px;
`;

const MaxButton = styled(FlexDivCentered)<{ disabled?: boolean }>`
    ${(props) => (props.disabled ? `opacity: 0.6;` : '')}
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    margin: 0 7px;
    color: var(--color-white);
`;

const Text = styled.span`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
    text-transform: capitalize;
`;

const TextLabel = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
`;
const TextValue = styled.span<{ isProfit?: boolean; uppercase?: boolean }>`
    color: ${(props) => (props.isProfit ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    padding-left: 5px;
    ${(props) => (props.uppercase ? 'text-transform: uppercase;' : '')}
`;
const TextMax = styled(Text)`
    color: ${(props) => props.theme.button.textColor.quaternary};
`;

const VerticalLine = styled.div`
    width: 1px;
    height: 25px;
    background: ${(props) => props.theme.background.tertiary};
    border-radius: 6px;
`;

const ColumnSpaceBetween = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default AmmTrading;
