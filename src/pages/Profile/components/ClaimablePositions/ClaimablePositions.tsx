import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
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
    getAmount,
} from '../styled-components';
import { getColorPerPosition } from 'utils/options';
import { UserPosition } from 'types/options';

type ClaimablePositionsProps = {
    claimablePositions: UserPosition[];
    searchText: string;
    isLoading: boolean;
};

const ClaimablePositions: React.FC<ClaimablePositionsProps> = ({ claimablePositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const data = useMemo(() => {
        return orderBy(claimablePositions, ['maturityDate', 'value', 'priceDiff'], ['asc', 'desc', 'asc']);
    }, [claimablePositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter((value: UserPosition) => {
            return value.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
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
                                                {t('options.home.markets-table.final-asset-price-col')}
                                            </CardRowTitle>
                                            <CardRowValue>
                                                {formatCurrencyWithSign(USD_SIGN, data.finalPrice)}
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
                                                {t('options.home.markets-table.final-asset-price-col')}
                                            </CardRowTitle>
                                            <CardRowValue>
                                                {formatCurrencyWithSign(USD_SIGN, data.finalPrice)}
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
                                        <CardRowTitle>{t('options.home.markets-table.status-col')}</CardRowTitle>
                                        <CardRowValue color={theme.textColor.quaternary}>
                                            {t('options.home.market-card.claimable')}
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

export default ClaimablePositions;
