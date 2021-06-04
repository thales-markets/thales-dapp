import React from 'react';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import Currency from 'components/Currency';
import OptionsChart from './OptionsChart';
import { useMarketContext } from '../contexts/MarketContext';
import TradingViewWidget from 'react-tradingview-widget';
import { assetToTradingViewMap } from 'config/tradingView';
import { FlexDivColumn, FlexDivRowCentered, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../components/MarketWidget/MarketWidgetContent';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';

type ChartCardType = {
    marketWidgetKey: MarketWidgetKey;
};

const ChartCard: React.FC<ChartCardType> = ({ marketWidgetKey }) => {
    const optionsMarket = useMarketContext();

    const chartProps = {
        optionsMarket,
    };

    return (
        <>
            <MarketWidgetHeader widgetKey={marketWidgetKey}></MarketWidgetHeader>
            <MarketWidgetContent>
                <Container style={{ width: '100%', height: '100%' }}>
                    <WidgetHeader>
                        <WidgetTitle>
                            <Currency.Pair
                                baseCurrencyKey={optionsMarket.currencyKey}
                                baseCurrencyAsset={optionsMarket.asset}
                                quoteCurrencyKey={FIAT_CURRENCY_MAP.USD}
                                iconProps={{
                                    type: 'asset',
                                }}
                            />
                            <Splitter>|</Splitter> {formatCurrencyWithSign(USD_SIGN, optionsMarket.currentPrice)}
                        </WidgetTitle>
                    </WidgetHeader>
                    <div style={{ width: '100%', height: 'calc(100% - 52px)' }}>
                        {marketWidgetKey === MarketWidgetKey.CHART_OPTIONS && <OptionsChart {...chartProps} />}
                        {marketWidgetKey === MarketWidgetKey.CHART_TRADING_VIEW && (
                            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                <TradingViewWidget
                                    symbol={assetToTradingViewMap[optionsMarket.currencyKey]}
                                    save_image={false}
                                    style="2"
                                    range="12m"
                                    withdateranges={true}
                                    autosize={true}
                                    hide_side_toolbar={false}
                                    theme="Dark"
                                />
                            </div>
                        )}
                    </div>
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivColumn)`
    background: #04045a;
    border-radius: 20px;
`;

const WidgetHeader = styled(FlexDivRowCentered)``;

const Splitter = styled.span`
    margin: 0px 5px;
`;

const WidgetTitle = styled(FlexDiv)`
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    padding: 10px 30px;
`;

export default ChartCard;
