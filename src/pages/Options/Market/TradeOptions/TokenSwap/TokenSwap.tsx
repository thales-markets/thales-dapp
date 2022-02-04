import FieldValidationMessage from 'components/FieldValidationMessage';
import ValidationMessage from 'components/ValidationMessage';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { APPROVAL_EVENTS } from 'constants/events';
import { AMOUNT_PERCENTAGE, OneInchErrorReason, SLIPPAGE_PERCENTAGE } from 'constants/options';
import { ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import { maxBy } from 'lodash';
// import { maxBy } from 'lodash';
import NetworkFees from 'pages/Options/components/NetworkFees';
import {
    AmountButton,
    AmountButtonContainer,
    Container,
    CurrencyLabel,
    Divider,
    InputContainer,
    InputLabel,
    LightTooltip,
    ReactSelect,
    ShortInputContainer,
    StyledQuestionMarkIcon,
    SubmitButton,
    SubmitButtonContainer,
    SummaryContainer,
    SummaryContent,
    SummaryItem,
    SummaryLabel,
} from 'pages/Options/Market/components';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivEnd, FlexDivRow } from 'theme/common';
import { AccountMarketInfo, OneInchErrorResponse, OptionSide, OrderItem, Orders, OrderSide } from 'types/options';
import { get1InchBaseURL, ONE_INCH_SWAP_CONTRACTS, ONE_INCH_SWAP_QUOTE_URL, ONE_INCH_SWAP_URL } from 'utils/1inch';
import { getCurrencyKeyBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { formatCurrencyWithKey, formatPercentageWithSign, truncToDecimals } from 'utils/formatters/number';
import { formatGasLimit } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { refetchOrderbook, refetchTrades, refetchUserTrades } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import Web3 from 'web3';
import { dispatchMarketNotification } from '../../../../../utils/options';
import NumericInput from '../../components/NumericInput';

type TokenSwapProps = {
    optionSide: OptionSide;
};

type OrderSideOptionType = { value: OrderSide; label: string };

type OneInchErrorType = 'insufficient-liquidity' | 'insufficient-balance' | 'general' | 'clear';

declare const window: any;
const TokenSwap: React.FC<TokenSwapProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [amount, setAmount] = useState<number | string>('');
    const [price, setPrice] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>('');
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [slippage, setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[1]);
    const [priceImpactPercentage, setPriceImpactPercentage] = useState<number | string>('0');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isSlippageValid, setIsSlippageValid] = useState<boolean>(true);

    const orderSideOptions = [
        {
            value: 'buy' as OrderSide,
            label: SYNTHS_MAP.sUSD,
        },
        {
            value: 'sell' as OrderSide,
            label: OPTIONS_CURRENCY_MAP[optionSide],
        },
    ];
    const [orderSide, setOrderSide] = useState<OrderSideOptionType>(orderSideOptions[0]);

    const baseToken = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

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

    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const isBuy = orderSide.value === 'buy';

    const isAmountEntered = Number(amount) > 0;
    const isPriceEntered = Number(price) > 0;

    const insufficientBalance = isBuy
        ? sUSDBalance < Number(amount) || !sUSDBalance
        : tokenBalance < Number(amount) || !tokenBalance;

    const isButtonDisabled =
        !isPriceEntered || !isAmountEntered || isSubmitting || !isWalletConnected || insufficientBalance;

    const buyToken = isBuy ? baseToken : SynthsUSD.address;
    const sellToken = isBuy ? SynthsUSD.address : baseToken;
    const sellTokenCurrencyKey = isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide];
    const addressToApprove = ONE_INCH_SWAP_CONTRACTS[networkId];

    const baseUrl = get1InchBaseURL(networkId);

    const orderbookQuery = useBinaryOptionsMarketOrderbook(networkId, baseToken, {
        enabled: isAppReady,
    });

    const bestBuyPrice =
        orderbookQuery.isSuccess && orderbookQuery.data && orderbookQuery.data.sellOrders.length > 0
            ? orderbookQuery.data.sellOrders[0].displayOrder.price
            : undefined;
    const bestSellPrice =
        orderbookQuery.isSuccess && orderbookQuery.data && orderbookQuery.data.buyOrders.length > 0
            ? orderbookQuery.data.buyOrders[0].displayOrder.price
            : undefined;

    const filterUserOrders = (orders: Orders) => {
        if (orders.length > 0) {
            const maxTotalItem = maxBy(orders, (order: OrderItem) => order.displayOrder.fillableTotal);
            if (maxTotalItem) {
                orders.forEach((order: OrderItem) => {
                    order.displayOrder.percentageOfMaximum =
                        (order.displayOrder.fillableTotal / maxTotalItem.displayOrder.fillableTotal) * 100;
                });
            }
        }

        return orders.filter((order: OrderItem) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase());
    };

    const onlyUsersBuyOrders = useMemo(() => {
        const orders = orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.buyOrders : [];
        return orders.length === filterUserOrders(orders).length;
    }, [orderbookQuery.data, walletAddress]);

    const onlyUsersSellOrders = useMemo(() => {
        const orders = orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.sellOrders : [];
        return orders.length === filterUserOrders(orders).length;
    }, [orderbookQuery.data, walletAddress]);

    useEffect(() => {
        const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
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
                if (owner === walletAddress && spender === getAddress(addressToApprove ? addressToApprove : '')) {
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

    const handleAllowance = async () => {
        const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
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
    const handleSubmitOrder = async () => {
        try {
            if (window.ethereum) {
                setTxErrorMessage(null);
                setIsSubmitting(true);
                window.web3 = new Web3(Web3.givenProvider);
                const tokenAmount = ethers.utils.parseEther(amount.toString());
                const swapUrl = `${baseUrl}${ONE_INCH_SWAP_URL}?fromTokenAddress=${sellToken}&toTokenAddress=${buyToken}&amount=${tokenAmount}&fromAddress=${walletAddress}&slippage=${
                    isSlippageValid && slippage ? slippage : 1
                }`;
                const response = await fetch(swapUrl);
                const swapResponse = await response.json();
                console.log(swapResponse);
                await window.web3.eth.sendTransaction(swapResponse.tx);
                refetchOrderbook(baseToken);
                refetchTrades(optionsMarket.address);
                refetchUserTrades(optionsMarket.address, walletAddress);
                setIsSubmitting(false);
                dispatchMarketNotification(
                    t(
                        `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.confirmation-message`
                    )
                );
                resetForm();
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(
                e.code === 4001 ? t('common.errors.user-rejected-tx') : t('common.errors.unknown-error-try-again')
            );
            setIsSubmitting(false);
        }
    };
    const calculateAmount = (percentage: number) => {
        if (isBuy) return;
        const maxsOPTBalance = tokenBalance;
        const newAmount = (maxsOPTBalance * percentage) / 100;
        setAmount(truncToDecimals(newAmount, DEFAULT_OPTIONS_DECIMALS));
    };

    const resetQuote = () => {
        setPrice('');
        setTotal('');
        setGasLimit(null);
        setPriceImpactPercentage('0');
    };

    useDebouncedEffect(() => {
        const get1InchPrice = async () => {
            if (isAmountEntered && isSlippageValid) {
                const tokenAmount = ethers.utils.parseEther(amount.toString());
                try {
                    const quoteUrl = `${baseUrl}${ONE_INCH_SWAP_QUOTE_URL}?fromTokenAddress=${sellToken}&toTokenAddress=${buyToken}&amount=${tokenAmount}`;

                    const response = await fetch(quoteUrl);
                    if (response.status == 200) {
                        const quote = await response.json();
                        console.log(quote);
                        const quoteAmount = bigNumberFormatter(quote.toTokenAmount);
                        setGasLimit(formatGasLimit(quote.estimatedGas, networkId));
                        setPrice(quoteAmount / Number(amount));
                        setTotal(quoteAmount);
                        if (isBuy) {
                            setPriceImpactPercentage(
                                bestBuyPrice ? (quoteAmount / Number(amount) - bestBuyPrice) / bestBuyPrice : 0
                            );
                        } else {
                            setPriceImpactPercentage(
                                bestSellPrice ? -(bestSellPrice - quoteAmount / Number(amount)) / bestSellPrice : 0
                            );
                        }
                        setInsufficientLiquidity(false);
                    } else {
                        resetQuote();
                        const errorResponse = await response.json();
                        handle1inchErrorResponse(errorResponse);
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                set1InchError('clear');
                resetQuote();
            }
        };
        get1InchPrice();
    }, [amount, slippage, hasAllowance, walletAddress, sellToken, buyToken, isAmountEntered, isSlippageValid]);

    const handle1inchErrorResponse = (response: OneInchErrorResponse) => {
        switch (response.description) {
            case OneInchErrorReason.INSUFFICIENT_LIQUIDITY:
                set1InchError('insufficient-liquidity');
                break;

            default:
                set1InchError('general');
                break;
        }
    };

    const set1InchError = (errorType?: OneInchErrorType) => {
        setInsufficientLiquidity(errorType === 'insufficient-liquidity');
        setTxErrorMessage(errorType === 'general' ? t('common.errors.unknown-error-try-again-general') : null);
    };

    useEffect(() => {
        setIsSlippageValid(Number(slippage) > 0 && Number(slippage) <= 100);
    }, [slippage]);

    useEffect(() => {
        setIsAmountValid(
            Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? (Number(total) > 0 && Number(amount) <= sUSDBalance) ||
                          (Number(total) === 0 && sUSDBalance > 0)
                        : Number(amount) <= tokenBalance))
        );
    }, [amount, total, isBuy, sUSDBalance, tokenBalance]);

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <SubmitButton isBuy={isBuy} onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </SubmitButton>
            );
        }
        if (isBuy && onlyUsersSellOrders) {
            return (
                <SubmitButton disabled={true} isBuy={isBuy}>
                    {t(`common.errors.insufficient-liquidity`)}
                </SubmitButton>
            );
        }

        if (!isBuy && onlyUsersBuyOrders) {
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
        if (insufficientLiquidity) {
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
            <SubmitButton disabled={isButtonDisabled} onClick={handleSubmitOrder} isBuy={isBuy}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.label`)
                    : t(
                          `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.progress-label`
                      )}
            </SubmitButton>
        );
    };

    const getPriceColor = (priceImpactPercentage: number) => {
        if (priceImpactPercentage > 0.1 || Number(priceImpactPercentage) < -0.1) {
            return 'rgb(223, 47, 43)';
        }
        if (priceImpactPercentage > 0.01 || Number(priceImpactPercentage) < -0.01) {
            return 'rgb(240, 185, 11)';
        }
        return 'rgb(49, 208, 170)';
    };

    const resetForm = () => {
        setAmount('');
        setOrderSide(orderSideOptions[0]);
        setIsAmountValid(true);
        resetQuote();
    };

    useEffect(() => {
        resetForm();
    }, [optionSide]);

    return (
        <Container>
            <FlexDivRow className="marketTab">
                <ShortInputContainer>
                    <ReactSelect
                        formatOptionLabel={(option: any) => option.label}
                        options={orderSideOptions}
                        value={orderSide}
                        onChange={(option: any) => setOrderSide(option)}
                        isSearchable={false}
                        isUppercase
                        isDisabled={isSubmitting}
                        className={isSubmitting ? 'disabled' : ''}
                    />
                    <InputLabel>{'SELECT TO SELL'}</InputLabel>
                </ShortInputContainer>
                <ShortInputContainer>
                    <NumericInput
                        value={amount}
                        onChange={(_, value) => setAmount(value)}
                        className={isAmountValid && !insufficientLiquidity ? '' : 'error'}
                        disabled={isSubmitting}
                    />
                    <InputLabel>{'AMOUNT TO SELL'}</InputLabel>
                    <CurrencyLabel className={isSubmitting ? 'disabled' : ''}>
                        {isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide]}
                    </CurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid || insufficientLiquidity}
                        message={t(
                            !isAmountValid
                                ? 'common.errors.insufficient-balance-wallet'
                                : 'common.errors.insufficient-liquidity-for-trade',
                            {
                                currencyKey: isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide],
                            }
                        )}
                    />
                </ShortInputContainer>
            </FlexDivRow>
            {!isBuy && (
                <AmountButtonContainer className="marketTab__amountWrapper">
                    {AMOUNT_PERCENTAGE.map((percentage: number) => (
                        <AmountButton
                            key={percentage}
                            onClick={() => calculateAmount(percentage)}
                            disabled={!isWalletConnected || (isBuy && price === '') || isSubmitting}
                        >
                            {`${percentage}%`}
                        </AmountButton>
                    ))}
                </AmountButtonContainer>
            )}
            <SummaryContainer className="marketTab__summary">
                <SummaryItem>
                    <FlexDivColumn>
                        <SlippageLabel>
                            {t('options.market.trade-options.place-order.slippage-label')}
                            <LightTooltip title={t('options.market.trade-options.place-order.slippage-tooltip')}>
                                <QuestionMarkIcon />
                            </LightTooltip>
                        </SlippageLabel>
                    </FlexDivColumn>
                    <FlexDivColumn>
                        <FlexDivEnd>
                            {SLIPPAGE_PERCENTAGE.map((percentage: number) => (
                                <SlippageButton
                                    className={percentage === slippage ? 'selected' : ''}
                                    key={percentage}
                                    onClick={() => setSlippage(percentage)}
                                    disabled={isSubmitting}
                                >
                                    {`${percentage}%`}
                                </SlippageButton>
                            ))}
                            <SlippageContainer>
                                <SlippageInput
                                    value={slippage}
                                    onChange={(_: any, value: any) => setSlippage(value)}
                                    disabled={isSubmitting}
                                />
                                <PercentageLabel className={isSubmitting ? 'disabled' : ''}>%</PercentageLabel>
                            </SlippageContainer>
                        </FlexDivEnd>
                        <FieldValidationMessage
                            showValidation={!isSlippageValid}
                            message={t(`common.errors.enter-valid-slippage`)}
                            arrowPosition="right"
                            marginLeft="40px"
                        />
                    </FlexDivColumn>
                </SummaryItem>
                <SummaryItem>
                    <SummaryLabel>
                        {isBuy
                            ? t('options.market.trade-options.place-order.price-for-label', {
                                  currencyKey: SYNTHS_MAP.sUSD,
                              })
                            : t('options.market.trade-options.place-order.price-label', {
                                  currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                              })}
                    </SummaryLabel>

                    <Price color={isBuy ? 'rgb(49, 208, 170)' : getPriceColor(Number(priceImpactPercentage))}>
                        {isBuy
                            ? `${formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], Number(price))}`
                            : `${formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(price))} (${formatPercentageWithSign(
                                  priceImpactPercentage
                              )})`}
                    </Price>
                </SummaryItem>

                <SummaryItem>
                    <SummaryLabel>
                        {isBuy
                            ? t('options.market.trade-options.place-order.total-label-option', {
                                  option: OPTIONS_CURRENCY_MAP[optionSide],
                              })
                            : t('options.market.trade-options.place-order.total-label-susd')}
                    </SummaryLabel>
                    <SummaryContent>
                        {isBuy
                            ? formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], total)
                            : formatCurrencyWithKey(SYNTHS_MAP.sUSD, total)}
                    </SummaryContent>
                </SummaryItem>

                <Divider />
                <NetworkFees gasLimit={gasLimit} disabled={isSubmitting} />
            </SummaryContainer>
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
        </Container>
    );
};

export const SlippageButton = styled(AmountButton)`
    margin: 0 10px 0 0;
    min-height: 26px;
    width: 48px;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.25px;
    padding-bottom: 1px;
    @media (max-width: 767px) {
        margin: 0 8px 0 0;
    }
`;

export const SlippageInput = styled(NumericInput)`
    height: 26px;
    width: 80px;
    padding: 0;
    padding-left: 10px;
    padding-right: 25px;
    border-radius: 5px;
    font-size: 12px;
    text-overflow: ellipsis;
    @media (max-width: 767px) {
        width: 60px;
    }
`;

export const PercentageLabel = styled(CurrencyLabel)`
    padding: 5px 10px 5px 0;
`;

export const SlippageContainer = styled(InputContainer)`
    margin: 0;
`;

export const SlippageLabel = styled(SummaryLabel)`
    display: flex;
    align-items: center;
    margin-top: 5px;
`;

const Price = styled(SummaryContent)<{ color: string }>`
    color: ${(props) => props.color};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    text-align: end;
`;

export const QuestionMarkIcon = styled(StyledQuestionMarkIcon)`
    @media (max-width: 767px) {
        display: none;
    }
`;

export default TokenSwap;
