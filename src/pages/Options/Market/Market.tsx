import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { MarketProvider } from './contexts/MarketContext';
import { useBOMContractContext } from './contexts/BOMContractContext';
import { Button, Grid, Icon, Loader, Step } from 'semantic-ui-react';
import { OptionsMarketInfo } from 'types/options';
import { PHASES_CARDS } from 'constants/options';
import { Link } from 'react-router-dom';
import TransactionsCard from './TransactionsCard';
import MarketInfoModal from './MarketInfoModal';
import TradeCard from './TradeCard';
import ChartCard from './ChartCard';
import MarketSentiment from '../components/MarketSentiment';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import TradeOptions from './TradeOptions';

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
    const BOMContract = useBOMContractContext();

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, BOMContract);

    const handleViewMarketDetails = useCallback(() => {
        setMarketInfoModalVisible(true);
    }, []);

    const optionsMarket: OptionsMarketInfo | null = marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

    const marketHeading = optionsMarket
        ? `${optionsMarket.asset} > ${formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)} @ ${formatShortDate(
              optionsMarket.maturityDate
          )}`
        : null;

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <Grid>
                <Grid.Column width={11}>
                    <Grid.Row>
                        <span style={{ textTransform: 'uppercase' }}>
                            <Link to={ROUTES.Options.Home} className="item">
                                <Icon name="long arrow alternate left"></Icon>
                                {t('options.market.heading.all-markets')}
                            </Link>{' '}
                            | {marketHeading}
                            <Button
                                size="mini"
                                onClick={handleViewMarketDetails}
                                style={{ marginLeft: 10, marginRight: 10 }}
                            >
                                {t('options.market.heading.market-details')}
                                {'  '}
                                <Icon name="info circle"></Icon>
                            </Button>
                        </span>
                        <span style={{ textTransform: 'uppercase' }}>
                            {t('options.market.heading.market-sentiment')}
                            <MarketSentiment
                                long={optionsMarket.longPrice}
                                short={optionsMarket.shortPrice}
                                display="col"
                            />
                        </span>
                    </Grid.Row>
                    <ChartCard />
                    {optionsMarket.phase === 'trading' && <TradeOptions />}
                    <TransactionsCard />
                </Grid.Column>
                <Grid.Column width={5} style={{ paddingRight: 40 }}>
                    <Step.Group fluid style={{ textTransform: 'uppercase' }}>
                        {PHASES_CARDS.map((phase) => (
                            <Step key={phase} active={phase === optionsMarket.phase}>
                                {t(`options.phases.${phase}`)}
                            </Step>
                        ))}
                    </Step.Group>
                    <TradeCard />
                </Grid.Column>
            </Grid>
            {marketInfoModalVisible && (
                <MarketInfoModal
                    marketHeading={marketHeading}
                    optionMarket={optionsMarket}
                    onClose={() => setMarketInfoModalVisible(false)}
                />
            )}
        </MarketProvider>
    ) : (
        <Loader active />
    );
};

export default Market;
