import React from 'react';
import { OptionsMarkets } from '../../../types/options';
import { Card } from 'semantic-ui-react';
import TimeRemaining from './TimeRemaining';
import { formatCurrencyWithSign, formatShortDate } from 'utils/formatters';
import { USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import MarketSentiment from './MarketSentiment';
import { navigateToOptionsMarket } from 'utils/routes';
import Currency from 'components/Currency';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    return (
        <Card.Group>
            {optionsMarkets.map((optionsMarket) => {
                return (
                    <Card key={optionsMarket.address} onClick={() => navigateToOptionsMarket(optionsMarket.address)}>
                        <Card.Content>
                            <Card.Header>
                                <Currency.Name
                                    currencyKey={optionsMarket.currencyKey}
                                    name={optionsMarket.asset}
                                    showIcon={true}
                                    iconProps={{ width: '24px', height: '24px', type: 'asset' }}
                                />
                                <TimeRemaining end={optionsMarket.timeRemaining} />
                            </Card.Header>
                            <Card.Description textAlign="center">
                                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 5, marginTop: 10 }}>
                                    {formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)}
                                </div>
                                <div style={{ fontSize: 14, textTransform: 'uppercase' }}>
                                    {t('common.by-date', { date: formatShortDate(optionsMarket.maturityDate) })}
                                </div>
                                <MarketSentiment long={optionsMarket.longPrice} short={optionsMarket.shortPrice} />
                            </Card.Description>
                        </Card.Content>
                    </Card>
                );
            })}
        </Card.Group>
    );
};

export default HotMarkets;
