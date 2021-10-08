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
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
// import { USD_SIGN } from 'constants/currency';
import { TooltipIcon } from 'pages/Options/CreateMarket/components';
import { ArrowIcon, StyledLink } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import useCompetitionQuery, { Competition } from 'queries/options/useCompetitionQuery';
// import useVerifiedTwitterAccountsQuery from 'queries/user/useVerifiedTwitterAccountsQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { getEtherscanAddressLink } from 'utils/etherscan';
// import { formatCurrencyWithSign } from 'utils/formatters/number';
import { Arrow, ArrowsWrapper, TableHeaderLabel } from '../../MarketsTable/components';
import { PaginationWrapper } from '../../MarketsTable/MarketsTable';
import Pagination from '../../MarketsTable/Pagination';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import './media.scss';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type TradingCompetitionProps = {
    displayNamesMap: Map<string, string>;
};

const defaultOrderBy = 7; // Netprofit

const TradingCompetition: React.FC<TradingCompetitionProps> = ({ displayNamesMap }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    // const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
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

    // const verifiedTwitterAccountsQuery = useVerifiedTwitterAccountsQuery({
    //     enabled: isAppReady,
    // });

    // const verifiedTwitterAccounts: any = useMemo(
    //     () => (verifiedTwitterAccountsQuery.isSuccess ? verifiedTwitterAccountsQuery.data : new Set()),
    //     [verifiedTwitterAccountsQuery]
    // );

    const competition = competitionQuery.data
        ? competitionQuery.data.competition.sort((a, b) => b.volume - a.volume)
        : [];

    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const numberOfPages = Math.ceil(twitterAccountsData.length / rowsPerPage) || 1;

    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const calcDirection = (cell: HeadCell) => {
        if (orderBy === cell.id) {
            switch (orderDirection) {
                case OrderDirection.NONE:
                    setOrderDirection(OrderDirection.DESC);
                    break;
                case OrderDirection.DESC:
                    setOrderDirection(OrderDirection.ASC);
                    break;
                case OrderDirection.ASC:
                    setOrderDirection(OrderDirection.DESC);
                    setOrderBy(defaultOrderBy);
                    break;
            }
        } else {
            setOrderBy(parseInt(cell.id.toString()));
            setPage(0);
            setOrderDirection(OrderDirection.DESC);
        }
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

    const filteredTwitterData = useMemo(() => {
        return twitterAccountsData.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [rowsPerPage, memoizedPage, twitterAccountsData]);

    // const sortedData: any = useMemo(() => {
    //     return competition.sort((a, b) => {
    //         if (orderBy === 4) {
    //             if (orderDirection === OrderDirection.DESC) {
    //                 return b.trades - a.trades;
    //             }
    //             if (orderDirection === OrderDirection.ASC) {
    //                 return a.trades - b.trades;
    //             }
    //         }
    //         if (orderBy === 5) {
    //             if (orderDirection === OrderDirection.DESC) {
    //                 return b.volume - a.volume;
    //             }
    //             if (orderDirection === OrderDirection.ASC) {
    //                 return a.volume - b.volume;
    //             }
    //         }

    //         if (orderBy === 6) {
    //             if (orderDirection === OrderDirection.DESC) {
    //                 return b.investment - a.investment;
    //             }
    //             if (orderDirection === OrderDirection.ASC) {
    //                 return a.investment - b.investment;
    //             }
    //         }

    //         if (orderBy === 7) {
    //             if (orderDirection === OrderDirection.DESC) {
    //                 return b.netProfit - a.netProfit;
    //             }
    //             if (orderDirection === OrderDirection.ASC) {
    //                 return a.netProfit - b.netProfit;
    //             }
    //         }

    //         if (orderBy === 8) {
    //             if (orderDirection === OrderDirection.DESC) {
    //                 return b.gain - a.gain;
    //             }
    //             if (orderDirection === OrderDirection.ASC) {
    //                 return a.gain - b.gain;
    //             }
    //         }
    //         return 0;
    //     });
    // }, [orderBy, orderDirection, competition]);

    // const leaderboardData = useMemo(() => {
    //     if (verifiedTwitterAccountsQuery.isSuccess) {
    //         return sortedData
    //             .filter((leader: any) => {
    //                 if (verifiedTwitterAccounts.has(leader.walletAddress.toLowerCase().trim())) {
    //                     if (searchString === '') return true;
    //                     if (leader.walletAddress.toLowerCase().includes(searchString.toLowerCase())) {
    //                         return true;
    //                     }

    //                     const disp = displayNamesMap.get(leader.walletAddress);

    //                     if (disp) {
    //                         return disp.toLowerCase().includes(searchString.toLowerCase());
    //                     }

    //                     return false;
    //                 } else return false;
    //             })
    //             .map((leader: any, index: number, self: any) => {
    //                 if (orderDirection === OrderDirection.DESC) return { rank: index + 1, ...leader };
    //                 return { rank: self.length - index, ...leader };
    //             })
    //             .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    //     } else {
    //         return [];
    //     }
    // }, [rowsPerPage, memoizedPage, searchString, sortedData, verifiedTwitterAccountsQuery]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.table.rank-col'), sortable: false },
        { id: 2, label: t('options.leaderboard.table.twitter-col'), sortable: false },
        { id: 3, label: t('options.leaderboard.table.display-name-col'), sortable: false },
        { id: 4, label: t('options.leaderboard.table.trades-col'), sortable: true },
        { id: 5, label: t('options.leaderboard.table.volume-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.table.investment-col'), sortable: true },
        { id: 7, label: t('options.leaderboard.table.netprofit-col'), sortable: true },
        { id: 8, label: t('options.leaderboard.table.gain-col'), sortable: true },
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
                                                cell.id === 7 ? 'leaderboard__columns__net-profit' : ''
                                            }`}
                                        >
                                            {cell.id === 7 && (
                                                <TooltipIcon
                                                    title={t('options.leaderboard.table.netprofit-col-tooltip')}
                                                ></TooltipIcon>
                                            )}
                                            {cell.label}
                                        </TableHeaderLabel>
                                        {cell.sortable && (
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
                                                        <Arrow src={up} />
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
                        {filteredTwitterData.filter((leader: any) => leader === 'leader.walletAddress.toLowerCase()') // dirty fix for creating borders on the first row of table by creating empty row
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
                        })}
                        {/* {leaderboardData
                            .filter((leader: any) => leader.walletAddress.toLowerCase() === walletAddress.toLowerCase())
                            .map((leader: any, index: any) => {
                                return (
                                    <StyledTableRow 
                                        className="leaderboard__tableBody__yourRank"
                                        key={index}
                                    >
                                        <StyledTableCell
                                            style={{
                                                height: getHeight(leader, true),
                                                fontSize: getFontSizeByRank(leader.rank),
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {(leader as any).rank}
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
                                            {'Your current rank'}
                                        </StyledTableCell>
                                        <StyledTableCell>{leader.trades}</StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                        </StyledTableCell>
                                        <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                                2
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                            {Math.abs(leader.gain).toFixed(1)}%
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        {leaderboardData.map((leader: any, index: any) => {
                            return (
                                <StyledTableRow key={index} className={leader.rank === 1 ? 'leaderboard__tableBody__firstRank' : ''}>
                                    <StyledTableCell
                                        style={{
                                            height: getHeight(leader),
                                            fontSize: getFontSizeByRank(leader.rank),
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {(leader as any).rank}
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
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, leader.walletAddress)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {displayNamesMap.get(leader.walletAddress)
                                                ? displayNamesMap.get(leader.walletAddress)
                                                : leader.walletAddress}
                                        </StyledLink>
                                    </StyledTableCell>
                                    <StyledTableCell>{leader.trades}</StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                            2
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {Math.abs(leader.gain).toFixed(1)}%
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })} */}
                    </TableBody>
                    {competition.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    count={filteredTwitterData.length}
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

// const getHeight = (leader: any, yourRank?: boolean) => {
//     if (yourRank) {
//         return 60;
//     }
//     switch (leader.rank) {
//         case 1:
//             return 120;
//         default:
//             return 60;
//     }
// };

// const getFontSizeByRank = (rank: number) => {
//     return rank === 1 ? 96 : 48;
// };
