import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
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
import { Message } from 'semantic-ui-react';
import { AccountMarketInfo, OptionSide, OrderSide } from 'types/options';
import { get0xBaseURL } from 'utils/0x';
import { getCurrencyKeyBalance } from 'utils/balances';
import {
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    formatPercentageWithSign,
    toBigNumber,
} from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import erc20Contract from 'utils/contracts/erc20Contract';
import { ethers } from 'ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { APPROVAL_EVENTS } from 'constants/events';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { AMOUNT_PERCENTAGE, SLIPPAGE_PERCENTAGE, SLIPPAGE_THRESHOLD } from 'constants/options';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import NetworkFees from 'pages/Options/components/NetworkFees';
import {
    Container,
    InputContainer,
    GridContainer,
    InputLabel,
    SubmitButtonContainer,
    Input,
    ReactSelect,
    CurrencyLabel,
    AmountButton,
    AmountButtonContainer,
    TotalLabel,
    TotalContainer,
    Total,
    SubmitButton,
} from '../components';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'theme/common';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { GWEI_UNIT } from 'constants/network';
import Web3 from 'web3';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';

type TokenSwapProps = {
    optionSide: OptionSide;
};

export type OrderSideOptionType = { value: OrderSide; label: string };

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
    const [addressToApprove, setAddressToApprove] = useState<string | null>(null);
    const [swapQuote, setSwapQuote] = useState<any>();
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [slippage, setSlippage] = useState<number>(SLIPPAGE_PERCENTAGE[1]);
    const [priceImpactPercentage, setPriceImpactPercentage] = useState<number | string>('0');
    const [insufficientBalance0x, setInsufficientBalance0x] = useState<boolean>(false);
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
        const { balances } = accountMarketInfoQuery.data as AccountMarketInfo;
        optBalances = balances;
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

    const isButtonDisabled =
        price === '' ||
        Number(price) <= 0 ||
        amount === '' ||
        Number(amount) <= 0 ||
        isSubmitting ||
        !isWalletConnected ||
        (isBuy ? !sUSDBalance : !tokenBalance);

    const buyToken = isBuy ? baseToken : SynthsUSD.address;
    const sellToken = isBuy ? SynthsUSD.address : baseToken;

    const insufficientBalance = isBuy ? total > sUSDBalance : amount > tokenBalance;
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
        if (addressToApprove) {
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
        } else {
            setAllowance(false);
        }
    }, [walletAddress, isWalletConnected, isBuy, addressToApprove, optionSide]);

    useEffect(() => {
        onAmountChange(amount);
    }, [buyToken, sellToken]);

    const handleAllowance = async () => {
        if (gasPrice !== null && addressToApprove) {
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
                setIsSubmitting(true);
                window.web3 = new Web3(Web3.givenProvider);
                const quote = { ...swapQuote, from: walletAddress };
                await window.web3.eth.sendTransaction(quote);
                setIsSubmitting(false);
            }
        } catch (error) {
            setIsSubmitting(false);
            console.log(error);
        }
    };
    const calculateAmount = (percentage: number) => {
        if (isBuy) return;
        const maxsOPTBalance = tokenBalance;
        const newAmount = (maxsOPTBalance * percentage) / 100;
        setAmount(newAmount);
    };

    const setSlippageAndRecalucalte = (newSlippage: number) => {
        setSlippage(newSlippage);
        onAmountChange(amount, newSlippage);
    };

    const onAmountChange = async (newAmount: string | number, newSlippage?: number) => {
        // TODO refactor this method
        setAmount(newAmount);
        if (newAmount !== '' && Number(newAmount) > 0) {
            const tokenAmount = Web3Wrapper.toBaseUnitAmount(toBigNumber(newAmount), DEFAULT_TOKEN_DECIMALS);
            try {
                const swapUrl = `${baseUrl}swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&${
                    isBuy ? 'buyAmount' : 'sellAmount'
                }=${tokenAmount}&slippagePercentage=${(newSlippage || slippage) / 100}${
                    gasPrice != null ? `&gasPrice=${gasPrice * GWEI_UNIT}` : ''
                }${isWalletConnected && hasAllowance ? `&takerAddress=${walletAddress}` : ''}`;

                const response = await fetch(swapUrl);
                if (response.status == 200) {
                    const quote = await response.json();
                    setPrice(quote.price);
                    setAddressToApprove(quote.allowanceTarget);
                    setTotal(Number(newAmount) * Number(quote.price));
                    setMinimumReceived(Number(newAmount) * Number(quote.guaranteedPrice));
                    setSwapQuote(quote);
                    if (ethRate !== null) {
                        setProtocolFee((quote.protocolFee * ethRate) / GWEI_UNIT / GWEI_UNIT);
                    }
                    setInsufficientLiquidity(false);
                    setGasLimit(quote.gas);
                    if (isBuy) {
                        setPriceImpactPercentage(bestBuyPrice ? (quote.price - bestBuyPrice) / bestBuyPrice : 0);
                    } else {
                        setPriceImpactPercentage(bestSellPrice ? -(bestSellPrice - quote.price) / bestSellPrice : 0);
                    }
                    setInsufficientBalance0x(false);
                } else {
                    const quote = await response.json();
                    console.log(quote);
                    setPrice('');
                    setAddressToApprove('');
                    setTotal('');
                    setMinimumReceived('');
                    setSwapQuote(undefined);
                    setProtocolFee('');
                    setInsufficientLiquidity(quote.code === 100);
                    setInsufficientBalance0x(quote.code === 105);
                    setGasLimit(null);
                    setPriceImpactPercentage('0');
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            setPrice('');
            setAddressToApprove('');
            setTotal('');
            setMinimumReceived('');
            setSwapQuote(undefined);
            setProtocolFee('');
            setInsufficientLiquidity(false);
            setGasLimit(null);
            setPriceImpactPercentage('0');
            setInsufficientBalance0x(false);
        }
    };

    return (
        <Container>
            <InputContainer>
                <ReactSelect
                    formatOptionLabel={(option: any) => option.label}
                    options={orderSideOptions}
                    value={orderSide}
                    onChange={(option: any) => setOrderSide(option)}
                    isSearchable={false}
                    isUppercase
                />
                <InputLabel>{t('options.market.trade-options.place-order.order-type-label')}</InputLabel>
            </InputContainer>
            <GridContainer>
                <InputContainer>
                    <Input
                        value={amount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide: orderSide.value })}
                    </InputLabel>
                    <CurrencyLabel>{'sOPT'}</CurrencyLabel>
                </InputContainer>
            </GridContainer>
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
            <TotalContainer>
                <SlippageLabel>{t('options.market.trade-options.place-order.slippage-label')}</SlippageLabel>
                <FlexDivCentered>
                    {SLIPPAGE_PERCENTAGE.map((percentage: number) => (
                        <SlippageButton
                            className={percentage === slippage ? 'selected' : ''}
                            key={percentage}
                            onClick={() => setSlippageAndRecalucalte(percentage)}
                        >
                            {`${percentage}%`}
                        </SlippageButton>
                    ))}
                    <SlippageContainer>
                        <SlippageInput
                            value={slippage}
                            onChange={(e) => setSlippageAndRecalucalte(Number(e.target.value))}
                            id="slippage"
                            type="number"
                            min="0"
                            step="any"
                        />
                        <PercentageLabel>%</PercentageLabel>
                    </SlippageContainer>
                </FlexDivCentered>
            </TotalContainer>
            <TotalContainer>
                <TotalLabel>{t('options.market.trade-options.place-order.price-label')}</TotalLabel>
                <Price
                    isWarning={
                        Number(priceImpactPercentage) > SLIPPAGE_THRESHOLD ||
                        Number(priceImpactPercentage) < -SLIPPAGE_THRESHOLD
                    }
                >{`${formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(price))} (${formatPercentageWithSign(
                    priceImpactPercentage
                )})`}</Price>
            </TotalContainer>

            <TotalContainer>
                <TotalLabel>{t('options.market.trade-options.place-order.total-label')}</TotalLabel>
                <Total>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, total)}</Total>
            </TotalContainer>
            <TotalContainer>
                <TotalLabel>
                    {t(`options.market.trade-options.place-order.${isBuy ? 'total-max-label' : 'total-min-label'}`)}
                </TotalLabel>
                <Total>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, minimumReceived)}</Total>
            </TotalContainer>
            <Divider />
            <ProtocolFeeContainer>
                <TotalLabel>{t('options.market.trade-options.place-order.protocol-fee-label')}</TotalLabel>
                <Total>{formatCurrencyWithSign(USD_SIGN, protocolFee)}</Total>
            </ProtocolFeeContainer>
            <NetworkFeesContainer>
                <NetworkFees gasLimit={gasLimit} labelColor={'dusty'} priceColor={'pale-grey'} />
            </NetworkFeesContainer>
            <SubmitButtonContainer>
                {' '}
                {hasAllowance ||
                insufficientBalance ||
                insufficientBalance0x ||
                insufficientLiquidity ||
                addressToApprove === '' ? (
                    <SubmitButton
                        isBuy={isBuy}
                        disabled={
                            isButtonDisabled ||
                            insufficientBalance ||
                            insufficientBalance0x ||
                            insufficientLiquidity ||
                            addressToApprove === ''
                        }
                        onClick={handleSubmitOrder}
                    >
                        {insufficientBalance || insufficientBalance0x
                            ? t('common.errors.insufficient-balance')
                            : insufficientLiquidity
                            ? t('common.errors.insufficient-liquidity')
                            : !isSubmitting
                            ? t(`options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.label`)
                            : t(
                                  `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.progress-label`
                              )}
                    </SubmitButton>
                ) : (
                    <SubmitButton
                        isBuy={isBuy}
                        disabled={isAllowing || !isWalletConnected || addressToApprove === ''}
                        onClick={handleAllowance}
                    >
                        {!isAllowing
                            ? t('common.enable-wallet-access.label')
                            : t('common.enable-wallet-access.progress-label')}
                    </SubmitButton>
                )}
            </SubmitButtonContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
        </Container>
    );
};

const NetworkFeesContainer = styled.div`
    padding: 0 45px;
`;

const Divider = styled.hr`
    width: 90%;
    border: none;
    border-top: 2px solid rgba(1, 38, 81, 0.5);
`;

const SlippageButton = styled(AmountButton)`
    margin: 0 10px 0 0;
    &.selected {
        background: rgba(1, 38, 81, 0.5);
        border: 2px solid #04045a;
        color: #04045a;
    }
`;

const SlippageInput = styled(Input)`
    height: 32px;
    width: 80px;
    padding: 0;
    padding-left: 10px;
`;

const PercentageLabel = styled(CurrencyLabel)`
    padding: 0 10px 8px 0;
`;

const SlippageContainer = styled(InputContainer)`
    margin: 0;
`;

const SlippageLabel = styled(TotalLabel)`
    display: flex;
    align-items: center;
`;

const ProtocolFeeContainer = styled(FlexDivRow)`
    padding: 0 45px;
    margin-bottom: 10px;
`;

const Price = styled(Total)<{ isWarning: boolean }>`
    color: ${(props) => (props.isWarning ? 'rgb(240, 185, 11)' : '#f6f6fe')};
`;

export default TokenSwap;
