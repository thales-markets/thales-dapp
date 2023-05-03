import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import { USD_SIGN } from 'constants/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import {
    COLLATERALS,
    MINIMUM_AMM_LIQUIDITY,
    POSITIONS,
    POSITIONS_TO_SIDE_MAP,
    SIDE,
    SLIPPAGE_PERCENTAGE,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { getErrorToastOptions, getSuccessToastOptions, getWarningToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';
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
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered } from 'theme/common';
import { MarketInfo, StableCoins } from 'types/options';
import { getAmountToApprove, getEstimatedGasFees, getQuoteFromAMM, prepareTransactionForAMM } from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getDefaultStableIndexByBalance, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { formatShortDate } from 'utils/formatters/date';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import {
    countDecimals,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    roundNumberToDecimals,
    truncDecimals,
    truncToDecimals,
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
import {
    refetchAmmData,
    refetchTrades,
    refetchUserBalance,
    refetchUserTrades,
    refetchWalletBalances,
} from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';
import Input from '../Input';

type TradingProps = {
    currencyKey: string;
    maturityDate: number;
    positionType: POSITIONS;
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
    const [isPriceChanged, setIsPriceChanged] = useState(false);
    const [liquidity, setLiquidity] = useState(0);
    const [_isAmountValid, setIsAmountValid] = useState(true); // TODO: add validation on amount

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
    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected && !!market.address,
        refetchInterval: false,
    });
    const marketParametersInfoQuery = useBinaryOptionsMarketParametersInfoQuery(market.address, {
        enabled: isAppReady && !!market.address,
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
    const isPositionAmountPositive = Number(positionAmount) > 0;
    const isNonDefaultStable = selectedStableIndex !== 0 && isMultiCollateralSupported;
    const isAmmTradingDisabled = ammMaxLimits && !ammMaxLimits.isMarketInAmmTrading;
    const isPositionPricePositive = Number(positionPrice) > 0;
    const isPaidAmountEntered = Number(paidAmount) > 0;
    const tokenBalance = isLong ? optBalances.long : optBalances.short;

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
    }, [selectedStableIndex, networkId]);

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
    };

    const fetchAmmPriceData = async (totalToPay: number, isRefresh: boolean, isSubmit = false) => {
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

                const calcAmount = totalToPay / ammPrice;
                const calcPositionAmount = calcAmount < liquidity ? calcAmount : truncToDecimals(liquidity);
                setPositionAmount(calcPositionAmount);
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
                // TODO: check this when price is changed as position amount is changed
                priceChanged = truncDecimals(ammPrice, 4) !== truncDecimals(Number(positionPrice), 4);
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
        setIsPriceChanged(false);

        const id = toast.loading(t('amm.progress'));

        const { priceChanged, latestGasLimit } = await fetchAmmPriceData(Number(paidAmount), true, true);
        if (priceChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setIsPriceChanged(true);
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
                // TODO: check if all refetches are required
                refetchWalletBalances(walletAddress, networkId);
                refetchAmmData(walletAddress, market.address, networkId);
                refetchTrades(market.address);
                refetchUserTrades(market.address, walletAddress);
                refetchUserBalance(walletAddress, networkId);
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
    }, [paidAmount, walletAddress, selectedStableIndex]);

    useInterval(async () => {
        fetchAmmPriceData(Number(paidAmount), true);
    }, 60000); // TODO: check this

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
    }, [walletAddress, isWalletConnected, hasAllowance, isAllowing]);

    useEffect(() => {
        setPositionAmount('');
        dispatch(setBuyState(true)); // TODO: check if this is needed
    }, []);

    useEffect(() => {
        if (isButtonDisabled) {
            return;
        }
        const parsedAmount = ethers.utils.parseEther(positionAmount.toString());
        const parsedTotal = stableCoinParser(paidAmount.toString(), networkId);
        const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
        fetchGasLimit(market.address, POSITIONS_TO_SIDE_MAP[positionType], parsedAmount, parsedTotal, parsedSlippage);
    }, [isWalletConnected, hasAllowance]);

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
        setInsufficientLiquidity(max < MINIMUM_AMM_LIQUIDITY);
    }, [ammMaxLimits?.buyLongPrice, isLong]);

    useEffect(() => {
        toast(getWarningToastOptions(t('amm.price-changed-warning')));
    }, [isPriceChanged]);

    useEffect(() => {
        setIsAmountValid(
            Number(positionAmount) === 0 ||
                (Number(positionAmount) > 0 &&
                    ((Number(paidAmount) > 0 && Number(paidAmount) <= stableBalance) ||
                        (Number(paidAmount) === 0 && stableBalance > 0)))
        );
    }, [positionAmount, paidAmount, stableBalance, tokenBalance]);

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
        const defaultButtonProps = {
            width: '320px',
            height: '34px',
            active: true,
        };

        if (!market.address) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('options.trade.trading.select-market')}
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

        const maxPaidAmount = roundNumberToDecimals(Number(stableBalance) * (1 - SLIPPAGE_PERCENTAGE[2] / 100));
        setPaidAmount(maxPaidAmount);
    };

    const formDisabled = isSubmitting || isAmmTradingDisabled;

    // console.log(positionAmount);
    // TODO:
    const potentialProfitFormatted = isFetchingQuote
        ? '...'
        : Number(positionPrice) > 0
        ? `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), Number(profit) * Number(paidAmount))}`
        : '-';

    return (
        <Container>
            <MarketDetails>
                <ColumnCenter>
                    <Text>
                        <TextLabel>{`${currencyKey} ${positionType}`}</TextLabel>
                        <TextValue>{market.strikePrice ? (positionType === POSITIONS.UP ? '>' : '<') : ''}</TextValue>
                        <TextValue>
                            {market.strikePrice ? formatCurrencyWithSign(USD_SIGN, market.strikePrice) : ''}
                        </TextValue>
                    </Text>
                    <Text>
                        <TextLabel>{t('options.trade.trading.end-date')}</TextLabel>
                        <TextValue>{maturityDate ? formatShortDate(maturityDate) : '-'}</TextValue>
                    </Text>
                </ColumnCenter>
                <VerticalLine />
                <ColumnCenter>
                    <Text>
                        <TextLabel>{t('options.trade.trading.position-price')}</TextLabel>
                        <TextValue>
                            {isFetchingQuote
                                ? '...'
                                : positionAddress
                                ? formatCurrencyWithSign(
                                      USD_SIGN,
                                      Number(positionPrice) > 0 ? positionPrice : basePrice
                                  )
                                : '-'}
                        </TextValue>
                    </Text>
                    <Text>
                        <TextLabel>{t('options.trade.trading.position-bonus')}</TextLabel>
                        <TextValue isBonus={true}>
                            {isFetchingQuote
                                ? '...'
                                : positionAddress
                                ? getFormattedBonus(convertPriceImpactToBonus(market.discount))
                                : '-'}
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
                container={{ width: '320px', height: '70px' }}
            >
                <InputActions>
                    <MaxButton
                        onClick={() => onMaxClick()}
                        disabled={formDisabled || insufficientLiquidity || isFetchingQuote}
                    >
                        {t('common.max')}
                    </MaxButton>
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

const Container = styled(FlexDivRow)`
    min-width: 980px;
    height: 70px;
`;

const MarketDetails = styled(FlexDivRowCentered)`
    width: 320px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
`;

const InputActions = styled.div`
    position: absolute;
    right: 30px;
`;

const MaxButton = styled.button`
    padding: 1px 8px;
    font-weight: 700;
    font-size: 10px;
    color: var(--color-white);
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

const FinalizeTrade = styled(FlexDivCentered)`
    width: 320px;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
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

const VerticalLine = styled.div`
    width: 2px;
    height: 38px;
    background: ${(props) => props.theme.background.tertiary};
    border-radius: 6px;
    margin: 0 5px;
`;

const ColumnCenter = styled(FlexDivColumnCentered)`
    max-width: fit-content;
`;

const ColumnSpaceBetween = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default Trading;
