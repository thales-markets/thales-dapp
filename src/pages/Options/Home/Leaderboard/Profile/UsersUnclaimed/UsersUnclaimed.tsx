import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import { DisplayContentsAnchor } from 'pages/Options/Home/MarketsTable/components';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import React, { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Image, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import { COLORS } from 'constants/ui';
import { ethers } from 'ethers';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { OptionsMarketInfo } from 'types/options';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import { bigNumberFormatter } from 'utils/formatters/ethers';

type UsersUnclaimedProps = {
    usersUnclaimed: any[];
    market: any;
    userDisplay: boolean;
};

const getCellColor = (type: string) => {
    switch (type) {
        case 'long':
            return COLORS.LONG;
        case 'short':
            return COLORS.SHORT;
        default:
            return COLORS.WHITE;
    }
};

const UsersUnclaimed: React.FC<UsersUnclaimedProps> = ({ usersUnclaimed, market, userDisplay }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [optionsMarket, setOptionsMarket] = useState<OptionsMarketInfo | null>(null);

    console.log(usersUnclaimed);

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
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.strike-price')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.pool-size')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.maturity-date')}
                    </Text>
                </Row>
                <Row className="text-profile-data">
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}> {formatShortDate(market.maturityDate)}</Text>
                </Row>

                <Row className="text-ms leaderboard__profile__rowBackground__columns" style={{ borderBottom: 'none' }}>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.result')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {market.result === 'long'
                            ? t('options.leaderboard.profile.common.long')
                            : t('options.leaderboard.profile.common.short')}
                    </Text>
                </Row>
                <Row className="text-profile-data" style={{ paddingBottom: 16 }}>
                    <Text style={{ flex: 1, color: getCellColor(market.result) }}>{market.result.toUpperCase()}</Text>
                    <Text style={{ flex: 1, paddingLeft: 16 }}>
                        {market.result === 'long'
                            ? formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].long)
                            : formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].short)}
                    </Text>
                    <FlexDivColumnCentered style={{ flex: 1, alignItems: 'baseline', paddingRight: 35 }}>
                        <Button className="primary" style={{ display: !userDisplay ? 'none' : '' }}>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href={buildOptionsMarketLink(market.address)}
                                style={{ color: 'white', verticalAlign: 'top' }}
                            >
                                {t('options.leaderboard.profile.unclaimed.redeem')}
                            </a>
                        </Button>
                    </FlexDivColumnCentered>
                </Row>
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

export default UsersUnclaimed;
