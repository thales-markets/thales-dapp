import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TimeRemaining from 'components/TimeRemaining';
import Tooltip from 'components/Tooltip/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign, formatPricePercentageDifference } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import {
    Card,
    CardColumn,
    CardRow,
    CardRowValue,
    CardRowTitle,
    CardSection,
    Container,
    Content,
    CurrencyIcon,
    LoaderContainer,
    NoDataContainer,
    UsingAmmLink,
    getAmount,
} from '../styled-components';
import { getColorPerPosition } from 'utils/options';
import { UserPosition } from 'types/options';

type OpenPositionsProps = {
    exchangeRates: Rates | null;
    livePositions: UserPosition[];
    searchText: string;
    isLoading: boolean;
};

const OpenPositions: React.FC<OpenPositionsProps> = ({ exchangeRates, livePositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const data = useMemo(() => {
        const mappedPositions = livePositions.map((position: UserPosition) => {
            return {
                ...position,
                priceDiff: position.isRanged
                    ? 0
                    : formatPricePercentageDifference(position.strikePrice, exchangeRates?.[position.currencyKey] || 0),
            };
        });

        return orderBy(mappedPositions, ['maturityDate', 'value', 'priceDiff'], ['asc', 'desc', 'asc']);
    }, [livePositions, exchangeRates]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter(
            (position: UserPosition) => position.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    }, [searchText, data]);

    return (
        <Container>
            {isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : filteredData.length === 0 ? (
                <NoDataContainer>{t('common.no-data-available')}</NoDataContainer>
            ) : (
                filteredData.map((data: UserPosition, index: number) => (
                    <Content key={index}>
                        <SPAAnchor
                            href={
                                data.isRanged ? buildRangeMarketLink(data.market) : buildOptionsMarketLink(data.market)
                            }
                        >
                            <Card>
                                <CardColumn>
                                    <CardRow>
                                        <CurrencyIcon
                                            className={`currency-icon currency-icon--${data.currencyKey.toLowerCase()}`}
                                        />
                                        <CardSection>
                                            <CardRowValue>{data.currencyKey}</CardRowValue>
                                            <CardRowValue color={getColorPerPosition(data.side, theme)}>
                                                {data.side}
                                            </CardRowValue>
                                        </CardSection>
                                    </CardRow>
                                    <CardSection>
                                        <CardRowTitle>{t(`options.home.markets-table.maturity-date-col`)}</CardRowTitle>
                                        <CardRowValue>{formatShortDate(data.maturityDate)}</CardRowValue>
                                    </CardSection>
                                    <CardSection>
                                        <CardRowTitle>
                                            {t(`options.home.markets-table.time-remaining-col`)}
                                        </CardRowTitle>
                                        <CardRowValue>
                                            <TimeRemaining
                                                end={data.maturityDate}
                                                fontSize={18}
                                                showFullCounter={true}
                                            />
                                        </CardRowValue>
                                    </CardSection>
                                </CardColumn>
                                {data.isRanged ? (
                                    <CardColumn>
                                        <CardSection>
                                            <CardRowTitle>
                                                {t('options.market.ranged-markets.strike-range')}
                                            </CardRowTitle>
                                            <CardRowValue>
                                                {`> ${formatCurrencyWithSign(USD_SIGN, data.leftPrice)}`}
                                                <br />
                                                {`< ${formatCurrencyWithSign(USD_SIGN, data.rightPrice)}`}
                                            </CardRowValue>
                                        </CardSection>
                                        <CardSection>
                                            <CardRowTitle>
                                                {t('options.home.market-card.current-asset-price')}
                                            </CardRowTitle>
                                            <CardRowValue>
                                                {formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    exchangeRates?.[data.currencyKey] || 0
                                                )}
                                            </CardRowValue>
                                        </CardSection>
                                    </CardColumn>
                                ) : (
                                    <CardColumn>
                                        <CardSection>
                                            <CardRowTitle>{t('options.home.market-card.strike-price')}</CardRowTitle>
                                            <CardRowValue>
                                                {formatCurrencyWithSign(USD_SIGN, data.strikePrice)}
                                            </CardRowValue>
                                        </CardSection>
                                        <CardSection>
                                            <CardRowTitle>
                                                {t('options.home.market-card.current-asset-price')}
                                            </CardRowTitle>
                                            <CardRowValue>
                                                {formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    exchangeRates?.[data.currencyKey] || 0
                                                )}
                                            </CardRowValue>
                                        </CardSection>

                                        <CardSection>
                                            <CardRowTitle>
                                                {t('options.home.market-card.price-difference')}
                                            </CardRowTitle>
                                            <CardRowValue
                                                color={
                                                    !data.priceDiff
                                                        ? theme.textColor.primary
                                                        : data.priceDiff > 0
                                                        ? theme.textColor.quaternary
                                                        : data.priceDiff < 0
                                                        ? theme.textColor.tertiary
                                                        : theme.textColor.primary
                                                }
                                            >
                                                {data.priceDiff ? `${data.priceDiff.toFixed(2)}%` : 'N/A'}
                                            </CardRowValue>
                                        </CardSection>
                                    </CardColumn>
                                )}

                                <CardColumn>
                                    <CardSection>
                                        <CardRowTitle>{t('options.leaderboard.trades.table.amount-col')}</CardRowTitle>
                                        <CardRowValue>
                                            {getAmount(formatCurrency(data.amount, 2), data.side, theme)}
                                        </CardRowValue>
                                    </CardSection>
                                    <CardSection>
                                        <CardRowTitle>{t('options.home.market-card.position-value')}</CardRowTitle>
                                        <CardRowValue>
                                            {data.value === 0 ? (
                                                <>
                                                    N/A
                                                    <Tooltip
                                                        overlay={
                                                            <Trans
                                                                i18nKey={t(
                                                                    'options.home.market-card.no-liquidity-tooltip'
                                                                )}
                                                                components={[
                                                                    <span key="1">
                                                                        <UsingAmmLink key="2" />
                                                                    </span>,
                                                                ]}
                                                            />
                                                        }
                                                        iconFontSize={17}
                                                        mobileIconFontSize={12}
                                                        top={-1}
                                                    />
                                                </>
                                            ) : (
                                                formatCurrencyWithSign(USD_SIGN, data.value)
                                            )}
                                        </CardRowValue>
                                    </CardSection>
                                </CardColumn>
                            </Card>
                        </SPAAnchor>
                    </Content>
                ))
            )}
        </Container>
    );
};

export default OpenPositions;
