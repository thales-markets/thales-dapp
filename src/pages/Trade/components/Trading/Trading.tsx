import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import Switch from 'components/SwitchInput/SwitchInputNew';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import {
    COLLATERALS,
    MINIMUM_AMM_LIQUIDITY,
    MIN_SCEW_IMPACT,
    POSITIONS,
    POSITIONS_TO_SIDE_MAP,
    SIDE,
    SLIPPAGE_PERCENTAGE,
    TradeSide,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { getErrorToastOptions, getSuccessToastOptions, getWarningToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';
import Input from 'pages/AMMTrading/components/AMM/components/Input';
import useAmmMaxLimitsQuery from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useBinaryOptionsMarketParametersInfoQuery from 'queries/options/useBinaryOptionsMarketParametersInfoQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { setBuyState } from 'redux/modules/marketWidgets';
import { getIsWalletConnected, getNetworkId, getSelectedCollateral, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { StableCoins } from 'types/options';
import { getAmountToApprove, getEstimatedGasFees, getQuoteFromAMM, prepareTransactionForAMM } from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getDefaultStableIndexByBalance, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { bigNumberFormatter, stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrency, formatCurrencyWithKey, roundNumberToDecimals } from 'utils/formatters/number';
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
import {
    refetchAmmData,
    refetchTrades,
    refetchUserBalance,
    refetchUserTrades,
    refetchWalletBalances,
} from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';

type TradingProps = {
    currencyKey: string;
    maturityDate: number;
    positionType: POSITIONS;
    strikePrice: number;
    marketAddress: string;
};

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

const Trading: React.FC<TradingProps> = ({ currencyKey, maturityDate, positionType, strikePrice, marketAddress }) => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const { openConnectModal } = useConnectModal();
    const dispatch = useDispatch();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));

    const [tradeSide, setTradeSide] = useState(TradeSide.BUY);
    const [amount, setAmount] = useState<number | string>(''); // position amount
    const [price, setPrice] = useState<number | string>(''); // position price
    const [basePrice, setBasePrice] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>(''); // total to pay or buyInAmount
    const [potentialReturn, setPotentialReturn] = useState<number | string>(''); // profit
    const [isPotentialReturnAvailable, setIsPotentialReturnAvailable] = useState(true); // profit available
    const [priceImpact, setPriceImpact] = useState<number | string>(''); // discount if negative otherwise skew
    const [basePriceImpact, setBasePriceImpact] = useState<number | string>(''); // discount if negative otherwise skew
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [hasAllowance, setAllowance] = useState(false);
    const [isGettingQuote, setIsGettingQuote] = useState(false);
    const [selectedStableIndex, setStableIndex] = useState(userSelectedCollateral);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
    const [maxLimitExceeded, setMaxLimitExceeded] = useState(false);
    const [isAllowing, setIsAllowing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [isPriceChanged, setIsPriceChanged] = useState(false);
    const [maxLimit, setMaxLimit] = useState(0);
    const [_isAmountValid, setIsAmountValid] = useState(true); // TODO: add validation on amount

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(marketAddress, networkId, {
        enabled: isAppReady && !!marketAddress,
    });
    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && getIsMultiCollateralSupported(networkId),
    });
    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(marketAddress, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!marketAddress,
    });
    const marketParametersInfoQuery = useBinaryOptionsMarketParametersInfoQuery(marketAddress, {
        enabled: isAppReady && !!marketAddress,
    });

    const ammMaxLimits = useMemo(() => {
        return ammMaxLimitsQuery.isSuccess ? ammMaxLimitsQuery.data : undefined;
    }, [networkId, ammMaxLimitsQuery]);

    const walletBalancesMap = useMemo(() => {
        return stableBalanceQuery.isSuccess ? stableBalanceQuery.data : null;
    }, [networkId, stableBalanceQuery]);

    const stableBalance = useMemo(() => {
        return multipleStableBalances.isSuccess
            ? isMultiCollateralSupported
                ? getStableCoinBalance(multipleStableBalances?.data, COLLATERALS[selectedStableIndex] as StableCoins)
                : getCurrencyKeyStableBalance(walletBalancesMap, getStableCoinForNetwork(networkId) as StableCoins)
            : null;
    }, [networkId, multipleStableBalances, walletBalancesMap, selectedStableIndex]);

    const optBalances = useMemo(() => {
        return isWalletConnected && accountMarketInfoQuery.isSuccess
            ? accountMarketInfoQuery.data
            : { long: 0, short: 0 };
    }, [networkId, accountMarketInfoQuery, isWalletConnected]);

    const isLong = POSITIONS_TO_SIDE_MAP[positionType] === SIDE.long;
    const positionAddress = useMemo(() => {
        return marketParametersInfoQuery.isSuccess && marketParametersInfoQuery.data
            ? isLong
                ? marketParametersInfoQuery.data.longAddress
                : marketParametersInfoQuery.data.shortAddress
            : undefined;
    }, [networkId, marketParametersInfoQuery, isLong]);

    const isOVM = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);
    const isAmountEntered = Number(amount) > 0;
    const isBuy = tradeSide === TradeSide.BUY;
    const isNonDefaultStable = isBuy && selectedStableIndex !== 0 && isMultiCollateralSupported;
    const isAmmTradingDisabled = ammMaxLimits && !ammMaxLimits.isMarketInAmmTrading;
    const isPriceEntered = Number(price) > 0;
    const isTotalEntered = Number(total) > 0;
    const tokenBalance = isLong ? optBalances.long : optBalances.short;

    const insufficientBalance = isBuy
        ? stableBalance < Number(total) || !stableBalance
        : tokenBalance < Number(amount) || !tokenBalance;

    const isButtonDisabled =
        !isTotalEntered ||
        !isPriceEntered ||
        !isAmountEntered ||
        isSubmitting ||
        !isWalletConnected ||
        insufficientBalance ||
        maxLimitExceeded ||
        isGettingQuote ||
        isAmmTradingDisabled ||
        !hasAllowance;

    const collateral = useMemo(() => {
        let address = undefined;
        let currencyOrSellPosition = '';
        if (isNonDefaultStable) {
            address =
                snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedStableIndex]?.address;
            currencyOrSellPosition = COLLATERALS[selectedStableIndex];
        } else if (isBuy) {
            address = snxJSConnector.collateral?.address;
            currencyOrSellPosition = getStableCoinForNetwork(networkId);
        } else {
            address = positionAddress;
            currencyOrSellPosition = positionType;
        }

        return { address, currencyOrSellPosition };
    }, [selectedStableIndex, networkId]);

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase()
            ? getReferralWallet()
            : null;

    const resetData = () => {
        setPrice('');
        setTotal('');
        setPriceImpact('');
        setPotentialReturn('');
        setGasLimit(null);
        setIsPotentialReturnAvailable(isBuy);
    };

    const fetchGasLimit = async (
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
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
                    isBuy,
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
    };

    const fetchAmmPriceData = async (isRefresh: boolean, isSubmit = false) => {
        let priceChanged = false;
        let latestGasLimit = null;
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(true);
        }
        if (isAmountEntered) {
            try {
                const { ammContract, signer } = snxJSConnector as any;
                const ammContractWithSigner = ammContract.connect(signer);

                const parsedAmount = ethers.utils.parseEther(amount.toString());
                const promises = getQuoteFromAMM(
                    isNonDefaultStable,
                    isBuy,
                    ammContractWithSigner,
                    parsedAmount,
                    marketAddress,
                    POSITIONS_TO_SIDE_MAP[positionType],
                    collateral.address
                );

                const [ammQuotes, ammPriceImpact]: Array<BigNumber> = await Promise.all(promises);
                const ammQuote = isNonDefaultStable ? (ammQuotes as any)[0] : ammQuotes;

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

                const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
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
                        marketAddress,
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
                            marketAddress,
                            POSITIONS_TO_SIDE_MAP[positionType],
                            parsedAmount,
                            ammQuote,
                            parsedSlippage
                        );
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

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(collateral.address as any, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';
        const amountToApprove = getAmountToApprove(
            approveAmount,
            isNonDefaultStable,
            isBuy,
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
        setIsPriceChanged(false);

        const id = toast.loading(t('amm.progress'));

        const { priceChanged, latestGasLimit } = await fetchAmmPriceData(true, true);
        if (priceChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setIsPriceChanged(true);
            setIsSubmitting(false);
            return;
        }
        try {
            const { ammContract } = snxJSConnector as any;
            const ammContractWithSigner = ammContract.connect((snxJSConnector as any).signer);

            const parsedAmount = ethers.utils.parseEther(amount.toString());
            const parsedTotal = stableCoinParser(total.toString(), networkId);
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
                isBuy,
                ammContractWithSigner,
                marketAddress,
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
                        t(
                            `options.market.trade-options.place-order.swap-confirm-button.${tradeSide}.confirmation-message`
                        )
                    )
                );
                // TODO: check if all refetches are required
                refetchWalletBalances(walletAddress, networkId);
                refetchAmmData(walletAddress, marketAddress, networkId);
                refetchTrades(marketAddress);
                refetchUserTrades(marketAddress, walletAddress);
                refetchUserBalance(walletAddress, networkId);
                setIsSubmitting(false);
                resetData();
                setAmount('');

                if (isBuy) {
                    trackEvent({
                        category: 'AMM',
                        action: `buy-with-${COLLATERALS[selectedStableIndex]}`,
                        value: Number(total),
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

    useDebouncedEffect(() => {
        fetchAmmPriceData(false);
    }, [amount, isBuy, walletAddress, isAmountEntered, selectedStableIndex]);

    useInterval(async () => {
        fetchAmmPriceData(true);
    }, 5000);

    useEffect(() => {
        refetchWalletBalances(walletAddress, networkId);
    }, [walletAddress]);

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
    }, [multipleStableBalances?.data]);

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
                    Number(isBuy ? total : amount)?.toString(),
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
    }, [walletAddress, isWalletConnected, isBuy, hasAllowance, isAllowing]);

    useEffect(() => {
        setAmount('');
        tradeSide == TradeSide.BUY ? dispatch(setBuyState(true)) : dispatch(setBuyState(false));
    }, [tradeSide]);

    useEffect(() => {
        if (isButtonDisabled) {
            return;
        }
        const parsedAmount = ethers.utils.parseEther(amount.toString());
        const parsedTotal = stableCoinParser(total.toString(), networkId);
        const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
        fetchGasLimit(marketAddress, POSITIONS_TO_SIDE_MAP[positionType], parsedAmount, parsedTotal, parsedSlippage);
    }, [isWalletConnected, hasAllowance]);

    useEffect(() => {
        let max = 0;
        let base = 0;
        let baseImpact = 0;
        if (ammMaxLimits) {
            if (isLong) {
                max = isBuy ? ammMaxLimits.maxBuyLong : ammMaxLimits.maxSellLong;
                base = isBuy ? ammMaxLimits.buyLongPrice : ammMaxLimits.sellLongPrice;
                baseImpact = isBuy ? ammMaxLimits.buyLongPriceImpact : ammMaxLimits.sellLongPriceImpact;
            } else {
                max = isBuy ? ammMaxLimits.maxBuyShort : ammMaxLimits.maxSellShort;
                base = isBuy ? ammMaxLimits.buyShortPrice : ammMaxLimits.sellShortPrice;
                baseImpact = isBuy ? ammMaxLimits.buyShortPriceImpact : ammMaxLimits.sellShortPriceImpact;
            }
        }
        setMaxLimit(max);
        setBasePrice(base);
        setBasePriceImpact(baseImpact);
        setInsufficientLiquidity(max < MINIMUM_AMM_LIQUIDITY);
    }, [ammMaxLimits, isLong, isBuy]);

    useEffect(() => {
        toast(getWarningToastOptions(t('amm.price-changed-warning')));
    }, [isPriceChanged]);

    useEffect(() => {
        setIsAmountValid(
            Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? (Number(total) > 0 && Number(total) <= stableBalance) ||
                          (Number(total) === 0 && stableBalance > 0)
                        : Number(amount) <= tokenBalance))
        );
    }, [amount, total, isBuy, stableBalance, tokenBalance]);

    useEffect(() => {
        setMaxLimitExceeded(Number(amount) > maxLimit);
    }, [amount, maxLimit]);

    const getSubmitButton = () => {
        const defaultButtonProps = {
            width: '320px',
            height: '34px',
            active: true,
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
        if (!isAmountEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-amount`)}
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
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.${tradeSide}.label`)
                    : t(`options.market.trade-options.place-order.swap-confirm-button.${tradeSide}.progress-label`)}
            </Button>
        );
    };

    // TODO:
    const potentialProfitFormatted = isGettingQuote
        ? '...'
        : Number(price) > 0
        ? isPotentialReturnAvailable
            ? `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), Number(potentialReturn) * Number(total))}`
            : '-'
        : '-';

    return (
        <>
            <Container>
                <MarketInfo>
                    <FlexDivColumnCentered>
                        <span>{`${currencyKey} ${positionType} ${strikePrice ? '> ' + strikePrice : ''}`}</span>
                        <span>{`End Date ${maturityDate ? new Date(maturityDate).toLocaleDateString() : '-'}`}</span>
                    </FlexDivColumnCentered>
                    <FlexDivColumnCentered>
                        <span>{`Price per position ${
                            isGettingQuote
                                ? '...'
                                : Number(price) > 0 || Number(basePrice) > 0
                                ? formatCurrency(Number(price) > 0 ? price : basePrice, 4)
                                : '-'
                        }`}</span>
                        <span>{`Bonus per position ${
                            isGettingQuote
                                ? '-'
                                : Number(price) > 0 || Number(basePrice) > 0
                                ? getFormattedBonus(
                                      Number(price) > 0
                                          ? convertPriceImpactToBonus(Number(priceImpact))
                                          : convertPriceImpactToBonus(Number(basePriceImpact))
                                  )
                                : '-'
                        }`}</span>
                    </FlexDivColumnCentered>
                </MarketInfo>
                <Input
                    value={amount}
                    valueType={'number'}
                    subValue={positionType}
                    valueChange={(value) => setAmount(value)}
                    container={{ width: '320px', height: '70px' }}
                />
                <Finalize>
                    <Column>
                        <FlexDivColumnCentered>
                            <span style={{ textAlign: 'center' }}>{`If bitcoin stays ABOVE ${strikePrice}`}</span>
                            <span style={{ textAlign: 'center' }}>{`@${new Date(
                                maturityDate
                            ).toLocaleDateString()} you will earn ${potentialProfitFormatted}`}</span>
                        </FlexDivColumnCentered>
                        {getSubmitButton()}
                    </Column>
                </Finalize>
                {openApprovalModal && (
                    <ApprovalModal
                        // add three percent to approval amount to take into account price changes
                        defaultAmount={roundNumberToDecimals(
                            ONE_HUNDRED_AND_THREE_PERCENT * (isBuy ? Number(total) : Number(amount))
                        )}
                        tokenSymbol={collateral.currencyOrSellPosition}
                        isAllowing={isAllowing}
                        onSubmit={handleAllowance}
                        onClose={() => setOpenApprovalModal(false)}
                    />
                )}
            </Container>
            <Switch
                active={!isBuy}
                width={'94px'}
                height={'32px'}
                dotSize={'22px'}
                label={{
                    firstLabel: t('common.buy').toUpperCase(),
                    secondLabel: t('common.sell').toUpperCase(),
                    fontSize: '25px',
                }}
                shadow={true}
                dotBackground={'var(--amm-switch-circle)'}
                handleClick={() => {
                    isBuy ? setTradeSide(TradeSide.SELL) : setTradeSide(TradeSide.BUY);
                }}
            />
        </>
    );
};

const Container = styled(FlexDivRow)`
    min-width: 980px;
    height: 70px;
`;

const MarketInfo = styled(FlexDivCentered)`
    width: 320px;
    background: #2b3139;
    border-radius: 8px;
    padding: 10px;
    color: #ffffff;
    font-size: 13px;
`;

const Finalize = styled(FlexDivCentered)`
    width: 320px;
    color: #ffffff;
    font-size: 13px;
`;

const Column = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default Trading;
