import CurrencyIcon, { IconType } from 'components/Currency/v2/CurrencyIcon';
import RangeIllustration from 'components/RangeIllustration';
import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { LoaderContainer } from 'styles/common';
import { UsersAssets } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
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
    getColor,
} from '../styled-components';

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
                                            <CardRowTitle>{t(`options.home.markets-table.status-col`)}</CardRowTitle>
                                            <CardRowSubtitle>
                                                {getIconOrText(data.claimable, data.claimed, t, theme)}
                                            </CardRowSubtitle>
                                        </CardSection>
                                    </CardColumn>
                                </Card>
                            </CardWrapper>
                        </SPAAnchor>
                    </Content>
                ))}
            {isLoading && isSimpleView && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </Container>
    );
};

export const getIconOrText = (claimable: boolean, claimed: boolean, t: TFunction, theme: ThemeInterface) => {
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

export const getColorPerPosition = (position: Positions, theme: ThemeInterface) => {
    switch (position) {
        case Positions.UP:
            return theme.positionColor.up;
        case Positions.DOWN:
            return theme.positionColor.down;
        case Positions.IN:
            return theme.positionColor.in;
        case Positions.OUT:
            return theme.positionColor.out;
        default:
            return theme.textColor.primary;
    }
};

export const getAmount = (amount: number | string, position: Positions, theme: ThemeInterface) => {
    return (
        <span>
            {amount} <span style={{ color: getColorPerPosition(position, theme) }}>{position}</span>
        </span>
    );
};

export default MaturedPositions;
