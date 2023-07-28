import { USD_SIGN } from 'constants/currency';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { ColumnSpaceBetween, Text, TextLabel, TextValue } from '../../styled-components';
import { Positions } from 'enums/options';
import { getDefaultCollateral } from 'utils/currency';
import { secondsToHours, secondsToMilliseconds, secondsToMinutes } from 'date-fns';
import useInterval from 'hooks/useInterval';

type SpeedMarketsTrade = { address: string; strikePrice: number; positionType: Positions | undefined };

type TradingDetailsSentenceProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition | SpeedMarketsTrade;
    isRangedMarket: boolean;
    isFetchingQuote: boolean;
    priceProfit: number | string;
    paidAmount: number | string;
    breakFirstLine: boolean;
    deltaTimeSec?: number;
};

const TradingDetailsSentence: React.FC<TradingDetailsSentenceProps> = ({
    currencyKey,
    maturityDate,
    market,
    isRangedMarket,
    isFetchingQuote,
    priceProfit,
    paidAmount,
    breakFirstLine,
    deltaTimeSec,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [deltaDate, setDeltaDate] = useState(0);

    useEffect(() => {
        if (deltaTimeSec) {
            setDeltaDate(Date.now() + secondsToMilliseconds(deltaTimeSec));
        }
    }, [deltaTimeSec]);

    // Refresh datetime on every minute change
    useInterval(() => {
        if (deltaTimeSec) {
            const currentMinute = new Date().getMinutes();
            const maturityMinute = new Date(maturityDate).getMinutes() - secondsToMinutes(deltaTimeSec);

            if (currentMinute !== maturityMinute) {
                setDeltaDate(Date.now() + secondsToMilliseconds(deltaTimeSec));
            }
        }
    }, 5 * 1000);

    const potentialWinFormatted = isFetchingQuote
        ? '...'
        : `${formatCurrencyWithKey(getDefaultCollateral(networkId), (1 + Number(priceProfit)) * Number(paidAmount))}`;

    const positionTypeFormatted =
        market.positionType === Positions.UP
            ? t('common.above')
            : market.positionType === Positions.DOWN
            ? t('common.below')
            : market.positionType === Positions.IN
            ? t('common.between')
            : market.positionType === Positions.OUT
            ? t('common.not-between')
            : '';

    const deltaTimeFormatted = deltaTimeSec
        ? `${secondsToHours(deltaTimeSec) !== 0 ? secondsToHours(deltaTimeSec) : secondsToMinutes(deltaTimeSec)} ${
              secondsToHours(deltaTimeSec) !== 0
                  ? secondsToHours(deltaTimeSec) === 1
                      ? t('common.time-remaining.hour')
                      : t('common.time-remaining.hours')
                  : t('common.time-remaining.minutes')
          } (${formatShortDateWithTime(deltaDate)})`
        : '';

    const timeFormatted = deltaTimeSec
        ? deltaTimeFormatted
        : maturityDate
        ? formatShortDateWithTime(maturityDate)
        : `( ${t('markets.amm-trading.choose-time')} )`;

    return (
        <ColumnSpaceBetween>
            <FlexDivCentered>
                <Text>
                    <TextLabel>{t('markets.amm-trading.asset-price', { asset: currencyKey })}</TextLabel>
                    {market.address ? (
                        <>
                            <SentanceTextValue uppercase={!!positionTypeFormatted} lowercase={!positionTypeFormatted}>
                                {positionTypeFormatted
                                    ? positionTypeFormatted
                                    : `( ${t('markets.amm-trading.choose-direction')} )`}
                            </SentanceTextValue>
                            {isRangedMarket ? (
                                !breakFirstLine && (
                                    <>
                                        <SentanceTextValue>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                (market as RangedMarketPerPosition).leftPrice
                                            )}
                                        </SentanceTextValue>
                                        <Text>
                                            <TextLabel>{' ' + t('common.and')}</TextLabel>
                                        </Text>
                                        <SentanceTextValue>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                (market as RangedMarketPerPosition).rightPrice
                                            )}
                                        </SentanceTextValue>
                                    </>
                                )
                            ) : (
                                <SentanceTextValue>
                                    {formatCurrencyWithSign(USD_SIGN, (market as MarketInfo).strikePrice)}
                                </SentanceTextValue>
                            )}
                        </>
                    ) : (
                        <SentanceTextValue>{'( ' + t('markets.amm-trading.pick-price') + ' )'}</SentanceTextValue>
                    )}
                </Text>
            </FlexDivCentered>
            {breakFirstLine && isRangedMarket && market.address && (
                <FlexDivCentered>
                    <Text>
                        <SentanceTextValue>
                            {formatCurrencyWithSign(USD_SIGN, (market as RangedMarketPerPosition).leftPrice)}
                        </SentanceTextValue>
                        <Text>
                            <TextLabel>{' ' + t('common.and')}</TextLabel>
                        </Text>
                        <SentanceTextValue>
                            {formatCurrencyWithSign(USD_SIGN, (market as RangedMarketPerPosition).rightPrice)}
                        </SentanceTextValue>
                    </Text>
                </FlexDivCentered>
            )}
            <FlexDivCentered>
                <Text>
                    <TextLabel>{deltaTimeSec ? t('common.in') : t('common.on')}</TextLabel>
                    <SentanceTextValue lowercase>{timeFormatted}</SentanceTextValue>
                </Text>
            </FlexDivCentered>
            <FlexDivCentered>
                <Text>
                    <TextLabel>{t('markets.amm-trading.you-win')}</TextLabel>
                    <SentanceTextValue isProfit={true}>
                        {Number(priceProfit) > 0 && Number(paidAmount) > 0
                            ? potentialWinFormatted
                            : '( ' + t('markets.amm-trading.based-amount') + ' )'}
                    </SentanceTextValue>
                </Text>
            </FlexDivCentered>
        </ColumnSpaceBetween>
    );
};

const SentanceTextValue = styled(TextValue)`
    padding-left: 5px;
`;

export default TradingDetailsSentence;
