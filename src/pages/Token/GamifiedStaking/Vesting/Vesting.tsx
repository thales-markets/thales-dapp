import Button from 'components/Button/Button';
import TileTable from 'components/TileTable';
import { TileRow } from 'components/TileTable/TileTable';
import ValidationMessage from 'components/ValidationMessage';
import { THALES_CURRENCY } from 'constants/currency';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { ethers } from 'ethers';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { ButtonContainer, Line } from 'pages/Token/styled-components';
import useUserVestingDataQuery from 'queries/token/useUserVestingDataQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { UserVestingData } from 'types/token';
import { ThemeInterface } from 'types/ui';
import { formatHoursAndMinutesFromTimestamp, formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { refetchTokenQueries } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import YourTransactions from './Transactions';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';

const Vesting: React.FC = () => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const { escrowThalesContract } = snxJSConnector as any;
    const [lastValidUserVestingData, setLastValidUserVestingData] = useState<UserVestingData | undefined>(undefined);

    const userVestingDataQuery = useUserVestingDataQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (userVestingDataQuery.isSuccess && userVestingDataQuery.data) {
            setLastValidUserVestingData(userVestingDataQuery.data);
        }
    }, [userVestingDataQuery.isSuccess, userVestingDataQuery.data]);

    const userVestingData: UserVestingData | undefined = useMemo(() => {
        if (userVestingDataQuery.isSuccess && userVestingDataQuery.data) {
            return userVestingDataQuery.data;
        }
        return lastValidUserVestingData;
    }, [userVestingDataQuery.isSuccess, userVestingDataQuery.data, lastValidUserVestingData]);

    const scheduleData = userVestingData ? userVestingData.vestingSchedule : [];
    const claimable = userVestingData ? userVestingData.claimable : 0;
    const rawClaimable = userVestingData ? userVestingData.rawClaimable : '0';

    const generateRows = (data: any[]) => {
        const sortedData = data.sort((a, b) => a.date - b.date);
        const rows: TileRow[] = sortedData.map((row) => {
            return {
                cells: [
                    { value: row.date },
                    {
                        value: `${formatCurrencyWithKey(THALES_CURRENCY, row.amount)}`,
                        valueFontSize: isMobile ? 12 : 15,
                    },
                ],
                heightSmall: true,
            };
        });

        return rows;
    };

    useEffect(() => {
        const fetchL1Fee = async (escrowThalesContractWithSigner: any, toVest: any) => {
            const txRequest = await escrowThalesContractWithSigner.populateTransaction.vest(toVest);
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            try {
                const escrowThalesContractWithSigner = escrowThalesContract.connect((snxJSConnector as any).signer);

                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        escrowThalesContractWithSigner.estimateGas.vest(rawClaimable),
                        fetchL1Fee(escrowThalesContractWithSigner, rawClaimable),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await escrowThalesContractWithSigner.estimateGas.vest(rawClaimable);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || !+claimable || !escrowThalesContract) return;
        fetchGasLimit();
    }, [isWalletConnected, walletAddress, claimable, escrowThalesContract]);

    const handleVest = async () => {
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setTxErrorMessage(null);
            setIsClaiming(true);
            const escrowThalesContractWithSigner = escrowThalesContract.connect((snxJSConnector as any).signer);

            const tx = (await escrowThalesContractWithSigner.vest(rawClaimable, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            })) as ethers.ContractTransaction;
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(t('options.earn.gamified-staking.vesting.vest.confirmation-message'), id)
                );
                refetchTokenQueries(walletAddress, networkId);
                setIsClaiming(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsClaiming(false);
        }
    };

    const getVestButton = () => {
        const disabled = isClaiming || !+claimable;
        return (
            <Button onClick={handleVest} disabled={disabled} width="auto">
                {!isClaiming
                    ? t('options.earn.gamified-staking.vesting.vest.vest') +
                      ` ${formatCurrencyWithKey(THALES_CURRENCY, claimable)}`
                    : t('options.earn.gamified-staking.vesting.vest.vesting') +
                      ` ${formatCurrencyWithKey(THALES_CURRENCY, claimable)}...`}
            </Button>
        );
    };

    return (
        <>
            <SectionWrapper columns={7}>
                <SectionContentWrapper>
                    <SectionLabel>
                        <SectionLabelContent>
                            {t('options.earn.gamified-staking.vesting.vest.available-to-vest')}
                        </SectionLabelContent>
                    </SectionLabel>
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, claimable, 0, true)}
                        </SectionValueContent>
                    </SectionValue>
                    <NetworkFeesWrapper>
                        <Line margin={isMobile ? '0 0 10px 0' : '10px 0'} />
                        <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                    </NetworkFeesWrapper>
                    <ButtonContainer>{getVestButton()}</ButtonContainer>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </SectionContentWrapper>
            </SectionWrapper>

            <SectionWrapper columns={5} startColumn={8} rows={3} background={false}>
                <SectionContentWrapper>
                    <ScheduleLabel>
                        <ScheduleLabelContent>
                            {t('options.earn.gamified-staking.vesting.schedule-label')}
                        </ScheduleLabelContent>
                    </ScheduleLabel>
                    <TileTable
                        firstColumnRenderer={(row: TileRow | string) => <SchedulerFirstColumn value={row} />}
                        rows={generateRows(scheduleData)}
                        isLoading={userVestingDataQuery.isLoading}
                        noResultsMessage={
                            scheduleData.length === 0
                                ? t(`options.earn.gamified-staking.vesting.schedule-no-results`)
                                : undefined
                        }
                        defaultFlowColor={theme.background.quaternary}
                    />
                </SectionContentWrapper>
            </SectionWrapper>

            <YourTransactions gridColumns={isMobile ? 12 : 7} />
        </>
    );
};

const SchedulerFirstColumn: React.FC<{ value: TileRow | string }> = ({ value }) => {
    if (typeof value !== 'string') {
        return (
            <DateTimeContainer>
                <Date>{formatShortDate(Number(value?.cells[0]?.value))}</Date>
                <Time>{formatHoursAndMinutesFromTimestamp(Number(value?.cells[0]?.value))}</Time>
            </DateTimeContainer>
        );
    }
    return <>{value}</>;
};

const SectionWrapper = styled.section<{
    columns?: number;
    rows?: number;
    startColumn?: number;
    marginTop?: number;
    background?: boolean;
}>`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: ${(props) =>
        `${props.startColumn ? props.startColumn + ' / ' : ''} span ${props.columns ? props.columns : 4}`};
    ${(props) => (props.rows ? 'display: grid; grid-template-columns: 1fr; grid-auto-rows: 1fr; grid-gap: 24px;' : '')}
    grid-row: span ${(props) => (props.rows ? props.rows : 1)};
    padding: 2px;
    background: ${(props) => (props.background ?? true ? props.theme.borderColor.primary : 'none')};
    ${(props) => (props.marginTop ? `margin-top: ${props.marginTop}px;` : '')};

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        grid-column: span 12;
    }
`;

const SectionContentWrapper = styled.div<{ background?: boolean }>`
    position: relative;
    background: ${(props) => (props.background ?? true ? props.theme.background.primary : 'none')};
    border-radius: 15px;
    align-items: center;
    text-align: center;
    padding: 10px 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px;
    }
`;

const SectionContent = styled.span`
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;

const ScheduleLabel = styled.div`
    display: flex;
    padding-bottom: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding-bottom: 10px;
    }
`;

const ScheduleLabelContent = styled(SectionContent)`
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 16px;
    }
`;

const SectionLabel = styled.div`
    padding-bottom: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding-bottom: 10px;
    }
`;

const SectionLabelContent = styled(SectionContent)`
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

const SectionValue = styled.div`
    padding-bottom: 10px;
`;

const SectionValueContent = styled(SectionContent)`
    letter-spacing: 0.035em;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 30px;
    color: ${(props) => props.theme.textColor.quaternary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 20px;
    }
`;

const NetworkFeesWrapper = styled.div`
    margin: 0 80px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: auto;
    }
`;

const DateTimeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.textColor.primary};
    min-width: 120px;
`;

const Date = styled.span`
    display: block;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

const Time = styled.span`
    display: block;
    font-weight: 300;
    font-size: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

export default Vesting;
