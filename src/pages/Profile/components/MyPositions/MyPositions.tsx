import PriceChart from 'components/Charts/PriceChart';
import Currency from 'components/Currency/v2';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import Table from 'components/TableV2';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import Card from '../styled-components/Card';
import SimpleLoader from 'components/SimpleLoader';
import { LoaderContainer, NoDataContainer, NoDataText } from 'theme/common';
import { UI_COLORS } from 'constants/ui';
import RangeIllustration from 'components/RangeIllustration';
import TimeRemaining from 'components/TimeRemaining';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import { LINKS } from 'constants/links';
import { isMobile } from 'utils/device';

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
                                                        {!data.range
                                                            ? data?.balances?.type === 'UP'
                                                                ? t('options.common.long')
                                                                : t('options.common.short')
                                                            : data?.balances?.type === 'IN'
                                                            ? t('options.common.in')
                                                            : t('options.common.out')}
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
                                                    {data.balances.value === 0 ? (
                                                        <>
                                                            N/A
                                                            <StyledMaterialTooltip
                                                                arrow={true}
                                                                title={
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
                                                                interactive
                                                            >
                                                                <StyledInfoIcon />
                                                            </StyledMaterialTooltip>
                                                        </>
                                                    ) : (
                                                        formatCurrencyWithSign(USD_SIGN, data.balances.value)
                                                    )}
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
                                return (
                                    <Currency.Name
                                        currencyKey={row?.market?.currencyKey}
                                        showIcon={true}
                                        hideAssetName={true}
                                        iconProps={{ type: 'asset' }}
                                        synthIconStyle={{ width: 32, height: 32 }}
                                        spanStyle={{ width: 60 }}
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
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstCurrency = firstElem.original.market.currencyKey;
                                const secondCurrency = secondElem.original.market.currencyKey;

                                return firstCurrency > secondCurrency ? 1 : firstCurrency < secondCurrency ? -1 : 0;
                            },
                            sortable: true,
                        },
                        {
                            Header: t(`options.home.markets-table.24h-change-col`),
                            accessor: (row: any) => (
                                <PriceChart
                                    currencyKey={row?.market?.currencyKey}
                                    height={30}
                                    width={isMobile() ? 90 : 100}
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
                            sortable: true,
                        },
                        {
                            Header: t(`options.home.markets-table.current-asset-price-col`),
                            accessor: (row: any) => (
                                <TableText>
                                    {formatCurrencyWithSign(USD_SIGN, exchangeRates?.[row.market.currencyKey] || 0)}
                                </TableText>
                            ),
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstAssetPrice = exchangeRates?.[firstElem.original.market.currencyKey] || 0;
                                const secondAssetPrice = exchangeRates?.[secondElem.original.market.currencyKey] || 0;

                                return firstAssetPrice > secondAssetPrice
                                    ? 1
                                    : firstAssetPrice < secondAssetPrice
                                    ? -1
                                    : 0;
                            },
                            sortable: true,
                        },
                        {
                            Header: t(`options.home.markets-table.time-remaining-col`),
                            accessor: (row: any) => (
                                <TimeRemaining end={row.market.maturityDate} fontSize={15} showFullCounter={true} />
                            ),
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstMaturityDate = firstElem.original.market.maturityDate;
                                const secondMaturityDate = secondElem.original.market.maturityDate;

                                return firstMaturityDate > secondMaturityDate
                                    ? 1
                                    : firstMaturityDate < secondMaturityDate
                                    ? -1
                                    : 0;
                            },
                            sortable: true,
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
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstAmount = firstElem.original.balances.amount;
                                const secondAmount = secondElem.original.balances.amount;

                                return firstAmount > secondAmount ? 1 : firstAmount < secondAmount ? -1 : 0;
                            },
                            sortable: true,
                        },
                        {
                            Header: t('options.home.market-card.position-value'),
                            accessor: (row: any) => {
                                return (
                                    <TableText>
                                        {row?.balances?.value === 0 ? (
                                            <>
                                                N/A
                                                <StyledMaterialTooltip
                                                    arrow={true}
                                                    title={
                                                        <Trans
                                                            i18nKey={t('options.home.market-card.no-liquidity-tooltip')}
                                                            components={[
                                                                <span key="1">
                                                                    <UsingAmmLink key="2" />
                                                                </span>,
                                                            ]}
                                                        />
                                                    }
                                                    interactive
                                                >
                                                    <StyledInfoIcon />
                                                </StyledMaterialTooltip>
                                            </>
                                        ) : (
                                            formatCurrencyWithSign(USD_SIGN, row?.balances?.value)
                                        )}
                                    </TableText>
                                );
                            },
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstValue = firstElem.original.balances?.value || 0;
                                const secondValue = secondElem.original.balances?.value || 0;

                                return firstValue > secondValue ? 1 : firstValue < secondValue ? -1 : 0;
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

const MiddleContrainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: 10px;
    min-width: 180px;
`;

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

export const TooltipLink = styled.a`
    color: #00f9ff;
    &:hover {
        color: rgb(116, 139, 198);
    }
`;

export const StyledInfoIcon = styled(InfoIcon)`
    min-width: 20px;
    min-height: 20px;
    margin-left: 6px;
    margin-bottom: -2px;
`;

export const UsingAmmLink: React.FC = () => {
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

export const StyledMaterialTooltip = withStyles(() => ({
    arrow: {
        '&:before': {
            border: '1px solid #58519b',
        },
        color: '#0C1C68',
        marginLeft: '0px!important',
    },
    tooltip: {
        background:
            'linear-gradient(#04045a 0%, #04045a 100%) padding-box, linear-gradient(-20deg, #801bf2 0%, #1BAB9C 100%) border-box',
        border: '1px solid transparent',
        borderRadius: '5px',
        padding: '10px 15px',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
        color: '#ffffff',
    },
}))(MaterialTooltip);

export default MyPositions;
