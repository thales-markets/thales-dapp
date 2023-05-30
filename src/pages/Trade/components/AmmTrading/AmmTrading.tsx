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
    MIN_SCEW_IMPACT,
    POSITIONS_TO_SIDE_MAP,
    Positions,
    SLIPPAGE_PERCENTAGE,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { ScreenSizeBreakpoint, getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
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
import { getEstimatedGasFees, getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getDefaultStableIndexByBalance, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { bigNumberFormatter, stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import {
    countDecimals,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    roundNumberToDecimals,
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
import { refetchAmmData, refetchBalances, refetchRangedAmmData } from 'utils/queryConnector';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';
import TradingDetailsModal from './components/TradingDetailsModal';
import TradingDetailsSection from './components/TradingDetails';
import { convertPriceImpactToBonus } from 'utils/options';
import NumericInput from 'components/fields/NumericInput/NumericInput';
import SkewSlippageDetails from './components/SkewSlippageDetails/SkewSlippageDetails';
import { isSlippageValid } from './components/Slippage/Slippage';

type AmmTradingProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition;
    isDetailsPage?: boolean;
};

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

const AmmTrading: React.FC<AmmTradingProps> = ({ currencyKey, maturityDate, market, isDetailsPage }) => {
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
    const [priceImpact, setPriceImpact] = useState<number | string>('');
    const [basePriceImpact, setBasePriceImpact] = useState<number | string>('');
    const [slippagePerc, setSlippagePerc] = useState<number>(SLIPPAGE_PERCENTAGE[2]);
    const [priceProfit, setPriceProfit] = useState<number | string>('');
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [hasAllowance, setAllowance] = useState(false);
    const [isFetchingQuote, setIsFetchingQuote] = useState(false);
    const [selectedStableIndex, setSelectedStableIndex] = useState(userSelectedCollateral);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
    const [outOfLiquidity, setOutOfLiquidity] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [liquidity, setLiquidity] = useState(0);
    const [errorMessageKey, setErrorMessageKey] = useState('');
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [openTradingDetailsModal, setOpenTradingDetailsModal] = useState(false);

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
        enabled: isAppReady && isWalletConnected && isMultiCollateralSupported,
    });

    const ammMaxLimits = useMemo(() => {
        return ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data ? ammMaxLimitsQuery.data : undefined;
    }, [ammMaxLimitsQuery.data, ammMaxLimitsQuery.isSuccess]);

    const rangedAmmMaxLimits = useMemo(() => {
        return rangedAmmMaxLimitsQuery.isSuccess && rangedAmmMaxLimitsQuery.data
            ? rangedAmmMaxLimitsQuery.data
            : undefined;
    }, [rangedAmmMaxLimitsQuery.data, rangedAmmMaxLimitsQuery.isSuccess]);

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
    const isUpPosition = market.positionType === Positions.UP;
    const isInPosition = market.positionType === Positions.IN;

    const insufficientBalance = stableBalance < Number(paidAmount) || !stableBalance;
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
        (isRangedAmm ? isRangedAmmTradingDisabled : isAmmTradingDisabled) ||
        !hasAllowance;

    const isFormDisabled =
        !market.address ||
        isSubmitting ||
        outOfLiquidity ||
        (isRangedAmm ? isRangedAmmTradingDisabled : isAmmTradingDisabled);
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

    const resetData = () => {
        setPositionAmount('');
        setPositionPrice('');
        setPriceProfit('');
        setPriceImpact('');
        setGasLimit(null);
        setErrorMessageKey('');
    };

    const fetchGasLimit = useCallback(
        async (marketAddress: string, side: any, parsedAmount: any, parsedTotal: any, parsedSlippage: any) => {
            try {
                const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                const contract = isRangedAmm ? rangedMarketAMMContract : ammContract;

                if (isOVM) {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                } else if (isBSC || isPolygon || isArbitrum) {
                    const gasLimit = await getEstimatedGasFees(
                        isNonDefaultStable,
                        true,
                        contract,
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
            let suggestedAmount = totalToPay / calcPrice;
            if (isMax && suggestedAmount >= liquidity) {
                suggestedAmount = liquidity;
            }

            try {
                const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                const contract = isRangedAmm ? rangedMarketAMMContract : ammContract;

                const parsedAmount = ethers.utils.parseEther(suggestedAmount.toString());
                const promises = isRangedAmm
                    ? getQuoteFromRangedAMM(
                          isNonDefaultStable,
                          true,
                          contract,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateral.address
                      )
                    : getQuoteFromAMM(
                          isNonDefaultStable,
                          true,
                          contract,
                          parsedAmount,
                          market.address,
                          POSITIONS_TO_SIDE_MAP[market.positionType],
                          collateral.address
                      );

                const [ammQuotes, ammPriceImpact]: Array<BigNumber> = await Promise.all(promises);
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
                        calcAmount = Number(truncToDecimals(liquidity));
                        setPaidAmount(calcAmount * ammPrice);
                    } else {
                        setPaidAmount(totalToPay);
                    }
                }

                setPositionAmount(calcAmount);
                setPositionPrice(ammPrice);
                setPriceImpact(ammPrice > 0 ? bigNumberFormatter(ammPriceImpact) - MIN_SCEW_IMPACT : 0);
                setPriceProfit(ammPrice > 0 ? 1 / ammPrice - 1 : 0);

                const parsedSlippage = ethers.utils.parseEther((slippagePerc / 100).toString());
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
        return { priceChanged, latestGasLimit };
    };

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(collateral.address as any, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedAmm ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const gasPrice = await snxJSConnector.provider?.getGasPrice();
        const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

        const id = toast.loading(t('amm.progress'));
        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, approveAmount);
            const providerOptions = getProvider(gasEstimate, gasInGwei, networkId);

            const tx = (await erc20Instance.approve(
                addressToApprove,
                approveAmount,
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
            const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = (isRangedAmm ? rangedMarketAMMContract : ammContract).connect(signer);

            const parsedAmount = ethers.utils.parseEther(positionAmount.toString());
            const parsedTotal = stableCoinParser(paidAmount.toString(), networkId);
            const parsedSlippage = ethers.utils.parseEther((slippagePerc / 100).toString());
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
    }, [paidAmount, market.address, walletAddress, selectedStableIndex, market.positionType]);

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

    useEffect(() => {
        if (!collateral.address) {
            return;
        }
        const erc20Instance = new ethers.Contract(
            collateral.address as any,
            erc20Contract.abi,
            snxJSConnector.provider
        );
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
        if (isWalletConnected && erc20Instance.provider) {
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
        const parsedSlippage = ethers.utils.parseEther((slippagePerc / 100).toString());
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
        slippagePerc,
    ]);

    useEffect(() => {
        let max = 0;
        let base = 0;
        let baseImpact = 0;
        console.log(isRangedAmm, rangedAmmMaxLimits);
        if (isRangedAmm) {
            if (rangedAmmMaxLimits) {
                if (isInPosition) {
                    max = rangedAmmMaxLimits.in.maxBuy;
                    base = rangedAmmMaxLimits.in.buyPrice;
                    baseImpact = rangedAmmMaxLimits.in.priceImpact;
                } else {
                    max = rangedAmmMaxLimits.out.maxBuy;
                    base = rangedAmmMaxLimits.out.buyPrice;
                    baseImpact = rangedAmmMaxLimits.out.priceImpact;
                }
            }
        } else if (ammMaxLimits) {
            if (isUpPosition) {
                max = ammMaxLimits.maxBuyLong;
                base = ammMaxLimits.buyLongPrice;
                baseImpact = ammMaxLimits.buyLongPriceImpact;
            } else {
                max = ammMaxLimits.maxBuyShort;
                base = ammMaxLimits.buyShortPrice;
                baseImpact = ammMaxLimits.buyShortPriceImpact;
            }
        }
        setLiquidity(max);
        setBasePrice(base);
        setBasePriceImpact(baseImpact);
        setOutOfLiquidity(max < MINIMUM_AMM_LIQUIDITY);
    }, [isRangedAmm, ammMaxLimits, isUpPosition, rangedAmmMaxLimits, isInPosition]);

    useEffect(() => {
        let messageKey = '';

        if (insufficientLiquidity) {
            messageKey = 'common.errors.max-limit-exceeded';
        } else if (
            isWalletConnected &&
            market.address &&
            ((Number(paidAmount) > 0 && Number(paidAmount) > stableBalance) || stableBalance === 0)
        ) {
            messageKey = 'common.errors.insufficient-balance-wallet';
        }

        setErrorMessageKey(messageKey);
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

        if (isFormDisabled) return;

        const maxPaidAmount = Number(truncToDecimals(Number(stableBalance) * (1 - slippagePerc / 100)));
        fetchAmmPriceData(maxPaidAmount, false, false, true);
    };

    const getSubmitButton = () => {
        if (!market.address) {
            return <Button disabled={true}>{t('options.trade.amm-trading.select-price')}</Button>;
        }
        if (isRangedAmm ? isRangedAmmTradingDisabled : isAmmTradingDisabled) {
            return <Button disabled={true}>{t('amm.amm-disabled')}</Button>;
        }
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
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
                <Button
                    additionalStyles={{ textTransform: 'none' }}
                    disabled={isAllowing}
                    onClick={() => setOpenApprovalModal(true)}
                >
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve').toUpperCase() + ' ' + collateral.currency
                        : t('common.enable-wallet-access.approve-progress').toUpperCase() +
                          ' ' +
                          collateral.currency +
                          '...'}
                </Button>
            );
        }
        return (
            <Button disabled={isButtonDisabled} onClick={handleSubmit}>
                {isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.buy.progress-label`)
                    : t(`options.market.trade-options.place-order.swap-confirm-button.buy.label`)}
            </Button>
        );
    };

    const potentialWinFormatted = isFetchingQuote
        ? '...'
        : `${formatCurrencyWithKey(
              getStableCoinForNetwork(networkId),
              Number(priceProfit) * Number(paidAmount) + Number(paidAmount)
          )}`;

    const positionTypeFormatted =
        market.positionType === Positions.UP
            ? t('options.common.above')
            : market.positionType === Positions.DOWN
            ? t('options.common.below')
            : market.positionType === Positions.IN
            ? t('options.common.between')
            : t('options.common.not-between');

    const getTradingDetailsAsSentence = (breakFirstLine: boolean) => {
        return (
            <ColumnSpaceBetween>
                <FlexDivCentered>
                    <Text>
                        <TextLabel>{t('options.trade.amm-trading.asset-price', { asset: currencyKey })}</TextLabel>
                        {market.address ? (
                            <>
                                <TextValue uppercase={true}>{positionTypeFormatted}</TextValue>
                                {isRangedAmm ? (
                                    !breakFirstLine && (
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
                                    )
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
                {breakFirstLine && isRangedAmm && market.address && (
                    <FlexDivCentered>
                        <Text>
                            <TextValue>
                                {formatCurrencyWithSign(USD_SIGN, (market as RangedMarketPerPosition).leftPrice)}
                            </TextValue>
                            <Text>
                                <TextLabel>{' ' + t('options.common.and')}</TextLabel>
                            </Text>
                            <TextValue>
                                {formatCurrencyWithSign(USD_SIGN, (market as RangedMarketPerPosition).rightPrice)}
                            </TextValue>
                        </Text>
                    </FlexDivCentered>
                )}
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
                                ? potentialWinFormatted
                                : '( ' + t('options.trade.amm-trading.based-amount') + ' )'}
                        </TextValue>
                    </Text>
                </FlexDivCentered>
            </ColumnSpaceBetween>
        );
    };

    return (
        <Container isDetailsPage={isDetailsPage}>
            {!isDetailsPage && (
                <TradingDetails>
                    {getTradingDetailsAsSentence(false)}
                    <DetailsIcon
                        className="icon icon--gear"
                        disabled={isButtonDisabled}
                        onClick={() => !isButtonDisabled && setOpenTradingDetailsModal(true)}
                    />
                </TradingDetails>
            )}
            <FinalizeTrade isDetailsPage={isDetailsPage}>
                <ColumnSpaceBetween>
                    <NumericInput
                        value={paidAmount}
                        disabled={isFormDisabled}
                        placeholder={t('options.trade.amm-trading.enter-amount')}
                        onChange={(_, value) => onTotalPriceValueChange(value)}
                        onMaxButton={onMaxClick}
                        showValidation={!!errorMessageKey}
                        validationMessage={t(errorMessageKey, {
                            currencyKey: getStableCoinForNetwork(
                                networkId,
                                isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                            ),
                        })}
                        currencyComponent={
                            isMultiCollateralSupported ? (
                                <CollateralSelector
                                    collateralArray={COLLATERALS}
                                    selectedItem={selectedStableIndex}
                                    onChangeCollateral={(index) => setSelectedStableIndex(index)}
                                    disabled={isFormDisabled}
                                />
                            ) : undefined
                        }
                        currencyLabel={!isMultiCollateralSupported ? getStableCoinForNetwork(networkId) : undefined}
                    />
                    {isDetailsPage && (
                        <>
                            <TradingDetailsSection
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
                            />
                            <SkewSlippageDetails
                                skew={Number(positionPrice) > 0 ? Number(priceImpact) : Number(basePriceImpact)}
                                slippage={slippagePerc}
                                setSlippage={setSlippagePerc}
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
                    tradingDetailsSentence={getTradingDetailsAsSentence(true)}
                    onClose={() => setOpenTradingDetailsModal(false)}
                />
            )}
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(ONE_HUNDRED_AND_THREE_PERCENT * Number(paidAmount))}
                    tokenSymbol={collateral.currency}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Container>
    );
};

const Container = styled(FlexDivRow)<{ isDetailsPage?: boolean }>`
    height: ${(props) => (props.isDetailsPage ? 'auto' : '78px')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        min-width: initial;
        height: 100%;
        flex-direction: column;
    }
`;

const TradingDetails = styled(FlexDivRowCentered)`
    position: relative;
    width: 600px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        width: 100%;
        margin-bottom: 10px;
    }
`;

const FinalizeTrade = styled(FlexDivCentered)<{ isDetailsPage?: boolean }>`
    width: ${(props) => (props.isDetailsPage ? '100%' : '350px')};
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        width: 100%;
    }
`;

const DetailsIcon = styled.i<{ disabled: boolean }>`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    color: ${(props) => props.theme.textColor.secondary};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`;

const Text = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
`;

const TextLabel = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
`;

const TextValue = styled.span<{ isProfit?: boolean; uppercase?: boolean }>`
    color: ${(props) => (props.isProfit ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    padding-left: 5px;
    text-transform: ${(props) => (props.uppercase ? 'uppercase;' : 'initial')};
`;

const ColumnSpaceBetween = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default AmmTrading;
