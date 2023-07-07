import { TablePagination } from '@material-ui/core';
import Table from 'components/TableV3/Table';
import useStakersDataLeaderboardQuery from 'queries/token/useStakersDataLeaderboardQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties } from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { truncToDecimals } from 'utils/formatters/number';
import { truncateAddress } from 'utils/formatters/string';
import snxJSConnector from 'utils/snxJSConnector';

const StakingLeaderboard: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [period, setPeriod] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => setPage(0), [period]);

    useEffect(() => {
        const { stakingThalesContract } = snxJSConnector;

        stakingThalesContract?.periodsOfStaking().then((period: number) => {
            console.log(Number(period));
            setPeriod(period);
        });
    }, []);

    const leaderboardQuery = useStakersDataLeaderboardQuery(networkId, period, {
        enabled: period > 0,
    });

    const stakingData = useMemo(() => {
        if (leaderboardQuery.isSuccess && leaderboardQuery.data) {
            return leaderboardQuery.data;
        }
        return [];
    }, [leaderboardQuery.isSuccess, leaderboardQuery.data]);

    const columns = useMemo(() => {
        console.log('stakingData: ', stakingData);
        if (stakingData) {
            return [
                {
                    id: 'rank',
                    Header: <TableText> {t('thales-token.gamified-staking.rewards.leaderboard.rank')}</TableText>,

                    accessor: (row: any) => {
                        return (
                            <Rank>
                                <TableText>{row.rank}</TableText>
                            </Rank>
                        );
                    },
                },
                {
                    id: 'address',
                    Header: <TableText> {t('thales-token.gamified-staking.rewards.leaderboard.address')}</TableText>,

                    accessor: (row: any) => {
                        return (
                            <FirstCell>
                                <TableText>{truncateAddress(row.id, 5, 5)}</TableText>
                            </FirstCell>
                        );
                    },
                },
                {
                    id: 'points',
                    Header: <TableText> {t('thales-token.gamified-staking.rewards.leaderboard.points')}</TableText>,

                    accessor: (row: any) => {
                        return (
                            <Cell>
                                <TableText>{truncToDecimals(row.userRoundBonusPoints, 2)}</TableText>
                            </Cell>
                        );
                    },
                },
                {
                    id: 'multiplier',
                    Header: <TableText> {t('thales-token.gamified-staking.rewards.leaderboard.multiplier')}</TableText>,

                    accessor: (row: any) => {
                        return (
                            <Cell>
                                <TableText>{truncToDecimals(row.stakingMultiplier, 2)}</TableText>
                            </Cell>
                        );
                    },
                },
                {
                    id: 'rewards',
                    Header: <TableText> {t('thales-token.gamified-staking.rewards.leaderboard.rewards')}</TableText>,

                    accessor: (row: any) => {
                        return (
                            <LastCell>
                                <TableText>{row.estimatedRewards}</TableText>
                            </LastCell>
                        );
                    },
                },
            ];
        } else {
            return [];
        }
    }, [stakingData]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    return (
        <Wrapper>
            <Table
                columns={columns}
                data={stakingData}
                tableRowStyles={RowStyle}
                expandedRow={(row) => {
                    return (
                        <ExpandedRow>
                            <FlexDivColumn>
                                <TableText>Trading Volume</TableText>
                                <TableText>{row.original.userTradingBasePointsPerRound}</TableText>
                            </FlexDivColumn>

                            <FlexDivColumn>
                                <TableText>LP Volume</TableText>
                                <TableText>{row.original.userLPBasePointsPerRound}</TableText>
                            </FlexDivColumn>

                            <FlexDivColumn>
                                <TableText>VAULTS Volume</TableText>
                                <TableText>{row.original.userVaultBasePointsPerRound}</TableText>
                            </FlexDivColumn>
                        </ExpandedRow>
                    );
                }}
                currentPage={page}
                rowsPerPage={rowsPerPage}
                isLoading={leaderboardQuery.isLoading}
            ></Table>
            <PaginationWrapper
                rowsPerPageOptions={[10, 20, 50, 100]}
                count={stakingData.length ? stakingData.length : 0}
                labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Wrapper>
    );
};

export default StakingLeaderboard;

const PaginationWrapper = styled(TablePagination)`
    border: none !important;
    display: flex;
    width: 100%;
    height: auto;
    color: ${(props) => props.theme.textColor.primary} !important;
    .MuiToolbar-root {
        padding: 0;
        display: flex;
        .MuiSelect-icon {
            color: ${(props) => props.theme.textColor.primary} !important;
        }
    }
    .MuiIconButton-root.Mui-disabled {
        color: ${(props) => props.theme.textColor.secondary};
    }
    .MuiTablePagination-toolbar > .MuiTablePagination-caption:last-of-type {
        display: block;
    }
    .MuiTablePagination-input {
        margin-top: 2px;
    }
    .MuiTablePagination-selectRoot {
        @media (max-width: 767px) {
            margin-left: 0px;
            margin-right: 0px;
        }
    }
`;

const RowStyle: CSSProperties = {
    height: 60,
    justifyContent: 'center',
    width: '100%',
    borderRadius: 0,
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 1080px;
`;

const ExpandedRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const TableText = styled.p`
    color: #fff;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
`;

const Rank = styled.div`
    width: 50px;
    height: 50px;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Cell = styled.div`
    height: 50px;
    border-top: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-bottom: 1px solid ${(props) => props.theme.borderColor.tertiary};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 50px;
    min-width: 250px;
`;

const FirstCell = styled(Cell)`
    border-left: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    margin-left: 10px;
`;

const LastCell = styled(Cell)`
    border-right: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
`;

// const DummyData = [
//     {
//         rank: 1,
//         address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
//         points: '5000',
//         multiplier: '1.5',
//         rewards: '500',
//     },
//     {
//         rank: 2,
//         address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
//         points: '5000',
//         multiplier: '1.5',
//         rewards: '500',
//     },
//     {
//         rank: 3,
//         address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
//         points: '5000',
//         multiplier: '1.5',
//         rewards: '500',
//     },
//     {
//         rank: 4,
//         address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
//         points: '5000',
//         multiplier: '1.5',
//         rewards: '500',
//     },
//     {
//         rank: 5,
//         address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
//         points: '5000',
//         multiplier: '1.5',
//         rewards: '500',
//     },
// ];
