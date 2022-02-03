import SimpleLoader from 'components/SimpleLoader';
import { ValidationMessage } from 'components/ValidationMessage/ValidationMessage';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { BigNumber, ethers } from 'ethers';
import { get } from 'lodash';
import { ReactSelect } from 'pages/Options/Market/components';
import NumericInput from 'pages/Options/Market/components/NumericInput';
import useEthGasPriceEip1559Query from 'queries/network/useEthGasPriceEip1559Query';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import {
    Button,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivRow,
    FlexDivRowCentered,
    Image,
    LoaderContainer,
    Text,
    XButton,
} from 'theme/common';
import erc20Contract from 'utils/contracts/erc20Contract';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getIsOVM, getTransactionPrice } from 'utils/network';
import { dispatchMarketNotification } from 'utils/options';
import { refetchUserBalance } from 'utils/queryConnector';
import { ETH_Dai, ETH_Eth, ETH_sUSD, ETH_USDC, ETH_USDT, OP_Dai, OP_Eth, OP_sUSD, OP_USDC, OP_USDT } from './tokens';
import useApproveSpender from './useApproveSpender';
import useQuoteTokensQuery from './useQuoteTokensQuery';
import useSwapTokenQuery from './useSwapTokenQuery';

const Swap: React.FC<any> = ({ handleClose, royaleTheme }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [preLoadTokens, setPreLoadTokens] = useState([] as any);
    const isL2 = getIsOVM(networkId);
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const [fromToken, _setFromToken] = useState(isL2 ? OP_Eth : ETH_Eth);
    const [toToken, _setToToken] = useState(isL2 ? OP_sUSD : ETH_sUSD);
    const [amount, setAmount] = useState('');
    const [previewData, setPreviewData] = useState(undefined);
    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');
    const [isLoading, setLoading] = useState(false);
    const [showSceleton, setShowSceleton] = useState(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const ethGasPriceEip1559Query = useEthGasPriceEip1559Query(networkId, { enabled: isAppReady });
    const gasPrice = ethGasPriceEip1559Query.isSuccess ? ethGasPriceEip1559Query.data.proposeGasPrice ?? null : null;

    const exchangeRatesQuery = useExchangeRatesQuery(networkId, { enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    const approveSpenderQuery = useApproveSpender(networkId, {
        enabled: false,
    });

    const quoteQuery = useQuoteTokensQuery(
        networkId,
        fromToken,
        toToken,
        ethers.utils.parseUnits(amount ? amount.toString() : '0', fromToken.decimals),
        { enabled: false }
    );

    const swapQuery = useSwapTokenQuery(
        networkId,
        fromToken,
        toToken,
        walletAddress ? walletAddress : '',
        ethers.utils.parseUnits(amount ? amount.toString() : '0', fromToken.decimals),
        {
            enabled: false,
        }
    );

    useEffect(() => {
        if (fromToken && Number(amount) > 0) {
            setShowSceleton(true);
            quoteQuery.refetch().then((resp) => {
                setPreviewData(resp.data as any);
                setShowSceleton(false);
            });
        } else if (fromToken) {
            Number(amount) !== 0 ? setAmount('') : '';
            setPreviewData(undefined);
            setShowSceleton(false);
        }
    }, [fromToken, amount]);

    useEffect(() => {
        isL2
            ? (setPreLoadTokens([OP_Eth, OP_Dai, OP_USDC, OP_USDT]), _setToToken(OP_sUSD))
            : (setPreLoadTokens([ETH_Eth, ETH_Dai, ETH_USDC, ETH_USDT]), _setToToken(ETH_sUSD));
    }, [networkId]);

    useEffect(() => {
        updateBalanceAndAllowance(fromToken);
    }, [fromToken]);

    const updateBalanceAndAllowance = (token: any) => {
        if (token) {
            if (token === ETH_Eth || token === OP_Eth) {
                setAllowance(true);
                signer
                    .getBalance()
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
            } else {
                const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, signer);

                const spender = approveSpenderQuery.refetch().then((resp: any) => {
                    return resp.data.address;
                });

                erc20Instance
                    .allowance(walletAddress, spender)
                    .then((data: any) =>
                        setAllowance(Number(ethers.utils.formatUnits(data, (token as any).decimals)) > 0)
                    );

                erc20Instance
                    .balanceOf(walletAddress)
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
            }
        }
    };

    const approve = async () => {
        const erc20Instance = new ethers.Contract((fromToken as any).address, erc20Contract.abi, signer);
        try {
            setLoading(true);
            const req = await approveSpenderQuery.refetch();
            const tx = await erc20Instance.approve(req.data?.address, ethers.constants.MaxUint256);
            await tx.wait();
            setLoading(false);
            setAllowance(true);
            return {
                data: (req.data as any).data,
                to: (req.data as any).to,
            };
        } catch (e) {
            console.log('failed: ', e);
        }
    };

    const swapTx = async () => {
        setLoading(true);
        try {
            const req = await swapQuery.refetch();
            if (req.isSuccess) {
                const data = req.data as any;
                const transactionData = {
                    data: data.tx.data,
                    from: data.tx.from,
                    to: data.tx.to,
                    value: BigNumber.from(data.tx.value).toHexString(),
                };
                const tx = await signer.sendTransaction(transactionData);
                await tx.wait();
                refetchUserBalance(walletAddress as any, networkId);
                setLoading(false);
                dispatchMarketNotification(t('options.swap.tx-success'));
                return {
                    data: (data as any).tx.data,
                    from: (data as any).tx.from,
                    to: (data as any).tx.to,
                    value:
                        Number((data as any).tx.value) > 0
                            ? ethers.utils.parseUnits(amount.toString(), fromToken.decimals)
                            : undefined,
                };
            }
        } catch (e) {
            setLoading(false);
            setTxErrorMessage(e.code === 4001 ? t('options.swap.tx-user-rejected') : t('options.swap.tx-failed'));
            console.log('failed: ', e);
        }
    };

    const getButton = (royaleTheme: boolean) => {
        if (royaleTheme) {
            if (!fromToken)
                return (
                    <RoyaleStyledButton disabled={true} className="primary">
                        {t('options.swap.select-token')}
                    </RoyaleStyledButton>
                );

            if (fromToken && !allowance)
                return (
                    <RoyaleStyledButton disabled={!fromToken} className="primary" onClick={approve.bind(this)}>
                        {t('options.swap.approve', { currency: (fromToken as any).symbol })}
                    </RoyaleStyledButton>
                );

            if (fromToken && allowance && Number(amount) <= 0)
                return (
                    <RoyaleStyledButton className="primary" disabled={true}>
                        {t('options.swap.enter-amount')}
                    </RoyaleStyledButton>
                );

            if (fromToken && allowance && Number(amount) > 0)
                return (
                    <RoyaleStyledButton
                        className="primary"
                        onClick={async () => {
                            await swapTx();
                            updateBalanceAndAllowance(fromToken);
                        }}
                        disabled={Number(amount) > Number(balance)}
                    >
                        {Number(amount) > Number(balance)
                            ? t('options.swap.insufficient-balance')
                            : t('options.swap.swap')}
                    </RoyaleStyledButton>
                );
        }
        if (!fromToken)
            return (
                <Button disabled={true} className="primary">
                    {t('options.swap.select-token')}
                </Button>
            );

        if (fromToken && !allowance)
            return (
                <Button disabled={!fromToken} className="primary" onClick={approve.bind(this)}>
                    {t('options.swap.approve', { currency: (fromToken as any).symbol })}
                </Button>
            );

        if (fromToken && allowance && Number(amount) <= 0)
            return (
                <Button className="primary" disabled={true}>
                    {t('options.swap.enter-amount')}
                </Button>
            );

        if (fromToken && allowance && Number(amount) > 0)
            return (
                <Button
                    className="primary"
                    onClick={async () => {
                        await swapTx();
                        updateBalanceAndAllowance(fromToken);
                    }}
                    disabled={Number(amount) > Number(balance)}
                >
                    {Number(amount) > Number(balance) ? t('options.swap.insufficient-balance') : t('options.swap.swap')}
                </Button>
            );
    };

    return (
        <>
            {networkId !== 1 && networkId !== 10 ? (
                <GradientBorderWrapper royaleTheme={royaleTheme}>
                    <GradientBorderContent className="unsupported">
                        <CloseButton onClick={handleClose.bind(this, false)} />{' '}
                        <Text style={{ fontSize: 18, display: 'flex', alignSelf: 'center' }}>
                            {t(`common.errors.insufficient-liquidity`)}
                        </Text>
                    </GradientBorderContent>
                </GradientBorderWrapper>
            ) : (
                <GradientBorderWrapper royaleTheme={royaleTheme}>
                    <GradientBorderContent
                        royaleTheme={royaleTheme}
                        className={` ${isLoading ? 'loading' : ''} ${txErrorMessage !== null ? 'error' : ''}`}
                    >
                        <CloseButton onClick={handleClose.bind(this, false)} />
                        <SectionWrapper royaleTheme={royaleTheme} style={{ paddingTop: 14 }}>
                            <FlexDivRowCentered>
                                <StyledText royaleTheme={royaleTheme} className="text-xxs white">
                                    {t('options.swap.from')}:
                                </StyledText>
                                <FlexDivRow>
                                    <StyledText
                                        royaleTheme={royaleTheme}
                                        className="text-xxs white"
                                        style={{ alignSelf: 'center', marginRight: 5, cursor: 'pointer' }}
                                        onClick={() => {
                                            setAmount(Number(Number(balance).toFixed(4)).toString());
                                        }}
                                    >
                                        {t('options.swap.balance')}: {Number(balance).toFixed(4)}
                                    </StyledText>
                                    <MaxButton
                                        royaleTheme={royaleTheme}
                                        className="text-xxs"
                                        onClick={() => {
                                            setAmount(Number(Number(balance).toFixed(4)).toString());
                                        }}
                                    >
                                        {t('options.swap.max')}
                                    </MaxButton>
                                </FlexDivRow>
                            </FlexDivRowCentered>
                            <FlexDivRowCentered>
                                <Select
                                    royaleTheme={royaleTheme}
                                    options={preLoadTokens}
                                    formatOptionLabel={(option: any) => {
                                        return (
                                            <FlexDivRowCentered style={{ flex: 1 }}>
                                                <Image
                                                    src={option.logoURI}
                                                    style={{ width: 32, height: 32, marginRight: 6 }}
                                                ></Image>
                                                <StyledText
                                                    royaleTheme={royaleTheme}
                                                    className="text-xs white"
                                                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                                                >
                                                    {option.name}
                                                </StyledText>
                                            </FlexDivRowCentered>
                                        );
                                    }}
                                    value={fromToken}
                                    onChange={(option: any) => {
                                        _setFromToken(option);
                                    }}
                                ></Select>

                                <NumInput
                                    royaleTheme={royaleTheme}
                                    style={{
                                        padding: 10,
                                        width: window.innerWidth <= 500 ? 130 : 150,
                                        textAlign: 'right',
                                    }}
                                    placeholder="0"
                                    value={amount !== '' ? Number(amount) : ''}
                                    onChange={(_, value) => {
                                        setAmount(value as any);
                                    }}
                                ></NumInput>
                            </FlexDivRowCentered>
                        </SectionWrapper>
                        <SceletonWrapper royaleTheme={royaleTheme} className={showSceleton ? 'visible' : ''}>
                            <FlexDivRowCentered>
                                <TextSceleton royaleTheme={royaleTheme} className="small" />
                                <TextSceleton royaleTheme={royaleTheme} className="large" />
                            </FlexDivRowCentered>
                            <FlexDivRowCentered style={{ height: 64 }}>
                                <FlexDivCentered>
                                    <ImageSceleton royaleTheme={royaleTheme} />
                                    <TextSceleton royaleTheme={royaleTheme} className="medium" />
                                </FlexDivCentered>
                                <TextSceleton royaleTheme={royaleTheme} className="medium" />
                            </FlexDivRowCentered>
                        </SceletonWrapper>
                        <SectionWrapper royaleTheme={royaleTheme} className={showSceleton ? 'hide' : ''}>
                            <FlexDivRowCentered>
                                <StyledText royaleTheme={royaleTheme} className="text-xxs white">
                                    {t('options.swap.to')}:
                                </StyledText>
                                <StyledText royaleTheme={royaleTheme} className="text-xxs white">
                                    {t('options.swap.estimated-gas')}:{' '}
                                    {previewData
                                        ? formatCurrencyWithSign(
                                              USD_SIGN,
                                              getTransactionPrice(
                                                  gasPrice,
                                                  Number((previewData as any).estimatedGas),
                                                  ethRate
                                              )
                                          )
                                        : 'n/a'}
                                </StyledText>
                            </FlexDivRowCentered>
                            <FlexDivRowCentered>
                                <Select
                                    royaleTheme={royaleTheme}
                                    options={preLoadTokens}
                                    formatOptionLabel={(option: any) => {
                                        return (
                                            <FlexDivRowCentered style={{ flex: 1 }}>
                                                <Image
                                                    src={option.logoURI}
                                                    style={{ width: 32, height: 32, marginRight: 6 }}
                                                ></Image>
                                                <StyledText royaleTheme={royaleTheme} className="text-xs white">
                                                    {option.name}
                                                </StyledText>
                                            </FlexDivRowCentered>
                                        );
                                    }}
                                    isDisabled={true}
                                    value={toToken}
                                    onChange={(option: any) => {
                                        _setToToken(option);
                                    }}
                                ></Select>
                                <StyledText royaleTheme={royaleTheme} className="text-m white blur">
                                    {previewData
                                        ? Number(
                                              ethers.utils.formatUnits(
                                                  (previewData as any).toTokenAmount,
                                                  (previewData as any).toToken.decimals
                                              )
                                          ).toFixed(4)
                                        : 'n/a'}
                                </StyledText>
                            </FlexDivRowCentered>
                        </SectionWrapper>
                        {getButton(royaleTheme)}
                        {isLoading && (
                            <LoaderContainer>
                                <SimpleLoader />
                            </LoaderContainer>
                        )}
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                    </GradientBorderContent>
                </GradientBorderWrapper>
            )}
        </>
    );
};

const SectionWrapper = styled(FlexDivColumn)<{ royaleTheme?: boolean }>`
    background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : '#0a2e66')};
    border: ${(props) => (props.royaleTheme ? '5px solid var(--color)' : '')};
    padding: 16px;
    padding-bottom: 0;
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '20px')};
    max-height: ${(props) => (props.royaleTheme ? '102px' : '92px')};
    &:last-of-type {
        position: relative;
        margin: 20px 0;
        .react-select__indicators {
            display: none !important;
        }
    }
    &.hide {
        display: none;
    }
`;

const NumInput = styled(NumericInput)<{ royaleTheme?: boolean }>`
    font-size: 20px;
    background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : '')};
    border: ${(props) => (props.royaleTheme ? '1px solid var(--color-wrapper)' : '')};
    color: ${(props) => (props.royaleTheme ? 'var(--color)' : '')};
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : '')};
    margin-bottom: ${(props) => (props.royaleTheme ? '4px' : '')};
    &:focus {
        border: none !important;
    }
`;

const Select = styled(ReactSelect)<{ royaleTheme?: boolean }>`
    flex: 1;
    max-width: 200px;
    margin-left: -10px;
    margin-bottom: ${(props) => (props.royaleTheme ? '4px' : '')};
    & > div {
        font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : '')};
        background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper) !important' : '')};
        border: ${(props) => (props.royaleTheme ? 'none !important' : '')};
    }

    .react-select__single-value,
    .react-select__single-value > div {
        padding: 0 !important;
    }
    .react-select__control--is-focused {
        border: none !important;
    }

    .react-select__option {
        font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : '')};
        color: ${(props) => (props.royaleTheme ? 'var(--color) !important' : '')};
        background: ${(props) => (props.royaleTheme ? 'var(--color-wrapper) !important' : '')};
        border: ${(props) => (props.royaleTheme ? 'none !important' : '')};
        &:hover {
            background: ${(props) => (props.royaleTheme ? 'var(--color) !important' : '')};
            & > div > p {
                color: ${(props) => (props.royaleTheme ? 'var(--color-wrapper) !important' : '')};
            }
        }
    }
`;

const GradientBorderWrapper = styled.div<{ royaleTheme?: boolean }>`
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '18px')};
    background: ${(props) =>
        props.royaleTheme ? 'var(--color)' : 'linear-gradient(to right, #3936c7, #2d83d2, #23a5dd, #35dadb)'};
    margin: auto;
    position: relative;
    top: 200px;
    width: 422px;
    padding: 1px;
    @media screen and (max-width: 500px) {
        top: 50px;
        width: 342px;
    }
`;

const GradientBorderContent = styled.div<{ royaleTheme?: boolean }>`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '20px')};
    min-width: 70px;
    background-color: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : '#04045a')};
    padding: 20px;
    display: flex;
    flex-direction: column;
    color: #f6f6fe;
    justify-content: space-between;
    width: 420px;
    padding-top: 50px;
    height: border-radius: ${(props) => (props.royaleTheme ? '350px' : '334px')};
    &.loading {
        opacity: 0.85;
    }
    &.unsupported {
        height: 115px;
    }
    &.error {
        height: 395px;
    }
    @media screen and (max-width: 500px) {
        width: 340px;
    }
`;

const SceletonWrapper = styled.div<{ royaleTheme?: boolean }>`
    display: none;
    width: 380px;
    max-height: ${(props) => (props.royaleTheme ? '102px' : '92px')};
    background: ${(props) => (props.royaleTheme ? 'var(--color-background)' : '#6984ad')};
    border-radius: ${(props) => (props.royaleTheme ? '5px' : '20px')};
    border: ${(props) => (props.royaleTheme ? '5px solid var(--color)' : '')};
    padding: 16px;
    margin: ${(props) => (props.royaleTheme ? '20px 0px' : '')};
    &.visible {
        display: block;
        width: 100%;
    }

    @keyframes shimmer {
        100% {
            -webkit-mask-position: left;
        }
    }
    -webkit-mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%;
    background-repeat: no-repeat;
    animation: shimmer 2.5s infinite;
`;

const TextSceleton = styled.div<{ royaleTheme?: boolean }>`
    height: 13px;
    border-radius: 12px;
    &.small {
        width: 40px;
    }
    &.medium {
        width: 80px;
    }
    &.large {
        width: 120px;
    }
    background: ${(props) => (props.royaleTheme ? 'var(--color)' : '#6984ad')};
`;

const ImageSceleton = styled.div<{ royaleTheme?: boolean }>`
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: ${(props) => (props.royaleTheme ? 'var(--color)' : '#6984ad')};
    margin-right: 6px;
`;

const MaxButton = styled.button<{ royaleTheme?: boolean }>`
    cursor: pointer;
    background-color: ${(props) => (props.royaleTheme ? 'var(--color)' : '#04045a')};
    color: ${(props) => (props.royaleTheme ? 'var(--color-wrapper)' : 'white')};
    border: transparent;
    border-radius: 20px;
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : '')};
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.4px;
    font-weight: bold;
`;

const CloseButton = styled(XButton)`
    position: absolute;
    top: 20px;
    right: 20px;
`;

const RoyaleStyledButton = styled.button`
    padding: 8px 35px;
    cursor: pointer;
    align-items: center;
    cursor: pointer;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: var(--color);
    border: 1px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px var(--color);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: var(--color-wrapper);
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const StyledText = styled(Text)<{ royaleTheme?: boolean }>`
    color: ${(props) => (props.royaleTheme ? 'var(--color) !important' : '')};
    font-family: ${(props) => (props.royaleTheme ? 'Sansation !important' : '')};
`;

export default Swap;
