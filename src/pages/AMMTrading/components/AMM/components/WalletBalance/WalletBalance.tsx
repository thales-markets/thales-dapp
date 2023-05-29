import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { AccountMarketInfo, MarketType, RangedMarketBalanceInfo, StableCoins } from 'types/options';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import { getIsWalletConnected, getNetworkId, getSelectedCollateral, getWalletAddress } from 'redux/modules/wallet';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { getAssetIcon, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { COLLATERALS, MARKET_TYPE, Positions } from 'constants/options';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import { FlexDivRow, FlexDivRowCentered, FlexDivSpaceBetween } from 'theme/common';

type WalletBalancePropsType = {
    type: Positions;
};

const WalletBalance: React.FC<WalletBalancePropsType> = ({ type }) => {
    const isRangedAmm = [Positions.IN, Positions.OUT].includes(type);
    const marketType: MarketType = isRangedAmm ? (MARKET_TYPE[1] as MarketType) : (MARKET_TYPE[0] as MarketType);
    // TODO: fix this warning
    // eslint-disable-next-line
    const optionsMarket = isRangedAmm ? useRangedMarketContext() : useMarketContext();
    let optBalances = isRangedAmm ? { in: 0, out: 0 } : { short: 0, long: 0 };

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && walletAddress !== '' && marketType == MARKET_TYPE[0],
    });

    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(optionsMarket?.address, walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && marketType == MARKET_TYPE[1],
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
            ? type == Positions.UP
                ? optBalances.long
                : optBalances.short
            : type == Positions.IN
            ? optBalances.in
            : optBalances.out;

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const walletBalancesMap = stableBalanceQuery.isSuccess && stableBalanceQuery.data ? stableBalanceQuery.data : null;

    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && userSelectedCollateral !== 0,
    });

    const sUSDBalance =
        userSelectedCollateral && Number(userSelectedCollateral) !== 0
            ? getStableCoinBalance(multipleStableBalances?.data, COLLATERALS[userSelectedCollateral] as StableCoins)
            : getCurrencyKeyStableBalance(walletBalancesMap, getStableCoinForNetwork(networkId)) || 0;

    return (
        <Wrapper>
            <Label>Wallet balance:</Label>
            <BalanceContainer>
                <Balance>
                    {formatCurrencyWithKey(
                        getStableCoinForNetwork(
                            networkId,
                            userSelectedCollateral ? (COLLATERALS[userSelectedCollateral] as StableCoins) : undefined
                        ),
                        sUSDBalance
                    )}
                </Balance>
                {!!tokenBalance && <Balance>{formatCurrencyWithKey(type, tokenBalance)}</Balance>}
            </BalanceContainer>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivSpaceBetween)`
    color: ${(props) => props.theme.button.textColor.primary};
    background: ${(props) => props.theme.button.background.primary};
    border-radius: 8px;
    width: 100%;
    padding: 4px 10px;
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 6px;
`;

const Label = styled.span`
    text-transform: uppercase;
`;

const BalanceContainer = styled(FlexDivRowCentered)``;

const Balance = styled.span`
    padding: 0 10px;
    :last-child:not(:first-child) {
        border-left: 2px solid ${(props) => props.theme.button.borderColor.quaternary};
    }
`;

export default WalletBalance;
