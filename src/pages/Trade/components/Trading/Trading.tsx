import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import { USD_SIGN } from 'constants/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import {
    COLLATERALS,
    MINIMUM_AMM_LIQUIDITY,
    Positions,
    POSITIONS_TO_SIDE_MAP,
    SIDE,
    SLIPPAGE_PERCENTAGE,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';
import useAmmMaxLimitsQuery from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsMarketParametersInfoQuery from 'queries/options/useBinaryOptionsMarketParametersInfoQuery';
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
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered } from 'theme/common';
import { MarketInfo, StableCoins } from 'types/options';
import { getAmountToApprove, getEstimatedGasFees, getQuoteFromAMM, prepareTransactionForAMM } from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getDefaultStableIndexByBalance, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { formatShortDate } from 'utils/formatters/date';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import {
    DEFAULT_CURRENCY_DECIMALS,
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
import { convertPriceImpactToBonus, getFormattedBonus } from 'utils/options';
import { refetchAmmData, refetchBalances, refetchWalletBalances } from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';
import Input from '../Input';
import CollateralSelector from 'components/CollateralSelector/CollateralSelectorV2';

type TradingProps = {
    currencyKey: string;
    maturityDate: number;
    positionType: Positions;
    market: MarketInfo;
};

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

const Trading: React.FC<TradingProps> = ({ currencyKey, maturityDate, positionType, market }) => {
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
    const [profit, setProfit] = useState<number | string>('');
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

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && !!market.address,
        refetchInterval: false,
    });
    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && getIsMultiCollateralSupported(networkId),
    });
    const marketParametersInfoQuery = useBinaryOptionsMarketParametersInfoQuery(market.address, {
        enabled: isAppReady && !!market.address,
    });

    const ammMaxLimits = useMemo(() => {
        return ammMaxLimitsQuery.isSuccess ? ammMaxLimitsQuery.data : undefined;
    }, [ammMaxLimitsQuery]);

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

    const isLong = POSITIONS_TO_SIDE_MAP[positionType] === SIDE.long;
    const positionAddress = useMemo(() => {
        return marketParametersInfoQuery.isSuccess && marketParametersInfoQuery.data
            ? isLong
                ? marketParametersInfoQuery.data.longAddress
                : marketParametersInfoQuery.data.shortAddress
            : undefined;
    }, [marketParametersInfoQuery, isLong]);

    const isOVM = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);
    const isPositionAmountPositive = Number(positionAmount) > 0;
    const isNonDefaultStable = selectedStableIndex !== 0 && isMultiCollateralSupported;
    const isAmmTradingDisabled = ammMaxLimits && !ammMaxLimits.isMarketInAmmTrading;
    const isPositionPricePositive = Number(positionPrice) > 0;
    const isPaidAmountEntered = Number(paidAmount) > 0;

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
        isAmmTradingDisabled ||
        !hasAllowance;

    const isMaxButtonDisabled =
        !market.address || isSubmitting || isAmmTradingDisabled || insufficientLiquidity || isFetchingQuote;

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
        setProfit('');
        setGasLimit(null);
    };

    const fetchGasLimit = useCallback(
        async (marketAddress: string, side: any, parsedAmount: any, parsedTotal: any, parsedSlippage: any) => {
            try {
                const { ammContract, signer } = snxJSConnector as any;
                const ammContractWithSigner = ammContract.connect(signer);

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
        [collateral.address, isArbitrum, isBSC, isNonDefaultStable, isOVM, isPolygon, networkId, referral]
    );

    const fetchAmmPriceData = async (totalToPay: number, isRefresh: boolean, isSubmit = false, isMax = false) => {
        let priceChanged = false;
        let latestGasLimit = null;
        if (!isRefresh && !isSubmit) {
            setIsFetchingQuote(true);
        }

        const calcPrice = !positionPrice ? Number(basePrice) : Number(positionPrice);
        if (totalToPay > 0 && calcPrice > 0) {
            const suggestedAmount = totalToPay / calcPrice;

            try {
                const { ammContract, signer } = snxJSConnector as any;
                const ammContractWithSigner = ammContract.connect(signer);

                const parsedAmount = ethers.utils.parseEther(suggestedAmount.toString());
                const promises = getQuoteFromAMM(
                    isNonDefaultStable,
                    true,
                    ammContractWithSigner,
                    parsedAmount,
                    market.address,
                    POSITIONS_TO_SIDE_MAP[positionType],
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
                setProfit(ammPrice > 0 ? 1 / ammPrice - 1 : 0);

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
                        POSITIONS_TO_SIDE_MAP[positionType],
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
                            POSITIONS_TO_SIDE_MAP[positionType],
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
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';
        const amountToApprove = getAmountToApprove(
            approveAmount,
            isNonDefaultStable,
            true,
            selectedStableIndex,
            networkId
        );

        const gasPrice = await snxJSConnector.provider?.getGasPrice();
        const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

        const id = toast.loading(t('amm.progress'));
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

        const id = toast.loading(t('amm.progress'));

        const { priceChanged, latestGasLimit } = await fetchAmmPriceData(Number(paidAmount), true, true);
        if (priceChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setIsSubmitting(false);
            return;
        }
        try {
            const { ammContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = ammContract.connect(signer);

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
                POSITIONS_TO_SIDE_MAP[positionType],
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
                refetchAmmData(walletAddress, market.address);

                setIsSubmitting(false);

                resetData();
                setPaidAmount('');

                trackEvent({
                    category: 'AMM',
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
        refetchWalletBalances(walletAddress, networkId);
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
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';

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
    ]);

    useEffect(() => {
        if (isButtonDisabled) {
            return;
        }
        const parsedAmount = ethers.utils.parseEther(positionAmount.toString());
        const parsedTotal = stableCoinParser(paidAmount.toString(), networkId);
        const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
        fetchGasLimit(market.address, POSITIONS_TO_SIDE_MAP[positionType], parsedAmount, parsedTotal, parsedSlippage);
    }, [
        fetchGasLimit,
        paidAmount,
        positionType,
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
        if (ammMaxLimits) {
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
        if (market.address && ammMaxLimitsQuery.data) {
            setInsufficientLiquidity(max < MINIMUM_AMM_LIQUIDITY);
        }
    }, [ammMaxLimitsQuery.data, ammMaxLimits, isLong, market.address]);

    useEffect(() => {
        let isValid = true;

        if (insufficientLiquidity) {
            isValid = false;
            setErrorMessageKey('common.errors.max-limit-exceeded');
        } else if ((Number(paidAmount) > 0 && Number(paidAmount) > stableBalance) || stableBalance === 0) {
            isValid = false;
            setErrorMessageKey('common.errors.insufficient-balance-wallet');
        }

        setIsAmountValid(isValid);
    }, [paidAmount, stableBalance, insufficientLiquidity, t]);

    useEffect(() => {
        setInsufficientLiquidity(Number(positionAmount) > liquidity);
    }, [positionAmount, liquidity]);

    const onTotalPriceValueChange = async (value: number | string) => {
        if (countDecimals(Number(value)) > 2 || value === Number(paidAmount)) {
            return;
        }
        setPaidAmount(value);
    };

    const getSubmitButton = () => {
        if (!market.address) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('options.trade.trading.select-price')}
                </Button>
            );
        }
        if (isAmmTradingDisabled) {
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

    const onMaxClick = async () => {
        trackEvent({
            category: 'AMM',
            action: 'click-on-max-button',
        });

        if (isMaxButtonDisabled) return;

        const maxPaidAmount = roundNumberToDecimals(Number(stableBalance) * (1 - SLIPPAGE_PERCENTAGE[2] / 100));
        fetchAmmPriceData(maxPaidAmount, false, false, true);
    };

    // TODO:
    const potentialProfitFormatted = isFetchingQuote
        ? '...'
        : Number(positionPrice) > 0
        ? `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), Number(profit) * Number(paidAmount))}`
        : '-';

    return (
        <Container>
            <MarketDetails>
                {market.address ? (
                    <ColumnCenter fitContent={true}>
                        <Text>
                            <TextLabel>{`${currencyKey} ${positionType}`}</TextLabel>
                            <TextValue>{positionType === Positions.UP ? '>' : '<'}</TextValue>
                            <TextValue>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</TextValue>
                        </Text>
                        <Text>
                            <TextLabel>{t('options.trade.trading.end-date')}</TextLabel>
                            <TextValue>{formatShortDate(maturityDate)}</TextValue>
                        </Text>
                    </ColumnCenter>
                ) : (
                    <ColumnCenter>
                        <TextInfo>{t('options.trade.trading.select-price')}</TextInfo>
                    </ColumnCenter>
                )}
                <VerticalLine height="38px" margin={market.address ? '' : '0 20px 0 0'} />
                <ColumnCenter fitContent={true} minWidth={market.address ? '150px' : ''}>
                    <Text>
                        <TextLabel>{t('options.trade.trading.position-price')}</TextLabel>
                        <TextValue>
                            {isFetchingQuote
                                ? '...'
                                : positionAddress
                                ? formatCurrencyWithSign(
                                      USD_SIGN,
                                      Number(positionPrice) > 0 ? positionPrice : basePrice,
                                      DEFAULT_CURRENCY_DECIMALS
                                  )
                                : USD_SIGN}
                        </TextValue>
                    </Text>
                    <Text>
                        <TextLabel>{t('options.trade.trading.position-bonus')}</TextLabel>
                        <TextValue isBonus={true}>
                            {isFetchingQuote
                                ? '...'
                                : positionAddress
                                ? getFormattedBonus(convertPriceImpactToBonus(market.discount))
                                : '%'}
                        </TextValue>
                    </Text>
                </ColumnCenter>
            </MarketDetails>
            <Input
                value={paidAmount}
                valueType={'number'}
                disabled={!market.address}
                placeholder={t('options.trade.trading.enter-amount')}
                valueChange={(value) => onTotalPriceValueChange(value)}
                container={inputFieldProps}
                displayTooltip={!isAmountValid}
                tooltipText={t(errorMessageKey, {
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
                    <VerticalLine width="1px" height="25px" />
                    <CollateralSelector
                        collateralArray={COLLATERALS}
                        selectedItem={selectedStableIndex}
                        onChangeCollateral={(index) => setStableIndex(index)}
                        disabled={isMaxButtonDisabled}
                    />
                </InputActions>
            </Input>
            <FinalizeTrade>
                <ColumnSpaceBetween>
                    <FlexDivColumnCentered>
                        <span style={{ textAlign: 'center' }}>{`If bitcoin stays ABOVE ${market.strikePrice}`}</span>
                        <span style={{ textAlign: 'center' }}>{`@${new Date(
                            maturityDate
                        ).toLocaleDateString()} you will earn ${potentialProfitFormatted}`}</span>
                    </FlexDivColumnCentered>
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

const inputFieldProps = { width: '330px', height: '70px' };

const defaultButtonProps = {
    width: '100%',
    height: '34px',
    active: true,
};

const Container = styled(FlexDivRow)`
    min-width: 980px;
    height: 70px;
`;

const MarketDetails = styled(FlexDivRowCentered)`
    width: 330px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
`;

const FinalizeTrade = styled(FlexDivCentered)`
    width: 330px;
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
    font-family: 'Titillium Regular' !important;
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
    text-transform: capitalize;
`;

const TextLabel = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
`;
const TextValue = styled.span<{ isBonus?: boolean }>`
    color: ${(props) => (props.isBonus ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    padding-left: 5px;
`;
const TextInfo = styled(Text)`
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;
const TextMax = styled(Text)`
    color: ${(props) => props.theme.button.textColor.quaternary};
`;

const VerticalLine = styled.div<{ width?: string; height?: string; margin?: string }>`
    width: ${(props) => (props.width ? props.width : '2px')};
    height: ${(props) => (props.height ? props.height : '100%')};
    background: ${(props) => props.theme.background.tertiary};
    border-radius: 6px;
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
`;

const ColumnCenter = styled(FlexDivColumnCentered)<{ fitContent?: boolean; minWidth?: string }>`
    ${(props) => (props.fitContent ? `max-width: fit-content;` : '')}
    ${(props) => (props.minWidth ? `min-width: ${props.minWidth};` : '')}
`;

const ColumnSpaceBetween = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default Trading;
