import NumericInput from 'pages/Options/Market/components/NumericInput';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, FlexDivColumn, FlexDivRowCentered, Image, Text } from 'theme/common';
import { ReactSelect } from 'pages/Options/Market/components';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import erc20Contract from 'utils/contracts/erc20Contract';
import { ethers } from 'ethers';
import { fetchQuote, getTxForSwap } from './0xApiQuerys';

const sUSD = {
    address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
    name: 'Synth sUSD',
    symbol: 'sUSD',
    synth: true,
};

const Dai = {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
};

const Eth = {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    name: 'Ethereum',
    symbol: 'ETH',
};

const USDC = {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

const USDT = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    name: 'Tether USD',
    symbol: 'USDT',
};

const SPENDER = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

const preLoadTokens = [sUSD, Dai, USDC, USDT, Eth];

const Swap: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();

    const [fromToken, _setFromToken] = useState(undefined);
    const [toToken, _setToToken] = useState(sUSD);
    const [amount, setAmount] = useState(0);
    const [previewData, setPreviedData] = useState(undefined);
    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');

    useEffect(() => {
        if (fromToken && amount > 0) {
            fetchQuote(toToken.symbol, (fromToken as any).symbol, amount.toString(), (fromToken as any).decimals).then(
                (data) => {
                    setPreviedData(data as any);
                }
            );
        }
    }, [fromToken, amount]);

    useEffect(() => {
        if (fromToken) {
            if (fromToken === Eth) {
                signer
                    .getBalance()
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (fromToken as any).decimals)));
            } else {
                const erc20Instance = new ethers.Contract((fromToken as any).address, erc20Contract.abi, signer);
                erc20Instance
                    .allowance(walletAddress, SPENDER)
                    .then((data: any) =>
                        setAllowance(Number(ethers.utils.formatUnits(data, (fromToken as any).decimals)) > 0)
                    );
                erc20Instance
                    .balanceOf(walletAddress)
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (fromToken as any).decimals)));
            }
        }
    }, [fromToken]);

    const swapTx = async () => {
        const data = await getTxForSwap(
            toToken.symbol,
            (fromToken as any).symbol,
            amount.toString(),
            (fromToken as any).decimals
        );
        try {
            await signer.sendTransaction(data);
        } catch (e) {
            console.log('failed: ', e);
        }
    };

    const approve = () => {
        const erc20Instance = new ethers.Contract((fromToken as any).address, erc20Contract.abi, signer);
        erc20Instance.approve(SPENDER, ethers.constants.MaxUint256).then((data: any) => {
            console.log(data);
        });
    };

    return (
        <GradientBorderWrapper>
            <GradientBorderContent>
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
                <SectionWrapper>
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
                            disabled={true}
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

                {!allowance && (
                    <Button disabled={!fromToken} className="primary" onClick={approve.bind(this)}>
                        Approve
                    </Button>
                )}
                {allowance && (
                    <Button
                        className="primary"
                        onClick={async () => {
                            const tx = await swapTx();
                            console.log(tx);
                        }}
                        disabled={Number(amount) > Number(balance)}
                    >
                        Swap
                    </Button>
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
    &:last-of-type {
        position: relative;
        margin: 20px 0;
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
`;

export default Swap;
