// import { generatePseudoRandomSalt, NULL_ADDRESS } from '@0x/order-utils';
// import { LimitOrder, SignatureType } from '@0x/protocol-utils';
// import { Web3Wrapper } from '@0x/web3-wrapper';
// import axios from 'axios';
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
import { Form, Input, Segment, Button, Message, Divider } from 'semantic-ui-react';
import { AccountMarketInfo, OptionSide, OrderSide } from 'types/options';
// import { get0xBaseURL } from 'utils/0x';
import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrencyWithKey, toBigNumber } from 'utils/formatters/number';
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
    // OrderPeriod,
    // OrderPeriodItem,
    // ORDER_PERIOD_IN_SECONDS,
    // ORDER_PERIOD_ITEMS_MAP,
} from 'constants/options';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
// import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import NetworkFees from 'pages/Options/components/NetworkFees';

type TokenSwapProps = {
    optionSide: OptionSide;
};

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
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [orderSide, setOrderSide] = useState<OrderSide>('buy');
    const [addressToApprove, setAddressToApprove] = useState<string | null>(null);
    const [swapQuote, setSwapQuote] = useState<any>();
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

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
    const isBuy = orderSide === 'buy';

    const isButtonDisabled =
        // price === '' ||
        // Number(price) <= 0 ||
        amount === '' ||
        Number(amount) <= 0 ||
        isSubmitting ||
        !isWalletConnected ||
        (isBuy ? !sUSDBalance : !tokenBalance);

    const buyToken = isBuy ? baseToken : SynthsUSD.address;
    const sellToken = isBuy ? SynthsUSD.address : baseToken;

    const insufficientBalance = isBuy ? total > sUSDBalance : amount > tokenBalance;

    useEffect(() => {
        if (addressToApprove) {
            const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
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
        } else {
            setAllowance(false);
        }
    }, [walletAddress, isWalletConnected, isBuy, addressToApprove, optionSide]);

    useEffect(() => {
        onAmountChange(amount);
    }, [buyToken, sellToken]);

    const handleAllowance = async () => {
        if (gasPrice !== null && !addressToApprove) {
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
        console.log(swapQuote);
    };

    const calculateAmount = (percentage: number) => {
        if (isBuy) return;
        const maxsOPTBalance = tokenBalance;
        const newAmount = (maxsOPTBalance * percentage) / 100;
        setAmount(newAmount);
    };

    const onAmountChange = async (newAmount: string | number) => {
        setAmount(newAmount);
        if (newAmount !== '' && Number(newAmount) > 0) {
            const tokenAmount = Web3Wrapper.toBaseUnitAmount(toBigNumber(newAmount), DEFAULT_TOKEN_DECIMALS);
            try {
                const swapUrl = isBuy
                    ? `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&buyAmount=${tokenAmount}`
                    : `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${tokenAmount}`;
                const response = await fetch(swapUrl);
                if (response.status == 200) {
                    const quote = await response.json();
                    setPrice(quote.price);
                    setAddressToApprove(quote.allowanceTarget);
                    setTotal(Number(newAmount) * Number(quote.price));
                    setSwapQuote(quote);
                    setInsufficientLiquidity(false);
                    setGasLimit(quote.gas);
                } else {
                    const quote = await response.json();
                    console.log(quote);
                    setPrice('');
                    setAddressToApprove('');
                    setTotal('');
                    setSwapQuote(undefined);
                    setInsufficientLiquidity(true);
                    setGasLimit(null);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            setPrice('');
            setAddressToApprove('');
            setTotal('');
            setSwapQuote(undefined);
            setInsufficientLiquidity(false);
            setGasLimit(null);
        }
    };

    return (
        <Segment>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                        {t('options.market.trade-options.place-order.order-type-label')}
                    </label>
                    <span>
                        <Button size="mini" positive={orderSide === 'buy'} onClick={() => setOrderSide('buy')}>
                            {t('common.buy')}
                        </Button>
                        <Button size="mini" negative={orderSide === 'sell'} onClick={() => setOrderSide('sell')}>
                            {t('common.sell')}
                        </Button>
                    </span>
                </Form.Field>
                <Form.Field>
                    <label style={{ textTransform: 'none' }}>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide })}
                    </label>
                    <Input
                        fluid
                        value={amount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        label="sOPT"
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                    />
                    {!isBuy && (
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                            {AMOUNT_PERCENTAGE.map((percentage: number) => (
                                <Button
                                    size="mini"
                                    key={percentage}
                                    onClick={() => calculateAmount(percentage)}
                                    color="teal"
                                    disabled={isBuy}
                                >
                                    {`${percentage}%`}
                                </Button>
                            ))}
                        </div>
                    )}
                </Form.Field>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('options.market.trade-options.place-order.price-label')}</span>
                    <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(price))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t('options.market.trade-options.place-order.total-label')}</span>
                    <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, total)}</span>
                </div>
            </Form>
            <Divider />
            <div style={{ marginTop: 10 }}>
                <NetworkFees gasLimit={gasLimit} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                {hasAllowance ? (
                    <Button color={isBuy ? 'green' : 'red'} disabled={isButtonDisabled} onClick={handleSubmitOrder}>
                        {insufficientBalance
                            ? t('common.errors.insufficient-balance')
                            : insufficientLiquidity
                            ? t('common.errors.insufficient-liquidity')
                            : !isSubmitting
                            ? t('options.market.trade-options.place-order.confirm-button.label')
                            : t('options.market.trade-options.place-order.confirm-button.progress-label')}
                    </Button>
                ) : (
                    <Button
                        color={isBuy ? 'green' : 'red'}
                        disabled={isAllowing || !isWalletConnected || addressToApprove === ''}
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

export default TokenSwap;
