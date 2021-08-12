import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { AccountMarketInfo, OptionSide, OrderSide } from 'types/options';
import { getIsAppReady } from 'redux/modules/app';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import { getCurrencyKeyBalance } from 'utils/balances';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import { WalletContainer, Wallet } from 'pages/Options/Market/components';
import { FlexDivCentered, FlexDivRow } from 'theme/common';
import { ReactComponent as WalletIcon } from 'assets/images/wallet-light.svg';
import {
    CloseIconContainer,
    ModalContainer,
    ModalTitle,
    StyledModal,
    ModalHeader,
} from 'pages/Options/Market/TradeOptions/Orderbook/components';
import PlaceOrder from 'pages/Options/Market/TradeOptions/PlaceOrder';
import { withStyles } from '@material-ui/core';
import styled from 'styled-components';

type PlaceOrderModalProps = {
    optionSide: OptionSide;
    orderSide: OrderSide;
    onClose: () => void;
    market?: any;
};

export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({ onClose, optionSide, market, orderSide }) => {
    const { t } = useTranslation();
    const optionsMarket = market || useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    let optBalances = {
        long: 0,
        short: 0,
    };
    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }
    const tokenBalance = optionSide === 'long' ? optBalances.long : optBalances.short;

    return (
        <StyledPlaceOrderModal open disableBackdropClick onClose={onClose}>
            <PlaceOrderModalContainer>
                <PlaceOrderModalHeader>
                    <ModalTitle>{t(`options.market.trade-options.place-order.modal.${orderSide}.title`)}</ModalTitle>
                    <FlexDivRow>
                        <FlexDivCentered>
                            <WalletIcon />
                            <WalletContainer>
                                {isWalletConnected ? (
                                    <>
                                        <Wallet>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</Wallet>
                                        <Wallet>
                                            {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], tokenBalance)}
                                        </Wallet>
                                    </>
                                ) : (
                                    EMPTY_VALUE
                                )}
                            </WalletContainer>
                        </FlexDivCentered>
                        <CloseIconContainer onClick={onClose} />
                    </FlexDivRow>
                </PlaceOrderModalHeader>
                <PlaceOrder optionSide={optionSide} market={market} defaultOrderSide={orderSide} />
            </PlaceOrderModalContainer>
        </StyledPlaceOrderModal>
    );
};

const StyledPlaceOrderModal = withStyles(() => ({
    paper: {
        width: '600px',
        background: 'linear-gradient(90deg,#3936C7 -8.53%,#2D83D2 52.71%,#23A5DD 105.69%,#35DADB 127.72%)',
    },
}))(StyledModal);

export const PlaceOrderModalContainer = styled(ModalContainer)`
    padding: 20px 15px 40px 15px;
`;

export const PlaceOrderModalHeader = styled(ModalHeader)`
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 40px;
`;

export default PlaceOrderModal;
