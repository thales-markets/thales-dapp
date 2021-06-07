import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Checkbox, Message } from 'semantic-ui-react';
import { getCurrencyKeyBalance } from 'utils/balances';
import snxJSConnector from 'utils/snxJSConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { ethers } from 'ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import NetworkFees from 'pages/Options/components/NetworkFees';
import {
    Container,
    InputContainer,
    GridContainer,
    InputLabel,
    SubmitButtonContainer,
    Input,
    CurrencyLabel,
    SubmitButton,
    TotalContainer,
    TotalLabel,
    Total,
} from 'pages/Options/Market/components';
import styled from 'styled-components';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import { refetchMarketQueries, refetchOrderbook } from 'utils/queryConnector';
import { useBOMContractContext } from '../../contexts/BOMContractContext';
import { MarketFees } from 'pages/Options/CreateMarket/CreateMarket';
import { formatCurrency, formatCurrencyWithSign, formatPercentage, toBigNumber } from 'utils/formatters/number';
import { LongSlider, ShortSlider } from 'pages/Options/CreateMarket/components';
import { FlexDivCentered, FlexDivRow } from 'theme/common';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import erc20Contract from 'utils/contracts/erc20Contract';
import { get0xBaseURL } from 'utils/0x';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { generatePseudoRandomSalt, NULL_ADDRESS } from '@0x/order-utils';
import { LimitOrder, SignatureType } from '@0x/protocol-utils';
import axios from 'axios';
import { SIDE } from 'constants/options';
import { COLORS } from 'constants/ui';

const MintOptions: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const BOMContract = useBOMContractContext();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [amount, setAmount] = useState<number | string>('');
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [marketFees, setMarketFees] = useState<MarketFees | null>(null);
    const [longPrice, setLongPrice] = useState<number>(1);
    const [shortPrice, setShortPrice] = useState<number>(1);
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
    const contractAddresses0x = getContractAddressesForChainOrThrow(networkId);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

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

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = Number(amount) > sUSDBalance || !sUSDBalance;
    const isButtonDisabled = !isAmountEntered || isMinting || !isWalletConnected || !sUSDBalance || insufficientBalance;

    const addressToApprove: string = contractAddresses0x.exchangeProxy;

    useEffect(() => {
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        const { binaryOptionsMarketManagerContract } = snxJSConnector;

        const getAllowance = async () => {
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
        const registerAllowanceListener = () => {
            if (walletAddress) {
                SynthsUSD.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                    console.log(owner, walletAddress, spender, binaryOptionsMarketManagerContract.address);
                    if (owner === walletAddress && spender === binaryOptionsMarketManagerContract.address) {
                        setAllowance(true);
                        setIsAllowing(false);
                    }
                });
            }
        };

        if (isWalletConnected) {
            getAllowance();
            registerAllowanceListener();
        }
        return () => {
            if (walletAddress) {
                SynthsUSD.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
            }
        };
    }, [walletAddress]);

    useEffect(() => {
        if (walletAddress) {
            BOMContract.on(BINARY_OPTIONS_EVENTS.OPTIONS_MINTED, async (side: number, account: string) => {
                if (walletAddress === account) {
                    if (SIDE[side] === 'long' && sellLong) {
                        await handleSubmitOrder(longPrice, optionsMarket.longAddress, longAmount, true);
                    }
                    if (SIDE[side] === 'short' && sellShort) {
                        await handleSubmitOrder(shortPrice, optionsMarket.shortAddress, shortAmount, false);
                    }
                    setIsMinting(false);
                }
                refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
            });
        }
        return () => {
            if (walletAddress) {
                BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.OPTIONS_MINTED);
            }
        };
    }, [walletAddress, sellLong, sellLong, longPrice, shortPrice, longAmount, shortAmount]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const mintAmount = ethers.utils.parseEther(amount.toString());
            try {
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await BOMContractWithSigner.estimateGas.mint(mintAmount);
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isWalletConnected, amount]);

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
    const handleMint = async () => {
        if (gasPrice !== null) {
            try {
                console.log('before', sellLong, sellShort);
                setTxErrorMessage(null);
                setIsMinting(true);
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const mintAmount = ethers.utils.parseEther(amount.toString());
                const tx = (await BOMContractWithSigner.mint(mintAmount, {
                    gasPrice: gasPriceInWei(gasPrice),
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
                            amount: amount,
                            side: 'long',
                        },
                    })
                );

                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    dispatch(
                        updateOptionsPendingTransactionStatus({
                            hash: txResult.transactionHash,
                            status: 'confirmed',
                        })
                    );
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsMinting(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (!isAmountEntered) {
            return <MintSubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</MintSubmitButton>;
        }
        if (insufficientBalance) {
            return <MintSubmitButton disabled={true}>{t(`common.errors.insufficient-balance`)}</MintSubmitButton>;
        }
        if (!hasAllowance) {
            return (
                <MintSubmitButton disabled={isAllowing || !isWalletConnected} onClick={handleAllowance}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.label')
                        : t('common.enable-wallet-access.progress-label')}
                </MintSubmitButton>
            );
        }
        if (!hasLongAllowance && sellLong) {
            return (
                <MintSubmitButton disabled={isLongAllowing || !isWalletConnected} onClick={handleLongAllowance}>
                    {!isLongAllowing
                        ? t(`options.market.trade-options.mint.approve-long-button.label`)
                        : t(`options.market.trade-options.mint.approve-long-button.progress-label`)}
                </MintSubmitButton>
            );
        }
        if (!hasShortAllowance && sellShort) {
            return (
                <MintSubmitButton disabled={isShortAllowing || !isWalletConnected} onClick={handleShortAllowance}>
                    {!isShortAllowing
                        ? t(`options.market.trade-options.mint.approve-short-button.label`)
                        : t(`options.market.trade-options.mint.approve-short-button.progress-label`)}
                </MintSubmitButton>
            );
        }
        if (isLongSubmitting) {
            return (
                <MintSubmitButton disabled={true}>
                    {t(`options.market.trade-options.mint.confirm-button.submit-long-progress-label`)}
                </MintSubmitButton>
            );
        }
        if (isShortSubmitting) {
            return (
                <MintSubmitButton disabled={true}>
                    {t(`options.market.trade-options.mint.confirm-button.submit-short-progress-label`)}
                </MintSubmitButton>
            );
        }
        return (
            <MintSubmitButton disabled={isButtonDisabled} onClick={handleMint}>
                {!isMinting
                    ? t(`options.market.trade-options.mint.confirm-button.label`)
                    : t(`options.market.trade-options.mint.confirm-button.progress-label`)}
            </MintSubmitButton>
        );
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(optionsMarket.longAddress, erc20Contract.abi, snxJSConnector.signer);
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
        if (isWalletConnected && sellLong) {
            getAllowance();
            registerAllowanceListener();
        }
        return () => {
            erc20Instance.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [walletAddress, isWalletConnected, sellLong]);

    const handleLongAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(
                optionsMarket.longAddress,
                erc20Contract.abi,
                snxJSConnector.signer
            );
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

    useEffect(() => {
        const erc20Instance = new ethers.Contract(optionsMarket.shortAddress, erc20Contract.abi, snxJSConnector.signer);
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
        if (isWalletConnected && sellShort) {
            getAllowance();
            registerAllowanceListener();
        }
        return () => {
            erc20Instance.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [walletAddress, isWalletConnected, sellShort]);

    const handleShortAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(
                optionsMarket.shortAddress,
                erc20Contract.abi,
                snxJSConnector.signer
            );
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

    const getOrderEndDate = () => toBigNumber(Math.round(optionsMarket.timeRemaining / 1000));

    const handleSubmitOrder = async (
        price: number,
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
                refetchOrderbook(makerToken);
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

    useEffect(() => {
        const amountMinted = marketFees ? Number(amount) - Number(amount) * (marketFees.creator + marketFees.pool) : 0;
        setLongAmount(amountMinted);
        setShortAmount(amountMinted);
    }, [amount, marketFees]);

    return (
        <Container>
            <GridContainer>
                <InputContainer>
                    <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                    />
                    <InputLabel>{t('options.market.trade-options.mint.amount-label')}</InputLabel>
                    <CurrencyLabel>{SYNTHS_MAP.sUSD}</CurrencyLabel>
                </InputContainer>
            </GridContainer>
            <MintingFeesContainer>
                <TotalLabel>{t('options.market.trade-options.mint.minting-label')}</TotalLabel>
            </MintingFeesContainer>
            <MintingFeesInnerContainer>
                <MintingTotalLabel color={COLORS.LONG}>
                    {t('options.market.trade-options.mint.long-label')}
                </MintingTotalLabel>
                <MintingTotal color={COLORS.LONG}>
                    {formatCurrency(
                        marketFees ? Number(amount) - Number(amount) * (marketFees.creator + marketFees.pool) : 0
                    )}
                </MintingTotal>
            </MintingFeesInnerContainer>
            <MintingFeesInnerContainer>
                <MintingTotalLabel color={COLORS.SHORT}>
                    {t('options.market.trade-options.mint.short-label')}
                </MintingTotalLabel>
                <MintingTotal color={COLORS.SHORT}>
                    {formatCurrency(
                        marketFees ? Number(amount) - Number(amount) * (marketFees.creator + marketFees.pool) : 0
                    )}
                </MintingTotal>
            </MintingFeesInnerContainer>

            <Divider />

            <PlaceInOrderbook>{t('options.market.trade-options.mint.sell-options-title')}</PlaceInOrderbook>
            <FlexDivCentered>
                <Checkbox
                    checked={sellLong}
                    value={sellLong.toString()}
                    onChange={(_, data) => setSellLong(data.checked || false)}
                    style={{ marginBottom: 20 }}
                />
                <SliderContainer>
                    <LongSlider
                        value={longPrice}
                        step={0.01}
                        max={1}
                        min={0}
                        onChange={(_, newValue) => {
                            const long = newValue as number;
                            setLongPrice(long);
                        }}
                        disabled={!sellLong}
                    />
                    <FlexDivRow>
                        <SliderRange color={COLORS.LONG}>{`${USD_SIGN}0`}</SliderRange>
                        <SliderRange color={COLORS.LONG}>{`${USD_SIGN}1`}</SliderRange>
                    </FlexDivRow>
                </SliderContainer>
                <InputContainer style={{ width: '25%', marginRight: 10 }}>
                    <Input
                        value={longPrice}
                        onChange={(e) => setLongPrice(Number(e.target.value))}
                        type="number"
                        min="0"
                        step="any"
                        disabled={!sellLong}
                    />
                    <InputLabel>{t('options.market.trade-options.place-order.price-label')}</InputLabel>
                    <CurrencyLabel className={!sellLong ? 'disabled' : ''}>{SYNTHS_MAP.sUSD}</CurrencyLabel>
                </InputContainer>
                <InputContainer style={{ width: '25%' }}>
                    <Input
                        value={longAmount}
                        onChange={(e) => setLongAmount(e.target.value)}
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                        disabled={!sellLong}
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide: 'sell' })}
                    </InputLabel>
                    <CurrencyLabel className={!sellLong ? 'disabled' : ''}>{'sLONG'}</CurrencyLabel>
                </InputContainer>
            </FlexDivCentered>
            <FlexDivCentered>
                <Checkbox
                    checked={sellShort}
                    value={sellShort.toString()}
                    onChange={(_, data) => setSellShort(data.checked || false)}
                    style={{ marginBottom: 20 }}
                />
                <SliderContainer>
                    <ShortSlider
                        value={shortPrice}
                        step={0.01}
                        max={1}
                        min={0}
                        onChange={(_, newValue) => {
                            const short = newValue as number;
                            setShortPrice(short);
                        }}
                        disabled={!sellShort}
                    />
                    <FlexDivRow>
                        <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}0`}</SliderRange>
                        <SliderRange color={COLORS.SHORT}>{`${USD_SIGN}1`}</SliderRange>
                    </FlexDivRow>
                </SliderContainer>
                <InputContainer style={{ width: '25%', marginRight: 10 }}>
                    <Input
                        value={shortPrice}
                        onChange={(e) => setShortPrice(Number(e.target.value))}
                        type="number"
                        min="0"
                        step="any"
                        disabled={!sellShort}
                    />
                    <InputLabel>{t('options.market.trade-options.place-order.price-label')}</InputLabel>
                    <CurrencyLabel className={!sellShort ? 'disabled' : ''}>{SYNTHS_MAP.sUSD}</CurrencyLabel>
                </InputContainer>
                <InputContainer style={{ width: '25%' }}>
                    <Input
                        value={shortAmount}
                        onChange={(e) => setShortAmount(e.target.value)}
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                        disabled={!sellShort}
                    />
                    <InputLabel>
                        {t('options.market.trade-options.place-order.amount-label', { orderSide: 'sell' })}
                    </InputLabel>
                    <CurrencyLabel className={!sellShort ? 'disabled' : ''}>{'sSHORT'}</CurrencyLabel>
                </InputContainer>
            </FlexDivCentered>

            <Divider />
            <MintingFeesContainer>
                <TotalLabel>{t('options.market.trade-options.mint.fees.minting')}</TotalLabel>
                <Total>{`${formatPercentage(
                    marketFees ? marketFees.creator + marketFees.pool : 0
                )} (${formatCurrencyWithSign(
                    USD_SIGN,
                    marketFees ? Number(amount) * (marketFees.creator + marketFees.pool) : 0
                )})`}</Total>
            </MintingFeesContainer>
            <MintingFeesInnerContainer>
                <TotalLabel>{t('options.market.trade-options.mint.fees.creator')}</TotalLabel>
                <Total>{`${formatPercentage(marketFees ? marketFees.creator : 0)} (${formatCurrencyWithSign(
                    USD_SIGN,
                    marketFees ? Number(amount) * marketFees.creator : 0
                )})`}</Total>
            </MintingFeesInnerContainer>
            <MintingFeesInnerContainer>
                <TotalLabel>{t('options.market.trade-options.mint.fees.pool')}</TotalLabel>
                <Total>{`${formatPercentage(marketFees ? marketFees.pool : 0)} (${formatCurrencyWithSign(
                    USD_SIGN,
                    marketFees ? Number(amount) * marketFees.pool : 0
                )})`}</Total>
            </MintingFeesInnerContainer>
            <NetworkFeesContainer>
                <NetworkFees gasLimit={gasLimit} labelColor={'dusty'} priceColor={'pale-grey'} />
            </NetworkFeesContainer>
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
        </Container>
    );
};

const NetworkFeesContainer = styled.div`
    padding: 0 45px;
`;

const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 2px solid rgba(1, 38, 81, 0.5);
`;

const MintSubmitButton = styled(SubmitButton)`
    background: transparent;
    border: 2px solid rgba(1, 38, 81, 0.5);
    color: #f6f6fe;
    &.selected,
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.5);
        border: 2px solid #04045a;
        border-radius: 20px;
        color: #04045a;
    }
`;

const MintingFeesContainer = styled(TotalContainer)`
    margin-bottom: 4px;
`;

const MintingFeesInnerContainer = styled(MintingFeesContainer)`
    margin-left: 20px;
`;

const MintingTotalLabel = styled(TotalLabel)<{ color?: string }>`
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

const MintingTotal = styled(Total)<{ color?: string }>`
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

const SliderRange = styled.div<{ color?: string }>`
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.4px;
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

const PlaceInOrderbook = styled.div`
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
`;

const SliderContainer = styled.div`
    position: relative;
    width: 500%;
    padding: 0 20px;
    margin-bottom: 10px;
`;

export default MintOptions;
