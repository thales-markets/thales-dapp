import { Paper, Table, TableBody, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderDirection } from '../Home/ExploreMarkets/ExploreMarketsDesktop';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../Home/MarketsTable/components';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import { PaginationWrapper, StyledTableRow } from '../Home/MarketsTable/MarketsTable';
import Pagination from '../Home/MarketsTable/Pagination';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import SearchMarket from '../Home/SearchMarket';
import {
    FlexDiv,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivColumnCentered,
    FlexDivRowCentered,
    LoaderContainer,
    Text,
} from 'theme/common';
import { truncateAddress } from 'utils/formatters/string';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { StyledLink } from '../Market/components/MarketOverview/MarketOverview';
import SimpleLoader from 'components/SimpleLoader';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { ReactComponent as DownIcon } from '../../../assets/images/down.svg';
import { Round2Trades } from './AmmMining';

interface HeadCell {
    id: number;
    label: string;
    sortable: boolean;
}

type AmmTableInputData = {
    dataForUi: [string, number | Round2Trades][];
    volume: number;
    volumeByOptionSide: Round2Trades;
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    isLoading: boolean;
    setOrderDirection: (data: any) => void;
    deps: any;
    selectedRound: number;
    setSelectedRound: (round: number) => void;
};

type Options = 'long' | 'short' | 'all';

const DEFAULT_ORDER_BY = 2;
const ROUNDS = [1, 2];
const OPTIONS = ['long', 'short', 'all'];

const AmmTable: React.FC<AmmTableInputData> = ({
    dataForUi,
    volume,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    isLoading,
    deps,
    selectedRound,
    setSelectedRound,
    volumeByOptionSide,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [page, setPage] = useState(0);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [assetSearch, setAssetSearch] = useState<string>('');

    const [roundDropdownIsOpen, setRoundDropdownIsOpen] = useState<boolean>(false);
    const [optionSideDropdownIsOpen, setOptionSideDropdownIsOpen] = useState<boolean>(false);
    const [selectedOptionSide, setSelectedOptionSide] = useState<number>(0);

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const numberOfPages = Math.ceil(dataForUi.length / rowsPerPage) || 1;

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

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
                    setOrderBy(DEFAULT_ORDER_BY);
                    break;
            }
        } else {
            setOrderBy(parseInt(cell.id.toString()));
            setOrderDirection(OrderDirection.DESC);
        }
    };

    useEffect(() => {
        setPage(0);
    }, [...deps, assetSearch]);

    const slicedData = useMemo(() => {
        return dataForUi
            .filter((trade) => {
                if (assetSearch === '') return true;
                return trade[0].toLowerCase().includes(assetSearch.toLowerCase());
            })
            .sort((a: [string, number | Round2Trades], b: [string, number | Round2Trades]) => {
                const aValue = (selectedRound === 2
                    ? (a[1] as Round2Trades)[OPTIONS[selectedOptionSide] as Options]
                    : a[1]) as number;
                const bValue = (selectedRound === 2
                    ? (b[1] as Round2Trades)[OPTIONS[selectedOptionSide] as Options]
                    : b[1]) as number;
                return orderDirection === OrderDirection.ASC ? aValue - bValue : bValue - aValue;
            })
            .filter((trade) => {
                const tradeVolume =
                    selectedRound === 2 ? (trade[1] as Round2Trades)[OPTIONS[selectedOptionSide] as Options] : trade[1];
                return !!tradeVolume;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [dataForUi, orderBy, orderDirection, memoizedPage, rowsPerPage, assetSearch, selectedRound, selectedOptionSide]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.amm-mining.address'), sortable: false },
        { id: 2, label: t('options.amm-mining.volume'), sortable: true },
        { id: 3, label: t('options.amm-mining.share'), sortable: false },
        { id: 4, label: t('options.amm-mining.rewards'), sortable: false },
    ];

    const totalVolume = selectedRound === 2 ? volumeByOptionSide[OPTIONS[selectedOptionSide] as Options] : volume;

    return (
        <>
            <FlexDiv
                className="table-filters"
                style={{
                    justifyContent: 'flex-end',
                    background: '#04045a',
                    alignItems: 'center',
                    borderTopLeftRadius: '23px',
                    borderTopRightRadius: '23px',
                    width: '100%',
                }}
            >
                {selectedRound === 2 && (
                    <OutsideClickHandler onOutsideClick={() => setOptionSideDropdownIsOpen(false)}>
                        <Container>
                            <RoundButton
                                onClick={() => {
                                    setOptionSideDropdownIsOpen(!optionSideDropdownIsOpen);
                                }}
                                isActive={optionSideDropdownIsOpen}
                            >
                                <InnerButton>
                                    <FlexDiv>{t(`options.filters-labels.${OPTIONS[selectedOptionSide]}`)}</FlexDiv>
                                    <StyledDownIcon />
                                </InnerButton>
                            </RoundButton>
                            {optionSideDropdownIsOpen && (
                                <DropdownContainer>
                                    <DropDown>
                                        {OPTIONS.map((option: string, index: number) => (
                                            <DropDownItem
                                                key={option}
                                                onClick={() => {
                                                    setSelectedOptionSide(index);
                                                    setOptionSideDropdownIsOpen(false);
                                                }}
                                            >
                                                <FlexDivCentered>
                                                    <RoundName>
                                                        {t(`options.filters-labels.${OPTIONS[index]}`)}
                                                    </RoundName>
                                                </FlexDivCentered>
                                            </DropDownItem>
                                        ))}
                                    </DropDown>
                                </DropdownContainer>
                            )}
                        </Container>
                    </OutsideClickHandler>
                )}
                <OutsideClickHandler onOutsideClick={() => setRoundDropdownIsOpen(false)}>
                    <Container>
                        <RoundButton
                            onClick={() => {
                                setRoundDropdownIsOpen(!roundDropdownIsOpen);
                            }}
                            isActive={roundDropdownIsOpen}
                        >
                            <InnerButton>
                                <FlexDiv>{t(`options.amm-mining.round`) + ` ${selectedRound}`}</FlexDiv>
                                <StyledDownIcon />
                            </InnerButton>
                        </RoundButton>
                        {roundDropdownIsOpen && (
                            <DropdownContainer>
                                <DropDown>
                                    {ROUNDS.map((round: number) => (
                                        <DropDownItem
                                            key={round}
                                            onClick={() => {
                                                setSelectedRound(round);
                                                setRoundDropdownIsOpen(false);
                                            }}
                                        >
                                            <FlexDivCentered>
                                                <RoundName>{t(`options.amm-mining.round`) + ` ${round}`}</RoundName>
                                            </FlexDivCentered>
                                        </DropDownItem>
                                    ))}
                                </DropDown>
                            </DropdownContainer>
                        )}
                    </Container>
                </OutsideClickHandler>
                <SearchMarket
                    assetSearch={assetSearch}
                    setAssetSearch={setAssetSearch}
                    placeholder={t(`options.filters-labels.search-placeholder-for-mining`)}
                />
            </FlexDiv>
            <FlexDiv
                style={{
                    justifyContent: 'flex-end',
                    background: '#04045a',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <InfoContainer>
                    <Text className="text-sm pale-grey" style={{ marginRight: 20 }}>
                        {`${t('options.leaderboard.trades.unique-traders')}: ${
                            dataForUi.filter((trade) => {
                                const tradeVolume =
                                    selectedRound === 2
                                        ? (trade[1] as Round2Trades)[OPTIONS[selectedOptionSide] as Options]
                                        : trade[1];
                                return !!tradeVolume;
                            }).length
                        }`}
                    </Text>
                    <Text className="text-sm pale-grey">
                        {`${t('options.leaderboard.trades.volume')}: ${formatCurrencyWithSign(USD_SIGN, totalVolume)}`}
                    </Text>
                </InfoContainer>
            </FlexDiv>
            {!isLoading && (
                <TableContainer
                    style={{
                        background: 'transparent',
                        boxShadow: 'none',
                        borderRadius: '0',
                    }}
                    component={Paper}
                >
                    <Table>
                        <TableHead style={{ textTransform: 'uppercase', background: '#04045a' }}>
                            <TableRow>
                                {headCells.map((cell: HeadCell, index) => {
                                    return (
                                        <StyledTableCell
                                            onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}}
                                            key={index}
                                            style={cell.sortable ? { cursor: 'pointer' } : {}}
                                        >
                                            <TableHeaderLabel
                                                className={cell.sortable && orderBy === cell.id ? 'selected' : ''}
                                            >
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
                        <TableBody>
                            {slicedData.map((trade: any, index: any) => {
                                const tradeVolume =
                                    selectedRound === 2 ? trade[1][OPTIONS[selectedOptionSide] as Options] : trade[1];

                                const rewards = selectedRound === 2 ? 10000 : 20000;

                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell style={{ maxWidth: 200 }}>
                                            <StyledLink
                                                href={getEtherscanAddressLink(networkId, trade[0])}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {window.innerWidth < 768 ? truncateAddress(trade[0], 5, 3) : trade[0]}
                                            </StyledLink>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, tradeVolume, 1)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {((tradeVolume / totalVolume) * 100).toFixed(2)} %
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {(selectedRound === 2 && selectedOptionSide === 2
                                                ? (trade[1].short / volumeByOptionSide.short) * rewards +
                                                  (trade[1].long / volumeByOptionSide.long) * rewards
                                                : (tradeVolume / totalVolume) * rewards
                                            ).toFixed(2)}{' '}
                                            THALES
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                        {slicedData.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                        count={slicedData.length}
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
            )}

            {isLoading && (
                <NoTrades>
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                </NoTrades>
            )}
        </>
    );
};

const InfoContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-right: 40px;
    padding-bottom: 11px;
    padding-top: 3px;
`;

const NoTrades = styled(FlexDiv)`
    width: 100%;
    position: relative;
    min-height: 400px;
    background: #04045a;
`;

const Container = styled(FlexDivColumnCentered)`
    width: 140px;
    margin-left: 22px;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const RoundButton = styled.button<{ isActive: boolean }>`
    position: relative;
    width: 140px;
    height: 44px;
    border: none;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    padding: 2px;
    border-radius: 23px;
    &:hover {
        cursor: pointer;
        background: #00f9ff;
    }
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const InnerButton = styled(FlexDivRowCentered)`
    background: #09095b;
    border-radius: 23px;
    font-weight: bold;
    font-size: 16px;
    line-height: 40px;
    letter-spacing: 0.35px;
    color: #f6f6fe;
    text-transform: capitalize;
    padding-left: 20px;
    padding-right: 20px;
`;

const DropdownContainer = styled.div`
    position: relative;
    z-index: 1000;
`;

const DropDown = styled(FlexDivColumn)`
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border: 1px solid #4f759b;
    border-radius: 20px;
    position: absolute;
    margin-top: 2px;
    padding: 8px;
    width: 100%;
`;

const DropDownItem = styled(FlexDiv)`
    padding: 8px 12px;
    cursor: pointer;
    &:hover {
        background: rgba(196, 196, 196, 0.1);
        border-radius: 12px;
    }
`;

const RoundName = styled.div`
    font-weight: 500;
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    letter-spacing: 0.35px;
    color: #f6f6fe;
    display: block;
    text-transform: capitalize;
`;

const StyledDownIcon = styled(DownIcon)`
    height: 15px;
    width: 15px;
    path {
        fill: #f6f6fe;
    }
`;

export default AmmTable;
