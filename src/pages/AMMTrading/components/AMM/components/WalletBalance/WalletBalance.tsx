import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';

import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { AccountMarketInfo, OptionSide } from 'types/options';
import { getCurrencyKeyBalance } from 'utils/balances';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { SYNTHS_MAP } from 'constants/currency';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { UI_COLORS } from 'constants/ui';

type WalletBalancePropsType = {
    type: OptionSide;
};

const WalletBalance: React.FC<WalletBalancePropsType> = ({ type }) => {
    const optionsMarket = useMarketContext();

    let optBalances = {
        long: 0,
        short: 0,
    };

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }
    const tokenBalance = type === 'long' ? optBalances.long : optBalances.short;

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
                <Balance>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</Balance>
            </BalanceContainer>
            {tokenBalance > 0 && (
                <BalanceContainer>
                    <Balance>{formatCurrency(tokenBalance)}</Balance>
                    <TokenIcon
                        className={`v2-icon ${type == 'long' ? 'v2-icon--up' : 'v2-icon--down'}`}
                        color={type == 'long' ? UI_COLORS.GREEN : UI_COLORS.RED}
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
