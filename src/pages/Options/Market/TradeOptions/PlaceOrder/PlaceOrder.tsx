import { generatePseudoRandomSalt, NULL_ADDRESS } from '@0x/order-utils';
import { LimitOrder, SignatureType } from '@0x/protocol-utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import axios from 'axios';
import { SYNTHS_MAP } from 'constants/currency';
// import { EMPTY_VALUE } from 'constants/placeholder';
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
import { formatCurrencyWithKey, toBigNumber } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
// import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import erc20Contract from 'utils/contracts/erc20Contract';
import { ethers } from 'ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { APPROVAL_EVENTS } from 'constants/events';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import {
    AMOUNT_PERCENTAGE,
    OrderPeriod,
    OrderPeriodItem,
    ORDER_PERIOD_IN_SECONDS,
    ORDER_PERIOD_ITEMS_MAP,
} from 'constants/options';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ValueType } from 'react-select';
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
import { refetchOrderbook } from 'utils/queryConnector';

type PlaceOrderProps = {
    optionSide: OptionSide;
};

export type ExpirationOptionType = { value: string; label: string };
export type OrderSideOptionType = { value: OrderSide; label: string };

const PlaceOrder: React.FC<PlaceOrderProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [price, setPrice] = useState<number | string>('');
    const [amount, setAmount] = useState<number | string>('');
    const [expiration, setExpiration] = useState<ValueType<ExpirationOptionType, false>>();
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const contractAddresses0x = getContractAddressesForChainOrThrow(networkId);

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
    const baseToken = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;
    const isBuy = orderSide.value === 'buy';

    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    const makerToken = isBuy ? SynthsUSD.address : baseToken;
    const takerToken = isBuy ? baseToken : SynthsUSD.address;
    const addressToApprove: string = contractAddresses0x.exchangeProxy;

    const isButtonDisabled =
        price === '' ||
        Number(price) <= 0 ||
        expiration === undefined ||
        amount === '' ||
        Number(amount) <= 0 ||
        isSubmitting ||
        !isWalletConnected ||
        (isBuy ? !sUSDBalance : !tokenBalance);

    const expirationOptions = ORDER_PERIOD_ITEMS_MAP.map((period: OrderPeriodItem) => {
        return {
            value: period.value,
            label: t(period.i18nLabel),
        };
    });

    const getOrderEndDate = () => {
        let orderEndDate = 0;
        if (expiration) {
            orderEndDate =
                expiration.value === OrderPeriod.TRADING_END
                    ? Math.round(optionsMarket.timeRemaining / 1000)
                    : Math.round(new Date().getTime() / 1000) +
                      ORDER_PERIOD_IN_SECONDS[expiration.value as OrderPeriod];
        }
        return toBigNumber(orderEndDate);
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(makerToken, erc20Contract.abi, snxJSConnector.signer);
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
            const erc20Instance = new ethers.Contract(makerToken, erc20Contract.abi, snxJSConnector.signer);
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
        setTxErrorMessage(null);
        setIsSubmitting(true);

        const baseUrl = get0xBaseURL(networkId);
        const placeOrderUrl = `${baseUrl}sra/v4/order`;

        const makerAmount = Web3Wrapper.toBaseUnitAmount(
            toBigNumber(isBuy ? Number(amount) * Number(price) : amount),
            DEFAULT_TOKEN_DECIMALS
        );
        const takerAmount = Web3Wrapper.toBaseUnitAmount(
            toBigNumber(isBuy ? amount : Number(amount) * Number(price)),
            DEFAULT_TOKEN_DECIMALS
        );
        const expiry = getOrderEndDate();
        const salt = generatePseudoRandomSalt();

        try {
            const createSignedOrderV4Async = async () => {
                const order = new LimitOrder({
                    makerToken,
                    takerToken,
                    makerAmount,
                    takerAmount,
                    maker: walletAddress,
                    sender: NULL_ADDRESS,
                    expiry,
                    salt,
                    chainId: networkId,
                    verifyingContract: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
                });

                try {
                    const signature = await order.getSignatureWithProviderAsync(
                        (snxJSConnector.signer?.provider as any).provider,
                        SignatureType.EIP712
                    );
                    return { ...order, signature };
                } catch (e) {
                    console.log(e);
                }
            };

            const signedOrder = await createSignedOrderV4Async();

            try {
                await axios({
                    method: 'POST',
                    url: placeOrderUrl,
                    data: signedOrder,
                });
                refetchOrderbook(baseToken);
            } catch (err) {
                console.error(JSON.stringify(err.response.data));
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsSubmitting(false);
            }
            setIsSubmitting(false);
        } catch (e) {
            console.error(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsSubmitting(false);
        }
    };

    const calculateAmount = (percentage: number) => {
        if (isBuy && price === '') return;
        const maxsOPTBalance = isBuy ? sUSDBalance / Number(price) : tokenBalance;
        const newAmount = (maxsOPTBalance * percentage) / 100;
        setAmount(newAmount);
    };

    return (
        <Container>
            {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span>
                    <WalletIcon />
                    {isWalletConnected
                        ? isBuy
                            ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)
                            : formatCurrencyWithKey('sOPT', tokenBalance)
                        : EMPTY_VALUE}
                </span>
            </div> */}
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
                    <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="any" />
                    <InputLabel>{t('options.market.trade-options.place-order.price-label')}</InputLabel>
                    <CurrencyLabel>{SYNTHS_MAP.sUSD}</CurrencyLabel>
                </InputContainer>
                <InputContainer>
                    <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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
            <InputContainer>
                <ReactSelect
                    formatOptionLabel={(option: any) => option.label}
                    options={expirationOptions}
                    placeholder={''}
                    value={expiration}
                    onChange={(option: any) => setExpiration(option)}
                    isSearchable={false}
                />
                <InputLabel>{t('options.market.trade-options.place-order.expiration-label')}</InputLabel>
            </InputContainer>
            <TotalContainer>
                <TotalLabel>{t('options.market.trade-options.place-order.total-label')}</TotalLabel>
                <Total>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(price) * Number(amount))}</Total>
            </TotalContainer>
            <SubmitButtonContainer>
                {hasAllowance ? (
                    <SubmitButton isBuy={isBuy} disabled={isButtonDisabled} onClick={handleSubmitOrder}>
                        {!isSubmitting
                            ? t('options.market.trade-options.place-order.confirm-button.label')
                            : t('options.market.trade-options.place-order.confirm-button.progress-label')}
                    </SubmitButton>
                ) : (
                    <SubmitButton isBuy={isBuy} disabled={isAllowing || !isWalletConnected} onClick={handleAllowance}>
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

export default PlaceOrder;
