import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, FlexDiv, FlexDivColumnCentered, Text, Image } from 'theme/common';
import { OptionSide, OptionsMarketInfo } from 'types/options';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import ReactCountryFlag from 'react-country-flag';
import { DisplayContentsAnchor } from 'pages/Options/Home/MarketsTable/components';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import { buildOptionsMarketLink } from 'utils/routes';
import { COLORS } from 'constants/ui';
import { ethers } from 'ethers';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import { bigNumberFormatter } from 'utils/formatters/ethers';

type UsersTradesProps = {
    usersTrades: UserTrade[];
    market: any;
};

const getCellColor = (type: string) => {
    switch (type) {
        case 'buy':
            return COLORS.BUY;
        case 'sell':
            return COLORS.SELL;
        default:
            return COLORS.WHITE;
    }
};

const UsersTrades: React.FC<UsersTradesProps> = ({ usersTrades, market }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [showAll, setShowAll] = useState<boolean>(false);
    const [optionsMarket, setOptionsMarket] = useState<OptionsMarketInfo | null>(null);

    const marketQuery = useBinaryOptionsMarketQuery(market.address, {
        enabled: isAppReady,
    });

    useEffect(() => {
        const fetchMarketData = async () => {
            if (marketQuery.isSuccess && marketQuery.data) {
                if (marketQuery.data.customMarket) {
                    try {
                        const sportFeedContract = new ethers.Contract(
                            marketQuery.data.oracleAdress,
                            sportFeedOracleContract.abi,
                            (snxJSConnector as any).provider
                        );
                        const data: any = await Promise.all([
                            sportFeedContract.targetName(),
                            sportFeedContract.eventName(),
                            sportFeedContract.targetOutcome(),
                        ]);
                        setOptionsMarket({
                            ...marketQuery.data,
                            country: data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0],
                            eventName: data[1],
                            outcome: data[2],
                        });
                    } catch (e) {
                        const sportFeedContract = new ethers.Contract(
                            marketQuery.data.oracleAdress,
                            ethBurnedOracleInstance.abi,
                            (snxJSConnector as any).provider
                        );
                        const data: any = await Promise.all([
                            sportFeedContract.targetName(),
                            sportFeedContract.eventName(),
                            sportFeedContract.targetOutcome(),
                        ]);
                        setOptionsMarket({
                            ...marketQuery.data,
                            country: data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0],
                            eventName: data[1],
                            outcome:
                                data[1] === 'Flippening Markets' || data[1] === 'ETH/BTC market cap ratio'
                                    ? bigNumberFormatter(data[2]).toString()
                                    : Number(data[2]).toString(),
                        });
                    }
                } else {
                    setOptionsMarket(marketQuery.data);
                }
            }
        };
        fetchMarketData();
    }, [marketQuery.isSuccess]);

    return (
        <FlexDiv className="leaderboard__profile__rowBorder">
            <FlexDivColumnCentered className="leaderboard__profile__rowBackground leaderboard__profile__rowBackground--left">
                <DisplayContentsAnchor
                    style={{
                        pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                    }}
                    href={buildOptionsMarketLink(market.address)}
                >
                    {market.customMarket ? (
                        <>
                            {countryToCountryCode(optionsMarket?.country as string) && (
                                <ReactCountryFlag
                                    countryCode={countryToCountryCode(optionsMarket?.country as string)}
                                    style={{ width: 50, height: 50, marginRight: 0, marginLeft: 32 }}
                                    svg
                                />
                            )}
                            {!countryToCountryCode(optionsMarket?.country as string) && (
                                <CustomIcon
                                    style={{ marginLeft: 32 }}
                                    src={eventToIcon(optionsMarket?.eventName as string)}
                                ></CustomIcon>
                            )}
                            {market.country}
                        </>
                    ) : (
                        <>
                            <CurrencyIcon
                                currencyKey={market.currencyKey}
                                synthIconStyle={{ width: 50, height: 50, marginRight: 0, marginLeft: 32 }}
                            />
                            <CryptoName style={{ marginTop: 8, marginLeft: 32 }}>
                                {getSynthName(market.currencyKey)}
                            </CryptoName>
                            <CryptoKey style={{ marginLeft: 32 }}>{optionsMarket?.asset}</CryptoKey>
                        </>
                    )}
                </DisplayContentsAnchor>
            </FlexDivColumnCentered>
            <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground leaderboard__profile__rowBackground--right">
                <Row>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.markets.strike-price')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.markets.pool-size')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.maturity-date')}
                    </Text>
                </Row>
                <Row className="text-profile-data">
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}>{formatShortDate(market.maturityDate)}</Text>
                </Row>
                <Row className="text-ms leaderboard__profile__rowBackground__columns">
                    <Text className="bold" style={{ flex: 1.33 }}>
                        {t('options.leaderboard.profile.trades.type')}
                    </Text>
                    <Text className="bold" style={{ flex: 1.33 }}>
                        {t('options.leaderboard.profile.common.amount')}
                    </Text>
                    <Text className="bold" style={{ flex: 1.33 }}>
                        {t('options.leaderboard.profile.trades.price')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.common.timestamp')}
                    </Text>
                </Row>
                {!showAll && (
                    <Row className="text-profile-data" style={usersTrades.length === 1 ? { paddingBottom: 16 } : {}}>
                        <Text style={{ flex: 1.33, color: getCellColor(usersTrades[0].type) }}>
                            {t(`options.leaderboard.profile.common.${usersTrades[0].type}`)}
                        </Text>
                        <Text style={{ flex: 1.33 }}>
                            {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[usersTrades[0].side], usersTrades[0].amount)}
                        </Text>
                        <Text style={{ flex: 1.33 }}>
                            {formatCurrencyWithKey(SYNTHS_MAP.sUSD, usersTrades[0].price)}
                        </Text>
                        <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(usersTrades[0].timestamp))}</Text>
                    </Row>
                )}
                <RowScrollable>
                    {showAll &&
                        usersTrades?.map((trade, index) => (
                            <Row className="text-profile-data" key={index} style={{ width: '105.3%' }}>
                                <Text style={{ flex: 1.33, color: getCellColor(trade.type) }}>
                                    {t(`options.leaderboard.profile.common.${trade.type}`)}
                                </Text>
                                <Text style={{ flex: 1.33 }}>
                                    {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[trade.side], trade.amount)}
                                </Text>
                                <Text style={{ flex: 1.33 }}>
                                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, trade.price)}
                                </Text>
                                <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(trade.timestamp))}</Text>
                            </Row>
                        ))}
                </RowScrollable>
                {usersTrades.length > 1 && (
                    <Row>
                        <Text style={{ flex: 3 }}></Text>
                        <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground__buttonContainer">
                            <Button
                                className="primary"
                                style={{ background: 'transparent', padding: '24px 35px' }}
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll
                                    ? t('options.leaderboard.profile.common.view-less')
                                    : t('options.leaderboard.profile.common.view-more')}
                            </Button>
                        </FlexDivColumnCentered>

                        <Text style={{ flex: 4 }}></Text>
                    </Row>
                )}
            </FlexDivColumnCentered>
        </FlexDiv>
    );
};

export const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: #808191;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    line-height: 16px;
    font-weight: 600;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
`;

export const RowScrollable = styled(FlexDiv)`
    flex-direction: column;
    overflow-x: hidden;
    max-height: 245px;
    max-width: 95%;
    ::-webkit-scrollbar {
        width: 5px;
    }
`;

export const CustomIcon = styled(Image)`
    margin-right: 0px;
    width: 100px;
    height: 100px;
`;

interface UserTrade {
    amount: number;
    hash: string;
    price: number;
    side: OptionSide;
    timestamp: string;
    type: string;
}

export default UsersTrades;
