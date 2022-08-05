import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ValueType } from 'react-select';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import add from 'date-fns/add';
import orderBy from 'lodash/orderBy';
import { CRYPTO_CURRENCY_MAP, CurrencyKey, USD_SIGN } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { bytesFormatter } from 'utils/formatters/ethers';
import {
    checkAllowance,
    formatGasLimit,
    getIsOVM,
    getIsPolygon,
    getL1FeeInWei,
    isNetworkSupported,
} from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import DatePicker from 'components/Input/DatePicker';
import NetworkFees from './NetworkFees';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getNetworkId } from 'redux/modules/wallet';
import Currency from 'components/Currency';
import { BigNumber, ethers } from 'ethers';
import { FlexDiv, FlexDivColumn, Text, Button, FlexDivRow, FlexDivColumnCentered, FlexDivCentered } from 'theme/common';

import MarketSummary from './MarketSummary';
import { convertLocalToUTCDate, convertUTCToLocalDate, formatShortDate } from 'utils/formatters/date';
import { Error, ErrorMessage, InputsWrapper, LongSlider, ShortSlider } from './components';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import {
    CurrencyLabel,
    DoubleShortInputContainer,
    Input,
    InputLabel,
    ReactSelect,
    ShortInputContainer,
    SliderContainer,
    SliderRange,
    CheckboxContainer,
} from 'components/OldVersion/old-components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import NumericInput from 'components/NumericInput';
import { COLORS } from 'constants/ui';
import Checkbox from 'components/Checkbox';
import ProgressTracker from './ProgressTracker';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import useSynthsMapQuery from 'queries/options/useSynthsMapQuery';
import { OptionsMarketInfo } from 'types/options';
import { navigateToOptionsMarket } from 'utils/routes';
import { getIsAppReady } from 'redux/modules/app';
import ValidationMessage from 'components/ValidationMessage';
import styled from 'styled-components';
import './media.scss';
import Loader from 'components/Loader';
import { SynthsMap } from 'types/synthetix';
import { getStableCoinForNetwork, getSynthName } from 'utils/currency';
import { createOneInchLimitOrder } from 'utils/1inch';
import ApprovalModal from 'components/ApprovalModal';

const MIN_FUNDING_AMOUNT_ROPSTEN = 0;
const MIN_FUNDING_AMOUNT_MAINNET = 0;

const roundMinutes = (date: Date) => {
    date.setUTCHours(12, 0, 0, 0);
    return date;
};

const Today: Date = new Date();

const datePickerMinDate: Date = new Date();

const datePickerMaxDate: Date = new Date();

datePickerMaxDate.setFullYear(datePickerMaxDate.getFullYear() + 2);

export type CurrencyKeyOptionType = { value: CurrencyKey; label: string };

export enum PositionType {
    UP = 'UP',
    DOWN = 'DOWN',
}

export const CreateMarket: React.FC = () => {
    try {
        const networkId = useSelector((state: RootState) => getNetworkId(state));
        const [longPrice, setLongPrice] = useState<number | string>(1);
        const [shortPrice, setShortPrice] = useState<number | string>(1);
        const [longAmount, setLongAmount] = useState<number | string>('');
        const [shortAmount, setShortAmount] = useState<number | string>('');
        const [sellLong, setSellLong] = useState<boolean>(false);
        const [sellShort, setSellShort] = useState<boolean>(false);
        const { t } = useTranslation();
        const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
        const [currencyKey, setCurrencyKey] = useState<ValueType<CurrencyKeyOptionType, false>>();
        const [isCurrencyKeyValid, setIsCurrencyKeyValid] = useState(true);
        const [isFocused, setIsFocused] = useState(true);
        const [strikePrice, setStrikePrice] = useState<number | string>('');
        const [isStrikePriceValid, setIsStrikePriceValid] = useState(true);
        const [maturityDate, setMaturityDate] = useState<Date>(
            roundMinutes(new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000))
        );
        const [initialFundingAmount, setInitialFundingAmount] = useState<number | string>('');
        const [isAmountValid, setIsAmountValid] = useState(true);
        const [userHasEnoughFunds, setUserHasEnoughFunds] = useState(true);
        const [hasAllowance, setAllowance] = useState<boolean>(false);
        const [isAllowing, setIsAllowing] = useState<boolean>(false);
        const [gasLimit, setGasLimit] = useState<number | null>(null);
        const [isCreatingMarket, setIsCreatingMarket] = useState<boolean>(false);
        const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
        const [showWarning, setShowWarning] = useState(false);
        const [isMarketCreated, setIsMarketCreated] = useState(false);
        const [market, setMarket] = useState<string>('');
        const [longAddress, setLong] = useState('');
        const [shortAddress, setShort] = useState('');
        const [isLongSubmitting, setIsLongSubmitting] = useState<boolean>(false);
        const [isLongSubmitted, setIsLongSubmitted] = useState<boolean>(false);
        const [isShortSubmitting, setIsShortSubmitting] = useState<boolean>(false);
        const [isShortSubmitted, setIsShortSubmitted] = useState<boolean>(false);
        const [isLongAmountValid, setIsLongAmountValid] = useState<boolean>(true);
        const [isShortAmountValid, setIsShortAmountValid] = useState<boolean>(true);
        const [isLongPriceValid, setIsLongPriceValid] = useState<boolean>(true);
        const [isShortPriceValid, setIsShortPriceValid] = useState<boolean>(true);
        const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
        const [l1Fee, setL1Fee] = useState<number | null>(null);
        const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
        const isL2 = getIsOVM(networkId);
        const isPolygon = getIsPolygon(networkId);

        const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
        const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
        let isCurrencySelected = false;

        const marketQuery = useBinaryOptionsMarketQuery(market, {
            enabled: isMarketCreated,
        });

        const optionsMarket: OptionsMarketInfo | null =
            marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

        const synthsMapQuery = useSynthsMapQuery(networkId, {
            enabled: isAppReady,
        });

        const synthsMap: SynthsMap = synthsMapQuery.isSuccess && synthsMapQuery.data ? synthsMapQuery.data : {};

        const assetsOptions = useMemo(
            () =>
                orderBy(
                    Object.values(synthsMap).map((synth) => ({
                        label: synth.asset,
                        value: synth.name,
                    })),
                    'label',
                    'asc'
                ),
            [synthsMap]
        );
        const isButtonDisabled = !hasAllowance || currencyKey === null || strikePrice === '' || maturityDate === null;

        const formatCreateMarketArguments = () => {
            const initialMint = ethers.utils.parseEther(Number(initialFundingAmount).toString());
            const oracleKey = bytesFormatter((currencyKey as CurrencyKeyOptionType).value);
            const price = ethers.utils.parseEther(strikePrice.toString());
            const maturity = Math.round((maturityDate as Date).getTime() / 1000);
            return { oracleKey, price, maturity, initialMint };
        };

        useEffect(() => {
            if (!walletAddress) return;
            const collateral = snxJSConnector.collateral;
            const { binaryOptionsMarketManagerContract } = snxJSConnector;
            const getAllowanceForCurrentWallet = async () => {
                try {
                    const initialMint = ethers.utils.parseEther(Number(initialFundingAmount).toString());
                    const allowance = await checkAllowance(
                        initialMint,
                        collateral,
                        walletAddress,
                        binaryOptionsMarketManagerContract?.address as any
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            getAllowanceForCurrentWallet();
        }, [walletAddress, initialFundingAmount, isAllowing]);

        const getOrderEndDate = () => Math.round((optionsMarket as any)?.timeRemaining / 1000);

        const handleMarketCreation = async () => {
            const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
            try {
                setTxErrorMessage(null);
                setIsCreatingMarket(true);
                const { oracleKey, price, maturity, initialMint } = formatCreateMarketArguments();
                const BOMMContractWithSigner = binaryOptionsMarketManagerContract.connect(
                    (snxJSConnector as any).signer
                );
                const tx = (await BOMMContractWithSigner.createMarket(oracleKey, price, maturity, initialMint, {
                    gasLimit,
                })) as ethers.ContractTransaction;
                const txResult = await tx.wait();
                if (txResult && txResult.events) {
                    const rawData = txResult.events[txResult.events?.length - (isPolygon ? 2 : 1)];
                    if (rawData && rawData.decode) {
                        const goodData = rawData.decode(rawData.data);
                        setMarket(goodData.market);
                        setLong(goodData.long);
                        setShort(goodData.short);
                        setIsMarketCreated(true);
                        setIsCreatingMarket(false);
                        if (!sellLong && !sellShort) {
                            navigateToOptionsMarket(goodData.market);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsCreatingMarket(false);
            }
        };

        useEffect(() => {
            const fetchL1Fee = async (
                binaryOptionsMarketManagerContract: any,
                oracleKey: any,
                price: any,
                maturity: any,
                initialMint: any
            ) => {
                const txRequest = await binaryOptionsMarketManagerContract.populateTransaction.createMarket(
                    oracleKey,
                    price,
                    maturity,
                    initialMint
                );
                return getL1FeeInWei(txRequest, snxJSConnector);
            };

            const fetchGasLimit = async () => {
                const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
                try {
                    const { oracleKey, price, maturity, initialMint } = formatCreateMarketArguments();
                    const BOMMContractWithSigner = binaryOptionsMarketManagerContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            BOMMContractWithSigner.estimateGas.createMarket(oracleKey, price, maturity, initialMint),
                            fetchL1Fee(BOMMContractWithSigner, oracleKey, price, maturity, initialMint),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setUserHasEnoughFunds(true);
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await BOMMContractWithSigner.estimateGas.createMarket(
                            oracleKey,
                            price,
                            maturity,
                            initialMint
                        );
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setUserHasEnoughFunds(true);
                    }
                } catch (e: any) {
                    if (e.data?.originalError?.code === 3) {
                        setUserHasEnoughFunds(false);
                    }
                    console.log(e);
                    setGasLimit(null);
                }
            };
            if (isButtonDisabled) return;
            fetchGasLimit();
        }, [isButtonDisabled, currencyKey, strikePrice, maturityDate, initialFundingAmount, isButtonDisabled]);

        useEffect(() => {
            if (initialFundingAmount) {
                if (sellLong) {
                    setIsLongAmountValid(longAmount ? longAmount <= initialFundingAmount : false);
                    setIsShortAmountValid(shortAmount ? shortAmount <= initialFundingAmount : false);
                }
                if (sellShort) {
                    setIsLongPriceValid(longPrice ? Number(longPrice) <= 1 && Number(longPrice) > 0 : false);
                    setIsShortPriceValid(shortPrice ? Number(shortPrice) <= 1 && Number(shortPrice) > 0 : false);
                }
            }
        }, [initialFundingAmount, longAmount, longPrice, shortAmount, shortPrice]);

        const handleAllowance = async (approveAmount: BigNumber) => {
            const collateral = snxJSConnector.collateral;
            const collateralContract = collateral?.connect((snxJSConnector as any).signer);

            const { binaryOptionsMarketManagerContract } = snxJSConnector;

            try {
                setIsAllowing(true);
                const gasEstimate = await collateralContract?.estimateGas.approve(
                    binaryOptionsMarketManagerContract?.address as any,
                    approveAmount
                );
                const tx = (await collateralContract?.approve(
                    binaryOptionsMarketManagerContract?.address as any,
                    approveAmount,
                    {
                        gasLimit: formatGasLimit(gasEstimate as any, networkId),
                    }
                )) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                await tx.wait();
                setIsAllowing(false);
            } catch (e) {
                console.log(e);
                setIsAllowing(false);
                setOpenApprovalModal(false);
            }
        };

        const getSubmitButton = () => {
            if (!hasAllowance) {
                return (
                    <Button
                        style={{ padding: '8px 24px' }}
                        className="primary"
                        disabled={isAllowing}
                        onClick={() => setOpenApprovalModal(true)}
                    >
                        {isAllowing
                            ? t('options.create-market.summary.waiting-for-approval-button-label')
                            : t('options.create-market.summary.approve-manager-button-label')}
                    </Button>
                );
            }
            if (!isMarketCreated) {
                return (
                    <Button
                        style={{ padding: '8px 24px' }}
                        className="primary"
                        disabled={isButtonDisabled || isCreatingMarket || !gasLimit}
                        onClick={handleMarketCreation}
                    >
                        {isCreatingMarket
                            ? t('options.create-market.summary.creating-market-button-label')
                            : t('options.create-market.summary.create-market-button-label')}
                    </Button>
                );
            }
            if (sellLong && !isLongSubmitted) {
                return (
                    <Button
                        style={{ padding: '8px 24px' }}
                        className="primary  button-div-responsive__upper"
                        disabled={!isLongAmountValid || isLongSubmitting || isLongSubmitted}
                        onClick={handleSubmitOrder.bind(this, longPrice, longAddress, longAmount, true)}
                    >
                        {!isLongSubmitting
                            ? t(`options.market.trade-options.place-order.confirm-button.long`)
                            : t(`options.market.trade-options.place-order.confirm-button.progress-label`)}
                    </Button>
                );
            }

            if (sellShort && !isShortSubmitted) {
                return (
                    <Button
                        style={{ padding: '8px 24px' }}
                        className="primary  button-div-responsive__upper"
                        disabled={!isShortAmountValid || isShortSubmitting || isShortSubmitted}
                        onClick={handleSubmitOrder.bind(this, shortPrice, shortAddress, shortAmount, false)}
                    >
                        {!isShortSubmitting
                            ? t(`options.market.trade-options.place-order.confirm-button.short`)
                            : t(`options.market.trade-options.place-order.confirm-button.progress-label`)}
                    </Button>
                );
            }
        };

        const handleSubmitOrder = async (
            price: number | string,
            makerToken: string,
            optionsAmount: number | string,
            isLong?: boolean
        ) => {
            const collateral = snxJSConnector.collateral;
            setTxErrorMessage(null);
            isLong ? setIsLongSubmitting(true) : setIsShortSubmitting(true);

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
                isLong ? setIsLongSubmitted(true) : setIsShortSubmitted(true);
                if ((isLong && !sellShort) || !isLong) {
                    navigateToOptionsMarket(market);
                    return;
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            }
            isLong ? setIsLongSubmitting(false) : setIsShortSubmitting(false);
        };

        const formattedMaturityDate = maturityDate ? formatShortDate(maturityDate) : EMPTY_VALUE;
        const timeLeftToExercise = maturityDate
            ? formatDuration(intervalToDuration({ start: maturityDate, end: add(maturityDate, { months: 6 }) }), {
                  format: ['months'],
              })
            : EMPTY_VALUE;

        return isNetworkSupported(networkId) ? (
            <>
                <Text
                    className="create-market create-market-title"
                    style={{ height: '100%', paddingTop: '50px', alignSelf: 'flex-start' }}
                >
                    {t('options.create-market.title')}
                </Text>
                <FlexDiv className="create-market-content" style={{ padding: '50px 0' }}>
                    <FlexDivColumn style={{ flex: 1 }}>
                        <div className="create-market-content__info">
                            <Text className="text-s pale-grey lh24" style={{ margin: '0px 2px' }}>
                                {t('options.create-market.subtitle', { token: getStableCoinForNetwork(networkId) })}
                            </Text>
                            <Text className="text-s pale-grey lh24" style={{ margin: '30px 2px' }}>
                                {t('options.create-market.note', { token: getStableCoinForNetwork(networkId) })}
                            </Text>
                        </div>
                        <InputsWrapper className="create-market-content__wrapper">
                            <FlexDivRow className="create-market-content__parameters">
                                <ShortInputContainer
                                    className="create-market-content__parameters__field"
                                    style={{
                                        marginBottom: 40,
                                        zIndex: 4,
                                        opacity: isCreatingMarket || isMarketCreated ? 0.4 : 1,
                                    }}
                                >
                                    <ReactSelect
                                        className={!isCurrencyKeyValid ? 'error' : ''}
                                        filterOption={(option: any, rawInput: any) =>
                                            option.label.toLowerCase().includes(rawInput.toLowerCase()) ||
                                            getSynthName(option.value)?.toLowerCase().includes(rawInput.toLowerCase())
                                        }
                                        formatOptionLabel={(option: any) => {
                                            return (
                                                <Currency.Name
                                                    currencyKey={option.value}
                                                    showIcon={true}
                                                    synthIconStyle={{ width: 24, height: 24 }}
                                                    iconProps={{ type: 'asset' }}
                                                />
                                            );
                                        }}
                                        onBlur={() => {
                                            setIsFocused(false);
                                            !isCurrencySelected
                                                ? currencyKey
                                                    ? setIsCurrencyKeyValid(true)
                                                    : setIsCurrencyKeyValid(false)
                                                : '';
                                        }}
                                        onFocus={() => {
                                            setIsFocused(true);
                                        }}
                                        options={assetsOptions}
                                        placeholder={t('common.eg-val', { val: CRYPTO_CURRENCY_MAP.BTC })}
                                        value={currencyKey}
                                        onChange={(option: any) => {
                                            isCurrencySelected = true;
                                            setCurrencyKey(option);
                                            setIsCurrencyKeyValid(true);
                                        }}
                                        isDisabled={isCreatingMarket || isMarketCreated}
                                    />
                                    <InputLabel style={{ zIndex: 100 }}>
                                        {t('options.create-market.details.select-asset-label')}
                                    </InputLabel>
                                    <ErrorMessage
                                        show={!isCurrencyKeyValid && !isFocused}
                                        text={t('options.create-market.select-asset')}
                                    />
                                </ShortInputContainer>
                                <ShortInputContainer
                                    className="create-market-content__parameters__field"
                                    style={{
                                        marginBottom: 40,
                                        opacity: isCreatingMarket || isMarketCreated ? 0.4 : 1,
                                    }}
                                >
                                    <Input
                                        className={!isStrikePriceValid ? 'error' : ''}
                                        value={strikePrice}
                                        onChange={(e) => {
                                            const { value } = e.target;

                                            let trimmedValue = value;
                                            if (value.indexOf('.') > -1) {
                                                const numberOfDecimals = value.split('.')[1].length;
                                                if (numberOfDecimals > DEFAULT_TOKEN_DECIMALS) {
                                                    trimmedValue = value.substring(0, value.length - 1);
                                                }
                                            }

                                            if (Number(trimmedValue) > 0) {
                                                setIsStrikePriceValid(true);
                                            } else {
                                                setIsStrikePriceValid(false);
                                            }
                                            setStrikePrice(trimmedValue);

                                            if (Number(trimmedValue) > 0 && currencyKey) {
                                                const currentPrice = get(exchangeRates, currencyKey.value, null);
                                                if (currentPrice) {
                                                    const show =
                                                        currentPrice * 100 < Number(trimmedValue) ||
                                                        currentPrice / 100 > Number(trimmedValue);
                                                    setShowWarning(show);
                                                }
                                            } else {
                                                setShowWarning(false);
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (Number(e.target.value) > 0) {
                                                setIsStrikePriceValid(true);
                                            } else {
                                                setIsStrikePriceValid(false);
                                            }
                                        }}
                                        readOnly={isCreatingMarket || isMarketCreated}
                                        type="number"
                                    />
                                    <InputLabel>{t('options.create-market.details.strike-price-label')}</InputLabel>
                                    <CurrencyLabel>{USD_SIGN}</CurrencyLabel>
                                    <ErrorMessage
                                        show={!isStrikePriceValid}
                                        text={t('options.create-market.enter-strike-price')}
                                    ></ErrorMessage>

                                    {showWarning && (
                                        <Error className="text-xxxs warning">
                                            {t('options.create-market.difference-warning')}
                                        </Error>
                                    )}
                                </ShortInputContainer>
                            </FlexDivRow>
                            <FlexDivRow className="create-market-content__parameters">
                                <FlexDivRow
                                    className="create-market-content__double-fields"
                                    style={{ width: '50%', marginRight: 10 }}
                                >
                                    <ShortInputContainer
                                        className="create-market-content__double-fields__field"
                                        style={{
                                            marginBottom: 40,
                                            flex: 2,
                                            opacity: isCreatingMarket || isMarketCreated ? 0.4 : 1,
                                        }}
                                    >
                                        <DatePicker
                                            className="maturity-date"
                                            dateFormat="MMM d, yyyy"
                                            minDate={datePickerMinDate}
                                            maxDate={datePickerMaxDate}
                                            startDate={Today}
                                            selected={maturityDate}
                                            endDate={maturityDate}
                                            onFocus={(e) => {
                                                document.body.clientWidth < 600
                                                    ? ((e.target.readOnly = true),
                                                      e.target.scrollIntoView({ behavior: 'smooth' }))
                                                    : (e.target.readOnly = false);
                                            }}
                                            onChange={(d: Date) => setMaturityDate(d)}
                                            readOnly={isCreatingMarket || isMarketCreated}
                                            popperPlacement="bottom-start"
                                            popperModifiers={{
                                                flip: {
                                                    behavior: ['bottom'],
                                                },
                                                preventOverflow: {
                                                    enabled: false,
                                                },
                                                hide: {
                                                    enabled: false,
                                                },
                                            }}
                                        />
                                        <InputLabel>
                                            {t('options.create-market.details.market-maturity-date-label')}
                                        </InputLabel>
                                    </ShortInputContainer>
                                    <ShortInputContainer
                                        className="create-market-content__double-fields__field"
                                        style={{
                                            marginBottom: 40,
                                            flex: 1,
                                            minWidth: 90,
                                            opacity: isCreatingMarket || isMarketCreated ? 0.4 : 1,
                                        }}
                                    >
                                        <DatePicker
                                            className="maturity-date"
                                            dateFormat="h:mm aa"
                                            showTimeSelectOnly={true}
                                            showTimeSelect={true}
                                            onFocus={(e) => {
                                                document.body.clientWidth < 600
                                                    ? ((e.target.readOnly = true),
                                                      e.target.scrollIntoView({ behavior: 'smooth' }))
                                                    : (e.target.readOnly = false);
                                            }}
                                            selected={convertUTCToLocalDate(maturityDate)}
                                            onChange={(d: Date) => setMaturityDate(convertLocalToUTCDate(d))}
                                            readOnly={isCreatingMarket || isMarketCreated}
                                            popperPlacement={
                                                document.body.clientWidth < 600 ? 'bottom-end' : 'bottom-start'
                                            }
                                            popperModifiers={{
                                                flip: {
                                                    behavior: ['bottom'],
                                                },
                                                preventOverflow: {
                                                    enabled: false,
                                                },
                                                hide: {
                                                    enabled: false,
                                                },
                                            }}
                                        />
                                        <InputLabel style={{ wordBreak: 'break-all' }}>
                                            {t('options.create-market.details.market-maturity-time-label')}
                                        </InputLabel>
                                    </ShortInputContainer>
                                </FlexDivRow>

                                <ShortInputContainer
                                    className={
                                        (isAmountValid && userHasEnoughFunds ? '' : 'error') +
                                        ' create-market-content__double-fields'
                                    }
                                    style={{
                                        position: 'relative',
                                        marginBottom: 40,
                                        opacity: isCreatingMarket || isMarketCreated ? 0.4 : 1,
                                    }}
                                >
                                    <Input
                                        className={!isAmountValid || !userHasEnoughFunds ? 'error' : ''}
                                        value={initialFundingAmount}
                                        onChange={(e) => {
                                            setInitialFundingAmount(e.target.value);
                                            setLongAmount(parseInt(e.target.value, 10));
                                            setShortAmount(parseInt(e.target.value, 10));
                                            Number(e.target.value) >=
                                            (networkId === 1 ? MIN_FUNDING_AMOUNT_MAINNET : MIN_FUNDING_AMOUNT_ROPSTEN)
                                                ? setIsAmountValid(true)
                                                : setIsAmountValid(false);
                                        }}
                                        id="funding-amount"
                                        onBlur={() => {
                                            Number(initialFundingAmount) >=
                                            (networkId === 1 ? MIN_FUNDING_AMOUNT_MAINNET : MIN_FUNDING_AMOUNT_ROPSTEN)
                                                ? setIsAmountValid(true)
                                                : setIsAmountValid(false);
                                        }}
                                        type="number"
                                        readOnly={isCreatingMarket || isMarketCreated}
                                    />
                                    <InputLabel>{t('options.create-market.details.funding-amount.label')}</InputLabel>
                                    <CurrencyLabel>{getStableCoinForNetwork(networkId)}</CurrencyLabel>
                                    <Text
                                        className="text-xxxs grey"
                                        style={{
                                            margin: '4px 0 6px 6px',
                                            lineHeight: '16px',
                                            position: 'absolute',
                                            bottom: -40,
                                        }}
                                    >
                                        {t('options.create-market.details.funding-amount.desc', {
                                            token: getStableCoinForNetwork(networkId),
                                        })}
                                    </Text>

                                    <ErrorMessage
                                        show={!isAmountValid}
                                        text={t('options.create-market.min-amount', {
                                            minimum:
                                                networkId === 1
                                                    ? MIN_FUNDING_AMOUNT_MAINNET
                                                    : MIN_FUNDING_AMOUNT_ROPSTEN,
                                        })}
                                    />

                                    <ErrorMessage
                                        show={isAmountValid && !userHasEnoughFunds}
                                        text={t('options.create-market.insufficient-amount')}
                                    />
                                </ShortInputContainer>
                            </FlexDivRow>
                            <Text
                                style={{
                                    opacity:
                                        !initialFundingAmount || !isAmountValid || isLongSubmitting || isLongSubmitted
                                            ? 0.4
                                            : 1,
                                }}
                                className="text-xxxs pale-grey bold ls1 uppercase"
                            >
                                {t('options.create-market.sellOptions')}
                            </Text>
                            <FlexDiv
                                className="create-market-content__multi-fields-parent"
                                style={{
                                    opacity:
                                        !initialFundingAmount || !isAmountValid || isLongSubmitting || isLongSubmitted
                                            ? 0.4
                                            : 1,
                                }}
                            >
                                {/* <FlexDiv className="create-market-content__multi-fields-parent__slider-container"> */}
                                <CheckboxContainer className="create-market-content__multi-fields-parent__checkbox">
                                    <Checkbox
                                        disabled={
                                            !initialFundingAmount ||
                                            !isAmountValid ||
                                            isLongSubmitting ||
                                            isLongSubmitted
                                        }
                                        checked={sellLong}
                                        value={sellLong.toString()}
                                        onChange={(e: any) => setSellLong(e.target.checked || false)}
                                    />
                                </CheckboxContainer>
                                <SliderContainer className="create-market-content__multi-fields-parent__slider">
                                    <LongSlider
                                        value={Number(longPrice)}
                                        step={0.01}
                                        max={1}
                                        min={0}
                                        onChange={(_, value) => setLongPrice(Number(value))}
                                        disabled={!sellLong || isLongSubmitting || isLongSubmitted}
                                    />
                                    <FlexDivRow>
                                        <SliderRange color={COLORS.LONG}>{`${USD_SIGN}0`}</SliderRange>
                                        <SliderRange color={COLORS.LONG}>{`${USD_SIGN}1`}</SliderRange>
                                    </FlexDivRow>
                                </SliderContainer>
                                {/* </FlexDiv> */}
                                {/* <FlexDiv className="create-market-content__multi-fields-parent__double-input-fields"> */}
                                <DoubleShortInputContainer className="create-market-content__multi-fields-parent__double-input-fields__field">
                                    <NumericInput
                                        value={longPrice}
                                        onChange={(_, value) => setLongPrice(value)}
                                        disabled={!sellLong || isLongSubmitting || isLongSubmitted}
                                        className={isLongPriceValid ? '' : 'error'}
                                        step="0.01"
                                    />
                                    {window.innerWidth < 900 ? (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.price-label-mobile')}
                                        </InputLabel>
                                    ) : (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.price-label')}
                                        </InputLabel>
                                    )}
                                    <CurrencyLabel className={!sellLong ? 'disabled' : ''}>
                                        {getStableCoinForNetwork(networkId)}
                                    </CurrencyLabel>
                                    <FieldValidationMessage
                                        showValidation={!isLongPriceValid}
                                        message={t(
                                            Number(longPrice) == 0
                                                ? 'common.errors.enter-price'
                                                : 'common.errors.invalid-price-max',
                                            { max: 1 }
                                        )}
                                    />
                                </DoubleShortInputContainer>
                                <DoubleShortInputContainer className="create-market-content__multi-fields-parent__double-input-fields__field--last">
                                    <NumericInput
                                        value={longAmount}
                                        onChange={(_, value) => setLongAmount(value)}
                                        disabled={!sellLong || isLongSubmitting || isLongSubmitted}
                                        className={isLongAmountValid ? '' : 'error'}
                                    />
                                    {window.innerWidth < 900 ? (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.amount-label-mobile')}
                                        </InputLabel>
                                    ) : (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.amount-label', {
                                                orderSide: 'sell',
                                            })}
                                        </InputLabel>
                                    )}
                                    <CurrencyLabel className={!sellLong ? 'disabled' : ''}>
                                        {PositionType.UP}
                                    </CurrencyLabel>
                                    <FieldValidationMessage
                                        showValidation={!isLongAmountValid}
                                        message={t(
                                            Number(longAmount) == 0
                                                ? 'common.errors.enter-amount'
                                                : 'common.errors.invalid-amount-max',
                                            {
                                                max: initialFundingAmount,
                                            }
                                        )}
                                    />
                                </DoubleShortInputContainer>
                                {/* </FlexDiv> */}
                            </FlexDiv>
                            <FlexDiv
                                className="create-market-content__multi-fields-parent"
                                style={{
                                    opacity:
                                        !initialFundingAmount || !isAmountValid || isShortSubmitting || isShortSubmitted
                                            ? 0.4
                                            : 1,
                                }}
                            >
                                {/* <FlexDiv className="create-market-content__multi-fields-parent__slider-container"> */}
                                <CheckboxContainer className="create-market-content__multi-fields-parent__checkbox">
                                    <Checkbox
                                        disabled={
                                            !initialFundingAmount ||
                                            !isAmountValid ||
                                            isShortSubmitting ||
                                            isShortSubmitted
                                        }
                                        checked={sellShort}
                                        value={sellShort.toString()}
                                        onChange={(e: any) => setSellShort(e.target.checked || false)}
                                    />
                                </CheckboxContainer>
                                <SliderContainer className="create-market-content__multi-fields-parent__slider">
                                    <ShortSlider
                                        value={Number(shortPrice)}
                                        step={0.01}
                                        max={1}
                                        min={0}
                                        onChange={(_, value) => setShortPrice(Number(value))}
                                        disabled={!sellShort || isShortSubmitting || isShortSubmitted}
                                    />
                                    <FlexDivRow>
                                        <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}0`}</SliderRange>
                                        <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}1`}</SliderRange>
                                    </FlexDivRow>
                                </SliderContainer>
                                {/* </FlexDiv> */}
                                {/* <FlexDiv className="create-market-content__multi-fields-parent__double-input-fields"> */}
                                <DoubleShortInputContainer className="create-market-content__multi-fields-parent__double-input-fields__field">
                                    <NumericInput
                                        value={shortPrice}
                                        onChange={(_, value) => setShortPrice(value)}
                                        disabled={!sellShort || isShortSubmitting || isShortSubmitted}
                                        className={isShortPriceValid ? '' : 'error'}
                                        step="0.01"
                                    />
                                    {window.innerWidth < 900 ? (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.price-label-mobile')}
                                        </InputLabel>
                                    ) : (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.price-label')}
                                        </InputLabel>
                                    )}
                                    <CurrencyLabel className={!sellShort ? 'disabled' : ''}>
                                        {getStableCoinForNetwork(networkId)}
                                    </CurrencyLabel>
                                    <FieldValidationMessage
                                        showValidation={!isShortPriceValid}
                                        message={t(
                                            Number(shortPrice) == 0
                                                ? 'common.errors.enter-price'
                                                : 'common.errors.invalid-price-max',
                                            { max: 1 }
                                        )}
                                    />
                                </DoubleShortInputContainer>
                                <DoubleShortInputContainer className="create-market-content__multi-fields-parent__double-input-fields__field--last">
                                    <NumericInput
                                        value={shortAmount}
                                        onChange={(_, value) => setShortAmount(value)}
                                        disabled={!sellShort || isShortSubmitting || isShortSubmitted}
                                        className={isShortAmountValid ? '' : 'error'}
                                    />
                                    {window.innerWidth < 900 ? (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.amount-label-mobile')}
                                        </InputLabel>
                                    ) : (
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.amount-label', {
                                                orderSide: 'sell',
                                            })}
                                        </InputLabel>
                                    )}
                                    <CurrencyLabel className={!sellShort ? 'disabled' : ''}>
                                        {PositionType.DOWN}
                                    </CurrencyLabel>
                                    <FieldValidationMessage
                                        showValidation={!isShortAmountValid}
                                        message={t(
                                            Number(shortAmount) == 0
                                                ? 'common.errors.enter-amount'
                                                : 'common.errors.invalid-amount-max',
                                            {
                                                max: initialFundingAmount,
                                            }
                                        )}
                                    />
                                </DoubleShortInputContainer>
                                {/* </FlexDiv> */}
                            </FlexDiv>
                            <NetworkFees gasLimit={gasLimit} l1Fee={l1Fee} />
                        </InputsWrapper>
                    </FlexDivColumn>
                    <MarketSummary
                        currencyKey={currencyKey}
                        strikingPrice={strikePrice}
                        maturityDate={formattedMaturityDate}
                        initialFundingAmount={initialFundingAmount}
                        timeLeftToExercise={timeLeftToExercise}
                        currentPrice={currencyKey ? get(exchangeRates, currencyKey.value, 0) : undefined}
                    ></MarketSummary>
                </FlexDiv>
                <ProgressTracker
                    isWalletAccessEnabled={hasAllowance}
                    isAllowing={isAllowing}
                    isMarketCreated={isMarketCreated}
                    isCreating={isCreatingMarket}
                    isLongSubmitted={isLongSubmitted}
                    isLongSubmitting={isLongSubmitting}
                    isShortSubmitted={isShortSubmitted}
                    isShortSubmitting={isShortSubmitting}
                    showLongProcess={sellLong}
                    showShortProcess={sellShort}
                ></ProgressTracker>
                <FlexDivColumnCentered
                    className="progress-tracker-controls"
                    style={{ alignItems: 'center', marginBottom: 120 }}
                >
                    <div
                        className="progress-tracker-controls__button-div-responsive"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 50,
                        }}
                    >
                        <FlexDivCentered>{getSubmitButton()}</FlexDivCentered>
                        {isMarketCreated ? (
                            <>
                                <Text
                                    className="pale-grey text-s"
                                    style={{ margin: '0 70px', display: sellLong || sellShort ? 'block' : 'none' }}
                                >
                                    {t('common.or')}
                                </Text>
                                <Button
                                    className="tertiary progress-tracker-controls__button-div-responsive__bottom"
                                    onClick={() => navigateToOptionsMarket(market)}
                                >
                                    {t('options.create-market.go-to-market')}
                                </Button>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </FlexDivColumnCentered>

                {openApprovalModal && (
                    <ApprovalModal
                        defaultAmount={initialFundingAmount}
                        tokenSymbol={getStableCoinForNetwork(networkId)}
                        isAllowing={isAllowing}
                        onSubmit={handleAllowance}
                        onClose={() => setOpenApprovalModal(false)}
                    />
                )}
            </>
        ) : (
            <Loader />
        );
    } catch (e) {
        return <Loader />;
    }
};

export const UseLegacySigningContainer = styled.div`
    margin-top: 12px;
    margin-left: 10px;
`;

export default CreateMarket;
