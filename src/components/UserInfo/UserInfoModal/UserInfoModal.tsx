import React, { useMemo, useState } from 'react';
import { Modal } from '@material-ui/core';
import { Button, FilterButton, FlexDiv, FlexDivColumn, Image, Text, XButton } from 'theme/common';
import styled from 'styled-components';
import metamask from 'assets/images/metamask.svg';
import onboardConnector from 'utils/onboardConnector';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useBinaryOptionsUsersOrdersQuery from 'queries/options/useBinaryOptionsUsersOrdersQuery';
import snxJSConnector from 'utils/snxJSConnector';
import { sortOptionsMarkets } from 'utils/options';
import { RootState } from 'redux/rootReducer';
import { truncateAddress } from 'utils/formatters/string';
import Currency from 'components/Currency';
import { formatShortDate } from 'utils/formatters/date';
import { USD_SIGN } from 'constants/currency';
import { navigateToOptionsMarket } from 'utils/routes';
// import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';

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
    const ordersQuery = useBinaryOptionsUsersOrdersQuery(networkId, walletAddress);
    console.log('ordersQuery: ', ordersQuery);
    const [filter, setFilter] = useState(Filters.MARKETS);
    const { synthsMap } = snxJSConnector;

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
                // optionsMarkets.map((market) => {
                //     const orderbookQueryLong = useBinaryOptionsMarketOrderbook(networkId, market.longAddress);
                //     console.log('Long orders: ', orderbookQueryLong);
                //     const orderbookQueryShort = useBinaryOptionsMarketOrderbook(networkId, market.shortAddress);
                //     console.log('Short orders: ', orderbookQueryShort);
                // });
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
                    {filteredMarkets?.map((market, index) => (
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

    &:hover {
        border: 1px solid #44e1e2;
        padding: 11px;
        border-radius: 12px;
    }
`;

export default UserInfoModal;
