import React, { useMemo, useState } from 'react';
import { Modal } from '@material-ui/core';
import { Button, FlexDiv, FlexDivColumn, FlexDivCentered, Image, Text, XButton } from 'theme/common';
import styled from 'styled-components';
import metamask from 'assets/images/metamask.svg';
import onboardConnector from 'utils/onboardConnector';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { sortOptionsMarkets } from 'utils/options';
import { RootState } from 'redux/rootReducer';
import { truncateAddress } from 'utils/formatters/string';
import UsersAssets from './UsersAssets';
import UsersOrders from './UsersOrders';
import UsersMarkets from './UsersMarkets';
import Web3 from 'web3';
import { FilterButton, Input, InputLabel, ShortInputContainer } from 'pages/Options/Market/components';
import axios from 'axios';
import useDisplayNameQuery from 'queries/user/useDisplayNameQuery';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';

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

const ethEnabled = () => {
    if (window.ethereum) {
        window.web3 = new Web3(Web3.givenProvider) as any;
        return true;
    }
    return false;
};

const DISPLAY_NAME_REGEX = /^[a-zA-Z0-9 ]+$/;

const UserInfoModal: React.FC<UserInfoModalProps> = ({ open, handleClose, walletAddress, network }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({
                      ...m,
                      openOrders: (openOrdersMap as any).get(m.address.toLowerCase())?.ordersCount ?? '0',
                      availableLongs: (openOrdersMap as any).get(m.address.toLowerCase())?.availableLongs ?? '0',
                      availableShorts: (openOrdersMap as any).get(m.address.toLowerCase())?.availableShorts ?? '0',
                  }))
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery, openOrdersMap]);

    const displayNameQuery = useDisplayNameQuery(walletAddress, { enabled: open });

    const currentDisplayName = displayNameQuery.isSuccess ? displayNameQuery.data.name : '';

    useEffect(() => {
        if (currentDisplayName !== '') {
            setName(currentDisplayName);
        }
    }, [currentDisplayName]);

    const [displayName, setName] = useState(currentDisplayName);

    const [filter, setFilter] = useState(Filters.MARKETS);

    const usersMarkets = useMemo(
        () =>
            optionsMarkets.filter((market) => {
                return market.creator.toLowerCase() === walletAddress.toLowerCase();
            }),

        [optionsMarkets, filter]
    );

    const isNameValid = useMemo(() => {
        return DISPLAY_NAME_REGEX.test(displayName);
    }, [displayName]);

    const setDisplayName = async (walletAddress: string, displayName: string) => {
        if (!ethEnabled()) {
            alert('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!');
        }

        (window.web3?.eth as any).personal.sign(displayName, walletAddress, async (_test: any, signature: any) => {
            try {
                await axios.post('https://api.thales.market/display-name', {
                    walletAddress,
                    displayName,
                    signature,
                });
                displayNameQuery.refetch();
            } catch (e) {
                console.log(e);
            }
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper>
                <Header>
                    <Text className="text-m bold pale-grey">{currentDisplayName}</Text>
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
                                width: 180,
                                height: 40,
                                marginBottom: 10,
                                padding: '4px 24px',
                                alignSelf: 'flex-end',
                            }}
                            onClick={() => {
                                onboardConnector.onboard.walletSelect();
                            }}
                        >
                            {t(`user-info.wallet.switch-wallet`)}
                        </Button>
                        <Button
                            className="primary text-xs"
                            style={{ width: 180, height: 40, padding: '4px 24px', alignSelf: 'flex-end' }}
                            onClick={() => {
                                onboardConnector.disconnectWallet();
                                handleClose(false);
                            }}
                        >
                            {t(`user-info.wallet.disconnect-wallet`)}
                        </Button>
                    </FlexDivColumn>
                </WalletWrapper>
                <FlexDivCentered style={{ justifyContent: 'space-between', margin: 25 }}>
                    <ShortInputContainer style={{ margin: 0, width: '45%' }}>
                        <InputLabel>{t(`user-info.wallet.display-name`)}</InputLabel>
                        <Input
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                            value={displayName}
                        />
                    </ShortInputContainer>
                    <Button
                        onClick={() => {
                            setDisplayName(walletAddress, displayName);
                        }}
                        disabled={!isNameValid}
                        className="primary"
                    >
                        {t(`user-info.wallet.change-display-name`)}
                    </Button>
                </FlexDivCentered>

                <FilterWrapper>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.MARKETS ? 'selected' : ''}
                        onClick={() => setFilter(Filters.MARKETS)}
                    >
                        {t(`user-info.tabs.my-markets`)}
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.ORDERS ? 'selected' : ''}
                        onClick={() => setFilter(Filters.ORDERS)}
                    >
                        {t(`user-info.tabs.my-open-orders`)}
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.ASSETS ? 'selected' : ''}
                        onClick={() => setFilter(Filters.ASSETS)}
                    >
                        {t(`user-info.tabs.my-assets`)}
                    </FilterButton>
                </FilterWrapper>
                <DataWrapper>
                    {filter === Filters.MARKETS && (
                        <UsersMarkets usersMarkets={usersMarkets} onClose={() => handleClose(false)} />
                    )}
                    {filter === Filters.ORDERS && (
                        <UsersOrders
                            optionsMarkets={optionsMarkets}
                            walletAddress={walletAddress}
                            networkId={networkId}
                            onClose={() => handleClose(false)}
                        />
                    )}
                    {filter === Filters.ASSETS && (
                        <UsersAssets
                            optionsMarkets={optionsMarkets}
                            walletAddress={walletAddress}
                            onClose={() => handleClose(false)}
                        />
                    )}
                </DataWrapper>
            </ModalWrapper>
        </Modal>
    );
};

const ModalWrapper = styled(FlexDivColumn)`
    width: 600px;
    max-height: min(90%, 800px);
    overflow-y: auto;
    background: #04045a;
    border-radius: 23px;
    margin: 5% auto;
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
        bottom: 1px;
        left: 0px;
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    }
`;

const DataWrapper = styled(FlexDivColumn)`
    background: #04045a;
    padding-bottom: 20px;
    border-bottom-right-radius: 23px;
    border-bottom-left-radius: 23px;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    font-size: 14px;
    line-height: 16px;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    background: #24273133;
    text-align: center;
`;

export const MarketRow = styled(Row)`
    cursor: pointer;
    &:hover {
        border: 1px solid #44e1e2;
        padding: 19px;
    }
`;

export default UserInfoModal;
