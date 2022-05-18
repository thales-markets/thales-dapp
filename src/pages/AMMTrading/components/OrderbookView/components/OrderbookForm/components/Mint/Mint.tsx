import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BigNumber, ethers } from 'ethers';

import { useBOMContractContext } from 'pages/AMMTrading/contexts/BOMContractContext';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';

import Input from 'pages/AMMTrading/components/AMM/components/Input';
import Checkbox from 'pages/AMMTrading/components/AMM/components/Checkbox';
import { RowContainer, InputContainer } from './styled-components';
import RangeSlider from 'components/RangeSlider';
import Button from 'components/Button';

import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';

import { CURRENCY_TO_OPTION, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';

import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { checkAllowance, formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { getCurrencyKeyBalance } from 'utils/balances';
import { createOneInchLimitOrder, ONE_INCH_CONTRACTS } from 'utils/1inch';
import snxJSConnector from 'utils/snxJSConnector';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import { refetchMarketQueries, refetchOrderbook } from 'utils/queryConnector';
import onboardConnector from 'utils/onboardConnector';
import erc20Contract from 'utils/contracts/erc20Contract';
import { formatCurrency, truncToDecimals } from 'utils/formatters/number';
import { getErrorToastOptions, getSuccessToastOptions, UI_COLORS } from 'constants/ui';
import Summary from '../Summary';
import Divider from 'pages/AMMTrading/components/AMM/styled-components/Divider';
import NetworkFees from 'pages/AMMTrading/components/AMM/components/NetworkFees';
import ApprovalModal from 'components/ApprovalModal';
import { toast } from 'react-toastify';
import { getStableCoinForNetwork } from '../../../../../../../../utils/currency';

const Mint: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const BOMContract = useBOMContractContext();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [amount, setAmount] = useState<number | string>('');
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [longPrice, setLongPrice] = useState<number | string>(1);
    const [shortPrice, setShortPrice] = useState<number | string>(1);
    const [longAmount, setLongAmount] = useState<number | string>('');
    const [shortAmount, setShortAmount] = useState<number | string>('');
    const [sellLong, setSellLong] = useState<boolean>(false);
    const [sellShort, setSellShort] = useState<boolean>(false);
    const [hasLongAllowance, setLongAllowance] = useState<boolean>(false);
    const [isLongAllowing, setIsLongAllowing] = useState<boolean>(false);
    const [isLongSubmitting, setIsLongSubmitting] = useState<boolean>(false);
    const [hasShortAllowance, setShortAllowance] = useState<boolean>(false);
    const [isShortAllowing, setIsShortAllowing] = useState<boolean>(false);
    const [isShortSubmitting, setIsShortSubmitting] = useState<boolean>(false);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isLongAmountValid, setIsLongAmountValid] = useState<boolean>(true);
    const [isShortAmountValid, setIsShortAmountValid] = useState<boolean>(true);
    const [isLongPriceValid, setIsLongPriceValid] = useState<boolean>(true);
    const [isShortPriceValid, setIsShortPriceValid] = useState<boolean>(true);
    const [mintedAmount, setMintedAmount] = useState<number | string>('');
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [openLongApprovalModal, setOpenLongApprovalModal] = useState<boolean>(false);
    const [openShortApprovalModal, setOpenShortApprovalModal] = useState<boolean>(false);
    const isL2 = getIsOVM(networkId);
    const marketFees = optionsMarket.fees;

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = Number(amount) > sUSDBalance || !sUSDBalance;
    const isButtonDisabled =
        !isAmountEntered ||
        isMinting ||
        !isWalletConnected ||
        !sUSDBalance ||
        insufficientBalance ||
        !isLongAmountValid ||
        !isShortAmountValid ||
        !isLongPriceValid ||
        !isShortPriceValid ||
        !hasAllowance;

    const addressToApprove = ONE_INCH_CONTRACTS[networkId] ?? '';

    useEffect(() => {
        const collateral = snxJSConnector.collateral;
        const { binaryOptionsMarketManagerContract } = snxJSConnector;

        const getAllowance = async () => {
            try {
                const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                const allowance = await checkAllowance(
                    parsedAmount,
                    collateral,
                    walletAddress,
                    binaryOptionsMarketManagerContract?.address as any
                );
                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected) {
            getAllowance();
        }
    }, [walletAddress, hasAllowance, amount, isAllowing]);

    useEffect(() => {
        const fetchL1Fee = async (BOMContractWithSigner: any, mintAmount: any) => {
            const txRequest = await BOMContractWithSigner.populateTransaction.mint(mintAmount);
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            const mintAmount = ethers.utils.parseEther(amount.toString());
            try {
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);

                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        BOMContractWithSigner.estimateGas.mint(mintAmount),
                        fetchL1Fee(BOMContractWithSigner, mintAmount),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await BOMContractWithSigner.estimateGas.mint(mintAmount);
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
        const collateral = snxJSConnector.collateral;
        const { binaryOptionsMarketManagerContract } = snxJSConnector;
        try {
            setIsAllowing(true);
            const gasEstimate = await collateral?.estimateGas.approve(
                binaryOptionsMarketManagerContract?.address,
                approveAmount
            );
            const tx = (await collateral?.approve(binaryOptionsMarketManagerContract?.address, approveAmount, {
                gasLimit: formatGasLimit(gasEstimate as any, networkId),
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
    const handleMint = async () => {
        const id = toast.loading(t('options.market.trade-options.mint.confirm-button.progress-label'));

        try {
            setIsMinting(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
            const mintAmount = ethers.utils.parseEther(amount.toString());
            const tx = (await BOMContractWithSigner.mint(mintAmount, {
                gasLimit,
            })) as ethers.ContractTransaction;

            dispatch(
                addOptionsPendingTransaction({
                    optionTransaction: {
                        market: optionsMarket.address,
                        currencyKey: optionsMarket.currencyKey,
                        account: walletAddress,
                        hash: tx.hash || '',
                        type: 'mint',
                        amount: mintedAmount,
                        side: 'long',
                        blockNumber: tx.blockNumber || 0,
                    },
                })
            );

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                if (!sellShort && !sellLong) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('options.market.trade-options.mint.confirm-button.confirmation-message')
                        )
                    );
                }
                dispatch(
                    updateOptionsPendingTransactionStatus({
                        hash: txResult.transactionHash,
                        status: 'confirmed',
                        blockNumber: txResult.blockNumber,
                    })
                );

                if (sellLong) {
                    await handleSubmitOrder(longPrice, optionsMarket.longAddress, longAmount, true);
                }
                if (sellShort) {
                    await handleSubmitOrder(shortPrice, optionsMarket.shortAddress, shortAmount, false);
                }
                refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
                resetForm();
            }
            setIsMinting(false);
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsMinting(false);
        }
    };

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
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sUSD })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sUSD,
                          })}
                </Button>
            );
        }
        if (!hasLongAllowance && sellLong) {
            return (
                <Button
                    {...defaultButtonProps}
                    disabled={isLongAllowing}
                    onClickHandler={() => setOpenLongApprovalModal(true)}
                >
                    {!isLongAllowing
                        ? t('common.enable-wallet-access.approve-label', {
                              currencyKey: CURRENCY_TO_OPTION.get(SYNTHS_MAP.sLONG),
                          })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: CURRENCY_TO_OPTION.get(SYNTHS_MAP.sLONG),
                          })}
                </Button>
            );
        }
        if (!hasShortAllowance && sellShort) {
            return (
                <Button
                    {...defaultButtonProps}
                    disabled={isShortAllowing}
                    onClickHandler={() => setOpenShortApprovalModal(true)}
                >
                    {!isShortAllowing
                        ? t('common.enable-wallet-access.approve-label', {
                              currencyKey: CURRENCY_TO_OPTION.get(SYNTHS_MAP.sSHORT),
                          })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: CURRENCY_TO_OPTION.get(SYNTHS_MAP.sSHORT),
                          })}
                </Button>
            );
        }
        if (isLongSubmitting) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`options.market.trade-options.mint.confirm-button.submit-long-progress-label`)}
                </Button>
            );
        }
        if (isShortSubmitting) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`options.market.trade-options.mint.confirm-button.submit-short-progress-label`)}
                </Button>
            );
        }
        return (
            <Button {...defaultButtonProps} disabled={isButtonDisabled || !gasLimit} onClickHandler={handleMint}>
                {!isMinting
                    ? t(`options.market.trade-options.mint.confirm-button.label`)
                    : t(`options.market.trade-options.mint.confirm-button.progress-label`)}
            </Button>
        );
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(optionsMarket.longAddress, erc20Contract.abi, snxJSConnector.signer);
        const getAllowance = async () => {
            try {
                const parsedLongAmount = ethers.utils.parseEther(Number(longAmount).toString());
                const allowance = await checkAllowance(
                    parsedLongAmount,
                    erc20Instance,
                    walletAddress,
                    addressToApprove
                );
                setLongAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected && sellLong) {
            getAllowance();
        }
    }, [walletAddress, isWalletConnected, sellLong, hasLongAllowance, longAmount, isLongAllowing]);

    const handleLongAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(optionsMarket.longAddress, erc20Contract.abi, snxJSConnector.signer);
        try {
            setIsLongAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, approveAmount);
            const tx = (await erc20Instance.approve(addressToApprove, approveAmount, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;
            setOpenLongApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsLongAllowing(false);
            }
        } catch (e) {
            console.log(e);
            setIsLongAllowing(false);
        }
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(optionsMarket.shortAddress, erc20Contract.abi, snxJSConnector.signer);
        const getAllowance = async () => {
            try {
                const parsedShortAmount = ethers.utils.parseEther(Number(shortAmount).toString());
                const allowance = await checkAllowance(
                    parsedShortAmount,
                    erc20Instance,
                    walletAddress,
                    addressToApprove
                );
                setShortAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected && sellShort) {
            getAllowance();
        }
    }, [walletAddress, isWalletConnected, sellShort, hasShortAllowance, shortAmount, isShortAllowing]);

    const handleShortAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(optionsMarket.shortAddress, erc20Contract.abi, snxJSConnector.signer);
        try {
            setIsShortAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, approveAmount);
            const tx = (await erc20Instance.approve(addressToApprove, approveAmount, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;
            setOpenShortApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsShortAllowing(false);
            }
        } catch (e) {
            console.log(e);
            setIsShortAllowing(false);
        }
    };

    const getOrderEndDate = () => Math.round(optionsMarket.timeRemaining / 1000);

    const handleSubmitOrder = async (
        price: number | string,
        makerToken: string,
        optionsAmount: number | string,
        isLong?: boolean
    ) => {
        const collateral = snxJSConnector.collateral;
        isLong ? setIsLongSubmitting(true) : setIsShortSubmitting(true);

        const id = toast.loading(
            isLong
                ? t('options.market.trade-options.mint.confirm-button.submit-long-progress-label')
                : t('options.market.trade-options.mint.confirm-button.submit-short-progress-label')
        );

        const takerToken = collateral?.address;
        const makerAmount = optionsAmount;
        const takerAmount = Number(optionsAmount) * Number(price);
        const expiry = getOrderEndDate();

        try {
            await createOneInchLimitOrder(
                walletAddress,
                networkId,
                makerToken,
                takerToken as any,
                makerAmount,
                takerAmount,
                expiry
            );
            refetchOrderbook(makerToken);
            toast.update(
                id,
                getSuccessToastOptions(t('options.market.trade-options.mint.confirm-button.confirmation-message'))
            );
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
        }
        isLong ? setIsLongSubmitting(false) : setIsShortSubmitting(false);
    };

    useEffect(() => {
        setMintedAmount(
            marketFees ? Number(Number(amount) - Number(amount) * (marketFees.creator + marketFees.pool)) : 0
        );
    }, [amount, marketFees]);

    useEffect(() => {
        const formatedAmountMinted = truncToDecimals(mintedAmount, DEFAULT_OPTIONS_DECIMALS);

        setLongAmount(formatedAmountMinted);
        setShortAmount(formatedAmountMinted);
    }, [mintedAmount]);

    useEffect(() => {
        setIsLongPriceValid(!sellLong || (sellLong && Number(longPrice) <= 1 && Number(longPrice) > 0));
    }, [sellLong, longPrice]);

    useEffect(() => {
        setIsShortPriceValid(!sellShort || (sellShort && Number(shortPrice) <= 1 && Number(shortPrice) > 0));
    }, [sellShort, shortPrice]);

    useEffect(() => {
        setIsLongAmountValid(
            !sellLong ||
                mintedAmount === 0 ||
                (sellLong && Number(longAmount) <= mintedAmount && Number(longAmount) > 0)
        );
    }, [sellLong, longAmount, mintedAmount]);

    useEffect(() => {
        setIsShortAmountValid(
            !sellShort ||
                mintedAmount === 0 ||
                (sellShort && Number(shortAmount) <= mintedAmount && Number(shortAmount) > 0)
        );
    }, [sellShort, shortAmount, mintedAmount]);

    const actionInProgress = isMinting || isLongSubmitting || isShortSubmitting;

    const resetForm = () => {
        setAmount('');
        setLongAmount('');
        setShortAmount('');
        setLongPrice(1);
        setShortPrice(1);
        setSellLong(false);
        setSellShort(false);
    };

    return (
        <>
            <Input
                title={t('options.market.trade-options.mint.amount-label')}
                value={amount}
                valueChange={(value) => {
                    setIsAmountValid(Number(value) === 0 || (Number(value) > 0 && Number(value) <= sUSDBalance));
                    setAmount(value);
                }}
                borderColor={isAmountValid ? '' : UI_COLORS.RED}
                subValue={actionInProgress ? '' : getStableCoinForNetwork(networkId)}
                disabled={actionInProgress}
                displayTooltip={!isAmountValid}
                container={{ margin: '19px 0 0 0' }}
                tooltipText={t(`common.errors.insufficient-balance-wallet`, {
                    currencyKey: getStableCoinForNetwork(networkId),
                })}
            />
            <RowContainer>
                <Checkbox
                    checked={sellLong}
                    container={{
                        margin: '0 30px 0 0',
                    }}
                    disabled={actionInProgress}
                    onChange={(e: any) => {
                        setSellLong(e.target.checked || false);
                    }}
                />
                <RangeSlider
                    disabled={!sellLong || actionInProgress}
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={Number(longPrice)}
                    showInFooterMinMax={true}
                    onChangeEventHandler={(value) => setLongPrice(Number(value))}
                    footerText={[`${USD_SIGN}0`, `${USD_SIGN}1`]}
                />
            </RowContainer>
            <InputContainer>
                <Input
                    title={t('options.market.trade-options.place-order.price-label', {
                        currencyKey: CURRENCY_TO_OPTION.get(SYNTHS_MAP.sLONG),
                    })}
                    container={{ margin: '0 5px 0 0' }}
                    value={longPrice}
                    valueChange={(value) => setLongPrice(value)}
                    valueType={'number'}
                    subValue={getStableCoinForNetwork(networkId)}
                    disabled={!sellLong || actionInProgress}
                    borderColor={isLongPriceValid ? undefined : UI_COLORS.RED}
                    displayTooltip={!isLongPriceValid}
                    tooltipText={t(
                        Number(longPrice) == 0 ? 'common.errors.enter-price' : 'common.errors.invalid-price-max',
                        { max: 1 }
                    )}
                />
                <Input
                    title={t('options.market.trade-options.place-order.amount-label', { orderSide: 'sell' })}
                    container={{ margin: '0 5px 0 0' }}
                    value={longAmount}
                    valueChange={(value) => setLongAmount(value)}
                    valueType={'number'}
                    subValue={CURRENCY_TO_OPTION.get(SYNTHS_MAP.sLONG)}
                    disabled={!sellLong || actionInProgress}
                    borderColor={isLongAmountValid ? undefined : UI_COLORS.RED}
                    displayTooltip={!isLongAmountValid}
                    tooltipText={t(
                        Number(longAmount) == 0 ? 'common.errors.enter-amount' : 'common.errors.invalid-amount-max',
                        {
                            max: mintedAmount,
                        }
                    )}
                />
            </InputContainer>
            <RowContainer>
                <Checkbox
                    checked={sellShort}
                    container={{
                        margin: '0 30px 0 0',
                    }}
                    disabled={actionInProgress}
                    onChange={(e: any) => {
                        setSellShort(e.target.checked || false);
                    }}
                />
                <RangeSlider
                    disabled={!sellShort || actionInProgress}
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={Number(shortPrice)}
                    showInFooterMinMax={true}
                    onChangeEventHandler={(value) => setShortPrice(Number(value))}
                    footerText={[`${USD_SIGN}0`, `${USD_SIGN}1`]}
                />
            </RowContainer>
            <InputContainer>
                <Input
                    title={t('options.market.trade-options.place-order.price-label', {
                        currencyKey: CURRENCY_TO_OPTION.get(SYNTHS_MAP.sSHORT),
                    })}
                    container={{ margin: '0 5px 0 0' }}
                    value={shortPrice}
                    valueChange={(value) => setShortPrice(value)}
                    valueType={'number'}
                    subValue={getStableCoinForNetwork(networkId)}
                    disabled={!sellShort || actionInProgress}
                    borderColor={isShortPriceValid ? undefined : UI_COLORS.RED}
                    displayTooltip={!isShortPriceValid}
                    tooltipText={t(
                        Number(shortPrice) == 0 ? 'common.errors.enter-price' : 'common.errors.invalid-price-max',
                        { max: 1 }
                    )}
                />
                <Input
                    title={t('options.market.trade-options.place-order.amount-label', { orderSide: 'sell' })}
                    container={{ margin: '0 5px 0 0' }}
                    value={shortAmount}
                    valueChange={(value) => setShortAmount(value)}
                    valueType={'number'}
                    subValue={CURRENCY_TO_OPTION.get(SYNTHS_MAP.sSHORT)}
                    disabled={!sellShort || actionInProgress}
                    borderColor={isShortAmountValid ? undefined : UI_COLORS.RED}
                    displayTooltip={!isShortAmountValid}
                    tooltipText={t(
                        Number(shortAmount) == 0 ? 'common.errors.enter-amount' : 'common.errors.invalid-amount-max',
                        {
                            max: mintedAmount,
                        }
                    )}
                />
            </InputContainer>
            <Divider />
            <Summary
                title={t('options.market.trade-options.mint.minting-label')}
                items={[
                    {
                        title: `${t('options.market.trade-options.mint.long-label')}`,
                        value: formatCurrency(mintedAmount, DEFAULT_OPTIONS_DECIMALS),
                        textColor: UI_COLORS.GREEN,
                        fontSize: '14px',
                    },
                    {
                        title: `${t('options.market.trade-options.mint.short-label')}`,
                        value: formatCurrency(mintedAmount, DEFAULT_OPTIONS_DECIMALS),
                        textColor: UI_COLORS.RED,
                        fontSize: '14px',
                    },
                ]}
            />
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={actionInProgress} l1Fee={l1Fee} />
            {getSubmitButton()}
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amount}
                    tokenSymbol={getStableCoinForNetwork(networkId)}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
            {openLongApprovalModal && (
                <ApprovalModal
                    defaultAmount={longAmount}
                    tokenSymbol={CURRENCY_TO_OPTION.get(SYNTHS_MAP.sLONG)}
                    isAllowing={isLongAllowing}
                    onSubmit={handleLongAllowance}
                    onClose={() => setOpenLongApprovalModal(false)}
                />
            )}
            {openShortApprovalModal && (
                <ApprovalModal
                    defaultAmount={shortAmount}
                    tokenSymbol={CURRENCY_TO_OPTION.get(SYNTHS_MAP.sSHORT)}
                    isAllowing={isShortAllowing}
                    onSubmit={handleShortAllowance}
                    onClose={() => setOpenShortApprovalModal(false)}
                />
            )}
        </>
    );
};

export default Mint;
