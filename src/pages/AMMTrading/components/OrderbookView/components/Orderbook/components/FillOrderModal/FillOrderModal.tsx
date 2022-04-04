import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import snxJSConnector from 'utils/snxJSConnector';
import erc20Contract from 'utils/contracts/erc20Contract';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import styled from 'styled-components';

import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { refetchOrderbook, refetchOrders, refetchTrades, refetchUserTrades } from 'utils/queryConnector';

import Input from 'pages/AMMTrading/components/AMM/components/Input';
import Button from 'components/Button';
import NetworkFees from 'pages/AMMTrading/components/AMM/components/NetworkFees';
import OrderDetails from '../OrderDetails';
import { SubmitButtonContainer, SummaryItem, SummaryLabel, SummaryContent, LightTooltip } from '../components';
import { CloseIconContainer, ModalContainer, ModalTitle, StyledModal, ModalHeader } from '../components';
import ApprovalModal from 'components/ApprovalModal';
import WalletBalance from 'pages/AMMTrading/components/AMM/components/WalletBalance';
import ValidationMessage from 'components/ValidationMessage';
import Divider from 'pages/AMMTrading/components/AMM/styled-components/Divider';

import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { AccountMarketInfo, OptionSide, OrderItem, OrderSide } from 'types/options';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance, formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { getIsAppReady } from 'redux/modules/app';
import { getCurrencyKeyBalance } from 'utils/balances';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import onboardConnector from 'utils/onboardConnector';
import { FlexDivRow } from 'theme/common';
import { fillLimitOrder, getFillOrderData, ONE_INCH_CONTRACTS } from 'utils/1inch';
import { UI_COLORS } from 'constants/ui';
import { MaxButton } from 'pages/AMMTrading/components/AMM/AMM';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';

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
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [insufficientOrderAmount, setInsufficientOrderAmount] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);

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

    const isBuy = orderSide === 'buy';

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = isBuy
        ? tokenBalance < Number(amount) || !tokenBalance
        : sUSDBalance < Number(order.displayOrder.price) * Number(amount) || !sUSDBalance;

    const isButtonDisabled =
        !isAmountEntered || isFilling || !isWalletConnected || insufficientBalance || !hasAllowance;

    const takerToken = isBuy ? baseToken : SynthsUSD.address;
    const takerAmount = isBuy ? amount : Number(order.displayOrder.price) * Number(amount);
    const takerTokenCurrencyKey = isBuy ? OPTIONS_CURRENCY_MAP[optionSide] : SYNTHS_MAP.sUSD;
    const addressToApprove = ONE_INCH_CONTRACTS[networkId] || '';

    useEffect(() => {
        const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
        const getAllowance = async () => {
            try {
                const parsedTakerAmount = ethers.utils.parseEther(Number(takerAmount).toString());
                const allowance = await checkAllowance(
                    parsedTakerAmount,
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
    }, [walletAddress, isWalletConnected, hasAllowance, takerAmount, isAllowing]);

    useEffect(() => {
        const fetchL1Fee = async (limitOrderProtocol1inchContractWithSigner: any, fillOrderData: any) => {
            const txRequest = await limitOrderProtocol1inchContractWithSigner.populateTransaction.fillOrder(
                fillOrderData.limitOrder,
                fillOrderData.signature,
                fillOrderData.makerAmount,
                fillOrderData.takerAmount,
                fillOrderData.threshold
            );
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            try {
                const { limitOrderProtocol1inchContract } = snxJSConnector as any;
                const limitOrderProtocol1inchContractWithSigner = limitOrderProtocol1inchContract.connect(
                    (snxJSConnector as any).signer
                );
                const fillOrderData = getFillOrderData(order, amount, isBuy);

                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        limitOrderProtocol1inchContractWithSigner.estimateGas.fillOrder(
                            fillOrderData.limitOrder,
                            fillOrderData.signature,
                            fillOrderData.makerAmount,
                            fillOrderData.takerAmount,
                            fillOrderData.threshold
                        ),
                        fetchL1Fee(limitOrderProtocol1inchContractWithSigner, fillOrderData),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await limitOrderProtocol1inchContractWithSigner.estimateGas.fillOrder(
                        fillOrderData.limitOrder,
                        fillOrderData.signature,
                        fillOrderData.makerAmount,
                        fillOrderData.takerAmount,
                        fillOrderData.threshold
                    );
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, amount, hasAllowance, walletAddress]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
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
            setOpenApprovalModal(false);
        }
    };

    const handleFillOrder = async () => {
        setTxErrorMessage(null);
        setIsFilling(true);
        const id = toast.loading(t('options.market.trade-options.fill-order.progress'));
        try {
            await fillLimitOrder(networkId, walletAddress, order, amount, gasLimit, isBuy);
            refetchOrderbook(baseToken);
            refetchTrades(optionsMarket.address);
            refetchUserTrades(optionsMarket.address, walletAddress);
            refetchOrders(networkId);
            toast.update(id, getSuccessToastOptions(t('options.market.trade-options.fill-order.success')));
            onClose();
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            toast.update(
                id,
                getErrorToastOptions(
                    (e as any).code === 4001
                        ? t('options.swap.tx-user-rejected')
                        : t('common.errors.unknown-error-try-again')
                )
            );
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
        if (insufficientOrderAmount) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-order-amount`)}
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
        if (!hasAllowance) {
            return (
                <Button {...defaultButtonProps} disabled={isAllowing} onClickHandler={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: takerTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: takerTokenCurrencyKey,
                          })}
                </Button>
            );
        }
        return (
            <Button {...defaultButtonProps} disabled={isButtonDisabled || !gasLimit} onClickHandler={handleFillOrder}>
                {!isFilling
                    ? t('options.market.trade-options.fill-order.confirm-button.label')
                    : t('options.market.trade-options.fill-order.confirm-button.progress-label')}
            </Button>
        );
    };

    return (
        <StyledModal
            container={() => document.querySelector('.dark') || document.querySelector('.light')}
            open
            onClose={onClose}
        >
            <ModalContainer className="market__fillOrderModal">
                <ModalHeader>
                    <ModalTitle>
                        {t(`options.market.trade-options.fill-order.${orderSide}.title`, {
                            currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                        })}
                    </ModalTitle>
                    <FlexDivRow>
                        <CloseIconContainer onClick={onClose} />
                    </FlexDivRow>
                </ModalHeader>
                <WalletContainer>
                    <WalletBalance type={optionSide} />
                </WalletContainer>
                <OrderDetails order={order.displayOrder} optionSide={optionSide} />
                <Divider />
                <Input
                    title={t('options.market.trade-options.fill-order.amount-label', {
                        orderSide: isBuy ? t('common.sell') : t('common.buy'),
                    })}
                    container={{ margin: '12px 0' }}
                    value={amount}
                    valueChange={(value) => setAmount(value)}
                    valueType={'number'}
                    subValue={OPTIONS_CURRENCY_MAP[optionSide]}
                    disabled={isFilling}
                    borderColor={isAmountValid && !insufficientOrderAmount ? undefined : UI_COLORS.RED}
                    displayTooltip={!isAmountValid || insufficientOrderAmount}
                    tooltipText={
                        insufficientOrderAmount
                            ? t(`common.errors.invalid-order-amount-max`, {
                                  max: formatCurrency(order.displayOrder.fillableAmount),
                              })
                            : t(`common.errors.insufficient-balance-wallet`, {
                                  currencyKey: isBuy ? OPTIONS_CURRENCY_MAP[optionSide] : SYNTHS_MAP.sUSD,
                              })
                    }
                >
                    <LightTooltip title={t('options.market.trade-options.fill-order.max-button-tooltip')}>
                        <MaxButton onClick={onMaxClick}>{t('common.max')}</MaxButton>
                    </LightTooltip>
                </Input>
                <SummaryItem>
                    <SummaryLabel>{t('options.market.trade-options.fill-order.total-label')}</SummaryLabel>
                    <SummaryContent>
                        {formatCurrencyWithKey(
                            SYNTHS_MAP.sUSD,
                            Number(order.displayOrder.price) * Number(amount),
                            DEFAULT_OPTIONS_DECIMALS
                        )}
                    </SummaryContent>
                </SummaryItem>
                <Divider />
                <NetworkFees gasLimit={gasLimit} l1Fee={l1Fee} />
                <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </ModalContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={takerAmount}
                    tokenSymbol={takerTokenCurrencyKey}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </StyledModal>
    );
};

const WalletContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default FillOrderModal;
