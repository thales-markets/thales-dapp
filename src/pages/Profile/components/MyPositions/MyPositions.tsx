import RangeIllustration from 'components/RangeIllustration';
import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TimeRemaining from 'components/TimeRemaining';
import Tooltip from 'components/Tooltip/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { LINKS } from 'constants/links';
import { orderBy } from 'lodash';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { LoaderContainer } from 'styles/common';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
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
    Icon,
    MiddleContrainer,
    NoDataContainer,
    NoDataText,
    PriceDifferenceInfo,
    getColor,
} from '../styled-components';
import { UserPosition } from 'queries/user/useAllPositions';

type MyPositionsProps = {
    exchangeRates: Rates | null;
    livePositions: UserPosition[];
    searchText: string;
    isLoading?: boolean;
};

const MyPositions: React.FC<MyPositionsProps> = ({ exchangeRates, livePositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const data = useMemo(() => {
        const mappedPositions = livePositions.map((position: UserPosition) => {
            return {
                ...position,
                priceDiff: position.isRanged
                    ? 0
                    : getPercentageDifference(exchangeRates?.[position.currencyKey] || 0, position.strikePrice),
            };
        });

        return orderBy(mappedPositions, ['maturityDate', 'value', 'priceDiff'], ['asc', 'desc', 'asc']);
    }, [livePositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter((value: UserPosition) => {
            return value.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }, [searchText, data]);

    if (!isLoading && !data.length) {
        return (
            <NoDataContainer>
                <NoDataText>{t('common.no-data-available')}</NoDataText>
            </NoDataContainer>
        );
    }

    return (
        <Container>
            {!isLoading &&
                filteredData.length > 0 &&
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
                                                fontSize="28px"
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
                                        <CardSection>
                                            <CardRowTitle>
                                                {t(`options.home.markets-table.time-remaining-col`)}
                                            </CardRowTitle>
                                            <CardRowSubtitle>
                                                <TimeRemaining
                                                    end={data.maturityDate}
                                                    fontSize={20}
                                                    showFullCounter={true}
                                                />
                                            </CardRowSubtitle>
                                        </CardSection>
                                    </CardColumn>
                                    {data.isRanged ? (
                                        <MiddleContrainer>
                                            <RangeIllustration
                                                priceData={{
                                                    left: data.leftPrice,
                                                    right: data.rightPrice,
                                                    current: exchangeRates?.[data.currencyKey] || 0,
                                                }}
                                                fontSize={16}
                                                maxWidth={65}
                                            />
                                        </MiddleContrainer>
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
                                                    {t('options.home.market-card.current-asset-price')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {formatCurrencyWithSign(
                                                        USD_SIGN,
                                                        exchangeRates?.[data.currencyKey] || 0
                                                    )}
                                                </CardRowSubtitle>
                                            </CardSection>

                                            <CardSection>
                                                <CardRowTitle>
                                                    {t('options.home.market-card.price-difference')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    <PriceDifferenceInfo
                                                        priceDiff={
                                                            data.strikePrice < (exchangeRates?.[data.currencyKey] || 0)
                                                        }
                                                    >
                                                        {`${(data.priceDiff || 0).toFixed(2)}%`}
                                                    </PriceDifferenceInfo>
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
                                                {data.amount.toFixed(2)}

                                                <Icon
                                                    margin="0 0 0 6px"
                                                    color={getColor(data, theme)}
                                                    className={`v2-icon v2-icon--${data.side.toLowerCase()}`}
                                                ></Icon>
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
                ))}
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </Container>
    );
};

const TooltipLink = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

const UsingAmmLink: React.FC = () => {
    const { t } = useTranslation();
    return (
        <TooltipLink
            target="_blank"
            rel="noreferrer"
            href={LINKS.AMM.UsingAmm}
            onClick={(event) => {
                event?.stopPropagation();
            }}
        >
            {t('common.here')}
        </TooltipLink>
    );
};

export default MyPositions;
