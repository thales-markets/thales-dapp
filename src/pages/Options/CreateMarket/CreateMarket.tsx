import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ValueType } from 'react-select';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import add from 'date-fns/add';
import orderBy from 'lodash/orderBy';
import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP, FIAT_CURRENCY_MAP, CurrencyKey, USD_SIGN } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { bytesFormatter, parseBytes32String, bigNumberFormatter } from 'utils/formatters/ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import DatePicker from 'components/Input/DatePicker';
import NetworkFees from '../components/NetworkFees';
import { Form, Message } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getCustomGasPrice, getGasSpeed } from 'redux/modules/wallet';
import { navigateToOptionsMarket } from 'utils/routes';
import Currency from 'components/Currency';
import Select from 'components/Select';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { ethers } from 'ethers';
import { FlexDiv, FlexDivColumn, Background, MainWrapper, Text, Button } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import MarketSummary from './MarketSummary';
import { formatShortDate } from 'utils/formatters/date';
import { LINKS } from 'constants/links';
import { HowItWorks, SUSDSign, Error, /*LongSlider, ShortSlider,*/ Field, FundingInput, Input } from './components';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';

const roundMinutes = (date: Date) => {
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0, 0, 0);
    return date;
};

const Today: Date = new Date();

export type CurrencyKeyOptionType = { value: CurrencyKey; label: string };

export type MarketFees = Record<string, number>;

export const CreateMarket: React.FC = () => {
    const { t } = useTranslation();
    const { synthsMap: synths } = snxJSConnector;
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [currencyKey, setCurrencyKey] = useState<ValueType<CurrencyKeyOptionType, false>>();
    const [isCurrencyKeyValid, setIsCurrencyKeyValid] = useState(true);
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
    const [marketFees, setMarketFees] = useState<MarketFees | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    // const [longPrice, setLongPrice] = useState<number>(0);
    // const [shortPrice, setShortPrice] = useState<number>(0);

    const exchangeRatesQuery = useExchangeRatesQuery();
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;

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

    const assetsOptions = useMemo(
        () =>
            orderBy(
                [
                    {
                        label: CRYPTO_CURRENCY_MAP.SNX,
                        value: CRYPTO_CURRENCY_MAP.SNX,
                    },
                    {
                        label: CRYPTO_CURRENCY_MAP.KNC,
                        value: CRYPTO_CURRENCY_MAP.KNC,
                    },
                    ...Object.values(synths) //.sort(sortSynths)
                        .filter((synth) => !synth.inverted && synth.name !== SYNTHS_MAP.sUSD)
                        .map((synth) => ({
                            label: synth.asset,
                            value: synth.name,
                        })),
                ],
                'label',
                'asc'
            ),
        [synths]
    );

    const isButtonDisabled =
        currencyKey === null || strikePrice === '' || maturityDate === null || initialFundingAmount === '';

    const formatCreateMarketArguments = () => {
        const initialMint = ethers.utils.parseEther(initialFundingAmount.toString());
        const oracleKey = bytesFormatter((currencyKey as CurrencyKeyOptionType).value);
        const price = ethers.utils.parseEther(strikePrice.toString());
        const maturity = Math.round((maturityDate as Date).getTime() / 1000);
        return { oracleKey, price, maturity, initialMint };
    };

    useEffect(() => {
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        const { binaryOptionsMarketManagerContract } = snxJSConnector;
        const getAllowanceForCurrentWallet = async () => {
            try {
                const [allowance, fees] = await Promise.all([
                    SynthsUSD.allowance(walletAddress, binaryOptionsMarketManagerContract.address),
                    binaryOptionsMarketManagerContract.fees(),
                ]);
                setAllowance(!!bigNumberFormatter(allowance));
                setMarketFees({
                    creator: fees.creatorFee / 1e18,
                    pool: fees.poolFee / 1e18,
                });
            } catch (e) {
                console.log(e);
            }
        };
        const setEventListeners = () => {
            SynthsUSD.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                if (owner === walletAddress && spender === binaryOptionsMarketManagerContract.address) {
                    setAllowance(true);
                    setIsAllowing(false);
                }
            });
        };
        getAllowanceForCurrentWallet();
        setEventListeners();
        return () => {
            SynthsUSD.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [walletAddress]);

    useEffect(() => {
        const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
        if (!isCreatingMarket) return;
        binaryOptionsMarketManagerContract.on(
            BINARY_OPTIONS_EVENTS.MARKET_CREATED,
            (market: string, creator: string, oracleKey: string) => {
                if (
                    creator === walletAddress &&
                    parseBytes32String(oracleKey) === (currencyKey as CurrencyKeyOptionType).value
                ) {
                    navigateToOptionsMarket(market);
                }
            }
        );
        return () => {
            binaryOptionsMarketManagerContract.removeAllListeners(BINARY_OPTIONS_EVENTS.MARKET_CREATED);
        };
    }, [isCreatingMarket]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
            try {
                const { oracleKey, price, maturity, initialMint } = formatCreateMarketArguments();
                const BOMMContractWithSigner = binaryOptionsMarketManagerContract.connect(
                    (snxJSConnector as any).signer
                );
                const gasEstimate = await BOMMContractWithSigner.estimateGas.createMarket(
                    oracleKey,
                    price,
                    maturity,
                    initialMint
                );
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                setUserHasEnoughFunds(true);
            } catch (e) {
                console.log(e);
                if (e.data?.originalError.code === 3) {
                    setUserHasEnoughFunds(true);
                }
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, currencyKey, strikePrice, maturityDate, initialFundingAmount]);

    const strikePricePlaceholderVal = `${USD_SIGN}10000.00 ${FIAT_CURRENCY_MAP.USD}`;

    const handleAllowance = async () => {
        if (gasPrice !== null) {
            const {
                contracts: { SynthsUSD },
            } = snxJSConnector.snxJS as any;
            const { binaryOptionsMarketManagerContract } = snxJSConnector;
            try {
                setIsAllowing(true);
                const gasEstimate = await SynthsUSD.estimateGas.approve(
                    binaryOptionsMarketManagerContract.address,
                    ethers.constants.MaxUint256
                );
                await SynthsUSD.approve(binaryOptionsMarketManagerContract.address, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setIsAllowing(false);
            }
        }
    };

    const handleMarketCreation = async () => {
        if (gasPrice !== null) {
            const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
            try {
                setTxErrorMessage(null);
                setIsCreatingMarket(true);
                const { oracleKey, price, maturity, initialMint } = formatCreateMarketArguments();
                const BOMMContractWithSigner = binaryOptionsMarketManagerContract.connect(
                    (snxJSConnector as any).signer
                );
                await BOMMContractWithSigner.createMarket(oracleKey, price, maturity, initialMint, {
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsCreatingMarket(false);
            }
        }
    };

    const formattedMaturityDate = maturityDate ? formatShortDate(maturityDate) : EMPTY_VALUE;
    const timeLeftToExercise = maturityDate
        ? formatDuration(intervalToDuration({ start: maturityDate, end: add(maturityDate, { weeks: 26 }) }), {
              format: ['months'],
          })
        : EMPTY_VALUE;

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <MainWrapper>
                <FlexDivColumn>
                    <MarketHeader />
                    <Text className="create-market" style={{ padding: '50px 150px 0' }}>
                        {t('options.create-market.title')}
                    </Text>
                    <FlexDiv style={{ padding: '50px 150px' }}>
                        <FlexDivColumn style={{ flex: 1 }}>
                            <Text className="text-s pale-grey" style={{ lineHeight: '24px' }}>
                                {t('options.create-market.subtitle')}
                            </Text>
                            <Text style={{ marginBottom: 115, marginTop: 30 }} className="text-s pale-grey">
                                New to Binary Options? Make sure to read{' '}
                                <HowItWorks href={LINKS.Blog.HowBinaryOptionsWork}>how it works</HowItWorks> first!
                            </Text>
                            <Form>
                                <Form.Group widths="equal">
                                    <Field className={isCurrencyKeyValid ? '' : 'error'}>
                                        <Text
                                            className="text-ms pale-grey uppercase text-error"
                                            style={{ margin: '5px 0' }}
                                        >
                                            {t('options.create-market.details.select-asset-label')}
                                        </Text>
                                        <Select
                                            className="select-override"
                                            filterOption={(option, rawInput) =>
                                                option.label.toLowerCase().includes(rawInput.toLowerCase()) ||
                                                getSynthName(option.value)
                                                    ?.toLowerCase()
                                                    .includes(rawInput.toLowerCase())
                                            }
                                            formatOptionLabel={(option: any) => {
                                                return (
                                                    <Currency.Name
                                                        currencyKey={option.value}
                                                        showIcon={true}
                                                        iconProps={{ type: 'asset' }}
                                                    />
                                                );
                                            }}
                                            onBlur={() => {
                                                currencyKey
                                                    ? setIsCurrencyKeyValid(true)
                                                    : setIsCurrencyKeyValid(false);
                                            }}
                                            options={assetsOptions}
                                            placeholder={t('common.eg-val', { val: CRYPTO_CURRENCY_MAP.BTC })}
                                            value={currencyKey}
                                            onChange={(option: any) => {
                                                setCurrencyKey(option);
                                                setIsCurrencyKeyValid(true);
                                                const price = get(exchangeRates, option.value, null);
                                                if (price) setStrikePrice(price);
                                            }}
                                        />
                                        {!isCurrencyKeyValid && (
                                            <Error className="text-xxxs red">Please select asset.</Error>
                                        )}
                                    </Field>
                                    <Field
                                        className={`${isStrikePriceValid ? '' : 'error'} ${
                                            showWarning ? 'warning' : ''
                                        }`}
                                    >
                                        <Text
                                            className="text-ms pale-grey uppercase text-error"
                                            style={{ margin: '5px 0' }}
                                        >
                                            {t('options.create-market.details.strike-price-label')}
                                        </Text>
                                        <Input
                                            className=" input-override"
                                            placeholder={t('common.eg-val', {
                                                val: strikePricePlaceholderVal,
                                            })}
                                            value={strikePrice}
                                            onChange={(e) => {
                                                Number(e.target.value) > 0
                                                    ? setIsStrikePriceValid(true)
                                                    : setIsStrikePriceValid(false);
                                                if (Number(e.target.value) > 0 && currencyKey) {
                                                    const currentPrice = get(exchangeRates, currencyKey.value, null);
                                                    if (currentPrice) {
                                                        const show =
                                                            currentPrice * 100 < Number(e.target.value) ||
                                                            currentPrice / 100 > Number(e.target.value);
                                                        setShowWarning(show);
                                                    }
                                                } else {
                                                    setShowWarning(false);
                                                }

                                                setStrikePrice(Number(e.target.value).toString());
                                            }}
                                            onBlur={() => {
                                                strikePrice
                                                    ? setIsStrikePriceValid(true)
                                                    : setIsStrikePriceValid(false);
                                            }}
                                            id="strike-price"
                                            type="number"
                                        />
                                        {!isStrikePriceValid && (
                                            <Error className="text-xxxs red">Please enter strike price.</Error>
                                        )}
                                        {showWarning && (
                                            <Error className="text-xxxs warning">
                                                Difference is greater than 100 times.
                                            </Error>
                                        )}
                                    </Field>
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Field style={{ marginTop: 50 }}>
                                        <Text className="text-ms pale-grey uppercase" style={{ margin: '5px 0' }}>
                                            {t('options.create-market.details.market-maturity-date-label')}
                                        </Text>
                                        <DatePicker
                                            id="maturity-date"
                                            dateFormat="MMM d, yyyy h:mm aa"
                                            minDate={new Date()}
                                            showTimeSelect={true}
                                            startDate={Today}
                                            selected={maturityDate}
                                            endDate={maturityDate}
                                            onChange={(d: Date) => setMaturityDate(d)}
                                        />
                                    </Field>
                                    <Field
                                        className={isAmountValid && userHasEnoughFunds ? '' : 'error'}
                                        style={{ position: 'relative' }}
                                    >
                                        <Text
                                            className="text-ms pale-grey uppercase text-error"
                                            style={{ margin: '10px 0' }}
                                        >
                                            {t('options.create-market.details.funding-amount.label')}
                                        </Text>
                                        <Text
                                            className="text-xxxs grey"
                                            style={{ margin: '6px 0px 8px', lineHeight: '16px' }}
                                        >
                                            {t('options.create-market.details.funding-amount.desc')}
                                        </Text>
                                        <SUSDSign className="susd">sUSD</SUSDSign>
                                        <FundingInput
                                            className="input-override"
                                            value={initialFundingAmount}
                                            onChange={(e) => {
                                                setInitialFundingAmount(parseInt(e.target.value, 10));
                                                parseInt(e.target.value) >= 1000
                                                    ? setIsAmountValid(true)
                                                    : setIsAmountValid(false);
                                            }}
                                            id="funding-amount"
                                            placeholder={t('common.eg-val', {
                                                val: `${USD_SIGN}1000.00 ${SYNTHS_MAP.sUSD}`,
                                            })}
                                            onBlur={() => {
                                                initialFundingAmount >= 1000
                                                    ? setIsAmountValid(true)
                                                    : setIsAmountValid(false);
                                            }}
                                            type="number"
                                        />
                                        {!isAmountValid && (
                                            <Error className="text-xxxs red">
                                                Please enter funding amount. MIn 1000.00 sUSD is required.
                                            </Error>
                                        )}
                                        {isAmountValid && !userHasEnoughFunds && (
                                            <Error className="text-xxxs red">
                                                Please ensure your wallet has sufficient sUSD.
                                            </Error>
                                        )}
                                    </Field>
                                </Form.Group>
                                {/* <Form.Group widths="equal">
                                    <Field>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text className="text-ms green" style={{ margin: '4px' }}>
                                                    {t('common.val-in-cents', { val: 0 })}
                                                </Text>
                                                <Text className="text-ms green" style={{ margin: '4px' }}>
                                                    {t('common.val-in-cents', { val: 100 })}
                                                </Text>
                                            </div>
                                            <LongSlider
                                                value={longPrice}
                                                step={0.01}
                                                max={1}
                                                min={0}
                                                onChange={(_, newValue) => {
                                                    const long = newValue as number;
                                                    setLongPrice(long);
                                                }}
                                            />
                                        </div>
                                    </Field>
                                    <Field>
                                        <Text
                                            className="text-ms pale-grey uppercase text-error"
                                            style={{ margin: '5px 0' }}
                                        >
                                            {t('options.create-market.details.strike-price-label')}
                                        </Text>
                                        <Input
                                            className=" input-override"
                                            value={longPrice}
                                            onChange={(e) => {
                                                setLongPrice(Number(e.target.value));
                                            }}
                                            id="long-price"
                                            type="number"
                                            step={0.01}
                                            max={1}
                                            min={0}
                                        />
                                    </Field>
                                    <Field>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text className="text-ms red" style={{ margin: '4px' }}>
                                                    {t('common.val-in-cents', { val: 0 })}
                                                </Text>
                                                <Text className="text-ms red" style={{ margin: '4px' }}>
                                                    {t('common.val-in-cents', { val: 100 })}
                                                </Text>
                                            </div>
                                            <ShortSlider
                                                value={shortPrice}
                                                max={1}
                                                min={0}
                                                onChange={(_, newValue) => {
                                                    const short = newValue as number;
                                                    setShortPrice(short);
                                                }}
                                            />
                                        </div>
                                    </Field>
                                </Form.Group> */}
                            </Form>
                        </FlexDivColumn>
                        <MarketSummary
                            currencyKey={currencyKey}
                            strikingPrice={parseFloat(strikePrice.toString()).toFixed(2)}
                            maturityDate={formattedMaturityDate}
                            initialFundingAmount={initialFundingAmount}
                            timeLeftToExercise={timeLeftToExercise}
                            marketFees={marketFees}
                        >
                            <div>
                                <NetworkFees gasLimit={gasLimit} />
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                                    {hasAllowance ? (
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
                                    ) : (
                                        <Button
                                            style={{ padding: '8px 24px' }}
                                            className="primary"
                                            disabled={isAllowing}
                                            onClick={handleAllowance}
                                        >
                                            {isAllowing
                                                ? t('options.create-market.summary.waiting-for-approval-button-label')
                                                : t('options.create-market.summary.approve-manager-button-label')}
                                        </Button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                                    {txErrorMessage && (
                                        <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />
                                    )}
                                </div>
                            </div>
                        </MarketSummary>
                    </FlexDiv>
                </FlexDivColumn>
            </MainWrapper>
        </Background>
    );
};
export default CreateMarket;
