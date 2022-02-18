import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';

import { assetToTradingViewMap } from 'config/tradingView';

import { Container } from './styled-components/Container';

const TradingView: React.FC = () => {
    const marketInfo = useMarketContext();
    const symbol = assetToTradingViewMap[marketInfo?.currencyKey] || `${marketInfo?.asset}USDT`;
    return (
        <Container>
            <TradingViewWidget
                symbol={symbol}
                save_image={false}
                autosize={true}
                style="2"
                range="12m"
                withdateranges={true}
                hide_side_toolbar={true}
                theme="Dark"
            />
        </Container>
    );
};

export default TradingView;
