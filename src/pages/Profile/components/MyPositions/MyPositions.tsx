import PriceChart from 'components/Charts/PriceChart';
import Currency from 'components/Currency/v2';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import Table from 'components/TableV2';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import TimeRemaining from 'pages/Token/components/TimeRemaining';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import Card from '../styled-components/Card';
import SimpleLoader from 'components/SimpleLoader';
import { LoaderContainer, NoDataContainer, NoDataText } from 'theme/common';
import { UI_COLORS } from 'constants/ui';
import RangeIllustration from 'pages/AMMTrading/components/RangeIllustration';

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
                                <Card.Wrapper>
                                    <Card>
                                        <Card.Column>
                                            <Card.Row style={{ marginBottom: 10 }}>
                                                <CurrencyIcon
                                                    width="36px"
                                                    height="36px"
                                                    currencyKey={data.market.currencyKey}
                                                    iconType={
                                                        !data.range
                                                            ? data?.balances?.type === 'UP'
                                                                ? 4
                                                                : 5
                                                            : data?.balances?.type === 'IN'
                                                            ? 1
                                                            : 2
                                                    }
                                                />
                                                <Card.Section>
                                                    <Card.RowSubtitle>{data.market.currencyKey}</Card.RowSubtitle>
                                                    <Card.RowTitle
                                                        style={{
                                                            color: getColor(data),
                                                        }}
                                                    >
                                                        {data.balances.type}
                                                    </Card.RowTitle>
                                                </Card.Section>
                                            </Card.Row>
                                            <Card.Section>
                                                <Card.RowTitle>
                                                    {t(`options.home.markets-table.maturity-date-col`)}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatShortDate(data.market.maturityDate)}
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                            <Card.Section>
                                                <Card.RowTitle>
                                                    {t(`options.home.markets-table.time-remaining-col`)}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    <TimeRemaining
                                                        end={data.market.maturityDate}
                                                        fontSize={20}
                                                        showFullCounter={true}
                                                    />
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                        </Card.Column>
                                        {data.range ? (
                                            <Card.Column style={{ top: 10, position: 'relative' }} ranged={true}>
                                                <RangeIllustration
                                                    priceData={{
                                                        left: data.market.leftPrice,
                                                        right: data.market.rightPrice,
                                                        current: exchangeRates?.[data.market?.currencyKey] || 0,
                                                    }}
                                                    fontSize={16}
                                                    maxWidth={65}
                                                />
                                            </Card.Column>
                                        ) : (
                                            <Card.Column>
                                                <Card.Section>
                                                    <Card.RowTitle>
                                                        {t('options.home.market-card.strike-price')}
                                                    </Card.RowTitle>
                                                    <Card.RowSubtitle>
                                                        {formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}
                                                    </Card.RowSubtitle>
                                                </Card.Section>
                                                <Card.Section>
                                                    <Card.RowTitle>
                                                        {t('options.home.market-card.current-asset-price')}
                                                    </Card.RowTitle>
                                                    <Card.RowSubtitle>
                                                        {formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            exchangeRates?.[data.market.currencyKey] || 0
                                                        )}
                                                    </Card.RowSubtitle>
                                                </Card.Section>

                                                <Card.Section>
                                                    <Card.RowTitle>
                                                        {t('options.home.market-card.price-difference')}
                                                    </Card.RowTitle>
                                                    <Card.RowSubtitle>
                                                        <PriceDifferenceInfo
                                                            priceDiff={
                                                                data.market.strikePrice <
                                                                (exchangeRates?.[data.market?.currencyKey] || 0)
                                                            }
                                                        >
                                                            {`${data.balances.priceDiff.toFixed(2)}%`}
                                                        </PriceDifferenceInfo>
                                                    </Card.RowSubtitle>
                                                </Card.Section>
                                            </Card.Column>
                                        )}

                                        <Card.Column>
                                            <Card.Section>
                                                <Card.RowTitle>
                                                    {t('options.leaderboard.trades.table.amount-col')}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {data.balances.amount.toFixed(2)}

                                                    <Icon
                                                        style={{
                                                            color: getColor(data),
                                                            marginLeft: 6,
                                                        }}
                                                        className={`v2-icon v2-icon--${data.balances.type.toLowerCase()}`}
                                                    ></Icon>
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                            <Card.Section>
                                                <Card.RowTitle>
                                                    {t('options.home.market-card.position-value')}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.balances.value.toFixed(2))}
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                            <Card.Section>
                                                <PriceChart
                                                    containerStyle={{ margin: 'auto' }}
                                                    currencyKey={data.market.currencyKey}
                                                    height={30}
                                                    width={window.innerWidth > 400 ? 120 : 60}
                                                    footerFontSize="8px"
                                                    showFooter={window.innerWidth > 500}
                                                />
                                            </Card.Section>
                                        </Card.Column>
                                    </Card>
                                </Card.Wrapper>
                            </SPAAnchor>
                        )}
                    </Content>
                ))}

            {!isLoading && !isSimpleView && data.length > 0 && (
                <Table
                    containerStyle={{ maxWidth: 'unset', marginTop: '-15px' }}
                    data={data}
                    searchQuery={searchText}
                    columns={[
                        {
                            id: 'market.currencyKey',
                            Header: <>{t('options.home.markets-table.asset-col')}</>,
                            accessor: (row: any) => {
                                console.log('Row ', row);
                                return (
                                    <Currency.Name
                                        currencyKey={row?.market?.currencyKey}
                                        showIcon={true}
                                        hideAssetName={true}
                                        iconProps={{ type: 'asset' }}
                                        synthIconStyle={{ width: 32, height: 32 }}
                                        spanStyle={{ float: 'left' }}
                                        additionalIconType={
                                            !row.range
                                                ? row?.balances?.type === 'UP'
                                                    ? 4
                                                    : 5
                                                : row?.balances?.type === 'IN'
                                                ? 1
                                                : 2
                                        }
                                    />
                                );
                            },
                            sortable: true,
                        },

                        {
                            Header: t(`options.home.markets-table.24h-change-col`),
                            accessor: (row: any) => (
                                <PriceChart
                                    currencyKey={row?.market?.currencyKey}
                                    height={30}
                                    width={100}
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
                            disableSortBy: true,
                        },
                        {
                            Header: t(`options.home.markets-table.strike-price-col`),
                            accessor: 'market.strikePrice',
                            Cell: (_props: any) => {
                                return (
                                    <TableText>
                                        {_props.cell.row.original.range
                                            ? _props.cell.value
                                            : formatCurrencyWithSign(USD_SIGN, _props?.cell?.value, 2)}
                                    </TableText>
                                );
                            },
                        },
                        {
                            Header: t(`options.home.markets-table.current-asset-price-col`),
                            accessor: (row: any) => (
                                <TableText>
                                    {formatCurrencyWithSign(USD_SIGN, exchangeRates?.[row.market.currencyKey] || 0)}
                                </TableText>
                            ),
                        },
                        {
                            Header: t(`options.home.markets-table.time-remaining-col`),
                            accessor: (row: any) => (
                                <TimeRemaining end={row.market.maturityDate} fontSize={15} showFullCounter={true} />
                            ),
                        },
                        {
                            Header: t('options.leaderboard.trades.table.amount-col'),
                            accessor: (row: any) => {
                                return (
                                    <TableText
                                        style={{
                                            minWidth: 100,
                                            marginRight: 20,
                                            textAlign: 'right',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {row.balances.amount.toFixed(2)}
                                        <Icon
                                            style={{
                                                color: getColor(row),
                                                marginLeft: 6,
                                            }}
                                            className={`v2-icon v2-icon--${row.balances.type.toLowerCase()}`}
                                        ></Icon>
                                    </TableText>
                                );
                            },
                        },
                        {
                            Header: t('options.home.market-card.position-value'),
                            accessor: (row: any) => {
                                return (
                                    <TableText>{formatCurrencyWithSign(USD_SIGN, row?.balances?.value, 2)}</TableText>
                                );
                            },
                        },
                    ]}
                />
            )}
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </Container>
    );
};

const Content = styled.div`
    display: content;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 15px;
    position: relative;
    min-height: 200px;
`;

const TableText = styled.span`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 285%;
    text-align: right;
    text-transform: uppercase;
    color: var(--primary-color);
`;

const Icon = styled.i`
    @media (max-width: 568px) {
        font-size: 16px;
        line-height: 100%;
    }
`;

const PriceDifferenceInfo = styled.span<{ priceDiff: boolean }>`
    ${(_props) => (_props.priceDiff ? 'color: #50CE99' : 'color: #C3244A')};
`;

const getColor = (data: any) => {
    if (data.range) {
        return data.balances.type === 'IN' ? UI_COLORS.IN_COLOR : UI_COLORS.OUT_COLOR;
    }
    return data.balances.type === 'UP' ? UI_COLORS.GREEN : UI_COLORS.RED;
};

export default MyPositions;
