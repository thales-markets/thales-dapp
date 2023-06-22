import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import CollateralSelector from 'components/CollateralSelector';
import {
    getDefaultToastContent,
    getLoadingToastOptions,
    getErrorToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import NumericInput from 'components/fields/NumericInput/NumericInput';
import {
    COLLATERALS,
    MINIMUM_AMM_LIQUIDITY,
    MIN_SCEW_IMPACT,
    POSITIONS_TO_SIDE_MAP,
    SLIPPAGE_PERCENTAGE,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { Positions } from 'enums/options';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import useRangedAMMMaxLimitsQuery from 'queries/options/rangedMarkets/useRangedAMMMaxLimitsQuery';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import useAmmMaxLimitsQuery from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsBuy } from 'redux/modules/marketWidgets';
import { getIsWalletConnected, getNetworkId, getSelectedCollateral, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import {
    AccountMarketInfo,
    MarketInfo,
    OptionsMarketInfo,
    RangedMarketBalanceInfo,
    RangedMarketData,
    RangedMarketPerPosition,
    StableCoins,
} from 'types/options';
import { getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getDefaultStableIndexByBalance, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { bigNumberFormatter, stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import {
    formatCurrency,
    formatCurrencyWithSign,
    roundNumberToDecimals,
    truncToDecimals,
} from 'utils/formatters/number';
import { checkAllowance, getIsMultiCollateralSupported } from 'utils/network';
import { convertPriceImpactToBonus } from 'utils/options';
import { refetchAmmData, refetchBalances, refetchRangedAmmData } from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';
import SkewSlippageDetails from './components/SkewSlippageDetails/SkewSlippageDetails';
import { isSlippageValid } from './components/Slippage/Slippage';
import TradingDetails from './components/TradingDetails';
import TradingDetailsModal from './components/TradingDetailsModal';
import TradingDetailsSentence from './components/TradingDetailsSentence';
import {
    ColumnSpaceBetween,
    Container,
    DetailsIcon,
    FinalizeTrade,
    TradingDetailsContainer,
} from './styled-components';
import { USD_SIGN } from 'constants/currency';
import Tooltip from 'components/Tooltip';

type AmmTradingProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition;
    isDetailsPage?: boolean;
    showBuyLiquidity?: boolean;
    showWalletBalance?: boolean;
};

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

const AmmTrading: React.FC<AmmTradingProps> = ({
    currencyKey,
    maturityDate,
    market,
    isDetailsPage,
    showBuyLiquidity,
    showWalletBalance,
}) => {
    const isRangedMarket = [Positions.IN, Positions.OUT].includes(market.positionType);
    const contextMarket = isRangedMarket ? useRangedMarketContext() : useMarketContext();
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const { openConnectModal } = useConnectModal();
    const dispatch = useDispatch();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));
    const isBuy = useSelector((state: RootState) => getIsBuy(state)) || !isDetailsPage;

    const [positionAmount, setPositionAmount] = useState<number | string>('');
    const [positionPrice, setPositionPrice] = useState<number | string>('');
    const [basePrice, setBasePrice] = useState<number | string>('');
    const [paidAmount, setPaidAmount] = useState<number | string>('');
    const [priceImpact, setPriceImpact] = useState<number | string>('');
    const [basePriceImpact, setBasePriceImpact] = useState<number | string>('');
    const [slippagePerc, setSlippagePerc] = useState<number>(SLIPPAGE_PERCENTAGE[2]);
    const [priceProfit, setPriceProfit] = useState<number | string>('');
    const [hasAllowance, setAllowance] = useState(false);
    const [isFetchingQuote, setIsFetchingQuote] = useState(false);
    const [selectedStableIndex, setSelectedStableIndex] = useState(userSelectedCollateral);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
    const [outOfLiquidity, setOutOfLiquidity] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [liquidity, setLiquidity] = useState(0);
    const [liquidityPrice, setLiquidityPrice] = useState(0);
    const [errorMessageKey, setErrorMessageKey] = useState('');
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [openTradingDetailsModal, setOpenTradingDetailsModal] = useState(false);
    const [isAmmTradingDisabled, setIsAmmTradingDisabled] = useState(false);

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const isNonDefaultStable = selectedStableIndex !== 0 && isMultiCollateralSupported && isBuy;
    const isUpPosition = market.positionType === Positions.UP;
    const isInPosition = market.positionType === Positions.IN;

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && !isRangedMarket && !!market.address,
    });
    const rangedAmmMaxLimitsQuery = useRangedAMMMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && isRangedMarket && !!market.address,
    });

    useEffect(() => {
        let max = 0;
        let maxPrice = 0;
        let base = 0;
        let baseImpact = 0;
        let isTradingDisabled = false;
        if (isRangedMarket) {
            if (rangedAmmMaxLimitsQuery.isSuccess && rangedAmmMaxLimitsQuery.data) {
                const rangedAmmMaxLimits = rangedAmmMaxLimitsQuery.data;
                if (isInPosition) {
                    max = isBuy ? rangedAmmMaxLimits.in.maxBuy : rangedAmmMaxLimits.in.maxSell;
                    maxPrice = isBuy ? rangedAmmMaxLimits.in.maxBuyPrice : 0;
                    base = isBuy ? rangedAmmMaxLimits.in.buyPrice : rangedAmmMaxLimits.in.sellPrice;
                    baseImpact = rangedAmmMaxLimits.in.priceImpact;
                } else {
                    max = isBuy ? rangedAmmMaxLimits.out.maxBuy : rangedAmmMaxLimits.out.maxSell;
                    maxPrice = isBuy ? rangedAmmMaxLimits.out.maxBuyPrice : 0;
                    base = isBuy ? rangedAmmMaxLimits.out.buyPrice : rangedAmmMaxLimits.out.sellPrice;
                    baseImpact = rangedAmmMaxLimits.out.priceImpact;
                }
                isTradingDisabled =
                    !rangedAmmMaxLimits.in.maxBuy &&
                    !rangedAmmMaxLimits.in.maxSell &&
                    !rangedAmmMaxLimits.out.maxBuy &&
                    !rangedAmmMaxLimits.out.maxSell;
                setOutOfLiquidity(max < MINIMUM_AMM_LIQUIDITY);
            }
        } else {
            if (ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data) {
                const ammMaxLimits = ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data;
                if (isUpPosition) {
                    max = isBuy ? ammMaxLimits.maxBuyLong : ammMaxLimits.maxSellLong;
                    maxPrice = isBuy ? ammMaxLimits.maxBuyLongPrice : 0;
                    base = isBuy ? ammMaxLimits.buyLongPrice : ammMaxLimits.sellLongPrice;
                    baseImpact = isBuy ? ammMaxLimits.buyLongPriceImpact : ammMaxLimits.sellLongPriceImpact;
                } else {
                    max = isBuy ? ammMaxLimits.maxBuyShort : ammMaxLimits.maxSellShort;
                    maxPrice = isBuy ? ammMaxLimits.maxBuyShortPrice : 0;
                    base = isBuy ? ammMaxLimits.buyShortPrice : ammMaxLimits.sellShortPrice;
                    baseImpact = isBuy ? ammMaxLimits.buyShortPriceImpact : ammMaxLimits.sellShortPriceImpact;
                }
                isTradingDisabled = !ammMaxLimits.isMarketInAmmTrading;
                setOutOfLiquidity(max < MINIMUM_AMM_LIQUIDITY);
            }
        }
        setLiquidity(max);
        setLiquidityPrice(maxPrice);
        setBasePrice(base);
        setBasePriceImpact(baseImpact);
        setIsAmmTradingDisabled(isTradingDisabled);
    }, [isRangedMarket, ammMaxLimitsQuery, isUpPosition, rangedAmmMaxLimitsQuery, isInPosition, isBuy]);

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isMultiCollateralSupported,
    });

    const walletBalancesMap = useMemo(() => {
        return stableBalanceQuery.isSuccess ? stableBalanceQuery.data : null;
    }, [stableBalanceQuery]);

    const stableBalance = useMemo(() => {
        return isMultiCollateralSupported
            ? multipleStableBalances.isSuccess
                ? getStableCoinBalance(multipleStableBalances?.data, COLLATERALS[selectedStableIndex] as StableCoins)
                : null
            : getCurrencyKeyStableBalance(walletBalancesMap, getStableCoinForNetwork(networkId) as StableCoins);
    }, [networkId, multipleStableBalances, walletBalancesMap, selectedStableIndex, isMultiCollateralSupported]);

    // If sUSD balance is zero, select first stable with nonzero value as default
    useEffect(() => {
        if (
            multipleStableBalances?.data &&
            multipleStableBalances?.isSuccess &&
            selectedStableIndex == 0 &&
            isMultiCollateralSupported
        ) {
            const defaultStableBalance = getDefaultStableIndexByBalance(multipleStableBalances?.data);
            setSelectedStableIndex(defaultStableBalance);
        }
    }, [
        multipleStableBalances?.isSuccess,
        multipleStableBalances?.data,
        selectedStableIndex,
        isMultiCollateralSupported,
    ]);

    useEffect(() => {
        setSelectedStableIndex(userSelectedCollateral);
    }, [userSelectedCollateral]);

    const collateral = useMemo(() => {
        let address = undefined;
        let currency = '';
        if (isNonDefaultStable) {
            address =
                snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedStableIndex]?.address;
            currency = COLLATERALS[selectedStableIndex];
        } else {
            address = snxJSConnector.collateral?.address;
            currency = getStableCoinForNetwork(networkId);
        }

        return { address, currency };
    }, [selectedStableIndex, networkId, isNonDefaultStable]);

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase()
            ? getReferralWallet()
            : null;

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected && !isRangedMarket && !!market.address,
    });
    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(market.address, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isRangedMarket && !!market.address,
    });

    let optBalances = isRangedMarket ? { in: 0, out: 0 } : { short: 0, long: 0 };
    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data && !isRangedMarket) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }
    if (isWalletConnected && rangedMarketsBalance.isSuccess && rangedMarketsBalance.data && isRangedMarket) {
        optBalances = rangedMarketsBalance.data as RangedMarketBalanceInfo;
    }
    const tokenBalance = isRangedMarket
        ? market.positionType === Positions.IN
            ? optBalances.in || 0
            : optBalances.out || 0
        : market.positionType === Positions.UP
        ? optBalances.long || 0
        : optBalances.short || 0;

    const isPositionAmountPositive = Number(positionAmount) > 0;
    const isPositionPricePositive = Number(positionPrice) > 0;
    const isPaidAmountEntered = Number(paidAmount) > 0;

    const insufficientBalance = isBuy
        ? stableBalance < Number(paidAmount) || !stableBalance
        : tokenBalance < Number(paidAmount) || !tokenBalance;
    const isSlippagePercValid = isSlippageValid(Number(slippagePerc));

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

    const isDetailsIconDisabled =
        !isPaidAmountEntered ||
        !isPositionPricePositive ||
        !isPositionAmountPositive ||
        isSubmitting ||
        insufficientLiquidity ||
        isAmmTradingDisabled;

    const isFormDisabled = !market.address || isSubmitting || outOfLiquidity || isAmmTradingDisabled;

    const approvalCurrencyAddress = isBuy
        ? collateral.address
        : isRangedMarket
        ? market.positionType === Positions.IN
            ? (contextMarket as RangedMarketData).inAddress
            : (contextMarket as RangedMarketData).outAddress
        : market.positionType === Positions.UP
        ? (contextMarket as OptionsMarketInfo).longAddress
        : (contextMarket as OptionsMarketInfo).shortAddress;
    const approvalCurrency = isBuy ? collateral.currency : market.positionType;

    useEffect(() => {
        if (!approvalCurrencyAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(approvalCurrencyAddress, erc20Contract.abi, snxJSConnector.provider);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedMarket ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const getAllowance = async () => {
            try {
                const parsedAmount: BigNumber = isBuy
                    ? stableCoinParser(Number(paidAmount).toString(), networkId, COLLATERALS[selectedStableIndex])
                    : ethers.utils.parseEther(Number(paidAmount).toString());

                const allowance = await checkAllowance(parsedAmount, erc20Instance, walletAddress, addressToApprove);

                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected && erc20Instance.provider) {
            getAllowance();
        }
    }, [
        dispatch,
        approvalCurrencyAddress,
        networkId,
        paidAmount,
        selectedStableIndex,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        isRangedMarket,
        isBuy,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        if (!approvalCurrencyAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(approvalCurrencyAddress, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedMarket ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);
            const providerOptions = {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            };

            const tx = (await erc20Instance.approve(
                addressToApprove,
                approveAmount,
                providerOptions
            )) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsAllowing(false);
            setOpenApprovalModal(false);
        }
    };

    const resetData = () => {
        setPositionAmount('');
        setPositionPrice('');
        setPriceProfit('');
        setPriceImpact('');
        setErrorMessageKey('');
    };

    const fetchAmmPriceData = async (totalToPay: number, isRefresh: boolean, isSubmit = false, isMax = false) => {
        let priceChanged = false;
        if (!isRefresh && !isSubmit) {
            setIsFetchingQuote(true);
        }

        const calcPrice = !positionPrice ? Number(basePrice) : Number(positionPrice);
        if (market.address && totalToPay > 0 && calcPrice > 0 && liquidity > 0) {
            let suggestedAmount = isBuy ? totalToPay / calcPrice : totalToPay;
            if (isBuy && suggestedAmount > liquidity) {
                suggestedAmount = liquidity;
            }

            try {
                const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                const contract = isRangedMarket ? rangedMarketAMMContract : ammContract;

                const parsedAmount = ethers.utils.parseEther(suggestedAmount.toString());
                const promises = isRangedMarket
                    ? getQuoteFromRangedAMM(
                          isNonDefaultStable,
                          isBuy,
                          contract,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateral.address
                      )
                    : getQuoteFromAMM(
                          isNonDefaultStable,
                          isBuy,
                          contract,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateral.address
                      );

                const [ammQuotes, ammPriceImpact]: Array<BigNumber> = await Promise.all(promises);
                const ammQuote = isNonDefaultStable ? (ammQuotes as any)[0] : ammQuotes;
                const formattedAmmQuote = stableCoinFormatter(
                    ammQuote,
                    networkId,
                    isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                );

                const ammPrice = formattedAmmQuote / suggestedAmount;

                let calcAmount = totalToPay / ammPrice;
                if (isBuy && isMax) {
                    if (calcAmount >= liquidity) {
                        calcAmount = Number(truncToDecimals(liquidity));
                        setPaidAmount(truncToDecimals(calcAmount * ammPrice));
                    } else {
                        setPaidAmount(totalToPay);
                    }
                }

                setPositionAmount(isBuy ? calcAmount : formattedAmmQuote);
                setPositionPrice(ammPrice);
                setPriceImpact(ammPrice > 0 ? bigNumberFormatter(ammPriceImpact) - MIN_SCEW_IMPACT : 0);
                setPriceProfit(ammPrice > 0 && isBuy ? 1 / ammPrice - 1 : 0);

                // Between 2 calls ammPrice will be always different as it is based on position amount which is changed when price is changed
                priceChanged =
                    ammPrice < Number(positionPrice) * (1 - slippagePerc / 100) ||
                    ammPrice > Number(positionPrice) * (1 + slippagePerc / 100);
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
        return priceChanged;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

        const priceChanged = await fetchAmmPriceData(Number(paidAmount), true, true);
        if (priceChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again'), id));
            setIsSubmitting(false);
            return;
        }
        try {
            const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = (isRangedMarket ? rangedMarketAMMContract : ammContract).connect(signer);

            const parsedAmount = isBuy
                ? ethers.utils.parseEther(positionAmount.toString())
                : stableCoinParser(paidAmount.toString(), networkId);

            const parsedTotal = isBuy
                ? stableCoinParser(paidAmount.toString(), networkId)
                : ethers.utils.parseEther(positionAmount.toString());

            const parsedSlippage = ethers.utils.parseEther((slippagePerc / 100).toString());

            const providerOptions = {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            };

            const tx: ethers.ContractTransaction = await prepareTransactionForAMM(
                isNonDefaultStable,
                isBuy,
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
                        t(
                            `markets.market.trade-options.place-order.swap-confirm-button.${
                                isBuy ? 'buy' : 'sell'
                            }.confirmation-message`
                        ),
                        id
                    )
                );

                refetchBalances(walletAddress, networkId);
                isRangedMarket
                    ? refetchRangedAmmData(walletAddress, market.address, networkId)
                    : refetchAmmData(walletAddress, market.address);

                setIsSubmitting(false);

                resetData();
                setPaidAmount('');

                if (isBuy) {
                    trackEvent({
                        category: isRangedMarket ? 'RangeAMM' : 'AMM',
                        action: `buy-with-${COLLATERALS[selectedStableIndex]}`,
                        value: Number(paidAmount),
                    });
                } else {
                    trackEvent({
                        category: isRangedMarket ? 'RangeAMM' : 'AMM',
                        action: 'sell-to-amm',
                    });
                }
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsSubmitting(false);
        }
    };

    useDebouncedEffect(() => {
        fetchAmmPriceData(Number(paidAmount), false);
    }, [paidAmount, market.address, walletAddress, selectedStableIndex, market.positionType, liquidity]);

    useInterval(async () => {
        fetchAmmPriceData(Number(paidAmount), true);
    }, 30000);

    useEffect(() => {
        if (!market.address) {
            setPaidAmount('');
            setErrorMessageKey('');
        }
    }, [market.address]);

    useEffect(() => {
        setPaidAmount('');
    }, [isBuy]);

    useEffect(() => {
        let messageKey = '';

        if (insufficientLiquidity) {
            messageKey = 'common.errors.max-limit-exceeded';
        } else if (
            isWalletConnected &&
            market.address &&
            (isBuy
                ? (Number(paidAmount) > 0 && Number(paidAmount) > stableBalance) || stableBalance === 0
                : (Number(paidAmount) > 0 && Number(paidAmount) > tokenBalance) || tokenBalance === 0)
        ) {
            messageKey = 'common.errors.insufficient-balance-wallet';
        }

        setErrorMessageKey(messageKey);
    }, [paidAmount, stableBalance, insufficientLiquidity, t, isWalletConnected]);

    useEffect(() => {
        if (market.address && liquidity > 0) {
            setInsufficientLiquidity(isBuy ? Number(positionAmount) > liquidity : Number(paidAmount) > liquidity);
        }
    }, [positionAmount, paidAmount, liquidity, market.address, isBuy]);

    const onMaxClick = async () => {
        trackEvent({
            category: isRangedMarket ? 'RangeAMM' : 'AMM',
            action: 'click-on-max-button',
        });

        if (isBuy) {
            const maxPaidAmount = Number(truncToDecimals(Number(stableBalance) * (1 - slippagePerc / 100)));
            fetchAmmPriceData(maxPaidAmount, false, false, true);
        } else {
            setPaidAmount(truncToDecimals(tokenBalance, 8));
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (!market.address) {
            return <Button disabled={true}>{t('markets.amm-trading.select-price')}</Button>;
        }
        if (isAmmTradingDisabled) {
            return <Button disabled={true}>{t('markets.amm-trading.amm-disabled')}</Button>;
        }
        if (outOfLiquidity) {
            return <Button disabled={true}>{t(`common.errors.out-of-liquidity`)}</Button>;
        }
        if (insufficientLiquidity) {
            return <Button disabled={true}>{t(`common.errors.insufficient-liquidity`)}</Button>;
        }
        if (insufficientBalance) {
            return <Button disabled={true}>{t(`common.errors.insufficient-balance`)}</Button>;
        }
        if (!isPaidAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }
        if (!isSlippagePercValid) {
            return <Button disabled={true}>{t(`common.errors.enter-slippage`)}</Button>;
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? `${t('common.enable-wallet-access.approve')} ${approvalCurrency}`
                        : `${t('common.enable-wallet-access.approve-progress')} ${approvalCurrency}...`}
                </Button>
            );
        }
        return (
            <Button disabled={isButtonDisabled} onClick={handleSubmit}>
                {isSubmitting
                    ? t(
                          `markets.market.trade-options.place-order.swap-confirm-button.${
                              isBuy ? 'buy' : 'sell'
                          }.progress-label`
                      )
                    : t(`markets.market.trade-options.place-order.swap-confirm-button.${isBuy ? 'buy' : 'sell'}.label`)}
            </Button>
        );
    };

    return (
        <Container isDetailsPage={isDetailsPage}>
            {!isDetailsPage && (
                <TradingDetailsContainer>
                    <TradingDetailsSentence
                        currencyKey={currencyKey}
                        maturityDate={maturityDate}
                        market={market}
                        isRangedMarket={isRangedMarket}
                        isFetchingQuote={isFetchingQuote}
                        priceProfit={priceProfit}
                        paidAmount={paidAmount}
                        breakFirstLine={false}
                    />
                    <Tooltip
                        overlay={
                            isDetailsIconDisabled
                                ? t('markets.amm-trading.details-modal.tooltip-disabled')
                                : t('markets.amm-trading.details-modal.tooltip')
                        }
                    >
                        <DetailsIcon
                            className="icon icon--gear"
                            disabled={isDetailsIconDisabled}
                            onClick={() => !isDetailsIconDisabled && setOpenTradingDetailsModal(true)}
                        />
                    </Tooltip>
                </TradingDetailsContainer>
            )}
            <FinalizeTrade isDetailsPage={isDetailsPage}>
                <ColumnSpaceBetween>
                    <NumericInput
                        value={paidAmount}
                        disabled={isFormDisabled}
                        placeholder={t('markets.amm-trading.enter-amount')}
                        onChange={(_, value) => setPaidAmount(value)}
                        onMaxButton={onMaxClick}
                        showValidation={!!errorMessageKey}
                        validationMessage={t(errorMessageKey, {
                            currencyKey: isBuy
                                ? getStableCoinForNetwork(
                                      networkId,
                                      isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                                  )
                                : market.positionType,
                        })}
                        balance={
                            showWalletBalance && isWalletConnected
                                ? `${t('common.balance')}: ${formatCurrency(stableBalance)}`
                                : undefined
                        }
                        info={
                            showBuyLiquidity && market.address && (isDetailsPage ? liquidity : true)
                                ? `${t('markets.amm-trading.max-buy')}: ${formatCurrencyWithSign(
                                      USD_SIGN,
                                      truncToDecimals(liquidityPrice, 0),
                                      0
                                  )} (${formatCurrency(liquidity, 0)} ${market.positionType})`
                                : undefined
                        }
                        currencyComponent={
                            isBuy && isMultiCollateralSupported ? (
                                <CollateralSelector
                                    collateralArray={COLLATERALS}
                                    selectedItem={selectedStableIndex}
                                    onChangeCollateral={(index) => setSelectedStableIndex(index)}
                                    disabled={isFormDisabled}
                                />
                            ) : undefined
                        }
                        currencyLabel={
                            isBuy
                                ? !isMultiCollateralSupported
                                    ? getStableCoinForNetwork(networkId)
                                    : undefined
                                : market.positionType
                        }
                    />
                    {isDetailsPage && (
                        <>
                            <TradingDetails
                                positionType={market.positionType}
                                positionPrice={Number(positionPrice) > 0 ? Number(positionPrice) : Number(basePrice)}
                                positionBonus={convertPriceImpactToBonus(
                                    Number(positionPrice) > 0 ? Number(priceImpact) : Number(basePriceImpact)
                                )}
                                positionAmount={Number(positionPrice) > 0 ? Number(positionAmount) : 0}
                                paidAmount={Number(paidAmount)}
                                selectedStable={getStableCoinForNetwork(
                                    networkId,
                                    isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                                )}
                                profit={Number(priceProfit) * Number(paidAmount)}
                                isLoading={isFetchingQuote}
                                isBuy={isBuy}
                            />
                            <SkewSlippageDetails
                                skew={Number(positionPrice) > 0 ? Number(priceImpact) : Number(basePriceImpact)}
                                slippage={slippagePerc}
                                setSlippage={setSlippagePerc}
                                hideScew={isRangedMarket && !isBuy}
                            />
                        </>
                    )}
                    {getSubmitButton()}
                </ColumnSpaceBetween>
            </FinalizeTrade>
            {openTradingDetailsModal && (
                <TradingDetailsModal
                    currencyKey={currencyKey}
                    maturityDate={maturityDate}
                    strikePrice={(market as MarketInfo).strikePrice}
                    leftStrikePrice={(market as RangedMarketPerPosition).leftPrice}
                    rightStrikePrice={(market as RangedMarketPerPosition).rightPrice}
                    positionType={market.positionType}
                    positionPrice={Number(positionPrice) > 0 ? Number(positionPrice) : Number(basePrice)}
                    positionBonus={convertPriceImpactToBonus(
                        Number(positionPrice) > 0 ? Number(priceImpact) : Number(basePriceImpact)
                    )}
                    positionAmount={Number(positionPrice) > 0 ? Number(positionAmount) : 0}
                    paidAmount={Number(paidAmount)}
                    selectedStable={getStableCoinForNetwork(
                        networkId,
                        isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                    )}
                    profit={Number(priceProfit) * Number(paidAmount)}
                    skew={Number(positionPrice) > 0 ? Number(priceImpact) : Number(basePriceImpact)}
                    slippage={slippagePerc}
                    setSlippage={setSlippagePerc}
                    tradingDetailsSentence={
                        <TradingDetailsSentence
                            currencyKey={currencyKey}
                            maturityDate={maturityDate}
                            market={market}
                            isRangedMarket={isRangedMarket}
                            isFetchingQuote={isFetchingQuote}
                            priceProfit={priceProfit}
                            paidAmount={paidAmount}
                            breakFirstLine={true}
                        />
                    }
                    onClose={() => setOpenTradingDetailsModal(false)}
                />
            )}
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(ONE_HUNDRED_AND_THREE_PERCENT * Number(paidAmount))}
                    tokenSymbol={approvalCurrency}
                    isNonStable={!isBuy}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Container>
    );
};

export default AmmTrading;
