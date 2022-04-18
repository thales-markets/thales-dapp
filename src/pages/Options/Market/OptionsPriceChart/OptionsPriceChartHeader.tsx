import React, { useMemo } from 'react';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { FlexDivRow, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import { OptionsMarketInfo, Orders } from 'types/options';
import { mean } from 'lodash';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import { COLORS } from 'constants/ui';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';

type OptionsPriceChartContentProps = {
    optionsMarket: OptionsMarketInfo;
};

const OptionsPriceChartHeader: React.FC<OptionsPriceChartContentProps> = ({ optionsMarket }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const longOrderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsMarket.longAddress, {
        enabled: isAppReady,
    });
    const shortOrderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsMarket.shortAddress, {
        enabled: isAppReady,
    });

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(optionsMarket.address, networkId, {
        enabled: isAppReady,
    });

    const getMarketPrice = (sellOrders: Orders, buyOrders: Orders) => {
        if (sellOrders.length > 0 && buyOrders.length > 0) {
            const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
            const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
            const marketPrice = mean([lowestSellOrderPrice, highestBuyOrderPrice]);
            return marketPrice;
        }
        if (sellOrders.length > 0) {
            const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
            return lowestSellOrderPrice;
        }
        if (buyOrders.length > 0) {
            const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
            return highestBuyOrderPrice;
        }

        return EMPTY_VALUE;
    };

    const longMarketPrice = useMemo(() => {
        const sellOrders =
            shortOrderbookQuery.isSuccess && longOrderbookQuery.data ? longOrderbookQuery.data.sellOrders : [];
        const buyOrders =
            longOrderbookQuery.isSuccess && longOrderbookQuery.data ? longOrderbookQuery.data.buyOrders : [];
        const ammMaxLimits =
            ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
                ? (ammMaxLimitsQuery.data as AmmMaxLimits)
                : undefined;

        const marketPrice =
            ammMaxLimits && ammMaxLimits.isMarketInAmmTrading
                ? mean([ammMaxLimits.buyLongPrice, ammMaxLimits.sellLongPrice])
                : getMarketPrice(sellOrders, buyOrders);
        return formatCurrencyWithSign(USD_SIGN, marketPrice, DEFAULT_OPTIONS_DECIMALS);
    }, [longOrderbookQuery.data, ammMaxLimitsQuery.data]);

    const shortMarketPrice = useMemo(() => {
        const sellOrders =
            shortOrderbookQuery.isSuccess && shortOrderbookQuery.data ? shortOrderbookQuery.data.sellOrders : [];
        const buyOrders =
            shortOrderbookQuery.isSuccess && shortOrderbookQuery.data ? shortOrderbookQuery.data.buyOrders : [];
        const ammMaxLimits =
            ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
                ? (ammMaxLimitsQuery.data as AmmMaxLimits)
                : undefined;

        const marketPrice =
            ammMaxLimits && ammMaxLimits.isMarketInAmmTrading
                ? mean([ammMaxLimits.buyShortPrice, ammMaxLimits.sellShortPrice])
                : getMarketPrice(sellOrders, buyOrders);
        return formatCurrencyWithSign(USD_SIGN, marketPrice, DEFAULT_OPTIONS_DECIMALS);
    }, [shortOrderbookQuery.data, ammMaxLimitsQuery.data]);

    return (
        <ChartHeader>
            <ChartTitle color={COLORS.LONG}>
                {SYNTHS_MAP.sLONG}
                <Splitter>|</Splitter> {longMarketPrice}
            </ChartTitle>
            <ChartTitle color={COLORS.SHORT}>
                {SYNTHS_MAP.sSHORT}
                <Splitter>|</Splitter> {shortMarketPrice}
            </ChartTitle>
        </ChartHeader>
    );
};

const Splitter = styled.span`
    margin: 0px 5px;
`;

const ChartHeader = styled(FlexDivRow)``;

const ChartTitle = styled(FlexDiv)<{ color: COLORS }>`
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: ${(props) => props.color};
    padding: 10px 30px;
    @media (max-width: 512px) {
        padding: 10px;
        font-size: 16px;
    }
`;

export default OptionsPriceChartHeader;
