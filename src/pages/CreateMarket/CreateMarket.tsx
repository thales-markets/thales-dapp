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
import DatePicker from 'components/DatePicker';
import NetworkFees from './NetworkFees';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getNetworkId } from 'redux/modules/wallet';
import Currency from 'components/Currency';
import { BigNumber, ethers } from 'ethers';
import { FlexDiv, FlexDivColumn, Text, Button, FlexDivRow, FlexDivColumnCentered, FlexDivCentered } from 'theme/common';

import MarketSummary from './MarketSummary';
import { convertLocalToUTCDate, convertUTCToLocalDate, formatShortDate } from 'utils/formatters/date';
import { Error, ErrorMessage, InputsWrapper } from './components';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import {
    CurrencyLabel,
    Input,
    InputLabel,
    ReactSelect,
    ShortInputContainer,
} from 'components/OldVersion/old-components';
import ProgressTracker from './ProgressTracker';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import useSynthsMapQuery from 'queries/options/useSynthsMapQuery';
import { navigateToOptionsMarket } from 'utils/routes';
import { getIsAppReady } from 'redux/modules/app';
import ValidationMessage from 'components/ValidationMessage';
import styled from 'styled-components';
import './media.scss';
import Loader from 'components/Loader';
import { SynthsMap } from 'types/synthetix';
import { getStableCoinForNetwork, getSynthName } from 'utils/currency';
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
        const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
        const [l1Fee, setL1Fee] = useState<number | null>(null);
        const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
        const isL2 = getIsOVM(networkId);
        const isPolygon = getIsPolygon(networkId);

        const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
        const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
        let isCurrencySelected = false;

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
                        setIsMarketCreated(true);
                        setIsCreatingMarket(false);
                        navigateToOptionsMarket(goodData.market);
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
                            <Button
                                className="tertiary progress-tracker-controls__button-div-responsive__bottom"
                                onClick={() => navigateToOptionsMarket(market)}
                            >
                                {t('options.create-market.go-to-market')}
                            </Button>
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
