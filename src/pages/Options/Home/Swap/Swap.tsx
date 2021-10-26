import NumericInput from 'pages/Options/Market/components/NumericInput';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { ReactSelect } from 'pages/Options/Market/components';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import erc20Contract from 'utils/contracts/erc20Contract';
import { ethers } from 'ethers';
import { fetchQuote, getTxForSwap } from './0xApiQuerys';
import SimpleLoader from 'components/SimpleLoader';
import { refetchUserBalance } from 'utils/queryConnector';
import { useTranslation } from 'react-i18next';
import { Dai, USDC, USDT, Eth, sUSD } from './tokens';

const SPENDER = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

const preLoadTokens = [Dai, USDC, USDT, Eth];

const Swap: React.FC<any> = ({ handleClose }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();

    const [fromToken, _setFromToken] = useState(undefined);
    const [toToken, _setToToken] = useState(sUSD);
    const [amount, setAmount] = useState(0);
    const [previewData, setPreviedData] = useState(undefined);
    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');
    const [isLoading, setLoading] = useState(false);
    const [showSceleton, setShowSceleton] = useState(false);

    useEffect(() => {
        if (fromToken && amount > 0) {
            setShowSceleton(true);
            fetchQuote(
                toToken.symbol,
                toToken.decimals,
                (fromToken as any).symbol,
                amount.toString(),
                (fromToken as any).decimals
            ).then((data) => {
                setPreviedData(data as any);
                setShowSceleton(false);
            });
        }
    }, [fromToken, amount]);

    useEffect(() => {
        updateBalaneAndAllowance(fromToken);
    }, [fromToken]);

    const updateBalaneAndAllowance = (token: any) => {
        if (token) {
            if (token === Eth) {
                setAllowance(true);
                signer
                    .getBalance()
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
            } else {
                const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, signer);
                erc20Instance
                    .allowance(walletAddress, SPENDER)
                    .then((data: any) =>
                        setAllowance(Number(ethers.utils.formatUnits(data, (token as any).decimals)) > 0)
                    );
                erc20Instance
                    .balanceOf(walletAddress)
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
            }
        }
    };

    const swapTx = async () => {
        const data = await getTxForSwap(
            toToken.symbol,
            (fromToken as any).symbol,
            amount.toString(),
            (fromToken as any).decimals
        );

        try {
            const tx = await signer.sendTransaction(data);
            setLoading(true);
            await tx.wait();
            refetchUserBalance(walletAddress as any, networkId);
            setLoading(false);
        } catch (e) {
            console.log('failed: ', e);
        }
    };

    const approve = async () => {
        const erc20Instance = new ethers.Contract((fromToken as any).address, erc20Contract.abi, signer);

        try {
            const tx = await erc20Instance.approve(SPENDER, ethers.constants.MaxUint256);
            setLoading(true);
            await tx.wait();
            setLoading(false);
            setAllowance(true);
        } catch (e) {
            console.log('tx rejected, try again');
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
                    {t('options.swap.approve')}
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
                        updateBalaneAndAllowance(fromToken);
                    }}
                    disabled={Number(amount) > Number(balance)}
                >
                    {t('options.swap.swap')}
                </Button>
            );
    };

    return (
        <GradientBorderWrapper>
            <GradientBorderContent className={isLoading ? 'loading' : ''}>
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
                            {previewData ? formatCurrencyWithSign(USD_SIGN, (previewData as any).gasPrice) : 'n/a'}
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
                            {previewData ? Number((previewData as any).buyAmount).toFixed(4) : 'n/a'}
                        </Text>
                    </FlexDivRowCentered>
                </SectionWrapper>
                {getButton()}
                {isLoading && (
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                )}
            </GradientBorderContent>
        </GradientBorderWrapper>
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
