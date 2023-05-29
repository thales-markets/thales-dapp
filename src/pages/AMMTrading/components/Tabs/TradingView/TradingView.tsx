import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';

import { assetToTradingViewMap } from 'config/tradingView';

import { Container, CopyrightLabel, TradingViewLink } from './styled-components';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';

const TradingView: React.FC = () => {
    // TODO: fix this warning
    // eslint-disable-next-line
    const marketInfo = useMarketContext() || useRangedMarketContext();

    const symbol = assetToTradingViewMap[marketInfo?.currencyKey] || `${marketInfo?.currencyKey}USDT`;
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
