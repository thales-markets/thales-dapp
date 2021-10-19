import ROUTES from 'constants/routes';
import NumericInput from 'pages/Options/Market/components/NumericInput';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, Button, FlexDivColumn, FlexDivRowCentered, Image, Text, Wrapper } from 'theme/common';
import { ethers } from 'ethers';
import MarketHeader from '../MarketHeader';
import useQuoteTokensQuery from './useQuoteTokensQuery';
import useApproveToken from './useApproveToken';
import useSwapTokenQuery from './useSwapTokenQuery';
import { ReactSelect } from 'pages/Options/Market/components';
import { gasPriceInWei } from 'utils/network';

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

const preLoadTokens = [sUSD, Dai, USDC, USDT, Eth];

const Swap: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);

    // The Metamask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();
    console.log(signer);
    const [fromToken, _setFromToken] = useState(USDC);
    const [toToken, _setToToken] = useState(sUSD);
    const [amount, setAmount] = useState(1);

    const quoteQuery = useQuoteTokensQuery(
        networkId,
        fromToken,
        toToken,
        ethers.utils.parseUnits(amount.toString(), fromToken.decimals),
        {
            enabled: false,
        }
    );

    const previewData = quoteQuery.isSuccess ? quoteQuery.data : undefined;

    console.log(previewData);

    const approveQuery = useApproveToken(
        networkId,
        fromToken,
        ethers.utils.parseUnits(amount.toString(), fromToken.decimals),
        {
            enabled: false,
        }
    );

    const approveTx = async () => {
        const req = await approveQuery.refetch();
        console.log(req);
        return {
            data: (req.data as any).data,
            to: (req.data as any).to,
        };
    };

    const swapQuery = useSwapTokenQuery(
        networkId,
        fromToken,
        toToken,
        walletAddress ? walletAddress : '',
        ethers.utils.parseUnits(amount.toString(), fromToken.decimals),
        {
            enabled: false,
        }
    );

    const swapTx = async () => {
        const req = await swapQuery.refetch();
        if (req.isSuccess) {
            const data = req.data;
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
        return {};
    };

    return (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.Swap} />
                <GradientBorderWrapper>
                    <GradientBorderContent>
                        <SectionWrapper>
                            <Text className="text-s white">From:</Text>
                            <FlexDivRowCentered>
                                <Select
                                    options={preLoadTokens}
                                    formatOptionLabel={(option: any) => {
                                        return (
                                            <FlexDivRowCentered style={{ flex: 1 }}>
                                                <Image
                                                    src={option.logoURI}
                                                    style={{ width: 40, height: 40, marginRight: 6 }}
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

                                <NumericInput
                                    style={{ padding: 10, width: 150, textAlign: 'right' }}
                                    value={amount}
                                    onChange={(_, value) => {
                                        setAmount(value as any);
                                    }}
                                ></NumericInput>
                            </FlexDivRowCentered>
                        </SectionWrapper>
                        <SectionWrapper>
                            <Text className="text-s white">To:</Text>
                            <FlexDivRowCentered>
                                <Select
                                    options={preLoadTokens}
                                    formatOptionLabel={(option: any) => {
                                        return (
                                            <FlexDivRowCentered style={{ flex: 1 }}>
                                                <Image
                                                    src={option.logoURI}
                                                    style={{ width: 40, height: 40, marginRight: 6 }}
                                                ></Image>
                                                <Text className="text-xs white">{option.name}</Text>
                                            </FlexDivRowCentered>
                                        );
                                    }}
                                    value={toToken}
                                    onChange={(option: any) => {
                                        _setToToken(option);
                                    }}
                                ></Select>
                            </FlexDivRowCentered>
                        </SectionWrapper>
                        <SectionWrapper>
                            <Text className="text-s white">Preview: </Text>
                            <FlexDivColumn>
                                <Text className="text-xs white">
                                    Estimated Gas: {previewData ? gasPriceInWei(previewData.estimatedGas) : 0}
                                </Text>
                                <Text className="text-xs white">
                                    From Amount:{' '}
                                    {previewData
                                        ? ethers.utils.formatUnits(
                                              previewData?.fromTokenAmount,
                                              previewData.fromToken.decimals
                                          )
                                        : 0}
                                </Text>
                                <Text className="text-xs white">
                                    To Amount:{' '}
                                    {previewData
                                        ? ethers.utils.formatUnits(
                                              previewData?.toTokenAmount,
                                              previewData.toToken.decimals
                                          )
                                        : 0}
                                </Text>
                            </FlexDivColumn>
                        </SectionWrapper>

                        <Button
                            className="primary"
                            onClick={async () => {
                                quoteQuery.refetch();
                                const tx = await approveTx();
                                console.log(tx);
                                const txApp = await signer.sendTransaction(tx);
                                console.log(txApp);
                            }}
                        >
                            Approve
                        </Button>
                        <Button
                            className="primary"
                            onClick={async () => {
                                const tx = await swapTx();
                                console.log(tx);
                                const swapTrans = await signer.sendTransaction(tx);
                                console.log(swapTrans);
                            }}
                        >
                            Swap
                        </Button>
                    </GradientBorderContent>
                </GradientBorderWrapper>
            </Wrapper>
        </Background>
    );
};

const SectionWrapper = styled(FlexDivColumn)`
    margin: 20px 0;
    & > p {
        margin-bottom: 20px;
    }
`;

const Select = styled(ReactSelect)`
    flex: 1;
    max-width: 200px;
    .react-select__single-value,
    .react-select__single-value > div {
        padding: 0 !important;
    }
`;

const GradientBorderWrapper = styled.div`
    border-radius: 18px;
    background: linear-gradient(to right, #3936c7, #2d83d2, #23a5dd, #35dadb);
    margin-bottom: 6px;
`;

const GradientBorderContent = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    border-radius: 20px;
    min-width: 70px;
    background-color: #1c1a71;
    margin: 2px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    color: #f6f6fe;
    justify-content: space-between;
    width: 500px;
`;

export default Swap;
