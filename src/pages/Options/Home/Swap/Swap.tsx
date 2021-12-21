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

const Swap: React.FC<any> = ({ handleClose }) => {
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
    const [amount, setAmount] = useState(0);
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
        if (fromToken && amount > 0) {
            setShowSceleton(true);
            quoteQuery.refetch().then((resp) => {
                setPreviewData(resp.data as any);
                setShowSceleton(false);
            });
        } else if (fromToken && amount == 0) {
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

    const getButton = () => {
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
                <GradientBorderWrapper>
                    <GradientBorderContent className="unsupported">
                        <CloseButton onClick={handleClose.bind(this, false)} />{' '}
                        <Text style={{ fontSize: 18, display: 'flex', alignSelf: 'center' }}>
                            {t(`common.errors.insufficient-liquidity`)}
                        </Text>
                    </GradientBorderContent>
                </GradientBorderWrapper>
            ) : (
                <GradientBorderWrapper>
                    <GradientBorderContent
                        className={` ${isLoading ? 'loading' : ''} ${txErrorMessage !== null ? 'error' : ''}`}
                    >
                        <CloseButton onClick={handleClose.bind(this, false)} />
                        <SectionWrapper>
                            <FlexDivRowCentered>
                                <Text className="text-xxs white">From:</Text>
                                <Text className="text-xxs white">Balance: {Number(balance).toFixed(4)}</Text>
                            </FlexDivRowCentered>
                            <FlexDivRowCentered>
                                <Select
                                    options={preLoadTokens}
                                    formatOptionLabel={(option: any) => {
                                        return (
                                            <FlexDivRowCentered style={{ flex: 1 }}>
                                                <Image
                                                    src={option.logoURI}
                                                    style={{ width: 32, height: 32, marginRight: 6 }}
                                                ></Image>
                                                <Text className="text-xs white">{option.name}</Text>
                                            </FlexDivRowCentered>
                                        );
                                    }}
                                    value={fromToken}
                                    onChange={(option: any) => {
                                        _setFromToken(option);
                                    }}
                                ></Select>

                                <NumInput
                                    style={{ padding: 10, width: 150, textAlign: 'right' }}
                                    value={amount}
                                    onChange={(_, value) => {
                                        setAmount(value as any);
                                    }}
                                ></NumInput>
                            </FlexDivRowCentered>
                        </SectionWrapper>
                        <SceletonWrapper className={showSceleton ? 'visible' : ''}>
                            <FlexDivRowCentered>
                                <TextSceleton className="small" />
                                <TextSceleton className="large" />
                            </FlexDivRowCentered>
                            <FlexDivRowCentered style={{ height: 64 }}>
                                <FlexDivCentered>
                                    <ImageSceleton />
                                    <TextSceleton className="medium" />
                                </FlexDivCentered>
                                <TextSceleton className="medium" />
                            </FlexDivRowCentered>
                        </SceletonWrapper>
                        <SectionWrapper className={showSceleton ? 'hide' : ''}>
                            <FlexDivRowCentered>
                                <Text className="text-xxs white">To:</Text>
                                <Text className="text-xxs white">
                                    Estimated Gas:{' '}
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
                                </Text>
                            </FlexDivRowCentered>
                            <FlexDivRowCentered>
                                <Select
                                    options={preLoadTokens}
                                    formatOptionLabel={(option: any) => {
                                        return (
                                            <FlexDivRowCentered style={{ flex: 1 }}>
                                                <Image
                                                    src={option.logoURI}
                                                    style={{ width: 32, height: 32, marginRight: 6 }}
                                                ></Image>
                                                <Text className="text-xs white">{option.name}</Text>
                                            </FlexDivRowCentered>
                                        );
                                    }}
                                    isDisabled={true}
                                    value={toToken}
                                    onChange={(option: any) => {
                                        _setToToken(option);
                                    }}
                                ></Select>
                                <Text className="text-m white blur">
                                    {previewData
                                        ? Number(
                                              ethers.utils.formatUnits(
                                                  (previewData as any).toTokenAmount,
                                                  (previewData as any).toToken.decimals
                                              )
                                          ).toFixed(4)
                                        : 'n/a'}
                                </Text>
                            </FlexDivRowCentered>
                        </SectionWrapper>
                        {getButton()}
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

const SectionWrapper = styled(FlexDivColumn)`
    background: #0a2e66;
    padding: 16px;
    padding-bottom: 0;
    border-radius: 20px;
    max-height: 92px;
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

const NumInput = styled(NumericInput)`
    font-size: 20px;
    &:focus {
        border: none !important;
    }
`;

const Select = styled(ReactSelect)`
    flex: 1;
    max-width: 200px;
    margin-left: -10px;
    .react-select__single-value,
    .react-select__single-value > div {
        padding: 0 !important;
    }
    .react-select__control--is-focused {
        border: none !important;
    }
`;

const GradientBorderWrapper = styled.div`
    border-radius: 18px;
    background: linear-gradient(to right, #3936c7, #2d83d2, #23a5dd, #35dadb);
    margin: auto;
    position: relative;
    top: 200px;
    width: 422px;
    padding: 1px;
    @media screen and (max-width: 500px) {
        width: 342px;
    }
`;

const GradientBorderContent = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    border-radius: 20px;
    min-width: 70px;
    background-color: #04045a;
    padding: 20px;
    display: flex;
    flex-direction: column;
    color: #f6f6fe;
    justify-content: space-between;
    width: 420px;
    padding-top: 50px;
    height: 334px;
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

const SceletonWrapper = styled.div`
    display: none;
    width: 380px;
    height: 92px;
    background: #0a2e66;
    padding: 16px;
    border-radius: 20px;
    &.visible {
        display: block;
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

const TextSceleton = styled.div`
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
    background: #6984ad;
`;

const ImageSceleton = styled.div`
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: #6984ad;
    margin-right: 6px;
`;

const CloseButton = styled(XButton)`
    position: absolute;
    top: 20px;
    right: 20px;
`;

export default Swap;
