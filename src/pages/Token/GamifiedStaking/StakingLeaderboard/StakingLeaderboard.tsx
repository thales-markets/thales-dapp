import { TablePagination } from '@material-ui/core';
import Table from 'components/Table/Table';
import useStakersDataLeaderboardQuery from 'queries/token/useStakersDataLeaderboardQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties, useTheme } from 'styled-components';
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
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [period, setPeriod] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();

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

    const stickyRowInfo = useMemo(() => {
        if (stakingData) {
            return stakingData.filter((staker) => staker.id.toLowerCase() === walletAddress.toLowerCase());
        }

        return [];
    }, [stakingData]);

    const columns = useMemo(() => {
        if (stakingData) {
            return [
                {
                    id: 'rank',
                    Header: <HeaderText> {t('thales-token.gamified-staking.rewards.leaderboard.rank')}</HeaderText>,
                },
                {
                    id: 'address',
                    Header: <HeaderText> {t('thales-token.gamified-staking.rewards.leaderboard.address')}</HeaderText>,

                    accessor: (row: any) => {
                        return (
                            <Cell>
                                <TableText>{truncateAddress(row.id, 5, 5)}</TableText>
                            </Cell>
                        );
                    },
                },
                {
                    id: 'points',
                    Header: <HeaderText> {t('thales-token.gamified-staking.rewards.leaderboard.points')}</HeaderText>,

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
                    Header: (
                        <Cell hide={true}>
                            <HeaderText>{t('thales-token.gamified-staking.rewards.leaderboard.multiplier')}</HeaderText>
                        </Cell>
                    ),

                    accessor: (row: any) => {
                        return (
                            <Cell hide={true}>
                                <TableText>{formatCurrencyWithKey('', row.stakingMultiplier, 2)}</TableText>
                            </Cell>
                        );
                    },
                },
                {
                    id: 'rewards',
                    Header: <HeaderText> {t('thales-token.gamified-staking.rewards.leaderboard.rewards')}</HeaderText>,

                    accessor: (row: any) => {
                        return (
                            <Cell>
                                <TableText>{row.estimatedRewards}</TableText>
                            </Cell>
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
                        tableRowWrapperStyles={{ ...RowStyle, border: `1px solid ${theme.borderColor.tertiary}` }}
                        tableRowCellStyles={{ ...CellStyle }}
                        expandedRow={(row) => {
                            return (
                                <ExpandedRow>
                                    <FlexWrapper>
                                        <FlexDivCentered>
                                            <Icon className="sidebar-icon icon--markets" />
                                            <TableText>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.leaderboard.expanded-row.trading'
                                                )}
                                            </TableText>
                                        </FlexDivCentered>
                                        <FlexWrapper>
                                            <Label>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.leaderboard.expanded-row.points'
                                                )}
                                            </Label>
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
                                            <TableText>
                                                {t('thales-token.gamified-staking.rewards.leaderboard.expanded-row.lp')}
                                            </TableText>
                                        </FlexDivCentered>
                                        <FlexWrapper>
                                            <Label>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.leaderboard.expanded-row.points'
                                                )}
                                            </Label>
                                            <TableText>
                                                {formatCurrencyWithKey('', row.original.userLPBasePointsPerRound, 2)}
                                            </TableText>
                                        </FlexWrapper>
                                    </FlexWrapper>

                                    <FlexWrapper>
                                        <FlexDivCentered>
                                            <Icon className="sidebar-icon icon--vaults" />
                                            <TableText>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.leaderboard.expanded-row.vaults'
                                                )}
                                            </TableText>
                                        </FlexDivCentered>
                                        <FlexWrapper>
                                            <Label>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.leaderboard.expanded-row.points'
                                                )}
                                            </Label>
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
                        stickyRow={
                            stickyRowInfo.length > 0 ? (
                                <StickyRow>
                                    <Rank>
                                        <TableText>{stickyRowInfo[0].rank}</TableText>
                                    </Rank>
                                    <StickyCell first={true}>
                                        <TableText>{truncateAddress(stickyRowInfo[0].id, 5, 5)}</TableText>
                                    </StickyCell>
                                    <StickyCell>
                                        <TableText>
                                            {formatCurrencyWithKey('', stickyRowInfo[0].userRoundBonusPoints, 2)}
                                        </TableText>
                                    </StickyCell>
                                    <StickyCell hide={true}>
                                        <TableText>
                                            {formatCurrencyWithKey('', stickyRowInfo[0].stakingMultiplier, 2)}
                                        </TableText>
                                    </StickyCell>
                                    <StickyCell last={true}>
                                        <TableText>{stickyRowInfo[0].estimatedRewards}</TableText>
                                    </StickyCell>
                                </StickyRow>
                            ) : (
                                <></>
                            )
                        }
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
    display: flex !important;
    width: 100%;
    justify-content: flex-end;
    height: auto;
    color: ${(props) => props.theme.borderColor.tertiary} !important;
    .MuiToolbar-root {
        padding: 0;
        display: flex;
        .MuiSelect-icon {
            color: ${(props) => props.theme.borderColor.tertiary} !important;
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
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: '8px',
};

const CellStyle: CSSProperties = {
    width: '100%',
    flex: '1',
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
    border-top: 1px solid ${(props) => props.theme.borderColor.tertiary};
    padding: 20px;
    margin: auto;
    width: calc(100% - 30px);
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
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
    }
`;

const HeaderText = styled(TableText)`
    font-size: 13px;
`;

const Rank = styled.div`
    width: 50px;
    height: 50px;
    min-width: 50px;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.button.textColor.primary};
    ${TableText} {
        font-size: 18px;
    }
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 30px;
        height: 30px;
        min-width: 30px;
    }
`;

const Cell = styled.div<{ hide?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
`;

const StickyCell = styled(Cell)<{ first?: boolean; last?: boolean; hide?: boolean }>`
    color: ${(props) => props.theme.button.textColor.primary};
    background: ${(props) => props.theme.borderColor.tertiary};
    width: 100%;

    margin-left: ${(props) => (props.first ? '4px' : '0')};

    border-top-left-radius: ${(props) => (props.first ? '8px' : '0')};
    border-bottom-left-radius: ${(props) => (props.first ? '8px' : '0')};

    border-top-right-radius: ${(props) => (props.last ? '8px' : '0')};
    border-bottom-right-radius: ${(props) => (props.last ? '8px' : '0')};
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: ${(props) => (props.hide ? 'none' : 'flex')};
    }
`;

const StickyRow = styled.div`
    display: flex;
    height: 50px;
    margin-bottom: 10px;

    ${TableText} {
        color: ${(props) => props.theme.button.textColor.primary};
    }

    ${Rank} {
        color: ${(props) => props.theme.button.textColor.primary};
        background: ${(props) => props.theme.borderColor.tertiary};
    }
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 30px;
    }
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