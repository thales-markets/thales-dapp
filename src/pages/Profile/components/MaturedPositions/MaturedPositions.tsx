import Currency from 'components/Currency/v2';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import { USD_SIGN } from 'constants/currency';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import Card from '../styled-components/Card';
import Table from 'components/TableV2';
import { formatShortDate } from 'utils/formatters/date';
import { LoaderContainer, NoDataContainer, NoDataText } from '../../../../theme/common';
import SimpleLoader from '../../../../components/SimpleLoader';
import { TFunction } from 'i18next';

type MaturedPositionsProps = {
    claimed: any[];
    positions: UsersAssets[];
    isSimpleView?: boolean;
    searchText: string;
    isLoading?: boolean;
};

const MaturedPositions: React.FC<MaturedPositionsProps> = ({
    positions,
    isSimpleView,
    claimed,
    searchText,
    isLoading,
}) => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        const newArray: any = [];

        if (claimed.length > 0) {
            claimed.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.balances = {};
                modifiedValue.balances.amount = value.tx.amount;
                modifiedValue.balances.type = value.tx.side === 'short' ? 'DOWN' : 'UP';
                modifiedValue.claimable = false;
                modifiedValue.claimed = true;
                modifiedValue.link = buildOptionsMarketLink(value.tx.market);
                newArray.push(modifiedValue);
            });
        }

        if (positions.length > 0) {
            positions.map((value) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.claimed = false;
                if (value.balances.long > 0) {
                    const modifiedValue: any = JSON.parse(JSON.stringify(value));
                    modifiedValue.claimed = false;
                    modifiedValue.balances.amount = value.balances.long;
                    modifiedValue.balances.type = 'UP';
                    modifiedValue.claimable = value.market.result === 'long';
                    modifiedValue.link = buildOptionsMarketLink(value.market.address);
                    newArray.push(modifiedValue);
                }
                if (value.balances.short > 0) {
                    const newValue: any = JSON.parse(JSON.stringify(value));
                    newValue.balances.amount = value.balances.short;
                    newValue.balances.type = 'DOWN';
                    newValue.claimable = value.market.result === 'short';
                    newValue.link = buildOptionsMarketLink(value.market.address);
                    newArray.push(newValue);
                }
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
                            <SPAAnchor href={buildOptionsMarketLink(data.market.address)}>
                                <Card.Wrapper background={data.claimable} style={{ opacity: data.claimed ? 0.5 : 1 }}>
                                    <Card>
                                        <Card.Column style={{ flex: 1 }}>
                                            <Card.Section>
                                                <CurrencyIcon
                                                    width="40px"
                                                    height="40px"
                                                    currencyKey={data.market.currencyKey}
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
                                                    {t(`options.home.markets-table.strike-price-col`)}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                        </Card.Column>
                                        <Card.Column>
                                            <Card.Section>
                                                <Card.RowTitle>
                                                    {t(`options.home.markets-table.final-asset-price-col`)}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.market.finalPrice)}
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
                                                            data.market.strikePrice,
                                                            data.market.finalPrice
                                                        ).toFixed(2)}%`}
                                                    </PriceDifferenceInfo>
                                                </Card.RowSubtitle>
                                            </Card.Section>
                                        </Card.Column>
                                        <Card.Column>
                                            <Card.Section>
                                                <Card.RowTitle>
                                                    {t('options.leaderboard.trades.table.amount-col')}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {data.balances.amount.toFixed(2)}
                                                    <Icon
                                                        style={{
                                                            color: data.balances.type === 'UP' ? '#50CE99' : '#C3244A',
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
                                        spanStyle={{ float: 'left' }}
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
                            accessor: 'market.strikePrice',
                            Cell: (_props: any) => (
                                <TableText>{formatCurrencyWithSign(USD_SIGN, _props?.cell?.value, 2)}</TableText>
                            ),
                        },
                        {
                            Header: t(`options.home.markets-table.final-asset-price-col`),
                            accessor: (row: any) => {
                                return <TableText>{formatCurrencyWithSign(USD_SIGN, row.market.finalPrice)}</TableText>;
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
                                                color: row.balances.type === 'UP' ? '#50CE99' : '#C3244A',
                                                marginLeft: 6,
                                            }}
                                            className={`v2-icon v2-icon--${row.balances.type.toLowerCase()}`}
                                        ></Icon>
                                    </TableText>
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 15px;
    position: relative;
    min-height: 200px;
`;

const TableText = styled.span`
    font-family: Roboto !imporant;
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

export default MaturedPositions;
