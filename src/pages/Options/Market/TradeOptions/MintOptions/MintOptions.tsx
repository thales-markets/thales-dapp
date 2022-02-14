import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { getCurrencyKeyBalance } from 'utils/balances';
import snxJSConnector from 'utils/snxJSConnector';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance, formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import NetworkFees from 'pages/Options/components/NetworkFees';
import {
    Container,
    InputContainer,
    GridContainer,
    InputLabel,
    SubmitButtonContainer,
    CurrencyLabel,
    SummaryItem,
    SummaryLabel,
    SummaryContent,
    SliderContainer,
    SliderRange,
    InnerSummaryItem,
    SummaryContainer,
    DoubleShortInputContainer,
    DefaultSubmitButton,
    Divider,
} from 'pages/Options/Market/components';
import styled from 'styled-components';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import { refetchMarketQueries, refetchOrderbook } from 'utils/queryConnector';
import { useBOMContractContext } from '../../contexts/BOMContractContext';
import { formatCurrency, formatCurrencyWithSign, formatPercentage, truncToDecimals } from 'utils/formatters/number';
import { LongSlider, ShortSlider } from 'pages/Options/CreateMarket/components';
import { FlexDiv, FlexDivCentered, FlexDivRow } from 'theme/common';
import erc20Contract from 'utils/contracts/erc20Contract';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { COLORS } from 'constants/ui';
import NumericInput from '../../components/NumericInput';
import onboardConnector from 'utils/onboardConnector';
import ValidationMessage from 'components/ValidationMessage';
import FieldValidationMessage from 'components/FieldValidationMessage';
import Checkbox from 'components/Checkbox';
import { dispatchMarketNotification } from '../../../../../utils/options';
import { createOneInchLimitOrder, ONE_INCH_CONTRACTS } from 'utils/1inch';
import ApprovalModal from 'components/ApprovalModal';

const MintOptions: React.FC = () => {
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
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
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
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        const { binaryOptionsMarketManagerContract } = snxJSConnector;

        const getAllowance = async () => {
            try {
                const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                const allowance = await checkAllowance(
                    parsedAmount,
                    SynthsUSD,
                    walletAddress,
                    binaryOptionsMarketManagerContract.address
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
            return getL1FeeInWei(txRequest);
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
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        const { binaryOptionsMarketManagerContract } = snxJSConnector;
        try {
            setIsAllowing(true);
            const gasEstimate = await SynthsUSD.estimateGas.approve(
                binaryOptionsMarketManagerContract.address,
                approveAmount
            );
            const tx = (await SynthsUSD.approve(binaryOptionsMarketManagerContract.address, approveAmount, {
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
    const handleMint = async () => {
        try {
            setTxErrorMessage(null);
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
                    dispatchMarketNotification(
                        t('options.market.trade-options.mint.confirm-button.confirmation-message')
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
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsMinting(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
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
                <DefaultSubmitButton disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sUSD })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sUSD,
                          })}
                </DefaultSubmitButton>
            );
        }
        if (!hasLongAllowance && sellLong) {
            return (
                <DefaultSubmitButton disabled={isLongAllowing} onClick={() => setOpenLongApprovalModal(true)}>
                    {!isLongAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sLONG })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sLONG,
                          })}
                </DefaultSubmitButton>
            );
        }
        if (!hasShortAllowance && sellShort) {
            return (
                <DefaultSubmitButton disabled={isShortAllowing} onClick={() => setOpenShortApprovalModal(true)}>
                    {!isShortAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sSHORT })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sSHORT,
                          })}
                </DefaultSubmitButton>
            );
        }
        if (isLongSubmitting) {
            return (
                <DefaultSubmitButton disabled={true}>
                    {t(`options.market.trade-options.mint.confirm-button.submit-long-progress-label`)}
                </DefaultSubmitButton>
            );
        }
        if (isShortSubmitting) {
            return (
                <DefaultSubmitButton disabled={true}>
                    {t(`options.market.trade-options.mint.confirm-button.submit-short-progress-label`)}
                </DefaultSubmitButton>
            );
        }
        return (
            <DefaultSubmitButton disabled={isButtonDisabled || !gasLimit} onClick={handleMint}>
                {!isMinting
                    ? t(`options.market.trade-options.mint.confirm-button.label`)
                    : t(`options.market.trade-options.mint.confirm-button.progress-label`)}
            </DefaultSubmitButton>
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
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        setTxErrorMessage(null);
        isLong ? setIsLongSubmitting(true) : setIsShortSubmitting(true);

        const takerToken = SynthsUSD.address;
        const makerAmount = optionsAmount;
        const takerAmount = Number(optionsAmount) * Number(price);
        const expiry = getOrderEndDate();

        try {
            await createOneInchLimitOrder(
                walletAddress,
                networkId,
                makerToken,
                takerToken,
                makerAmount,
                takerAmount,
                expiry
            );
            refetchOrderbook(makerToken);
            dispatchMarketNotification(t('options.market.trade-options.mint.confirm-button.confirmation-message'));
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
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
        <Container className="mintTab">
            <GridContainer>
                <InputContainer>
                    <NumericInput
                        value={amount}
                        onChange={(_, value) => {
                            setIsAmountValid(
                                Number(value) === 0 || (Number(value) > 0 && Number(value) <= sUSDBalance)
                            );
                            setAmount(value);
                        }}
                        className={isAmountValid ? '' : 'error'}
                        disabled={actionInProgress}
                    />
                    <InputLabel>{t('options.market.trade-options.mint.amount-label')}</InputLabel>
                    <CurrencyLabel className={actionInProgress ? 'disabled' : ''}>{SYNTHS_MAP.sUSD}</CurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-balance-wallet`, { currencyKey: SYNTHS_MAP.sUSD })}
                    />
                </InputContainer>
            </GridContainer>
            <SummaryContainer className="mintTab__summary">
                <MintingSummaryItem>
                    <SummaryLabel>{t('options.market.trade-options.mint.minting-label')}</SummaryLabel>
                </MintingSummaryItem>
                <MintingInnerSummaryItem>
                    <SummaryLabel color={COLORS.LONG}>{t('options.market.trade-options.mint.long-label')}</SummaryLabel>
                    <SummaryContent color={COLORS.LONG}>
                        {formatCurrency(mintedAmount, DEFAULT_OPTIONS_DECIMALS)}
                    </SummaryContent>
                </MintingInnerSummaryItem>
                <MintingInnerSummaryItem>
                    <SummaryLabel color={COLORS.SHORT}>
                        {t('options.market.trade-options.mint.short-label')}
                    </SummaryLabel>
                    <SummaryContent color={COLORS.SHORT}>
                        {formatCurrency(mintedAmount, DEFAULT_OPTIONS_DECIMALS)}
                    </SummaryContent>
                </MintingInnerSummaryItem>
            </SummaryContainer>
            <Divider />
            <PlaceInOrderbook>{t('options.market.trade-options.mint.sell-options-title')}</PlaceInOrderbook>
            <FlexDiv className="mintTab__slider">
                <CheckboxContainer className="mintTab__slider--firstRow">
                    <Checkbox
                        disabled={actionInProgress}
                        checked={sellLong}
                        value={sellLong.toString()}
                        onChange={(e: any) => setSellLong(e.target.checked || false)}
                    />
                </CheckboxContainer>
                <SliderContainer className="mintTab__slider--firstRow">
                    <LongSlider
                        value={Number(longPrice)}
                        step={0.01}
                        max={1}
                        min={0}
                        onChange={(_, value) => setLongPrice(Number(value))}
                        disabled={!sellLong || actionInProgress}
                    />
                    <FlexDivRow>
                        <SliderRange color={COLORS.LONG}>{`${USD_SIGN}0`}</SliderRange>
                        <SliderRange color={COLORS.LONG}>{`${USD_SIGN}1`}</SliderRange>
                    </FlexDivRow>
                </SliderContainer>
                <DoubleShortInputContainer className="mintTab__slider--secondRow">
                    <NumericInput
                        value={longPrice}
                        onChange={(_, value) => setLongPrice(value)}
                        disabled={!sellLong || actionInProgress}
                        className={isLongPriceValid ? '' : 'error'}
                        step="0.01"
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.price-label', { currencyKey: SYNTHS_MAP.sLONG })}
                    </InputLabel>
                    <CurrencyLabel className={!sellLong || actionInProgress ? 'disabled' : ''}>
                        {SYNTHS_MAP.sUSD}
                    </CurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!isLongPriceValid}
                        message={t(
                            Number(longPrice) == 0 ? 'common.errors.enter-price' : 'common.errors.invalid-price-max',
                            { max: 1 }
                        )}
                    />
                </DoubleShortInputContainer>
                <DoubleShortInputContainer className="mintTab__slider--secondRow">
                    <NumericInput
                        value={longAmount}
                        onChange={(_, value) => setLongAmount(value)}
                        disabled={!sellLong || actionInProgress}
                        className={isLongAmountValid ? '' : 'error'}
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide: 'sell' })}
                    </InputLabel>
                    <CurrencyLabel className={!sellLong || actionInProgress ? 'disabled' : ''}>
                        {SYNTHS_MAP.sLONG}
                    </CurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!isLongAmountValid}
                        message={t(
                            Number(longAmount) == 0 ? 'common.errors.enter-amount' : 'common.errors.invalid-amount-max',
                            {
                                max: mintedAmount,
                            }
                        )}
                    />
                </DoubleShortInputContainer>
            </FlexDiv>
            <FlexDiv className="mintTab__slider">
                <CheckboxContainer className="mintTab__slider--firstRow">
                    <Checkbox
                        disabled={actionInProgress}
                        checked={sellShort}
                        value={sellShort.toString()}
                        onChange={(e: any) => setSellShort(e.target.checked || false)}
                    />
                </CheckboxContainer>
                <SliderContainer className="mintTab__slider--firstRow">
                    <ShortSlider
                        value={Number(shortPrice)}
                        step={0.01}
                        max={1}
                        min={0}
                        onChange={(_, value) => setShortPrice(Number(value))}
                        disabled={!sellShort || actionInProgress}
                    />
                    <FlexDivRow>
                        <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}0`}</SliderRange>
                        <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}1`}</SliderRange>
                    </FlexDivRow>
                </SliderContainer>
                <DoubleShortInputContainer className="mintTab__slider--secondRow">
                    <NumericInput
                        value={shortPrice}
                        onChange={(_, value) => setShortPrice(value)}
                        disabled={!sellShort || actionInProgress}
                        className={isShortPriceValid ? '' : 'error'}
                        step="0.01"
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.price-label', { currencyKey: SYNTHS_MAP.sSHORT })}
                    </InputLabel>
                    <CurrencyLabel className={!sellShort || actionInProgress ? 'disabled' : ''}>
                        {SYNTHS_MAP.sUSD}
                    </CurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!isShortPriceValid}
                        message={t(
                            Number(shortPrice) == 0 ? 'common.errors.enter-price' : 'common.errors.invalid-price-max',
                            { max: 1 }
                        )}
                    />
                </DoubleShortInputContainer>
                <DoubleShortInputContainer className="mintTab__slider--secondRow">
                    <NumericInput
                        value={shortAmount}
                        onChange={(_, value) => setShortAmount(value)}
                        disabled={!sellShort || actionInProgress}
                        className={isShortAmountValid ? '' : 'error'}
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide: 'sell' })}
                    </InputLabel>
                    <CurrencyLabel className={!sellShort || actionInProgress ? 'disabled' : ''}>
                        {SYNTHS_MAP.sSHORT}
                    </CurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!isShortAmountValid}
                        message={t(
                            Number(shortAmount) == 0
                                ? 'common.errors.enter-amount'
                                : 'common.errors.invalid-amount-max',
                            {
                                max: mintedAmount,
                            }
                        )}
                    />
                </DoubleShortInputContainer>
            </FlexDiv>

            <Divider style={{ marginTop: 4 }} />

            <FeeSummaryContainer className="mintTab__summary">
                {marketFees && (marketFees.creator > 0 || marketFees.pool > 0) && (
                    <>
                        <MintingSummaryItem>
                            <ProtocolFeeLabel>{t('options.market.trade-options.mint.fees.minting')}</ProtocolFeeLabel>
                            <ProtocolFeeContent>{`${formatPercentage(
                                marketFees ? marketFees.creator + marketFees.pool : 0
                            )} (${formatCurrencyWithSign(
                                USD_SIGN,
                                marketFees ? Number(amount) * (marketFees.creator + marketFees.pool) : 0,
                                DEFAULT_OPTIONS_DECIMALS
                            )})`}</ProtocolFeeContent>
                        </MintingSummaryItem>
                        <MintingInnerSummaryItem>
                            <ProtocolFeeLabel>{t('options.market.trade-options.mint.fees.creator')}</ProtocolFeeLabel>
                            <ProtocolFeeContent>{`${formatPercentage(
                                marketFees ? marketFees.creator : 0
                            )} (${formatCurrencyWithSign(
                                USD_SIGN,
                                marketFees ? Number(amount) * marketFees.creator : 0,
                                DEFAULT_OPTIONS_DECIMALS
                            )})`}</ProtocolFeeContent>
                        </MintingInnerSummaryItem>
                        <MintingInnerSummaryItem style={{ marginBottom: 10 }}>
                            <ProtocolFeeLabel>{t('options.market.trade-options.mint.fees.pool')}</ProtocolFeeLabel>
                            <ProtocolFeeContent>{`${formatPercentage(
                                marketFees ? marketFees.pool : 0
                            )} (${formatCurrencyWithSign(
                                USD_SIGN,
                                marketFees ? Number(amount) * marketFees.pool : 0,
                                DEFAULT_OPTIONS_DECIMALS
                            )})`}</ProtocolFeeContent>
                        </MintingInnerSummaryItem>
                    </>
                )}
                <NetworkFees gasLimit={gasLimit} disabled={actionInProgress} l1Fee={l1Fee} />
            </FeeSummaryContainer>
            <SubmitButtonContainer style={{ marginTop: '20px' }}>
                <FlexDivCentered>{getSubmitButton()}</FlexDivCentered>
            </SubmitButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amount}
                    tokenSymbol={SYNTHS_MAP.sUSD}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
            {openLongApprovalModal && (
                <ApprovalModal
                    defaultAmount={longAmount}
                    tokenSymbol={SYNTHS_MAP.sLONG}
                    isAllowing={isLongAllowing}
                    onSubmit={handleLongAllowance}
                    onClose={() => setOpenLongApprovalModal(false)}
                />
            )}
            {openShortApprovalModal && (
                <ApprovalModal
                    defaultAmount={shortAmount}
                    tokenSymbol={SYNTHS_MAP.sSHORT}
                    isAllowing={isShortAllowing}
                    onSubmit={handleShortAllowance}
                    onClose={() => setOpenShortApprovalModal(false)}
                />
            )}
        </Container>
    );
};

export const MintingSummaryItem = styled(SummaryItem)`
    margin-bottom: 4px;
`;

export const MintingInnerSummaryItem = styled(InnerSummaryItem)`
    margin-bottom: 4px;
`;

export const ProtocolFeeLabel = styled(SummaryLabel)`
    font-size: 13px;
`;

export const ProtocolFeeContent = styled(SummaryContent)`
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    text-align: end;
`;

export const PlaceInOrderbook = styled.div`
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
    color: #f6f6fe;
`;

export const CheckboxContainer = styled.div`
    margin-top: 21px;
    margin-left: 5px;
`;

export const UseLegacySigningContainer = styled.div`
    margin-top: 12px;
    margin-left: 10px;
`;

export const StyledCheckbox = styled(Checkbox)`
    margin-top: 24px;
`;

export const FeeSummaryContainer = styled(SummaryContainer)`
    margin-top: 4px;
`;

export default MintOptions;
