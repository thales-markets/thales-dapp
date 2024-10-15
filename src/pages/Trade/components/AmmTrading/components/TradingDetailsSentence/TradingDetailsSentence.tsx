import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId } from 'redux/modules/wallet';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { formatCurrencyWithKey, formatCurrencyWithSign, formatShortDateWithTime } from 'thales-utils';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { RootState } from 'types/ui';
import { getDefaultCollateral } from 'utils/currency';
import { ColumnSpaceBetween, Text, TextLabel, TextValue } from '../../styled-components';

type TradingDetailsSentenceProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition;
    isRangedMarket: boolean;
    isFetchingQuote: boolean;
    priceProfit: number | string;
    paidAmount: number | string;
    breakFirstLine: boolean;
    isDeprecatedCurrency: boolean;
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
    isDeprecatedCurrency,
}) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const potentialWinFormatted = isFetchingQuote
        ? '...'
        : `${formatCurrencyWithKey(
              getDefaultCollateral(networkId, isDeprecatedCurrency),
              (1 + Number(priceProfit)) * Number(paidAmount)
          )}`;

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

    const timeFormatted = maturityDate
        ? formatShortDateWithTime(maturityDate)
        : `( ${t('markets.amm-trading.choose-time')} )`;

    return (
        <ColumnSpaceBetween>
            <FlexDivCentered>
                <Text>
                    <TextLabel>
                        {t('markets.amm-trading.asset-price', {
                            asset: currencyKey,
                        })}
                    </TextLabel>
                    {market.address ? (
                        <>
                            {!isMobile && (
                                <SentanceTextValue
                                    uppercase={!!positionTypeFormatted}
                                    lowercase={!positionTypeFormatted}
                                >
                                    {positionTypeFormatted
                                        ? positionTypeFormatted
                                        : `( ${t('markets.amm-trading.choose-direction')} )`}
                                </SentanceTextValue>
                            )}
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
                    <TextLabel>{t('common.on')}</TextLabel>
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
