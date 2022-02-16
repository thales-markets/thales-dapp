import React, { useMemo } from 'react';

import AssetInfo from '../../../../components/AssetInfo/AssetInfo';
import PriceChart from 'components/Charts/PriceChart';
import Container from './styled-components/Container';

import { useMarketContext } from '../../contexts/MarketContext';

import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';

import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';

const RowCard: React.FC = () => {
    const marketInfo = useMarketContext();
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

    console.log('MarketInfo ', marketInfo);

    return (
        <>
            {marketInfo && (
                <Container>
                    <AssetInfo currencyKey={marketInfo.currencyKey} logoSize="50px" />
                    <Container.ChartContainer>
                        <PriceChart currencyKey={marketInfo.currencyKey} footerFontSize={'10px'} />
                    </Container.ChartContainer>
                    <Container.SubContainer>
                        <Container.SubContainer.Header>
                            {t('options.home.market-card.current-asset-price')}
                        </Container.SubContainer.Header>
                        <Container.SubContainer.Value>
                            {formatCurrencyWithKey(USD_SIGN, marketInfo.currentPrice, 2)}
                        </Container.SubContainer.Value>
                    </Container.SubContainer>
                    <Container.Divider />
                    <Container.SubContainer>
                        <Container.SubContainer.Header>
                            {t('options.home.market-card.strike-price')}
                        </Container.SubContainer.Header>
                        <Container.SubContainer.Value>
                            {formatCurrencyWithKey(USD_SIGN, marketInfo.strikePrice, 2)}
                        </Container.SubContainer.Value>
                    </Container.SubContainer>
                    <Container.Divider />
                    <Container.SubContainer>
                        <Container.SubContainer.Header>
                            {t('options.market.overview.maturity-date')}
                        </Container.SubContainer.Header>
                        <Container.SubContainer.Value>{`@ ${
                            marketInfo.maturityDate ? formatShortDate(marketInfo.maturityDate) : 'N/A'
                        }`}</Container.SubContainer.Value>
                    </Container.SubContainer>
                    <Container.Divider />
                    <Container.SubContainer>
                        <Container.SubContainer.Header>
                            {t('options.market.overview.amm-liquidity')}
                        </Container.SubContainer.Header>
                        <Container.SubContainer.Value>
                            <Container.SubContainer.Value.Liquidity>
                                {openOrdersMap
                                    ? (openOrdersMap as any).get(marketInfo.address.toLowerCase())?.availableLongs
                                    : '0'}
                            </Container.SubContainer.Value.Liquidity>
                            {' / '}
                            <Container.SubContainer.Value.Liquidity shortLiqFlag={true}>
                                {openOrdersMap
                                    ? (openOrdersMap as any).get(marketInfo.address.toLowerCase())?.availableShorts
                                    : '0'}
                            </Container.SubContainer.Value.Liquidity>
                        </Container.SubContainer.Value>
                    </Container.SubContainer>
                </Container>
            )}
        </>
    );
};

export default RowCard;
