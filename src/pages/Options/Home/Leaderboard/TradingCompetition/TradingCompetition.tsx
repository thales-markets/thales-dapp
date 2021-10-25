import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    withStyles,
} from '@material-ui/core';
import bronze from 'assets/images/bronze.svg';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import gold from 'assets/images/gold.svg';
import silver from 'assets/images/silver.svg';
import upSelected from 'assets/images/up-selected.svg';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import {
    TooltipAssetIcon,
    TooltipDQIcon,
    TooltipIcon,
    TooltipInfoIcon,
    TooltipWarningIcon,
} from 'pages/Options/CreateMarket/components';
import { ArrowIcon, StyledLink } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import useCompetitionQuery, { Competition } from 'queries/options/useCompetitionQuery';
import useVerifiedTwitterAccountsQuery from 'queries/user/useVerifiedTwitterAccountsQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered, FlexDivRow, Text } from 'theme/common';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { Arrow, ArrowsWrapper, TableHeaderLabel } from '../../MarketsTable/components';
import { PaginationWrapper } from '../../MarketsTable/MarketsTable';
import Pagination from '../../MarketsTable/Pagination';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import './media.scss';
import twitter from 'assets/images/twitter-blue-logo.svg';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type TradingCompetitionProps = {
    displayNamesMap: Map<string, string>;
};

const cheaters = ['0x81533c7938946e0605f6b3f0950381db1e0a81ea', '0x4ecc8a1c7e838bc47fc2cd1c7aac642fc5826cf4'];
const unverifiedWallets = new Set();
const defaultOrderBy = 5; // Netprofit

const TradingCompetition: React.FC<TradingCompetitionProps> = ({ displayNamesMap }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [twitterAccountsData, setTwitterAccountsData] = useState([] as any);

    useEffect(() => {
        const url = 'https://api.thales.market/twitter/';
        fetch(url).then(async (response) => {
            const result = JSON.parse(await response.text());
            setTwitterAccountsData(result);
        });
    }, []);

    const competitionQuery = useCompetitionQuery(networkId, {
        enabled: isAppReady,
    });

    const verifiedTwitterAccountsQuery = useVerifiedTwitterAccountsQuery({
        enabled: isAppReady,
    });

    const verifiedTwitterAccounts = verifiedTwitterAccountsQuery.isSuccess
        ? verifiedTwitterAccountsQuery.data
        : new Set();

    const competition = competitionQuery.data
        ? competitionQuery.data.competition.sort((a, b) => b.netProfit - a.netProfit)
        : [];

    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const numberOfPages = Math.ceil(twitterAccountsData.length / rowsPerPage) || 1;

    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const calcDirection = (cell: HeadCell) => {
        setOrderBy(parseInt(cell.id.toString()));
        setPage(0);
        setOrderDirection(OrderDirection.DESC);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

    const dataRdy: any = useMemo(() => {
        if (competition.length > 0 && verifiedTwitterAccounts.size > 0) {
            const verifiedWithInv = [] as any;
            const verifiedWithoutInvOrTrades = [] as any;
            const unverified = [] as any;
            const cheatersArr = [] as any;

            competition.map((leader: any) => {
                if (cheaters.includes(leader.walletAddress.toLowerCase().trim())) {
                    cheatersArr.push(leader);
                    return;
                }

                if (verifiedTwitterAccounts.has(leader.walletAddress.toLowerCase().trim())) {
                    if (leader.investment > 0) verifiedWithInv.push(leader);
                    else verifiedWithoutInvOrTrades.push(leader);
                } else {
                    if (leader.investment > 0) {
                        unverified.push(leader);
                        unverifiedWallets.add(leader.walletAddress);
                    }
                }
            });

            return [verifiedWithInv as any, verifiedWithoutInvOrTrades, unverified, cheatersArr];
        }
        return undefined;
    }, [competition, verifiedTwitterAccounts]);

    const sortedData: any = useMemo(() => {
        if (dataRdy) {
            let verifiedWithInv = dataRdy[0];
            let verifiedWithoutInvOrTrades = dataRdy[1];
            const unverified = dataRdy[2];
            const cheatersArr = dataRdy[3];
            verifiedWithInv = verifiedWithInv
                .sort((a: any, b: any) => {
                    if (orderBy === 5) {
                        if (a.netProfit !== b.netProfit) return b.netProfit - a.netProfit;

                        if (a.trades !== b.trades) return b.trades - a.trades;
                    }
                    if (orderBy === 6) {
                        if (a.gain.toString() === 'NaN') {
                            const gain = (a.netProfit / a.investment) * 100;
                            return b.gain - gain;
                        }

                        if (b.gain.toString() === 'NaN') {
                            const gain = (b.netProfit / b.investment) * 100;
                            return gain - a.gain;
                        }

                        if (a.gain !== b.gain) return b.gain - a.gain;

                        if (a.trades !== b.trades) return b.trades - a.trades;
                    }

                    return 0;
                })
                .map((leader: any, index: number, self: any) => {
                    if (orderDirection === OrderDirection.DESC) {
                        return { rank: index + 1, ...leader };
                    }

                    return { rank: self.length - index, ...leader };
                });

            verifiedWithoutInvOrTrades = verifiedWithoutInvOrTrades.map((leader: any) => {
                return { rank: verifiedWithInv.length + 1, ...leader };
            });

            return [...verifiedWithInv, ...cheatersArr, ...unverified, ...verifiedWithoutInvOrTrades];
        }
    }, [orderBy, orderDirection, dataRdy]);

    const leaderboardData = useMemo(() => {
        if (verifiedTwitterAccountsQuery.isSuccess) {
            return sortedData
                .filter((leader: any) => {
                    if (searchString === '') return true;
                    if (leader.walletAddress.toLowerCase().includes(searchString.toLowerCase())) {
                        return true;
                    }

                    const disp = displayNamesMap.get(leader.walletAddress);

                    if (disp) {
                        return disp.toLowerCase().includes(searchString.toLowerCase());
                    }

                    return false;
                })
                .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
        } else {
            return [];
        }
    }, [rowsPerPage, memoizedPage, searchString, sortedData]);

    const userLeaderboardData = useMemo(() => {
        const userData = leaderboardData.filter(
            (leader: any) => leader.walletAddress.toLowerCase() === walletAddress.toLowerCase()
        );
        return userData;
    }, [walletAddress, networkId]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.table.rank-col'), sortable: false },
        { id: 2, label: t('options.leaderboard.table.rewards-col'), sortable: false },
        { id: 3, label: t('options.leaderboard.table.twitter-col'), sortable: false },
        { id: 4, label: t('options.leaderboard.table.display-name-col'), sortable: false },
        { id: 5, label: t('options.leaderboard.table.netprofit-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.table.gain-col'), sortable: true },
        { id: 7, label: t('options.leaderboard.table.trades-col'), sortable: false },
        { id: 8, label: t('options.leaderboard.table.volume-col'), sortable: false },
        { id: 9, label: t('options.leaderboard.table.investment-col'), sortable: false },
    ];

    return (
        <FlexDivColumnCentered className="leaderboard__wrapper">
            <FlexDivRow style={{ flexDirection: 'row-reverse' }}>
                <SearchWrapper style={{ alignSelf: 'flex-start', flex: 1, maxWidth: 400, margin: '0 0 22px 0' }}>
                    <SearchInput
                        style={{ width: '100%', paddingRight: 40 }}
                        className="leaderboard__search"
                        onChange={(e) => setSearchString(e.target.value)}
                        value={searchString}
                        placeholder={t('options.leaderboard.display-name')}
                    ></SearchInput>
                </SearchWrapper>
                <Text
                    className="text-s ls25 lh24 pale-grey"
                    style={{ alignItems: 'center', flex: 1, height: 44, display: 'flex', columnGap: 2.5 }}
                >
                    {t('options.leaderboard.trading-comp-countdown')}
                    <TimeRemaining end={new Date('Nov 01 2021 11:00:00 UTC')} fontSize={16} showFullCounter />
                </Text>
            </FlexDivRow>

            <TableContainer style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }} component={Paper}>
                <Table
                    className="leaderboard__table"
                    aria-label="customized table"
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: '0px 8px',
                    }}
                >
                    <TableHead
                        className="leaderboard__columns"
                        style={{ textTransform: 'uppercase', fontSize: 14, whiteSpace: 'nowrap' }}
                    >
                        <TableRow>
                            {headCells.map((cell: HeadCell, index) => {
                                return (
                                    <StyledTableCell
                                        onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}}
                                        key={index}
                                        style={cell.sortable ? { cursor: 'pointer' } : {}}
                                    >
                                        <TableHeaderLabel
                                            className={`
                                                            ${
                                                                cell.sortable && orderBy === cell.id ? 'selected' : ''
                                                            }  ${
                                                cell.id === 5 ? 'leaderboard__columns__net-profit' : ''
                                            }`}
                                        >
                                            {cell.id === 5 && (
                                                <TooltipIcon
                                                    title={t('options.leaderboard.table.netprofit-col-tooltip')}
                                                ></TooltipIcon>
                                            )}
                                            {cell.label}
                                        </TableHeaderLabel>
                                        {(cell.id === 5 || cell.id === 6) && (
                                            <ArrowsWrapper>
                                                {orderBy === cell.id && orderDirection !== OrderDirection.NONE ? (
                                                    <Arrow
                                                        src={
                                                            orderDirection === OrderDirection.ASC
                                                                ? upSelected
                                                                : downSelected
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <Arrow src={down} />
                                                    </>
                                                )}
                                            </ArrowsWrapper>
                                        )}
                                    </StyledTableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody className="leaderboard__tableBody">
                        {/* {filteredTwitterData.filter((leader: any) => leader === 'leader.walletAddress.toLowerCase()') // dirty fix for creating borders on the first row of table by creating empty row
                            .length === 0 && ( // will be changed upon start of trading competition when everything is uncommented
                            <StyledTableRow className="leaderboard__tableBody__yourRank"></StyledTableRow>
                        )}
                        {filteredTwitterData.map((data: any, index: any) => {
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                        <StyledLink
                                            style={{ verticalAlign: 'text-top' }}
                                            href={data[1].twitter}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                style={{ width: 35, height: 35, borderRadius: '50%' }}
                                                src={data[1].avatar}
                                            ></img>
                                            <ArrowIcon width="16" height="16" style={{ marginBottom: 8 }} />
                                        </StyledLink>
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, data[0])}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {displayNamesMap.get(data[0]) ? displayNamesMap.get(data[0]) : data[0]}
                                        </StyledLink>
                                    </StyledTableCell>
                                    <StyledTableCell>N/A</StyledTableCell>
                                    <StyledTableCell>N/A</StyledTableCell>
                                    <StyledTableCell>N/A</StyledTableCell>
                                    <StyledTableCell>N/A</StyledTableCell>
                                    <StyledTableCell>N/A</StyledTableCell>
                                </StyledTableRow>
                            );
                        })} */}
                        {userLeaderboardData.map((leader: any, index: any) => {
                            const cheater = cheaters.includes(leader.walletAddress);
                            const unverified = unverifiedWallets.has(leader.walletAddress);
                            return (
                                <StyledTableRow
                                    style={{
                                        opacity: cheater ? 0.3 : unverified ? 0.5 : 1,
                                    }}
                                    className="leaderboard__tableBody__yourRank"
                                    key={index}
                                >
                                    <StyledTableCell
                                        style={{
                                            height: getHeight(leader, true),
                                            fontSize: 36,
                                            fontWeight: 'bold',
                                            padding: cheater ? 0 : '',
                                        }}
                                    >
                                        {cheater && 'DQ'}
                                        {unverified && '-'}
                                        {(leader as any).rank <= 3 && (leader as any).rank > 0 && (
                                            <img src={getMedal(leader)} style={{ width: 35, height: 48 }}></img>
                                        )}

                                        {(leader as any).rank > 3 && (leader as any).rank}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ padding: 0, verticalAlign: 'middle' }}>
                                        {(leader as any).rank <= 20 && !cheater && (
                                            <TooltipAssetIcon title={getRewardsData(leader)}></TooltipAssetIcon>
                                        )}
                                        {cheater && (
                                            <TooltipInfoIcon
                                                title={t('options.leaderboard.trading-competition.disqualified')}
                                            ></TooltipInfoIcon>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ padding: 0 }}>
                                        {twitterAccountsData.filter(
                                            (account: any) => account[0] === leader.walletAddress.toLowerCase()
                                        ).length === 1 && (
                                            <StyledLink
                                                style={{ verticalAlign: 'text-top' }}
                                                href={
                                                    twitterAccountsData.filter(
                                                        (account: any) =>
                                                            account[0] === leader.walletAddress.toLowerCase()
                                                    )[0][1].twitter
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    style={{ width: 35, height: 35, borderRadius: '50%' }}
                                                    src={
                                                        twitterAccountsData.filter(
                                                            (account: any) =>
                                                                account[0] === leader.walletAddress.toLowerCase()
                                                        )[0][1].avatar
                                                    }
                                                    onError={(e: any) => (e.target.src = twitter)}
                                                ></img>
                                                <ArrowIcon width="16" height="16" style={{ marginBottom: 8 }} />
                                            </StyledLink>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {cheaters.includes(leader.walletAddress)
                                            ? t('options.leaderboard.trading-competition.disqualified')
                                            : t('options.leaderboard.trading-competition.current-rank')}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                            2
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {leader.gain === 'NaN'
                                            ? Math.abs((leader.netProfit / leader.investment) * 100).toFixed(1)
                                            : Math.abs(leader.gain).toFixed(1)}
                                        %
                                    </StyledTableCell>
                                    <StyledTableCell>{leader.trades}</StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                        {userLeaderboardData.length === 0 && (
                            <StyledTableRow className="leaderboard__tableBody__yourRank"></StyledTableRow>
                        )}
                        {leaderboardData.map((leader: any, index: any) => {
                            const twitterData = twitterAccountsData.filter(
                                (account: any) => account[0] === leader.walletAddress.toLowerCase()
                            );
                            const cheater = cheaters.includes(leader.walletAddress);
                            const unverified = unverifiedWallets.has(leader.walletAddress);
                            return (
                                <StyledTableRow
                                    key={index}
                                    style={{
                                        opacity: cheater ? 0.3 : unverified ? 0.5 : 1,
                                    }}
                                    className={
                                        leader.rank === 1
                                            ? 'leaderboard__tableBody__firstRank'
                                            : cheater
                                            ? 'leaderboard__tableBody__cheater'
                                            : ''
                                    }
                                >
                                    <StyledTableCell
                                        style={{
                                            height: getHeight(leader),
                                            fontSize: 36,
                                            fontWeight: 'bold',
                                            padding:
                                                (leader as any).rank === 2 || (leader as any).rank === 3
                                                    ? 0
                                                    : cheater
                                                    ? 0
                                                    : '',
                                        }}
                                    >
                                        {cheater ? (
                                            'DQ'
                                        ) : unverified ? (
                                            '-'
                                        ) : (leader as any).rank <= 3 && (leader as any).rank > 0 ? (
                                            <img
                                                src={getMedal(leader)}
                                                style={{ width: getMedalWidth(leader), height: getMedalHeight(leader) }}
                                            ></img>
                                        ) : (
                                            (leader as any).rank
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ padding: 0, verticalAlign: 'middle' }}>
                                        {(leader as any).rank <= 20 && !cheater && !unverified && (
                                            <TooltipAssetIcon title={getRewardsData(leader)}></TooltipAssetIcon>
                                        )}
                                        {cheater && (
                                            <TooltipDQIcon
                                                title={t('options.leaderboard.trading-competition.disqualified')}
                                            ></TooltipDQIcon>
                                        )}
                                        {unverified && (
                                            <TooltipWarningIcon
                                                title={t('options.leaderboard.trading-competition.unverified')}
                                            ></TooltipWarningIcon>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ padding: 0 }}>
                                        {twitterData.length === 1 && (
                                            <StyledLink
                                                style={{ verticalAlign: 'text-top' }}
                                                href={twitterData[0][1].twitter}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    style={{ width: 35, height: 35, borderRadius: '50%' }}
                                                    src={twitterData[0][1].avatar}
                                                    onError={(e: any) => (e.target.src = twitter)}
                                                ></img>
                                                <ArrowIcon width="16" height="16" style={{ marginBottom: 8 }} />
                                            </StyledLink>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={{
                                            fontWeight: 'bold',
                                            textDecoration: cheater ? 'line-through' : '',
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, leader.walletAddress)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`${cheater ? 'white-fade' : ''}`}
                                        >
                                            {displayNamesMap.get(leader.walletAddress)
                                                ? displayNamesMap.get(leader.walletAddress)
                                                : twitterData.length === 1
                                                ? twitterData[0][1].name
                                                : leader.walletAddress}
                                        </StyledLink>
                                    </StyledTableCell>
                                    <StyledTableCell
                                        className={`${leader.netProfit < 0 ? 'red' : 'green'} ${
                                            cheater ? (leader.netProfit < 0 ? ' red-fade ' : ' green-fade ') : ''
                                        }`}
                                        style={{ textDecoration: cheater ? 'line-through' : '' }}
                                    >
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                            2
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        className={`${leader.netProfit < 0 ? 'red' : 'green'} ${
                                            cheater ? (leader.netProfit < 0 ? ' red-fade ' : ' green-fade ') : ''
                                        }`}
                                        style={{ textDecoration: cheater ? 'line-through' : '' }}
                                    >
                                        {leader.gain === 'NaN'
                                            ? Math.abs((leader.netProfit / leader.investment) * 100).toFixed(1)
                                            : Math.abs(leader.gain).toFixed(1)}
                                        %
                                    </StyledTableCell>
                                    <StyledTableCell
                                        className={`${cheater ? 'white-fade' : ''}`}
                                        style={{ textDecoration: cheater ? 'line-through' : '' }}
                                    >
                                        {leader.trades}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        className={`${cheater ? 'white-fade' : ''}`}
                                        style={{ textDecoration: cheater ? 'line-through' : '' }}
                                    >
                                        {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        className={`${cheater ? 'white-fade' : ''}`}
                                        style={{ textDecoration: cheater ? 'line-through' : '' }}
                                    >
                                        {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {competition.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                    count={competition.length}
                                    rowsPerPage={rowsPerPage}
                                    page={memoizedPage}
                                    onPageChange={handleChangePage}
                                    ActionsComponent={() => (
                                        <Pagination
                                            page={memoizedPage}
                                            numberOfPages={numberOfPages}
                                            setPage={setPage}
                                        />
                                    )}
                                />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </TableContainer>
        </FlexDivColumnCentered>
    );
};

interface HeadCell {
    id: keyof Competition[];
    label: string;
    sortable: boolean;
}

export const StyledTableRow = withStyles(() => ({
    root: {
        background: '#04045a',
        '&:last-child': {
            borderBottomLeftRadius: '23px',
            borderBottomRightRadius: '23px',
        },
        '&:last-child > td:first-child': {
            borderBottomLeftRadius: '23px',
            borderTopLeftRadius: '23px !important',
        },
        '&:last-child a:last-child td': {
            borderBottomRightRadius: '23px',
            borderTopRightRadius: '23px !important',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#0a0b52',
            },
        },
    },
}))(TableRow);

export const StyledTableCell = withStyles(() => ({
    head: {
        position: 'relative',
        border: 'none',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: ' 0.5px',
        color: '#b8c6e5',
        padding: '13px',
    },
    body: {
        borderTop: '1px solid rgba(140, 114, 184, 0.6)',
        borderBottom: '1px solid rgba(106, 193, 213, 0.6)',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: ' 0.25px',
        color: '#F6F6FE',
        '&:last-child': {
            borderBottomRightRadius: '23px',
            borderTopRightRadius: '23px !important',
            borderRight: '1px solid transparent',
            borderTop: '1px solid transparent',
            borderBottom: '1px solid transparent',
            backgroundImage:
                'linear-gradient(#04045a, #04045a), linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
        },
        '&:first-child': {
            borderBottomLeftRadius: '23px',
            borderTopLeftRadius: '23px',
            borderLeft: '1px solid transparent',
            borderTop: '1px solid transparent',
            borderBottom: '1px solid transparent',
            backgroundImage:
                'linear-gradient(#04045a, #04045a), linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
        },
    },
}))(TableCell);

export default TradingCompetition;

const getHeight = (leader: any, yourRank?: boolean) => {
    if (yourRank) {
        return 60;
    }
    switch (leader.rank) {
        case 1:
            return 120;
        default:
            return 60;
    }
};

const getMedalHeight = (leader: any, yourRank?: boolean) => {
    if (yourRank) {
        return 48;
    }
    switch (leader.rank) {
        case 1:
            return 80;
        default:
            return 48;
    }
};

const getMedalWidth = (leader: any, yourRank?: boolean) => {
    if (yourRank) {
        return 35;
    }
    switch (leader.rank) {
        case 1:
            return 72;
        default:
            return 35;
    }
};

const getMedal = (leader: any) => {
    switch (leader.rank) {
        case 1:
            return gold;
        case 2:
            return silver;
        case 3:
            return bronze;
        default:
            return '';
    }
};

const getRewardsData = (leader: any) => {
    switch (leader.rank) {
        case 1:
            return 'THALES: 2500, SNX: 150, ZRX: 1000';
        case 2:
            return 'THALES: 1500, SNX: 90, ZRX: 600';
        case 3:
            return 'THALES: 1000, SNX: 60, ZRX: 400';
        case 4:
            return 'THALES: 925, SNX: 55.5, ZRX: 370';
        case 5:
            return 'THALES: 850, SNX: 51, ZRX: 340';
        case 6:
            return 'THALES: 800, SNX: 48, ZRX: 320';
        case 7:
            return 'THALES: 750, SNX: 45, ZRX: 300';
        case 8:
            return 'THALES: 675, SNX: 40.5, ZRX: 270';
        case 9:
            return 'THALES: 550, SNX: 33, ZRX: 220';
        case 10:
            return 'THALES: 450, SNX: 27, ZRX: 180';
        case 11:
            return 'THALES: 375, SNX: 22.5, ZRX: 150';
        case 12:
            return 'THALES: 350, SNX: 21, ZRX: 140';
        case 13:
            return 'THALES: 325, SNX: 19.5, ZRX: 130';
        case 14:
            return 'THALES: 290, SNX: 17.4, ZRX: 116';
        case 15:
            return 'THALES: 265, SNX: 15.9, ZRX: 106';
        case 16:
            return 'THALES: 235, SNX: 14.1, ZRX: 94';
        case 17:
            return 'THALES: 210, SNX: 12.6, ZRX: 84';
        case 18:
            return 'THALES: 175, SNX: 10.5, ZRX: 70';
        case 19:
            return 'THALES: 150, SNX: 9, ZRX: 60';
        case 20:
            return 'THALES: 125, SNX: 7.5, ZRX: 50';
    }
};
