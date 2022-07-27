import React, { useMemo, useState } from 'react';

import { BoldText, Description, HeaderWrapper, Wrapper, Tip53Link } from './styled-components';
import SelectInput from 'components/SelectInput';
import Table from 'components/TableV2';
import SearchField from 'components/TableInputs/SearchField';

import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { Trans, useTranslation } from 'react-i18next';
import useUsersAmmBuyVolumeQuery from 'queries/user/useUsersAmmBuyVolumeQuery';
import { truncateAddress } from 'utils/formatters/string';
import Tooltip from 'components/Tooltip';
import UserRewards from './components';

const OPRewards: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
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
            options.push({
                value: PERIOD_COUNTER,
                label: `${PERIOD_COUNTER} period`,
            });
            PERIOD_COUNTER++;
        } else {
            break;
        }
    }

    const [period, setPeriod] = useState<number>(options.length > 0 ? options[options.length - 1].value : 0);

    const minTimestamp = periodRangeTimestamps[period]?.minTimestamp || undefined;
    const maxTimestamp = periodRangeTimestamps[period]?.maxTimestamp || undefined;

    const usersAmmBuyVolumeQuery = useUsersAmmBuyVolumeQuery(networkId, period, { enabled: isAppReady });

    const [userData, setUserData] = useState<Array<any>>([]);

    const tableData = useMemo(() => {
        if (usersAmmBuyVolumeQuery?.data && usersAmmBuyVolumeQuery?.isSuccess) {
            const transactions = usersAmmBuyVolumeQuery?.data;

            let data: Array<{
                account: string;
                upInfo: string;
                downInfo: string;
                rangedInfo: string;
                calculatedProtocolBonusForPeriod: string;
                totalRewards: number;
            }> = [];

            transactions.rewards.forEach((reward) => {
                if (walletAddress === reward.address) {
                    setUserData([
                        {
                            account: reward.address,
                            upInfo: reward.upInfo,
                            downInfo: reward.downInfo,
                            rangedInfo: reward.rangedInfo,
                            calculatedProtocolBonusForPeriod: reward.staking.toFixed(2),
                            totalRewards: reward.totalRewards,
                        },
                    ]);
                }

                data.push({
                    account: reward.address,
                    upInfo: reward.upInfo,
                    downInfo: reward.downInfo,
                    rangedInfo: reward.rangedInfo,
                    calculatedProtocolBonusForPeriod: reward.staking.toFixed(2),
                    totalRewards: reward.totalRewards,
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
            </Description>
            <HeaderWrapper>
                <SelectInput
                    options={options}
                    handleChange={(value) => setPeriod(Number(value))}
                    defaultValue={period}
                    width={300}
                />
            </HeaderWrapper>
            <br />
            <SearchField text={searchQuery} handleChange={(value) => setSearchQuery(value)} />
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {isWalletConnected && <UserRewards userRewards={userData} />}
                    <Table
                        containerStyle={{
                            width: '100%',
                            maxWidth: '100%',
                        }}
                        data={tableData}
                        columns={[
                            {
                                Header: t('op-rewards.table.wallet-address'),
                                accessor: 'account',
                                Cell: (cellProps: any) => (
                                    <p style={{ width: '100%', textAlign: 'center' }}>
                                        {truncateAddress(cellProps.cell.value)}
                                    </p>
                                ),
                            },
                            {
                                Header: t('op-rewards.table.up-info'),
                                accessor: 'upInfo',
                                Cell: (cellProps: any) => (
                                    <p style={{ width: '100%', textAlign: 'center' }}>
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
                                    <p style={{ width: '100%', textAlign: 'center' }}>
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
                                    <p style={{ width: '100%', textAlign: 'center' }}>
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
                                Header: t('op-rewards.table.protocol-reward'),
                                accessor: 'calculatedProtocolBonusForPeriod',
                                Cell: (cellProps: any) => <p>{cellProps.cell.value} OP</p>,
                            },
                            {
                                Header: t('op-rewards.table.total-rewards'),
                                accessor: 'totalRewards',
                                Cell: (cellProps: any) => (
                                    <p style={{ width: '100%', textAlign: 'center' }}>
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
