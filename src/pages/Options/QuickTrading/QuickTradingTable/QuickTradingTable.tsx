import { Paper } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../../Home/MarketsTable/components';
import { PaginationWrapper, StyledTableRow } from '../../Home/MarketsTable/MarketsTable';
import { TableFooter } from '@material-ui/core';
import Pagination from '../../Home/MarketsTable/Pagination';
import { formatCurrency, formatCurrencyWithSign, formatPercentage, truncToDecimals } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import {
    DisplayOrder,
    ExtendedOrderItem,
    ExtendedOrders,
    HistoricalOptionsMarketInfo,
    OptionSide,
} from 'types/options';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { getSynthName } from 'utils/snxJSConnector';
import { DefaultSubmitButton, LightTooltip, SubmitButton } from '../../Market/components';
import FillOrderModal from '../../Market/TradeOptions/Orderbook/FillOrderModal';
import PlaceOrderModal from '../PlaceOrderModal';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import Currency from 'components/Currency';
import CancelOrderModal from 'pages/Options/Market/TradeOptions/Orderbook/CancelOrderModal';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ReactComponent as CancelIcon } from 'assets/images/close-red.svg';
import { useTranslation } from 'react-i18next';
import { navigateToOptionsMarket } from 'utils/routes';
import { FlexDiv, FlexDivColumn } from 'theme/common';
import SimpleLoader from 'components/SimpleLoader';
import { CoinFilterEnum, OptionFilterEnum, OrderFilterEnum, TradingModeFilterEnum } from '../QuickTrading';

interface HeadCell {
    id: keyof ExtendedOrderItem[];
    label: string;
    sortable: boolean;
}

const buyHeadCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: 'Condition', sortable: true },
    { id: 3, label: 'When', sortable: true },
    { id: 4, label: 'Amount to deposit', sortable: true },
    { id: 5, label: 'Return if win', sortable: true },
    { id: 6, label: 'Actions', sortable: false },
];

const sellHeadCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: 'Condition', sortable: true },
    { id: 3, label: 'When', sortable: true },
    { id: 4, label: 'Amount to receive', sortable: true },
    { id: 5, label: 'Options amount to sell', sortable: true },
    { id: 6, label: 'Actions', sortable: false },
];

const DEFAULT_ORDER_BY = 3; // market expiration time

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type QuickTradingTableProps = {
    orders: ExtendedOrders;
    isLoading?: boolean;
    tradingModeFilter: TradingModeFilterEnum;
    orderFilter: OrderFilterEnum;
    coinFilter: CoinFilterEnum;
    optionFilter: OptionFilterEnum;
};

const QuickTradingTable: React.FC<QuickTradingTableProps> = ({
    orders,
    tradingModeFilter,
    orderFilter,
    coinFilter,
    optionFilter,
    isLoading,
    children,
}) => {
    const { t } = useTranslation();
    const [fillOrderModalVisible, setFillOrderModalVisible] = useState<boolean>(false);
    const [placeOrderModalVisible, setPlaceOrderModalVisible] = useState<boolean>(false);
    const [cancelOrderModalVisible, setCancelOrderModalVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<ExtendedOrderItem | null>(null);
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const openFillOrderModal = useCallback((order: ExtendedOrderItem) => {
        setFillOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);
    const openPlaceOrderModal = useCallback((order: ExtendedOrderItem) => {
        setPlaceOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    const openCancelOrderModal = useCallback((order: ExtendedOrderItem) => {
        setCancelOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    const isBuyMode = tradingModeFilter === TradingModeFilterEnum.Buy;

    const [page, setPage] = useState(0);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const numberOfPages = Math.ceil(orders.length / rowsPerPage) || 1;

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

    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

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

    useEffect(() => setPage(0), [tradingModeFilter, orderFilter, coinFilter, optionFilter, orderBy, orderDirection]);

    // const sortedMarkets = orders;
    const sortedMarkets = useMemo(() => {
        return orders
            .sort((a, b) => {
                switch (orderBy) {
                    case 2:
                        return sortByMarketField(a.market, b.market, orderDirection, 'asset');
                    case 3:
                        return sortByTime(a, b, orderDirection);
                    case 4:
                        return sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'fillableTotal');
                    case 5:
                        return isBuyMode
                            ? sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'potentialReturnAmount')
                            : sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'fillableAmount');
                    default:
                        return 0;
                }
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [orders, orderBy, orderDirection, memoizedPage, rowsPerPage]);

    const marketHeading = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) => {
        const orderbookSign = optionsMarket.customMarket
            ? optionSide === 'long'
                ? '=='
                : '!='
            : optionSide === 'long'
            ? '>'
            : '<';

        return optionsMarket.customMarket
            ? `${optionsMarket.country} ${orderbookSign} ${optionsMarket.outcome}`
            : `${getSynthName(optionsMarket.currencyKey)} ${orderbookSign} ${formatCurrencyWithSign(
                  USD_SIGN,
                  optionsMarket.strikePrice
              )}`;
    };

    const headCells = isBuyMode ? buyHeadCells : sellHeadCells;

    return (
        <>
            <TableContainer style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }} component={Paper}>
                <Table aria-label="customized table">
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
                        {sortedMarkets.map((order: ExtendedOrderItem, index: any) => {
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell style={{ paddingRight: 0 }}>
                                        {order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase() && (
                                            <YellowDotContainer>
                                                <YellowDot />
                                            </YellowDotContainer>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ textAlign: 'left' }}>
                                        <FlexDiv>
                                            <Currency.Icon
                                                synthIconStyle={{
                                                    width: 24,
                                                    height: 24,
                                                    marginRight: 6,
                                                    marginBottom: -6,
                                                }}
                                                currencyKey={order.market.currencyKey}
                                            />{' '}
                                            <LightTooltip title={t('options.quick-trading.view-market-tooltip')}>
                                                <StyledLink
                                                    onClick={() =>
                                                        navigateToOptionsMarket(order.market.address, order.optionSide)
                                                    }
                                                >
                                                    <CryptoName>
                                                        {marketHeading(order.market, order.optionSide)}
                                                    </CryptoName>{' '}
                                                </StyledLink>
                                            </LightTooltip>
                                        </FlexDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatShortDateWithTime(order.market.maturityDate)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            order.displayOrder.fillableTotal,
                                            DEFAULT_OPTIONS_DECIMALS
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell style={isBuyMode ? {} : { width: '170px' }}>
                                        {isBuyMode
                                            ? `${formatCurrencyWithSign(
                                                  USD_SIGN,
                                                  order.displayOrder.potentialReturnAmount,
                                                  DEFAULT_OPTIONS_DECIMALS
                                              )} (${formatPercentage(order.displayOrder.potentialReturn)})`
                                            : formatCurrency(
                                                  order.displayOrder.fillableAmount,
                                                  DEFAULT_OPTIONS_DECIMALS
                                              )}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={index === sortedMarkets.length - 1 ? { borderRadius: '0 0 23px 0' } : {}}
                                    >
                                        {order.rawOrder.maker.toLowerCase() !== walletAddress.toLowerCase() &&
                                            isWalletConnected && (
                                                <>
                                                    <BuySellButton
                                                        onClick={() => {
                                                            openFillOrderModal(order);
                                                        }}
                                                        isBuy={isBuyMode}
                                                    >
                                                        {isBuyMode ? t('common.buy') : t('common.sell')}
                                                    </BuySellButton>
                                                    <CounterOfferButton
                                                        onClick={() => {
                                                            openPlaceOrderModal(order);
                                                        }}
                                                    >
                                                        {t('options.quick-trading.counter-offer-button-label')}
                                                    </CounterOfferButton>
                                                </>
                                            )}
                                        {order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase() &&
                                            isWalletConnected && (
                                                <LightTooltip title={t('options.quick-trading.cancel-tooltip')}>
                                                    <CancelIconContainer
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            openCancelOrderModal(order);
                                                        }}
                                                    />
                                                </LightTooltip>
                                            )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {sortedMarkets.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    count={sortedMarkets.length}
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
                {fillOrderModalVisible && selectedOrder !== null && (
                    <FillOrderModal
                        order={selectedOrder}
                        optionSide={selectedOrder.optionSide}
                        orderSide={isBuyMode ? 'sell' : 'buy'}
                        onClose={() => setFillOrderModalVisible(false)}
                        market={selectedOrder.market}
                    />
                )}
                {placeOrderModalVisible && selectedOrder !== null && (
                    <PlaceOrderModal
                        optionSide={selectedOrder.optionSide}
                        orderSide={isBuyMode ? 'buy' : 'sell'}
                        onClose={() => setPlaceOrderModalVisible(false)}
                        market={selectedOrder.market}
                        defaultPrice={truncToDecimals(selectedOrder.displayOrder.price, DEFAULT_OPTIONS_DECIMALS)}
                        defaultAmount={truncToDecimals(
                            selectedOrder.displayOrder.fillableAmount,
                            DEFAULT_OPTIONS_DECIMALS
                        )}
                    />
                )}
                {cancelOrderModalVisible && selectedOrder !== null && (
                    <CancelOrderModal
                        order={selectedOrder}
                        baseToken={
                            selectedOrder.optionSide === 'long'
                                ? selectedOrder.market.longAddress
                                : selectedOrder.market.shortAddress
                        }
                        optionSide={selectedOrder.optionSide}
                        onClose={() => setCancelOrderModalVisible(false)}
                    />
                )}
            </TableContainer>
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
            {sortedMarkets.length === 0 && !isLoading && children}
        </>
    );
};

const sortByTime = (a: ExtendedOrderItem, b: ExtendedOrderItem, direction: OrderDirection) => {
    if (direction === OrderDirection.ASC && a.market.phaseNum === b.market.phaseNum) {
        return a.market.timeRemaining > b.market.timeRemaining ? -1 : 1;
    }
    if (direction === OrderDirection.DESC && a.market.phaseNum === b.market.phaseNum) {
        return a.market.timeRemaining > b.market.timeRemaining ? 1 : -1;
    }

    return 0;
};

const sortByOrderField = (a: DisplayOrder, b: DisplayOrder, direction: OrderDirection, field: keyof DisplayOrder) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const sortByMarketField = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection,
    field: keyof HistoricalOptionsMarketInfo
) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const CancelIconContainer = styled(CancelIcon)`
    min-width: 30px;
    min-height: 30px;
    position: relative;
    padding: 8px;
    z-index: 2;
    cursor: pointer;
`;

const YellowDotContainer = styled.div`
    padding-bottom: 5px;
`;

const YellowDot = styled.span`
    height: 6px;
    width: 6px;
    background-color: rgb(240, 185, 11);
    border-radius: 50%;
    display: inline-block;
`;

const CryptoName = styled.span``;

export const StyledLink = styled.p`
    color: #f6f6fe;
    &:hover {
        color: #00f9ff;
    }
    cursor: pointer;
`;

const BuySellButton = styled(SubmitButton)`
    min-height: 20px;
    font-size: 14px;
    padding: 4px 20px;
    margin-right: 10px;
    text-transform: capitalize;
`;

const CounterOfferButton = styled(DefaultSubmitButton)`
    min-height: 20px;
    font-size: 14px;
    padding: 4px 20px;
`;

const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
`;

export default QuickTradingTable;
