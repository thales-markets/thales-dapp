import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { AccountMarketInfo, OptionSide, OrderSide, ZeroExErrorResponse } from 'types/options';
import { get0xBaseURL } from 'utils/0x';
import { getCurrencyKeyBalance } from 'utils/balances';
import {
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    formatPercentageWithSign,
    toBigNumber,
    truncToDecimals,
} from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import erc20Contract from 'utils/contracts/erc20Contract';
import { ethers } from 'ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { APPROVAL_EVENTS } from 'constants/events';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { AMOUNT_PERCENTAGE, SLIPPAGE_PERCENTAGE, Zero0xErrorReason, Zero0xErrorCode } from 'constants/options';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { DEFAULT_OPTIONS_DECIMALS, DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import NetworkFees from 'pages/Options/components/NetworkFees';
import {
    Container,
    InputContainer,
    InputLabel,
    SubmitButtonContainer,
    ReactSelect,
    CurrencyLabel,
    AmountButton,
    AmountButtonContainer,
    SummaryLabel,
    SummaryItem,
    SummaryContent,
    SubmitButton,
    SummaryContainer,
    ShortInputContainer,
    Divider,
    ProtocolFeeContainer,
    ProtocolFeeLabel,
    ProtocolFeeItem,
    StyledQuestionMarkIcon,
    LightTooltip,
} from 'pages/Options/Market/components';
import styled from 'styled-components';
import { FlexDivEnd, FlexDivColumn, FlexDivRow } from 'theme/common';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { GWEI_UNIT } from 'constants/network';
import Web3 from 'web3';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import ValidationMessage from 'components/ValidationMessage';
import onboardConnector from 'utils/onboardConnector';
import NumericInput from '../../components/NumericInput';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { refetchOrderbook, refetchTrades, refetchUserTrades } from 'utils/queryConnector';

type TokenSwapProps = {
    optionSide: OptionSide;
};

type OrderSideOptionType = { value: OrderSide; label: string };

type ZeroExErrorType = 'insufficient-liquidity' | 'insufficient-balance' | 'general' | 'clear';

declare const window: any;
const TokenSwap: React.FC<TokenSwapProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [amount, setAmount] = useState<number | string>('');
    const [price, setPrice] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>('');
    const [protocolFee, setProtocolFee] = useState<number | string>('');
    const [minimumReceived, setMinimumReceived] = useState<number | string>('');
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [swapQuote, setSwapQuote] = useState<any>();
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [slippage, setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[1]);
    const [priceImpactPercentage, setPriceImpactPercentage] = useState<number | string>('0');
    const [insufficientBalance0x, setInsufficientBalance0x] = useState<boolean>(false);
    const contractAddresses0x = getContractAddressesForChainOrThrow(networkId);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isSlippageValid, setIsSlippageValid] = useState<boolean>(true);

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

    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const isBuy = orderSide.value === 'buy';

    const isAmountEntered = Number(amount) > 0;
    const isPriceEntered = Number(price) > 0;

    const insufficientBalance = isBuy
        ? sUSDBalance < Number(total) || !sUSDBalance
        : tokenBalance < Number(amount) || !tokenBalance;

    const isButtonDisabled =
        !isPriceEntered || !isAmountEntered || isSubmitting || !isWalletConnected || insufficientBalance;

    const buyToken = isBuy ? baseToken : SynthsUSD.address;
    const sellToken = isBuy ? SynthsUSD.address : baseToken;
    const sellTokenCurrencyKey = isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide];
    const addressToApprove: string = contractAddresses0x.exchangeProxy;

    const baseUrl = get0xBaseURL(networkId);
    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

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
    }, [walletAddress, isWalletConnected, isBuy, optionSide]);

    const handleAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
            try {
                setIsAllowing(true);
                const gasEstimate = await erc20Instance.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                await erc20Instance.approve(addressToApprove, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setIsAllowing(false);
            }
        }
    };
    const handleSubmitOrder = async () => {
        try {
            if (window.ethereum) {
                setTxErrorMessage(null);
                setIsSubmitting(true);
                window.web3 = new Web3(Web3.givenProvider);
                const quote = { ...swapQuote, from: walletAddress };
                await window.web3.eth.sendTransaction(quote);
                refetchOrderbook(baseToken);
                refetchTrades(optionsMarket.address);
                refetchUserTrades(optionsMarket.address, walletAddress);
                setIsSubmitting(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
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
        setMinimumReceived('');
        setSwapQuote(undefined);
        setProtocolFee('');
        setGasLimit(null);
        setPriceImpactPercentage('0');
    };

    useEffect(() => {
        const get0xPrice = async () => {
            if (isAmountEntered && isSlippageValid) {
                const tokenAmount = Web3Wrapper.toBaseUnitAmount(toBigNumber(amount), DEFAULT_TOKEN_DECIMALS);
                try {
                    const swapUrl = `${baseUrl}swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&${
                        isBuy ? 'buyAmount' : 'sellAmount'
                    }=${tokenAmount}&slippagePercentage=${Number(slippage) / 100}${
                        gasPrice != null ? `&gasPrice=${gasPrice * GWEI_UNIT}` : ''
                    }${isWalletConnected && hasAllowance ? `&takerAddress=${walletAddress}` : ''}`;

                    const response = await fetch(swapUrl);
                    if (response.status == 200) {
                        const quote = await response.json();
                        setPrice(quote.price);
                        setTotal(Number(amount) * Number(quote.price));
                        setMinimumReceived(Number(amount) * Number(quote.guaranteedPrice));
                        setSwapQuote(quote);
                        if (ethRate !== null) {
                            setProtocolFee((quote.protocolFee * ethRate) / GWEI_UNIT / GWEI_UNIT);
                        }
                        setGasLimit(quote.gas);
                        if (isBuy) {
                            setPriceImpactPercentage(bestBuyPrice ? (quote.price - bestBuyPrice) / bestBuyPrice : 0);
                        } else {
                            setPriceImpactPercentage(
                                bestSellPrice ? -(bestSellPrice - quote.price) / bestSellPrice : 0
                            );
                        }
                        setInsufficientLiquidity(false);
                        setInsufficientBalance0x(false);
                    } else {
                        resetQuote();
                        const errorResponse = await response.json();
                        handle0xErrorResponse(errorResponse);
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                set0xError('clear');
                resetQuote();
            }
        };
        get0xPrice();
    }, [
        amount,
        slippage,
        hasAllowance,
        walletAddress,
        sellToken,
        buyToken,
        gasPrice,
        ethRate,
        isAmountEntered,
        isSlippageValid,
    ]);

    const handle0xErrorResponse = (response: ZeroExErrorResponse) => {
        console.log(response);
        switch (response.code) {
            case Zero0xErrorCode.VALIDATION_FAILED:
                set0xError('insufficient-liquidity');
                break;
            case Zero0xErrorCode.TRANSACTION_INVALID:
                switch (response.reason) {
                    case Zero0xErrorReason.MATCHED_MY_OWN_ORDERS:
                    case Zero0xErrorReason.MAKER_WALLET_INSUFFICIENT_BALANCE:
                        set0xError('insufficient-liquidity');
                        break;
                    case Zero0xErrorReason.TAKER_WALLET_INSUFFICIENT_BALANCE:
                        set0xError('insufficient-balance');
                        break;
                    default:
                        set0xError('general');
                        break;
                }
                break;
            default:
                set0xError('general');
                break;
        }
    };

    const set0xError = (errorType?: ZeroExErrorType) => {
        setInsufficientLiquidity(errorType === 'insufficient-liquidity');
        setInsufficientBalance0x(errorType === 'insufficient-balance');
        setTxErrorMessage(errorType === 'general' ? t('common.errors.unknown-error-try-again-general') : null);
    };

    useEffect(() => {
        setIsSlippageValid(Number(slippage) > 0 && Number(slippage) <= 100);
    }, [slippage]);

    useEffect(() => {
        setIsAmountValid(
            (Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? (Number(total) > 0 && Number(total) <= sUSDBalance) ||
                          (Number(total) === 0 && sUSDBalance > 0)
                        : Number(amount) <= tokenBalance))) &&
                !insufficientBalance0x
        );
    }, [amount, total, isBuy, insufficientBalance0x, sUSDBalance, tokenBalance]);

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <SubmitButton isBuy={isBuy} onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </SubmitButton>
            );
        }
        if (insufficientBalance || insufficientBalance0x) {
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

    return (
        <Container>
            <FlexDivRow>
                <ShortInputContainer>
                    <ReactSelect
                        formatOptionLabel={(option: any) => option.label}
                        options={orderSideOptions}
                        value={orderSide}
                        onChange={(option: any) => setOrderSide(option)}
                        isSearchable={false}
                        isUppercase
                    />
                    <InputLabel>{t('options.market.trade-options.place-order.order-type-label')}</InputLabel>
                </ShortInputContainer>
                <ShortInputContainer>
                    <NumericInput
                        value={amount}
                        onChange={(_, value) => setAmount(value)}
                        className={isAmountValid && !insufficientLiquidity ? '' : 'error'}
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide: orderSide.value })}
                    </InputLabel>
                    <CurrencyLabel>{OPTIONS_CURRENCY_MAP[optionSide]}</CurrencyLabel>
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
                <AmountButtonContainer>
                    {AMOUNT_PERCENTAGE.map((percentage: number) => (
                        <AmountButton
                            key={percentage}
                            onClick={() => calculateAmount(percentage)}
                            disabled={!isWalletConnected || (isBuy && price === '')}
                        >
                            {`${percentage}%`}
                        </AmountButton>
                    ))}
                </AmountButtonContainer>
            )}
            <SummaryContainer>
                <SummaryItem>
                    <FlexDivColumn>
                        <SlippageLabel>
                            {t('options.market.trade-options.place-order.slippage-label')}
                            <LightTooltip title={t('options.market.trade-options.place-order.slippage-tooltip')}>
                                <StyledQuestionMarkIcon />
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
                                >
                                    {`${percentage}%`}
                                </SlippageButton>
                            ))}
                            <SlippageContainer>
                                <SlippageInput value={slippage} onChange={(_: any, value: any) => setSlippage(value)} />
                                <PercentageLabel>%</PercentageLabel>
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
                        {t('options.market.trade-options.place-order.price-label', {
                            currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                        })}
                    </SummaryLabel>
                    <Price color={getPriceColor(Number(priceImpactPercentage))}>{`${formatCurrencyWithKey(
                        SYNTHS_MAP.sUSD,
                        Number(price)
                    )} (${formatPercentageWithSign(priceImpactPercentage)})`}</Price>
                </SummaryItem>

                <SummaryItem>
                    <SummaryLabel>{t('options.market.trade-options.place-order.total-label')}</SummaryLabel>
                    <SummaryContent>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, total)}</SummaryContent>
                </SummaryItem>
                <SummaryItem style={{ marginBottom: 10 }}>
                    <SummaryLabel>
                        {t(`options.market.trade-options.place-order.${isBuy ? 'total-max-label' : 'total-min-label'}`)}
                    </SummaryLabel>
                    <SummaryContent>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, minimumReceived)}</SummaryContent>
                </SummaryItem>
                <Divider />
                <ProtocolFeeContainer>
                    <ProtocolFeeLabel>
                        {t('options.market.trade-options.place-order.protocol-fee-label')}
                        <LightTooltip title={t('options.market.trade-options.place-order.protocol-fee-tooltip')}>
                            <StyledQuestionMarkIcon />
                        </LightTooltip>
                    </ProtocolFeeLabel>
                    <ProtocolFeeItem>{formatCurrencyWithSign(USD_SIGN, protocolFee)}</ProtocolFeeItem>
                </ProtocolFeeContainer>
                <NetworkFees gasLimit={gasLimit} />
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

const SlippageButton = styled(AmountButton)`
    margin: 0 10px 0 0;
    min-height: 26px;
    width: 48px;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.25px;
    padding-bottom: 1px;
`;

const SlippageInput = styled(NumericInput)`
    height: 26px;
    width: 80px;
    padding: 0;
    padding-left: 10px;
    padding-right: 25px;
    border-radius: 5px;
    font-size: 12px;
    text-overflow: ellipsis;
`;

const PercentageLabel = styled(CurrencyLabel)`
    padding: 5px 10px 5px 0;
`;

const SlippageContainer = styled(InputContainer)`
    margin: 0;
`;

const SlippageLabel = styled(SummaryLabel)`
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

export default TokenSwap;
