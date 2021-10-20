import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { AccountMarketInfo, OptionSide, OrderItem, OrderSide } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ethers } from 'ethers';
import { APPROVAL_EVENTS } from 'constants/events';
import erc20Contract from 'utils/contracts/erc20Contract';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { normalizeGasLimit } from 'utils/network';
import { getIs0xReady, getIsAppReady } from 'redux/modules/app';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import { getCurrencyKeyBalance } from 'utils/balances';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { formatCurrency, formatCurrencyWithKey, toBigNumber, truncToDecimals } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { IZeroExEvents } from '@0x/contract-wrappers';
import { DEFAULT_OPTIONS_DECIMALS, DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import { refetchOrderbook, refetchOrders, refetchTrades, refetchUserTrades } from 'utils/queryConnector';
import OrderDetails from '../../components/OrderDetails';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import {
    CloseIconContainer,
    ModalContainer,
    ModalSummaryContainer,
    ModalTitle,
    StyledModal,
    ModalHeader,
} from '../components';
import ValidationMessage from 'components/ValidationMessage';
import {
    DefaultSubmitButton,
    SubmitButtonContainer,
    WalletContainer,
    Wallet,
    InputContainer,
    InputLabel,
    CurrencyLabel,
    SubmitButton,
    SummaryItem,
    SummaryLabel,
    SummaryContent,
    Divider,
    LightTooltip,
} from 'pages/Options/Market/components';
import onboardConnector from 'utils/onboardConnector';
import { FlexDivCentered, FlexDivRow, FlexDiv } from 'theme/common';
import { ReactComponent as WalletIcon } from 'assets/images/wallet-light.svg';
import NumericInput from 'pages/Options/Market/components/NumericInput';
import FieldValidationMessage from 'components/FieldValidationMessage';
import styled from 'styled-components';
import { get0xExchangeProxyAddress } from 'utils/0x';

type FillOrderModalProps = {
    order: OrderItem;
    optionSide: OptionSide;
    orderSide: OrderSide;
    onClose: () => void;
    market?: any;
};

export const FillOrderModal: React.FC<FillOrderModalProps> = ({ onClose, order, orderSide, optionSide, market }) => {
    const { t } = useTranslation();
    const optionsMarket = market || useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [amount, setAmount] = useState<number | string>(
        truncToDecimals(order.displayOrder.fillableAmount, DEFAULT_OPTIONS_DECIMALS)
    );
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const is0xReady = useSelector((state: RootState) => getIs0xReady(state));
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [insufficientOrderAmount, setInsufficientOrderAmount] = useState<boolean>(false);

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

    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const { exchangeProxy } = contractWrappers0xConnector;

    const isBuy = orderSide === 'buy';

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = isBuy
        ? tokenBalance < Number(amount) || !tokenBalance
        : sUSDBalance < Number(order.displayOrder.price) * Number(amount) || !sUSDBalance;

    const isButtonDisabled = !isAmountEntered || isFilling || !isWalletConnected || insufficientBalance || !is0xReady;

    const takerToken = isBuy ? baseToken : SynthsUSD.address;
    const takeTokenCurrencyKey = isBuy ? OPTIONS_CURRENCY_MAP[optionSide] : SYNTHS_MAP.sUSD;
    const addressToApprove = get0xExchangeProxyAddress(networkId);

    useEffect(() => {
        const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
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
    }, [walletAddress, isWalletConnected, hasAllowance]);

    useEffect(() => {
        if (is0xReady) {
            const subscriptionToken = exchangeProxy.subscribe(
                IZeroExEvents.LimitOrderFilled,
                { orderHash: order.displayOrder.orderHash },
                (_, log) => {
                    if (log?.log.args.orderHash.toLowerCase() === order.displayOrder.orderHash.toLowerCase()) {
                        refetchOrderbook(baseToken);
                        refetchTrades(optionsMarket.address);
                        refetchUserTrades(optionsMarket.address, walletAddress);
                        refetchOrders(networkId);
                        onClose();
                    }
                }
            );
            return () => {
                exchangeProxy.unsubscribe(subscriptionToken);
            };
        }
    }, [is0xReady]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const targetOrder = order.rawOrder;
            const sOPTAmount = isBuy ? amount : Number(amount) * order.displayOrder.price;

            try {
                const gasEstimate = await exchangeProxy
                    .fillLimitOrder(
                        targetOrder,
                        order.signature,
                        Web3Wrapper.toBaseUnitAmount(toBigNumber(sOPTAmount), DEFAULT_TOKEN_DECIMALS)
                    )
                    .estimateGasAsync({ from: walletAddress });
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, amount, hasAllowance, walletAddress]);

    const handleAllowance = async () => {
        const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, ethers.constants.MaxUint256);
            const tx = (await erc20Instance.approve(addressToApprove, ethers.constants.MaxUint256, {
                gasLimit: normalizeGasLimit(Number(gasEstimate)),
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

    const handleFillOrder = async () => {
        setTxErrorMessage(null);
        setIsFilling(true);

        const targetOrder = order.rawOrder;
        const sOPTAmount = isBuy ? amount : Number(amount) * order.displayOrder.price;

        try {
            await exchangeProxy
                .fillLimitOrder(
                    targetOrder,
                    order.signature,
                    Web3Wrapper.toBaseUnitAmount(toBigNumber(sOPTAmount), DEFAULT_TOKEN_DECIMALS)
                )
                .sendTransactionAsync({
                    from: walletAddress,
                    gas: gasLimit !== null ? gasLimit : undefined,
                });
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsFilling(false);
        }
    };

    const onMaxClick = () => {
        const maxWalletsOPT = isBuy ? tokenBalance : sUSDBalance / order.displayOrder.price;
        const maxAmount =
            order.displayOrder.fillableAmount < maxWalletsOPT ? order.displayOrder.fillableAmount : maxWalletsOPT;
        setAmount(truncToDecimals(maxAmount, DEFAULT_OPTIONS_DECIMALS));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? Number(amount) <= tokenBalance
                        : Number(order.displayOrder.price) * Number(amount) <= sUSDBalance))
        );
        setInsufficientOrderAmount(order.displayOrder.fillableAmount < Number(amount));
    }, [amount, sUSDBalance, tokenBalance]);

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (insufficientOrderAmount) {
            return (
                <DefaultSubmitButton disabled={true}>
                    {t(`common.errors.insufficient-order-amount`)}
                </DefaultSubmitButton>
            );
        }
        if (insufficientBalance) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.insufficient-balance`)}</DefaultSubmitButton>;
        }
        if (!isAmountEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</DefaultSubmitButton>;
        }
        if (!hasAllowance) {
            return (
                <DefaultSubmitButton disabled={isAllowing} onClick={handleAllowance}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: takeTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: takeTokenCurrencyKey,
                          })}
                </DefaultSubmitButton>
            );
        }
        return (
            <DefaultSubmitButton disabled={isButtonDisabled || !gasLimit} onClick={handleFillOrder}>
                {!isFilling
                    ? t('options.market.trade-options.fill-order.confirm-button.label')
                    : t('options.market.trade-options.fill-order.confirm-button.progress-label')}
            </DefaultSubmitButton>
        );
    };

    return (
        <StyledModal open disableBackdropClick onClose={onClose}>
            <ModalContainer className="market__fillOrderModal">
                <ModalHeader>
                    <ModalTitle>
                        {t(`options.market.trade-options.fill-order.${orderSide}.title`, {
                            currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                        })}
                    </ModalTitle>
                    <FlexDivRow>
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
                        <CloseIconContainer onClick={onClose} />
                    </FlexDivRow>
                </ModalHeader>
                <OrderDetails order={order.displayOrder} optionSide={optionSide} />
                <FillOrderContainer>
                    <AmountInputContainer>
                        <NumericInput
                            value={amount}
                            onChange={(_, value) => setAmount(value)}
                            className={isAmountValid && !insufficientOrderAmount ? '' : 'error'}
                            disabled={isFilling}
                        />
                        <InputLabel>
                            {t('options.market.trade-options.fill-order.amount-label', {
                                orderSide: isBuy ? t('common.sell') : t('common.buy'),
                            })}
                        </InputLabel>
                        <CurrencyLabel className={isFilling ? 'disabled' : ''}>
                            {OPTIONS_CURRENCY_MAP[optionSide]}
                        </CurrencyLabel>
                        <FieldValidationMessage
                            showValidation={!isAmountValid || insufficientOrderAmount}
                            message={
                                insufficientOrderAmount
                                    ? t(`common.errors.invalid-order-amount-max`, {
                                          max: formatCurrency(order.displayOrder.fillableAmount),
                                      })
                                    : t(`common.errors.insufficient-balance-wallet`, {
                                          currencyKey: isBuy ? OPTIONS_CURRENCY_MAP[optionSide] : SYNTHS_MAP.sUSD,
                                      })
                            }
                        />
                    </AmountInputContainer>
                    <LightTooltip title={t('options.market.trade-options.fill-order.max-button-tooltip')}>
                        <MaxButton onClick={onMaxClick}>{t('common.max')}</MaxButton>
                    </LightTooltip>
                </FillOrderContainer>
                <ModalSummaryContainer>
                    <SummaryItem>
                        <SummaryLabel>{t('options.market.trade-options.fill-order.total-label')}</SummaryLabel>
                        <SummaryContent>
                            {formatCurrencyWithKey(SYNTHS_MAP.sUSD, Number(order.displayOrder.price) * Number(amount))}
                        </SummaryContent>
                    </SummaryItem>
                    <Divider />
                    <NetworkFees gasLimit={gasLimit} disabled={isFilling} />
                </ModalSummaryContainer>
                <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </ModalContainer>
        </StyledModal>
    );
};

const FillOrderContainer = styled(FlexDiv)`
    margin: 30px 0px 10px 0px;
`;

const MaxButton = styled(SubmitButton)`
    width: 25%;
    background: transparent;
    border: 3px solid #0a2e66;
    box-sizing: border-box;
    border-radius: 5px;
    height: 52px;
    margin-left: 20px;
    margin-top: 6px;
    text-transform: uppercase;
    padding: 0;
    &.selected,
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        color: #b8c6e5;
    }
`;

const AmountInputContainer = styled(InputContainer)`
    width: 75%;
    margin: 0;
`;

export default FillOrderModal;
