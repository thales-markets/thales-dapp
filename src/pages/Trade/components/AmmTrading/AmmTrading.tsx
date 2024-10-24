import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import CollateralSelector from 'components/CollateralSelector';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import Tooltip from 'components/Tooltip';
import NumericInput from 'components/fields/NumericInput/NumericInput';
import { PLAUSIBLE, PLAUSIBLE_KEYS } from 'constants/analytics';
import { USD_SIGN } from 'constants/currency';
import {
    MINIMUM_AMM_LIQUIDITY,
    MIN_SCEW_IMPACT,
    ONE_HUNDRED_AND_THREE_PERCENT,
    POSITIONS_TO_SIDE_MAP,
    SLIPPAGE_PERCENTAGE,
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
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsBuy } from 'redux/modules/marketWidgets';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getSelectedCollateralIndex, getWalletAddress } from 'redux/modules/wallet';
import {
    bigNumberFormatter,
    coinFormatter,
    coinParser,
    formatCurrency,
    formatCurrencyWithSign,
    roundNumberToDecimals,
    truncToDecimals,
} from 'thales-utils';
import {
    AccountMarketInfo,
    MarketInfo,
    OptionsMarketInfo,
    RangedMarketBalanceInfo,
    RangedMarketData,
    RangedMarketPerPosition,
} from 'types/options';
import { getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getCoinBalance, getCollateral, getCollaterals, getDefaultCollateral } from 'utils/currency';
import { checkAllowance, getIsMultiCollateralSupported } from 'utils/network';
import { convertPriceImpactToBonus, getContractForInteraction } from 'utils/options';
import { refetchAmmData, refetchBalances, refetchRangedAmmData } from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';
import SharePositionModal from './components/SharePositionModal/SharePositionModal';
import SkewSlippageDetails from './components/SkewSlippageDetails/SkewSlippageDetails';
import { isSlippageValid } from './components/Slippage/Slippage';
import TradingDetails from './components/TradingDetails';
import TradingDetailsModal from './components/TradingDetailsModal';
import TradingDetailsSentence from './components/TradingDetailsSentence';
import {
    CollateralText,
    ColumnSpaceBetween,
    Container,
    DetailsIcon,
    FinalizeTrade,
    ShareIcon,
    TradingDetailsContainer,
} from './styled-components';

type AmmTradingProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition;
    isDetailsPage?: boolean;
    showBuyLiquidity?: boolean;
    showWalletBalance?: boolean;
    isDeprecatedCurrency: boolean;
};

const AmmTrading: React.FC<AmmTradingProps> = ({
    currencyKey,
    maturityDate,
    market,
    isDetailsPage,
    showBuyLiquidity,
    showWalletBalance,
    isDeprecatedCurrency,
}) => {
    const isRangedMarket = [Positions.IN, Positions.OUT].includes(market.positionType);
    const rangedMarket = useRangedMarketContext();
    const directMarket = useMarketContext();
    const contextMarket = isRangedMarket ? rangedMarket : directMarket;
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const { openConnectModal } = useConnectModal();

    const isAppReady = useSelector(getIsAppReady);
    const networkId = useSelector(getNetworkId);
    const isWalletConnected = useSelector(getIsWalletConnected);
    const walletAddress = useSelector(getWalletAddress) || '';
    const selectedCollateralIndexSelector = useSelector(getSelectedCollateralIndex);
    const isBuy = useSelector(getIsBuy) || !isDetailsPage;
    const isMobile = useSelector(getIsMobile);

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
    const [openTwitterShareModal, setOpenTwitterShareModal] = useState(false);

    // Still not supporting all collaterals
    const selectedCollateralIndex = useMemo(
        () =>
            selectedCollateralIndexSelector < getCollaterals(networkId, isDeprecatedCurrency).length
                ? selectedCollateralIndexSelector
                : 0,
        [isDeprecatedCurrency, networkId, selectedCollateralIndexSelector]
    );

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId, isDeprecatedCurrency);
    const isBuyWithNonDefaultCollateral = selectedCollateralIndex !== 0 && isMultiCollateralSupported && isBuy;
    const isUpPosition = market.positionType === Positions.UP;
    const isInPosition = market.positionType === Positions.IN;

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(market.address, networkId, isDeprecatedCurrency, {
        enabled: isAppReady && !isRangedMarket && !!market.address,
    });
    const rangedAmmMaxLimitsQuery = useRangedAMMMaxLimitsQuery(market.address, networkId, isDeprecatedCurrency, {
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

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, isDeprecatedCurrency, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isMultiCollateralSupported,
    });

    const walletBalancesMap = useMemo(() => {
        return stableBalanceQuery.isSuccess ? stableBalanceQuery.data : null;
    }, [stableBalanceQuery]);

    const defaultCollateral = useMemo(() => getDefaultCollateral(networkId, isDeprecatedCurrency), [
        isDeprecatedCurrency,
        networkId,
    ]);
    const selectedCollateral = useMemo(() => getCollateral(networkId, selectedCollateralIndex, isDeprecatedCurrency), [
        isDeprecatedCurrency,
        networkId,
        selectedCollateralIndex,
    ]);

    const stableBalance = useMemo(() => {
        return isMultiCollateralSupported
            ? multipleStableBalances.isSuccess
                ? getCoinBalance(multipleStableBalances?.data, selectedCollateral)
                : null
            : getCurrencyKeyStableBalance(walletBalancesMap, defaultCollateral);
    }, [multipleStableBalances, walletBalancesMap, isMultiCollateralSupported, defaultCollateral, selectedCollateral]);

    const collateralAddress = useMemo(() => {
        return isMultiCollateralSupported
            ? snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedCollateral]?.address
            : getContractForInteraction(
                  networkId,
                  isDeprecatedCurrency,
                  snxJSConnector.collateral,
                  snxJSConnector.collateralUSDC
              )?.address;
    }, [isMultiCollateralSupported, selectedCollateral, networkId, isDeprecatedCurrency]);

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase()
            ? getReferralWallet()
            : null;

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(
        market.address,
        walletAddress,
        networkId,
        isDeprecatedCurrency,
        {
            enabled: isAppReady && isWalletConnected && !isRangedMarket && !!market.address,
        }
    );
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
        ? collateralAddress
        : isRangedMarket
        ? market.positionType === Positions.IN
            ? (contextMarket as RangedMarketData).inAddress
            : (contextMarket as RangedMarketData).outAddress
        : market.positionType === Positions.UP
        ? (contextMarket as OptionsMarketInfo).longAddress
        : (contextMarket as OptionsMarketInfo).shortAddress;
    const approvalCurrency = isBuy ? selectedCollateral : market.positionType;

    useEffect(() => {
        if (!approvalCurrencyAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(approvalCurrencyAddress, erc20Contract.abi, snxJSConnector.provider);
        const { ammContract, ammUSDCContract, rangedMarketAMMContract, rangedMarketsAMMUSDCContract } = snxJSConnector;
        const ammContractForInteraction = getContractForInteraction(
            networkId,
            isDeprecatedCurrency,
            ammContract,
            ammUSDCContract
        );
        const rangedMarketAMMContractForInteraction = getContractForInteraction(
            networkId,
            isDeprecatedCurrency,
            rangedMarketAMMContract,
            rangedMarketsAMMUSDCContract
        );
        const addressToApprove =
            (isRangedMarket ? rangedMarketAMMContractForInteraction?.address : ammContractForInteraction?.address) ||
            '';

        const getAllowance = async () => {
            try {
                const parsedAmount: BigNumber = isBuy
                    ? coinParser(Number(paidAmount).toString(), networkId, selectedCollateral)
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
        approvalCurrencyAddress,
        networkId,
        paidAmount,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        isRangedMarket,
        isBuy,
        selectedCollateral,
        isDeprecatedCurrency,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        if (!approvalCurrencyAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(approvalCurrencyAddress, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, ammUSDCContract, rangedMarketAMMContract, rangedMarketsAMMUSDCContract } = snxJSConnector;
        const ammContractForInteraction = getContractForInteraction(
            networkId,
            isDeprecatedCurrency,
            ammContract,
            ammUSDCContract
        );
        const rangedMarketAMMContractForInteraction = getContractForInteraction(
            networkId,
            isDeprecatedCurrency,
            rangedMarketAMMContract,
            rangedMarketsAMMUSDCContract
        );
        const addressToApprove =
            (isRangedMarket ? rangedMarketAMMContractForInteraction?.address : ammContractForInteraction?.address) ||
            '';

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);

            const tx = (await erc20Instance.approve(addressToApprove, approveAmount)) as ethers.ContractTransaction;
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
                const {
                    ammContract,
                    ammUSDCContract,
                    rangedMarketAMMContract,
                    rangedMarketsAMMUSDCContract,
                } = snxJSConnector;
                const ammContractForInteraction = getContractForInteraction(
                    networkId,
                    isDeprecatedCurrency,
                    ammContract,
                    ammUSDCContract
                );
                const rangedMarketAMMContractForInteraction = getContractForInteraction(
                    networkId,
                    isDeprecatedCurrency,
                    rangedMarketAMMContract,
                    rangedMarketsAMMUSDCContract
                );
                const contract = isRangedMarket ? rangedMarketAMMContractForInteraction : ammContractForInteraction;

                const parsedAmount = ethers.utils.parseEther(suggestedAmount.toString());
                const promises = isRangedMarket
                    ? getQuoteFromRangedAMM(
                          isBuyWithNonDefaultCollateral,
                          isBuy,
                          contract,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateralAddress
                      )
                    : getQuoteFromAMM(
                          isBuyWithNonDefaultCollateral,
                          isBuy,
                          contract,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateralAddress
                      );

                const [ammQuotes, ammPriceImpact]: Array<BigNumber> = await Promise.all(promises);
                const ammQuote = isBuyWithNonDefaultCollateral ? (ammQuotes as any)[0] : ammQuotes;
                const formattedAmmQuote = coinFormatter(
                    ammQuote,
                    networkId,
                    isBuy ? selectedCollateral : undefined,
                    isDeprecatedCurrency
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
            const {
                ammContract,
                ammUSDCContract,
                rangedMarketAMMContract,
                rangedMarketsAMMUSDCContract,
                signer,
            } = snxJSConnector;
            const ammContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                ammContract,
                ammUSDCContract
            );
            const rangedMarketAMMContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                rangedMarketAMMContract,
                rangedMarketsAMMUSDCContract
            );
            if (signer && ammContractForInteraction && rangedMarketAMMContractForInteraction) {
                const ammContractWithSigner = (isRangedMarket
                    ? rangedMarketAMMContractForInteraction
                    : ammContractForInteraction
                ).connect(signer);

                const amount = isBuy ? positionAmount : paidAmount;
                const parsedAmount = ethers.utils.parseEther(amount.toString());

                const total = isBuy ? paidAmount : positionAmount;
                const parsedTotal = coinParser(total.toString(), networkId, undefined, isDeprecatedCurrency);

                const parsedSlippage = ethers.utils.parseEther((slippagePerc / 100).toString());

                const tx: ethers.ContractTransaction = await prepareTransactionForAMM(
                    isBuyWithNonDefaultCollateral,
                    isBuy,
                    ammContractWithSigner,
                    market.address,
                    POSITIONS_TO_SIDE_MAP[market.positionType],
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage,
                    collateralAddress,
                    referral,
                    networkId
                );

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t(`common.${isBuy ? 'buy' : 'sell'}.confirmation-message`), id)
                    );

                    refetchBalances(walletAddress, networkId, isDeprecatedCurrency);
                    isRangedMarket
                        ? refetchRangedAmmData(walletAddress, market.address, networkId, isDeprecatedCurrency)
                        : refetchAmmData(walletAddress, market.address, isDeprecatedCurrency);

                    setIsSubmitting(false);

                    resetData();
                    setPaidAmount('');

                    if (isBuy) {
                        trackEvent({
                            category: isRangedMarket ? 'RangeAMM' : 'AMM',
                            action: `buy-with-${selectedCollateral}`,
                            value: Number(paidAmount),
                        });
                        PLAUSIBLE.trackEvent(
                            isRangedMarket ? PLAUSIBLE_KEYS.buyFromRangeAMM : PLAUSIBLE_KEYS.buyFromAMM,
                            {
                                props: {
                                    value: Number(paidAmount),
                                    collateral: getCollateral(networkId, selectedCollateralIndex, isDeprecatedCurrency),
                                    networkId,
                                },
                            }
                        );
                    } else {
                        trackEvent({
                            category: isRangedMarket ? 'RangeAMM' : 'AMM',
                            action: 'sell-to-amm',
                        });
                        PLAUSIBLE.trackEvent(
                            isRangedMarket ? PLAUSIBLE_KEYS.sellToRangeAMM : PLAUSIBLE_KEYS.sellToAMM,
                            {
                                props: {
                                    value: Number(paidAmount),
                                    collateral: getCollateral(networkId, selectedCollateralIndex, isDeprecatedCurrency),
                                    networkId,
                                },
                            }
                        );
                    }
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
    }, [paidAmount, market.address, walletAddress, selectedCollateralIndex, market.positionType, liquidity]);

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
    }, [paidAmount, stableBalance, insufficientLiquidity, isWalletConnected, isBuy, market.address, tokenBalance]);

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
                    {isAllowing
                        ? t('common.enable-wallet-access.approve-progress')
                        : t('common.enable-wallet-access.approve')}
                    <CollateralText>&nbsp;{approvalCurrency}</CollateralText>
                    {isAllowing ? '...' : ''}
                </Button>
            );
        }
        return (
            <Button disabled={isButtonDisabled} onClick={handleSubmit}>
                {isSubmitting
                    ? t(`common.${isBuy ? 'buy' : 'sell'}.progress-label`)
                    : t(`common.${isBuy ? 'buy' : 'sell'}.label`)}
            </Button>
        );
    };

    return (
        <Container isDetailsPage={isDetailsPage} className={isMobile ? '' : 'step-4'}>
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
                        isDeprecatedCurrency={isDeprecatedCurrency}
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
                    <ShareIcon
                        className="icon-home icon-home--twitter-x"
                        disabled={isButtonDisabled}
                        onClick={() => !isButtonDisabled && setOpenTwitterShareModal(true)}
                    />
                </TradingDetailsContainer>
            )}
            <FinalizeTrade isDetailsPage={isDetailsPage} className={isMobile ? 'step-4' : ''}>
                <ColumnSpaceBetween>
                    <NumericInput
                        value={paidAmount}
                        disabled={isFormDisabled}
                        placeholder={t('common.enter-amount')}
                        onChange={(_, value) => setPaidAmount(value)}
                        onMaxButton={onMaxClick}
                        showValidation={!!errorMessageKey}
                        validationMessage={t(errorMessageKey, {
                            currencyKey: isBuy ? selectedCollateral : market.positionType,
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
                                    collateralArray={getCollaterals(networkId, isDeprecatedCurrency)}
                                    selectedItem={selectedCollateralIndex}
                                    onChangeCollateral={() => {}}
                                    disabled={isFormDisabled}
                                />
                            ) : undefined
                        }
                        currencyLabel={
                            isBuy ? (!isMultiCollateralSupported ? defaultCollateral : undefined) : market.positionType
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
                                selectedStable={selectedCollateral}
                                profit={Number(priceProfit) * Number(paidAmount)}
                                isLoading={isFetchingQuote}
                                isBuy={isBuy}
                                isDeprecatedCurrency={isDeprecatedCurrency}
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
                    selectedStable={selectedCollateral}
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
                            isDeprecatedCurrency={isDeprecatedCurrency}
                        />
                    }
                    onClose={() => setOpenTradingDetailsModal(false)}
                    isDeprecatedCurrency={isDeprecatedCurrency}
                />
            )}
            {openTwitterShareModal && (
                <SharePositionModal
                    type="potential"
                    position={market.positionType}
                    currencyKey={currencyKey}
                    strikeDate={maturityDate}
                    strikePrice={(market as MarketInfo)?.strikePrice ?? 0}
                    leftPrice={(market as RangedMarketPerPosition).leftPrice}
                    rightPrice={(market as RangedMarketPerPosition).rightPrice}
                    buyIn={Number(paidAmount)}
                    payout={Number(priceProfit) * Number(paidAmount) + Number(paidAmount)}
                    onClose={() => setOpenTwitterShareModal(false)}
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
