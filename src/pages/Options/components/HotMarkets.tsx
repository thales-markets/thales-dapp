import React from 'react';
import { OptionsMarkets } from '../types';
import { Card } from 'semantic-ui-react';
import TimeRemaining from './TimeRemaining';
import { getCurrencyKeyIcon } from 'utils/currency';
import { formatCurrencyWithSign, formatShortDate } from 'utils/formatters';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import MarketSentiment from './MarketSentiment';
import { navigateToOptionsMarket } from 'utils/routes';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    return (
        <Card.Group>
            {optionsMarkets.map((optionsMarket) => {
                const currencyIcon = getCurrencyKeyIcon(optionsMarket.currencyKey);
                const { AssetIcon } = currencyIcon;

                return (
                    <Card key={optionsMarket.address} onClick={() => navigateToOptionsMarket(optionsMarket.address)}>
                        <Card.Content>
                            <Card.Header>
                                <span>
                                    <AssetIcon width="22" height="22" /> {optionsMarket.asset}
                                </span>
                                <TimeRemaining end={optionsMarket.timeRemaining} />
                            </Card.Header>
                            <Card.Description textAlign="center">
                                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 5, marginTop: 10 }}>
                                    {formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)}{' '}
                                    {FIAT_CURRENCY_MAP.USD}
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
