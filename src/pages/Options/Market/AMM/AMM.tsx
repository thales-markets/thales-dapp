import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';
import { COLORS, MarketWidgetKey } from '../../../../constants/ui';
import {
    FlexDiv,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivEnd,
    FlexDivRow,
    FlexDivRowCentered,
} from '../../../../theme/common';
import { ReactComponent as WalletIcon } from '../../../../assets/images/wallet-dark.svg';
import {
    Container,
    CurrencyLabel,
    FilterButton,
    InputLabel,
    ReactSelect,
    InputContainer,
    ShortInputContainer,
    SliderContainer,
    SliderRange,
    SubmitButton,
    SubmitButtonContainer,
    Wallet,
    WalletContainer,
    SummaryContainer,
    Divider,
    StyledQuestionMarkIcon,
    LightMediumTooltip,
    BetaBadge,
} from '../components';
import { formatCurrencyWithKey, formatPercentage, truncToDecimals } from '../../../../utils/formatters/number';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from '../../../../constants/currency';
import { EMPTY_VALUE } from '../../../../constants/placeholder';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../redux/modules/wallet';
import useSynthsBalancesQuery from '../../../../queries/walletBalances/useSynthsBalancesQuery';
import { getCurrencyKeyBalance } from '../../../../utils/balances';
import { getIsAppReady } from '../../../../redux/modules/app';
import { AccountMarketInfo, OptionSide, OrderSide } from '../../../../types/options';
import useBinaryOptionsAccountMarketInfoQuery from '../../../../queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { useMarketContext } from '../contexts/MarketContext';
import { Trans, useTranslation } from 'react-i18next';
import { OrderSideOptionType } from '../TradeOptions/PlaceOrder/PlaceOrder';
import NumericInput from '../components/NumericInput';
import { BuySlider, SellSlider } from '../../CreateMarket/components';
import ValidationMessage from 'components/ValidationMessage';
import onboardConnector from 'utils/onboardConnector';
import erc20Contract from 'utils/contracts/erc20Contract';
import { ethers } from 'ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { APPROVAL_EVENTS } from 'constants/events';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import { MAX_L2_GAS_LIMIT, MINIMUM_AMM_LIQUIDITY, MIN_SCEW_IMPACT, SIDE, SLIPPAGE_PERCENTAGE } from 'constants/options';
import FieldValidationMessage from 'components/FieldValidationMessage';
import {
    PercentageLabel,
    SlippageButton,
    SlippageContainer,
    SlippageInput,
    SlippageLabel,
} from '../TradeOptions/TokenSwap/TokenSwap';
import { dispatchMarketNotification } from 'utils/options';
import SimpleLoader from './SimpleLoader';
import useInterval from 'hooks/useInterval';
import { refetchAmmData, refetchTrades, refetchUserTrades } from 'utils/queryConnector';
import WarningMessage from 'components/WarningMessage';
import { LINKS } from 'constants/links';

const AMM: React.FC = () => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

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
    const [slippage, setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[1]);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isGettingQuote, setIsGettingQuote] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isPriceChanged, setIsPriceChanged] = useState<boolean>(false);
    const [maxLimitExceeded, setMaxLimitExceeded] = useState<boolean>(false);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isSlippageValid, setIsSlippageValid] = useState<boolean>(true);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [maxLimit, setMaxLimit] = useState<number>(0);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
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

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(optionsMarket.address, {
        enabled: isAppReady,
    });
    const ammMaxLimits =
        ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data ? (ammMaxLimitsQuery.data as AmmMaxLimits) : undefined;

    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const isBuy = orderSide.value === 'buy';
    const isLong = optionSide === 'long';
    const isAmountEntered = Number(amount) > 0;
    const isPriceEntered = Number(price) > 0;
    const isTotalEntered = Number(total) > 0;
    const isAmmTradingDisabled = ammMaxLimits && !ammMaxLimits.isMarketInAmmTrading;

    const insufficientBalance = isBuy
        ? sUSDBalance < Number(total) || !sUSDBalance
        : tokenBalance < Number(amount) || !tokenBalance;

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
        isAmmTradingDisabled;

    const sellToken = isBuy ? SynthsUSD.address : isLong ? optionsMarket.longAddress : optionsMarket.shortAddress;
    const sellTokenCurrencyKey = isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide];

    const formatBuySellArguments = () => {
        const marketAddress = optionsMarket.address;
        const side = SIDE[optionSide];
        const parsedAmount = ethers.utils.parseEther(amount.toString());
        const parsedTotal = ethers.utils.parseEther(total.toString());
        const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
        return { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage };
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';

        const getAllowance = async () => {
            try {
                const allowance = await erc20Instance.allowance(walletAddress, addressToApprove);
                setAllowance(!!bigNumberFormatter(allowance));
            } catch (e) {
                console.log(e);
            }
        };

        const registerAllowanceListener = () => {
            erc20Instance.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                    setAllowance(true);
                    setIsAllowing(false);
                }
            });
        };
        if (isWalletConnected) {
            getAllowance();
            registerAllowanceListener();
        }
        return () => {
            erc20Instance.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [walletAddress, isWalletConnected, isBuy, optionSide, hasAllowance]);

    const fetchL1Fee = async (
        ammContractWithSigner: any,
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
        const txRequest = isBuy
            ? await ammContractWithSigner.populateTransaction.buyFromAMM(
                  marketAddress,
                  side,
                  parsedAmount,
                  parsedTotal,
                  parsedSlippage
              )
            : await ammContractWithSigner.populateTransaction.sellToAMM(
                  marketAddress,
                  side,
                  parsedAmount,
                  parsedTotal,
                  parsedSlippage
              );
        return getL1FeeInWei(txRequest);
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
                // const [gasEstimate, l1FeeInWei] = await Promise.all([
                //     isBuy
                //         ? ammContractWithSigner.estimateGas.buyFromAMM(
                //               marketAddress,
                //               side,
                //               parsedAmount,
                //               parsedTotal,
                //               parsedSlippage
                //           )
                //         : ammContractWithSigner.estimateGas.sellToAMM(
                //               marketAddress,
                //               side,
                //               parsedAmount,
                //               parsedTotal,
                //               parsedSlippage
                //           ),
                //     fetchL1Fee(ammContractWithSigner, marketAddress, side, parsedAmount, parsedTotal, parsedSlippage),
                // ]);
                const l1FeeInWei = await fetchL1Fee(
                    ammContractWithSigner,
                    marketAddress,
                    side,
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage
                );
                setGasLimit(MAX_L2_GAS_LIMIT);
                setL1Fee(l1FeeInWei);
                return MAX_L2_GAS_LIMIT;
            } else {
                // const gasEstimate = await (isBuy
                //     ? ammContractWithSigner.estimateGas.buyFromAMM(
                //           marketAddress,
                //           side,
                //           parsedAmount,
                //           parsedTotal,
                //           parsedSlippage
                //       )
                //     : ammContractWithSigner.estimateGas.sellToAMM(
                //           marketAddress,
                //           side,
                //           parsedAmount,
                //           parsedTotal,
                //           parsedSlippage
                //       ));
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

    const handleAllowance = async () => {
        const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract } = snxJSConnector;
        const addressToApprove = ammContract ? ammContract.address : '';

        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, ethers.constants.MaxUint256);
            const tx = (await erc20Instance.approve(addressToApprove, ethers.constants.MaxUint256, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setAllowance(true);
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            setIsAllowing(false);
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
                const [ammQuote, ammPriceImpact] = await Promise.all([
                    isBuy
                        ? ammContractWithSigner.buyFromAmmQuote(optionsMarket.address, SIDE[optionSide], parsedAmount)
                        : ammContractWithSigner.sellToAmmQuote(optionsMarket.address, SIDE[optionSide], parsedAmount),
                    isBuy
                        ? ammContractWithSigner.buyPriceImpact(optionsMarket.address, SIDE[optionSide], parsedAmount)
                        : ammContractWithSigner.sellPriceImpact(optionsMarket.address, SIDE[optionSide], parsedAmount),
                ]);
                const ammPrice = bigNumberFormatter(ammQuote) / Number(amount);
                setPrice(ammPrice);
                setTotal(bigNumberFormatter(ammQuote));
                setPriceImpact(ammPrice > 0 ? bigNumberFormatter(ammPriceImpact) - MIN_SCEW_IMPACT : 0);
                setPotentialReturn(ammPrice > 0 && isBuy ? 1 / ammPrice - 1 : 0);
                setIsPotentialReturnAvailable(isBuy);

                const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
                const isQuoteChanged = ammPrice !== price || total !== bigNumberFormatter(ammQuote);

                if (isSubmit) {
                    latestGasLimit = await fetchGasLimit(
                        optionsMarket.address,
                        SIDE[optionSide],
                        parsedAmount,
                        ammQuote,
                        parsedSlippage
                    );
                } else {
                    if (ammPrice > 0 && bigNumberFormatter(ammQuote) > 0 && isSlippageValid && isQuoteChanged) {
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
        setTxErrorMessage(null);
        setIsSubmitting(true);
        setIsPriceChanged(false);

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

            const tx = (isBuy
                ? await ammContractWithSigner.buyFromAMM(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      {
                          gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                      }
                  )
                : await ammContractWithSigner.sellToAMM(
                      marketAddress,
                      side,
                      parsedAmount,
                      parsedTotal,
                      parsedSlippage,
                      {
                          gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                      }
                  )) as ethers.ContractTransaction;
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    t(
                        `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.confirmation-message`
                    )
                );
                refetchAmmData(walletAddress, optionsMarket.address, networkId);
                refetchTrades(optionsMarket.address);
                refetchUserTrades(optionsMarket.address, walletAddress);
                setIsSubmitting(false);
                resetData();
                setAmount('');
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
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

    const onMaxClick = () => {
        setAmount(truncToDecimals(tokenBalance));
    };

    const getSubmitButton = () => {
        if (isAmmTradingDisabled) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t('amm.amm-disabled')}
                </SubmitButton>
            );
        }
        if (!isWalletConnected) {
            return (
                <SubmitButton isBuy={isBuy} onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </SubmitButton>
            );
        }
        if (insufficientLiquidity) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t(`common.errors.insufficient-liquidity`)}
                </SubmitButton>
            );
        }
        if (insufficientBalance) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t(`common.errors.insufficient-balance`)}
                </SubmitButton>
            );
        }
        if (!isAmountEntered) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t(`common.errors.enter-amount`)}
                </SubmitButton>
            );
        }
        if (!isSlippageValid) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t(`common.errors.invalid-slippage`)}
                </SubmitButton>
            );
        }
        if (maxLimitExceeded) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t(`common.errors.insufficient-liquidity`)}
                </SubmitButton>
            );
        }
        if (!hasAllowance) {
            return (
                <SubmitButton disabled={isAllowing} onClick={handleAllowance} isBuy={isBuy}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: sellTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: sellTokenCurrencyKey,
                          })}
                </SubmitButton>
            );
        }
        return (
            <SubmitButton disabled={isButtonDisabled || !gasLimit} onClick={handleSubmit} isBuy={isBuy}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.label`)
                    : t(
                          `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.progress-label`
                      )}
            </SubmitButton>
        );
    };

    const getPriceImpactColor = (priceImpactPercentage: number) => {
        if (priceImpactPercentage >= 0.03 || Number(priceImpactPercentage) <= -0.03) {
            return '#FF9548;';
        }
        if (priceImpactPercentage >= 0.01 || Number(priceImpactPercentage) <= -0.01) {
            return '#FFCC00';
        }
        return '#00F152';
    };

    const formDisabled = isSubmitting || isAmmTradingDisabled;

    return (
        <AMMWrapper>
            <Widget>
                <MarketWidgetHeader
                    widgetKey={MarketWidgetKey.AMM}
                    titleComponent={
                        <FlexDivCentered>
                            {t(`options.market.widgets.${MarketWidgetKey.AMM}`)}
                            <BetaBadge>{t('amm.beta')}</BetaBadge>
                        </FlexDivCentered>
                    }
                >
                    <FlexDivCentered>
                        <WalletIcon />
                        <WalletContainer>
                            {isWalletConnected ? (
                                <>
                                    <Wallet>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</Wallet>
                                    <Wallet>
                                        {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], tokenBalance)}
                                    </Wallet>
                                </>
                            ) : (
                                EMPTY_VALUE
                            )}
                        </WalletContainer>
                    </FlexDivCentered>
                </MarketWidgetHeader>
                <Container>
                    {isAmmTradingDisabled && (
                        <AmmWarningMessage>
                            <WarningMessage message={t('amm.amm-disabled-warning')} hideIcon />
                        </AmmWarningMessage>
                    )}
                    <FormContainer>
                        <AmmShortInputContainer>
                            <InputContainer>
                                <ReactSelect
                                    formatOptionLabel={(option: any) => option.label}
                                    options={orderSideOptions}
                                    value={orderSide}
                                    onChange={(option: any) => setOrderSide(option)}
                                    isSearchable={false}
                                    isUppercase
                                    isDisabled={formDisabled}
                                    className={formDisabled ? 'disabled' : ''}
                                />
                                <InputLabel>{t('amm.type-label')}</InputLabel>
                            </InputContainer>
                            <InputContainer>
                                <OptionsContainer>
                                    <OptionButton
                                        onClick={() => setOptionSide('long')}
                                        className={optionSide === 'long' ? 'selected' : ''}
                                        disabled={formDisabled}
                                    >
                                        {t('options.common.long')}
                                    </OptionButton>
                                    <OptionButton
                                        onClick={() => setOptionSide('short')}
                                        className={optionSide === 'short' ? 'selected' : ''}
                                        disabled={formDisabled}
                                    >
                                        {t('options.common.short')}
                                    </OptionButton>
                                </OptionsContainer>
                            </InputContainer>
                            <FlexDiv>
                                <AmountInputContainer isBuy={isBuy}>
                                    <NumericInput
                                        value={amount}
                                        onChange={(_, value) => setAmount(value)}
                                        className={isAmountValid && !maxLimitExceeded ? '' : 'error'}
                                        disabled={formDisabled || insufficientLiquidity}
                                    />
                                    <InputLabel>
                                        {t('options.market.trade-options.place-order.amount-label', {
                                            orderSide: orderSide.value,
                                        })}
                                    </InputLabel>
                                    <CurrencyLabel className={formDisabled || insufficientLiquidity ? 'disabled' : ''}>
                                        {OPTIONS_CURRENCY_MAP[optionSide]}
                                    </CurrencyLabel>
                                    <AmountValidationMessage isBuy={isBuy}>
                                        <FieldValidationMessage
                                            showValidation={!isAmountValid || maxLimitExceeded}
                                            message={t(
                                                !isAmountValid
                                                    ? 'common.errors.insufficient-balance-wallet'
                                                    : 'common.errors.max-limit-exceeded',
                                                {
                                                    currencyKey: isBuy
                                                        ? SYNTHS_MAP.sUSD
                                                        : OPTIONS_CURRENCY_MAP[optionSide],
                                                }
                                            )}
                                        />
                                    </AmountValidationMessage>
                                </AmountInputContainer>
                                {!isBuy && (
                                    <MaxButtonContainer>
                                        <MaxButton
                                            onClick={onMaxClick}
                                            disabled={formDisabled || insufficientLiquidity}
                                        >
                                            {t('common.max')}
                                        </MaxButton>
                                    </MaxButtonContainer>
                                )}
                            </FlexDiv>
                            <BuySellSliderContainer>
                                {isBuy ? (
                                    <BuySlider
                                        value={Number(amount)}
                                        step={1}
                                        max={maxLimit}
                                        min={0}
                                        onChange={(_, value) => {
                                            setAmount(Number(value));
                                        }}
                                        disabled={formDisabled || insufficientLiquidity}
                                    />
                                ) : (
                                    <SellSlider
                                        value={Number(amount)}
                                        step={1}
                                        max={maxLimit}
                                        min={0}
                                        onChange={(_, value) => {
                                            setAmount(Number(value));
                                        }}
                                        disabled={formDisabled || insufficientLiquidity}
                                    />
                                )}
                                <FlexDivRow>
                                    <SliderRange color={isBuy ? COLORS.BUY : COLORS.SELL}>{`${formatCurrencyWithKey(
                                        OPTIONS_CURRENCY_MAP[optionSide],
                                        0
                                    )}`}</SliderRange>
                                    <SliderRange color={isBuy ? COLORS.BUY : COLORS.SELL}>
                                        {`${formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], maxLimit)}`}
                                        <LightMediumTooltip title={t(`amm.max-limit-${orderSide.value}-tooltip`)}>
                                            <AmmMaxLimitQuestionMarkIcon isBuy={isBuy} />
                                        </LightMediumTooltip>
                                    </SliderRange>
                                </FlexDivRow>
                            </BuySellSliderContainer>
                        </AmmShortInputContainer>
                        <AmmShortInputContainer>
                            <InputContainer>
                                <SummaryContent>
                                    {isGettingQuote ? (
                                        <SimpleLoader />
                                    ) : (
                                        formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(price) > 0 ? price : basePrice)
                                    )}
                                </SummaryContent>
                                <SummaryLabel>
                                    {t('options.market.trade-options.place-order.price-label', {
                                        currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                                    })}
                                </SummaryLabel>
                            </InputContainer>
                            <InputContainer>
                                <SummaryContent>
                                    {isGettingQuote ? (
                                        <SimpleLoader />
                                    ) : Number(price) > 0 ? (
                                        formatCurrencyWithKey(SYNTHS_MAP.sUSD, total)
                                    ) : (
                                        '-'
                                    )}
                                </SummaryContent>
                                <SummaryLabel>{t(`amm.total-${orderSide.value}-label`)}</SummaryLabel>
                            </InputContainer>
                            <InputContainer>
                                <SummaryContent
                                    color={
                                        (isPotentialReturnAvailable && potentialReturn > 0) ||
                                        (Number(price) === 0 &&
                                            isBuy &&
                                            Number(basePrice) > 0 &&
                                            potentialBaseReturn > 0)
                                            ? '#00F152'
                                            : '#f6f6fe'
                                    }
                                >
                                    {isGettingQuote ? (
                                        <SimpleLoader />
                                    ) : Number(price) > 0 ? (
                                        isPotentialReturnAvailable ? (
                                            `${formatCurrencyWithKey(
                                                SYNTHS_MAP.sUSD,
                                                Number(potentialReturn) * Number(total)
                                            )} (${formatPercentage(potentialReturn)})`
                                        ) : (
                                            '-'
                                        )
                                    ) : isBuy && Number(basePrice) > 0 && Number(potentialBaseReturn) > 0 ? (
                                        formatPercentage(potentialBaseReturn)
                                    ) : (
                                        '-'
                                    )}
                                </SummaryContent>
                                <SummaryLabel>
                                    {t('amm.return-label')}
                                    <LightMediumTooltip title={t('amm.return-tooltip')}>
                                        <SummaryQuestionMarkIcon />
                                    </LightMediumTooltip>
                                </SummaryLabel>
                            </InputContainer>
                            <InputContainer>
                                <SummaryContent
                                    color={
                                        Number(price) > 0 || Number(basePrice) > 0
                                            ? getPriceImpactColor(
                                                  Number(price) > 0 ? Number(priceImpact) : Number(basePriceImpact)
                                              )
                                            : undefined
                                    }
                                >
                                    {isGettingQuote ? (
                                        <SimpleLoader />
                                    ) : Number(price) > 0 || Number(basePrice) > 0 ? (
                                        formatPercentage(Number(price) > 0 ? priceImpact : basePriceImpact)
                                    ) : (
                                        '-'
                                    )}
                                </SummaryContent>
                                <SummaryLabel>
                                    {t('amm.skew-label')}
                                    <LightMediumTooltip title={t('amm.skew-tooltip')}>
                                        <SummaryQuestionMarkIcon />
                                    </LightMediumTooltip>
                                </SummaryLabel>
                            </InputContainer>
                        </AmmShortInputContainer>
                    </FormContainer>
                    <SlippageSummary>
                        <FlexDivRow>
                            <FlexDivColumn>
                                <SlippageLabel>
                                    {t('options.market.trade-options.place-order.slippage-label')}
                                    <LightMediumTooltip
                                        title={t('options.market.trade-options.place-order.slippage-tooltip')}
                                    >
                                        <QuestionMarkIcon />
                                    </LightMediumTooltip>
                                </SlippageLabel>
                            </FlexDivColumn>
                            <FlexDivColumn>
                                <FlexDivEnd>
                                    {SLIPPAGE_PERCENTAGE.map((percentage: number) => (
                                        <SlippageButton
                                            className={percentage === slippage ? 'selected' : ''}
                                            key={percentage}
                                            onClick={() => setSlippage(percentage)}
                                            disabled={formDisabled}
                                        >
                                            {`${percentage}%`}
                                        </SlippageButton>
                                    ))}
                                    <SlippageContainer>
                                        <SlippageInput
                                            value={slippage}
                                            onChange={(_: any, value: any) => setSlippage(value)}
                                            disabled={formDisabled}
                                        />
                                        <PercentageLabel className={formDisabled ? 'disabled' : ''}>%</PercentageLabel>
                                    </SlippageContainer>
                                </FlexDivEnd>
                                <FieldValidationMessage
                                    showValidation={!isSlippageValid}
                                    message={t(`common.errors.enter-valid-slippage`)}
                                    arrowPosition="right"
                                    marginLeft="40px"
                                />
                            </FlexDivColumn>
                        </FlexDivRow>
                    </SlippageSummary>
                    <Divider />
                    <SummaryContainer>
                        <NetworkFees gasLimit={gasLimit} disabled={formDisabled} l1Fee={l1Fee} />
                    </SummaryContainer>
                    <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
                    {isPriceChanged && (
                        <AmmWarningMessage style={{ marginTop: 15 }}>
                            <WarningMessage message={t('amm.price-changed-warning')} hideIcon />
                        </AmmWarningMessage>
                    )}
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </Container>
            </Widget>
            <Info>
                <Container>
                    <Trans i18nKey="amm.explanation-text" components={[<p key="0" />, <TipLink key="1" />]} />
                </Container>
            </Info>
        </AMMWrapper>
    );
};

const TipLink: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.AMM.Tip}>
            {LINKS.AMM.Tip}
        </TooltipLink>
    );
};

const TooltipLink = styled.a`
    color: #b8c6e5;
    &:hover {
        color: #00f9ff;
    }
`;

const AMMWrapper = styled.div`
    display: flex;
    height: 100%;
    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

const Widget = styled.div`
    flex: 1;
    overflow: auto;
    border-radius: 23px;
    background: linear-gradient(90deg, #3936c7 -8.53%, #2d83d2 52.71%, #23a5dd 105.69%, #35dadb 127.72%);
`;

const FormContainer = styled(FlexDivRow)`
    @media (max-width: 576px) {
        flex-direction: column;
    }
`;

const AmmShortInputContainer = styled(ShortInputContainer)`
    margin-bottom: 0px;
    width: calc(50% - 5px);
    @media (max-width: 576px) {
        width: 100%;
        &:first-child {
            margin-bottom: 20px;
        }
    }
`;

const OptionsContainer = styled(FlexDivRowCentered)`
    height: 64px;
`;

const OptionButton = styled(FilterButton)`
    text-transform: uppercase;
    width: 120px;
    margin: 0 9px;
    padding: 0px;
`;

const Info = styled.div`
    flex: 1;
    overflow: auto;
    padding: 10px;
    color: #fefefe;
    & p {
        padding-top: 20px;
        font-size: 16px;
        line-height: 24px;
    }
`;

const SummaryContent = styled.div<{ color?: string }>`
    background: rgba(12, 28, 104, 0.4);
    border-radius: 12px;
    border: none;
    height: 64px;
    padding: 31px 0 0 22px;
    color: ${(props) => (props.color ? props.color : '#F6F6FE')};
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.25px;
`;

const SummaryLabel = styled(InputLabel)`
    color: #f6f6fe;
    pointer-events: auto;
`;

const BuySellSliderContainer = styled(SliderContainer)`
    width: 100%;
    margin-top: 10px;
    padding: 0 10px 0 10px;
    @media (max-width: 576px) {
        margin-top: 0px;
    }
`;

const QuestionMarkIcon = styled(StyledQuestionMarkIcon)``;

const AmmMaxLimitQuestionMarkIcon = styled(StyledQuestionMarkIcon)<{ isBuy: boolean }>`
    path {
        fill: ${(props) => (props.isBuy ? COLORS.BUY : COLORS.SELL)};
    }
`;

const SummaryQuestionMarkIcon = styled(StyledQuestionMarkIcon)`
    margin-bottom: -2px;
    path {
        fill: #f6f6fe;
    }
`;

const AmountValidationMessage = styled.div<{ isBuy: boolean }>`
    > div {
        position: absolute;
        bottom: ${(props) => (props.isBuy ? -25 : -40)}px;
        width: 100%;
    }
`;

const SlippageSummary = styled(SummaryContainer)`
    @media (max-width: 576px) {
        padding: 0px 5px;
    }
    @media (min-width: 901px) and (max-width: 1200px) {
        padding: 0px 5px;
    }
`;

const AmmWarningMessage = styled(FlexDivCentered)`
    margin-bottom: 15px;
    div {
        font-size: 14px;
        font-weight: bold;
    }
    svg {
        min-width: 18px;
        min-height: 18px;
        margin-top: -1px;
    }
`;

const MaxButton = styled(SubmitButton)`
    background: transparent;
    border: 3px solid #0a2e66;
    box-sizing: border-box;
    border-radius: 5px;
    height: 52px;
    margin-left: 10px;
    margin-top: 6px;
    text-transform: uppercase;
    padding: 0;
    &.selected,
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        color: #b8c6e5;
    }
`;

const AmountInputContainer = styled(InputContainer)<{ isBuy: boolean }>`
    width: ${(props) => (props.isBuy ? 100 : 75)}%;
`;

const MaxButtonContainer = styled(InputContainer)`
    width: 25%;
`;

export default AMM;
