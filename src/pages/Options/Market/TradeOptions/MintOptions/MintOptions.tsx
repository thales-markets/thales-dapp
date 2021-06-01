import { SYNTHS_MAP } from 'constants/currency';
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
import { Message } from 'semantic-ui-react';
import { getCurrencyKeyBalance } from 'utils/balances';
import snxJSConnector from 'utils/snxJSConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { ethers } from 'ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { bigNumberFormatter } from 'utils/formatters/ethers';
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
} from '../components';
import styled from 'styled-components';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import { refetchMarketQueries } from 'utils/queryConnector';
import { useBOMContractContext } from '../../contexts/BOMContractContext';
import { MarketFees } from 'pages/Options/CreateMarket/CreateMarket';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';

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
                console.log(marketFees);
            } catch (e) {
                console.log(e);
            }
        };
        const registerAllowanceListener = () => {
            if (walletAddress) {
                SynthsUSD.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
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
            BOMContract.on(BINARY_OPTIONS_EVENTS.OPTIONS_MINTED, (_, account: string) => {
                refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
                if (walletAddress === account) {
                    setIsMinting(false);
                }
            });
        }
        return () => {
            if (walletAddress) {
                BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.OPTIONS_MINTED);
            }
        };
    }, [walletAddress]);

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
            try {
                setIsAllowing(true);
                const gasEstimate = await SynthsUSD.estimateGas.approve(
                    BOMContract.address,
                    ethers.constants.MaxUint256
                );
                await SynthsUSD.approve(BOMContract.address, ethers.constants.MaxUint256, {
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
        try {
            setTxErrorMessage(null);
            setIsMinting(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
            const mintAmount = ethers.utils.parseEther(amount.toString());
            const tx = (await BOMContractWithSigner.mint(mintAmount)) as ethers.ContractTransaction;

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
        return (
            <MintSubmitButton disabled={isButtonDisabled} onClick={handleMint}>
                {!isMinting
                    ? t(`options.market.trade-options.mint.confirm-button.label`)
                    : t(`options.market.trade-options.mint.confirm-button.progress-label`)}
            </MintSubmitButton>
        );
    };

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
                <MintingTotalLabel color={'#3DBAA2'}>
                    {t('options.market.trade-options.mint.long-label')}
                </MintingTotalLabel>
                <MintingTotal color={'#3DBAA2'}>
                    {formatCurrency(
                        marketFees ? Number(amount) - Number(amount) * (marketFees.creator + marketFees.pool) : 0
                    )}
                </MintingTotal>
            </MintingFeesInnerContainer>
            <MintingFeesInnerContainer>
                <MintingTotalLabel color={'#FF7A68'}>
                    {t('options.market.trade-options.mint.short-label')}
                </MintingTotalLabel>
                <MintingTotal color={'#FF7A68'}>
                    {formatCurrency(
                        marketFees ? Number(amount) - Number(amount) * (marketFees.creator + marketFees.pool) : 0
                    )}
                </MintingTotal>
            </MintingFeesInnerContainer>
            <Divider />
            <MintingFeesContainer>
                <TotalLabel>{t('options.market.trade-options.mint.fees.minting')}</TotalLabel>
                <Total>{formatPercentage(marketFees ? marketFees.creator + marketFees.pool : 0)}</Total>
            </MintingFeesContainer>
            <MintingFeesInnerContainer>
                <TotalLabel>{t('options.market.trade-options.mint.fees.creator')}</TotalLabel>
                <Total>{formatPercentage(marketFees ? marketFees.creator : 0)}</Total>
            </MintingFeesInnerContainer>
            <MintingFeesInnerContainer>
                <TotalLabel>{t('options.market.trade-options.mint.fees.pool')}</TotalLabel>
                <Total>{formatPercentage(marketFees ? marketFees.pool : 0)}</Total>
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
    width: 90%;
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

export default MintOptions;
