import { Paper } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../../Home/MarketsTable/components';
import {
    countryToCountryCode,
    eventToIcon,
    PaginationWrapper,
    StyledTableRow,
} from '../../Home/MarketsTable/MarketsTable';
import { TableFooter } from '@material-ui/core';
import Pagination from '../../Home/MarketsTable/Pagination';
import {
    formatCurrency,
    formatCurrencyWithSign,
    formatPercentage,
    getPercentageDifference,
    truncToDecimals,
} from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { ExtendedOrderItem, ExtendedOrders, HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
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
import { buildOptionsMarketLink } from 'utils/routes';
import { Button, FlexDiv, FlexDivColumn, Image } from 'theme/common';
import SimpleLoader from 'components/SimpleLoader';
import { CoinFilterEnum, OptionFilterEnum, OrderFilterEnum, TradingModeFilterEnum } from '../QuickTrading';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import { EMPTY_VALUE } from 'constants/placeholder';
import arrowDown from 'assets/images/arrow-down.svg';
import arrowUp from 'assets/images/arrow-up.svg';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

interface HeadCell {
    id: keyof ExtendedOrderItem[];
    label: string;
    sortable: boolean;
}

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
    isSingleMode: boolean;
    resetFilters: any;
    exchangeRates: Rates | null;
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    setOrderDirection: (data: any) => void;
};

const QuickTradingTable: React.FC<QuickTradingTableProps> = ({
    orders,
    tradingModeFilter,
    orderFilter,
    coinFilter,
    optionFilter,
    isLoading,
    children,
    isSingleMode,
    resetFilters,
    exchangeRates,
    orderBy,
    orderDirection,
    setOrderBy,
    setOrderDirection,
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

    const sortedMarkets = useMemo(() => {
        return orders.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [orders, orderBy, orderDirection, memoizedPage, rowsPerPage]);

    const marketHeading = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) => {
        const orderbookSign = optionsMarket.customMarket
            ? optionSide === 'long'
                ? optionsMarket.eventName === 'XYZ airdrop claims' ||
                  optionsMarket.eventName === 'ETH burned count' ||
                  optionsMarket.eventName === 'Flippening Markets' ||
                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                    ? '>='
                    : '=='
                : optionsMarket.eventName === 'XYZ airdrop claims' ||
                  optionsMarket.eventName === 'ETH burned count' ||
                  optionsMarket.eventName === 'Flippening Markets' ||
                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                ? '<'
                : '!='
            : optionSide === 'long'
            ? '>'
            : '<';

        return optionsMarket.customMarket
            ? `${optionsMarket.country} ${orderbookSign} ${formatCurrency(
                  optionsMarket.outcome || 0,
                  optionsMarket.eventName === 'Flippening Markets' ||
                      optionsMarket.eventName === 'ETH/BTC market cap ratio'
                      ? 2
                      : 0
              )}`
            : `${getSynthName(optionsMarket.currencyKey)} ${orderbookSign} ${formatCurrencyWithSign(
                  USD_SIGN,
                  optionsMarket.strikePrice
              )}`;
    };

    const buyHeadCells: HeadCell[] = [
        { id: 1, label: '', sortable: false },
        { id: 2, label: t('options.quick-trading.table.condition-col'), sortable: true },
        { id: 3, label: t('options.quick-trading.table.when-col'), sortable: true },
        { id: 4, label: t('options.quick-trading.table.deposit-amount-col'), sortable: true },
        { id: 5, label: t('options.quick-trading.table.return-col'), sortable: true },
        { id: 6, label: t('options.quick-trading.table.actions-col'), sortable: false },
    ];

    const sellHeadCells: HeadCell[] = [
        { id: 1, label: '', sortable: false },
        { id: 2, label: t('options.quick-trading.table.condition-col'), sortable: true },
        { id: 3, label: t('options.quick-trading.table.when-col'), sortable: true },
        { id: 4, label: t('options.quick-trading.table.receive-amount-col'), sortable: true },
        { id: 5, label: t('options.quick-trading.table.options-to-sell-col'), sortable: true },
        { id: 6, label: t('options.quick-trading.table.options-in-wallet-col'), sortable: true },
        { id: 7, label: t('options.quick-trading.table.actions-col'), sortable: false },
    ];

    const headCells = isBuyMode ? buyHeadCells : sellHeadCells;

    return (
        <>
            {!isLoading && (
                <TableContainer
                    style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }}
                    component={Paper}
                >
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
                                const currentAssetPrice = exchangeRates?.[order.market.currencyKey] || 0;
                                const strikeAndAssetPriceDifference = getPercentageDifference(
                                    currentAssetPrice,
                                    order.market.strikePrice
                                );

                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell
                                            style={
                                                index === sortedMarkets.length - 1 && isSingleMode
                                                    ? { paddingRight: 0, paddingLeft: 0, borderRadius: 0 }
                                                    : { paddingRight: 0, paddingLeft: 0 }
                                            }
                                        >
                                            {order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase() && (
                                                <YellowDotContainer>
                                                    <YellowDot />
                                                </YellowDotContainer>
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'left', paddingRight: 0, paddingLeft: 0 }}>
                                            <FlexDiv>
                                                <LightTooltip
                                                    title={t('options.quick-trading.difference-text-tooltip')}
                                                >
                                                    {currentAssetPrice > order.market.strikePrice ? (
                                                        <RedText
                                                            style={{
                                                                display: isFinite(strikeAndAssetPriceDifference)
                                                                    ? 'flex'
                                                                    : 'none',
                                                            }}
                                                        >
                                                            <PriceArrow src={arrowDown} />
                                                            <span>{strikeAndAssetPriceDifference.toFixed(2)}%</span>
                                                        </RedText>
                                                    ) : (
                                                        <GreenText
                                                            style={{
                                                                display: isFinite(strikeAndAssetPriceDifference)
                                                                    ? 'flex'
                                                                    : 'none',
                                                            }}
                                                        >
                                                            <PriceArrow src={arrowUp} />
                                                            <span>{strikeAndAssetPriceDifference.toFixed(2)}%</span>
                                                        </GreenText>
                                                    )}
                                                </LightTooltip>
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
                                                        href={buildOptionsMarketLink(
                                                            order.market.address,
                                                            order.optionSide
                                                        )}
                                                    >
                                                        {order.market.customMarket &&
                                                            !countryToCountryCode(order.market.country as any) && (
                                                                <CustomIcon
                                                                    src={eventToIcon(order.market.eventName as any)}
                                                                ></CustomIcon>
                                                            )}
                                                        <CryptoName>
                                                            {marketHeading(order.market, order.optionSide)}
                                                            {order.optionSide === 'long' ? (
                                                                <SideImage src={longIcon} />
                                                            ) : (
                                                                <SideImage src={shortIcon} />
                                                            )}
                                                        </CryptoName>{' '}
                                                    </StyledLink>
                                                </LightTooltip>
                                            </FlexDiv>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatShortDateWithTime(order.market.maturityDate)}
                                        </StyledTableCell>
                                        <StyledTableCell style={{ width: '120px' }}>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                order.displayOrder.fillableTotal,
                                                DEFAULT_OPTIONS_DECIMALS
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell style={isBuyMode ? { textAlign: 'left' } : { width: '120px' }}>
                                            {isBuyMode
                                                ? `${formatCurrencyWithSign(
                                                      USD_SIGN,
                                                      order.displayOrder.potentialReturnAmount +
                                                          order.displayOrder.fillableTotal,
                                                      DEFAULT_OPTIONS_DECIMALS
                                                  )} (${formatPercentage(order.displayOrder.potentialReturn)})`
                                                : formatCurrency(
                                                      order.displayOrder.fillableAmount,
                                                      DEFAULT_OPTIONS_DECIMALS
                                                  )}
                                        </StyledTableCell>
                                        {!isBuyMode && (
                                            <StyledTableCell style={{ width: '120px' }}>
                                                {isWalletConnected
                                                    ? formatCurrency(order.walletBalance || 0, DEFAULT_OPTIONS_DECIMALS)
                                                    : EMPTY_VALUE}
                                            </StyledTableCell>
                                        )}
                                        <StyledTableCell
                                            style={
                                                index === sortedMarkets.length - 1 && !isSingleMode
                                                    ? { borderRadius: '0 0 23px 0' }
                                                    : {}
                                            }
                                        >
                                            {order.rawOrder.maker.toLowerCase() !== walletAddress.toLowerCase() &&
                                                isWalletConnected && (
                                                    <>
                                                        <BuySellButton
                                                            onClick={() => {
                                                                openFillOrderModal(order);
                                                            }}
                                                            isBuy={isBuyMode}
                                                            disabled={order.walletBalance === 0}
                                                        >
                                                            {isBuyMode ? t('common.buy') : t('common.sell')}
                                                        </BuySellButton>
                                                        <LightTooltip
                                                            title={t(
                                                                'options.quick-trading.counter-offer-button-tooltip'
                                                            )}
                                                        >
                                                            <CounterOfferButton
                                                                onClick={() => {
                                                                    openPlaceOrderModal(order);
                                                                }}
                                                                disabled={order.walletBalance === 0}
                                                            >
                                                                {t('options.quick-trading.counter-offer-button-label')}
                                                            </CounterOfferButton>
                                                        </LightTooltip>
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
                        {sortedMarkets.length !== 0 && !isSingleMode && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={t(`common.pagination.rows-per-page`)}
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
            )}
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
            {sortedMarkets.length === 0 && !isLoading && children}
            {sortedMarkets.length > 0 && !isLoading && isSingleMode && (
                <ViewAllOrdersContainer>
                    <>
                        <Button className="primary" onClick={resetFilters}>
                            {t('options.quick-trading.view-all-orders')}
                        </Button>
                    </>
                </ViewAllOrdersContainer>
            )}
        </>
    );
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

export const StyledLink = styled.a`
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
    border-radius: 0 0 23px 23px;
`;

const SideImage = styled.img`
    width: 32px;
    margin-left: 4px;
`;

const ViewAllOrdersContainer = styled(FlexDivColumn)`
    min-height: 150px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 0 0 23px 23px;
    padding-bottom: 16px;
`;

const PriceArrow = styled(Image)`
    width: 14px;
    height: 14px;
    margin-bottom: -2px;
`;

const GreenText = styled.span`
    color: #01b977;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-right: 5px;
    width: 70px;
`;

const RedText = styled.span`
    color: #be2727;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-right: 5px;
    width: 70px;
`;

export const CustomIcon = styled(Image)`
    margin-bottom: -6px;
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;
export default QuickTradingTable;
