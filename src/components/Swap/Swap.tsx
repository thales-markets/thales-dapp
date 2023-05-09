import ApprovalModal from 'components/ApprovalModal';
import SimpleLoader from 'components/SimpleLoader';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { BigNumber, ethers } from 'ethers';
import { get } from 'lodash';
import useEthGasPriceEip1559Query from 'queries/network/useEthGasPriceEip1559Query';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered, LoaderContainer } from 'theme/common';
import erc20Contract from 'utils/contracts/erc20Contract';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import {
    checkAllowance,
    getIsArbitrum,
    getIsBSC,
    getIsOVM,
    getIsPolygon,
    getTransactionPrice,
    Network,
} from 'utils/network';
import { refetchBalances } from 'utils/queryConnector';
import useApproveSpender from './queries/useApproveSpender';
import useQuoteTokensQuery from './queries/useQuoteTokensQuery';
import useSwapTokenQuery from './queries/useSwapTokenQuery';
import SwapDialog from './styled-components';
import {
    ETH_Eth,
    OP_Eth,
    POLYGON_MATIC,
    mapTokenByNetwork,
    TokenSymbol,
    getTokenForSwap,
    getFromTokenSwap,
    BSC_BNB,
    ARB_ETH,
} from './tokens';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { OneInchLiquidityProtocol } from 'constants/network';
import snxJSConnector from 'utils/snxJSConnector';

const Swap: React.FC<any> = ({ handleClose, royaleTheme, initialToToken }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [preLoadTokens, setPreLoadTokens] = useState([] as any);
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);
    const signer = (snxJSConnector as any).signer;
    const [fromToken, setFromToken] = useState(getFromTokenSwap(networkId));

    const toTokenInitialState = mapTokenByNetwork(
        TokenSymbol[initialToToken as keyof typeof TokenSymbol],
        isL2,
        isPolygon
    );
    const [toToken, setToToken] = useState(toTokenInitialState);

    const [amount, setAmount] = useState('');
    const [previewData, setPreviewData] = useState(undefined);
    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');
    const [isLoading, setLoading] = useState(false);
    const [showSceleton, setShowSceleton] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);

    const ethGasPriceEip1559Query = useEthGasPriceEip1559Query(networkId, { enabled: isAppReady });
    const gasPrice = ethGasPriceEip1559Query.isSuccess ? ethGasPriceEip1559Query.data.proposeGasPrice ?? null : null;

    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, isPolygon ? CRYPTO_CURRENCY_MAP.MATIC : SYNTHS_MAP.sETH, null);

    const unsupportedNetwork = ![
        Network.Mainnet,
        Network['Mainnet-Ovm'],
        Network.BSC,
        Network['POLYGON-MAINNET'],
        Network.Arbitrum,
    ].includes(networkId);

    const approveSpenderQuery = useApproveSpender(networkId, {
        enabled: false,
    });

    const quoteQuery = useQuoteTokensQuery(
        networkId,
        fromToken,
        toToken,
        ethers.utils.parseUnits(amount ? amount.toString() : '0', fromToken.decimals),
        isPolygon || isBSC || isArbitrum ? [] : [OneInchLiquidityProtocol.UNISWAP],
        { enabled: false }
    );

    const swapQuery = useSwapTokenQuery(
        networkId,
        fromToken,
        toToken,
        walletAddress ? walletAddress : '',
        ethers.utils.parseUnits(amount ? amount.toString() : '0', fromToken.decimals),
        isPolygon || isBSC || isArbitrum ? [] : [OneInchLiquidityProtocol.UNISWAP],
        {
            enabled: false,
        }
    );

    useEffect(() => {
        if (fromToken && Number(amount) > 0) {
            setShowSceleton(true);
            quoteQuery.refetch().then((resp) => {
                if (resp.data) {
                    setPreviewData(resp.data as any);
                    setShowSceleton(false);
                }
            });
        } else if (fromToken) {
            Number(amount) !== 0 ? setAmount('') : '';
            setPreviewData(undefined);
            setShowSceleton(false);
        }
    }, [fromToken, toToken, amount, quoteQuery]);

    useEffect(() => {
        const swapTokenData = getTokenForSwap(networkId, initialToToken);

        setPreLoadTokens(swapTokenData.preloadTokens);
        setFromToken(swapTokenData.fromToken);
        setToToken(swapTokenData.toToken);
    }, [networkId, initialToToken]);

    useEffect(() => {
        const updateBalanceAndAllowance = async (token: any) => {
            if (token) {
                if (
                    token === ETH_Eth ||
                    token === OP_Eth ||
                    token === POLYGON_MATIC ||
                    token == BSC_BNB ||
                    token == ARB_ETH
                ) {
                    setAllowance(true);
                    signer
                        .getBalance()
                        .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
                } else {
                    const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, signer);

                    const spender = await approveSpenderQuery.refetch().then((resp: any) => {
                        return resp.data.address;
                    });

                    const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                    const allowance = await checkAllowance(
                        parsedAmount,
                        erc20Instance,
                        walletAddress,
                        spender as string
                    );
                    setAllowance(allowance);

                    erc20Instance
                        .balanceOf(walletAddress)
                        .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
                }
            }
        };

        updateBalanceAndAllowance(fromToken);
    }, [fromToken, amount, isAllowing, approveSpenderQuery, signer, walletAddress]);

    const approve = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract((fromToken as any).address, erc20Contract.abi, signer);
        const id = toast.loading(t('options.swap.progress'));
        try {
            setIsAllowing(true);
            setLoading(true);
            const req = await approveSpenderQuery.refetch();
            const tx = await erc20Instance.approve(req.data?.address, approveAmount);
            setOpenApprovalModal(false);
            await tx.wait();
            setLoading(false);
            setIsAllowing(false);
            toast.update(id, getSuccessToastOptions(t('options.swap.approval-success')));
            setOpenApprovalModal(false);
            return {
                data: (req.data as any).data,
                to: (req.data as any).to,
            };
        } catch (e) {
            console.log('failed: ', e);
            setIsAllowing(false);
            setLoading(false);
            toast.update(
                id,
                getErrorToastOptions(
                    (e as any).code === 4001 ? t('options.swap.tx-user-rejected') : t('options.swap.approval-failed')
                )
            );
            setOpenApprovalModal(false);
        }
    };

    const swapTx = async () => {
        setLoading(true);
        const id = toast.loading(t('options.swap.progress'));
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
                refetchBalances(walletAddress as any, networkId);
                setLoading(false);
                toast.update(id, getSuccessToastOptions(t('options.swap.tx-success', { token: toToken.symbol })));
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
        } catch (e: any) {
            setLoading(false);
            toast.update(
                id,
                getErrorToastOptions(
                    (e as any).code === 4001 ? t('options.swap.tx-user-rejected') : t('options.swap.tx-failed')
                )
            );
            console.log('failed: ', e);
        }
    };

    const getButton = (royaleTheme: boolean) => {
        if (!fromToken)
            return (
                <SwapDialog.ConfirmButton royaleTheme={royaleTheme} disabled={true} className="disabled primary">
                    {t('options.swap.select-token')}
                </SwapDialog.ConfirmButton>
            );

        if (fromToken && !allowance)
            return (
                <SwapDialog.ConfirmButton
                    royaleTheme={royaleTheme}
                    disabled={!fromToken || isAllowing}
                    className={!fromToken || isAllowing ? 'disabled primary' : 'primary'}
                    onClick={() => setOpenApprovalModal(true)}
                >
                    {t('options.swap.approve', { currency: (fromToken as any).symbol })}
                </SwapDialog.ConfirmButton>
            );

        if (fromToken && allowance && Number(amount) <= 0)
            return (
                <SwapDialog.ConfirmButton royaleTheme={royaleTheme} className="disabled primary" disabled={true}>
                    {t('options.swap.enter-amount')}
                </SwapDialog.ConfirmButton>
            );

        if (fromToken && allowance && Number(amount) > 0)
            return (
                <SwapDialog.ConfirmButton
                    royaleTheme={royaleTheme}
                    className={Number(amount) > Number(balance) ? 'disabled primary' : 'primary'}
                    onClick={async () => {
                        await swapTx();
                        handleClose(false);
                    }}
                    disabled={Number(amount) > Number(balance)}
                >
                    {Number(amount) > Number(balance) ? t('options.swap.insufficient-balance') : t('options.swap.swap')}
                </SwapDialog.ConfirmButton>
            );
    };

    return (
        <OutsideClickHandler disabled={openApprovalModal} onOutsideClick={handleClose.bind(this, true)}>
            {unsupportedNetwork ? (
                <SwapDialog royaleTheme={royaleTheme} contentType="unsupported">
                    <SwapDialog.CloseButton royaleTheme={royaleTheme} onClick={handleClose.bind(this, false)} />{' '}
                    <SwapDialog.ErrorMessage royaleTheme={royaleTheme}>
                        {t('options.swap.not-supported')}
                    </SwapDialog.ErrorMessage>
                </SwapDialog>
            ) : (
                <SwapDialog royaleTheme={royaleTheme} contentType={` ${isLoading ? 'loading' : ''}`}>
                    <SwapDialog.CloseButton royaleTheme={royaleTheme} onClick={handleClose.bind(this, false)} />
                    <SwapDialog.SectionWrapper royaleTheme={royaleTheme}>
                        <FlexDivRowCentered>
                            <SwapDialog.Text royaleTheme={royaleTheme}>{t('options.swap.from')}:</SwapDialog.Text>
                            <FlexDivRow>
                                <SwapDialog.Text
                                    royaleTheme={royaleTheme}
                                    style={{ alignSelf: 'center', marginRight: 5, cursor: 'pointer' }}
                                    onClick={() => {
                                        setAmount(Number(balance).toFixed(5));
                                    }}
                                >
                                    {t('options.swap.balance')}: {Number(balance).toFixed(4)}
                                </SwapDialog.Text>
                                <SwapDialog.MaxButton
                                    royaleTheme={royaleTheme}
                                    onClick={() => {
                                        setAmount(Number(balance).toFixed(5));
                                    }}
                                >
                                    {t('options.swap.max')}
                                </SwapDialog.MaxButton>
                            </FlexDivRow>
                        </FlexDivRowCentered>
                        <FlexDivRowCentered>
                            <SwapDialog.TokenSelect
                                royaleTheme={royaleTheme}
                                options={preLoadTokens}
                                formatOptionLabel={(option: any) => {
                                    return (
                                        <FlexDivRowCentered>
                                            <SwapDialog.TokenLogo src={option.logoURI}></SwapDialog.TokenLogo>
                                            <FlexDivColumnCentered>
                                                <SwapDialog.Text royaleTheme={royaleTheme} contentSize="large">
                                                    {option.symbol}
                                                </SwapDialog.Text>
                                            </FlexDivColumnCentered>
                                        </FlexDivRowCentered>
                                    );
                                }}
                                isDisabled={true}
                                value={fromToken}
                                onChange={(option: any) => {
                                    setFromToken(option);
                                }}
                            ></SwapDialog.TokenSelect>

                            <SwapDialog.NumInput
                                royaleTheme={royaleTheme}
                                screenWidth={window.innerWidth}
                                placeholder="0"
                                value={amount !== '' ? Number(amount) : ''}
                                onChange={(_: any, value: any) => {
                                    setAmount(value);
                                }}
                            ></SwapDialog.NumInput>
                        </FlexDivRowCentered>
                    </SwapDialog.SectionWrapper>
                    <SwapDialog.SceletonWrapper royaleTheme={royaleTheme} className={showSceleton ? 'visible' : ''}>
                        <FlexDivRowCentered>
                            <SwapDialog.TextSceleton royaleTheme={royaleTheme} contentType="small" />
                            <SwapDialog.TextSceleton royaleTheme={royaleTheme} contentType="large" />
                        </FlexDivRowCentered>
                        <FlexDivRowCentered>
                            <FlexDivCentered>
                                <SwapDialog.ImageSceleton royaleTheme={royaleTheme} />
                                <SwapDialog.TextSceleton royaleTheme={royaleTheme} contentType="medium" />
                            </FlexDivCentered>
                            <SwapDialog.TextSceleton royaleTheme={royaleTheme} contentType="medium" />
                        </FlexDivRowCentered>
                    </SwapDialog.SceletonWrapper>
                    <SwapDialog.SectionWrapper royaleTheme={royaleTheme} className={showSceleton ? 'hide' : ''}>
                        <FlexDivRowCentered>
                            <SwapDialog.Text royaleTheme={royaleTheme}>{t('options.swap.to')}:</SwapDialog.Text>
                            <SwapDialog.Text royaleTheme={royaleTheme}>
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
                            </SwapDialog.Text>
                        </FlexDivRowCentered>
                        <FlexDivRowCentered>
                            <SwapDialog.TokenSelect
                                royaleTheme={royaleTheme}
                                options={preLoadTokens}
                                formatOptionLabel={(option: any) => {
                                    return (
                                        <FlexDivRowCentered>
                                            <SwapDialog.TokenLogo src={option.logoURI}></SwapDialog.TokenLogo>
                                            <FlexDivColumnCentered>
                                                <SwapDialog.Text royaleTheme={royaleTheme} contentSize="large">
                                                    {option.symbol}
                                                </SwapDialog.Text>
                                            </FlexDivColumnCentered>
                                        </FlexDivRowCentered>
                                    );
                                }}
                                isDisabled={false}
                                value={toToken}
                                components={
                                    preLoadTokens?.length == 1
                                        ? {
                                              Menu: () => null,
                                              MenuList: () => null,
                                              DropdownIndicator: () => null,
                                              IndicatorSeparator: () => null,
                                          }
                                        : {
                                              IndicatorSeparator: () => null,
                                          }
                                }
                                onChange={(option: any) => {
                                    setToToken(option);
                                }}
                            ></SwapDialog.TokenSelect>
                            <SwapDialog.NumericText royaleTheme={royaleTheme}>
                                {previewData
                                    ? Number(
                                          ethers.utils.formatUnits(
                                              (previewData as any).toTokenAmount,
                                              (previewData as any).toToken.decimals
                                          )
                                      ).toFixed(4)
                                    : 'n/a'}
                            </SwapDialog.NumericText>
                        </FlexDivRowCentered>
                    </SwapDialog.SectionWrapper>
                    {getButton(royaleTheme)}
                    {isLoading && (
                        <LoaderContainer>
                            <SimpleLoader />
                        </LoaderContainer>
                    )}

                    {openApprovalModal && (
                        <ApprovalModal
                            defaultAmount={amount}
                            tokenSymbol={fromToken.symbol}
                            isAllowing={isAllowing}
                            onSubmit={approve}
                            onClose={() => setOpenApprovalModal(false)}
                            isRoyale={royaleTheme}
                        />
                    )}
                </SwapDialog>
            )}
        </OutsideClickHandler>
    );
};

export default Swap;
