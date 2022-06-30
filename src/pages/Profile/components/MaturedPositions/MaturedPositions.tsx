import Currency from 'components/Currency/v2';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import { USD_SIGN } from 'constants/currency';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import {
    formatCurrencyWithSign,
    formatCurrencyWithSignInRange,
    getPercentageDifference,
} from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import Card from '../styled-components/Card';
import Table from 'components/TableV2';
import { formatShortDate } from 'utils/formatters/date';
import { LoaderContainer, NoDataContainer, NoDataText } from 'theme/common';
import SimpleLoader from 'components/SimpleLoader';
import { TFunction } from 'i18next';
import RangeIllustration from 'components/RangeIllustration';
import { UI_COLORS } from 'constants/ui';

type MaturedPositionsProps = {
    claimed: any[];
    claimedRange: any[];
    positions: UsersAssets[];
    isSimpleView?: boolean;
    searchText: string;
    isLoading?: boolean;
    rangedPositions: any[];
};

const MaturedPositions: React.FC<MaturedPositionsProps> = ({
    positions,
    isSimpleView,
    claimed,
    searchText,
    isLoading,
    rangedPositions,
    claimedRange,
}) => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        const newArray: any = [];

        if (claimed.length > 0) {
            claimed.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.range = false;
                modifiedValue.balances = {};
                modifiedValue.balances.amount = value.tx.amount;
                modifiedValue.balances.type = value.tx.side === 'short' ? 'DOWN' : 'UP';
                modifiedValue.claimable = false;
                modifiedValue.claimed = true;
                modifiedValue.link = buildOptionsMarketLink(value.tx.market);
                newArray.push(modifiedValue);
            });
        }
        if (claimedRange.length > 0) {
            claimedRange.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.range = true;
                modifiedValue.balances = {};
                modifiedValue.balances.amount = value.tx.amount;
                modifiedValue.balances.type = value.tx.side === 'in' ? 'IN' : 'OUT';
                modifiedValue.claimable = false;
                modifiedValue.claimed = true;
                modifiedValue.link = buildRangeMarketLink(value.tx.market);
                newArray.push(modifiedValue);
            });
        }

        if (positions.length > 0) {
            positions.map((value: any) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.link = buildOptionsMarketLink(value.market.id);
                modifiedValue.range = false;
                newArray.push(modifiedValue);
            });
        }

        if (rangedPositions.length > 0) {
            rangedPositions.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.balances.priceDiff = 0;
                modifiedValue.link = buildRangeMarketLink(value.market.id);
                modifiedValue.market.strikePrice = { left: value.market.leftPrice, right: value.market.rightPrice };
                modifiedValue.range = true;
                newArray.push(modifiedValue);
            });
        }

        return newArray.sort((a: any) => (a.claimable ? -1 : 1));
    }, [positions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter((value: any) => {
            return value.market.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
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
                isSimpleView &&
                filteredData.length > 0 &&
                filteredData.map((data: any, index: number) => (
                    <Content key={index}>
                        {data.balances.amount > 0 && (
                            <SPAAnchor href={data.link}>
                                <Card.Wrapper background={data.claimable} style={{ opacity: data.claimed ? 0.5 : 1 }}>
                                    <Card>
                                        <Card.Column style={{ flex: 1 }}>
                                            <Card.Section>
                                                <CurrencyIcon
                                                    width="40px"
                                                    height="40px"
                                                    currencyKey={data.market.currencyKey}
                                                    iconType={!data.range ? 0 : data.balances.type === 'IN' ? 1 : 2}
                                                />
                                                <Card.RowSubtitle>{data.market.currencyKey}</Card.RowSubtitle>
                                            </Card.Section>
                                        </Card.Column>
                                        <Card.Column>
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
                                                    {t(`options.home.markets-table.final-asset-price-col`)}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.market.finalPrice)}
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                        </Card.Column>
                                        {data.range ? (
                                            <MiddleContrainer>
                                                <RangeIllustration
                                                    priceData={{
                                                        left: data.market.leftPrice,
                                                        right: data.market.rightPrice,
                                                        current: data.market.finalPrice,
                                                    }}
                                                    fontSize={24}
                                                    maxWidth={65}
                                                />
                                            </MiddleContrainer>
                                        ) : (
                                            <Card.Column>
                                                <Card.Section>
                                                    <Card.RowTitle>
                                                        {t(`options.home.markets-table.strike-price-col`)}
                                                    </Card.RowTitle>
                                                    <Card.RowSubtitle>
                                                        {formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}
                                                    </Card.RowSubtitle>
                                                </Card.Section>
                                                <Card.Section>
                                                    <Card.RowTitle>
                                                        {t('options.home.market-card.price-difference')}
                                                    </Card.RowTitle>
                                                    <Card.RowSubtitle>
                                                        <PriceDifferenceInfo
                                                            priceDiff={data.market.strikePrice < data.market.finalPrice}
                                                        >
                                                            {`${getPercentageDifference(
                                                                data.market.finalPrice,
                                                                data.market.strikePrice
                                                            ).toFixed(2)}%`}
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
                                                    {t(`options.home.markets-table.status-col`)}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {getIconOrText(data.claimable, data.claimed, t)}
                                                </Card.RowSubtitle>
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
                            Header: <>{t('options.home.markets-table.asset-col')}</>,
                            accessor: 'market.currencyKey',
                            Cell: (_props: any) => {
                                return (
                                    <Currency.Name
                                        currencyKey={_props?.cell?.value}
                                        showIcon={true}
                                        iconProps={{ type: 'asset' }}
                                        synthIconStyle={{ width: 32, height: 32 }}
                                        spanStyle={{ width: 60 }}
                                        hideAssetName={true}
                                    />
                                );
                            },
                            sortable: true,
                        },
                        {
                            Header: t(`options.home.markets-table.maturity-date-col`),
                            accessor: (row: any) => <TableText>{formatShortDate(row.market.maturityDate)}</TableText>,
                            disableSortBy: true,
                        },
                        {
                            Header: t(`options.home.markets-table.strike-price-col`),
                            accessor: (row: any) => {
                                return (
                                    <TableText>
                                        {row.range
                                            ? formatCurrencyWithSignInRange(
                                                  USD_SIGN,
                                                  row.market.strikePrice.left,
                                                  row.market.strikePrice.right,
                                                  2
                                              )
                                            : formatCurrencyWithSign(USD_SIGN, row.market.strikePrice, 2)}
                                    </TableText>
                                );
                            },
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstPrice =
                                    firstElem.original.market.strikePrice?.left ||
                                    firstElem.original.market.strikePrice;
                                const secondPrice =
                                    secondElem.original.market.strikePrice?.left ||
                                    secondElem.original.market.strikePrice;

                                if (firstPrice > secondPrice) {
                                    return 1;
                                }
                                if (firstPrice < secondPrice) {
                                    return -1;
                                }
                                return 0;
                            },
                        },
                        {
                            Header: t(`options.home.markets-table.final-asset-price-col`),
                            accessor: (row: any) => {
                                return <TableText>{formatCurrencyWithSign(USD_SIGN, row.market.finalPrice)}</TableText>;
                            },
                            sortType: (firstElem: any, secondElem: any) => {
                                if (firstElem.original.market.finalPrice > secondElem.original.market.finalPrice)
                                    return 1;
                                if (firstElem.original.market.finalPrice < secondElem.original.market.finalPrice)
                                    return -1;
                                return 0;
                            },
                        },
                        {
                            Header: t(`options.home.markets-table.status-col`),
                            accessor: (row: any) => (
                                <TableText>{getIconOrText(row.claimable, row.claimed, t)}</TableText>
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
                            sortType: (firstElem: any, secondElem: any) => {
                                if (firstElem.original.balances.amount > secondElem.original.balances.amount) return 1;
                                if (firstElem.original.balances.amount < secondElem.original.balances.amount) return -1;
                                return 0;
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

const getIconOrText = (claimable: boolean, claimed: boolean, t: TFunction) => {
    if (claimable) {
        return (
            <span>
                {t('options.home.market-card.claim')}
                <Icon style={{ color: '#50CE99' }} className="v2-icon v2-icon--dollar"></Icon>
            </span>
        );
    }
    if (claimed) {
        return <span style={{ color: '#8208FC' }}>{t('options.home.market-card.claimed')}</span>;
    } else {
        return (
            <span>
                {t('options.home.market-card.rip')}
                <Icon style={{ color: '#C3244A' }} className="v2-icon v2-icon--rip"></Icon>
            </span>
        );
    }
};

const Content = styled.div`
    display: content;
`;

const MiddleContrainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: 10px;
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
    margin-left: 6px;
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

export default MaturedPositions;
