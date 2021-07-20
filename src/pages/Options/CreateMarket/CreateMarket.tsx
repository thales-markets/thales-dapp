import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ValueType } from 'react-select';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import add from 'date-fns/add';
import orderBy from 'lodash/orderBy';
import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP, CurrencyKey, USD_SIGN } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { bytesFormatter, bigNumberFormatter, getAddress, parseBytes32String } from 'utils/formatters/ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import DatePicker from 'components/Input/DatePicker';
import NetworkFees from '../components/NetworkFees';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getCustomGasPrice, getGasSpeed, getNetworkId } from 'redux/modules/wallet';
import Currency from 'components/Currency';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { ethers } from 'ethers';
import {
    FlexDiv,
    FlexDivColumn,
    Background,
    MainWrapper,
    Text,
    Button,
    FlexDivRow,
    FlexDivColumnCentered,
} from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
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
} from '../Market/components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import NumericInput from '../Market/components/NumericInput';
import { CheckboxContainer } from '../Market/TradeOptions/MintOptions/MintOptions';
import { COLORS } from 'constants/ui';
import ROUTES from 'constants/routes';
import Checkbox from 'components/Checkbox';
import ProgressTracker from './ProgressTracker';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { toBigNumber } from 'utils/formatters/number';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { get0xBaseURL } from 'utils/0x';
import { LimitOrder, SignatureType } from '@0x/protocol-utils';
import { generatePseudoRandomSalt, NULL_ADDRESS } from '@0x/order-utils';
import axios from 'axios';
import { refetchOrderbook } from 'utils/queryConnector';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { OptionsMarketInfo } from 'types/options';
import { navigateToOptionsMarket } from 'utils/routes';
import { getIsAppReady } from 'redux/modules/app';
import ValidationMessage from 'components/ValidationMessage';

const MIN_FUNDING_AMOUNT_ROPSTEN = 100;
const MIN_FUNDING_AMOUNT_MAINNET = 1000;

const roundMinutes = (date: Date) => {
    date.setUTCHours(12, 0, 0, 0);
    return date;
};

const Today: Date = new Date();

const datePickerMinDate: Date = new Date();

const datePickerMaxDate: Date = new Date();

datePickerMaxDate.setFullYear(datePickerMaxDate.getFullYear() + 2);

export type CurrencyKeyOptionType = { value: CurrencyKey; label: string };

export type MarketFees = Record<string, number>;

export const CreateMarket: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [longPrice, setLongPrice] = useState<number | string>(1);
    const [shortPrice, setShortPrice] = useState<number | string>(1);
    const [longAmount, setLongAmount] = useState<number | string>('');
    const [shortAmount, setShortAmount] = useState<number | string>('');
    const [sellLong, setSellLong] = useState<boolean>(false);
    const [sellShort, setSellShort] = useState<boolean>(false);
    const contractAddresses0x = getContractAddressesForChainOrThrow(networkId);

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
    const [isMarketCreated, setIsMarketCreated] = useState(false);
    const [market, setMarket] = useState<string>('');
    const [longAddress, setLong] = useState('');
    const [shortAddress, setShort] = useState('');
    const [hasLongAllowance, setLongAllowance] = useState<boolean>(false);
    const [isLongAllowing, setIsLongAllowing] = useState<boolean>(false);
    const [isLongSubmitting, setIsLongSubmitting] = useState<boolean>(false);
    const [isLongSubmitted, setIsLongSubmitted] = useState<boolean>(false);
    const [hasShortAllowance, setShortAllowance] = useState<boolean>(false);
    const [isShortAllowing, setIsShortAllowing] = useState<boolean>(false);
    const [isShortSubmitting, setIsShortSubmitting] = useState<boolean>(false);
    const [isShortSubmitted, setIsShortSubmitted] = useState<boolean>(false);
    const [isLongAmountValid, setIsLongAmountValid] = useState<boolean>(true);
    const [isShortAmountValid, setIsShortAmountValid] = useState<boolean>(true);
    const [isLongPriceValid, setIsLongPriceValid] = useState<boolean>(true);
    const [isShortPriceValid, setIsShortPriceValid] = useState<boolean>(true);
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const addressToApprove: string = contractAddresses0x.exchangeProxy;

    const marketQuery = useBinaryOptionsMarketQuery(market, {
        enabled: isMarketCreated,
    });

    const optionsMarket: OptionsMarketInfo | null = marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

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
                    ...Object.values(synths)
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
        !hasAllowance ||
        currencyKey === null ||
        strikePrice === '' ||
        maturityDate === null ||
        initialFundingAmount === '';

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

    const getOrderEndDate = () => toBigNumber(Math.round((optionsMarket as any)?.timeRemaining / 1000));

    useEffect(() => {
        if (!isCreatingMarket) return;
        const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
        binaryOptionsMarketManagerContract.on(
            BINARY_OPTIONS_EVENTS.MARKET_CREATED,
            (
                market: string,
                creator: string,
                oracleKey: string,
                _strikePrice: string,
                _maturityDate: string,
                _expiryDate: string,
                long: string,
                short: string
            ) => {
                if (
                    creator === walletAddress &&
                    parseBytes32String(oracleKey) === (currencyKey as CurrencyKeyOptionType).value
                ) {
                    setMarket(market);
                    setLong(long);
                    setShort(short);
                    setIsMarketCreated(true);
                    setIsCreatingMarket(false);
                    if (!sellLong && !sellShort) {
                        navigateToOptionsMarket(market);
                    }

                    if (sellLong) {
                        const erc20Instance = new ethers.Contract(long, erc20Contract.abi, snxJSConnector.signer);
                        const getAllowance = async () => {
                            try {
                                const allowance = await erc20Instance.allowance(walletAddress, addressToApprove);
                                setLongAllowance(!!bigNumberFormatter(allowance));
                            } catch (e) {
                                console.log(e);
                            }
                        };

                        const registerAllowanceListener = () => {
                            erc20Instance.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                                if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                                    setLongAllowance(true);
                                    setIsLongAllowing(false);
                                }
                            });
                        };
                        getAllowance();
                        registerAllowanceListener();
                    }

                    if (sellShort) {
                        const erc20Instance = new ethers.Contract(short, erc20Contract.abi, snxJSConnector.signer);

                        const getAllowance = async () => {
                            try {
                                const allowance = await erc20Instance.allowance(walletAddress, addressToApprove);
                                setShortAllowance(!!bigNumberFormatter(allowance));
                            } catch (e) {
                                console.log(e);
                            }
                        };

                        const registerAllowanceListener = () => {
                            erc20Instance.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                                if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                                    setShortAllowance(true);
                                    setIsShortAllowing(false);
                                }
                            });
                        };
                        getAllowance();
                        registerAllowanceListener();
                    }
                }
            }
        );
        return () => {
            binaryOptionsMarketManagerContract.removeAllListeners(BINARY_OPTIONS_EVENTS.MARKET_CREATED);
        };
    }, [isCreatingMarket]);

    useEffect(() => {
        const { binaryOptionsMarketManagerContract } = snxJSConnector as any;
        try {
            const { oracleKey, price, maturity, initialMint } = formatCreateMarketArguments();
            const BOMMContractWithSigner = binaryOptionsMarketManagerContract.connect((snxJSConnector as any).signer);
            BOMMContractWithSigner.estimateGas
                .createMarket(oracleKey, price, maturity, initialMint, false, "")
                .then((gasEstimate: any) => {
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                    setUserHasEnoughFunds(true);
                })
                .catch((e: any) => {
                    if (e.data?.originalError.code === 3) {
                        setUserHasEnoughFunds(false);
                    }
                    setGasLimit(null);
                });
        } catch (e) {}
    }, [isButtonDisabled, currencyKey, strikePrice, maturityDate, initialFundingAmount]);

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
                await BOMMContractWithSigner.createMarket(oracleKey, price, maturity, initialMint, false, "", {
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

    const handleLongAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(longAddress, erc20Contract.abi, snxJSConnector.signer);
            try {
                setIsLongAllowing(true);
                const gasEstimate = await erc20Instance.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                await erc20Instance.approve(addressToApprove, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setIsLongAllowing(false);
            }
        }
    };

    const handleShortAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(shortAddress, erc20Contract.abi, snxJSConnector.signer);
            try {
                setIsShortAllowing(true);
                const gasEstimate = await erc20Instance.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                await erc20Instance.approve(addressToApprove, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setIsShortAllowing(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (!hasAllowance) {
            return (
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
        if (sellLong && !hasLongAllowance) {
            return (
                <Button
                    style={{ padding: '8px 24px' }}
                    className="primary"
                    disabled={isLongAllowing}
                    onClick={handleLongAllowance}
                >
                    {!isLongAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sLONG })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sLONG,
                          })}
                </Button>
            );
        }

        if (sellShort && !hasShortAllowance) {
            return (
                <Button
                    style={{ padding: '8px 24px' }}
                    className="primary"
                    disabled={isShortAllowing}
                    onClick={handleShortAllowance}
                >
                    {!isShortAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sSHORT })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sSHORT,
                          })}
                </Button>
            );
        }
        if (sellLong && hasLongAllowance && !isLongSubmitted) {
            return (
                <Button
                    style={{ padding: '8px 24px' }}
                    className="primary"
                    disabled={!isLongAmountValid || isLongSubmitting || isLongSubmitted}
                    onClick={handleSubmitOrder.bind(this, longPrice, longAddress, longAmount, true)}
                >
                    {!isLongSubmitting
                        ? t(`options.market.trade-options.place-order.confirm-button.long`)
                        : t(`options.market.trade-options.place-order.confirm-button.progress-label`)}
                </Button>
            );
        }

        if (sellShort && hasShortAllowance && !isShortSubmitted) {
            return (
                <Button
                    style={{ padding: '8px 24px' }}
                    className="primary"
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
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        setTxErrorMessage(null);
        isLong ? setIsLongSubmitting(true) : setIsShortSubmitting(true);

        const baseUrl = get0xBaseURL(networkId);
        const placeOrderUrl = `${baseUrl}sra/v4/order`;

        const makerAmount = Web3Wrapper.toBaseUnitAmount(toBigNumber(optionsAmount), DEFAULT_TOKEN_DECIMALS);
        const takerAmount = Web3Wrapper.toBaseUnitAmount(
            toBigNumber(Number(optionsAmount) * Number(price)),
            DEFAULT_TOKEN_DECIMALS
        );
        const expiry = getOrderEndDate();
        const salt = generatePseudoRandomSalt();

        try {
            const createSignedOrderV4Async = async () => {
                const order = new LimitOrder({
                    makerToken,
                    takerToken: SynthsUSD.address,
                    makerAmount,
                    takerAmount,
                    maker: walletAddress,
                    sender: NULL_ADDRESS,
                    expiry,
                    salt,
                    chainId: networkId,
                    verifyingContract: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
                });

                try {
                    const signature = await order.getSignatureWithProviderAsync(
                        (snxJSConnector.signer?.provider as any).provider,
                        SignatureType.EIP712
                    );
                    return { ...order, signature };
                } catch (e) {
                    console.log(e);
                }
            };

            const signedOrder = await createSignedOrderV4Async();

            try {
                await axios({
                    method: 'POST',
                    url: placeOrderUrl,
                    data: signedOrder,
                });
                isLong ? setIsLongSubmitted(true) : setIsShortSubmitted(true);

                refetchOrderbook(makerToken);
                if (isLong && !sellShort) {
                    navigateToOptionsMarket(market);
                    return;
                }
                if (!isLong) {
                    navigateToOptionsMarket(market);
                    return;
                }
            } catch (err) {
                console.error(JSON.stringify(err.response.data));
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                isLong ? setIsLongSubmitting(false) : setIsShortSubmitting(false);
            }
            isLong ? setIsLongSubmitting(false) : setIsShortSubmitting(false);
        } catch (e) {
            console.error(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            isLong ? setIsLongSubmitting(false) : setIsShortSubmitting(false);
        }
    };

    const formattedMaturityDate = maturityDate ? formatShortDate(maturityDate) : EMPTY_VALUE;
    const timeLeftToExercise = maturityDate
        ? formatDuration(intervalToDuration({ start: maturityDate, end: add(maturityDate, { months: 6 }) }), {
              format: ['months'],
          })
        : EMPTY_VALUE;

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <MainWrapper>
                <FlexDivColumn>
                    <MarketHeader route={ROUTES.Options.CreateMarket} />
                    <Text className="create-market" style={{ padding: '50px 100px 0' }}>
                        {t('options.create-market.title')}
                    </Text>

                    <FlexDiv style={{ padding: '50px 100px' }}>
                        <FlexDivColumn style={{ flex: 1 }}>
                            <Text className="text-s pale-grey lh24" style={{ margin: '0px 2px' }}>
                                {t('options.create-market.subtitle')}
                            </Text>
                            <Text className="text-s pale-grey lh24" style={{ margin: '30px 2px' }}>
                                {t('options.create-market.note')}
                            </Text>
                            <InputsWrapper>
                                <FlexDivRow>
                                    <ShortInputContainer style={{ marginBottom: 40, zIndex: 4 }}>
                                        <ReactSelect
                                            className={!isCurrencyKeyValid ? 'error' : ''}
                                            filterOption={(option: any, rawInput: any) =>
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
                                                        synthIconStyle={{ width: 24, height: 24 }}
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
                                            }}
                                        />
                                        <InputLabel style={{ zIndex: 100 }}>
                                            {t('options.create-market.details.select-asset-label')}
                                        </InputLabel>
                                        <ErrorMessage show={!isCurrencyKeyValid} text="Please select asset." />
                                    </ShortInputContainer>
                                    <ShortInputContainer style={{ marginBottom: 40 }}>
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
                                            type="number"
                                        />
                                        <InputLabel>{t('options.create-market.details.strike-price-label')}</InputLabel>
                                        <CurrencyLabel>{USD_SIGN}</CurrencyLabel>
                                        <ErrorMessage
                                            show={!isStrikePriceValid}
                                            text="Please enter strike price."
                                        ></ErrorMessage>

                                        {showWarning && (
                                            <Error className="text-xxxs warning">
                                                Difference is greater than 100 times.
                                            </Error>
                                        )}
                                    </ShortInputContainer>
                                </FlexDivRow>
                                <FlexDivRow>
                                    <FlexDivRow style={{ width: '50%', marginRight: 10 }}>
                                        <ShortInputContainer style={{ marginBottom: 40, flex: 3 }}>
                                            <DatePicker
                                                className="maturity-date"
                                                dateFormat="MMM d, yyyy"
                                                minDate={datePickerMinDate}
                                                maxDate={datePickerMaxDate}
                                                startDate={Today}
                                                selected={maturityDate}
                                                endDate={maturityDate}
                                                onChange={(d: Date) => setMaturityDate(d)}
                                            />
                                            <InputLabel>
                                                {t('options.create-market.details.market-maturity-date-label')}
                                            </InputLabel>
                                        </ShortInputContainer>
                                        <ShortInputContainer style={{ marginBottom: 40, flex: 1, minWidth: 90 }}>
                                            <DatePicker
                                                className="maturity-date"
                                                dateFormat="h:mm aa"
                                                showTimeSelectOnly={true}
                                                showTimeSelect={true}
                                                selected={convertUTCToLocalDate(maturityDate)}
                                                onChange={(d: Date) => setMaturityDate(convertLocalToUTCDate(d))}
                                            />
                                            <InputLabel>
                                                {t('options.create-market.details.market-maturity-time-label')}
                                            </InputLabel>
                                        </ShortInputContainer>
                                    </FlexDivRow>

                                    <ShortInputContainer
                                        className={isAmountValid && userHasEnoughFunds ? '' : 'error'}
                                        style={{ position: 'relative', marginBottom: 40 }}
                                    >
                                        <Input
                                            className={!isAmountValid || !userHasEnoughFunds ? 'error' : ''}
                                            value={initialFundingAmount}
                                            onChange={(e) => {
                                                setInitialFundingAmount(parseInt(e.target.value, 10));
                                                setLongAmount(parseInt(e.target.value, 10));
                                                setShortAmount(parseInt(e.target.value, 10));
                                                parseInt(e.target.value) >=
                                                (networkId === 1
                                                    ? MIN_FUNDING_AMOUNT_MAINNET
                                                    : MIN_FUNDING_AMOUNT_ROPSTEN)
                                                    ? setIsAmountValid(true)
                                                    : setIsAmountValid(false);
                                            }}
                                            id="funding-amount"
                                            onBlur={() => {
                                                initialFundingAmount >=
                                                (networkId === 1
                                                    ? MIN_FUNDING_AMOUNT_MAINNET
                                                    : MIN_FUNDING_AMOUNT_ROPSTEN)
                                                    ? setIsAmountValid(true)
                                                    : setIsAmountValid(false);
                                            }}
                                            type="number"
                                        />
                                        <InputLabel>
                                            {t('options.create-market.details.funding-amount.label')}
                                        </InputLabel>
                                        <CurrencyLabel>{SYNTHS_MAP.sUSD}</CurrencyLabel>
                                        <Text
                                            className="text-xxxs grey"
                                            style={{
                                                margin: '4px 0 6px 6px',
                                                lineHeight: '16px',
                                                position: 'absolute',
                                                bottom: -40,
                                            }}
                                        >
                                            {t('options.create-market.details.funding-amount.desc')}
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
                                <Text className="text-xxxs pale-grey bold ls1 uppercase">
                                    {t('options.create-market.sellOptions')}
                                </Text>
                                <FlexDiv>
                                    <CheckboxContainer>
                                        <Checkbox
                                            disabled={!initialFundingAmount || !isAmountValid}
                                            checked={sellLong}
                                            value={sellLong.toString()}
                                            onChange={(e: any) => setSellLong(e.target.checked || false)}
                                        />
                                    </CheckboxContainer>
                                    <SliderContainer>
                                        <LongSlider
                                            value={Number(longPrice)}
                                            step={0.01}
                                            max={1}
                                            min={0}
                                            onChange={(_, value) => setLongPrice(Number(value))}
                                            disabled={!sellLong}
                                        />
                                        <FlexDivRow>
                                            <SliderRange color={COLORS.LONG}>{`${USD_SIGN}0`}</SliderRange>
                                            <SliderRange color={COLORS.LONG}>{`${USD_SIGN}1`}</SliderRange>
                                        </FlexDivRow>
                                    </SliderContainer>
                                    <DoubleShortInputContainer>
                                        <NumericInput
                                            value={longPrice}
                                            onChange={(_, value) => setLongPrice(value)}
                                            disabled={!sellLong}
                                            className={isLongPriceValid ? '' : 'error'}
                                            step="0.01"
                                        />
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.price-label')}
                                        </InputLabel>
                                        <CurrencyLabel className={!sellLong ? 'disabled' : ''}>
                                            {SYNTHS_MAP.sUSD}
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
                                    <DoubleShortInputContainer>
                                        <NumericInput
                                            value={longAmount}
                                            onChange={(_, value) => setLongAmount(value)}
                                            disabled={!sellLong}
                                            className={isLongAmountValid ? '' : 'error'}
                                        />
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.amount-label', {
                                                orderSide: 'sell',
                                            })}
                                        </InputLabel>
                                        <CurrencyLabel className={!sellLong ? 'disabled' : ''}>
                                            {SYNTHS_MAP.sLONG}
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
                                </FlexDiv>
                                <FlexDiv>
                                    <CheckboxContainer>
                                        <Checkbox
                                            disabled={!initialFundingAmount || !isAmountValid}
                                            checked={sellShort}
                                            value={sellShort.toString()}
                                            onChange={(e: any) => setSellShort(e.target.checked || false)}
                                        />
                                    </CheckboxContainer>
                                    <SliderContainer>
                                        <ShortSlider
                                            value={Number(shortPrice)}
                                            step={0.01}
                                            max={1}
                                            min={0}
                                            onChange={(_, value) => setShortPrice(Number(value))}
                                            disabled={!sellShort}
                                        />
                                        <FlexDivRow>
                                            <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}0`}</SliderRange>
                                            <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}1`}</SliderRange>
                                        </FlexDivRow>
                                    </SliderContainer>
                                    <DoubleShortInputContainer>
                                        <NumericInput
                                            value={shortPrice}
                                            onChange={(_, value) => setShortPrice(value)}
                                            disabled={!sellShort}
                                            className={isShortPriceValid ? '' : 'error'}
                                            step="0.01"
                                        />
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.price-label')}
                                        </InputLabel>
                                        <CurrencyLabel className={!sellShort ? 'disabled' : ''}>
                                            {SYNTHS_MAP.sUSD}
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
                                    <DoubleShortInputContainer>
                                        <NumericInput
                                            value={shortAmount}
                                            onChange={(_, value) => setShortAmount(value)}
                                            disabled={!sellShort}
                                            className={isShortAmountValid ? '' : 'error'}
                                        />
                                        <InputLabel>
                                            {t('options.market.trade-options.place-order.amount-label', {
                                                orderSide: 'sell',
                                            })}
                                        </InputLabel>
                                        <CurrencyLabel className={!sellShort ? 'disabled' : ''}>
                                            {SYNTHS_MAP.sSHORT}
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
                                </FlexDiv>
                                <NetworkFees gasLimit={gasLimit} />
                            </InputsWrapper>
                        </FlexDivColumn>
                        <MarketSummary
                            currencyKey={currencyKey}
                            strikingPrice={strikePrice}
                            maturityDate={formattedMaturityDate}
                            initialFundingAmount={initialFundingAmount}
                            timeLeftToExercise={timeLeftToExercise}
                            marketFees={marketFees}
                            currentPrice={currencyKey ? get(exchangeRates, currencyKey.value, 0) : undefined}
                        ></MarketSummary>
                    </FlexDiv>
                    <FlexDivColumnCentered style={{ alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                            {getSubmitButton()}
                        </div>
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                    </FlexDivColumnCentered>
                    <ProgressTracker
                        isWalletAccessEnabled={hasAllowance}
                        isAllowing={isAllowing}
                        isMarketCreated={isMarketCreated}
                        isCreating={isCreatingMarket}
                        isLongApproved={hasLongAllowance}
                        isLongAllowing={isLongAllowing}
                        isShortApproved={hasShortAllowance}
                        isShortAllowing={isShortAllowing}
                        isLongSubmitted={isLongSubmitted}
                        isLongSubmitting={isLongSubmitting}
                        isShortSubmitted={isShortSubmitted}
                        isShortSubmitting={isShortSubmitting}
                        showLongProcess={sellLong}
                        showShortProcess={sellShort}
                    ></ProgressTracker>
                </FlexDivColumn>
            </MainWrapper>
        </Background>
    );
};

export default CreateMarket;
