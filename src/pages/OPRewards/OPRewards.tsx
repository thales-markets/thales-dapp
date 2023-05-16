import React, { useMemo, useState } from 'react';

import {
    BoldText,
    Description,
    HeaderWrapper,
    RoundWrapper,
    RoundEndWrapper,
    RoundEndLabel,
    SummaryWrapper,
    SummaryInfo,
    Wrapper,
    AddressLink,
} from './styled-components';
import SelectInput from 'components/SelectInput';
import Table from 'components/TableV2';
import SearchField from 'components/TableInputs/SearchField';

import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { Trans, useTranslation } from 'react-i18next';
import useUsersAmmBuyVolumeQuery from 'queries/user/useUsersAmmBuyVolumeQuery';
import { truncateAddress } from 'utils/formatters/string';
import Tooltip from 'components/Tooltip';
import TimeRemaining from 'components/TimeRemaining';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getEtherscanAddressLink } from 'utils/etherscan';
import ElectionsBanner from 'components/ElectionsBanner';

const THALES_REWARDS = [
    2000, // period 1
    2000, // period 2
    4000, // period 3
    4000, // period 4
    4000, // period 5
    4000, // period 6
    4000, // period 7
    4000, // period 8
    4000, // period 9
    4000, // period 10
    4000, // period 11
    4000, // period 12
    4000, // period 13
    4000, // period 14
    4000, // period 15
    4000, // period 16
    4000, // period 17
    4000, // period 18
    4000, // period 19
    4000, // period 20
];
const OP_REWARDS = [
    2000, // period 1
    2000, // period 2
    4000, // period 3
    4000, // period 4
    4000, // period 5
    4000, // period 6
    4000, // period 7
    4000, // period 8
    4000, // period 9
    4000, // period 10
    4000, // period 11
    4000, // period 12
    4000, // period 13
    4000, // period 14
    4000, // period 15
    4000, // period 16
    4000, // period 17
    4000, // period 18
    4000, // period 19
    4000, // period 20
];

const OPRewards: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState<string>('');

    const PERIOD_DURATION_IN_DAYS = 7;
    const START_DATE = new Date(Date.UTC(2023, 3, 26, 12, 23, 0));
    const NOW = new Date();

    let CALCULATED_START = new Date(START_DATE.getTime());
    let PERIOD_COUNTER = 1;

    const [period, setPeriod] = useState<number>(1);
    const [periodRangeTimestamps, setPeriodRangeTimestamps] = useState<any>();

    const options = useMemo(() => {
        const options: Array<{ value: number; label: string }> = [];
        const periodRangeTimestampsLocal: any = [];
        while (true) {
            if (CALCULATED_START.getTime() < NOW.getTime()) {
                periodRangeTimestampsLocal.push({
                    minTimestamp: CALCULATED_START.getTime() / 1000,
                    maxTimestamp:
                        new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000).getTime() /
                        1000,
                });
                CALCULATED_START = new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000);

                options.push({
                    value: PERIOD_COUNTER,
                    label: `Round ${PERIOD_COUNTER}`,
                });

                PERIOD_COUNTER++;
            } else {
                break;
            }
        }

        setPeriodRangeTimestamps(periodRangeTimestampsLocal);
        setPeriod(PERIOD_COUNTER - 1);
        return options;
    }, []);

    const usersAmmBuyVolumeQuery = useUsersAmmBuyVolumeQuery(networkId, period, { enabled: isAppReady });

    const tableData = useMemo(() => {
        if (usersAmmBuyVolumeQuery?.data && usersAmmBuyVolumeQuery?.isSuccess) {
            const transactions = usersAmmBuyVolumeQuery?.data;

            let data: Array<{
                account: string;
                itmInfo: any;
                otmInfo: any;
                totalRewards: number;
                sticky: boolean;
            }> = [];

            transactions.rewards.forEach((reward) => {
                data.push({
                    account: reward.address,
                    itmInfo: reward.itmInfo,
                    otmInfo: reward.otmInfo,
                    totalRewards: reward.totalRewards,
                    sticky: walletAddress.toLowerCase() == reward.address.toLowerCase() ? true : false,
                });
            });

            if (searchQuery !== '') {
                data = data.filter((entry) => {
                    return entry?.account.toLowerCase().includes(searchQuery.toLowerCase());
                });
            }

            return data;
        }

        return [];
    }, [period, usersAmmBuyVolumeQuery?.data, searchQuery, walletAddress]);

    const summaryData = useMemo(() => {
        const itmVolume = tableData.reduce((a, { itmInfo }) => a + itmInfo.volume, 0);
        const otmVolume = tableData.reduce((a, { otmInfo }) => a + otmInfo.volume, 0);

        const itmOpRewardsPerVolume = (OP_REWARDS[period - 1] / itmVolume) * 1000;
        const otmOpRewardsPerVolume = (OP_REWARDS[period - 1] / otmVolume) * 1000;

        const itmThalesRewardsPerVolume = (THALES_REWARDS[period - 1] / itmVolume) * 1000;
        const otmThalesRewardsPerVolume = (THALES_REWARDS[period - 1] / otmVolume) * 1000;

        return {
            itmVolume,
            otmVolume,
            itmOpRewardsPerVolume,
            otmOpRewardsPerVolume,
            itmThalesRewardsPerVolume,
            otmThalesRewardsPerVolume,
        };
    }, [tableData, period]);

    const isLoading = usersAmmBuyVolumeQuery.isLoading;

    const getColumns = () => {
        return [
            {
                Header: t('op-rewards.table.wallet-address'),
                accessor: 'account',
                Cell: (cellProps: any) => (
                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                        <AddressLink
                            href={getEtherscanAddressLink(networkId, cellProps.cell.value)}
                            target="_blank"
                            rel="noreferrer"
                            isHighlighted={walletAddress.toLowerCase() == cellProps.cell.value.toLowerCase()}
                        >
                            {walletAddress.toLowerCase() == cellProps.cell.value.toLowerCase()
                                ? t('op-rewards.table.my-rewards')
                                : truncateAddress(cellProps.cell.value)}
                        </AddressLink>
                    </p>
                ),
                disableSortBy: true,
            },
            {
                Header: t('op-rewards.table.itm-info'),
                accessor: 'itmInfo',
                Cell: (cellProps: any) => (
                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                        <Trans
                            i18nKey={'op-rewards.table.reward-text'}
                            values={{
                                thales: Number(cellProps.cell.value.rewards.thales).toFixed(2),
                                op: Number(cellProps.cell.value.rewards.op).toFixed(2),
                            }}
                            components={[<br key="0" />]}
                        />
                        <Tooltip
                            message={t('op-rewards.table.info-text', {
                                volume: Number(cellProps.cell.value.volume).toFixed(2),
                                percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(2),
                            })}
                            type={'info'}
                            iconColor={'var(--primary-color)'}
                            container={{ display: 'inline-block' }}
                            interactive={true}
                        />
                    </p>
                ),
                sortType: itmRewardsSort(),
                sortDescFirst: true,
            },

            {
                Header: t('op-rewards.table.otm-info'),
                accessor: 'otmInfo',
                Cell: (cellProps: any) => (
                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                        <Trans
                            i18nKey={'op-rewards.table.reward-text'}
                            values={{
                                thales: Number(cellProps.cell.value.rewards.thales).toFixed(2),
                                op: Number(cellProps.cell.value.rewards.op).toFixed(2),
                            }}
                            components={[<br key="0" />]}
                        />
                        <Tooltip
                            message={t('op-rewards.table.info-text', {
                                volume: Number(cellProps.cell.value.volume).toFixed(2),
                                percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(2),
                            })}
                            type={'info'}
                            iconColor={'var(--primary-color)'}
                            container={{ display: 'inline-block' }}
                            interactive={true}
                        />
                    </p>
                ),
                sortType: otmRewardsSort(),
                sortDescFirst: true,
            },
            {
                Header: t('op-rewards.table.total-rewards'),
                accessor: 'totalRewards',
                Cell: (cellProps: any) => (
                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                        <Trans
                            i18nKey={'op-rewards.table.reward-text'}
                            values={{
                                op: Number(cellProps.cell.value.op).toFixed(2),
                                thales: Number(cellProps.cell.value.thales).toFixed(2),
                            }}
                            components={[<br key="0" />]}
                        />
                    </p>
                ),
                sortType: rewardsSort(),
                sortDescFirst: true,
            },
        ];
    };

    const getSummaryInfo = () => {
        return (
            <>
                <SummaryInfo>
                    {`${t('op-rewards.itm-volume-label')}: ${formatCurrencyWithSign(USD_SIGN, summaryData.itmVolume)}`}
                </SummaryInfo>
                <SummaryInfo>
                    {`${t('op-rewards.otm-volume-label')}: ${formatCurrencyWithSign(USD_SIGN, summaryData.otmVolume)}`}
                </SummaryInfo>
            </>
        );
    };

    return (
        <Wrapper>
            <ElectionsBanner />
            <Description>
                <Trans i18nKey={'op-rewards.description'} components={{ bold: <BoldText />, br: <br /> }}></Trans>
                <Trans
                    i18nKey={'op-rewards.description-1'}
                    values={{
                        thales: THALES_REWARDS[period - 1].toLocaleString(),
                        op: OP_REWARDS[period - 1].toLocaleString(),
                    }}
                    components={{
                        bold: <BoldText />,
                        br: <br />,
                    }}
                ></Trans>
                <Trans i18nKey={'op-rewards.description-itm'} components={{ bold: <BoldText />, br: <br /> }}></Trans>
                <Trans i18nKey={'op-rewards.description-otm'} components={{ bold: <BoldText />, br: <br /> }}></Trans>
                <Trans i18nKey={'op-rewards.length-info'} components={{ bold: <BoldText />, br: <br /> }}></Trans>
            </Description>
            <HeaderWrapper>
                <RoundWrapper>
                    <SelectInput
                        options={options}
                        handleChange={(value) => setPeriod(Number(value))}
                        defaultValue={period - 1}
                        width={300}
                    />
                    {periodRangeTimestamps &&
                        periodRangeTimestamps[period - 1]?.maxTimestamp &&
                        (NOW.getTime() < periodRangeTimestamps[period - 1].maxTimestamp * 1000 ? (
                            <RoundEndWrapper>
                                <RoundEndLabel>{t('op-rewards.round-end-label')}:</RoundEndLabel>
                                <TimeRemaining
                                    end={periodRangeTimestamps[period - 1].maxTimestamp * 1000}
                                    fontSize={20}
                                    showFullCounter
                                    zIndex={0}
                                />
                            </RoundEndWrapper>
                        ) : (
                            <RoundEndWrapper>
                                <RoundEndLabel>{t('op-rewards.round-ended-label')}</RoundEndLabel>
                            </RoundEndWrapper>
                        ))}
                </RoundWrapper>
                <SearchField text={searchQuery} handleChange={(value) => setSearchQuery(value)} />
            </HeaderWrapper>
            <SummaryWrapper>{getSummaryInfo()}</SummaryWrapper>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Table
                        containerStyle={{
                            width: '100%',
                            maxWidth: '100%',
                        }}
                        data={tableData}
                        leaderboardView={true}
                        hasStickyRow={true}
                        columns={getColumns()}
                        initialState={{
                            sortBy: [
                                {
                                    id: 'totalRewards',
                                    desc: true,
                                },
                            ],
                        }}
                    />
                </>
            )}
        </Wrapper>
    );
};

const rewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.totalRewards.op - rowB.original.totalRewards.op;
};

const itmRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.itmInfo.rewards.op - rowB.original.itmInfo.rewards.op;
};

const otmRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.otmInfo.rewards.op - rowB.original.otmInfo.rewards.op;
};

export default OPRewards;
