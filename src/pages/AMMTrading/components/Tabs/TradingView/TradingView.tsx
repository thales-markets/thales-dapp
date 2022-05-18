import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';

import { assetToTradingViewMap } from 'config/tradingView';

import { Container } from './styled-components/Container';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';

const TradingView: React.FC = () => {
    const marketInfo = useMarketContext() || useRangedMarketContext();

    const symbol = assetToTradingViewMap[marketInfo?.currencyKey] || `${marketInfo?.currencyKey}USDT`;
    return (
        <Container>
            <TradingViewWidget
                symbol={symbol}
                save_image={false}
                autosize={true}
                style="2"
                range="12m"
                withdateranges={true}
                hide_side_toolbar={false}
                theme="Dark"
            />
        </Container>
    );
};

export default TradingView;
