import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import { assetToTradingViewMap } from 'config/tradingView';
import { FlexDivColumn, FlexDivRowCentered, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';
import { useMarketContext } from '../contexts/MarketContext';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import Currency from 'components/Currency';

const TradingView: React.FC = () => {
    const optionsMarket = useMarketContext();
    const symbol = assetToTradingViewMap[optionsMarket.currencyKey] || `${optionsMarket.asset}USDT`;
    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.CHART_TRADING_VIEW} />
            <MarketWidgetContent>
                <Container>
                    <ChartHeader>
                        <ChartTitle>
                            <Currency.Pair
                                baseCurrencyKey={optionsMarket.currencyKey}
                                baseCurrencyAsset={optionsMarket.asset}
                                quoteCurrencyKey={FIAT_CURRENCY_MAP.USD}
                            />
                            <Splitter>|</Splitter> {formatCurrencyWithSign(USD_SIGN, optionsMarket.currentPrice)}
                        </ChartTitle>
                    </ChartHeader>
                    <ChartContainer>
                        <InnerChartContainer>
                            <TradingViewWidget
                                symbol={symbol}
                                save_image={false}
                                style="2"
                                range="12m"
                                withdateranges={true}
                                autosize={true}
                                hide_side_toolbar={false}
                                theme="Dark"
                            />
                        </InnerChartContainer>
                    </ChartContainer>
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivColumn)`
    background: #04045a;
    border-radius: 20px;
    width: 100%;
    height: 100%;
`;

const Splitter = styled.span`
    margin: 0px 5px;
`;

const ChartHeader = styled(FlexDivRowCentered)``;

const ChartTitle = styled(FlexDiv)`
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    padding: 10px 30px;
`;

const ChartContainer = styled.div`
    width: 100%;
    height: calc(100% - 52px);
`;

const InnerChartContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export default TradingView;
