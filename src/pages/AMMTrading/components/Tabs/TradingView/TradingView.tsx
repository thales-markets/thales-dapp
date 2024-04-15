import { assetToTradingViewMap } from 'config/tradingView';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import { Container, CopyrightLabel, TradingViewLink } from './styled-components';

const TradingView: React.FC = () => {
    const directMarket = useMarketContext();
    const rangedMarket = useRangedMarketContext();
    const market = directMarket || rangedMarket;
    const symbol = assetToTradingViewMap[market.currencyKey] || `${market.currencyKey}USDT`;

    return (
        <Container>
            <div id="tradingview_f42fd"></div>
            <TradingViewWidget
                symbol={symbol}
                save_image={false}
                autosize={true}
                style="2"
                range="12m"
                withdateranges={true}
                hide_side_toolbar={false}
                container_id={'tradingview_f42fd'}
                theme="Dark"
            />
            <CopyrightLabel>
                <TradingViewLink href={`https://www.tradingview.com/symbols/${symbol}`}>{symbol}</TradingViewLink>
                {' by TradingView'}
            </CopyrightLabel>
        </Container>
    );
};

export default TradingView;
