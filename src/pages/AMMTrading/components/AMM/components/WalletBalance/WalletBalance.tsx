import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';

import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import {
    AccountMarketInfo,
    MarketType,
    OptionSide,
    RangedMarketBalanceInfo,
    RangedMarketPositionType,
} from 'types/options';
import { getCurrencyKeyBalance } from 'utils/balances';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { SYNTHS_MAP } from 'constants/currency';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { UI_COLORS } from 'constants/ui';
import { getStableCoinForNetwork } from '../../../../../../utils/currency';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { MARKET_TYPE } from 'constants/options';

type WalletBalancePropsType = {
    type: OptionSide | RangedMarketPositionType;
};

const WalletBalance: React.FC<WalletBalancePropsType> = ({ type }) => {
    const marketType: MarketType =
        type == 'long' || type == 'short' ? (MARKET_TYPE[0] as MarketType) : (MARKET_TYPE[1] as MarketType);
    const optionsMarket = marketType == MARKET_TYPE[0] ? useMarketContext() : useRangedMarketContext();

    let optBalances = marketType == MARKET_TYPE[0] ? { short: 0, long: 0 } : { in: 0, out: 0 };

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && marketType == MARKET_TYPE[0],
    });

    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(optionsMarket?.address, walletAddress, networkId, {
        enabled: isAppReady && marketType == MARKET_TYPE[1],
    });

    if (
        isWalletConnected &&
        accountMarketInfoQuery.isSuccess &&
        accountMarketInfoQuery.data &&
        marketType == MARKET_TYPE[0]
    ) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    if (
        isWalletConnected &&
        rangedMarketsBalance.isSuccess &&
        rangedMarketsBalance.data &&
        marketType == MARKET_TYPE[1]
    ) {
        optBalances = rangedMarketsBalance.data as RangedMarketBalanceInfo;
    }

    const tokenBalance =
        marketType == MARKET_TYPE[0]
            ? type == 'long'
                ? optBalances.long
                : optBalances.short
            : type == 'in'
            ? optBalances.in
            : optBalances.out;

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    return (
        <Wrapper>
            <BalanceContainer>
                <WalletIcon className="sidebar-icon icon--wallet" />
                <Balance>{formatCurrencyWithKey(getStableCoinForNetwork(networkId), sUSDBalance)}</Balance>
            </BalanceContainer>
            {tokenBalance && (
                <BalanceContainer>
                    <Balance>{formatCurrency(tokenBalance)}</Balance>
                    <TokenIcon
                        // Temporary same icons for in and long positions
                        className={`v2-icon ${
                            marketType == MARKET_TYPE[0]
                                ? type == 'long'
                                    ? 'v2-icon--up'
                                    : 'v2-icon--down'
                                : type == 'in'
                                ? 'v2-icon--in'
                                : 'v2-icon--out'
                        }`}
                        color={
                            marketType == MARKET_TYPE[0]
                                ? type == 'long'
                                    ? UI_COLORS.GREEN
                                    : UI_COLORS.RED
                                : type == 'in'
                                ? UI_COLORS.IN_COLOR
                                : UI_COLORS.OUT_COLOR
                        }
                    />
                </BalanceContainer>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    border: 1px solid var(--card-border-color);
    border-radius: 15px;
    padding: 3px 5px;
`;

const BalanceContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    margin: 0 7px;
`;

const WalletIcon = styled.i`
    font-size: 20px;
    margin-right: 8px;
    color: var(--card-border-color);
`;

const Balance = styled.span`
    font-size: 13px;
    color: var(--primary-color);
`;

const TokenIcon = styled.i<{ color?: string }>`
    font-size: 20px;
    margin-left: 8px;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
`;

export default WalletBalance;
