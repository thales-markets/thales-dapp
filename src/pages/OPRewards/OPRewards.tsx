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
    Tip53Link,
    GuidelinesLink,
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
import { CRYPTO_CURRENCY_MAP, THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';

const UP_OP_REWARDS = 11000;
const DOWN_OP_REWARDS = 11000;
const RANGED_OP_REWARDS = 6000;
const UP_THALES_REWARDS = 20000;
const DOWN_THALES_REWARDS = 20000;
const RANGED_THALES_REWARDS = 10000;

const OPRewards: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState<string>('');

    const PERIOD_DURATION_IN_DAYS = 14;
    const START_DATE = new Date(2022, 6, 13, 14, 23, 0);
    const NOW = new Date();

    let CALCULATED_START = new Date(START_DATE.getTime());
    let PERIOD_COUNTER = 0;

    const options: Array<{ value: number; label: string }> = [];
    const periodRangeTimestamps = [];

    while (true) {
        if (CALCULATED_START.getTime() < NOW.getTime()) {
            periodRangeTimestamps.push({
                minTimestamp: CALCULATED_START.getTime() / 1000,
                maxTimestamp:
                    new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000).getTime() /
                    1000,
            });
            CALCULATED_START = new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000);
            if (PERIOD_COUNTER != 0) {
                options.push({
                    value: PERIOD_COUNTER,
                    label: `Round ${PERIOD_COUNTER}`,
                });
            }

            PERIOD_COUNTER++;
        } else {
            break;
        }
    }

    const [period, setPeriod] = useState<number>(options.length > 0 ? options[options.length - 1].value : 0);

    const minTimestamp = periodRangeTimestamps[period]?.minTimestamp || undefined;
    const maxTimestamp = periodRangeTimestamps[period]?.maxTimestamp || undefined;

    const usersAmmBuyVolumeQuery = useUsersAmmBuyVolumeQuery(networkId, period, { enabled: isAppReady });

    const tableData = useMemo(() => {
        if (usersAmmBuyVolumeQuery?.data && usersAmmBuyVolumeQuery?.isSuccess) {
            const transactions = usersAmmBuyVolumeQuery?.data;

            let data: Array<{
                account: string;
                upInfo: any;
                downInfo: any;
                rangedInfo: any;
                calculatedProtocolBonusForPeriod: string;
                totalRewards: number;
                sticky: boolean;
            }> = [];

            transactions.rewards.forEach((reward) => {
                data.push({
                    account: reward.address,
                    upInfo: reward.upInfo,
                    downInfo: reward.downInfo,
                    rangedInfo: reward.rangedInfo,
                    calculatedProtocolBonusForPeriod: reward.staking.toFixed(2),
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
    }, [minTimestamp, maxTimestamp, period, usersAmmBuyVolumeQuery?.data, searchQuery]);

    const summaryData = useMemo(() => {
        const upVolume = tableData.reduce((a, { upInfo }) => a + upInfo.volume, 0);
        const downVolume = tableData.reduce((a, { downInfo }) => a + downInfo.volume, 0);
        const rangedVolume = tableData.reduce((a, { rangedInfo }) => a + rangedInfo.volume, 0);

        const upOpRewardsPerVolume = (UP_OP_REWARDS / upVolume) * 1000;
        const downOpRewardsPerVolume = (DOWN_OP_REWARDS / downVolume) * 1000;
        const rangedOpRewardsPerVolume = (RANGED_OP_REWARDS / rangedVolume) * 1000;

        const upThalesRewardsPerVolume = (UP_THALES_REWARDS / upVolume) * 1000;
        const downThalesRewardsPerVolume = (DOWN_THALES_REWARDS / downVolume) * 1000;
        const rangedThalesRewardsPerVolume = (RANGED_THALES_REWARDS / rangedVolume) * 1000;

        return {
            upVolume,
            downVolume,
            rangedVolume,
            upOpRewardsPerVolume,
            downOpRewardsPerVolume,
            rangedOpRewardsPerVolume,
            upThalesRewardsPerVolume,
            downThalesRewardsPerVolume,
            rangedThalesRewardsPerVolume,
        };
    }, [tableData]);

    const isLoading = usersAmmBuyVolumeQuery.isLoading;

    return (
        <Wrapper>
            <Description>
                <Trans i18nKey={'op-rewards.description'} components={{ bold: <BoldText />, br: <br /> }}></Trans>
                <br />
                <Trans i18nKey={'op-rewards.description-2'} components={{ bold: <BoldText />, br: <br /> }}></Trans>
                <Trans
                    i18nKey={'op-rewards.description-3'}
                    components={{ bold: <BoldText />, br: <br />, tipLink: <Tip53Link /> }}
                ></Trans>
                .
                <Trans
                    i18nKey={'op-rewards.description-4'}
                    components={{ br: <br />, guidelinesLink: <GuidelinesLink /> }}
                ></Trans>
                .
            </Description>
            <HeaderWrapper>
                <RoundWrapper>
                    <SelectInput
                        options={options}
                        handleChange={(value) => setPeriod(Number(value))}
                        defaultValue={period - 1}
                        width={300}
                    />
                    {maxTimestamp &&
                        (NOW.getTime() < maxTimestamp * 1000 ? (
                            <RoundEndWrapper>
                                <RoundEndLabel>{t('op-rewards.round-end-label')}:</RoundEndLabel>
                                <TimeRemaining end={maxTimestamp * 1000} fontSize={20} showFullCounter />
                            </RoundEndWrapper>
                        ) : (
                            <RoundEndWrapper>
                                <RoundEndLabel>{t('op-rewards.round-ended-label')}</RoundEndLabel>
                            </RoundEndWrapper>
                        ))}
                </RoundWrapper>
                <SearchField text={searchQuery} handleChange={(value) => setSearchQuery(value)} />
            </HeaderWrapper>
            <SummaryWrapper>
                <SummaryInfo>
                    {`${t('op-rewards.up-volume-label')}: ${formatCurrencyWithSign(USD_SIGN, summaryData.upVolume)}`}
                    <Tooltip
                        message={t('op-rewards.volume-tooltip', {
                            op: formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, summaryData.upOpRewardsPerVolume),
                            thales: formatCurrencyWithKey(THALES_CURRENCY, summaryData.upThalesRewardsPerVolume),
                        })}
                        type={'info'}
                        iconColor={'var(--primary-color)'}
                        container={{ display: 'inline-block' }}
                        interactive={true}
                    />
                </SummaryInfo>
                <SummaryInfo>
                    {`${t('op-rewards.down-volume-label')}: ${formatCurrencyWithSign(
                        USD_SIGN,
                        summaryData.downVolume
                    )}`}
                    <Tooltip
                        message={t('op-rewards.volume-tooltip', {
                            op: formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, summaryData.downOpRewardsPerVolume),
                            thales: formatCurrencyWithKey(THALES_CURRENCY, summaryData.downThalesRewardsPerVolume),
                        })}
                        type={'info'}
                        iconColor={'var(--primary-color)'}
                        container={{ display: 'inline-block' }}
                        interactive={true}
                    />
                </SummaryInfo>
                <SummaryInfo>
                    {`${t('op-rewards.ranged-volume-label')}: ${formatCurrencyWithSign(
                        USD_SIGN,
                        summaryData.rangedVolume
                    )}`}
                    <Tooltip
                        message={t('op-rewards.volume-tooltip', {
                            op: formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, summaryData.rangedOpRewardsPerVolume),
                            thales: formatCurrencyWithKey(THALES_CURRENCY, summaryData.rangedThalesRewardsPerVolume),
                        })}
                        type={'info'}
                        iconColor={'var(--primary-color)'}
                        container={{ display: 'inline-block' }}
                        interactive={true}
                    />
                </SummaryInfo>
            </SummaryWrapper>
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
                        columns={[
                            {
                                Header: t('op-rewards.table.wallet-address'),
                                accessor: 'account',
                                Cell: (cellProps: any) => (
                                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                                        {walletAddress.toLowerCase() == cellProps.cell.value.toLowerCase()
                                            ? t('op-rewards.table.my-rewards')
                                            : truncateAddress(cellProps.cell.value)}
                                    </p>
                                ),
                                disableSortBy: true,
                            },
                            {
                                Header: t('op-rewards.table.up-info'),
                                accessor: 'upInfo',
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
                                sortType: upRewardsSort(),
                            },

                            {
                                Header: t('op-rewards.table.down-info'),
                                accessor: 'downInfo',
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
                                sortType: downRewardsSort(),
                            },
                            {
                                Header: t('op-rewards.table.ranged-info'),
                                accessor: 'rangedInfo',
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
                                sortType: rangedRewardsSort(),
                            },
                            {
                                Header: () => (
                                    <>
                                        {t('op-rewards.table.protocol-reward')}
                                        <Tooltip
                                            message={t('op-rewards.table.gamified-bonus-text')}
                                            type={'info'}
                                            iconColor={'var(--primary-color)'}
                                            container={{ display: 'inline-block' }}
                                            interactive={true}
                                        />
                                    </>
                                ),
                                accessor: 'calculatedProtocolBonusForPeriod',
                                Cell: (cellProps: any) => (
                                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                                        {cellProps.cell.value} OP
                                    </p>
                                ),
                            },
                            {
                                Header: t('op-rewards.table.total-rewards'),
                                accessor: 'totalRewards',
                                Cell: (cellProps: any) => (
                                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                                        <Trans
                                            i18nKey={'op-rewards.table.total-text'}
                                            values={{
                                                thales: Number(cellProps.cell.value.thales).toFixed(2),
                                                op: Number(cellProps.cell.value.op).toFixed(2),
                                            }}
                                            components={[<br key="0" />]}
                                        />
                                    </p>
                                ),
                                sortType: rewardsSort(),
                            },
                        ]}
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

const upRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.upInfo.rewards.op - rowB.original.upInfo.rewards.op;
};

const downRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.downInfo.rewards.op - rowB.original.downInfo.rewards.op;
};

const rangedRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.rangedInfo.rewards.op - rowB.original.rangedInfo.rewards.op;
};

export default OPRewards;
