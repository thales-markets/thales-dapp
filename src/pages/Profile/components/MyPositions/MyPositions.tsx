import PriceChart from 'components/Charts/PriceChart';
import Currency from 'components/Currency/v2';
import CurrencyIcon, { IconType } from 'components/Currency/v2/CurrencyIcon';
import RangeIllustration from 'components/RangeIllustration';
import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import Table from 'components/TableV2';
import TimeRemaining from 'components/TimeRemaining';
import Tooltip from 'components/TooltipV2/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { LINKS } from 'constants/links';
import { Positions } from 'enums/options';
import { orderBy } from 'lodash';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { LoaderContainer } from 'theme/common';
import { UsersAssets } from 'types/options';
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
    Icon,
    MiddleContrainer,
    NoDataContainer,
    NoDataText,
    PriceDifferenceInfo,
    TableText,
    getColor,
} from '../styled-components';

type MyPositionsProps = {
    exchangeRates: Rates | null;
    positions: UsersAssets[];
    rangedPositions: any[];
    isSimpleView: boolean;
    searchText: string;
    isLoading?: boolean;
};

const MyPositions: React.FC<MyPositionsProps> = ({
    exchangeRates,
    positions,
    isSimpleView,
    searchText,
    isLoading,
    rangedPositions,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const data = useMemo(() => {
        const newArray: any = [];
        if (positions.length > 0) {
            positions.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.balances.priceDiff = getPercentageDifference(
                    exchangeRates?.[modifiedValue.market?.currencyKey] || 0,
                    modifiedValue.market.strikePrice
                );
                modifiedValue.range = false;
                newArray.push(modifiedValue);
            });
        }
        if (rangedPositions.length > 0) {
            rangedPositions.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.balances.priceDiff = 0;
                modifiedValue.market.strikePrice =
                    formatCurrencyWithSign(USD_SIGN, value.market.leftPrice) +
                    ' - ' +
                    formatCurrencyWithSign(USD_SIGN, value.market.rightPrice);
                modifiedValue.range = true;
                newArray.push(modifiedValue);
            });
        }

        return orderBy(newArray, ['balances.value', 'balances.priceDiff'], ['desc', 'asc']);
    }, [positions, rangedPositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter((value) => {
            return value.market.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }, [searchText, data]);

    if (!isLoading && !data.length && !rangedPositions.length) {
        return (
            <NoDataContainer>
                <NoDataText>{t('common.no-data-available')}</NoDataText>
            </NoDataContainer>
        );
    }

    return (
        <Container>
            {!isLoading &&
                isSimpleView &&
                filteredData.length > 0 &&
                filteredData.map((data: any, index: number) => (
                    <Content key={index}>
                        {data.balances.amount > 0 && (
                            <SPAAnchor
                                href={
                                    data.range
                                        ? buildRangeMarketLink(data.market.id)
                                        : buildOptionsMarketLink(data.market.id)
                                }
                            >
                                <CardWrapper>
                                    <Card>
                                        <CardColumn>
                                            <CardRow style={{ marginBottom: 10 }}>
                                                <CurrencyIcon
                                                    width="36px"
                                                    height="36px"
                                                    currencyKey={data.market.currencyKey}
                                                    iconType={
                                                        !data.range
                                                            ? data?.balances?.type === Positions.UP
                                                                ? IconType.UP
                                                                : IconType.DOWN
                                                            : data?.balances?.type === Positions.IN
                                                            ? IconType.IN
                                                            : IconType.OUT
                                                    }
                                                />
                                                <CardSection>
                                                    <CardRowSubtitle>{data.market.currencyKey}</CardRowSubtitle>
                                                    <CardRowTitle
                                                        style={{
                                                            color: getColor(data, theme),
                                                        }}
                                                    >
                                                        {!data.range
                                                            ? data?.balances?.type === Positions.UP
                                                                ? t('options.common.long')
                                                                : t('options.common.short')
                                                            : data?.balances?.type === Positions.IN
                                                            ? t('options.common.in')
                                                            : t('options.common.out')}
                                                    </CardRowTitle>
                                                </CardSection>
                                            </CardRow>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t(`options.home.markets-table.maturity-date-col`)}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {formatShortDate(data.market.maturityDate)}
                                                </CardRowSubtitle>
                                            </CardSection>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t(`options.home.markets-table.time-remaining-col`)}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    <TimeRemaining
                                                        end={data.market.maturityDate}
                                                        fontSize={20}
                                                        showFullCounter={true}
                                                    />
                                                </CardRowSubtitle>
                                            </CardSection>
                                        </CardColumn>
                                        {data.range ? (
                                            <MiddleContrainer>
                                                <RangeIllustration
                                                    priceData={{
                                                        left: data.market.leftPrice,
                                                        right: data.market.rightPrice,
                                                        current: exchangeRates?.[data.market?.currencyKey] || 0,
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
                                                        {formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}
                                                    </CardRowSubtitle>
                                                </CardSection>
                                                <CardSection>
                                                    <CardRowTitle>
                                                        {t('options.home.market-card.current-asset-price')}
                                                    </CardRowTitle>
                                                    <CardRowSubtitle>
                                                        {formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            exchangeRates?.[data.market.currencyKey] || 0
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
                                                                data.market.strikePrice <
                                                                (exchangeRates?.[data.market?.currencyKey] || 0)
                                                            }
                                                        >
                                                            {`${data.balances.priceDiff.toFixed(2)}%`}
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
                                                    {data.balances.amount.toFixed(2)}

                                                    <Icon
                                                        margin="0 0 0 6px"
                                                        color={getColor(data, theme)}
                                                        className={`v2-icon v2-icon--${data.balances.type.toLowerCase()}`}
                                                    ></Icon>
                                                </CardRowSubtitle>
                                            </CardSection>
                                            <CardSection>
                                                <CardRowTitle>
                                                    {t('options.home.market-card.position-value')}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {data.balances.value === 0 ? (
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
                                                        formatCurrencyWithSign(USD_SIGN, data.balances.value)
                                                    )}
                                                </CardRowSubtitle>
                                            </CardSection>
                                            <CardSection>
                                                <PriceChart
                                                    containerStyle={{ margin: 'auto' }}
                                                    currencyKey={data.market.currencyKey}
                                                    height={30}
                                                    width={window.innerWidth > 400 ? 120 : 60}
                                                    footerFontSize="8px"
                                                    showFooter={window.innerWidth > 500}
                                                />
                                            </CardSection>
                                        </CardColumn>
                                    </Card>
                                </CardWrapper>
                            </SPAAnchor>
                        )}
                    </Content>
                ))}
            {isLoading && isSimpleView && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
            {!isSimpleView && (
                <Table
                    data={data}
                    searchQuery={searchText}
                    isLoading={isLoading}
                    columns={[
                        {
                            Header: <>{t('options.home.markets-table.asset-col')}</>,
                            accessor: 'balances.type',
                            Cell: (props: any) => (
                                <Currency.Name
                                    currencyKey={props.cell.row.original.market.currencyKey}
                                    showIcon={true}
                                    hideAssetName={true}
                                    iconProps={{ type: 'asset' }}
                                    synthIconStyle={{ width: 32, height: 32 }}
                                    spanStyle={{ width: 60 }}
                                    additionalIconType={
                                        !props.cell.row.original.range
                                            ? props.cell.value === Positions.UP
                                                ? IconType.UP
                                                : IconType.DOWN
                                            : props.cell.value === Positions.IN
                                            ? IconType.IN
                                            : IconType.OUT
                                    }
                                />
                            ),
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstCurrency = firstElem.original.market.currencyKey;
                                const secondCurrency = secondElem.original.market.currencyKey;

                                return firstCurrency > secondCurrency ? 1 : firstCurrency < secondCurrency ? -1 : 0;
                            },
                            sortable: true,
                        },
                        {
                            Header: <>{t(`options.home.markets-table.24h-change-col`)}</>,
                            accessor: 'market.currencyKey',
                            Cell: (props: any) => (
                                <PriceChart
                                    currencyKey={props.cell.value}
                                    height={30}
                                    width={isMobile ? 90 : 100}
                                    showFooter={false}
                                    showPercentageChangeOnSide={true}
                                    containerStyle={{
                                        marginTop: '6px',
                                        marginBottom: '6px',
                                        marginLeft: '10px',
                                        whiteSpace: 'pre',
                                    }}
                                    footerStyle={{ fontSize: '10px' }}
                                />
                            ),
                        },
                        {
                            Header: <>{t(`options.home.markets-table.strike-price-col`)}</>,
                            accessor: 'market.strikePrice',
                            Cell: (props: any) => {
                                return (
                                    <TableText>
                                        {props.cell.row.original.range
                                            ? props.cell.value
                                            : formatCurrencyWithSign(USD_SIGN, props.cell.value, 2)}
                                    </TableText>
                                );
                            },
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstStrikePrice =
                                    firstElem.original.market.leftPrice || firstElem.original.market.strikePrice;
                                const secondStrikePrice =
                                    secondElem.original.market.leftPrice || secondElem.original.market.strikePrice;

                                return firstStrikePrice > secondStrikePrice
                                    ? 1
                                    : firstStrikePrice < secondStrikePrice
                                    ? -1
                                    : 0;
                            },
                        },
                        {
                            Header: <>{t(`options.home.markets-table.current-asset-price-col`)}</>,
                            accessor: 'market',
                            Cell: (props: any) => (
                                <TableText>
                                    {formatCurrencyWithSign(
                                        USD_SIGN,
                                        exchangeRates?.[props.cell.row.original.value] || 0
                                    )}
                                </TableText>
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstAssetPrice = exchangeRates?.[firstElem.original.market.currencyKey] || 0;
                                const secondAssetPrice = exchangeRates?.[secondElem.original.market.currencyKey] || 0;

                                return firstAssetPrice > secondAssetPrice
                                    ? 1
                                    : firstAssetPrice < secondAssetPrice
                                    ? -1
                                    : 0;
                            },
                        },
                        {
                            Header: <>{t(`options.home.markets-table.time-remaining-col`)}</>,
                            accessor: 'market.maturityDate',
                            Cell: (props: any) => (
                                <TimeRemaining end={props.cell.value} fontSize={15} showFullCounter={true} />
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstMaturityDate = firstElem.original.market.maturityDate;
                                const secondMaturityDate = secondElem.original.market.maturityDate;

                                return firstMaturityDate > secondMaturityDate
                                    ? 1
                                    : firstMaturityDate < secondMaturityDate
                                    ? -1
                                    : 0;
                            },
                        },
                        {
                            Header: <>{t('options.leaderboard.trades.table.amount-col')}</>,
                            accessor: 'balances.amount',
                            Cell: (props: any) => (
                                <TableText
                                    style={{
                                        minWidth: 100,
                                        marginRight: 20,
                                        textAlign: 'right',
                                        display: 'inline-block',
                                    }}
                                >
                                    {props.cell.value.toFixed(2)}
                                    <Icon
                                        margin="0 0 0 6px"
                                        color={getColor(props.cell.row.original, theme)}
                                        className={`v2-icon v2-icon--${props.cell.row.original.balances.type.toLowerCase()}`}
                                    ></Icon>
                                </TableText>
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstAmount = firstElem.original.balances.amount;
                                const secondAmount = secondElem.original.balances.amount;

                                return firstAmount > secondAmount ? 1 : firstAmount < secondAmount ? -1 : 0;
                            },
                        },
                        {
                            Header: <>{t('options.home.market-card.position-value')}</>,
                            accessor: 'balances.value',
                            Cell: (props: any) => (
                                <TableText>
                                    {props.cell.value.value === 0 ? (
                                        <>
                                            N/A
                                            <Tooltip
                                                overlay={
                                                    <Trans
                                                        i18nKey={t('options.home.market-card.no-liquidity-tooltip')}
                                                        components={[
                                                            <span key="1">
                                                                <UsingAmmLink key="2" />
                                                            </span>,
                                                        ]}
                                                    />
                                                }
                                                iconFontSize={16}
                                            />
                                        </>
                                    ) : (
                                        formatCurrencyWithSign(USD_SIGN, props.cell.row.original.balances.value)
                                    )}
                                </TableText>
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstValue = firstElem.original.balances?.value || 0;
                                const secondValue = secondElem.original.balances?.value || 0;

                                return firstValue > secondValue ? 1 : firstValue < secondValue ? -1 : 0;
                            },
                        },
                    ]}
                />
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
