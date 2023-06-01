import { useMatomo } from '@datapunt/matomo-tracker-react';
import Button from 'components/ButtonV2/Button';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import { USD_SIGN } from 'constants/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import { POSITIONS_TO_SIDE_MAP, Positions, SLIPPAGE_PERCENTAGE, getMaxGasLimitForNetwork } from 'constants/options';
import { ScreenSizeBreakpoint, getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';

import useUserOpenPositions, { UserLivePositions } from 'queries/user/useUserOpenPositions';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { FlexDivCentered } from 'theme/common';
import { ThemeInterface } from 'types/ui';
import { getEstimatedGasFees, getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrencyWithSign, formatNumberShort, roundNumberToDecimals } from 'utils/formatters/number';
import { getIsArbitrum, getIsBSC, getIsOVM, getIsPolygon } from 'utils/network';
import { refetchAmmData, refetchBalances, refetchRangedAmmData, refetchUserOpenPositions } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';

const OpenPositions: React.FC = () => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [submittingPosition, setSubmittingPosition] = useState('');

    const positionsQuery = useUserOpenPositions(networkId, walletAddress ?? '', {
        enabled: true,
        refetchInterval: 10000,
    }); // 10sec refetch
    const livePositions = useMemo(() => {
        if (positionsQuery.isSuccess) return positionsQuery.data;
        return [];
    }, [networkId, positionsQuery]);

    const isOVM = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);

    const handleSubmit = async (position: UserLivePositions) => {
        const isRangedMarket = [Positions.IN, Positions.OUT].includes(position.side);

        const fetchGasLimit = async (
            marketAddress: string,
            side: any,
            parsedAmount: any,
            parsedTotal: any,
            parsedSlippage: any
        ) => {
            try {
                const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                const contract = isRangedMarket ? rangedMarketAMMContract : ammContract;

                if (isOVM) {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                } else if (isBSC || isPolygon || isArbitrum) {
                    const gasLimit = await getEstimatedGasFees(
                        false,
                        false,
                        contract,
                        marketAddress,
                        side,
                        parsedAmount,
                        parsedTotal,
                        parsedSlippage,
                        undefined,
                        ''
                    );

                    const safeGasLimit = Math.round(Number(+gasLimit + 0.1 * +gasLimit));
                    setGasLimit(safeGasLimit);

                    return safeGasLimit;
                } else {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
                return null;
            }
        };

        const fetchAmmPriceData = async (totalToPay: number) => {
            let totalValueChanged = false;
            let latestGasLimit = null;

            if (position.market && totalToPay > 0) {
                try {
                    const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                    const contract = isRangedMarket ? rangedMarketAMMContract : ammContract;

                    const promises = isRangedMarket
                        ? [
                              getQuoteFromRangedAMM(
                                  false,
                                  false,
                                  contract,
                                  position.amountBigNumber,
                                  position.market,
                                  POSITIONS_TO_SIDE_MAP[position.side]
                              ),
                              0, // No price impact for ranged markets
                          ]
                        : getQuoteFromAMM(
                              false,
                              false,
                              contract,
                              position.amountBigNumber,
                              position.market,
                              POSITIONS_TO_SIDE_MAP[position.side]
                          );

                    const [ammQuotes]: Array<BigNumber> = await Promise.all(promises);

                    const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
                    latestGasLimit = await fetchGasLimit(
                        position.market,
                        POSITIONS_TO_SIDE_MAP[position.side],
                        position.amountBigNumber,
                        ammQuotes,
                        parsedSlippage
                    );

                    const ammPrice = stableCoinFormatter(ammQuotes, networkId, undefined) / position.amount;
                    // changes in cash out value less than 0.01 sUSD are not relevant
                    totalValueChanged =
                        roundNumberToDecimals(position.value, 3) !==
                        roundNumberToDecimals(ammPrice * position.amount, 3);
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                    totalValueChanged = true;
                }
            } else {
                setGasLimit(null);
            }

            return { totalValueChanged, latestGasLimit };
        };

        setSubmittingPosition(position.market + position.side);
        const id = toast.loading(t('amm.progress'));

        const { totalValueChanged, latestGasLimit } = await fetchAmmPriceData(position.paid);
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
            const gasPrice = await snxJSConnector.provider?.getGasPrice();

            const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

            const providerOptions = isPolygon
                ? {
                      gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                      gasPrice: ethers.utils.parseUnits(
                          Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                          'gwei'
                      ),
                  }
                : {
                      gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
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
                setGasLimit(null);

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
        let marketContract;
        if (position.side === Positions.UP || position.side === Positions.DOWN) {
            marketContract = new ethers.Contract(position.market, binaryOptionMarketContract.abi);
        } else {
            marketContract = new ethers.Contract(position.market, rangedMarketContract.abi);
        }

        if (marketContract && snxJSConnector.signer) {
            const marketContractWithSigner = marketContract.connect(snxJSConnector.signer);
            const id = toast.loading(t('amm.progress'));

            try {
                const tx = await marketContractWithSigner.exerciseOptions();
                await tx.wait();
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(`options.market.trade-options.place-order.swap-confirm-button.sell.confirmation-message`)
                    )
                );

                refetchBalances(walletAddress, networkId);
                refetchUserOpenPositions(walletAddress, networkId);
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            }
        }
    };

    const getPositionsList = (position: UserLivePositions, index: number) => {
        const getButton = (position: UserLivePositions) => {
            if (position.claimable && position.amount > 0) {
                return (
                    <Button
                        {...defaultButtonProps}
                        disabled={Number(position.value) === 0}
                        additionalStyles={additionalStyle}
                        backgroundColor={theme.button.textColor.quaternary}
                        onClick={() => handleExercise(position)}
                    >
                        {submittingPosition === position.market + position.side
                            ? t(`options.trade.user-positions.claim-win-progress`)
                            : t('options.trade.user-positions.claim-win')}
                        {' ' + formatCurrencyWithSign(USD_SIGN, position.value, 2)}
                    </Button>
                );
            }
            const today = new Date();
            if (position.maturityDate > today.getTime() / 1000 && position.value > 0) {
                return (
                    <Button
                        {...defaultButtonProps}
                        disabled={Number(position.value) === 0}
                        additionalStyles={additionalStyle}
                        onClick={() => handleSubmit(position)}
                    >
                        {submittingPosition === position.market + position.side
                            ? t(`options.trade.user-positions.cash-out-progress`)
                            : t('options.trade.user-positions.cash-out')}
                        {' ' + formatCurrencyWithSign(USD_SIGN, position.value, 2)}
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
                    <PositionsWrapper noPositions={!livePositions.length}>
                        {!!livePositions.length
                            ? livePositions.map((position, index) => getPositionsList(position, index))
                            : dummyPositions.map((position, index) => getPositionsList(position, index))}
                    </PositionsWrapper>
                    {!livePositions.length && (
                        <NoPositionsText>{t('options.trade.user-positions.no-positions')}</NoPositionsText>
                    )}
                </>
            )}
        </Wrapper>
    );
};

const dummyPositions: UserLivePositions[] = [
    {
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

const defaultButtonProps = {
    width: '100%',
    height: '27px',
};

const additionalStyle: CSSProperties = {
    maxWidth: '200px',
    fontWeight: 700,
    fontSize: '13px',
    lineHeight: '100%',
    textTransform: 'uppercase',
    border: 'none',
};

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
    font-size: 16px;
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
