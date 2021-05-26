import React, { useMemo, useState } from 'react';
import { Modal } from '@material-ui/core';
import { Button, FilterButton, FlexDiv, FlexDivCentered, FlexDivColumn, Image, Text, XButton } from 'theme/common';
import styled from 'styled-components';
import metamask from 'assets/images/metamask.svg';
import onboardConnector from 'utils/onboardConnector';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useBinaryOptionsUserOrders from 'queries/options/useBinaryOptionsUserOrders';
import snxJSConnector from 'utils/snxJSConnector';
import { sortOptionsMarkets } from 'utils/options';
import { RootState } from 'redux/rootReducer';
import { truncateAddress } from 'utils/formatters/string';
import Currency from 'components/Currency';
import { formatShortDate } from 'utils/formatters/date';
import { USD_SIGN } from 'constants/currency';
import { navigateToOptionsMarket } from 'utils/routes';
import { Trade } from 'types/options';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';

type UserInfoModalProps = {
    open: boolean;
    handleClose: (open: boolean) => void;
    walletAddress: any;
    network: any;
};

enum Filters {
    MARKETS = 'Markets',
    ORDERS = 'Orders',
    ASSETS = 'Assets',
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ open, handleClose, walletAddress, network }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, {
        enabled: open,
    });
    const ordersQuery = useBinaryOptionsUserOrders(networkId, walletAddress, {
        enabled: open,
    });
    const [filter, setFilter] = useState(Filters.MARKETS);
    const { synthsMap } = snxJSConnector;
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    const optionsMarkets = useMemo(
        () =>
            marketsQuery.isSuccess && Array.isArray(marketsQuery.data)
                ? sortOptionsMarkets(marketsQuery.data, synthsMap)
                : [],
        [marketsQuery, synthsMap]
    );

    const filteredMarkets = useMemo(() => {
        switch (filter) {
            case Filters.MARKETS:
                return optionsMarkets.filter((market) => {
                    return market.creator.toLowerCase() === walletAddress.toLowerCase();
                });
            case Filters.ORDERS:
                if (ordersQuery.isSuccess) {
                    return optionsMarkets.reduce((acc, market: any) => {
                        if (market.openOrders > 0) {
                            const userOrdersForMarket: [] = ordersQuery.data.records.reduce((temp: any, data: any) => {
                                const rawOrder: Trade = data.order;
                                const isBuy: boolean =
                                    rawOrder.makerToken.toLowerCase() === SynthsUSD.address.toLowerCase();
                                let isLong = false;
                                if (
                                    (isBuy && market.longAddress.toLowerCase() === rawOrder.takerToken.toLowerCase()) ||
                                    (!isBuy && market.longAddress.toLowerCase() === rawOrder.makerToken.toLowerCase())
                                ) {
                                    isLong = true;
                                } else if (
                                    (isBuy &&
                                        market.shortAddress.toLowerCase() === rawOrder.takerToken.toLowerCase()) ||
                                    (!isBuy && market.shortAddress.toLowerCase() === rawOrder.makerToken.toLowerCase())
                                ) {
                                    isLong = false;
                                } else {
                                    return temp;
                                }
                                const displayOrder = isBuy ? prepBuyOrder(data) : prepSellOrder(data);

                                temp.push({
                                    ...displayOrder,
                                    market,
                                    isBuy,
                                    isLong,
                                });
                                return temp;
                            }, []);
                            acc.push(...userOrdersForMarket);
                        }
                        return acc;
                    }, []);
                }

                break;
            case Filters.ASSETS:
                break;
        }
    }, [optionsMarkets, filter]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper>
                <Header>
                    <Text className="text-m bold pale-grey">Connected Wallet</Text>
                    <XButton onClick={() => handleClose(false)} />
                </Header>
                <WalletWrapper>
                    <Image src={metamask} style={{ width: 55, height: 49 }}></Image>
                    <FlexDivColumn style={{ alignItems: 'center', flex: 2 }}>
                        <Text className="text-m bold pale-grey">{truncateAddress(walletAddress, 13, 4)}</Text>
                        <Text className="text-xs bold pale-grey capitalize">{network}</Text>
                    </FlexDivColumn>
                    <FlexDivColumn>
                        <Button
                            className="primary text-xs"
                            style={{
                                width: 150,
                                height: 40,
                                marginBottom: 10,
                                padding: '4px 24px',
                                alignSelf: 'flex-end',
                            }}
                            onClick={() => {
                                onboardConnector.onboard.walletSelect();
                            }}
                        >
                            Switch Wallet
                        </Button>
                        <Button
                            className="primary text-xs"
                            style={{ width: 150, height: 40, padding: '4px 24px', alignSelf: 'flex-end' }}
                            onClick={() => {
                                onboardConnector.disconnectWallet();
                                handleClose(false);
                            }}
                        >
                            Disconnect Wallet
                        </Button>
                    </FlexDivColumn>
                </WalletWrapper>
                <FilterWrapper>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.MARKETS ? 'selected' : ''}
                        onClick={() => setFilter(Filters.MARKETS)}
                    >
                        My Markets
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.ORDERS ? 'selected' : ''}
                        onClick={() => setFilter(Filters.ORDERS)}
                    >
                        My Open Orders
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.ASSETS ? 'selected' : ''}
                        onClick={() => setFilter(Filters.ASSETS)}
                    >
                        My Assets
                    </FilterButton>
                </FilterWrapper>
                <DataWrapper>
                    {filter === Filters.MARKETS &&
                        filteredMarkets?.map((market, index) => (
                            <MarketRow
                                key={index}
                                onClick={() => {
                                    if (market.phase !== 'expiry') {
                                        navigateToOptionsMarket(market.address);
                                    }
                                }}
                            >
                                <Currency.Name
                                    currencyKey={market.currencyKey}
                                    showIcon={true}
                                    iconProps={{ width: '32px', height: '32px', type: 'asset' }}
                                />
                                <Text style={{ margin: '0 8px' }}>{market.strikePrice.toFixed(2) + USD_SIGN}</Text>
                                <Text> by {formatShortDate(market.maturityDate)}</Text>
                                <Text>{market.poolSize.toFixed(2) + USD_SIGN}</Text>
                            </MarketRow>
                        ))}
                    {filter === Filters.ORDERS &&
                        filteredMarkets?.map((order: any, index) => (
                            <MarketRow
                                style={{
                                    background: order.isBuy ? 'rgb(61, 186, 162,0.6)' : 'rgb(255, 122, 104, 0.6)',
                                }}
                                key={index}
                                onClick={() => {
                                    if (order.market.phase !== 'expiry') {
                                        navigateToOptionsMarket(order.market.address);
                                    }
                                }}
                            >
                                <FlexDivCentered style={{ flex: 7, justifyContent: 'flex-start' }}>
                                    <Currency.Name
                                        currencyKey={order.market.currencyKey}
                                        showIcon={true}
                                        iconProps={{ width: '32px', height: '32px', type: 'asset' }}
                                    />
                                    <Text className="text-xxs" style={{ margin: '0 8px' }}>
                                        {order.isLong ? ' > ' : ' < '}
                                        {formatCurrency(order.market.strikePrice) + USD_SIGN + ' '}
                                        by {formatShortDate(order.market.maturityDate)}
                                    </Text>
                                </FlexDivCentered>
                                <Text className="text-xxs" style={{ flex: 2, textAlign: 'center' }}>
                                    {order.displayOrder.amount.toFixed(2) + ' x '}
                                    {order.displayOrder.price.toFixed(2) + USD_SIGN}
                                </Text>
                                <Text className="text-xxs" style={{ flex: 2, textAlign: 'center' }}>
                                    {formatPercentage(order.displayOrder.filled, 0)}
                                </Text>
                                <Text className="text-xxs" style={{ flex: 2, textAlign: 'center' }}>
                                    {new Date(order.displayOrder.timeRemaining).toDateString()}
                                </Text>
                            </MarketRow>
                        ))}
                </DataWrapper>
            </ModalWrapper>
        </Modal>
    );
};

const ModalWrapper = styled(FlexDivColumn)`
    width: 600px;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 23px;
    margin: 240px auto;
`;

const Header = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
`;

const WalletWrapper = styled(FlexDiv)`
    background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    box-shadow: 0px 2px 6px #101a76;
    border-radius: 23px;
    padding: 15px 35px;
    margin: 0 25px;
    align-items: center;
`;

const FilterWrapper = styled(FlexDiv)`
    padding: 0 25px;
    position: relative;
    &:after {
        position: absolute;
        content: '';
        display: block;
        bottom: 0;
        left: 0px;
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    }
`;

const DataWrapper = styled(FlexDivColumn)`
    background: #151862;
    padding-bottom: 20px;
    border-bottom-right-radius: 23px;
    border-bottom-left-radius: 23px;
`;

const MarketRow = styled(FlexDiv)`
    color: white;
    font-size: 14px;
    line-height: 16px;
    padding: 12px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 12px;
    margin: 6px 8px;

    &:hover {
        border: 1px solid #44e1e2;
        padding: 11px;
    }
`;

export default UserInfoModal;
