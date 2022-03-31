import React, { useMemo, useState, useEffect } from 'react';
import Web3 from 'web3';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';

import { useTranslation } from 'react-i18next';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { useSelector } from 'react-redux';

import Switch from 'components/SwitchInput/SwitchInputNew';
import ApprovalModal from 'components/ApprovalModal';

import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { OneInchErrorReason, SLIPPAGE_PERCENTAGE } from 'constants/options';
import { formatCurrency, formatPercentageWithSign } from 'utils/formatters/number';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { get1InchBaseURL, ONE_INCH_SWAP_CONTRACTS, ONE_INCH_SWAP_QUOTE_URL, ONE_INCH_SWAP_URL } from 'utils/1inch';
import { getCurrencyKeyBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import snxJSConnector from 'utils/snxJSConnector';
import { maxBy } from 'lodash';
import { checkAllowance, formatGasLimit } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';

import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { refetchOrderbook, refetchTrades, refetchUserTrades } from 'utils/queryConnector';

import { AccountMarketInfo, OneInchErrorResponse, OptionSide, OrderItem, Orders, OrderSide } from 'types/options';
import Button from 'components/Button';
import Input from 'pages/AMMTrading/components/AMM/components/Input';
import { getErrorToastOptions, getSuccessToastOptions, UI_COLORS } from 'constants/ui';
import Slippage from 'pages/AMMTrading/components/AMM/components/Slippage';
import NetworkFees from 'pages/AMMTrading/components/AMM/components/NetworkFees';
import Divider from 'pages/AMMTrading/components/AMM/styled-components/Divider';
import { toast } from 'react-toastify';
type MarketOrderPropsType = {
    optionSide: OptionSide;
};
type OrderSideOptionType = { value: OrderSide; label: string };
type OneInchErrorType = 'insufficient-liquidity' | 'insufficient-balance' | 'general' | 'clear';

declare const window: any;

const MarketOrder: React.FC<MarketOrderPropsType> = ({ optionSide }) => {
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
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [slippage, setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[1]);
    const [priceImpactPercentage, setPriceImpactPercentage] = useState<number | string>('0');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isSlippageValid, setIsSlippageValid] = useState<boolean>(true);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);

    const orderSideOptions = useMemo(() => {
        return [
            {
                value: 'buy' as OrderSide,
                label: SYNTHS_MAP.sUSD,
            },
            {
                value: 'sell' as OrderSide,
                label: OPTIONS_CURRENCY_MAP[optionSide],
            },
        ];
    }, [optionSide]);

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
        !isPriceEntered ||
        !isAmountEntered ||
        isSubmitting ||
        !isWalletConnected ||
        insufficientBalance ||
        !hasAllowance;

    const buyToken = isBuy ? baseToken : SynthsUSD.address;
    const sellToken = isBuy ? SynthsUSD.address : baseToken;
    const sellTokenCurrencyKey = isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide];
    const addressToApprove = ONE_INCH_SWAP_CONTRACTS[networkId] || '';

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
                const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                const allowance = await checkAllowance(parsedAmount, erc20Instance, walletAddress, addressToApprove);
                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected) {
            getAllowance();
        }
    }, [walletAddress, isWalletConnected, isBuy, optionSide, hasAllowance, amount, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(sellToken, erc20Contract.abi, snxJSConnector.signer);
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
        const id = toast.loading(t('options.market.trade-options.place-order.confirm-button.progress-label'));

        try {
            if (window.ethereum) {
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
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(
                            `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.confirmation-message`
                        )
                    )
                );
                resetForm();
            }
        } catch (e: any) {
            console.log(e);
            toast.update(
                id,
                getErrorToastOptions(
                    e.code === 4001 ? t('common.errors.user-rejected-tx') : t('common.errors.unknown-error-try-again')
                )
            );
            setIsSubmitting(false);
        }
    };
    // const calculateAmount = (percentage: number) => {
    //     if (isBuy) return;
    //     const maxsOPTBalance = tokenBalance;
    //     const newAmount = (maxsOPTBalance * percentage) / 100;
    //     setAmount(truncToDecimals(newAmount, DEFAULT_OPTIONS_DECIMALS));
    // };

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
        toast(getErrorToastOptions(errorType === 'general' ? t('common.errors.unknown-error-try-again-general') : ''));
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
        const defaultButtonProps = {
            padding: '3px 35px',
            active: true,
            margin: '24px auto 0 auto',
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
        if (isBuy && onlyUsersSellOrders) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }

        if (!isBuy && onlyUsersBuyOrders) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }

        if (insufficientBalance) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t(`common.errors.insufficient-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!isSlippageValid) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t(`common.errors.invalid-slippage`)}
                </Button>
            );
        }
        if (insufficientLiquidity) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClickHandler={() => setOpenApprovalModal(true)} {...defaultButtonProps}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: sellTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: sellTokenCurrencyKey,
                          })}
                </Button>
            );
        }
        return (
            <Button disabled={isButtonDisabled} onClickHandler={handleSubmitOrder} {...defaultButtonProps}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.label`)
                    : t(
                          `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.progress-label`
                      )}
            </Button>
        );
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
        <>
            <Switch
                active={orderSide == orderSideOptions[1]}
                width={'94px'}
                height={'32px'}
                dotSize={'22px'}
                label={{
                    firstLabel: t(orderSideOptions[0].label).toUpperCase(),
                    secondLabel: t(orderSideOptions[1].label).toUpperCase(),
                    fontSize: '25px',
                }}
                shadow={true}
                dotBackground={'var(--amm-switch-circle)'}
                handleClick={() => {
                    orderSide == orderSideOptions[0]
                        ? setOrderSide(orderSideOptions[1])
                        : setOrderSide(orderSideOptions[0]);
                }}
                margin={'20px 0px'}
            />
            <Input
                title={t('options.order-book.amount-to', {
                    type: orderSideOptions[1].value,
                })}
                value={amount}
                valueChange={(value: string | number) => {
                    setAmount(value);
                }}
                subValue={isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide]}
                valueEditDisable={isSubmitting}
                borderColor={isAmountValid && !insufficientLiquidity ? '' : UI_COLORS.RED}
                displayTooltip={!isAmountValid}
                tooltipText={t(
                    !isAmountValid
                        ? 'common.errors.insufficient-balance-wallet'
                        : 'common.errors.insufficient-liquidity-for-trade',
                    {
                        currencyKey: isBuy ? SYNTHS_MAP.sUSD : OPTIONS_CURRENCY_MAP[optionSide],
                    }
                )}
            />
            <Input
                title={
                    isBuy
                        ? t('options.market.trade-options.place-order.price-for-label', {
                              currencyKey: SYNTHS_MAP.sUSD,
                          })
                        : t('options.market.trade-options.place-order.price-label', {
                              currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                          })
                }
                value={
                    isBuy
                        ? formatCurrency(Number(price))
                        : `${formatCurrency(Number(price))} (${formatPercentageWithSign(priceImpactPercentage)})`
                }
                valueEditDisable={true}
                subValue={isBuy ? OPTIONS_CURRENCY_MAP[optionSide] : SYNTHS_MAP.sUSD}
            />
            <Input
                title={
                    isBuy
                        ? t('options.market.trade-options.place-order.total-label-option', {
                              option: OPTIONS_CURRENCY_MAP[optionSide],
                          })
                        : t('options.market.trade-options.place-order.total-label-susd')
                }
                value={isBuy ? formatCurrency(Number(total)) : `${formatCurrency(Number(price))}`}
                valueEditDisable={true}
                subValue={isBuy ? OPTIONS_CURRENCY_MAP[optionSide] : SYNTHS_MAP.sUSD}
            />
            <Slippage
                fixed={SLIPPAGE_PERCENTAGE}
                defaultValue={Number(slippage)}
                onChangeHandler={(value) => setSlippage(value)}
            />
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={isSubmitting} />
            {getSubmitButton()}
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amount}
                    tokenSymbol={sellTokenCurrencyKey}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

export default MarketOrder;
