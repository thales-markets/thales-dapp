import { generatePseudoRandomSalt, NULL_ADDRESS } from '@0x/order-utils';
import { LimitOrder, SignatureType } from '@0x/protocol-utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { DECIMALS } from 'constants/0x';
import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
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
import { Form, Input, Segment, Button, Message, Header, Dropdown } from 'semantic-ui-react';
import { OrderSide } from 'types/options';
import { get0xBaseURL } from 'utils/0x';
import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';
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
import { useContractWrappers0xContext } from 'pages/Options/Market/contexts/ContractWrappers0xContext';

type PlaceOrderSideProps = {
    baseToken: string;
    orderSide: OrderSide;
    tokenBalance: number;
};

const PlaceOrderSide: React.FC<PlaceOrderSideProps> = ({ baseToken, orderSide, tokenBalance }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const contractWrappers0x = useContractWrappers0xContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [price, setPrice] = useState<number | string>('');
    const [amount, setAmount] = useState<number | string>('');
    const [expiration, setExpiration] = useState<string | undefined>(undefined);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

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
    const isBuy = orderSide === 'buy';

    const isButtonDisabled =
        price === '' ||
        Number(price) <= 0 ||
        expiration === undefined ||
        amount === '' ||
        Number(amount) <= 0 ||
        isSubmitting ||
        !isWalletConnected ||
        (isBuy ? !sUSDBalance : !tokenBalance);

    const makerToken = isBuy ? SynthsUSD.address : baseToken;
    const takerToken = isBuy ? baseToken : SynthsUSD.address;
    const addressToApprove: string = contractWrappers0x.exchangeProxy.address;

    const expirationOptions = ORDER_PERIOD_ITEMS_MAP.map((period: OrderPeriodItem) => {
        return {
            key: period.value,
            value: period.value,
            text: t(period.i18nLabel),
        };
    });

    const getOrderEndDate = () => {
        let orderEndDate = 0;
        if (expiration) {
            orderEndDate =
                expiration === OrderPeriod.TRADING_END
                    ? Math.round(optionsMarket.timeRemaining / 1000)
                    : Math.round(new Date().getTime() / 1000) + ORDER_PERIOD_IN_SECONDS[expiration as OrderPeriod];
        }
        return new BigNumber(orderEndDate);
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(makerToken, erc20Contract.abi, snxJSConnector.signer);
        const getAllowance = async () => {
            const allowance = await erc20Instance.allowance(walletAddress, addressToApprove);
            setAllowance(!!bigNumberFormatter(allowance));
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
    }, [walletAddress, isWalletConnected]);

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
        const placeOrderUrl = `${baseUrl}order`;

        const makerAmount = Web3Wrapper.toBaseUnitAmount(
            new BigNumber(isBuy ? Number(amount) * Number(price) : amount),
            DECIMALS
        );
        const takerAmount = Web3Wrapper.toBaseUnitAmount(
            new BigNumber(isBuy ? amount : Number(amount) * Number(price)),
            DECIMALS
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
        <Segment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Header as="h3">{t(`options.market.trade-options.place-order.${orderSide}.title`)}</Header>
                <span>
                    <WalletIcon />
                    {isWalletConnected
                        ? isBuy
                            ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)
                            : formatCurrencyWithKey('sOPT', tokenBalance)
                        : EMPTY_VALUE}
                </span>
            </div>
            <Form>
                <Form.Field>
                    <label style={{ textTransform: 'none' }}>
                        {t('options.market.trade-options.place-order.price-label')}
                    </label>
                    <Input
                        fluid
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        label={SYNTHS_MAP.sUSD}
                        id="price"
                        type="number"
                        min="0"
                        step="any"
                    />
                </Form.Field>
                <Form.Field>
                    <label style={{ textTransform: 'none' }}>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide })}
                    </label>
                    <Input
                        fluid
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        label="sOPT"
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                    />
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                        {AMOUNT_PERCENTAGE.map((percentage: number) => (
                            <Button
                                size="mini"
                                key={percentage}
                                onClick={() => calculateAmount(percentage)}
                                color="teal"
                                disabled={isBuy && price === ''}
                            >
                                {`${percentage}%`}
                            </Button>
                        ))}
                    </div>
                </Form.Field>
                <Form.Field>
                    <label style={{ textTransform: 'none' }}>
                        {t('options.market.trade-options.place-order.expiration-label')}
                    </label>
                    <Dropdown
                        value={expiration}
                        onChange={(_, data) => setExpiration(data.value?.toString())}
                        placeholder={t('common.select')}
                        selection
                        options={expirationOptions}
                    />
                </Form.Field>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('options.market.trade-options.place-order.total-label')}</span>
                    <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(price) * Number(amount))}</span>
                </div>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                {hasAllowance ? (
                    <Button color={isBuy ? 'green' : 'red'} disabled={isButtonDisabled} onClick={handleSubmitOrder}>
                        {!isSubmitting
                            ? t('options.market.trade-options.place-order.confirm-button.label')
                            : t('options.market.trade-options.place-order.confirm-button.progress-label')}
                    </Button>
                ) : (
                    <Button
                        color={isBuy ? 'green' : 'red'}
                        disabled={isAllowing || !isWalletConnected}
                        onClick={handleAllowance}
                    >
                        {!isAllowing
                            ? t('common.enable-wallet-access.label')
                            : t('common.enable-wallet-access.progress-label')}
                    </Button>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
        </Segment>
    );
};

export default PlaceOrderSide;
