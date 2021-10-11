import React from 'react';
import styled from 'styled-components';
import { FlexDivRowCentered, Image } from 'theme/common';
import { OptionSide, OptionsMarketInfo } from 'types/options';
import Orderbook from '../TradeOptions/Orderbook';
import tradeIcon from 'assets/images/footer-nav/trade.svg';
import orderbookIcon from 'assets/images/footer-nav/orderbook.svg';
import transactionsIcon from 'assets/images/footer-nav/transactions.svg';
import chartIcon from 'assets/images/footer-nav/chart.svg';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import TradeOptions from '../TradeOptions';
import YourTransactions from '../TransactionsCard/YourTransactions';
import RecentTransactions from '../TransactionsCard/RecentTransactions';
import OptionsPriceChart from '../OptionsPriceChart';
import chartActiveIcon from 'assets/images/footer-nav/chart-active.svg';
import tradeActiveIcon from 'assets/images/footer-nav/trade-active.svg';
import orderbookActiveIcon from 'assets/images/footer-nav/orderbook-active.svg';
import transactionsActiveIcon from 'assets/images/footer-nav/transactions-active.svg';
import TradingView from '../TradingView';
import MaturityPhaseCard from '../TradeCard/MaturityPhaseCard';
import CustomMarketResults from '../CustomMarketResults';

type MarketMobileProps = {
    side: OptionSide;
    market: OptionsMarketInfo;
    accountInfo: { long: number; short: number };
};

enum Widgets {
    Trade,
    Orderbook,
    Transactions,
    Chart,
}

const MarketMobile: React.FC<MarketMobileProps> = ({ side, market, accountInfo }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [widget, setWidget] = useState(Widgets.Trade);

    const renderWidget = () => {
        switch (widget) {
            case Widgets.Trade:
                return (
                    <WidgetWrapper
                        className={market.phase === 'maturity' ? 'market__maturity' : ''}
                        background={
                            market.phase === 'maturity'
                                ? ''
                                : 'linear-gradient(90deg, #3936C7 -8.53%, #2D83D2 52.71%, #23A5DD 105.69%, #35DADB 127.72%)'
                        }
                    >
                        {market.phase === 'maturity' ? (
                            <MaturityPhaseCard optionsMarket={market} accountMarketInfo={accountInfo} />
                        ) : (
                            <TradeOptions optionSide={side} />
                        )}
                    </WidgetWrapper>
                );
            case Widgets.Orderbook:
                return (
                    <WidgetWrapper className="market__orderbook">
                        <Orderbook optionSide={side} />
                    </WidgetWrapper>
                );
            case Widgets.Transactions:
                return (
                    <>
                        <WidgetWrapper className="market__yourTx">
                            <YourTransactions marketAddress={market.address} walletAddress={walletAddress} />
                        </WidgetWrapper>
                        <WidgetWrapper className="market__recentTx">
                            <RecentTransactions marketAddress={market.address} />
                        </WidgetWrapper>
                    </>
                );
            case Widgets.Chart:
                return (
                    <>
                        <WidgetWrapper className="market__priceChart">
                            <OptionsPriceChart />
                        </WidgetWrapper>
                        {market.customMarket ? (
                            <WidgetWrapper className="market__customMarketResults">
                                <CustomMarketResults />
                            </WidgetWrapper>
                        ) : (
                            <WidgetWrapper className="market__tradingView">
                                <TradingView />
                            </WidgetWrapper>
                        )}
                    </>
                );
        }
    };

    return (
        <>
            {renderWidget()}
            <NavFooter>
                <Icon
                    onClick={setWidget.bind(this, Widgets.Trade)}
                    src={widget === Widgets.Trade ? tradeActiveIcon : tradeIcon}
                />
                {market.phase !== 'maturity' && (
                    <Icon
                        onClick={setWidget.bind(this, Widgets.Orderbook)}
                        src={widget === Widgets.Orderbook ? orderbookActiveIcon : orderbookIcon}
                    />
                )}

                <Icon
                    onClick={setWidget.bind(this, Widgets.Transactions)}
                    src={widget === Widgets.Transactions ? transactionsActiveIcon : transactionsIcon}
                />

                <Icon
                    onClick={setWidget.bind(this, Widgets.Chart)}
                    src={widget === Widgets.Chart ? chartActiveIcon : chartIcon}
                />
            </NavFooter>
            ;
        </>
    );
};

const WidgetWrapper = styled.div<{ background?: string }>`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 10px;
    margin: 10px;
    background: ${(props) => props.background || '#04045a'};
    border-radius: 23px;
    overflow: hidden;
    padding-bottom: 40px;
    iframe {
        min-height: 480px;
    }
`;

const NavFooter = styled(FlexDivRowCentered)`
    height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #04045a;
    border-radius: 20px 20px 0 0;
    border-top: 1px solid #ca91dc;
    width: 100%;
    padding: 0 65px;
    z-index: 1000;
`;

const Icon = styled(Image)`
    width: 24px;
    height: 26px;
`;

export default MarketMobile;
