import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import Tooltip from 'components/Tooltip/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import {
    Card,
    CardColumn,
    CardRow,
    CardRowSubtitle,
    CardRowTitle,
    CardSection,
    CardWrapper,
    Container,
    Content,
    CurrencyIcon,
    LoaderContainer,
    NoDataContainer,
    UsingAmmLink,
    getAmount,
    getColor,
} from '../styled-components';
import { UserPosition } from 'queries/user/useAllPositions';

type ClaimablePositionsProps = {
    claimablePositions: UserPosition[];
    searchText: string;
    isLoading?: boolean;
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
                            <CardWrapper>
                                <Card>
                                    <CardColumn>
                                        <CardRow style={{ marginBottom: 10 }}>
                                            <CurrencyIcon
                                                className={`currency-icon currency-icon--${data.currencyKey.toLowerCase()}`}
                                                fontSize="34px"
                                            />
                                            <CardSection>
                                                <CardRowSubtitle>{data.currencyKey}</CardRowSubtitle>
                                                <CardRowSubtitle
                                                    style={{
                                                        color: getColor(data, theme),
                                                        textTransform: 'uppercase',
                                                    }}
                                                >
                                                    {data.side}
                                                </CardRowSubtitle>
                                            </CardSection>
                                        </CardRow>
                                        <CardSection>
                                            <CardRowTitle>
                                                {t(`options.home.markets-table.maturity-date-col`)}
                                            </CardRowTitle>
                                            <CardRowSubtitle>{formatShortDate(data.maturityDate)}</CardRowSubtitle>
                                        </CardSection>
                                    </CardColumn>
                                    {data.isRanged ? (
                                        <CardColumn>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t('options.home.market-card.strike-price')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {`> ${formatCurrencyWithSign(USD_SIGN, data.leftPrice)}`}
                                                    <br />
                                                    {`< ${formatCurrencyWithSign(USD_SIGN, data.rightPrice)}`}
                                                </CardRowSubtitle>
                                            </CardSection>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t('options.home.markets-table.final-asset-price-col')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.finalPrice)}
                                                </CardRowSubtitle>
                                            </CardSection>
                                        </CardColumn>
                                    ) : (
                                        <CardColumn>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t('options.home.market-card.strike-price')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.strikePrice)}
                                                </CardRowSubtitle>
                                            </CardSection>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t('options.home.markets-table.final-asset-price-col')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.finalPrice)}
                                                </CardRowSubtitle>
                                            </CardSection>
                                        </CardColumn>
                                    )}

                                    <CardColumn>
                                        <CardSection>
                                            <CardRowTitle>
                                                {t('options.leaderboard.trades.table.amount-col')}
                                            </CardRowTitle>
                                            <CardRowSubtitle>
                                                {getAmount(formatCurrency(data.amount, 2), data.side, theme)}
                                            </CardRowSubtitle>
                                        </CardSection>
                                        <CardSection>
                                            <CardRowTitle>{t('options.home.market-card.position-value')}</CardRowTitle>
                                            <CardRowSubtitle>
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
                                                            iconFontSize={20}
                                                            top={-2}
                                                        />
                                                    </>
                                                ) : (
                                                    formatCurrencyWithSign(USD_SIGN, data.value)
                                                )}
                                            </CardRowSubtitle>
                                        </CardSection>
                                    </CardColumn>
                                </Card>
                            </CardWrapper>
                        </SPAAnchor>
                    </Content>
                ))
            )}
        </Container>
    );
};

export default ClaimablePositions;
