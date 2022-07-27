import Table from 'components/TableV2';
import Tooltip from 'components/Tooltip';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { truncateAddress } from 'utils/formatters/string';

import { Wrapper } from './styled-components';

type UserRewardsProps = {
    userRewards: any;
};

const UserRewards: React.FC<UserRewardsProps> = (userRewards) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const noUserRewards = [
        {
            account: walletAddress,
            info: t('op-rewards.table.no-rewards-info'),
        },
    ];

    return (
        <Wrapper>
            {userRewards.userRewards.length > 0 ? (
                <Table
                    containerStyle={{
                        width: '100%',
                        maxWidth: '100%',
                    }}
                    hidePagination
                    data={userRewards.userRewards}
                    columns={[
                        {
                            Header: t('op-rewards.table.my-wallet-address'),
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
                                    {cellProps.cell.value !== 0 ? (
                                        <>
                                            {' '}
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
                                                    percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(
                                                        2
                                                    ),
                                                })}
                                                type={'info'}
                                                iconColor={'var(--primary-color)'}
                                                container={{ display: 'inline-block' }}
                                                interactive={true}
                                            />
                                        </>
                                    ) : (
                                        cellProps.cell.value
                                    )}
                                </p>
                            ),
                            disableSortBy: true,
                        },
                        {
                            Header: t('op-rewards.table.down-info'),
                            accessor: 'downInfo',
                            Cell: (cellProps: any) => (
                                <p style={{ width: '100%', textAlign: 'center' }}>
                                    {cellProps.cell.value !== 0 ? (
                                        <>
                                            {' '}
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
                                                    percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(
                                                        2
                                                    ),
                                                })}
                                                type={'info'}
                                                iconColor={'var(--primary-color)'}
                                                container={{ display: 'inline-block' }}
                                                interactive={true}
                                            />
                                        </>
                                    ) : (
                                        cellProps.cell.value
                                    )}
                                </p>
                            ),
                            disableSortBy: true,
                        },
                        {
                            Header: t('op-rewards.table.ranged-info'),
                            accessor: 'rangedInfo',
                            Cell: (cellProps: any) => (
                                <p style={{ width: '100%', textAlign: 'center' }}>
                                    {cellProps.cell.value !== 0 ? (
                                        <>
                                            {' '}
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
                                                    percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(
                                                        2
                                                    ),
                                                })}
                                                type={'info'}
                                                iconColor={'var(--primary-color)'}
                                                container={{ display: 'inline-block' }}
                                                interactive={true}
                                            />
                                        </>
                                    ) : (
                                        cellProps.cell.value
                                    )}
                                </p>
                            ),
                            disableSortBy: true,
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
                        },
                    ]}
                />
            ) : (
                <Table
                    containerStyle={{
                        width: '100%',
                        maxWidth: '100%',
                    }}
                    hidePagination
                    data={noUserRewards}
                    columns={[
                        {
                            Header: t('op-rewards.table.my-wallet-address'),
                            accessor: 'account',
                            Cell: (cellProps: any) => (
                                <p style={{ width: '100%', textAlign: 'center' }}>
                                    {truncateAddress(cellProps.cell.value)}
                                </p>
                            ),
                            disableSortBy: true,
                        },
                        {
                            accessor: 'info',
                            Cell: (cellProps: any) => (
                                <p style={{ width: '100%', textAlign: 'center' }}>{cellProps.cell.value}</p>
                            ),
                            disableSortBy: true,
                        },
                    ]}
                />
            )}
        </Wrapper>
    );
};

export default UserRewards;
