import Currency from 'components/Currency/v2';
import CurrencyIcon, { IconType } from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import { USD_SIGN } from 'constants/currency';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UsersAssets } from 'types/options';
import {
    formatCurrencyWithSign,
    formatCurrencyWithSignInRange,
    getPercentageDifference,
} from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import Table from 'components/TableV2';
import { formatShortDate } from 'utils/formatters/date';
import { LoaderContainer } from 'theme/common';
import { TFunction } from 'i18next';
import RangeIllustration from 'components/RangeIllustration';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import {
    Card,
    CardColumn,
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
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import { Positions } from 'constants/options';

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
    const theme: ThemeInterface = useTheme();

    const data = useMemo(() => {
        const newArray: any = [];

        if (claimed.length > 0) {
            claimed.map((value: any) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.range = false;
                modifiedValue.balances = {};
                modifiedValue.balances.amount = value.tx.amount;
                modifiedValue.balances.type = value.tx.side === 'short' ? Positions.DOWN : Positions.UP;
                modifiedValue.claimable = false;
                modifiedValue.claimed = true;
                modifiedValue.link = buildOptionsMarketLink(value.tx.market);
                newArray.push(modifiedValue);
            });
        }
        if (claimedRange.length > 0) {
            claimedRange.map((value: any) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.range = true;
                modifiedValue.balances = {};
                modifiedValue.balances.amount = value.tx.amount;
                modifiedValue.balances.type = value.tx.side === 'in' ? Positions.IN : Positions.OUT;
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
            rangedPositions.map((value: any) => {
                const modifiedValue: any = JSON.parse(JSON.stringify(value));
                modifiedValue.balances.priceDiff = 0;
                modifiedValue.link = buildRangeMarketLink(value.market.id);
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
                                <CardWrapper background={data.claimable} style={{ opacity: data.claimed ? 0.5 : 1 }}>
                                    <Card>
                                        <CardColumn style={{ flex: 1 }}>
                                            <CardSection>
                                                <CurrencyIcon
                                                    width="40px"
                                                    height="40px"
                                                    currencyKey={data.market.currencyKey}
                                                    iconType={
                                                        !data.range
                                                            ? IconType.NORMAL
                                                            : data.balances.type === Positions.IN
                                                            ? IconType.IN
                                                            : IconType.OUT
                                                    }
                                                />
                                                <CardRowSubtitle>{data.market.currencyKey}</CardRowSubtitle>
                                            </CardSection>
                                        </CardColumn>
                                        <CardColumn>
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
                                                    {t(`options.home.markets-table.final-asset-price-col`)}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.market.finalPrice)}
                                                </CardRowSubtitle>
                                            </CardSection>
                                        </CardColumn>
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
                                            <CardColumn>
                                                <CardSection>
                                                    <CardRowTitle>
                                                        {t(`options.home.markets-table.strike-price-col`)}
                                                    </CardRowTitle>
                                                    <CardRowSubtitle>
                                                        {formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}
                                                    </CardRowSubtitle>
                                                </CardSection>
                                                <CardSection>
                                                    <CardRowTitle>
                                                        {t('options.home.market-card.price-difference')}
                                                    </CardRowTitle>
                                                    <CardRowSubtitle>
                                                        <PriceDifferenceInfo
                                                            priceDiff={data.market.strikePrice < data.market.finalPrice}
                                                        >
                                                            {`${getPercentageDifference(
                                                                data.market.finalPrice,
                                                                data.market.strikePrice
                                                            ).toFixed(2)}%`}
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
                                                    {t(`options.home.markets-table.status-col`)}
                                                </CardRowTitle>
                                                <CardRowSubtitle>
                                                    {getIconOrText(data.claimable, data.claimed, t, theme)}
                                                </CardRowSubtitle>
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
                            accessor: 'market.currencyKey',
                            Cell: (props: any) => (
                                <Currency.Name
                                    currencyKey={props.cell.value}
                                    showIcon={true}
                                    iconProps={{ type: 'asset' }}
                                    synthIconStyle={{ width: 32, height: 32 }}
                                    spanStyle={{ width: 60 }}
                                    hideAssetName={true}
                                />
                            ),
                            sortable: true,
                        },
                        {
                            Header: <>{t(`options.home.markets-table.maturity-date-col`)}</>,
                            accessor: 'market.maturityDate',
                            Cell: (props: any) => <TableText>{formatShortDate(props.cell.value)}</TableText>,
                        },
                        {
                            Header: <>{t(`options.home.markets-table.strike-price-col`)}</>,
                            accessor: 'range',
                            Cell: (props: any) => (
                                <TableText>
                                    {props.cell.value
                                        ? formatCurrencyWithSignInRange(
                                              USD_SIGN,
                                              props.row.original.market.leftPrice,
                                              props.row.original.market.rightPrice,
                                              2
                                          )
                                        : formatCurrencyWithSign(USD_SIGN, props.row.original.market.strikePrice, 2)}
                                </TableText>
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                const firstPrice =
                                    firstElem.original.market.leftPrice || firstElem.original.market.strikePrice;
                                const secondPrice =
                                    secondElem.original.market.leftPrice || secondElem.original.market.strikePrice;

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
                            Header: <>{t(`options.home.markets-table.final-asset-price-col`)}</>,
                            accessor: 'market.finalPrice',
                            Cell: (props: any) => (
                                <TableText>{formatCurrencyWithSign(USD_SIGN, props.cell.value)}</TableText>
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                if (firstElem.original.market.finalPrice > secondElem.original.market.finalPrice)
                                    return 1;
                                if (firstElem.original.market.finalPrice < secondElem.original.market.finalPrice)
                                    return -1;
                                return 0;
                            },
                        },
                        {
                            Header: <>{t(`options.home.markets-table.status-col`)}</>,
                            accessor: 'claimable',
                            Cell: (props: any) => (
                                <TableText>
                                    {getIconOrText(props.cell.value, props.row.original.claimed, t, theme)}
                                </TableText>
                            ),
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
                                        color={getColor(props.row.original, theme)}
                                        className={`v2-icon v2-icon--${props.row.original.balances.type.toLowerCase()}`}
                                    ></Icon>
                                </TableText>
                            ),
                            sortable: true,
                            sortType: (firstElem: any, secondElem: any) => {
                                if (firstElem.original.balances.amount > secondElem.original.balances.amount) return 1;
                                if (firstElem.original.balances.amount < secondElem.original.balances.amount) return -1;
                                return 0;
                            },
                        },
                    ]}
                />
            )}
        </Container>
    );
};

const getIconOrText = (claimable: boolean, claimed: boolean, t: TFunction, theme: ThemeInterface) => {
    if (claimable) {
        return (
            <span>
                {t('options.home.market-card.claim')}
                <Icon color={theme.textColor.quaternary} margin="0 0 0 6px" className="v2-icon v2-icon--dollar"></Icon>
            </span>
        );
    }
    if (claimed) {
        return <span style={{ color: theme.textColor.tertiary }}>{t('options.home.market-card.claimed')}</span>;
    } else {
        return (
            <span>
                {t('options.home.market-card.rip')}
                <Icon color={theme.textColor.tertiary} margin="0 0 0 6px" className="v2-icon v2-icon--rip"></Icon>
            </span>
        );
    }
};

export default MaturedPositions;
