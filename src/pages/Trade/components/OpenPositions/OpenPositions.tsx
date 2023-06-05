import { useMatomo } from '@datapunt/matomo-tracker-react';
import Button from 'components/ButtonV2/Button';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import { USD_SIGN } from 'constants/currency';
import { ZERO_ADDRESS } from 'constants/network';
import { POSITIONS_TO_SIDE_MAP, Positions, SLIPPAGE_PERCENTAGE, getMaxGasLimitForNetwork } from 'constants/options';
import { ScreenSizeBreakpoint, getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';
import useUserOpenPositions from 'queries/user/useUserOpenPositions';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { FlexDivCentered } from 'theme/common';
import { UserLivePositions } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrencyWithSign, formatNumberShort, roundNumberToDecimals } from 'utils/formatters/number';
import { refetchAmmData, refetchBalances, refetchRangedAmmData, refetchUserOpenPositions } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';

const OpenPositions: React.FC = () => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [submittingPosition, setSubmittingPosition] = useState('');

    const positionsQuery = useUserOpenPositions(networkId, walletAddress ?? '', {
        enabled: isAppReady && isWalletConnected,
    });

    const livePositions = useMemo(() => (positionsQuery.isSuccess && positionsQuery.data ? positionsQuery.data : []), [
        positionsQuery,
    ]);

    const handleSubmit = async (position: UserLivePositions) => {
        const isRangedMarket = [Positions.IN, Positions.OUT].includes(position.side);

        const fetchAmmPriceData = async (totalToPay: number) => {
            let totalValueChanged = false;

            if (position.market && totalToPay > 0) {
                try {
                    const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                    const contract = isRangedMarket ? rangedMarketAMMContract : ammContract;

                    const promises = isRangedMarket
                        ? getQuoteFromRangedAMM(
                              false,
                              false,
                              contract,
                              position.amountBigNumber,
                              position.market,
                              POSITIONS_TO_SIDE_MAP[position.side]
                          )
                        : getQuoteFromAMM(
                              false,
                              false,
                              contract,
                              position.amountBigNumber,
                              position.market,
                              POSITIONS_TO_SIDE_MAP[position.side]
                          );

                    const [ammQuotes]: Array<BigNumber> = await Promise.all(promises);

                    const ammPrice = stableCoinFormatter(ammQuotes, networkId, undefined) / position.amount;
                    // changes in cash out value less than 0.01 sUSD are not relevant
                    totalValueChanged =
                        roundNumberToDecimals(position.value, 3) !==
                        roundNumberToDecimals(ammPrice * position.amount, 3);
                } catch (e) {
                    console.log(e);
                    totalValueChanged = true;
                }
            }

            return totalValueChanged;
        };

        setSubmittingPosition(position.positionAddress);
        const id = toast.loading(t('amm.progress'));

        const totalValueChanged = await fetchAmmPriceData(position.paid);
        if (totalValueChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setSubmittingPosition('');
            refetchUserOpenPositions(walletAddress, networkId);
            return;
        }
        try {
            const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = (isRangedMarket ? rangedMarketAMMContract : ammContract).connect(signer);

            const parsedTotal = stableCoinParser(position.value.toString(), networkId);
            const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());

            const providerOptions = {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            };

            const tx: ethers.ContractTransaction = await prepareTransactionForAMM(
                false,
                false,
                ammContractWithSigner,
                position.market,
                POSITIONS_TO_SIDE_MAP[position.side],
                position.amountBigNumber,
                parsedTotal,
                parsedSlippage,
                undefined,
                '',
                providerOptions
            );

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(`options.market.trade-options.place-order.swap-confirm-button.sell.confirmation-message`)
                    )
                );

                refetchBalances(walletAddress, networkId);
                isRangedMarket
                    ? refetchRangedAmmData(walletAddress, position.market, networkId)
                    : refetchAmmData(walletAddress, position.market);
                refetchUserOpenPositions(walletAddress, networkId);

                setSubmittingPosition('');

                trackEvent({
                    category: isRangedMarket ? 'RangeAMM' : 'AMM',
                    action: 'sell-to-amm',
                });
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setSubmittingPosition('');
        }
    };

    const handleExercise = async (position: UserLivePositions) => {
        const isRangedMarket = [Positions.IN, Positions.OUT].includes(position.side);
        const marketContract = new ethers.Contract(
            position.market,
            isRangedMarket ? rangedMarketContract.abi : binaryOptionMarketContract.abi
        );

        if (marketContract && snxJSConnector.signer) {
            setSubmittingPosition(position.positionAddress);
            const marketContractWithSigner = marketContract.connect(snxJSConnector.signer);
            const id = toast.loading(t('amm.progress'));

            try {
                const providerOptions = {
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                };
                const tx = (isRangedMarket
                    ? await marketContractWithSigner.exercisePositions(providerOptions)
                    : await marketContractWithSigner.exerciseOptions(providerOptions)) as ethers.ContractTransaction;

                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t(`options.market.trade-card.maturity.confirm-button.confirmation-message`)
                        )
                    );
                    refetchBalances(walletAddress, networkId);
                    refetchUserOpenPositions(walletAddress, networkId);
                    setSubmittingPosition('');
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setSubmittingPosition('');
            }
        }
    };

    const noPositions = livePositions.length === 0;
    const positions = noPositions ? dummyPositions : livePositions;

    const getPositionsList = (position: UserLivePositions, index: number) => {
        const getButton = (position: UserLivePositions) => {
            if (position.claimable && position.amount > 0) {
                return (
                    <Button
                        {...defaultButtonProps}
                        disabled={submittingPosition === position.positionAddress}
                        additionalStyles={additionalButtonStyle}
                        backgroundColor={theme.button.textColor.quaternary}
                        onClick={() => handleExercise(position)}
                    >
                        {`${
                            submittingPosition === position.positionAddress
                                ? t(`options.trade.user-positions.claim-win-progress`)
                                : t('options.trade.user-positions.claim-win')
                        } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                    </Button>
                );
            }
            const today = new Date();
            if (position.maturityDate > today.getTime() / 1000 && position.value > 0) {
                return (
                    <Button
                        {...defaultButtonProps}
                        disabled={submittingPosition === position.positionAddress}
                        additionalStyles={additionalButtonStyle}
                        onClick={() => handleSubmit(position)}
                    >
                        {`${
                            submittingPosition === position.positionAddress
                                ? t(`options.trade.user-positions.cash-out-progress`)
                                : t('options.trade.user-positions.cash-out')
                        } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                    </Button>
                );
            }
            if (position.maturityDate > today.getTime() / 1000 && position.value === 0) {
                return (
                    <>
                        <Separator />
                        <FlexContainer style={{ minWidth: 200 }}>
                            <Label>{t('options.trade.user-positions.results')}</Label>
                            <TimeRemaining fontSize={13} end={position.maturityDate} />
                        </FlexContainer>
                    </>
                );
            }
        };

        return (
            <Position key={index}>
                <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
                <AlignedFlex>
                    <FlexContainer>
                        <Label>{`${position.currencyKey}`}</Label>
                        <Value>{position.strikePrice}</Value>
                    </FlexContainer>
                    <Separator />
                    <FlexContainer>
                        <Label>{t('options.trade.user-positions.end-date')}</Label>
                        <Value>{formatShortDateWithTime(position.maturityDate)}</Value>
                    </FlexContainer>
                    <Separator />
                    <FlexContainer>
                        <Label>{t('options.trade.user-positions.size')}</Label>
                        <Value>{`${formatNumberShort(position.amount)}  ${position.side}`}</Value>
                    </FlexContainer>
                    <Separator />
                    <FlexContainer>
                        <Label>{t('options.trade.user-positions.paid')}</Label>
                        <Value>{formatCurrencyWithSign(USD_SIGN, position.paid, 2)}</Value>
                    </FlexContainer>
                </AlignedFlex>
                {getButton(position)}
            </Position>
        );
    };

    return (
        <Wrapper>
            <Title>{t('options.trade.user-positions.your-positions')}</Title>
            {positionsQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <>
                    <PositionsWrapper noPositions={noPositions}>
                        {positions.map((position, index) => getPositionsList(position, index))}
                    </PositionsWrapper>
                    {noPositions && <NoPositionsText>{t('options.trade.user-positions.no-positions')}</NoPositionsText>}
                </>
            )}
        </Wrapper>
    );
};

const dummyPositions: UserLivePositions[] = [
    {
        positionAddress: ZERO_ADDRESS,
        market: '0x1',
        currencyKey: 'BTC',
        amount: 15,
        amountBigNumber: BigNumber.from('15'),
        paid: 100,
        maturityDate: 1684483200000,
        strikePrice: '$ 25,000.00',
        side: Positions.UP,
        value: 0,
    },
    {
        positionAddress: ZERO_ADDRESS,
        market: '0x2',
        currencyKey: 'BTC',
        amount: 10,
        amountBigNumber: BigNumber.from('10'),
        paid: 200,
        maturityDate: 1684483200000,
        strikePrice: '$ 35,000.00',
        side: Positions.DOWN,
        value: 0,
    },
];

const defaultButtonProps = {
    width: '100%',
    height: '27px',
    fontSize: '13px',
};

const additionalButtonStyle: CSSProperties = {
    maxWidth: '200px',
    lineHeight: '100%',
    border: 'none',
};

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding-bottom: 20px;
`;

const PositionsWrapper = styled.div<{ noPositions?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    max-height: 560px;
    ${(props) => (props.noPositions ? 'filter: blur(10px);' : '')}
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        overflow: auto;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    margin-bottom: 10px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
`;

const Position = styled.div`
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    min-height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 17px;
    gap: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 172px;
        padding: 10px 10px;
        margin-bottom: 10px;
        gap: 10px;
    }
`;

const Icon = styled.i`
    font-size: 31px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 6px;
    }
`;

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    justify-content: center;
    &:first-child {
        min-width: 195px;
        max-width: 195px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        gap: 4px;
    }
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

const Value = styled(Label)`
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;

const NoPositionsText = styled.span`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-weight: 600;
    font-size: 15px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    min-width: max-content;
`;

const Separator = styled.div`
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 200px;
    width: 100%;
`;

export default OpenPositions;
