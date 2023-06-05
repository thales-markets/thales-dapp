import { COLLATERALS } from 'constants/options';
import { Positions } from 'enums/options';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getSelectedCollateral, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivRowCentered, FlexDivSpaceBetween } from 'theme/common';
import { AccountMarketInfo, RangedMarketBalanceInfo, StableCoins } from 'types/options';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import { getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';

type WalletBalanceProps = {
    isRangedMarket: boolean;
    positionType: Positions;
};

const WalletBalance: React.FC<WalletBalanceProps> = ({ isRangedMarket, positionType }) => {
    const optionsMarket = isRangedMarket ? useRangedMarketContext() : useMarketContext();
    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));

    let optBalances = isRangedMarket ? { in: 0, out: 0 } : { short: 0, long: 0 };
    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected && !isRangedMarket,
    });

    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(optionsMarket?.address, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isRangedMarket,
    });

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data && !isRangedMarket) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    if (isWalletConnected && rangedMarketsBalance.isSuccess && rangedMarketsBalance.data && isRangedMarket) {
        optBalances = rangedMarketsBalance.data as RangedMarketBalanceInfo;
    }

    const tokenBalance = isRangedMarket
        ? positionType == Positions.IN
            ? optBalances.in
            : optBalances.out
        : positionType == Positions.UP
        ? optBalances.long
        : optBalances.short;

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
            <Label>{t(`common.wallet.balance`)}:</Label>
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
                {!!tokenBalance && <Balance>{formatCurrencyWithKey(positionType, tokenBalance)}</Balance>}
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
