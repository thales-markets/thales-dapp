import React from 'react';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import Currency from 'components/Currency';
import { FlexDivRowCentered, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import { OptionsMarketInfo } from 'types/options';

type OptionsPriceChartContentProps = {
    optionsMarket: OptionsMarketInfo;
};

const OptionsPriceChartHeader: React.FC<OptionsPriceChartContentProps> = ({ optionsMarket }) => {
    return (
        <ChartHeader>
            <ChartTitle>
                <Currency.Pair
                    baseCurrencyKey={optionsMarket.currencyKey}
                    baseCurrencyAsset={optionsMarket.asset}
                    quoteCurrencyKey={FIAT_CURRENCY_MAP.USD}
                    iconProps={{
                        type: 'asset',
                    }}
                />
                <Splitter>|</Splitter> {formatCurrencyWithSign(USD_SIGN, optionsMarket.currentPrice)}
            </ChartTitle>
        </ChartHeader>
    );
};

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

export default OptionsPriceChartHeader;
