import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Switch from 'components/SwitchInput/SwitchInputNew';
import Input from 'pages/AMMTrading/components/AMM/components/Input';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import { Fixed } from 'pages/AMMTrading/components/AMM/components/Slippage/styled-components/Container';
import Select from 'pages/AMMTrading/components/AMM/components/Select';

import { orderSideOptions } from 'constants/options';
import { OrderSideOptionType } from 'types/options';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { AccountMarketInfo, OptionSide, OrderSide } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrency, truncToDecimals } from 'utils/formatters/number';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance, formatGasLimit } from 'utils/network';
import { createOneInchLimitOrder, ONE_INCH_CONTRACTS } from 'utils/1inch';
import {
    AMOUNT_PERCENTAGE,
    ORDER_PERIOD_IN_SECONDS,
    ORDER_PERIOD_ITEMS_MAP,
    OrderPeriod,
    OrderPeriodItem,
} from 'constants/options';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { getErrorToastOptions, getSuccessToastOptions, UI_COLORS } from 'constants/ui';

import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { refetchOrderbook, refetchOrders } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import erc20Contract from 'utils/contracts/erc20Contract';
import onboardConnector from 'utils/onboardConnector';

import { useTranslation } from 'react-i18next';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import RangeSlider from 'components/RangeSlider';
import { FlexDivCentered } from 'theme/common';
import { toast } from 'react-toastify';

type LimitOrderProps = {
    optionSide: OptionSide;
    market?: any;
    defaultOrderSide?: OrderSide;
    defaultPrice?: number | string;
    defaultAmount?: number | string;
    onPlaceOrder?: any;
};

const LimitOrder: React.FC<LimitOrderProps> = ({
    optionSide,
    market,
    defaultOrderSide,
    defaultPrice,
    defaultAmount,
    onPlaceOrder,
}) => {
    const { t } = useTranslation();

    const optionsMarket = market || useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [price, setPrice] = useState<number | string>(defaultPrice || '');
    const [amount, setAmount] = useState<number | string>(defaultAmount || '');
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [isPriceValid, setIsPriceValid] = useState(true);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isExpirationAfterMaturity, setIsExpirationAfterMaturity] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [selectedPercentage, setPercentage] = useState<number>(25);

    const defaultOrderSideOption = orderSideOptions.find((option) => option.value === defaultOrderSide);
    const [orderSide, setOrderSide] = useState<OrderSideOptionType>(defaultOrderSideOption || orderSideOptions[0]);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

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
    const makerAmount = isBuy ? Number(price) * Number(amount) : amount;
    const makerTokenCurrencyKey = isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide];
    const takerToken = isBuy ? baseToken : SynthsUSD.address;
    const addressToApprove = ONE_INCH_CONTRACTS[networkId] || '';

    const expirationOptions = ORDER_PERIOD_ITEMS_MAP.map((period: OrderPeriodItem) => {
        return {
            value: period.value,
            label: t(period.i18nLabel),
        };
    });

    const [expiration, setExpiration] = useState<OrderPeriod | undefined>(OrderPeriod.ONE_DAY);
    const [customHoursExpiration, setCustomHoursExpiration] = useState<number | string>('');

    const isPriceEntered = Number(price) > 0;
    const isAmountEntered = Number(amount) > 0;
    const isExpirationEntered = expiration !== undefined;
    const insufficientBalance = isBuy
        ? sUSDBalance < Number(price) * Number(amount) || !sUSDBalance
        : tokenBalance < Number(amount) || !tokenBalance;

    const isButtonDisabled =
        !isPriceEntered ||
        !isAmountEntered ||
        !isExpirationEntered ||
        isSubmitting ||
        !isWalletConnected ||
        insufficientBalance ||
        !isPriceValid ||
        !hasAllowance;

    const getOrderEndDate = () => {
        let orderEndDate = 0;
        if (expiration) {
            orderEndDate =
                expiration === OrderPeriod.TRADING_END
                    ? Math.round(optionsMarket.timeRemaining / 1000)
                    : expiration === OrderPeriod.CUSTOM
                    ? Math.round(new Date().getTime() / 1000) +
                      Math.round(Number(customHoursExpiration) * ORDER_PERIOD_IN_SECONDS[OrderPeriod.ONE_HOUR])
                    : Math.round(new Date().getTime() / 1000) + ORDER_PERIOD_IN_SECONDS[expiration as OrderPeriod];
        }
        return orderEndDate;
    };

    const checkIfPeriodEndsAfterMarketMaturity = useCallback(
        (periodDurationInSeconds: number, suppressNotification?: boolean) => {
            const now = new Date().getTime() / 1000;
            if (now + periodDurationInSeconds >= optionsMarket.maturityDate / 1000) {
                if (!suppressNotification) {
                    // dispatchMarketNotification('Order expiration cannot be after market maturity', 'error');
                    setIsExpirationAfterMaturity(true);
                    setTimeout(() => {
                        setIsExpirationAfterMaturity(false);
                    }, 5000);
                }
                return true;
            }
            return false;
        },
        [optionsMarket]
    );

    const setExpirationCallback = useCallback(
        (period: OrderPeriod | undefined, suppressNotification?: boolean) => {
            if (period && checkIfPeriodEndsAfterMarketMaturity(ORDER_PERIOD_IN_SECONDS[period], suppressNotification)) {
                setExpiration(OrderPeriod.TRADING_END);
            } else {
                setExpiration(period);
            }
        },
        [setExpiration, optionsMarket]
    );

    const setCustomHoursExpirationCallback = useCallback(
        (hours: number | string) => {
            if (checkIfPeriodEndsAfterMarketMaturity(Number(hours) * ORDER_PERIOD_IN_SECONDS[OrderPeriod.ONE_HOUR])) {
                setCustomHoursExpiration('');
                setExpiration(OrderPeriod.TRADING_END);
            } else {
                setCustomHoursExpiration(hours);
            }
        },
        [setCustomHoursExpiration, setExpiration]
    );

    useEffect(() => {
        const erc20Instance = new ethers.Contract(makerToken, erc20Contract.abi, snxJSConnector.signer);
        const getAllowance = async () => {
            try {
                const parsedMakerAmount = ethers.utils.parseEther(Number(makerAmount).toString());
                const allowance = await checkAllowance(
                    parsedMakerAmount,
                    erc20Instance,
                    walletAddress,
                    addressToApprove
                );
                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected) {
            getAllowance();
        }
    }, [walletAddress, isWalletConnected, isBuy, optionSide, hasAllowance, makerAmount, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(makerToken, erc20Contract.abi, snxJSConnector.signer);
        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, approveAmount);
            const tx = (await erc20Instance.approve(addressToApprove, approveAmount, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            setIsAllowing(false);
        }
    };

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);

        const id = toast.loading(t('options.market.trade-options.place-order.confirm-button.progress-label'));

        const newMakerAmount = isBuy ? Number(amount) * Number(price) : amount;
        const newTakerAmount = isBuy ? amount : Number(amount) * Number(price);
        const expiry = getOrderEndDate();

        try {
            await createOneInchLimitOrder(
                walletAddress,
                networkId,
                makerToken,
                takerToken,
                newMakerAmount,
                newTakerAmount,
                expiry
            );
            toast.update(
                id,
                getSuccessToastOptions(
                    t('options.market.trade-options.place-order.confirm-button.confirmation-message')
                )
            );
            refetchOrderbook(baseToken);
            refetchOrders(networkId);
            resetForm();
            onPlaceOrder && onPlaceOrder();
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
        }
        setIsSubmitting(false);
    };

    const calculateAmount = (percentage: number) => {
        setPercentage(percentage);
        if (isBuy && price === '') return;
        const maxsOPTBalance = isBuy ? sUSDBalance / Number(price) : tokenBalance;
        const newAmount = (maxsOPTBalance * percentage) / 100;
        setAmount(truncToDecimals(newAmount, DEFAULT_OPTIONS_DECIMALS));
    };

    const getSubmitButton = () => {
        const defaultButtonProps = {
            padding: '3px 35px',
            active: true,
            margin: '80px auto 0 auto',
            hoverShadow: 'var(--button-shadow)',
            fontSize: '20px',
        };

        if (!isWalletConnected) {
            return (
                <Button {...defaultButtonProps} onClickHandler={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (insufficientBalance) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!isPriceEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-price`)}
                </Button>
            );
        }
        if (isPriceEntered && !isPriceValid) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.invalid-price`)}
                </Button>
            );
        }
        if (!isExpirationEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-expiration`)}
                </Button>
            );
        }
        if (!hasAllowance) {
            return (
                <Button {...defaultButtonProps} disabled={isAllowing} onClickHandler={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: makerTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: makerTokenCurrencyKey,
                          })}
                </Button>
            );
        }
        return (
            <Button {...defaultButtonProps} disabled={isButtonDisabled} onClickHandler={handleSubmitOrder}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.confirm-button.label`)
                    : t(`options.market.trade-options.place-order.confirm-button.progress-label`)}
            </Button>
        );
    };

    const resetForm = () => {
        setAmount(defaultAmount || '');
        setPrice(defaultPrice || '');
        setExpirationCallback(OrderPeriod.ONE_DAY, true);
        setCustomHoursExpiration('');
        const defaultOrderSideOption = orderSideOptions.find((option) => option.value === defaultOrderSide);
        setOrderSide(defaultOrderSideOption || orderSideOptions[0]);
        setIsPriceValid(true);
        setIsAmountValid(true);
        setPercentage(0);
    };

    useEffect(() => {
        resetForm();
    }, [optionSide]);

    useEffect(() => {
        const total = Number(price) * Number(amount);
        setIsAmountValid(
            Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? (Number(total) > 0 && Number(total) <= sUSDBalance) ||
                          (Number(total) === 0 && sUSDBalance > 0)
                        : Number(amount) <= tokenBalance))
        );
    }, [amount, price, isBuy, sUSDBalance, tokenBalance]);

    return (
        <>
            <Switch
                active={orderSide == orderSideOptions[1]}
                width={'94px'}
                height={'32px'}
                dotSize={'22px'}
                label={{
                    firstLabel: t(orderSideOptions[0].i18nLabel).toUpperCase(),
                    secondLabel: t(orderSideOptions[1].i18nLabel).toUpperCase(),
                    fontSize: '25px',
                }}
                shadow={true}
                dotBackground={'var(--amm-switch-circle)'}
                handleClick={() =>
                    orderSide == orderSideOptions[0]
                        ? setOrderSide(orderSideOptions[1])
                        : setOrderSide(orderSideOptions[0])
                }
                margin={'20px 0px'}
            />
            <Input
                title={t('options.market.trade-options.place-order.price-label', {
                    currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                })}
                value={price}
                valueChange={(value) => {
                    setIsPriceValid(Number(value) <= 1);
                    setPrice(value);
                }}
                valueType={'number'}
                subValue={SYNTHS_MAP.sUSD}
                valueEditDisable={isSubmitting}
                borderColor={!isPriceValid ? UI_COLORS.RED : ''}
                displayTooltip={!isPriceValid}
                tooltipText={t(`common.errors.invalid-price-max`, { max: 1 })}
            />
            <RangeSlider
                min={0}
                step={0.01}
                max={1}
                container={{ margin: '0 0 8px 0' }}
                defaultValue={Number(price)}
                onChangeEventHandler={(value) => {
                    setIsPriceValid(Number(value) <= 1);
                    setPrice(Number(value));
                }}
                showInFooterMinMax={true}
                footerText={[`${USD_SIGN}0`, `${USD_SIGN}1`]}
            />
            <Input
                title={t('options.market.trade-options.place-order.amount-label', { orderSide: orderSide.value })}
                value={amount}
                valueChange={(value) => {
                    setAmount(value);
                }}
                valueType={'number'}
                subValue={OPTIONS_CURRENCY_MAP[optionSide]}
                valueEditDisable={isSubmitting}
                borderColor={!isAmountValid ? UI_COLORS.RED : ''}
            />
            <FlexDivCentered style={{ margin: '4px 0 11px 0' }}>
                {AMOUNT_PERCENTAGE.map((percentage: number) => (
                    <Fixed
                        key={percentage}
                        onClick={() => calculateAmount(percentage)}
                        margin={'0 20px 0 20px'}
                        active={percentage == selectedPercentage}
                    >
                        {`${percentage}%`}
                    </Fixed>
                ))}
            </FlexDivCentered>
            <Select
                title={{ text: t('options.market.trade-options.place-order.expiration-label') }}
                value={{ text: expiration }}
                tooltip={{
                    show: !isExpirationEntered || isExpirationAfterMaturity,
                    text: !isExpirationEntered
                        ? t(`common.errors.insufficient-balance-wallet`)
                        : isExpirationAfterMaturity
                        ? t('options.market.trade-options.place-order.errors.order-after-maturity')
                        : '',
                }}
                options={{
                    showCustomInput: true,
                    list: expirationOptions,
                    customValue: customHoursExpiration,
                    onChange: (option: any) => setExpirationCallback(option),
                    onCustomChange: (value: string | number) => setCustomHoursExpirationCallback(value),
                }}
                container={{
                    margin: '0 0 8px 0',
                }}
            />
            <Input
                title={t('options.market.trade-options.place-order.total-label-susd')}
                value={formatCurrency(Number(price) * Number(amount))}
                subValue={SYNTHS_MAP.sUSD}
                valueEditDisable={true}
            />
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={makerAmount}
                    tokenSymbol={makerTokenCurrencyKey}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
            {getSubmitButton()}
        </>
    );
};

export default LimitOrder;
