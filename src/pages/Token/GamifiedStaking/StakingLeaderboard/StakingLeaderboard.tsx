import { TablePagination } from '@material-ui/core';
import Table from 'components/TableV3/Table';
import useStakersDataLeaderboardQuery from 'queries/token/useStakersDataLeaderboardQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties } from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { truncateAddress } from 'utils/formatters/string';
import snxJSConnector from 'utils/snxJSConnector';
import HighlightCard from './components/HighlightCard/HighlightCard';
import { ScreenSizeBreakpoint } from 'enums/ui';
import Loader from 'components/Loader/Loader';

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

    const highlightCardData = useMemo(() => {
        if (stakingData) {
            return stakingData.filter((staker) => staker.rank == 1 || staker.rank == 2 || staker.rank == 3);
        }

        return null;
    }, [stakingData]);

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
                                <TableText>{formatCurrencyWithKey('', row.userRoundBonusPoints, 2)}</TableText>
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
                                <TableText>{formatCurrencyWithKey('', row.stakingMultiplier, 2)}</TableText>
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
        <>
            {leaderboardQuery.isSuccess && (
                <Wrapper>
                    <BadgeContainer>
                        {highlightCardData && highlightCardData[1] && (
                            <HighlightCard
                                rank={highlightCardData[1].rank ? highlightCardData[1].rank : 0}
                                walletAddress={highlightCardData[1].id}
                                totalPoints={truncToDecimals(highlightCardData[1].userRoundBonusPoints, 2)}
                                totalRewards={highlightCardData[1].estimatedRewards}
                            />
                        )}
                        {highlightCardData && highlightCardData[0] && (
                            <HighlightCard
                                rank={highlightCardData[0].rank ? highlightCardData[0].rank : 0}
                                walletAddress={highlightCardData[0].id}
                                totalPoints={truncToDecimals(highlightCardData[0].userRoundBonusPoints, 2)}
                                totalRewards={highlightCardData[0].estimatedRewards}
                            />
                        )}
                        {highlightCardData && highlightCardData[2] && (
                            <HighlightCard
                                rank={highlightCardData[2].rank ? highlightCardData[2].rank : 0}
                                walletAddress={highlightCardData[2].id}
                                totalPoints={truncToDecimals(highlightCardData[2].userRoundBonusPoints, 2)}
                                totalRewards={highlightCardData[2].estimatedRewards}
                            />
                        )}
                    </BadgeContainer>
                    <Table
                        columns={columns}
                        data={stakingData}
                        tableRowStyles={RowStyle}
                        expandedRow={(row) => {
                            return (
                                <ExpandedRow>
                                    <FlexWrapper>
                                        <FlexDivCentered>
                                            <Icon className="sidebar-icon icon--markets" />
                                            <TableText>Trading</TableText>
                                        </FlexDivCentered>
                                        <FlexWrapper>
                                            <Label>Points</Label>
                                            <TableText>
                                                {formatCurrencyWithKey(
                                                    '',
                                                    row.original.userTradingBasePointsPerRound,
                                                    2
                                                )}
                                            </TableText>
                                        </FlexWrapper>
                                    </FlexWrapper>

                                    <FlexWrapper>
                                        <FlexDivCentered>
                                            <Icon className="sidebar-icon icon--liquidity-pool" />
                                            <TableText>LP</TableText>
                                        </FlexDivCentered>
                                        <FlexWrapper>
                                            <Label>Points</Label>
                                            <TableText>
                                                {formatCurrencyWithKey('', row.original.userLPBasePointsPerRound, 2)}
                                            </TableText>
                                        </FlexWrapper>
                                    </FlexWrapper>

                                    <FlexWrapper>
                                        <FlexDivCentered>
                                            <Icon className="sidebar-icon icon--vaults" />
                                            <TableText>VAULTS</TableText>
                                        </FlexDivCentered>
                                        <FlexWrapper>
                                            <Label>Points</Label>
                                            <TableText>
                                                {formatCurrencyWithKey('', row.original.userVaultBasePointsPerRound, 2)}
                                            </TableText>
                                        </FlexWrapper>
                                    </FlexWrapper>
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
            )}
            {leaderboardQuery.isLoading && <Loader />}
        </>
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
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const BadgeContainer = styled.div`
    margin: 20px 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
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

const Icon = styled.i`
    font-size: 32px;
    color: ${(props) => props.theme.textColor.primary};
    margin-right: 6px;
`;

const FlexWrapper = styled(FlexDivCentered)`
    flex-direction: column;
`;

const Label = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.455px;
    text-transform: capitalize;
    margin-top: 10px;
    margin-bottom: 5px;
`;
