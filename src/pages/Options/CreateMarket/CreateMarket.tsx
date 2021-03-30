import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ValueType } from 'react-select';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import add from 'date-fns/add';
import orderBy from 'lodash/orderBy';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark.svg';
import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';
import ROUTES from 'constants/routes';
import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP, FIAT_CURRENCY_MAP, CurrencyKey, USD_SIGN } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { formatPercentage } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { bytesFormatter, parseBytes32String, bigNumberFormatter } from 'utils/formatters/ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import DatePicker from 'components/Input/DatePicker';
import NetworkFees from '../components/NetworkFees';
import NewToBinaryOptions from '../components/NewToBinaryOptions';
import OptionSideIcon from '../Market/components/OptionSideIcon';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Grid, Header, Input, Segment, Divider, Message } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getCustomGasPrice, getGasSpeed } from 'redux/modules/wallet';
import { navigateToOptionsMarket } from 'utils/routes';
import Currency from 'components/Currency';
import Select from 'components/Select';
import MarketSentiment from '../components/MarketSentiment';
import { withStyles } from '@material-ui/core';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { ethers } from 'ethers';

const StyledSlider = withStyles({
    root: {
        color: '#10BA97',
        height: 10,
        padding: '0 0 2px 0',
    },
    thumb: {
        height: 18,
        width: 18,
        background: '#FFFFFF',
        boxShadow: '0px 1px 4px rgba(202, 202, 241, 0.5)',
        '&:focus, &:hover, &$active': {
            boxShadow: '0px 1px 4px rgba(202, 202, 241, 0.5)',
        },
    },
    track: {
        height: 10,
        borderRadius: 2,
    },
    rail: {
        height: 10,
        backgroundColor: '#D94454',
        opacity: 1,
        borderRadius: 2,
    },
})(Slider);

type CurrencyKeyOptionType = { value: CurrencyKey; label: string };

type MarketFees = Record<string, number>;

type TooltipIconProps = {
    title: React.ReactNode;
};

const TooltipIcon: React.FC<TooltipIconProps> = ({ title }) => (
    <Tooltip title={<span>{title}</span>} placement="top" arrow={true}>
        <QuestionMarkIcon width="12" height="12" />
    </Tooltip>
);

export const CreateMarket: React.FC = () => {
    const { t } = useTranslation();
    const { synthsMap: synths } = snxJSConnector;
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [currencyKey, setCurrencyKey] = useState<ValueType<CurrencyKeyOptionType, false>>();
    const [strikePrice, setStrikePrice] = useState<number | string>('');
    const [biddingEndDate, setEndOfBidding] = useState<Date | null | undefined>(null);
    const [maturityDate, setMaturityDate] = useState<Date | null | undefined>(null);
    const [initialLongShorts, setInitialLongShorts] = useState<{ long: number; short: number }>({
        long: 50,
        short: 50,
    });
    const [initialFundingAmount, setInitialFundingAmount] = useState<number | string>('');
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [isCreatingMarket, setIsCreatingMarket] = useState<boolean>(false);
    const [marketFees, setMarketFees] = useState<MarketFees | null>(null);
    const [withdrawalsEnabled, setWithdrawalsEnabled] = useState<boolean>(true);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

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
                    {
                        label: CRYPTO_CURRENCY_MAP.COMP,
                        value: CRYPTO_CURRENCY_MAP.COMP,
                    },
                    {
                        label: CRYPTO_CURRENCY_MAP.REN,
                        value: CRYPTO_CURRENCY_MAP.REN,
                    },
                    {
                        label: CRYPTO_CURRENCY_MAP.LEND,
                        value: CRYPTO_CURRENCY_MAP.LEND,
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
        currencyKey === null ||
        strikePrice === '' ||
        biddingEndDate === null ||
        maturityDate === null ||
        initialFundingAmount === '';

    const formatCreateMarketArguments = () => {
        const {
            utils: { parseEther },
        } = snxJSConnector.snxJS as any;
        const longBidAmount: number = (initialFundingAmount as number) * (initialLongShorts.long / 100);
        const shortBidAmount: number = (initialFundingAmount as number) * (initialLongShorts.short / 100);

        const oracleKey = bytesFormatter((currencyKey as CurrencyKeyOptionType).value);
        const price = parseEther(strikePrice.toString());
        const times = [
            Math.round((biddingEndDate as Date).getTime() / 1000),
            Math.round((maturityDate as Date).getTime() / 1000),
        ];
        const bids = [parseEther(longBidAmount.toString()), parseEther(shortBidAmount.toString())];
        return { oracleKey, price, times, bids };
    };

    useEffect(() => {
        const {
            contracts: { SynthsUSD, BinaryOptionMarketManager },
        } = snxJSConnector.snxJS as any;
        console.log(SynthsUSD);
        const getAllowanceForCurrentWallet = async () => {
            try {
                const [allowance, fees] = await Promise.all([
                    SynthsUSD.allowance(walletAddress, BinaryOptionMarketManager.address),
                    BinaryOptionMarketManager.fees(),
                ]);
                setAllowance(!!bigNumberFormatter(allowance));
                setMarketFees({
                    creator: fees.creatorFee / 1e18,
                    pool: fees.poolFee / 1e18,
                    refund: fees.refundFee / 1e18,
                    bidding: fees.creatorFee / 1e18 + fees.poolFee / 1e18,
                });
            } catch (e) {
                console.log(e);
            }
        };
        const setEventListeners = () => {
            SynthsUSD.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                if (owner === walletAddress && spender === BinaryOptionMarketManager.address) {
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
        const {
            contracts: { BinaryOptionMarketManager },
        } = snxJSConnector.snxJS as any;
        if (!isCreatingMarket) return;
        BinaryOptionMarketManager.on(
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
            BinaryOptionMarketManager.removeAllListeners(BINARY_OPTIONS_EVENTS.MARKET_CREATED);
        };
    }, [isCreatingMarket]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const {
                contracts: { BinaryOptionMarketManager },
            } = snxJSConnector.snxJS as any;
            try {
                const { oracleKey, price, times, bids } = formatCreateMarketArguments();
                const gasEstimate = await BinaryOptionMarketManager.estimateGas.createMarket(
                    oracleKey,
                    price,
                    withdrawalsEnabled,
                    times,
                    bids
                );
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [
        isButtonDisabled,
        currencyKey,
        strikePrice,
        biddingEndDate,
        maturityDate,
        initialFundingAmount,
        initialLongShorts,
    ]);

    const strikePricePlaceholderVal = `${USD_SIGN}10000.00 ${FIAT_CURRENCY_MAP.USD}`;

    const handleAllowance = async () => {
        if (gasPrice !== null) {
            const {
                contracts: { SynthsUSD, BinaryOptionMarketManager },
            } = snxJSConnector.snxJS as any;
            try {
                setIsAllowing(true);
                const gasEstimate = await SynthsUSD.estimateGas.approve(
                    BinaryOptionMarketManager.address,
                    ethers.constants.MaxUint256
                );
                await SynthsUSD.approve(BinaryOptionMarketManager.address, ethers.constants.MaxUint256, {
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
            const {
                contracts: { BinaryOptionMarketManager },
            } = snxJSConnector.snxJS as any;
            try {
                setTxErrorMessage(null);
                setIsCreatingMarket(true);
                const { oracleKey, price, times, bids } = formatCreateMarketArguments();
                await BinaryOptionMarketManager.createMarket(oracleKey, price, withdrawalsEnabled, times, bids, {
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

    const formattedBiddingEnd = biddingEndDate ? formatShortDate(biddingEndDate) : EMPTY_VALUE;
    const formattedMaturityDate = maturityDate ? formatShortDate(maturityDate) : EMPTY_VALUE;
    const timeLeftToExercise = maturityDate
        ? formatDuration(intervalToDuration({ start: maturityDate, end: add(maturityDate, { weeks: 26 }) }), {
              format: ['months'],
          })
        : EMPTY_VALUE;

    return (
        <div>
            <Grid>
                <Grid.Column width={11}>
                    <Container text>
                        <div style={{ textTransform: 'uppercase', marginTop: 10, marginBottom: 20 }}>
                            <Link to={ROUTES.Options.Home} className="item">
                                <ArrowBackIcon />
                                {t('options.create-market.back-to-markets')}
                            </Link>
                        </div>
                        <Container style={{ marginBottom: 30 }}>
                            <Header as="h1">{t('options.create-market.title')}</Header>
                            <p>{t('options.create-market.subtitle')}</p>
                            <NewToBinaryOptions />
                        </Container>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>{t('options.create-market.details.select-asset-label')}</label>
                                    <Select
                                        formatOptionLabel={(option: any) => (
                                            <Currency.Name
                                                currencyKey={option.value}
                                                name={option.label}
                                                showIcon={true}
                                                iconProps={{ type: 'asset' }}
                                            />
                                        )}
                                        options={assetsOptions}
                                        placeholder={t('common.eg-val', { val: CRYPTO_CURRENCY_MAP.BTC })}
                                        value={currencyKey}
                                        onChange={(option: any) => {
                                            setCurrencyKey(option);
                                        }}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>{t('options.create-market.details.strike-price-label')}</label>
                                    <Input
                                        fluid
                                        placeholder={t('common.eg-val', {
                                            val: strikePricePlaceholderVal,
                                        })}
                                        value={strikePrice}
                                        onChange={(e) => setStrikePrice(e.target.value)}
                                        id="strike-price"
                                        type="number"
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>{t('options.create-market.details.bidding-end-date-label')}</label>
                                    <DatePicker
                                        id="end-of-bidding"
                                        dateFormat="MMM d, yyyy h:mm aa"
                                        selected={biddingEndDate}
                                        showTimeSelect={true}
                                        onChange={(d: Date) => setEndOfBidding(d)}
                                        minDate={new Date()}
                                        maxDate={maturityDate}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>{t('options.create-market.details.market-maturity-date-label')}</label>
                                    <DatePicker
                                        disabled={!biddingEndDate}
                                        id="maturity-date"
                                        dateFormat="MMM d, yyyy h:mm aa"
                                        selected={maturityDate}
                                        showTimeSelect={true}
                                        onChange={(d: Date) => setMaturityDate(d)}
                                        minDate={biddingEndDate || null}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>{t('options.create-market.details.funding-amount.label')}</label>
                                    <div>
                                        <span>{t('options.create-market.details.funding-amount.desc')}</span>
                                    </div>
                                    <Input
                                        fluid
                                        value={initialFundingAmount}
                                        onChange={(e) => setInitialFundingAmount(e.target.value)}
                                        label={SYNTHS_MAP.sUSD}
                                        id="funding-amount"
                                        placeholder={t('common.eg-val', {
                                            val: `${USD_SIGN}1000.00 ${SYNTHS_MAP.sUSD}`,
                                        })}
                                        type="number"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>{t('options.create-market.details.long-short-skew-label')}</label>
                                    <div style={{ marginTop: 43 }}>
                                        <StyledSlider
                                            value={initialLongShorts.long}
                                            onChange={(_, newValue) => {
                                                const long = newValue as number;
                                                setInitialLongShorts({
                                                    long,
                                                    short: 100 - long,
                                                });
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <OptionSideIcon side="long" />{' '}
                                                {t('common.val-in-cents', { val: initialLongShorts.long })}
                                            </div>
                                            <div>
                                                {t('common.val-in-cents', { val: initialLongShorts.short })}{' '}
                                                <OptionSideIcon side="short" />
                                            </div>
                                        </div>
                                    </div>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Container>
                </Grid.Column>
                <Grid.Column width={5} style={{ paddingRight: 40, marginTop: 50 }}>
                    <Segment>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Header style={{ textTransform: 'uppercase' }}>
                                {t('options.create-market.summary.title')}
                            </Header>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center', fontSize: 18 }}>
                                    {currencyKey ? (
                                        <>
                                            <Currency.Name
                                                showIcon={true}
                                                currencyKey={(currencyKey as CurrencyKeyOptionType).value}
                                                name={(currencyKey as CurrencyKeyOptionType).label}
                                                iconProps={{ type: 'asset' }}
                                            />
                                            <span> &gt; </span>
                                            {`${USD_SIGN}${strikePrice !== '' ? strikePrice : 0} ${
                                                FIAT_CURRENCY_MAP.USD
                                            }`}
                                        </>
                                    ) : (
                                        EMPTY_VALUE
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', textTransform: 'capitalize' }}>
                                    {t('common.by-date', { date: formattedMaturityDate })}
                                </div>
                            </div>
                        </div>
                        <Divider />
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t('options.create-market.summary.dates.bidding-end')}</span>
                                <span>{formattedBiddingEnd}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t('options.create-market.summary.dates.maturity-date')}</span>
                                <span>{formattedMaturityDate}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t('options.create-market.summary.dates.time-to-exercise')}</span>
                                <span>{timeLeftToExercise}</span>
                            </div>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <MarketSentiment
                                long={initialLongShorts.long / 100}
                                short={initialLongShorts.short / 100}
                                display="col"
                            />
                        </div>
                        <Divider />
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t('options.create-market.summary.fees.bidding')}</span>
                                <span>{formatPercentage(marketFees ? marketFees.bidding : 0)}</span>
                            </div>
                            <div style={{ paddingLeft: 10, fontSize: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{t('options.create-market.summary.fees.creator')}</span>
                                    <span>{formatPercentage(marketFees ? marketFees.creator : 0)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{t('options.create-market.summary.fees.pool')}</span>
                                    <span>{formatPercentage(marketFees ? marketFees.pool : 0)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t('options.create-market.summary.fees.refund')}</span>
                                <span>{formatPercentage(marketFees ? marketFees.refund : 0)}</span>
                            </div>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase' }}>
                            <span>
                                {t('options.common.withdrawals')}{' '}
                                <TooltipIcon title={t('options.create-market.summary.withdrawals.tooltip')} />
                            </span>
                            <span>
                                <span
                                    style={{
                                        backgroundColor: withdrawalsEnabled ? '#795df5' : '#e8e7fd',
                                        color: withdrawalsEnabled ? 'white' : 'grey',
                                        padding: 2,
                                    }}
                                    onClick={() => setWithdrawalsEnabled(true)}
                                >
                                    {t('common.toggle.on')}
                                </span>
                                <span
                                    style={{
                                        backgroundColor: !withdrawalsEnabled ? '#795df5' : '#e8e7fd',
                                        color: !withdrawalsEnabled ? 'white' : 'grey',
                                        padding: 2,
                                    }}
                                    onClick={() => setWithdrawalsEnabled(false)}
                                >
                                    {t('common.toggle.off')}
                                </span>
                            </span>
                        </div>
                        <NetworkFees gasLimit={gasLimit} />
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                            {hasAllowance ? (
                                <Button
                                    primary
                                    disabled={isButtonDisabled || isCreatingMarket || !gasLimit}
                                    onClick={handleMarketCreation}
                                >
                                    {isCreatingMarket
                                        ? t('options.create-market.summary.creating-market-button-label')
                                        : t('options.create-market.summary.create-market-button-label')}
                                </Button>
                            ) : (
                                <Button primary disabled={isAllowing} onClick={handleAllowance}>
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
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    );
};
export default CreateMarket;
