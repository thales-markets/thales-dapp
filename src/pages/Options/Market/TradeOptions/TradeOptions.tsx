import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountMarketInfo, OptionSide } from 'types/options';
import TokenSwap from './TokenSwap';
import PlaceOrder from './PlaceOrder';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import { COLORS, MarketWidgetKey } from 'constants/ui';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRowCentered, FlexDivCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { RootState } from 'redux/rootReducer';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getCurrencyKeyBalance } from 'utils/balances';
import { useMarketContext } from '../contexts/MarketContext';
import { ReactComponent as WalletIcon } from 'assets/images/wallet-dark.svg';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import MintOptions from './MintOptions';
import { FilterButton } from '../components';

type TradeOptionsProps = {
    optionSide: OptionSide;
};

const TradeOptions: React.FC<TradeOptionsProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
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

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const tabContent: Array<{
        id: 'market' | 'limit' | 'mint';
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'limit',
                name: t('options.market.trade-options.limit-tab-title'),
            },
            {
                id: 'market',
                name: t('options.market.trade-options.market-tab-title'),
            },
            {
                id: 'mint',
                name: t('options.market.trade-options.mint-tab-title'),
            },
        ],
        [t]
    );

    const [activeTab, setActiveTab] = useState(tabContent[0]);

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.TRADE}>
                <FlexDivCentered>
                    <WalletIcon />
                    <WalletContainer>
                        {isWalletConnected ? (
                            <>
                                <Wallet>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</Wallet>
                                <Wallet color={optionSide === 'long' ? COLORS.LONG : COLORS.SHORT}>
                                    {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], tokenBalance)}
                                </Wallet>
                            </>
                        ) : (
                            EMPTY_VALUE
                        )}
                    </WalletContainer>
                </FlexDivCentered>
            </MarketWidgetHeader>
            <MarketWidgetContent>
                <Container>
                    <FlexDivRowCentered>
                        <FilterContainer>
                            {tabContent.map((tab) => (
                                <TradeFilterButton
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab)}
                                    className={tab.id === activeTab.id ? 'selected' : ''}
                                    name={tab.id}
                                >
                                    {tab.name}
                                </TradeFilterButton>
                            ))}
                        </FilterContainer>
                    </FlexDivRowCentered>
                    {activeTab.id === 'market' && <TokenSwap optionSide={optionSide} />}
                    {activeTab.id === 'limit' && <PlaceOrder optionSide={optionSide} />}
                    {activeTab.id === 'mint' && <MintOptions />}
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivColumn)``;

const FilterContainer = styled.div`
    &:first-child {
        margin-left: 10px;
    }
    margin: 14px 0px;
`;

const TradeFilterButton = styled(FilterButton)`
    padding: 6px 32px;
`;

const WalletContainer = styled(FlexDivColumn)`
    align-items: end;
    margin-right: 20px;
    margin-left: 7px;
`;

const Wallet = styled.div<{ color?: string }>`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.25px;
    color: ${(props) => (props.color ? props.color : '#f6f6fe')};
`;

export default TradeOptions;
