import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import CollateralSelector from 'components/CollateralSelector/CollateralSelector';
import SimpleLoader from 'components/SimpleLoader';
import NumericInput from 'components/fields/NumericInput';
import {
    getDefaultToastContent,
    getLoadingToastOptions,
    getErrorToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { Network, OneInchLiquidityProtocol } from 'enums/network';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import erc20Contract from 'utils/contracts/erc20Contract';
import { checkAllowance, getIsOVM } from 'utils/network';
import { refetchBalances } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import useApproveSpender from './queries/useApproveSpender';
import useQuoteTokensQuery from './queries/useQuoteTokensQuery';
import useSwapTokenQuery from './queries/useSwapTokenQuery';
import { Container, ErrorMessage, LoaderContainer, SectionWrapper, defaultButtonProps } from './styled-components';
import {
    ARB_ETH,
    BSC_BNB,
    ETH_Eth,
    OP_Eth,
    POLYGON_MATIC,
    TokenSymbol,
    getFromTokenSwap,
    getTokenForSwap,
    mapTokenByNetwork,
} from './tokens';
import { truncToDecimals } from 'utils/formatters/number';
import { SWAP_SUPPORTED_NETWORKS } from 'constants/network';

const Swap: React.FC<any> = ({ handleClose, initialToToken }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const isL2 = getIsOVM(networkId);
    const isPolygon = networkId === Network.PolygonMainnet;
    const isArbitrum = networkId === Network.Arbitrum;
    const toTokenInitialState = mapTokenByNetwork(
        TokenSymbol[initialToToken as keyof typeof TokenSymbol],
        isL2,
        isPolygon
    );
    const [toToken, setToToken] = useState(toTokenInitialState);

    const [preLoadTokens, setPreLoadTokens] = useState([] as any);
    const [fromToken, setFromToken] = useState(getFromTokenSwap(networkId));
    const [amount, setAmount] = useState('');
    const [previewData, setPreviewData] = useState(undefined);
    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);

    const approveSpenderQuery = useApproveSpender(networkId, {
        enabled: false,
    });

    const quoteQuery = useQuoteTokensQuery(
        networkId,
        fromToken,
        toToken,
        ethers.utils.parseUnits(amount ? amount.toString() : '0', fromToken.decimals),
        isPolygon || isArbitrum ? [] : [OneInchLiquidityProtocol.UNISWAP],
        { enabled: false }
    );

    const swapQuery = useSwapTokenQuery(
        networkId,
        fromToken,
        toToken,
        walletAddress ? walletAddress : '',
        ethers.utils.parseUnits(amount ? amount.toString() : '0', fromToken.decimals),
        isPolygon || isArbitrum ? [] : [OneInchLiquidityProtocol.UNISWAP],
        {
            enabled: false,
        }
    );

    useEffect(() => {
        if (fromToken && Number(amount) > 0) {
            quoteQuery.refetch().then((resp) => {
                if (resp.data) {
                    setPreviewData(resp.data as any);
                }
            });
        } else if (fromToken) {
            Number(amount) !== 0 ? setAmount('') : '';
            setPreviewData(undefined);
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
                    (snxJSConnector as any).signer
                        .getBalance()
                        .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
                } else {
                    const erc20Instance = new ethers.Contract(
                        (token as any).address,
                        erc20Contract.abi,
                        (snxJSConnector as any).signer
                    );

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
    }, [fromToken, amount, isAllowing, approveSpenderQuery, walletAddress]);

    const approve = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(
            (fromToken as any).address,
            erc20Contract.abi,
            (snxJSConnector as any).signer
        );
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);
            setIsLoading(true);
            const req = await approveSpenderQuery.refetch();
            const tx = await erc20Instance.approve(req.data?.address, approveAmount);
            setOpenApprovalModal(false);
            await tx.wait();
            setIsLoading(false);
            setIsAllowing(false);
            toast.update(id, getSuccessToastOptions(t('common.swap.approval-success'), id));
            setOpenApprovalModal(false);
            return {
                data: (req.data as any).data,
                to: (req.data as any).to,
            };
        } catch (e) {
            console.log('failed: ', e);
            setIsAllowing(false);
            setIsLoading(false);
            toast.update(
                id,
                getErrorToastOptions(
                    (e as any).code === 4001 ? t('common.swap.tx-user-rejected') : t('common.swap.approval-failed'),
                    id
                )
            );
            setOpenApprovalModal(false);
        }
    };

    const swapTx = async () => {
        setIsLoading(true);
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
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
                const tx = await (snxJSConnector as any).signer.sendTransaction(transactionData);
                await tx.wait();
                refetchBalances(walletAddress as any, networkId);
                setIsLoading(false);
                toast.update(id, getSuccessToastOptions(t('common.swap.tx-success', { token: toToken.symbol }), id));
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
            setIsLoading(false);
            toast.update(
                id,
                getErrorToastOptions(
                    (e as any).code === 4001 ? t('common.swap.tx-user-rejected') : t('common.swap.tx-failed'),
                    id
                )
            );
            console.log('failed: ', e);
        }
    };

    const getButton = () => {
        if (!fromToken)
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('common.swap.select-token')}
                </Button>
            );

        if (fromToken && !allowance)
            return (
                <Button
                    disabled={!fromToken || isAllowing}
                    onClick={() => setOpenApprovalModal(true)}
                    {...defaultButtonProps}
                >
                    {t('common.swap.approve', { currency: (fromToken as any).symbol })}
                </Button>
            );

        if (fromToken && allowance && Number(amount) <= 0)
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('common.enter-amount')}
                </Button>
            );

        if (fromToken && allowance && Number(amount) > 0)
            return (
                <Button
                    onClick={async () => {
                        await swapTx();
                        handleClose(false);
                    }}
                    disabled={Number(amount) > Number(balance)}
                    {...defaultButtonProps}
                >
                    {Number(amount) > Number(balance) ? t('common.swap.insufficient-balance') : t('common.swap.swap')}
                </Button>
            );
    };

    const unsupportedNetwork = !SWAP_SUPPORTED_NETWORKS.includes(networkId);

    return (
        <OutsideClickHandler disabled={openApprovalModal} onOutsideClick={handleClose.bind(this, true)}>
            {unsupportedNetwork ? (
                <Container contentType="unsupported">
                    <ErrorMessage>{t('common.swap.not-supported')}</ErrorMessage>
                </Container>
            ) : (
                <Container contentType={isLoading ? 'loading' : ''}>
                    <SectionWrapper>
                        <NumericInput
                            placeholder={t('common.enter-amount')}
                            label={t('common.swap.from')}
                            value={amount !== '' ? Number(amount) : ''}
                            onChange={(_: any, value: any) => {
                                setAmount(value);
                            }}
                            currencyLabel={fromToken.symbol}
                            onMaxButton={() => {
                                setAmount(truncToDecimals(balance, 5));
                            }}
                            balance={`${t('common.balance')}: ${Number(balance).toFixed(4)}`}
                        />
                    </SectionWrapper>
                    <SectionWrapper>
                        <NumericInput
                            label={t('common.swap.to')}
                            value={
                                previewData
                                    ? Number(
                                          ethers.utils.formatUnits(
                                              (previewData as any).toTokenAmount,
                                              (previewData as any).toToken.decimals
                                          )
                                      ).toFixed(4)
                                    : 'n/a'
                            }
                            onChange={() => {}}
                            disabled={true}
                            currencyLabel={preLoadTokens?.length == 1 ? toToken.symbol : undefined}
                            currencyComponent={
                                preLoadTokens?.length > 1 ? (
                                    <CollateralSelector
                                        collateralArray={preLoadTokens.map((item: any) => item.symbol)}
                                        selectedItem={preLoadTokens.findIndex(
                                            (item: any) => item.symbol === toToken.symbol
                                        )}
                                        onChangeCollateral={(index) => {
                                            setToToken(preLoadTokens[index]);
                                        }}
                                    />
                                ) : undefined
                            }
                            enableCurrencyComponentOnly
                        />
                    </SectionWrapper>
                    {getButton()}
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
                        />
                    )}
                </Container>
            )}
        </OutsideClickHandler>
    );
};

export default Swap;
