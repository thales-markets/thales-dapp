import React from 'react';
import TimeRemaining from '../../components/TimeRemaining';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { navigateToOptionsMarket } from 'utils/routes';
import { OptionsMarkets } from 'types/options';
import MarketSentiment from '../../components/MarketSentiment';
import { FlexDivCentered, FlexDivColumn, SubTitle } from 'theme/common';
import styled from 'styled-components';
import Currency from 'components/Currency';
import { Card } from 'semantic-ui-react';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();

    const Wrapper = styled(FlexDivColumn)`
        padding: 50px 110px;
    `;

    return (
        <Wrapper>
            <SubTitle color="#04045a">{t('options.home.explore-markets.discover')}</SubTitle>
            <FlexDivCentered>
                {optionsMarkets.map((optionsMarket) => {
                    return (
                        <Card
                            key={optionsMarket.address}
                            onClick={() => navigateToOptionsMarket(optionsMarket.address)}
                        >
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
            </FlexDivCentered>
        </Wrapper>
    );
};

export default HotMarkets;
